import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { env } from './env.js'

let adminClient: SupabaseClient | null | undefined

/** Server-side Supabase client (secret key). Null when Supabase env is not configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient

  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = env
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    adminClient = null
    return null
  }

  adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return adminClient
}
