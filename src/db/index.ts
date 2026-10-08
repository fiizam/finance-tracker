import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema';

const dbUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DATABASE_URL) || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle(pool, { schema });
