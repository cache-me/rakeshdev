import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const personalDocuments = pgTable('personal_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** aadhaar | pan | bank | other */
  docType: varchar('doc_type', { length: 40 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  /** Relative path under API private storage root */
  storagePath: text('storage_path').notNull(),
  mimeType: varchar('mime_type', { length: 80 }).notNull().default('image/png'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const personalDocumentAccessTokens = pgTable('personal_document_access_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdByUserId: text('created_by_user_id'),
  label: varchar('label', { length: 120 }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
