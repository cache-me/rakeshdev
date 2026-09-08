import '../load-env.js'

import { createDb } from '@portfolio/db'
import { sql } from 'drizzle-orm'

const url =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio@localhost:5433/portfolio'

function maskDatabaseUrl(raw: string) {
  return raw.replace(/:([^:@/]+)@/, ':****@')
}

export async function assertDatabaseReady() {
  if (!process.env.DATABASE_URL) {
    console.error(
      '\n[portfolio/api] DATABASE_URL is not set. Add it in Render → Environment.\n',
    )
    process.exit(1)
  }

  const { db, client } = createDb(url)
  try {
    await db.execute(sql`SELECT 1`)
  } catch (err) {
    console.error(
      `\n[portfolio/api] Cannot connect to Postgres.\n` +
        `  DATABASE_URL=${maskDatabaseUrl(url)}\n` +
        `  Cause: ${err instanceof Error ? err.message : String(err)}\n` +
        `  Tip: use Supabase Transaction pooler (:6543?pgbouncer=true) from Render.\n`,
    )
    process.exit(1)
  }

  try {
    await db.execute(sql`SELECT 1 FROM "user" LIMIT 1`)
  } catch (err) {
    console.error(
      `\n[portfolio/api] Database connected but tables are missing.\n` +
        `  DATABASE_URL=${maskDatabaseUrl(url)}\n` +
        `  Cause: ${err instanceof Error ? err.message : String(err)}\n` +
        `  Migrations should run on container start. Check entrypoint logs for migrate errors.\n` +
        `  Or run locally: DATABASE_URL=... pnpm db:migrate\n`,
    )
    process.exit(1)
  } finally {
    await client.end()
  }
}
