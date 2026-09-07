import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema/index'

export type Database = ReturnType<typeof createDb>['db']

function isPoolerUrl(connectionString: string) {
  return (
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('pgbouncer=true') ||
    /:6543(\/|\?|$)/.test(connectionString)
  )
}

export function createDb(connectionString: string) {
  const pooled = isPoolerUrl(connectionString)
  const client = postgres(connectionString, {
    max: pooled ? 1 : 10,
    // Required for Supabase transaction pooler (PgBouncer)
    prepare: !pooled,
    ssl: connectionString.includes('supabase.co') ? 'require' : undefined,
    connect_timeout: 30,
  })
  const db = drizzle(client, { schema })
  return { db, client }
}

export * from './schema/index'
