import { createHash } from 'node:crypto'

import { contract } from '@portfolio/contracts'

import { tsr } from '../lib/ts-rest-hono.js'
import { adminRouter } from './admin.router.js'
import { RESUME_TEMPLATES } from '@portfolio/resume'

import { aiService } from '../services/ai.service.js'
import { sendContactEmail } from '../services/email.service.js'
import { buildResumeDocument } from '../services/resume.service.js'
import {
  createContactMessage,
  getBlogPostBySlug,
  getHomeBootstrap,
  getProjectBySlug,
  getSiteSettings,
  listBlogPosts,
  listEducation,
  listExperience,
  listProjects,
  listServices,
  listSkills,
  listTestimonials,
  searchPortfolio,
} from '../services/portfolio.service.js'
import { listDocumentsForToken } from '../services/personal-document.service.js'

const contactRate = new Map<string, { count: number; resetAt: number }>()

function rateLimitContact(ip: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const entry = contactRate.get(ip)
  if (!entry || entry.resetAt < now) {
    contactRate.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }
  entry.count += 1
  return entry.count > limit
}

export const apiRouter = tsr.router(contract, {
  health: {
    check: async function healthCheck() {
      return { status: 200, body: { ok: true as const } }
    },
  },
  site: {
    getSettings: async function getSettings() {
      const settings = await getSiteSettings()
      if (!settings) {
        return {
          status: 404,
          body: {
            success: false as const,
            error: { code: 'NOT_FOUND', message: 'Site settings not found' },
          },
        }
      }
      const { socialLinks, ...rest } = settings
      return {
        status: 200,
        body: {
          success: true as const,
          data: { ...rest, socialLinks },
        },
      }
    },
    getHome: async function getHome({ query }) {
      const featured = query?.featured ?? true
      const data = await getHomeBootstrap(featured)
      return { status: 200, body: { success: true as const, data } }
    },
  },
  projects: {
    list: async function listProjectsHandler({ query }) {
      const data = await listProjects(query?.featured)
      return { status: 200, body: { success: true as const, data } }
    },
    getBySlug: async function getProjectHandler({ params }) {
      const project = await getProjectBySlug(params.slug)
      if (!project) {
        return {
          status: 404,
          body: {
            success: false as const,
            error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
          },
        }
      }
      return { status: 200, body: { success: true as const, data: project } }
    },
  },
  skills: {
    list: async function listSkillsHandler() {
      const data = await listSkills()
      return { status: 200, body: { success: true as const, data } }
    },
  },
  experience: {
    list: async function listExperienceHandler() {
      const data = await listExperience()
      return { status: 200, body: { success: true as const, data } }
    },
  },
  education: {
    list: async function listEducationHandler() {
      const data = await listEducation()
      return { status: 200, body: { success: true as const, data } }
    },
  },
  services: {
    list: async function listServicesHandler() {
      const data = await listServices()
      return { status: 200, body: { success: true as const, data } }
    },
  },
  testimonials: {
    list: async function listTestimonialsHandler() {
      const data = await listTestimonials()
      return { status: 200, body: { success: true as const, data } }
    },
  },
  blog: {
    list: async function listBlogHandler() {
      const data = await listBlogPosts()
      return { status: 200, body: { success: true as const, data } }
    },
    getBySlug: async function getBlogHandler({ params }) {
      const post = await getBlogPostBySlug(params.slug)
      if (!post) {
        return {
          status: 404,
          body: {
            success: false as const,
            error: { code: 'BLOG_NOT_FOUND', message: 'Blog post not found' },
          },
        }
      }
      return { status: 200, body: { success: true as const, data: post } }
    },
  },
  resume: {
    get: async function getResume() {
      const settings = await getSiteSettings()
      return {
        status: 200,
        body: {
          success: true as const,
          data: {
            url: settings?.resumeUrl ?? '/resume.pdf',
            updatedAt: settings?.updatedAt?.toISOString() ?? null,
            defaultTemplate: 'navy-orange-pro' as const,
          },
        },
      }
    },
    listTemplates: async function listResumeTemplates() {
      return { status: 200, body: { success: true as const, data: RESUME_TEMPLATES } }
    },
    getDocument: async function getResumeDocument() {
      const doc = await buildResumeDocument()
      if (!doc) {
        return {
          status: 404,
          body: {
            success: false as const,
            error: { code: 'NOT_FOUND', message: 'Resume data unavailable' },
          },
        }
      }
      return { status: 200, body: { success: true as const, data: doc } }
    },
  },
  now: {
    get: async function getNow() {
      const settings = await getSiteSettings()
      return {
        status: 200,
        body: {
          success: true as const,
          data: { content: settings?.nowContent ?? null },
        },
      }
    },
  },
  contact: {
    submit: async function submitContact({ body }, ctx) {
      const ip =
        ctx.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        'unknown'
      if (rateLimitContact(ip)) {
        return {
          status: 429,
          body: {
            success: false as const,
            error: { code: 'RATE_LIMITED', message: 'Too many requests' },
          },
        }
      }
      const ipHash = createHash('sha256').update(ip).digest('hex')
      const row = await createContactMessage({ ...body, ipHash })
      if (!row) {
        return {
          status: 400,
          body: {
            success: false as const,
            error: { code: 'CONTACT_FAILED', message: 'Could not send message' },
          },
        }
      }
      try {
        await sendContactEmail(body)
      } catch (err) {
        return {
          status: 502,
          body: {
            success: false as const,
            error: {
              code: 'EMAIL_FAILED',
              message:
                err instanceof Error ? err.message : 'Could not deliver email notification',
            },
          },
        }
      }
      return {
        status: 201,
        body: { success: true as const, data: { id: row.id } },
      }
    },
  },
  search: {
    search: async function searchHandler({ query }) {
      const data = await searchPortfolio(query.q, query.type ?? 'all')
      return { status: 200, body: { success: true as const, data } }
    },
  },
  ai: {
    chat: async function chatHandler({ body }) {
      const data = await aiService.answerQuestion(body.message, {
        personalDocumentToken: body.personalDocumentToken,
        personalDocumentContext: body.personalDocumentContext,
      })
      return { status: 200, body: { success: true as const, data } }
    },
  },
  personalDocuments: {
    access: async function personalDocumentsAccess({ query }) {
      const result = await listDocumentsForToken(query.token)
      if (!result.ok) {
        return {
          status: 401,
          body: {
            success: false as const,
            error: { code: result.code, message: result.message },
          },
        }
      }
      return { status: 200, body: { success: true as const, data: result.data } }
    },
  },
  admin: adminRouter,
})
