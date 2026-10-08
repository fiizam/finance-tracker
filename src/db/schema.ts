import { pgTable, text, timestamp, uuid, varchar, bigint, boolean, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  verificationCode: varchar('verification_code', { length: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // bank, digital_bank, e_wallet, cash, other
  balance: bigint('balance', { mode: 'number' }).notNull().default(0), // stored in cents/smallest unit, but we'll use IDR so it's just the amount
  currency: varchar('currency', { length: 3 }).notNull().default('IDR'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // income, expense
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  toAccountId: uuid('to_account_id').references(() => accounts.id, { onDelete: 'cascade' }), // for transfers
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 50 }).notNull(), // income, expense, transfer
  amount: bigint('amount', { mode: 'number' }).notNull(), // absolute value
  date: timestamp('date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  month: varchar('month', { length: 7 }).notNull(), // YYYY-MM
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    uniqueIndex('unique_budget').on(table.userId, table.categoryId, table.month),
  ];
});
