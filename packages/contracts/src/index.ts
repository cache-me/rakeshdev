import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import {
  aiChatBodySchema,
  aiResponseSchema,
  apiErrorSchema,
  contactBodySchema,
  educationRecordSchema,
  resumeDocumentSchema,
  resumeTemplateMetaSchema,
  resumeTemplateIdSchema,
  personalDocAccessQuerySchema,
  personalDocumentPublicSchema,
  searchQuerySchema,
  slugParamSchema,
} from '@portfolio/validation'

import { adminContract } from './admin'

const c = initContract()

const success = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.literal(true), data })

const siteSettingsSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  bio: z.string(),
  heroIntro: z.string(),
  profileImageUrl: z.string().nullable(),
  resumeUrl: z.string().nullable(),
  email: z.string().nullable(),
  location: z.string().nullable(),
  availability: z.string().nullable(),
  nowContent: z.string().nullable(),
  socialLinks: z.record(z.string()),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
})

const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  body: z.string(),
  featured: z.boolean(),
  coverImageUrl: z.string().nullable(),
  demoUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  technologies: z.array(z.string()),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
})

const projectListItemSchema = projectSchema.omit({ body: true })

const skillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  proficiency: z.number(),
})

const experienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string(),
  role: z.string(),
  location: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean(),
  description: z.string(),
})

const educationSchema = educationRecordSchema

const serviceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  iconKey: z.string().nullable(),
})

const testimonialSchema = z.object({
  id: z.string().uuid(),
  author: z.string(),
  role: z.string().nullable(),
  quote: z.string(),
  avatarUrl: z.string().nullable(),
})

const blogPostListSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  publishedAt: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  category: z.string().nullable(),
})

const blogPostSchema = blogPostListSchema.extend({
  content: z.string(),
})

const searchResultSchema = z.object({
  type: z.enum(['project', 'skill', 'experience', 'blog', 'service']),
  id: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
})

export const healthContract = c.router({
  check: {
    method: 'GET',
    path: '/health',
    responses: {
      200: z.object({ ok: z.literal(true) }),
    },
  },
})

export const siteContract = c.router({
  getSettings: {
    method: 'GET',
    path: '/site/settings',
    responses: {
      200: success(siteSettingsSchema),
      404: apiErrorSchema,
    },
  },
})

export const projectsContract = c.router({
  list: {
    method: 'GET',
    path: '/projects',
    query: z.object({
      featured: z.coerce.boolean().optional(),
    }),
    responses: {
      200: success(z.array(projectListItemSchema)),
    },
  },
  getBySlug: {
    method: 'GET',
    path: '/projects/:slug',
    pathParams: slugParamSchema,
    responses: {
      200: success(projectSchema),
      404: apiErrorSchema,
    },
  },
})

export const skillsContract = c.router({
  list: {
    method: 'GET',
    path: '/skills',
    responses: {
      200: success(z.array(skillSchema)),
    },
  },
})

export const experienceContract = c.router({
  list: {
    method: 'GET',
    path: '/experience',
    responses: {
      200: success(z.array(experienceSchema)),
    },
  },
})

export const educationContract = c.router({
  list: {
    method: 'GET',
    path: '/education',
    responses: {
      200: success(z.array(educationSchema)),
    },
  },
})

export const servicesContract = c.router({
  list: {
    method: 'GET',
    path: '/services',
    responses: {
      200: success(z.array(serviceSchema)),
    },
  },
})

export const testimonialsContract = c.router({
  list: {
    method: 'GET',
    path: '/testimonials',
    responses: {
      200: success(z.array(testimonialSchema)),
    },
  },
})

export const blogContract = c.router({
  list: {
    method: 'GET',
    path: '/blog',
    responses: {
      200: success(z.array(blogPostListSchema)),
    },
  },
  getBySlug: {
    method: 'GET',
    path: '/blog/:slug',
    pathParams: slugParamSchema,
    responses: {
      200: success(blogPostSchema),
      404: apiErrorSchema,
    },
  },
})

export const resumeContract = c.router({
  get: {
    method: 'GET',
    path: '/resume',
    responses: {
      200: success(
        z.object({
          url: z.string().nullable(),
          updatedAt: z.string().nullable(),
          defaultTemplate: resumeTemplateIdSchema,
        }),
      ),
    },
  },
  listTemplates: {
    method: 'GET',
    path: '/resume/templates',
    responses: {
      200: success(z.array(resumeTemplateMetaSchema)),
    },
  },
  getDocument: {
    method: 'GET',
    path: '/resume/document',
    responses: {
      200: success(resumeDocumentSchema),
      404: apiErrorSchema,
    },
  },
})

export const nowContract = c.router({
  get: {
    method: 'GET',
    path: '/now',
    responses: {
      200: success(z.object({ content: z.string().nullable() })),
    },
  },
})

export const contactContract = c.router({
  submit: {
    method: 'POST',
    path: '/contact',
    body: contactBodySchema,
    responses: {
      201: success(z.object({ id: z.string().uuid() })),
      400: apiErrorSchema,
      429: apiErrorSchema,
    },
  },
})

export const searchContract = c.router({
  search: {
    method: 'GET',
    path: '/search',
    query: searchQuerySchema,
    responses: {
      200: success(z.array(searchResultSchema)),
    },
  },
})

export const aiContract = c.router({
  chat: {
    method: 'POST',
    path: '/ai/chat',
    body: aiChatBodySchema,
    responses: {
      200: success(aiResponseSchema),
      400: apiErrorSchema,
      429: apiErrorSchema,
    },
  },
})

export const personalDocumentsContract = c.router({
  access: {
    method: 'GET',
    path: '/personal-documents/access',
    query: personalDocAccessQuerySchema,
    responses: {
      200: success(z.array(personalDocumentPublicSchema)),
      401: apiErrorSchema,
      400: apiErrorSchema,
    },
  },
})

export const contract = c.router({
  health: healthContract,
  site: siteContract,
  projects: projectsContract,
  skills: skillsContract,
  experience: experienceContract,
  education: educationContract,
  services: servicesContract,
  testimonials: testimonialsContract,
  blog: blogContract,
  resume: resumeContract,
  now: nowContract,
  contact: contactContract,
  search: searchContract,
  ai: aiContract,
  personalDocuments: personalDocumentsContract,
  admin: adminContract,
})

export type AppContract = typeof contract
export { adminContract }
