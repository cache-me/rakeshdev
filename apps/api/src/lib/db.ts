import { createDb, type Database } from '@portfolio/db'

import { env } from './env.js'

type DbBundle = ReturnType<typeof createDb>

/**
 * Free-tier Supabase pooler only allows a few clients.
 * Opening a new connection per parallel request exhausts the pool and hangs forever.
 * Keep one shared client, serialize access, and recycle after idle.
 */
let bundle: DbBundle | null = null
let lastUsedAt = 0
let queue: Promise<unknown> = Promise.resolve()

const IDLE_RECYCLE_MS = 12_000

async function getBundle(): Promise<DbBundle> {
  const now = Date.now()
  if (bundle && now - lastUsedAt > IDLE_RECYCLE_MS) {
    const old = bundle
    bundle = null
    try {
      await old.client.end({ timeout: 1 })
    } catch {
      // ignore
    }
  }
  if (!bundle) {
    bundle = createDb(env.DATABASE_URL)
  }
  lastUsedAt = Date.now()
  return bundle
}

async function resetBundle(reason: string) {
  console.warn('[portfolio/api] Resetting DB client:', reason)
  const old = bundle
  bundle = null
  if (old) {
    try {
      await old.client.end({ timeout: 1 })
    } catch {
      // ignore
    }
  }
}

/** Always resolved through `runWithDb` during requests. */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    if (!bundle) {
      throw new Error('DB used outside runWithDb()')
    }
    const active = bundle.db as object
    const value = Reflect.get(active, prop, active)
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(active) : value
  },
})

export async function runWithDb<T>(fn: () => Promise<T>, timeoutMs = 12_000): Promise<T> {
  const run = queue.then(async () => {
    await getBundle()
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        fn(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('DB_TIMEOUT')), timeoutMs)
        }),
      ])
    } catch (err) {
      if (err instanceof Error && err.message === 'DB_TIMEOUT') {
        await resetBundle('query timeout')
      }
      throw err
    } finally {
      if (timer) clearTimeout(timer)
      lastUsedAt = Date.now()
    }
  })

  queue = run.then(
    () => undefined,
    () => undefined,
  )

  return run
}
