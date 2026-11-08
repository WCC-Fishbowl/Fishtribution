import { type NextRequest } from "next/server";
import { FISH_SPECIES, type FishType } from '@/lib/types/fishSpecies'
import * as z from "zod";
import { neon } from "@neondatabase/serverless";



const SearchParameterSchema = z.object({
    fish: z.union([z.array(z.literal(FISH_SPECIES)), z.literal(FISH_SPECIES)]).optional(),
    dateStart: z.iso.date().optional(),
    dateEnd: z.iso.date().optional(),
    timeStart: z.iso.time().optional(),
    timeEnd: z.iso.time().optional(),
    user: z.uuid().optional(),
})

type SearchParameterSchema = z.infer<typeof SearchParameterSchema>;

function paramsToObject(params: URLSearchParams): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = Object.create(null);

    for (const [key, value] of params.entries()) {
        const previous = result[key];

        if (previous === undefined) result[key] = value;
        else if (Array.isArray(previous)) previous.push(value);
        else result[key] = [previous, value];
    }

    return result;
}

/* async function runQuery(x: string, y: string, z: string): Promise<Buffer> {


    Buffer.from(query[0]['st_asmvt'])

    if (!query[0]['st_asmvt']) {
        return Buffer.alloc(1);
    }



    return query[0]['st_asmvt'];

} */

export async function GET(request: NextRequest, ctx: RouteContext<'/api/fishTiles/[z]/[x]/[y]'>) {
    const {z, x, y} = await ctx.params;
    const searchParameters = paramsToObject(request.nextUrl.searchParams);

    console.log(searchParameters);
    
    if (!SearchParameterSchema.validate(searchParameters))
        return Response.json({error: "malformed request"});

    const sql = neon(process.env.DATABASE_URL!);

    const query = await sql`
    WITH mvtgeom AS (
        SELECT ST_AsMVTGeom(
            ST_Transform(pos::geometry, 3857),
            ST_TileEnvelope(${z}, ${x}, ${y}),
            extent => 4096,
            buffer => 64
        )
        FROM catches
        WHERE ST_TileEnvelope(${z}, ${x}, ${y}) && ST_Transform(pos::geometry, 3857)
    )
    SELECT ST_AsMVT(mvtgeom.*)
    FROM mvtgeom
    `

    // we need to just bite the bullet and have some kind of first-startup caching of the fish ids
    // ok so the whole thing is composable, and I can also pass entire arrays into the format string with no issue\
    // last caveat is do we need to do any assembly here to ensure that the whole where and format isnt broken
    // should be able to condition chain here and do some level of push back
    // omg i hate ts js so much whyhyyyy
    
    if (!query[0]['st_asmvt']) {
        return Response.json({ error: 'missing st_asmvt' })
    }

    return new Response(
        query[0]['st_asmvt'],
        {   status: 200,
            headers: {
                'Content-Type': 'application/x-protobuf',
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'public, max-age=600', 
            }
        }
    )
}