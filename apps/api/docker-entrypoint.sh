#!/bin/sh
set -eu

echo "[portfolio/api] Starting (PORT=${PORT:-3000})"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[portfolio/api] ERROR: DATABASE_URL is not set in Render env vars."
  echo "  Set it to your Supabase Transaction pooler URI (:6543?pgbouncer=true)."
  exit 1
fi

# Masked log for debugging wrong host/db without leaking password
masked=$(printf '%s' "$DATABASE_URL" | sed -E 's#://([^:/]+):([^@]+)@#://\1:****@#')
echo "[portfolio/api] DATABASE_URL=$masked"

# Direct host (db.*.supabase.co:5432) is IPv6-only on free Supabase — Render cannot reach it.
if printf '%s' "$DATABASE_URL" | grep -qE '@db\.[^/]+\.supabase\.co'; then
  echo "[portfolio/api] ERROR: Direct Supabase URL detected (db.*.supabase.co)."
  echo "  Render cannot use IPv6-only Direct connections (ENETUNREACH)."
  echo "  In Supabase → Project Settings → Database → Connection string:"
  echo "    Type: URI"
  echo "    Method: Transaction pooler"
  echo "    Port: 6543"
  echo "  Example:"
  echo "    postgresql://postgres.xzbcqrpxlsbiogdymuen:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  exit 1
fi

echo "[portfolio/api] Applying Drizzle migrations..."
pnpm --filter @portfolio/db db:migrate

# One-shot production bootstrap (set on Render for ONE deploy, then remove):
#   RUN_SEED=true
#   ADMIN_EMAIL=you@email.com
#   ADMIN_PASSWORD=strong-password
#   ADMIN_NAME=Your Name
if [ "${RUN_SEED:-}" = "true" ] || [ "${RUN_SEED:-}" = "1" ]; then
  echo "[portfolio/api] RUN_SEED enabled — wiping + seeding portfolio tables..."
  pnpm --filter @portfolio/db db:seed
  echo "[portfolio/api] Seed completed. Remove RUN_SEED from Render env after this deploy."
fi

if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  echo "[portfolio/api] Ensuring admin user ${ADMIN_EMAIL}..."
  pnpm --filter @portfolio/api run create-admin \
    "$ADMIN_EMAIL" \
    "$ADMIN_PASSWORD" \
    "${ADMIN_NAME:-Admin}"
  echo "[portfolio/api] Admin ready. Remove ADMIN_PASSWORD from Render env after this deploy."
fi

echo "[portfolio/api] Starting API..."
exec pnpm --filter @portfolio/api start
