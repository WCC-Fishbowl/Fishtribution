import { neon } from '@neondatabase/serverless';

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
