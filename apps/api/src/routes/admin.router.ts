import { contract } from '@portfolio/contracts'

import { tsr } from '../lib/ts-rest-hono.js'
import { requireAdminSession } from '../lib/session.js'
import {
  createAccessToken,
  listAccessTokensAdmin,
  listPersonalDocumentsAdmin,
  revokeAccessToken,
} from '../services/personal-document.service.js'

function guard(ctx: { request: Request }) {
  return requireAdminSession(ctx.request)
}

export const adminRouter = tsr.router(contract.admin, {
  listProjects: async function listProjectsAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const data = await adminService.listProjectsAdmin()
    return { status: 200, body: { success: true as const, data } }
  },
  createProject: async function createProjectAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createProject(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateProject: async function updateProjectAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateProject(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteProject: async function deleteProjectAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteProject(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listSkills: async function listSkillsAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listSkills() },
    }
  },
  createSkill: async function createSkillAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createSkill(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateSkill: async function updateSkillAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateSkill(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteSkill: async function deleteSkillAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteSkill(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listExperience: async function listExperienceAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listExperience() },
    }
  },
  createExperience: async function createExperienceAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createExperience(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateExperience: async function updateExperienceAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateExperience(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteExperience: async function deleteExperienceAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteExperience(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listEducation: async function listEducationAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listEducation() },
    }
  },
  createEducation: async function createEducationAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createEducation(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateEducation: async function updateEducationAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateEducation(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteEducation: async function deleteEducationAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteEducation(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listServices: async function listServicesAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listServices() },
    }
  },
  createService: async function createServiceAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createService(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateService: async function updateServiceAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateService(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteService: async function deleteServiceAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteService(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listTestimonials: async function listTestimonialsAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listTestimonials() },
    }
  },
  createTestimonial: async function createTestimonialAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createTestimonial(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateTestimonial: async function updateTestimonialAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateTestimonial(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteTestimonial: async function deleteTestimonialAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteTestimonial(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  listBlogPosts: async function listBlogPostsAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listBlogPosts() },
    }
  },
  createBlogPost: async function createBlogPostAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.createBlogPost(body)
    return { status: 201, body: { success: true as const, data: { id: row!.id } } }
  },
  updateBlogPost: async function updateBlogPostAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateBlogPost(params.id, body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  deleteBlogPost: async function deleteBlogPostAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await adminService.deleteBlogPost(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
  getSiteSettings: async function getSiteSettingsAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.getSiteSettings()
    if (!row) {
      return {
        status: 404,
        body: {
          success: false as const,
          error: { code: 'NOT_FOUND', message: 'Settings not found' },
        },
      }
    }
    let socialLinks: Record<string, string> = {}
    try {
      socialLinks = JSON.parse(row.socialLinks) as Record<string, string>
    } catch {
      socialLinks = {}
    }
    return {
      status: 200,
      body: { success: true as const, data: { ...row, socialLinks } },
    }
  },
  updateSiteSettings: async function updateSiteSettingsAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.updateSiteSettings(body)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  listContactMessages: async function listContactMessagesAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await adminService.listContactMessages() },
    }
  },
  markContactRead: async function markContactReadAdmin({ params, body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const row = await adminService.markContactRead(params.id, body.read)
    return { status: 200, body: { success: true as const, data: { id: row!.id } } }
  },
  listPersonalDocuments: async function listPersonalDocumentsAdminHandler(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await listPersonalDocumentsAdmin() },
    }
  },
  createPersonalDocumentToken: async function createPersonalDocumentTokenAdmin({ body }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    const created = await createAccessToken({
      expiresInMinutes: body.expiresInMinutes,
      label: body.label,
      createdByUserId: auth.session.user.id,
    })
    return {
      status: 201,
      body: {
        success: true as const,
        data: {
          id: created.id,
          token: created.token,
          expiresAt: created.expiresAt,
          sharePath: created.sharePath,
          shareUrl: created.shareUrl,
        },
      },
    }
  },
  listPersonalDocumentTokens: async function listPersonalDocumentTokensAdmin(_, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    return {
      status: 200,
      body: { success: true as const, data: await listAccessTokensAdmin() },
    }
  },
  revokePersonalDocumentToken: async function revokePersonalDocumentTokenAdmin({ params }, ctx) {
    const auth = await guard(ctx)
    if (!auth.ok) return auth.response
    await revokeAccessToken(params.id)
    return { status: 200, body: { success: true as const, data: { id: params.id } } }
  },
})
