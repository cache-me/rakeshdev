'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'
import { cn } from '@/lib/utils'

type Project = {
  id: string
  title: string
  slug: string
  summary: string
  coverImageUrl: string | null
  demoUrl: string | null
  technologies: string[]
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80',
  'https://images.unsplash.com/photo-1558591710-4bfb4a28203a?w=900&q=80',
]

const filterTags = ['ALL', '3D & SHADERS', 'FULL-STACK', 'AI & ML', 'MOBILE', 'DEVOPS'] as const

function projectMatchesFilter(project: Project, filter: string) {
  if (filter === 'ALL') return true
  const tech = project.technologies.join(' ').toLowerCase()
  const map: Record<string, string[]> = {
    '3D & SHADERS': ['three', 'webgl', '3d', 'glsl'],
    'FULL-STACK': ['next', 'react', 'hono', 'node', 'typescript'],
    'AI & ML': ['ai', 'openai', 'ml', 'llm'],
    MOBILE: ['mobile', 'react native', 'expo'],
    DEVOPS: ['docker', 'ci', 'nginx', 'aws'],
  }
  const keys = map[filter] ?? []
  return keys.some((k) => tech.includes(k))
}

export default function CyberProjectsPage({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('ALL')
  const filtered = useMemo(
    () => projects.filter((p) => projectMatchesFilter(p, filter)),
    [projects, filter],
  )

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hud-label text-white/70">[ PROJECT_GRID // DEPLOYMENTS ]</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            ARCHITECTURAL DEPLOYMENTS
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--cyber-muted)]">
            Production-focused systems spanning immersive frontends, typed APIs, and intelligent
            product experiences.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)]">
          ONLINE // {String(filtered.length).padStart(2, '0')} UNITS
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {filterTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter(tag)}
            className={cn(
              'rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition',
              filter === tag
                ? 'border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                : 'border-[var(--cyber-border)] text-[var(--cyber-muted)] hover:border-[var(--cyber-accent)]/50',
            )}
          >
            {tag}
            {tag === 'ALL' ? ` [${String(projects.length).padStart(2, '0')}]` : ''}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((project, idx) => (
          <article key={project.id} className="hud-panel overflow-hidden">
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[200px] bg-[#0f1419] md:min-h-[260px]">
                <Image
                  src={project.coverImageUrl ?? fallbackImages[idx % fallbackImages.length]!}
                  alt=""
                  fill
                  className="object-cover opacity-85"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-accent)]">
                  PROJECT // {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col p-5">
                <h2 className="text-lg font-semibold text-white">{project.title}</h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--cyber-muted)]">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="cyber-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <CyberPrimaryLink href={`/projects/${project.slug}`}>
                    Initialize Protocol
                    <ChevronRight className="size-4" />
                  </CyberPrimaryLink>
                  {project.demoUrl ? (
                    <CyberOutlineLink href={project.demoUrl} target="_blank" rel="noreferrer">
                      View Case Study
                      <ArrowUpRight className="size-3.5" />
                    </CyberOutlineLink>
                  ) : (
                    <CyberOutlineLink href={`/projects/${project.slug}`}>
                      View Case Study
                      <ArrowUpRight className="size-3.5" />
                    </CyberOutlineLink>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center font-mono text-sm text-[var(--cyber-muted)]">
          No deployments match this filter.
        </p>
      ) : null}
    </div>
  )
}
