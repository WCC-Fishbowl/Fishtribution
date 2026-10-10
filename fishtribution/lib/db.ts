import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getTestData() {
  const data = await sql`SELECT * FROM "test-table";`;
  return data;
}