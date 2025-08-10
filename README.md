
# MGX Fullstack — Next.js Starter

This repository is a full-stack Next.js (App Router) starter with TypeScript, Tailwind CSS, and Prisma.

## Features
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite for local dev; instructions to switch to Postgres)
- API routes for Services (CRUD)
- Seed data
- CI workflow for deployment

## Quickstart (local)
1. Install deps:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Migrate & seed:
   ```bash
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```
4. Run dev:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Deploy
Recommended: Vercel for Next.js or Google Cloud Run (see `DEPLOYMENT.md` for detailed steps).

