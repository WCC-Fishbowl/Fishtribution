import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured" }, { status: 503 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT
        taxon_id::text AS id,
        common_name,
        scientific_name
      FROM fish_taxa
      ORDER BY common_name ASC
      LIMIT 1000
    `;
    return Response.json({ species: rows }, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (error) {
    console.error("Fish species lookup failed:", error);
    return Response.json({ error: "Unable to load fish species" }, { status: 500 });
  }
}
