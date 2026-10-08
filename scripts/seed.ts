import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../src/db/schema';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');

  // Reset tables (dangerous in prod, fine for dev)
  console.log('Cleaning existing data...');
  await db.delete(schema.transactions);
  await db.delete(schema.budgets);
  await db.delete(schema.categories);
  await db.delete(schema.accounts);
  await db.delete(schema.users);

  console.log('Creating demo user...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const userInsert = await db.insert(schema.users).values({
    name: 'Demo User',
    email: 'demo@example.com',
    passwordHash,
  }).returning({ id: schema.users.id });
  const userId = userInsert[0].id;

  console.log('Creating accounts...');
  const accountsInsert = await db.insert(schema.accounts).values([
    { userId, name: 'BCA', type: 'bank', balance: 15000000 },
    { userId, name: 'Seabank', type: 'digital_bank', balance: 5000000 },
    { userId, name: 'GoPay', type: 'e_wallet', balance: 1500000 },
    { userId, name: 'Cash', type: 'cash', balance: 500000 },
  ]).returning({ id: schema.accounts.id, name: schema.accounts.name });

  const accountMap = accountsInsert.reduce((acc, account) => {
    acc[account.name] = account.id;
    return acc;
  }, {} as Record<string, string>);

  console.log('Creating categories...');
  const categoriesInsert = await db.insert(schema.categories).values([
    { userId, name: 'Food', type: 'expense' },
    { userId, name: 'Transport', type: 'expense' },
    { userId, name: 'Shopping', type: 'expense' },
    { userId, name: 'Bills', type: 'expense' },
    { userId, name: 'Entertainment', type: 'expense' },
    { userId, name: 'Salary', type: 'income' },
    { userId, name: 'Freelance', type: 'income' },
  ]).returning({ id: schema.categories.id, name: schema.categories.name });

  const categoryMap = categoriesInsert.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, string>);

  console.log('Creating transactions...');
  const now = new Date();
  
  await db.insert(schema.transactions).values([
    {
      userId,
      accountId: accountMap['BCA'],
      categoryId: categoryMap['Salary'],
      type: 'income',
      amount: 15000000,
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Monthly Salary',
    },
    {
      userId,
      accountId: accountMap['Seabank'],
      categoryId: categoryMap['Food'],
      type: 'expense',
      amount: 250000,
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      description: 'Groceries',
    },
    {
      userId,
      accountId: accountMap['GoPay'],
      categoryId: categoryMap['Transport'],
      type: 'expense',
      amount: 50000,
      date: new Date(now.getFullYear(), now.getMonth(), 6),
      description: 'GoRide to Office',
    },
    {
      userId,
      accountId: accountMap['BCA'],
      categoryId: categoryMap['Bills'],
      type: 'expense',
      amount: 1200000,
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      description: 'Internet & Electricity',
    }
  ]);

  console.log('Creating budgets...');
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  await db.insert(schema.budgets).values([
    {
      userId,
      categoryId: categoryMap['Food'],
      amount: 2000000,
      month: currentMonthStr,
    },
    {
      userId,
      categoryId: categoryMap['Shopping'],
      amount: 1000000,
      month: currentMonthStr,
    }
  ]);

  console.log('✅ Seeding complete!');
  process.exit(0);
}

main().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
