import CyberPage from '@/features/cyber/cyber-page'
import CyberBlogPage from '@/features/cyber/pages/cyber-blog-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Blog — Rakesh',
  description: 'Articles on web performance, 3D, and AI product UX.',
  path: '/blog',
})

export default async function BlogPage() {
  const [brandName, res] = await Promise.all([getSiteBrandName(), apiClient.blog.list()])
  const posts = res.status === 200 && res.body.success ? res.body.data : []

  return (
    <CyberPage brandName={brandName}>
      <CyberBlogPage posts={posts} />
    </CyberPage>
  )
}
