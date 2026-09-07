import { createHash, randomBytes } from 'node:crypto'
import { mkdir, readFile, copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  personalDocumentAccessTokens,
  personalDocuments,
} from '@portfolio/db'
import { and, eq, gt, isNull } from 'drizzle-orm'

import { db } from '../lib/db.js'
import { env } from '../lib/env.js'

const TOKEN_BYTES = 32

export function personalStorageRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../storage/personal')
}

export function hashAccessToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function listPersonalDocumentsAdmin() {
  const rows = await db.select().from(personalDocuments).orderBy(personalDocuments.sortOrder)
  return rows.map((row) => ({
    id: row.id,
    docType: row.docType,
    title: row.title,
    description: row.description,
    mimeType: row.mimeType,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  }))
}

export async function createAccessToken(input: {
  expiresInMinutes: 30 | 60
  label?: string
  createdByUserId?: string
}) {
  const rawToken = randomBytes(TOKEN_BYTES).toString('base64url')
  const tokenHash = hashAccessToken(rawToken)
  const expiresAt = new Date(Date.now() + input.expiresInMinutes * 60 * 1000)

  const [row] = await db
    .insert(personalDocumentAccessTokens)
    .values({
      tokenHash,
      expiresAt,
      label: input.label ?? null,
      createdByUserId: input.createdByUserId ?? null,
    })
    .returning()

  const site = env.BETTER_AUTH_URL.replace(/\/$/, '')
  return {
    id: row!.id,
    token: rawToken,
    expiresAt: expiresAt.toISOString(),
    sharePath: `/personal-documents/view?token=${encodeURIComponent(rawToken)}`,
    shareUrl: `${site}/personal-documents/view?token=${encodeURIComponent(rawToken)}`,
  }
}

export async function listAccessTokensAdmin() {
  const now = new Date()
  const rows = await db
    .select()
    .from(personalDocumentAccessTokens)
    .orderBy(personalDocumentAccessTokens.createdAt)

  return rows.map((row) => ({
    id: row.id,
    expiresAt: row.expiresAt.toISOString(),
    label: row.label,
    revokedAt: row.revokedAt?.toISOString() ?? null,
    lastAccessedAt: row.lastAccessedAt?.toISOString() ?? null,
    accessCount: row.accessCount,
    createdAt: row.createdAt.toISOString(),
    expired: row.expiresAt <= now || row.revokedAt !== null,
  }))
}

export async function revokeAccessToken(id: string) {
  await db
    .update(personalDocumentAccessTokens)
    .set({ revokedAt: new Date() })
    .where(eq(personalDocumentAccessTokens.id, id))
}

type TokenValidation =
  | { ok: true; tokenRow: typeof personalDocumentAccessTokens.$inferSelect }
  | { ok: false; code: string; message: string }

export async function validateAccessToken(rawToken: string): Promise<TokenValidation> {
  const tokenHash = hashAccessToken(rawToken)
  const rows = await db
    .select()
    .from(personalDocumentAccessTokens)
    .where(
      and(
        eq(personalDocumentAccessTokens.tokenHash, tokenHash),
        isNull(personalDocumentAccessTokens.revokedAt),
        gt(personalDocumentAccessTokens.expiresAt, new Date()),
      ),
    )
    .limit(1)

  const tokenRow = rows[0]
  if (!tokenRow) {
    return { ok: false, code: 'TOKEN_INVALID', message: 'Token is invalid, expired, or revoked.' }
  }

  await db
    .update(personalDocumentAccessTokens)
    .set({
      accessCount: tokenRow.accessCount + 1,
      lastAccessedAt: new Date(),
    })
    .where(eq(personalDocumentAccessTokens.id, tokenRow.id))

  return { ok: true, tokenRow }
}

export async function listDocumentsForToken(rawToken: string) {
  const validation = await validateAccessToken(rawToken)
  if (!validation.ok) return validation

  const rows = await db.select().from(personalDocuments).orderBy(personalDocuments.sortOrder)
  return {
    ok: true as const,
    data: rows.map((row) => ({
      id: row.id,
      docType: row.docType,
      title: row.title,
      description: row.description,
    })),
  }
}

export async function readDocumentFileForToken(rawToken: string, documentId: string) {
  const validation = await validateAccessToken(rawToken)
  if (!validation.ok) return validation

  const rows = await db
    .select()
    .from(personalDocuments)
    .where(eq(personalDocuments.id, documentId))
    .limit(1)
  const doc = rows[0]
  if (!doc) {
    return { ok: false as const, code: 'NOT_FOUND', message: 'Document not found.' }
  }

  const root = personalStorageRoot()
  const fullPath = path.resolve(root, doc.storagePath)
  if (!fullPath.startsWith(root)) {
    return { ok: false as const, code: 'FORBIDDEN', message: 'Invalid storage path.' }
  }

  try {
    const buffer = await readFile(fullPath)
    return {
      ok: true as const,
      buffer,
      mimeType: doc.mimeType,
      filename: `${doc.docType}-${doc.title.replace(/\s+/g, '-').toLowerCase()}.png`,
    }
  } catch {
    return { ok: false as const, code: 'NOT_FOUND', message: 'File missing on server.' }
  }
}

/** Seed default docs + copy assets into private storage (idempotent). */
export async function ensurePersonalDocumentsSeeded(sourceAssets: Record<string, string>) {
  const root = personalStorageRoot()
  await mkdir(root, { recursive: true })

  const existing = await db.select().from(personalDocuments).limit(1)
  if (existing.length > 0) return

  for (const [filename, src] of Object.entries(sourceAssets)) {
    try {
      await access(src)
      await copyFile(src, path.join(root, filename))
    } catch {
      console.warn('[personal-docs] skip missing asset:', src)
    }
  }

  await db.insert(personalDocuments).values([
    {
      docType: 'aadhaar',
      title: 'Aadhaar Card',
      description: 'Government of India identity document.',
      storagePath: 'aadhaar.png',
      sortOrder: 1,
    },
    {
      docType: 'pan',
      title: 'PAN Card',
      description: 'Income Tax Department permanent account number card.',
      storagePath: 'pan.png',
      sortOrder: 2,
    },
    {
      docType: 'bank',
      title: 'Bank Passbook',
      description: 'Canara Bank account passbook (account details).',
      storagePath: 'bank-passbook.png',
      sortOrder: 3,
    },
  ])
}
