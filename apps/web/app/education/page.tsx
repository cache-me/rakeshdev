import CyberPage from '@/features/cyber/cyber-page'
import CyberEducationPage from '@/features/cyber/pages/cyber-education-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Education',
  description: 'Academic and professional qualifications with certificates and subject marks.',
  path: '/education',
})

export default async function EducationRoutePage() {
  const [brandName, res] = await Promise.all([
    getSiteBrandName(),
    apiClient.education.list(),
  ])
  const items = res.status === 200 && res.body.success ? res.body.data : []

  return (
    <CyberPage brandName={brandName}>
      <CyberEducationPage items={items} />
    </CyberPage>
  )
}
