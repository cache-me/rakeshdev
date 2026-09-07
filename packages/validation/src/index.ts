import { z } from 'zod'

import { AI_INTENTS } from '@portfolio/types'

import { aiChatPersonalDocumentSchema } from './personal-documents'
import { aiChatEducationCertificateSchema } from './education'

export const contactBodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
})

export const aiChatBodySchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
  personalDocumentToken: z.string().min(16).max(128).optional(),
  personalDocumentContext: z.string().max(500).optional(),
})

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  type: z
    .enum(['all', 'projects', 'skills', 'experience', 'blog', 'services'])
    .optional()
    .default('all'),
})

export const aiResponseSchema = z.object({
  message: z.string(),
  intent: z.enum(AI_INTENTS),
  navigation: z
    .object({
      type: z.literal('route'),
      href: z.string(),
      label: z.string(),
    })
    .optional(),
  personalDocuments: z.array(aiChatPersonalDocumentSchema).optional(),
  educationCertificates: z.array(aiChatEducationCertificateSchema).optional(),
})

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export const slugParamSchema = z.object({
  slug: z.string().min(1),
})

export * from './admin'
export * from './resume'
export * from './education'
export * from './personal-documents'
