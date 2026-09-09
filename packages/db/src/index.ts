import dns from 'node:dns'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema/index'

// Prefer IPv4 — Render free / many hosts cannot reach Supabase Direct (IPv6-only).
dns.setDefaultResultOrder('ipv4first')

export type Database = ReturnType<typeof createDb>['db']

function isPoolerUrl(connectionString: string) {
  return (
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('pgbouncer=true') ||
    /:6543(\/|\?|$)/.test(connectionString)
  )
}

export function createDb(connectionString: string) {
  if (/@db\.[^/]+\.supabase\.co/i.test(connectionString)) {
    console.warn(
      '[portfolio/db] Warning: Direct Supabase host (db.*.supabase.co) is IPv6-only. ' +
        'Use Transaction pooler (:6543?pgbouncer=true) on Render/Vercel/cloud hosts.',
    )
  }

  const pooled = isPoolerUrl(connectionString)
  const client = postgres(connectionString, {
    // Transaction pooler: keep a single client connection; Session pooler can use a few.
    max: pooled ? 1 : 10,
    // Required for Supabase transaction pooler (PgBouncer)
    prepare: !pooled,
    // Avoid pg_catalog probes that can stall on restricted / pooled backends
    fetch_types: !pooled,
    ssl: connectionString.includes('supabase.co') ? 'require' : undefined,
    connect_timeout: 8,
    // Prefer short lifetimes under PgBouncer — stale sockets hang SELECT forever
    idle_timeout: pooled ? 10 : 60,
    max_lifetime: pooled ? 60 : 60 * 30,
  })
  const db = drizzle(client, { schema })
  return { db, client }
}

export * from './schema/index'
