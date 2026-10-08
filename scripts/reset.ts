import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const dbUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DATABASE_URL) || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Resetting user data...');

  const users = await db.select().from(schema.users).where(eq(schema.users.email, 'demo@example.com'));
  if (users.length > 0) {
    const userId = users[0].id;
    
    // Wipe data for this user
    await db.delete(schema.transactions).where(eq(schema.transactions.userId, userId));
    await db.delete(schema.budgets).where(eq(schema.budgets.userId, userId));
    await db.delete(schema.accounts).where(eq(schema.accounts.userId, userId));
    // Keep categories as they are useful defaults
  }

  console.log('✅ Reset complete!');
  process.exit(0);
}

main().catch((e) => {
  console.error('Reset failed:', e);
  process.exit(1);
});
