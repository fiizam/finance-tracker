import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl,
});

const db = drizzle(pool, { schema });

async function clearUnverified() {
  await db.delete(schema.users).where(eq(schema.users.isVerified, false));
  console.log("Deleted unverified users.");
  process.exit(0);
}

clearUnverified().catch(console.error);
