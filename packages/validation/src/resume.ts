import { z } from 'zod'

export const RESUME_TEMPLATE_IDS = [
  'navy-orange-pro',
  'white-classic',
  'white-serif',
  'white-minimal',
  'teal-center',
  'maroon-center',
  'blue-margin',
  'slate-columns',
  'gray-sidebar',
  'mauve-banner',
  'yellow-sidebar',
  'teal-sidebar',
  'teal-photo',
] as const

export type ResumeTemplateId = (typeof RESUME_TEMPLATE_IDS)[number]

export const resumeTemplateIdSchema = z.enum(RESUME_TEMPLATE_IDS)

export const resumePdfQuerySchema = z.object({
  template: resumeTemplateIdSchema.optional().default('navy-orange-pro'),
})

export const resumeTemplateMetaSchema = z.object({
  id: resumeTemplateIdSchema,
  name: z.string(),
  category: z.enum(['white', 'color']),
  description: z.string(),
  accent: z.string(),
})

export const resumeMoreInfoSchema = z.object({
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
})

export const resumeCertificationSchema = z.object({
  title: z.string(),
  year: z.string().nullable(),
  institution: z.string(),
})

export const resumeDocumentSchema = z.object({
  name: z.string(),
  title: z.string(),
  summary: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  linkedIn: z.string().nullable(),
  location: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  hobbies: z.array(z.string()),
  moreInfo: resumeMoreInfoSchema.nullable(),
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      proficiency: z.number(),
    }),
  ),
  languages: z.array(
    z.object({
      name: z.string(),
      proficiency: z.number(),
    }),
  ),
  personalSkills: z.array(
    z.object({
      name: z.string(),
      proficiency: z.number(),
    }),
  ),
  certifications: z.array(resumeCertificationSchema),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      location: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      current: z.boolean(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      description: z.string().nullable(),
    }),
  ),
  generatedAt: z.string(),
})
