import { z } from 'zod'

export const idParamSchema = z.object({ id: z.string().uuid() })

/** Public site path (`/uploads/...`) or absolute http(s) URL. */
export const adminAssetUrlSchema = z
  .string()
  .refine((v) => v.startsWith('/') || /^https?:\/\//i.test(v), {
    message: 'Must be a path or http(s) URL',
  })

export const adminProjectBodySchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  summary: z.string().min(1),
  body: z.string().min(1),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  coverImageUrl: adminAssetUrlSchema.optional().nullable(),
  demoUrl: z.string().url().optional().nullable(),
  repoUrl: z.string().url().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  technologies: z.array(z.string().min(1)).default([]),
})

export const adminSkillBodySchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(80),
  proficiency: z.number().int().min(1).max(5).default(3),
  sortOrder: z.number().int().default(0),
})

export const adminExperienceBodySchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  location: z.string().max(120).optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  sortOrder: z.number().int().default(0),
})

export const adminServiceBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  iconKey: z.string().max(80).optional().nullable(),
  sortOrder: z.number().int().default(0),
})

export const adminTestimonialBodySchema = z.object({
  author: z.string().min(1).max(120),
  role: z.string().max(120).optional().nullable(),
  quote: z.string().min(1),
  avatarUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().default(0),
})

export const adminBlogBodySchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
})

export const adminEducationBodySchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  startDate: z.string().max(20).optional().nullable(),
  endDate: z.string().max(20).optional().nullable(),
  description: z.string().optional().nullable(),
  qualificationType: z
    .enum(['matric', 'intermediate', 'undergraduate', 'postgraduate', 'professional'])
    .default('undergraduate'),
  boardOrIssuer: z.string().max(200).optional().nullable(),
  resultSummary: z.string().optional().nullable(),
  certificateUrl: z.string().optional().nullable(),
  subjectsJson: z.string().optional().default('[]'),
  metricsJson: z.string().optional().default('{}'),
  sortOrder: z.number().int().default(0),
})

export const adminSiteSettingsBodySchema = z.object({
  name: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  heroIntro: z.string().min(1),
  profileImageUrl: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  availability: z.string().optional().nullable(),
  nowContent: z.string().optional().nullable(),
  socialLinks: z.record(z.string()).default({}),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})
