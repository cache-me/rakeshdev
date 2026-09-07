# Portfolio — Production 3D AI Personal Portfolio

Monorepo with **Next.js** (`apps/web`), **Hono API** (`apps/api`), **PostgreSQL + Drizzle** (`packages/db`), and **ts-rest contracts** (`packages/contracts`).

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16 (or Docker)

## Setup

```bash
cd portfolio
cp .env.example .env
pnpm install
docker compose up -d postgres   # Postgres on host port **5433** (5432 is often a local install)
pnpm db:setup                 # migrate + seed (first time)
# If auth fails with "relation user does not exist" or migrate shows
# "permission denied for schema public", reset DB once (dev only):
#   docker compose down -v && docker compose up -d postgres && pnpm db:setup
# Or grant on an existing DB:
#   docker compose exec postgres psql -U portfolio -d portfolio -c \
#     "GRANT ALL ON SCHEMA public TO portfolio; GRANT CREATE ON SCHEMA public TO portfolio;"
pnpm dev
```

- Web: http://localhost:3001
- API: http://localhost:3000
- Nginx (Docker full stack): http://localhost:8080

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + api via Turbo |
| `pnpm build` | Build all packages/apps |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Run API unit tests |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:seed` | Seed sample portfolio content |

## Architecture

```
Next.js → TanStack Query → ts-rest client → packages/contracts → Hono → services → Drizzle → PostgreSQL
```

AI chat runs only on the API (`POST /api/ai/chat`) with grounded portfolio context and **validated navigation actions**.

## Admin dashboard

1. Create an admin user (requires running API + database):

```bash
pnpm create-admin admin@example.com 'your-secure-password' 'Admin Name'
```

2. Open http://localhost:3001/admin/login and sign in.

3. Manage **projects, skills, experience, services, testimonials, blog, site settings**, and **contact messages** from the sidebar.

Admin API routes (`/api/admin/*`) require a Better Auth session cookie and `role=admin` on the user (set automatically by `create-admin`).

## Agent skills

Copied from `prodios_ai/vite-fullstack-starter/.agents/skills` plus `frontend-next` overlay for App Router conventions.

## Production

Use `docker-compose.yml` + `docker-compose.prod.yml`. Configure secrets (`BETTER_AUTH_SECRET`, `DATABASE_URL`, optional `AI_API_KEY`) via environment — never commit `.env`.

### Supabase (database + optional API)

This app uses **PostgreSQL via Drizzle** and **Better Auth** (not Supabase Auth). Your Supabase project is the hosted Postgres database.

1. In [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings → Database**, copy the **database password** and connection strings.
2. In the repo root `.env`, set **`DATABASE_URL`** to the **Transaction pooler** URI (port **6543**, `?pgbouncer=true`) for the API.
3. Add your Supabase API keys (`SUPABASE_URL`, publishable/secret keys, `SUPABASE_JWKS_URL`) — see `.env.example`.
4. Apply schema to Supabase:

   ```bash
   # Use Direct connection (port 5432) in DATABASE_URL for migrate if pooler fails
   pnpm db:migrate
   pnpm db:seed          # optional first-time content
   pnpm create-admin …   # admin login
   ```

5. Deploy API with the same `DATABASE_URL` and auth env vars; deploy web on Vercel with `API_URL` pointing at your API.

**Security:** Never commit `SUPABASE_SECRET_KEY` or DB passwords. If a secret was exposed, rotate it in Supabase → **Project Settings → API → Secret keys**.

### Vercel (frontend only)

1. Push repo to GitHub (monorepo must include `apps/web` as normal files — not a submodule).
2. [vercel.com](https://vercel.com) → **Add New Project** → import `cache-me/rakeshdev`.
3. **Root Directory:** `apps/web`
4. Env vars (Production):
   - `NEXT_PUBLIC_SITE_URL` = `https://YOUR-APP.vercel.app`
   - `API_URL` = `https://YOUR-API.onrender.com` (no trailing slash)
5. Deploy.

### Render (API)

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** → select this repo (`render.yaml`).
2. Set sync:false env vars (see `.env.production.example`):
   - `DATABASE_URL` = Supabase **Transaction pooler** (`:6543` + `?pgbouncer=true`)
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN` (same as Vercel site URL)
   - Optional: `AI_API_KEY`, Resend, Supabase API keys
3. After API is live, put its URL into Vercel `API_URL` and redeploy web.
4. Update API `BETTER_AUTH_URL` + `CORS_ORIGIN` if the Vercel URL changed.

See `apps/web/vercel.json`. Host the API separately; set `NEXT_PUBLIC_SITE_URL` and `API_URL` on Vercel.
