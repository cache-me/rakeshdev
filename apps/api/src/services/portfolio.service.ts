import {
  blogPosts,
  categories,
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
import { and, eq, ilike, or } from 'drizzle-orm'


import { db } from '../lib/db.js'

function parseSocialLinks(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

export async function getSiteSettings() {
  const rows = await db.select().from(siteSettings).limit(1)
  const row = rows[0]
  if (!row) return null
  return {
    ...row,
    socialLinks: parseSocialLinks(row.socialLinks),
  }
}

export async function listProjects(featured?: boolean) {
  const rows = await db
    .select()
    .from(projects)
    .where(
      featured === undefined
        ? eq(projects.status, 'published')
        : and(eq(projects.status, 'published'), eq(projects.featured, featured)),
    )
    .orderBy(projects.sortOrder)

  return Promise.all(
    rows.map(async (p) => {
      const techs = await db
        .select()
        .from(projectTechnologies)
        .where(eq(projectTechnologies.projectId, p.id))
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        featured: p.featured,
        coverImageUrl: p.coverImageUrl,
        demoUrl: p.demoUrl,
        repoUrl: p.repoUrl,
        technologies: techs.map((t) => t.technology),
        startedAt: p.startedAt,
        completedAt: p.completedAt,
      }
    }),
  )
}

export async function getProjectBySlug(slug: string) {
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
  const p = rows[0]
  if (!p) return null
  const techs = await db
    .select()
    .from(projectTechnologies)
    .where(eq(projectTechnologies.projectId, p.id))
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    body: p.body,
    featured: p.featured,
    coverImageUrl: p.coverImageUrl,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
    technologies: techs.map((t) => t.technology),
    startedAt: p.startedAt,
    completedAt: p.completedAt,
  }
}

export async function listSkills() {
  return db.select().from(skills).orderBy(skills.sortOrder)
}

export async function listExperience() {
  return db.select().from(experience).orderBy(experience.sortOrder)
}

import { mapEducationRow } from './education.mapper.js'

export async function listEducation() {
  const rows = await db.select().from(education).orderBy(education.sortOrder)
  return rows.map(mapEducationRow)
}

export async function listServices() {
  return db.select().from(services).orderBy(services.sortOrder)
}

export async function listTestimonials() {
  return db.select().from(testimonials).orderBy(testimonials.sortOrder)
}

export async function listBlogPosts() {
  const rows = await db.select().from(blogPosts).orderBy(blogPosts.publishedAt)
  return Promise.all(
    rows.map(async (post) => {
      let category: string | null = null
      if (post.categoryId) {
        const cat = await db
          .select()
          .from(categories)
          .where(eq(categories.id, post.categoryId))
          .limit(1)
        category = cat[0]?.name ?? null
      }
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        coverImageUrl: post.coverImageUrl,
        category,
      }
    }),
  )
}

export async function getBlogPostBySlug(slug: string) {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
  const post = rows[0]
  if (!post) return null
  let category: string | null = null
  if (post.categoryId) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.id, post.categoryId))
      .limit(1)
    category = cat[0]?.name ?? null
  }
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    coverImageUrl: post.coverImageUrl,
    category,
  }
}

export async function createContactMessage(input: {
  name: string
  email: string
  subject: string
  message: string
  ipHash?: string
}) {
  const [row] = await db.insert(contactMessages).values(input).returning()
  return row
}

export async function searchPortfolio(q: string, type: string) {
  const pattern = `%${q}%`
  const results: Array<{
    type: 'project' | 'skill' | 'experience' | 'blog' | 'service'
    id: string
    title: string
    slug?: string
    excerpt?: string
  }> = []

  if (type === 'all' || type === 'projects') {
    const rows = await db
      .select()
      .from(projects)
      .where(or(ilike(projects.title, pattern), ilike(projects.searchText, pattern)))
      .limit(10)
    for (const row of rows) {
      results.push({
        type: 'project',
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.summary,
      })
    }
  }

  if (type === 'all' || type === 'skills') {
    const rows = await db
      .select()
      .from(skills)
      .where(or(ilike(skills.name, pattern), ilike(skills.searchText, pattern)))
      .limit(10)
    for (const row of rows) {
      results.push({ type: 'skill', id: row.id, title: row.name })
    }
  }

  if (type === 'all' || type === 'experience') {
    const rows = await db
      .select()
      .from(experience)
      .where(
        or(ilike(experience.company, pattern), ilike(experience.searchText, pattern)),
      )
      .limit(10)
    for (const row of rows) {
      results.push({
        type: 'experience',
        id: row.id,
        title: `${row.role} at ${row.company}`,
      })
    }
  }

  if (type === 'all' || type === 'blog') {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(or(ilike(blogPosts.title, pattern), ilike(blogPosts.searchText, pattern)))
      .limit(10)
    for (const row of rows) {
      results.push({
        type: 'blog',
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
      })
    }
  }

  if (type === 'all' || type === 'services') {
    const rows = await db
      .select()
      .from(services)
      .where(or(ilike(services.title, pattern), ilike(services.searchText, pattern)))
      .limit(10)
    for (const row of rows) {
      results.push({
        type: 'service',
        id: row.id,
        title: row.title,
        excerpt: row.description,
      })
    }
  }

  return results
}

export async function getPortfolioContext() {
  const [settings, projectRows, skillRows, expRows, serviceRows, educationRows] =
    await Promise.all([
      getSiteSettings(),
      listProjects(),
      listSkills(),
      listExperience(),
      listServices(),
      listEducation(),
    ])
  return {
    settings,
    projects: projectRows,
    skills: skillRows,
    experience: expRows,
    services: serviceRows,
    education: educationRows,
  }
}
