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

export async function getUserSettings(session: Session) {
  const uid = session.user.id;
  const data = await sql`SELECT * FROM user_settings WHERE user_id = ${uid}`;
  return data;
}
