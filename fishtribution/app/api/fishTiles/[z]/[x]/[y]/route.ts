import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_ZOOM = 22;
const MIN_DATA_ZOOM = 7;
const EXTENT = 4096;
const BUFFER = 64;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const querySchema = z.object({
  taxon: z.array(z.uuid()).max(50),
  dateStart: z.iso.date().optional(),
  dateEnd: z.iso.date().optional(),
  timeStart: z.string().regex(TIME_PATTERN).optional(),
  timeEnd: z.string().regex(TIME_PATTERN).optional(),
});

let softDeletePromise: Promise<boolean> | undefined;

function hasSoftDeleteColumn(): Promise<boolean> {
  if (!softDeletePromise) {
    const sql = neon(process.env.DATABASE_URL!);
    softDeletePromise = sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'catches'
          AND column_name = 'deleted_at'
      ) AS present
    `.then(rows => Boolean(rows[0]?.present)).catch(error => {
      softDeletePromise = undefined;
      throw error;
    });
  }
  return softDeletePromise;
}

function readTileCoordinate(value: string): number | null {
  if (!/^(0|[1-9]\d{0,8})$/.test(value)) return null;
  const coordinate = Number(value);
  return Number.isSafeInteger(coordinate) ? coordinate : null;
}

function byteaToUint8Array(value: unknown): Uint8Array {
  if (value == null) return new Uint8Array();
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (typeof value === "string" && /^\\x(?:[0-9a-f]{2})*$/i.test(value)) {
    return Uint8Array.from(Buffer.from(value.slice(2), "hex"));
  }
  if (typeof value === "string" && /^(?:[0-9a-f]{2})*$/i.test(value)) {
    return Uint8Array.from(Buffer.from(value, "hex"));
  }
  if (typeof value === "object" && value !== null && "data" in value) {
    const data = (value as { data: unknown }).data;
    if (Array.isArray(data) && data.every(item => Number.isInteger(item) && item >= 0 && item <= 255)) {
      return Uint8Array.from(data);
    }
  }
  throw new Error("Unexpected vector tile payload from database");
}

const cacheHeaders = {
  "Cache-Control": "public, max-age=60, s-maxage=60",
};

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/fishTiles/[z]/[x]/[y]">
) {
  const routeParams = await context.params;
  const z = readTileCoordinate(routeParams.z);
  const x = readTileCoordinate(routeParams.x);
  const y = readTileCoordinate(routeParams.y);

  if (z === null || x === null || y === null || z > MAX_ZOOM || x >= 2 ** z || y >= 2 ** z) {
    return Response.json({ error: "Invalid tile coordinates" }, { status: 400 });
  }

  const allowedKeys = new Set(["taxon", "dateStart", "dateEnd", "timeStart", "timeEnd"]);
  const params = request.nextUrl.searchParams;
  if ([...params.keys()].some(key => !allowedKeys.has(key))) {
    return Response.json({ error: "Unsupported filter parameter" }, { status: 400 });
  }

  const parsed = querySchema.safeParse({
    taxon: params.getAll("taxon"),
    dateStart: params.get("dateStart") ?? undefined,
    dateEnd: params.get("dateEnd") ?? undefined,
    timeStart: params.get("timeStart") ?? undefined,
    timeEnd: params.get("timeEnd") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json({ error: "Invalid map filters" }, { status: 400 });
  }

  const filters = parsed.data;
  if (filters.dateStart && filters.dateEnd && filters.dateEnd < filters.dateStart) {
    return Response.json({ error: "End date precedes start date" }, { status: 400 });
  }

  if (z < MIN_DATA_ZOOM) {
    return new Response(null, { status: 204, headers: cacheHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured" }, { status: 503 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const softDeleteEnabled = await hasSoftDeleteColumn();
    const values: Array<string | number> = [z, x, y];
    const conditions = [
      "c.pos IS NOT NULL",
      "ST_Intersects(c.pos, bounds.geography_bounds)",
    ];

    if (softDeleteEnabled) conditions.push("c.deleted_at IS NULL");
    if (filters.taxon.length > 0) {
      values.push(filters.taxon.join(","));
      conditions.push(`c.taxon_id::text = ANY(string_to_array($${values.length}::text, ','))`);
    }
    if (filters.dateStart) {
      values.push(filters.dateStart);
      conditions.push(`(c.caught_at AT TIME ZONE 'America/Detroit')::date >= $${values.length}::date`);
    }
    if (filters.dateEnd) {
      values.push(filters.dateEnd);
      conditions.push(`(c.caught_at AT TIME ZONE 'America/Detroit')::date <= $${values.length}::date`);
    }
    if (filters.timeStart && filters.timeEnd) {
      values.push(filters.timeStart, filters.timeEnd);
      const start = `$${values.length - 1}::time`;
      const end = `$${values.length}::time`;
      const caughtTime = "(c.caught_at AT TIME ZONE 'America/Detroit')::time";
      if (filters.timeStart <= filters.timeEnd) {
        conditions.push(`${caughtTime} BETWEEN ${start} AND ${end}`);
      } else {
        conditions.push(`(${caughtTime} >= ${start} OR ${caughtTime} <= ${end})`);
      }
    } else if (filters.timeStart) {
      values.push(filters.timeStart);
      conditions.push(`(c.caught_at AT TIME ZONE 'America/Detroit')::time >= $${values.length}::time`);
    } else if (filters.timeEnd) {
      values.push(filters.timeEnd);
      conditions.push(`(c.caught_at AT TIME ZONE 'America/Detroit')::time <= $${values.length}::time`);
    }

    const rows = await sql.query(`
      WITH bounds AS (
        SELECT
          ST_TileEnvelope($1::integer, $2::integer, $3::integer) AS tile_bounds,
          ST_Transform(
            ST_TileEnvelope($1::integer, $2::integer, $3::integer, margin => ${BUFFER}.0 / ${EXTENT}.0),
            4326
          )::geography AS geography_bounds
      ),
      features AS (
        SELECT
          ST_AsMVTGeom(
            ST_Transform(c.pos::geometry, 3857),
            bounds.tile_bounds,
            ${EXTENT},
            ${BUFFER}
          ) AS geom,
          c.catch_id::text AS catch_id,
          c.taxon_id::text AS taxon_id,
          to_char(c.caught_at AT TIME ZONE 'America/Detroit', 'YYYY-MM-DD HH24:MI') AS caught_at_local
        FROM catches AS c
        CROSS JOIN bounds
        WHERE ${conditions.join(" AND ")}
        ORDER BY c.caught_at DESC
        LIMIT 20000
      )
      SELECT COALESCE(ST_AsMVT(features.*, 'fish', ${EXTENT}, 'geom'), ''::bytea) AS tile
      FROM features
    `, values);

    const bytes = byteaToUint8Array(rows[0]?.tile);
    if (bytes.length === 0) {
      return new Response(null, { status: 204, headers: cacheHeaders });
    }

    const payload = new Uint8Array(bytes.length);
    payload.set(bytes);
    return new Response(payload.buffer, {
      status: 200,
      headers: {
        ...cacheHeaders,
        "Content-Type": "application/vnd.mapbox-vector-tile",
      },
    });
  } catch (error) {
    console.error("Fish tile request failed:", error);
    return Response.json({ error: "Unable to load fish map tiles" }, { status: 500 });
  }
}
