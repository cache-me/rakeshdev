import ProjectsPageClient from './projects-page-client'
import { createPageMetadata } from '@/lib/seo'
import { homeFallback } from '@/lib/home-fallback'

export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: 'Projects — Rakesh',
  description: 'Selected projects across full-stack engineering, 3D, and AI-powered UX.',
  path: '/projects',
})

export default function ProjectsPage() {
  return <ProjectsPageClient brandName={homeFallback.brandName} />
}
