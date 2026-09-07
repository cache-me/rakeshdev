import CyberAboutPage from '@/features/cyber/pages/cyber-about-page'
import CyberPage from '@/features/cyber/cyber-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'About — Rakesh',
  description:
    'About Rakesh — full-stack developer and creative technologist building fast, intelligent, immersive web experiences and AI-powered systems.',
  path: '/about',
})

export default async function AboutPage() {
  const [brandName, res] = await Promise.all([getSiteBrandName(), apiClient.site.getSettings()])
  const settings = res.status === 200 && res.body.success ? res.body.data : null
  const name = settings?.name ?? brandName ?? 'Rakesh'

  return (
    <CyberPage brandName={brandName}>
      <CyberAboutPage name={name} location={settings?.location} />
    </CyberPage>
  )
}
