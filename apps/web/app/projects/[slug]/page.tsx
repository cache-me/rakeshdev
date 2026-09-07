import { notFound } from 'next/navigation'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'
import CyberPage from '@/features/cyber/cyber-page'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const res = await apiClient.projects.getBySlug({ params: { slug } })
  if (res.status !== 200 || !res.body.success) {
    return createPageMetadata({ title: 'Project', description: 'Project details', path: '/projects' })
  }
  return createPageMetadata({
    title: `${res.body.data.title} — Rakesh`,
    description: res.body.data.summary,
    path: `/projects/${slug}`,
  })
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const [brandName, res] = await Promise.all([
    getSiteBrandName(),
    apiClient.projects.getBySlug({ params: { slug } }),
  ])
  if (res.status !== 200 || !res.body.success) notFound()
  const project = res.body.data

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}/projects/${project.slug}`,
  }

  return (
    <CyberPage brandName={brandName}>
      <article className="mx-auto max-w-3xl px-4 pb-8 md:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CyberOutlineLink href="/projects" className="text-[0.65rem]">
          ← Back to grid
        </CyberOutlineLink>
        <p className="mt-6 hud-label text-white/70">[ PROJECT // {project.slug.toUpperCase()} ]</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{project.title}</h1>
        <p className="mt-4 text-lg text-[var(--cyber-muted)]">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="cyber-tag">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl ? (
            <CyberPrimaryLink href={project.demoUrl} target="_blank" rel="noreferrer">
              Launch Demo
            </CyberPrimaryLink>
          ) : null}
          <CyberOutlineLink href="/contact">Request Briefing</CyberOutlineLink>
        </div>
        <div className="mt-10 whitespace-pre-wrap text-sm leading-relaxed text-[var(--cyber-muted)]">
          {project.body}
        </div>
      </article>
    </CyberPage>
  )
}
