import '../src/load-env.js'

import { hashPassword } from 'better-auth/crypto'
import { and, eq } from 'drizzle-orm'

import { auth } from '../src/lib/auth.js'
import { db } from '../src/lib/db.js'
import { account, user } from '@portfolio/db/schema'

/** Must match `createLocalAccountIssuer("credential")` in Better Auth 1.7+ */
const CREDENTIAL_ISSUER = 'local:credential'

const emailArg = process.argv[2]
const password = process.argv[3]
const name = process.argv[4] ?? 'Admin'

if (!emailArg || !password) {
  console.error('Usage: pnpm create-admin <email> <password> [name]')
  process.exit(1)
}

const email = emailArg.toLowerCase().trim()

async function setCredentialPassword(userId: string, plainPassword: string) {
  const hashed = await hashPassword(plainPassword)
  const [cred] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'credential')))
    .limit(1)

  const now = new Date()

  if (cred) {
    await db
      .update(account)
      .set({
        password: hashed,
        issuer: CREDENTIAL_ISSUER,
        accountId: userId,
        updatedAt: now,
      })
      .where(eq(account.id, cred.id))
    return
  }

  await db.insert(account).values({
    id: crypto.randomUUID(),
    userId,
    accountId: userId,
    providerId: 'credential',
    issuer: CREDENTIAL_ISSUER,
    password: hashed,
    createdAt: now,
    updatedAt: now,
  })
}

async function main() {
  let [row] = await db.select().from(user).where(eq(user.email, email)).limit(1)

  if (!row) {
    await auth.api.signUpEmail({
      body: { email, password, name },
    })
    ;[row] = await db.select().from(user).where(eq(user.email, email)).limit(1)
    if (!row) {
      throw new Error('Sign-up completed but user row was not found')
    }
    console.log(`Created user ${email}`)
  } else {
    console.log(`User ${email} already exists — updating password and admin role`)
  }

  await db
    .update(user)
    .set({ role: 'admin', updatedAt: new Date() })
    .where(eq(user.id, row.id))

  await setCredentialPassword(row.id, password)

  console.log(`Admin ready. Sign in at /admin/login with this email and password.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
