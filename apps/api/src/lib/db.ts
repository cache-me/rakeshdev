import { AsyncLocalStorage } from 'node:async_hooks'

import { createDb, type Database } from '@portfolio/db'

import { env } from './env.js'

type DbBundle = ReturnType<typeof createDb>

/**
 * PgBouncer (Supabase transaction pooler) silently drops idle backends.
 * A long-lived singleton then hangs forever on the next query.
 * Use one short-lived connection per request instead.
 */
const dbContext = new AsyncLocalStorage<DbBundle>()

let fallback: DbBundle | null = null

function getBundle(): DbBundle {
  const fromRequest = dbContext.getStore()
  if (fromRequest) return fromRequest
  if (!fallback) fallback = createDb(env.DATABASE_URL)
  return fallback
}

/** Drizzle handle — request-scoped when `runWithDb` is active. */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const active = getBundle().db as object
    const value = Reflect.get(active, prop, active)
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(active) : value
  },
})

export async function runWithDb<T>(fn: () => Promise<T>): Promise<T> {
  const bundle = createDb(env.DATABASE_URL)
  try {
    return await dbContext.run(bundle, fn)
  } finally {
    try {
      await bundle.client.end({ timeout: 2 })
    } catch {
      // ignore close races
    }
  }
}
