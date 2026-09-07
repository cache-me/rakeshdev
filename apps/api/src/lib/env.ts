import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z
    .string()
    .default('postgresql://portfolio:portfolio@localhost:5433/portfolio'),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default('dev-only-secret-change-in-production-32chars'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),
  AI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.enum(['anthropic', 'openai']).default('anthropic'),
  AI_BASE_URL: z.string().url().optional(),
  AI_MODEL: z.string().default('claude-3-5-haiku-20241022'),
  RESEND_API_KEY: z.string().optional(),
  /** Resend "from" address (e.g. onboarding@resend.dev or verified domain) */
  CONTACT_FROM_EMAIL: z.string().email().optional(),
  /** Inbox that receives contact form submissions */
  CONTACT_TO_EMAIL: z.string().email().optional(),
  /** Send a styled confirmation email to the visitor (default true when Resend is configured) */
  CONTACT_AUTO_REPLY: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => v !== 'false' && v !== false),
  /** Supabase project URL (https://xxxx.supabase.co) — optional; used for Storage / REST */
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_JWKS_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
