import CyberPage from '@/features/cyber/cyber-page'
import CyberProjectsPage from '@/features/cyber/pages/cyber-projects-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Projects — Rakesh',
  description: 'Selected projects across full-stack engineering, 3D, and AI-powered UX.',
  path: '/projects',
})

export default async function ProjectsPage() {
  const [brandName, res] = await Promise.all([
    getSiteBrandName(),
    apiClient.projects.list({ query: {} }),
  ])
  const projects = res.status === 200 && res.body.success ? res.body.data : []

  return (
    <CyberPage brandName={brandName}>
      <CyberProjectsPage projects={projects} />
    </CyberPage>
  )
}
