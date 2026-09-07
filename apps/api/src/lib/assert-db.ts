import '../load-env.js'

import { createDb } from '@portfolio/db'
import { sql } from 'drizzle-orm'

const url =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio@localhost:5433/portfolio'

export async function assertDatabaseReady() {
  const { db, client } = createDb(url)
  try {
    await db.execute(sql`SELECT 1 FROM "user" LIMIT 1`)
  } catch {
    console.error(
      '\n[portfolio/api] Database tables are missing. Run from repo root:\n' +
        '  pnpm db:setup\n' +
        '  (requires PostgreSQL at DATABASE_URL)\n',
    )
    process.exit(1)
  } finally {
    await client.end()
  }
}
