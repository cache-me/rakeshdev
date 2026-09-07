/**
 * Reset public + drizzle schemas so migrations can re-apply cleanly.
 * USE ONLY on empty/dev Supabase projects — deletes all app data.
 *
 *   pnpm --filter @portfolio/db exec tsx src/reset-schema.ts
 *   pnpm db:migrate
 *   pnpm db:seed
 *   pnpm create-admin …
 */
import { createDb } from './index'
import { getDatabaseUrl } from './load-env'

async function main() {
  const url = getDatabaseUrl()
  console.log('Resetting schemas on', url.replace(/:[^:@/]+@/, ':****@'))
  const { client } = createDb(url)

  await client.unsafe(`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    DROP SCHEMA IF EXISTS drizzle CASCADE;
  `)

  await client.end()
  console.log('Schemas reset. Run: pnpm db:migrate && pnpm db:seed')
}

main().catch((err) => {
  console.error('Reset failed:', err)
  process.exit(1)
})
