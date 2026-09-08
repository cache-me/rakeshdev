import * as schema from '@portfolio/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'


import { db } from './db.js'
import { env } from './env.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.CORS_ORIGIN],
  // Vercel → Next proxy → Render: use single-value client IP headers from our proxy.
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-client-ip', 'x-real-ip', 'x-forwarded-for'],
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
    }),
  ],
})

export type AuthSession = typeof auth.$Infer.Session
