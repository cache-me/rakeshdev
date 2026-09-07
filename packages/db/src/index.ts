import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema/index'

export type Database = ReturnType<typeof createDb>['db']

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { max: 10 })
  const db = drizzle(client, { schema })
  return { db, client }
}

export * from './schema/index'
