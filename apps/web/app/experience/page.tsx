import CyberPage from '@/features/cyber/cyber-page'
import CyberExperiencePage from '@/features/cyber/pages/cyber-experience-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Experience — Rakesh',
  description: 'Professional experience and roles.',
  path: '/experience',
})

export default async function ExperiencePage() {
  const [brandName, expRes, resumeRes] = await Promise.all([
    getSiteBrandName(),
    apiClient.experience.list(),
    apiClient.resume.get(),
  ])
  const items = expRes.status === 200 && expRes.body.success ? expRes.body.data : []
  const resume =
    resumeRes.status === 200 && resumeRes.body.success ? resumeRes.body.data : null

  return (
    <CyberPage brandName={brandName}>
      <CyberExperiencePage items={items} resumeUrl={resume?.url ?? null} />
    </CyberPage>
  )
}
