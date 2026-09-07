import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { createDb } from './index'
import { getDatabaseUrl } from './load-env'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.join(__dirname, '../drizzle')

async function main() {
  const url = getDatabaseUrl()
  const { db, client } = createDb(url)
  console.log('Applying migrations from', migrationsFolder)
  console.log('Database:', url.replace(/:[^:@/]+@/, ':****@'))
  await migrate(db, { migrationsFolder })
  await client.end()
  console.log('Migrations applied successfully')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
