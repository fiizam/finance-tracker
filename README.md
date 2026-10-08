# Antigravity Finance

A modern, fast, and secure personal finance application built with an extreme focus on design and user experience. Track accounts, monitor cash flow, and manage transactions through a clean, Linear-inspired interface.

## Features

- **Minimalist Interface:** Designed with Tailwind CSS v4 featuring soft border-radii, blurred glassmorphic backgrounds, and subtle micro-interactions (staggered fade-ins and scale states) for a native app feel.
- **Robust Authentication:** 
  - JWT-based session management
  - SMTP-based email verification using OTP codes
  - Secure password reset flow
  - **One-Click Demo Mode:** Allows recruiters or visitors to instantly explore the app. Destructive mutations are strictly disabled for the demo account.
- **Advanced Transactions:**
  - Create, read, update, and delete (CRUD) transactions.
  - Updating a transaction utilizes a strict SQL transaction block to safely revert the previous account balance and apply the new one automatically.
  - Dynamic Custom Categories utilizing HTML datalists for a lightweight autocomplete experience.

## Tech Stack

- **Framework:** Astro (Server-Side Rendering)
- **Styling:** Tailwind CSS (v4)
- **Interactive UI:** Svelte
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** jose (JWT) + Nodemailer (SMTP)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure your credentials.
   ```bash
   cp .env.example .env
   ```
   Ensure `DATABASE_URL` is a valid connection string to your PostgreSQL instance.

3. **Database Setup**
   Push the database schema:
   ```bash
   npm run db:push
   ```

4. **Seed Demo Data**
   Seed the database with sample accounts, categories, and transactions:
   ```bash
   npm run db:seed
   ```

## Security Measures

- **Demo Account Protection:** The demo user (`demo@example.com`) is strictly prevented from deleting their account, modifying initial balances, or performing destructive actions to prevent griefing.
- **Transaction Integrity:** Editing transaction amounts or reassigning accounts triggers a Drizzle transaction block to prevent orphaned or miscalculated balances.

## Development

Run the development server:
```bash
npm run dev
```

## Production Build

To build and run for production:
```bash
npm run build
node ./dist/server/entry.mjs
```

## Anti-Slop Design Principles

This project strictly adheres to clean design principles:
- No bulky or generic SaaS dashboard templates.
- Authentic data bindings and honest layout structures.
- Natively responsive without broken mobile overflows.
- Meaningful micro-animations instead of excessive motion.
