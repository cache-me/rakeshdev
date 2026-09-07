import { eq } from 'drizzle-orm'

import {
  blogPosts,
  contactMessages,
  education,
  experience,
  projectTechnologies,
  projects,
  services,
  siteSettings,
  skills,
  testimonials,
} from '@portfolio/db'

import { db } from '../lib/db.js'

function slugifySearchText(...parts: string[]) {
  return parts.join(' ').toLowerCase()
}

type ProjectInput = {
  title: string
  slug: string
  summary: string
  body: string
  featured: boolean
  status: string
  coverImageUrl?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  startedAt?: string | null
  completedAt?: string | null
  sortOrder: number
  technologies: string[]
}

export const adminService = {
  async listProjectsAdmin() {
    const rows = await db.select().from(projects).orderBy(projects.sortOrder)
    return Promise.all(
      rows.map(async (p) => {
        const techs = await db
          .select()
          .from(projectTechnologies)
          .where(eq(projectTechnologies.projectId, p.id))
        return { ...p, technologies: techs.map((t) => t.technology) }
      }),
    )
  },

  async createProject(input: ProjectInput) {
    const searchText = slugifySearchText(input.title, input.summary, ...input.technologies)
    const [row] = await db
      .insert(projects)
      .values({ ...input, searchText })
      .returning()
    if (row && input.technologies.length) {
      await db.insert(projectTechnologies).values(
        input.technologies.map((technology) => ({
          projectId: row.id,
          technology,
        })),
      )
    }
    return row
  },

  async updateProject(id: string, input: ProjectInput) {
    const searchText = slugifySearchText(input.title, input.summary, ...input.technologies)
    const [row] = await db
      .update(projects)
      .set({ ...input, searchText, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()
    await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, id))
    if (input.technologies.length) {
      await db.insert(projectTechnologies).values(
        input.technologies.map((technology) => ({ projectId: id, technology })),
      )
    }
    return row
  },

  async deleteProject(id: string) {
    await db.delete(projects).where(eq(projects.id, id))
  },

  listSkills: () => db.select().from(skills).orderBy(skills.sortOrder),
  createSkill: (input: typeof skills.$inferInsert) =>
    db
      .insert(skills)
      .values({
        ...input,
        searchText: slugifySearchText(input.name, input.category),
      })
      .returning()
      .then((r) => r[0]),
  updateSkill: (id: string, input: typeof skills.$inferInsert) =>
    db
      .update(skills)
      .set({
        ...input,
        searchText: slugifySearchText(input.name, input.category),
        updatedAt: new Date(),
      })
      .where(eq(skills.id, id))
      .returning()
      .then((r) => r[0]),
  deleteSkill: (id: string) => db.delete(skills).where(eq(skills.id, id)),

  listExperience: () => db.select().from(experience).orderBy(experience.sortOrder),
  createExperience: (input: typeof experience.$inferInsert) =>
    db
      .insert(experience)
      .values({
        ...input,
        searchText: slugifySearchText(input.company, input.role),
      })
      .returning()
      .then((r) => r[0]),
  updateExperience: (id: string, input: typeof experience.$inferInsert) =>
    db
      .update(experience)
      .set({
        ...input,
        searchText: slugifySearchText(input.company, input.role),
        updatedAt: new Date(),
      })
      .where(eq(experience.id, id))
      .returning()
      .then((r) => r[0]),
  deleteExperience: (id: string) => db.delete(experience).where(eq(experience.id, id)),

  listEducation: () => db.select().from(education).orderBy(education.sortOrder),
  createEducation: (input: typeof education.$inferInsert) =>
    db.insert(education).values(input).returning().then((r) => r[0]),
  updateEducation: (id: string, input: typeof education.$inferInsert) =>
    db
      .update(education)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(education.id, id))
      .returning()
      .then((r) => r[0]),
  deleteEducation: (id: string) => db.delete(education).where(eq(education.id, id)),

  listServices: () => db.select().from(services).orderBy(services.sortOrder),
  createService: (input: typeof services.$inferInsert) =>
    db
      .insert(services)
      .values({
        ...input,
        searchText: slugifySearchText(input.title, input.description),
      })
      .returning()
      .then((r) => r[0]),
  updateService: (id: string, input: typeof services.$inferInsert) =>
    db
      .update(services)
      .set({
        ...input,
        searchText: slugifySearchText(input.title, input.description),
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning()
      .then((r) => r[0]),
  deleteService: (id: string) => db.delete(services).where(eq(services.id, id)),

  listTestimonials: () => db.select().from(testimonials).orderBy(testimonials.sortOrder),
  createTestimonial: (input: typeof testimonials.$inferInsert) =>
    db.insert(testimonials).values(input).returning().then((r) => r[0]),
  updateTestimonial: (id: string, input: typeof testimonials.$inferInsert) =>
    db
      .update(testimonials)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning()
      .then((r) => r[0]),
  deleteTestimonial: (id: string) => db.delete(testimonials).where(eq(testimonials.id, id)),

  listBlogPosts: () => db.select().from(blogPosts).orderBy(blogPosts.publishedAt),
  createBlogPost: (input: {
    title: string
    slug: string
    excerpt: string
    content: string
    coverImageUrl?: string | null
    publishedAt?: string | null
  }) =>
    db
      .insert(blogPosts)
      .values({
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
        searchText: slugifySearchText(input.title, input.excerpt),
      })
      .returning()
      .then((r) => r[0]),
  updateBlogPost: (
    id: string,
    input: {
      title: string
      slug: string
      excerpt: string
      content: string
      coverImageUrl?: string | null
      publishedAt?: string | null
    },
  ) =>
    db
      .update(blogPosts)
      .set({
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        searchText: slugifySearchText(input.title, input.excerpt),
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()
      .then((r) => r[0]),
  deleteBlogPost: (id: string) => db.delete(blogPosts).where(eq(blogPosts.id, id)),

  getSiteSettings: () => db.select().from(siteSettings).limit(1).then((r) => r[0]),
  updateSiteSettings: (input: {
    name: string
    title: string
    tagline: string
    bio: string
    heroIntro: string
    profileImageUrl?: string | null
    resumeUrl?: string | null
    email?: string | null
    location?: string | null
    availability?: string | null
    nowContent?: string | null
    socialLinks: Record<string, string>
    seoTitle?: string | null
    seoDescription?: string | null
  }) =>
    db
      .update(siteSettings)
      .set({
        ...input,
        socialLinks: JSON.stringify(input.socialLinks),
        updatedAt: new Date(),
      })
      .returning()
      .then((r) => r[0]),

  listContactMessages: () =>
    db.select().from(contactMessages).orderBy(contactMessages.createdAt),
  markContactRead: (id: string, read: boolean) =>
    db
      .update(contactMessages)
      .set({ read })
      .where(eq(contactMessages.id, id))
      .returning()
      .then((r) => r[0]),
}
