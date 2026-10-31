import { neon } from '@neondatabase/serverless';

import { CatchWithRelations } from '@/types/CatchWithRelations';
import { Catch } from '@/types/Catch';
import { User } from '@/types/User';
import { FishTaxon } from '@/types/FishTaxon';
import { CatchWithRelationsSearch } from '@/types/CatchWithRelations';
import { Point } from 'geojson';

export type Session = {
  user: {
    id: string
    name?: string | null
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date
    updatedAt: Date
  }
  session: {
    id: string
    userId: string
    expiresAt: Date
    ipAddress?: string | null
    userAgent?: string | null
    token: string
    createdAt: Date
    updatedAt: Date
  }
}

console.log(
  "DATABASE_URL configured:",
  Boolean(process.env.DATABASE_URL)
);

const sql = neon(process.env.DATABASE_URL!);

export async function getTestData() {
  const data = await sql`SELECT * FROM test_table;`;
  return data;
}

export async function checkIfUserExists(
  session: Session
) {
  const uid = session.user.id;
  const [row] = await sql`
    SELECT COUNT(*) AS exists_count
    FROM users
    WHERE user_id = ${uid};
  `
  return row.exists_count > 0;
}

export async function insertNewUser(
  session: Session, 
  username: string, 
  email: string,
) {
  const uid = session.user.id;
  const data = await sql`
    INSERT INTO users (user_id, username, email, role)
    VALUES (${uid}, ${username}, ${email}, 'angler')
    ON CONFLICT (user_id) DO NOTHING;
  `
  
  return data;
}

export async function insertUserSettings(
  session: Session
) {
  const uid = session.user.id;
  const data = await sql`
    INSERT INTO user_settings (user_id)
    VALUES (${uid})
    ON CONFLICT (user_id) DO NOTHING;
  `

  return data;
}

export async function deleteUser(session: Session) {
  const uid = session.user.id;
  const data = await sql`
    DELETE FROM users
    WHERE user_id = ${uid};    
  `
  
  return data;
}

export async function deleteUserSettings(session: Session) {
  const uid = session.user.id;
  const data = await sql`
    DELETE FROM user_settings
    WHERE user_id = ${uid}; 
  `

  return data;
}

export async function unlinkCatchesFromUser(session: Session) {
  const uid = session.user.id;
  const data = await sql`
    UPDATE catches
    SET user_id = NULL
    WHERE user_id = ${uid};
  `

  return data;
}


export async function getUserSettings(session: Session) {
  const uid = session.user.id;
  const data = await sql`SELECT * FROM user_settings WHERE user_id = ${uid}`;

  return data;
}

export async function getCatchesWithRelations(
  session: Session | null,
  user_loc: Point | null,
  params: CatchWithRelationsSearch,
): Promise<CatchWithRelations[]> {
  const catches = await sql`
    SELECT catches.*
    FROM catches
    JOIN users ON catches.user_id = users.user_id
    JOIN fish_taxa ON catches.taxon_id = fish_taxa.taxon_id
    WHERE (
      ${params.taxon_search}::text IS NULL
      OR fish_taxa.common_name ILIKE '%' || ${params.taxon_search} || '%'
      OR fish_taxa.scientific_name ILIKE '%' || ${params.taxon_search} || '%'
    ) AND (
      ${params.user_search}::text IS NULL
      OR users.username ILIKE '%' || ${params.user_search} || '%'
      OR users.display_name ILIKE '%' || ${params.user_search} || '%'
      ${session ? sql`OR users.user_id = ${session.user.id}` : sql``}
    ) AND (
      ${params.bait_lure_select}::text IS NULL
      OR catches.bait_or_lure = ${params.bait_lure_select}
    ) AND (
      ${user_loc == null
        ? sql`TRUE`
        : sql`catches.pos IS NOT NULL
        AND ST_DWithin(
          catches.pos,
          ST_SetSRID(
            ST_MakePoint(
              ${user_loc.coordinates[0]},
              ${user_loc.coordinates[1]}
            ),
            4326
          )::geography,
          15000
        )`
      }
    ) AND (
      ${params.date_select}::time IS NULL
      OR catches.caught_at < ${params.date_select}
    ) AND (
      (
        ${params.time_start_select}::time IS NULL
        OR ${params.time_end_select}::time IS NULL
      ) OR (
        ${params.time_start_select} <= ${params.time_end_select}
        AND catches.caught_at >= ${params.time_start_select}
        AND catches.caught_at <= ${params.time_end_select}
      ) OR (
        ${params.time_start_select} > ${params.time_end_select}
        AND (
          catches.caught_at >= ${params.time_start_select}
          OR catches.caught_at <= ${params.time_end_select}
        )
      )
    )
    ORDER BY catches.caught_at DESC
    LIMIT 20;
  `;

  const results: CatchWithRelations[] = [];

  for (const catchRecord of catches) {
    const [user] = await sql`
      SELECT *
      FROM users
      WHERE user_id = ${catchRecord.user_id};
    `;

    const [fishTaxon] = await sql`
      SELECT *
      FROM fish_taxa
      WHERE taxon_id = ${catchRecord.taxon_id};
    `;

    if (!user || !fishTaxon) continue;

    results.push({
      catchRecord: catchRecord as Catch,
      user: user as User,
      fishTaxon: fishTaxon as FishTaxon,
    });
  }

  return results;
}