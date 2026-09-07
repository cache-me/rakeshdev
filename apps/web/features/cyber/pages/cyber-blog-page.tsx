import Link from 'next/link'
import { ArrowRight, ChevronRight, Radio } from 'lucide-react'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string | null
  category: string | null
}

export default function CyberBlogPage({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 md:px-8">
      <div className="mb-10">
        <p className="hud-label text-[var(--cyber-accent)]">SIGNAL_LOGS</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
          // DISPATCHES
        </h1>
      </div>

      {featured ? (
        <article className="mb-10 grid gap-6 hud-panel overflow-hidden lg:grid-cols-[1.2fr_1fr]">
          <div className="min-h-[220px] bg-gradient-to-br from-[#0f1419] to-[#1a2332]" />
          <div className="flex flex-col p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)]">
              Featured Dispatch
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{featured.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--cyber-muted)]">
              {featured.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.category ? (
                <span className="cyber-tag">{featured.category}</span>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end">
              <CyberPrimaryLink href={`/blog/${featured.slug}`}>
                Read Dispatch
                <ChevronRight className="size-4" />
              </CyberPrimaryLink>
            </div>
          </div>
        </article>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {rest.map((post) => (
            <article key={post.id} className="hud-panel p-5">
              <h2 className="text-lg font-semibold text-white">{post.title}</h2>
              <p className="mt-2 text-sm text-[var(--cyber-muted)]">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.category ? <span className="cyber-tag">{post.category}</span> : null}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)] hover:underline"
              >
                Read Entry
                <ArrowRight className="size-3" />
              </Link>
            </article>
          ))}
        </div>

        <aside className="hud-panel h-fit p-5">
          <p className="hud-label text-white">Subscribe_to_Signal</p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--cyber-muted)]">
            Uplink for architecture notes, performance audits, and shipping logs.
          </p>
          <CyberPrimaryLink href="/contact" className="mt-5 w-full">
            <Radio className="size-4" />
            Establish Uplink
          </CyberPrimaryLink>
        </aside>
      </div>

      {posts.length > 1 ? (
        <div className="mt-10 flex justify-end">
          <CyberOutlineLink href="/blog">Next Page</CyberOutlineLink>
        </div>
      ) : null}
    </div>
  )
}
