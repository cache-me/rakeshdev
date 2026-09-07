import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 120 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  tagline: text('tagline').notNull(),
  bio: text('bio').notNull(),
  heroIntro: text('hero_intro').notNull(),
  profileImageUrl: text('profile_image_url'),
  resumeUrl: text('resume_url'),
  email: varchar('email', { length: 254 }),
  location: varchar('location', { length: 120 }),
  availability: text('availability'),
  nowContent: text('now_content'),
  socialLinks: text('social_links').notNull().default('{}'),
  seoTitle: varchar('seo_title', { length: 200 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 120 }).notNull(),
    category: varchar('category', { length: 80 }).notNull(),
    proficiency: integer('proficiency').notNull().default(3),
    sortOrder: integer('sort_order').notNull().default(0),
    searchText: text('search_text').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('skills_category_idx').on(t.category)],
)

export const experience = pgTable(
  'experience',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company: varchar('company', { length: 200 }).notNull(),
    role: varchar('role', { length: 200 }).notNull(),
    location: varchar('location', { length: 120 }),
    startDate: varchar('start_date', { length: 20 }).notNull(),
    endDate: varchar('end_date', { length: 20 }),
    current: boolean('current').notNull().default(false),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    searchText: text('search_text').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('experience_sort_idx').on(t.sortOrder)],
)

export const education = pgTable('education', {
  id: uuid('id').primaryKey().defaultRandom(),
  institution: varchar('institution', { length: 200 }).notNull(),
  degree: varchar('degree', { length: 200 }).notNull(),
  startDate: varchar('start_date', { length: 20 }),
  endDate: varchar('end_date', { length: 20 }),
  description: text('description'),
  qualificationType: varchar('qualification_type', { length: 40 }).notNull().default('degree'),
  boardOrIssuer: varchar('board_or_issuer', { length: 200 }),
  resultSummary: text('result_summary'),
  certificateUrl: text('certificate_url'),
  subjectsJson: text('subjects_json').notNull().default('[]'),
  metricsJson: text('metrics_json').notNull().default('{}'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('categories_slug_idx').on(t.slug)],
)

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 200 }).notNull().unique(),
    summary: text('summary').notNull(),
    body: text('body').notNull(),
    featured: boolean('featured').notNull().default(false),
    status: varchar('status', { length: 40 }).notNull().default('published'),
    coverImageUrl: text('cover_image_url'),
    demoUrl: text('demo_url'),
    repoUrl: text('repo_url'),
    startedAt: varchar('started_at', { length: 20 }),
    completedAt: varchar('completed_at', { length: 20 }),
    sortOrder: integer('sort_order').notNull().default(0),
    searchText: text('search_text').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('projects_slug_idx').on(t.slug),
    index('projects_featured_idx').on(t.featured),
  ],
)

export const projectTechnologies = pgTable(
  'project_technologies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    technology: varchar('technology', { length: 80 }).notNull(),
  },
  (t) => [index('project_tech_project_idx').on(t.projectId)],
)

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  iconKey: varchar('icon_key', { length: 80 }),
  sortOrder: integer('sort_order').notNull().default(0),
  searchText: text('search_text').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  author: varchar('author', { length: 120 }).notNull(),
  role: varchar('role', { length: 120 }),
  quote: text('quote').notNull(),
  avatarUrl: text('avatar_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 200 }).notNull().unique(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    coverImageUrl: text('cover_image_url'),
    searchText: text('search_text').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('blog_posts_slug_idx').on(t.slug)],
)

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  ipHash: varchar('ip_hash', { length: 64 }),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull(),
  messages: text('messages').notNull().default('[]'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const projectsRelations = relations(projects, ({ many }) => ({
  technologies: many(projectTechnologies),
}))

export const projectTechnologiesRelations = relations(projectTechnologies, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechnologies.projectId],
    references: [projects.id],
  }),
}))
