import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import {
  adminBlogBodySchema,
  adminEducationBodySchema,
  adminExperienceBodySchema,
  adminProjectBodySchema,
  adminServiceBodySchema,
  adminSiteSettingsBodySchema,
  adminSkillBodySchema,
  adminTestimonialBodySchema,
  apiErrorSchema,
  createPersonalDocTokenBodySchema,
  idParamSchema,
  personalDocTokenAdminSchema,
  personalDocTokenCreatedSchema,
  personalDocumentAdminSchema,
} from '@portfolio/validation'

const c = initContract()

const success = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.literal(true), data })

const unauthorized = apiErrorSchema

export const adminContract = c.router({
  listProjects: {
    method: 'GET',
    path: '/admin/projects',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createProject: {
    method: 'POST',
    path: '/admin/projects',
    body: adminProjectBodySchema,
    responses: {
      201: success(z.object({ id: z.string().uuid() })),
      401: unauthorized,
    },
  },
  updateProject: {
    method: 'PUT',
    path: '/admin/projects/:id',
    pathParams: idParamSchema,
    body: adminProjectBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteProject: {
    method: 'DELETE',
    path: '/admin/projects/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listSkills: {
    method: 'GET',
    path: '/admin/skills',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createSkill: {
    method: 'POST',
    path: '/admin/skills',
    body: adminSkillBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateSkill: {
    method: 'PUT',
    path: '/admin/skills/:id',
    pathParams: idParamSchema,
    body: adminSkillBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteSkill: {
    method: 'DELETE',
    path: '/admin/skills/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listExperience: {
    method: 'GET',
    path: '/admin/experience',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createExperience: {
    method: 'POST',
    path: '/admin/experience',
    body: adminExperienceBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateExperience: {
    method: 'PUT',
    path: '/admin/experience/:id',
    pathParams: idParamSchema,
    body: adminExperienceBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteExperience: {
    method: 'DELETE',
    path: '/admin/experience/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listEducation: {
    method: 'GET',
    path: '/admin/education',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createEducation: {
    method: 'POST',
    path: '/admin/education',
    body: adminEducationBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateEducation: {
    method: 'PUT',
    path: '/admin/education/:id',
    pathParams: idParamSchema,
    body: adminEducationBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteEducation: {
    method: 'DELETE',
    path: '/admin/education/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listServices: {
    method: 'GET',
    path: '/admin/services',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createService: {
    method: 'POST',
    path: '/admin/services',
    body: adminServiceBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateService: {
    method: 'PUT',
    path: '/admin/services/:id',
    pathParams: idParamSchema,
    body: adminServiceBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteService: {
    method: 'DELETE',
    path: '/admin/services/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listTestimonials: {
    method: 'GET',
    path: '/admin/testimonials',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createTestimonial: {
    method: 'POST',
    path: '/admin/testimonials',
    body: adminTestimonialBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateTestimonial: {
    method: 'PUT',
    path: '/admin/testimonials/:id',
    pathParams: idParamSchema,
    body: adminTestimonialBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteTestimonial: {
    method: 'DELETE',
    path: '/admin/testimonials/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listBlogPosts: {
    method: 'GET',
    path: '/admin/blog',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  createBlogPost: {
    method: 'POST',
    path: '/admin/blog',
    body: adminBlogBodySchema,
    responses: { 201: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  updateBlogPost: {
    method: 'PUT',
    path: '/admin/blog/:id',
    pathParams: idParamSchema,
    body: adminBlogBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  deleteBlogPost: {
    method: 'DELETE',
    path: '/admin/blog/:id',
    pathParams: idParamSchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  getSiteSettings: {
    method: 'GET',
    path: '/admin/site-settings',
    responses: { 200: success(z.any()), 401: unauthorized },
  },
  updateSiteSettings: {
    method: 'PUT',
    path: '/admin/site-settings',
    body: adminSiteSettingsBodySchema,
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listContactMessages: {
    method: 'GET',
    path: '/admin/contact-messages',
    responses: { 200: success(z.array(z.any())), 401: unauthorized },
  },
  markContactRead: {
    method: 'PATCH',
    path: '/admin/contact-messages/:id/read',
    pathParams: idParamSchema,
    body: z.object({ read: z.boolean() }),
    responses: { 200: success(z.object({ id: z.string().uuid() })), 401: unauthorized },
  },
  listPersonalDocuments: {
    method: 'GET',
    path: '/admin/personal-documents',
    responses: {
      200: success(z.array(personalDocumentAdminSchema)),
      401: unauthorized,
    },
  },
  createPersonalDocumentToken: {
    method: 'POST',
    path: '/admin/personal-documents/tokens',
    body: createPersonalDocTokenBodySchema,
    responses: {
      201: success(
        personalDocTokenCreatedSchema.extend({
          id: z.string().uuid(),
          shareUrl: z.string(),
        }),
      ),
      401: unauthorized,
    },
  },
  listPersonalDocumentTokens: {
    method: 'GET',
    path: '/admin/personal-documents/tokens',
    responses: {
      200: success(z.array(personalDocTokenAdminSchema)),
      401: unauthorized,
    },
  },
  revokePersonalDocumentToken: {
    method: 'DELETE',
    path: '/admin/personal-documents/tokens/:id',
    pathParams: idParamSchema,
    responses: {
      200: success(z.object({ id: z.string().uuid() })),
      401: unauthorized,
    },
  },
})

export type AdminContract = typeof adminContract
