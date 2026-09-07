import CyberPage from '@/features/cyber/cyber-page'
import CyberSkillsPage from '@/features/cyber/pages/cyber-skills-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Skills — Rakesh',
  description: 'Technical skills and technology stack.',
  path: '/skills',
})

export default async function SkillsPage() {
  const [brandName, res] = await Promise.all([getSiteBrandName(), apiClient.skills.list()])
  const skills = res.status === 200 && res.body.success ? res.body.data : []

  return (
    <CyberPage brandName={brandName}>
      <CyberSkillsPage skills={skills} />
    </CyberPage>
  )
}
