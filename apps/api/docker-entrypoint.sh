#!/bin/sh
set -eu

echo "[portfolio/api] Starting (PORT=${PORT:-3000})"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[portfolio/api] ERROR: DATABASE_URL is not set in Render env vars."
  echo "  Set it to your Supabase connection string (pooler :6543?pgbouncer=true preferred)."
  exit 1
fi

# Masked log for debugging wrong host/db without leaking password
masked=$(printf '%s' "$DATABASE_URL" | sed -E 's#://([^:/]+):([^@]+)@#://\1:****@#')
echo "[portfolio/api] DATABASE_URL=$masked"

echo "[portfolio/api] Applying Drizzle migrations..."
pnpm --filter @portfolio/db db:migrate

echo "[portfolio/api] Starting API..."
exec pnpm --filter @portfolio/api start
