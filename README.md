# MGX Fullstack — Next.js + Supabase (Email/Password Auth)

This repository is a Vercel-ready Next.js app with Supabase Auth (email/password), Prisma (Postgres), and a simple services CRUD.

## Features
- Next.js (App Router)
- Supabase Auth (email/password)
- Prisma ORM (Postgres on Supabase)
- Tailwind CSS
- API routes protected via Supabase session

## Local setup

1. Install dependencies:
```bash
npm install
```

2. Copy env:
```bash
cp .env.example .env.local
```

3. Fill `.env.local` with your Supabase project values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

4. Run Prisma migrate & seed:
```bash
npx prisma migrate deploy
node prisma/seed.js
```

5. Run dev:
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables in Vercel (same as .env.local).
4. Deploy.

## Notes
- This setup uses Supabase for Auth and Postgres. Email/password is enabled by default in Supabase Auth.
