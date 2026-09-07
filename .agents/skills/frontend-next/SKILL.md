---
name: frontend-next
description: Next.js App Router conventions for apps/web — route colocation, Server Components, features/, metadata, and TanStack Query + ts-rest. Use alongside the frontend skill with Next-specific paths.
---

# Frontend (Next.js App Router)

Apply for all work in `apps/web/`.

## Paths

- Routes: `apps/web/app/`
- Route-only UI: `apps/web/app/<segment>/_components/`
- Shared (2+ routes): `apps/web/components/<name>/` or `apps/web/features/<feature>/`
- API client: `apps/web/lib/api.ts`
- Query keys: `apps/web/hooks/query-keys.ts`

## Server vs client

- Default to **Server Components** in `app/**/page.tsx` and layouts.
- Add `"use client"` only for interactivity, browser APIs, Three.js, Motion, Lenis, chat.
- Do not fetch PostgreSQL from web; use ts-rest + TanStack Query or RSC fetch to `/api`.

## Data

- TanStack Query for client islands; long stale times for portfolio GETs.
- No direct `useEffect` for fetching (see `no-use-effect` skill).

## Pages

- Every public route: `generateMetadata`, semantic HTML, JSON-LD where applicable.
- Admin under `app/admin/` with auth checks.
