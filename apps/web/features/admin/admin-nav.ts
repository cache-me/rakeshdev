export type AdminNavItem = {
  href: string
  label: string
  bracket: string
}

export const adminNav: AdminNavItem[] = [
  { href: '/admin', label: 'Overview', bracket: 'OVERVIEW / HUD' },
  { href: '/admin/projects', label: 'Projects', bracket: 'PROJECTS_CMS' },
  { href: '/admin/experience', label: 'Experience', bracket: 'EXPERIENCE_CMS' },
  { href: '/admin/education', label: 'Education', bracket: 'EDUCATION_CMS' },
  { href: '/admin/skills', label: 'Skills', bracket: 'SKILLS_MATRIX' },
  { href: '/admin/blog', label: 'Blog', bracket: 'ARTICLES_CMS' },
  { href: '/admin/messages', label: 'Messages', bracket: 'TELEMETRY_DEPLOY' },
  { href: '/admin/personal-documents', label: 'Personal docs', bracket: 'PRIVATE_VAULT' },
  { href: '/admin/settings', label: 'Settings', bracket: 'AI_COPILOT_CONFIG' },
  { href: '/admin/services', label: 'Services', bracket: 'SERVICES_GRID' },
  { href: '/admin/testimonials', label: 'Testimonials', bracket: 'SIGNAL_REVIEWS' },
]

export function adminNavLabel(pathname: string): string {
  const exact = adminNav.find((n) => n.href === pathname)
  if (exact) return exact.bracket
  const prefix = adminNav.find((n) => n.href !== '/admin' && pathname.startsWith(n.href))
  return prefix?.bracket ?? 'ADMIN_NODE'
}
