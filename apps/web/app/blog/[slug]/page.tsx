import { notFound } from 'next/navigation'

import { CyberOutlineLink } from '@/features/cyber/cyber-buttons'
import CyberPage from '@/features/cyber/cyber-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const res = await apiClient.blog.getBySlug({ params: { slug } })
  if (res.status !== 200 || !res.body.success) {
    return createPageMetadata({ title: 'Blog', description: 'Article', path: '/blog' })
  }
  return createPageMetadata({
    title: `${res.body.data.title} — Rakesh`,
    description: res.body.data.excerpt,
    path: `/blog/${slug}`,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [brandName, res] = await Promise.all([
    getSiteBrandName(),
    apiClient.blog.getBySlug({ params: { slug } }),
  ])
  if (res.status !== 200 || !res.body.success) notFound()
  const post = res.body.data

  return (
    <CyberPage brandName={brandName}>
      <article className="mx-auto max-w-3xl px-4 pb-8 md:px-8">
        <CyberOutlineLink href="/blog" className="text-[0.65rem]">
          ← Back to signal logs
        </CyberOutlineLink>
        <p className="mt-6 hud-label text-[var(--cyber-accent)]">DISPATCH // READ</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{post.title}</h1>
        <p className="mt-4 text-[var(--cyber-muted)]">{post.excerpt}</p>
        <div className="mt-10 whitespace-pre-wrap text-sm leading-relaxed text-[var(--cyber-muted)]">
          {post.content}
        </div>
      </article>
    </CyberPage>
  )
}
