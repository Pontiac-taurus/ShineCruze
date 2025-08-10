# Deployment

## Vercel (recommended)
1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Set Environment Variables in Vercel:
   - DATABASE_URL (for production you should use Postgres; for a quick test you can still use SQLite but Vercel ephemeral filesystem is not persistent)
   - NEXT_PUBLIC_SITE_URL
4. Deploy.

## Google Cloud Run (Node backend)
1. Build a Dockerfile for Next.js (example in `docker/`).
2. Use Cloud SQL (Postgres) for database and connect via a private connection.
3. Deploy the container to Cloud Run and set env vars.

(See Vercel docs or GCP docs for detailed steps.)
