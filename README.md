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
