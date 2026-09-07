import { z } from 'zod'

export const PERSONAL_DOC_TYPES = ['aadhaar', 'pan', 'bank', 'other'] as const

export const personalDocTypeSchema = z.enum(PERSONAL_DOC_TYPES)

export const createPersonalDocTokenBodySchema = z.object({
  expiresInMinutes: z.union([z.literal(30), z.literal(60)]).default(60),
  label: z.string().max(120).optional(),
})

export const personalDocumentPublicSchema = z.object({
  id: z.string().uuid(),
  docType: personalDocTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
})

export const personalDocumentAdminSchema = personalDocumentPublicSchema.extend({
  mimeType: z.string(),
  sortOrder: z.number(),
  createdAt: z.string(),
})

export const personalDocTokenCreatedSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  sharePath: z.string(),
})

export const personalDocTokenAdminSchema = z.object({
  id: z.string().uuid(),
  expiresAt: z.string(),
  label: z.string().nullable(),
  revokedAt: z.string().nullable(),
  lastAccessedAt: z.string().nullable(),
  accessCount: z.number(),
  createdAt: z.string(),
  expired: z.boolean(),
})

export const personalDocAccessQuerySchema = z.object({
  token: z.string().min(16).max(128),
})

export const personalDocFileQuerySchema = personalDocAccessQuerySchema.extend({
  documentId: z.string().uuid(),
})

export const aiChatPersonalDocumentSchema = z.object({
  id: z.string().uuid(),
  docType: personalDocTypeSchema,
  title: z.string(),
  imageUrl: z.string(),
})

/** Extract a personal-doc access token from pasted text or a share URL. */
export function extractPersonalDocumentToken(message: string): string | null {
  const urlMatch = message.match(/[?&]token=([^&\s"'<>]+)/i)
  if (urlMatch?.[1]) {
    try {
      return decodeURIComponent(urlMatch[1])
    } catch {
      return urlMatch[1]
    }
  }

  const trimmed = message.trim()
  if (/^[A-Za-z0-9_-]{32,}$/.test(trimmed)) return trimmed

  const inline = message.match(/\b([A-Za-z0-9_-]{40,})\b/)
  return inline?.[1] ?? null
}

export type PersonalDocFilterType = 'aadhaar' | 'pan' | 'bank'

function personalDocKeywords(text: string): boolean {
  return /aadhaar|aadhar|adhar|\bpan\b|pan card|bank|passbook|account detail|account number/i.test(
    text,
  )
}

/** Which private docs the user asked for (uses prior chat context when the message is only a token). */
export function detectRequestedPersonalDocTypes(
  message: string,
  context?: string,
): PersonalDocFilterType[] | 'all' {
  const q = message.toLowerCase()
  const ctx = (context ?? '').toLowerCase()
  const embeddedToken = extractPersonalDocumentToken(message)
  const tokenOnly =
    Boolean(embeddedToken) &&
    q.replace(embeddedToken!.toLowerCase(), '').trim().length < 8 &&
    !personalDocKeywords(q)

  const scopeText =
    tokenOnly || !personalDocKeywords(q) ? `${ctx}\n${q}`.trim() : q

  if (
    /all doc|every doc|show all|all personal|saare doc|sab doc|tino doc|teeno doc/i.test(scopeText)
  ) {
    return 'all'
  }

  const types: PersonalDocFilterType[] = []
  if (/aadhaar|aadhar|adhar/i.test(scopeText)) types.push('aadhaar')
  if (/\bpan\b|pan card/i.test(scopeText)) types.push('pan')
  if (/bank|passbook|account detail|account number/i.test(scopeText)) types.push('bank')

  return types.length > 0 ? types : 'all'
}
