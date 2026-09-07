import type { AdminNavItem } from './admin-nav'

export type AdminCrudTab = {
  href: string
  label: string
  short: string
}

/** Top tabs on CRUD screens — cross-links between portfolio record types. */
export const adminCrudTabs: AdminCrudTab[] = [
  { href: '/admin/projects', label: 'PROJECT ARCHIVES', short: 'PRJ' },
  { href: '/admin/experience', label: 'EXPERIENCE & ROLES', short: 'EXP' },
  { href: '/admin/education', label: 'EDUCATION & DEGREES', short: 'EDU' },
  { href: '/admin/blog', label: 'ARTICLES & DISPATCHES', short: 'ART' },
]

export const directiveNav: Pick<AdminNavItem, 'href' | 'bracket'>[] = [
  { href: '/admin', bracket: 'OVERVIEW / HUD' },
  { href: '/admin/projects', bracket: 'PROJECTS_CMS' },
  { href: '/admin/experience', bracket: 'EXPERIENCE_CMS' },
  { href: '/admin/education', bracket: 'EDUCATION_CMS' },
  { href: '/admin/skills', bracket: 'SKILLS_MATRIX' },
  { href: '/admin/blog', bracket: 'ARTICLES_CMS' },
  { href: '/admin/messages', bracket: 'TELEMETRY_DEPLOY' },
]
