'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Bot,
  Box,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react'

import { openAiAssistant } from '@/lib/open-ai-assistant'
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

type Experience = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
}

type Skill = {
  id: string
  name: string
  category: string
}

type Service = {
  id: string
  title: string
  description: string
}

export type CyberHomeProps = {
  brandName: string
  roleLabel: string
  headline: string
  heroDescription: string
  projects: Project[]
  experience: Experience[]
  skills: Skill[]
  services: Service[]
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/ai', label: 'AI Copilot' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' },
]

const projectFallbackImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1558591710-4bfb4a28203a?w=800&q=80',
]

export default function CyberHomePage({
  brandName,
  roleLabel,
  headline,
  heroDescription,
  projects,
  experience,
  skills,
  services,
}: CyberHomeProps) {
  const [stackMode, setStackMode] = useState<'frontend' | 'backend'>('frontend')
  const brandLogo = `${brandName.split(' ')[0]?.toUpperCase() ?? 'DEV'} ARCHITECT.IO`

  const frontendSkills = skills.filter((s) =>
    ['Frontend', '3D', 'Language'].includes(s.category),
  )
  const backendSkills = skills.filter((s) =>
    ['Backend', 'Database'].includes(s.category),
  )
  const displaySkills = stackMode === 'frontend' ? frontendSkills : backendSkills

  const featureCards =
    services.length >= 2
      ? services.slice(0, 2)
      : [
          {
            id: '1',
            title: 'Backend Architecture & Distributed Systems',
            description:
              'High-performance APIs, typed contracts, and resilient data layers engineered for scale.',
          },
          {
            id: '2',
            title: '3D Web & Spatial UI',
            description:
              'Immersive WebGL experiences with adaptive quality and cinematic interaction design.',
          },
        ]

  return (
    <div className="cyber-page cyber-grid-bg relative">
      <header className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-8">
        <Link href="/" className="text-sm font-bold tracking-[0.2em] text-white md:text-base">
          {brandLogo}
        </Link>
        <nav className="cyber-nav-pill flex max-w-[100vw] items-center gap-0.5 overflow-x-auto rounded-full px-1 py-1 lg:max-w-none lg:px-2 lg:py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)] transition hover:bg-[var(--cyber-accent-dim)] hover:text-[var(--cyber-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openAiAssistant()}
            className="cyber-btn-primary flex items-center gap-2 rounded px-4 py-2"
          >
            <Bot className="size-4" />
            AI HUD
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded border border-[var(--cyber-border)] text-[var(--cyber-accent)]"
            aria-label="Terminal"
          >
            <Terminal className="size-4" />
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1400px] gap-6 px-4 pb-16 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="hud-panel p-6 md:p-10 lg:min-h-[420px]">
          <p className="hud-label mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[var(--cyber-muted)]">[</span>
            MOD_V01 // VER 1.0
            <span className="text-[var(--cyber-muted)]">]</span>
            <span className="text-white/90">{roleLabel.toUpperCase()}</span>
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
            {headline.toUpperCase()}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--cyber-muted)] md:text-base">
            {heroDescription}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className="cyber-btn-primary inline-flex items-center gap-2 rounded px-6 py-3">
              Explore Projects
              <ChevronRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => openAiAssistant()}
              className="cyber-btn-outline rounded px-6 py-3"
            >
              Open AI Assistant
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hud-panel flex-1 p-4">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--cyber-border)] pb-2">
              <span className="hud-label text-white/80">[ SYSTEM_STATUS ]</span>
              <span className="rounded bg-[var(--cyber-accent-dim)] px-2 py-0.5 font-mono text-[10px] text-[var(--cyber-accent)]">
                ONLINE
              </span>
            </div>
            <div className="space-y-1">
              <p className="terminal-line">
                <span className="ok">&gt;</span> Initializing core modules...
              </p>
              <p className="terminal-line">
                <span className="ok">&gt;</span> Drizzle ORM active
              </p>
              <p className="terminal-line">
                <span className="ok">&gt;</span> PostgreSQL latency: 12ms
              </p>
              <p className="terminal-line">
                <span className="ok">&gt;</span> WebGL context: WebGL2 fallback
              </p>
            </div>
          </div>
          <div className="hud-panel grid grid-cols-2 gap-px overflow-hidden p-0">
            <div className="border-r border-[var(--cyber-border)] p-4 text-center">
              <p className="font-mono text-lg font-semibold text-white">99.99%</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
                Cloud Uptime
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="font-mono text-lg font-semibold text-white">&lt; 20ms</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
                Global API Latency
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="mb-8">
          <h2 className="hud-label text-base text-white md:text-lg">
            [ HARDWARE & ARCHITECTURE ]
          </h2>
          <p className="mt-2 text-sm text-[var(--cyber-muted)]">
            Precision Engineering Meets Cinematic Cyber Design
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featureCards.map((card, i) => (
            <div key={card.id} className="hud-panel p-6">
              <div
                className={cn(
                  'mb-4 flex size-10 items-center justify-center rounded border',
                  i === 0
                    ? 'border-[var(--cyber-accent)]/40 bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                    : 'border-[var(--cyber-purple)]/40 bg-violet-500/10 text-[var(--cyber-purple)]',
                )}
              >
                {i === 0 ? <Cpu className="size-5" /> : <Box className="size-5" />}
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--cyber-muted)]">
                {card.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(i === 0
                  ? ['Hono', 'Drizzle ORM', 'PostgreSQL', 'TypeScript']
                  : ['Three.js', 'WebGL', 'Next.js']
                ).map((tag) => (
                  <span key={tag} className="cyber-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="hud-label text-base text-white md:text-lg">[ PORTFOLIO_ARCHIVES ]</h2>
            <p className="mt-2 text-sm text-[var(--cyber-muted)]">Featured High-End Projects</p>
          </div>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wider text-[var(--cyber-accent)] hover:underline"
          >
            View all archives +
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.length === 0 ? (
            <p className="font-mono text-xs text-[var(--cyber-muted)] md:col-span-3">
              No featured projects yet — enable{' '}
              <span className="text-[var(--cyber-accent)]">Show on home</span> in admin → Projects.
            </p>
          ) : (
            projects.slice(0, 6).map((project, idx) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="hud-panel group overflow-hidden transition hover:border-[var(--cyber-accent)]/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0f1419]">
                <Image
                  src={project.coverImageUrl ?? projectFallbackImages[idx % 3]!}
                  alt=""
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                {project.demoUrl ? (
                  <span className="absolute right-2 top-2 rounded bg-[var(--cyber-accent)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-[#041510]">
                    Live Demo
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-[var(--cyber-muted)]">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="cyber-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            ))
          )}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-4 py-12 md:px-8 lg:grid-cols-2">
        <div>
          <h2 className="hud-label text-base text-white">[ TIMELINE_LOG ]</h2>
          <p className="mb-6 mt-2 text-sm text-[var(--cyber-muted)]">Professional Experience</p>
          <div className="space-y-6 border-l border-[var(--cyber-border)] pl-6">
            {experience.slice(0, 4).map((item) => (
              <div key={item.id} className="relative">
                <span className="absolute -left-[29px] top-1 size-2 rounded-full bg-[var(--cyber-accent)] shadow-[0_0_8px_var(--cyber-accent)]" />
                <p className="font-mono text-xs text-[var(--cyber-accent)]">
                  [ {item.startDate} — {item.current ? 'PRESENT' : item.endDate ?? '—'} ]
                </p>
                <h3 className="mt-1 font-semibold text-white">{item.role}</h3>
                <p className="text-sm text-[var(--cyber-muted)]">{item.company}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--cyber-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hud-panel p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="hud-label text-base text-white">[ STACK_SPECS ]</h2>
              <p className="mt-2 text-sm text-[var(--cyber-muted)]">Core Competencies</p>
            </div>
            <div className="flex rounded-full border border-[var(--cyber-border)] p-0.5 font-mono text-[9px] uppercase">
              <button
                type="button"
                onClick={() => setStackMode('frontend')}
                className={cn(
                  'rounded-full px-3 py-1 transition',
                  stackMode === 'frontend'
                    ? 'bg-[var(--cyber-purple)] text-white'
                    : 'text-[var(--cyber-muted)]',
                )}
              >
                Frontend
              </button>
              <button
                type="button"
                onClick={() => setStackMode('backend')}
                className={cn(
                  'rounded-full px-3 py-1 transition',
                  stackMode === 'backend'
                    ? 'bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                    : 'text-[var(--cyber-muted)]',
                )}
              >
                Backend
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="mt-1 size-5 shrink-0 text-[var(--cyber-purple)]" />
            <div>
              <h3 className="font-semibold capitalize text-white">{stackMode} Ecosystem</h3>
              <p className="mt-2 text-sm text-[var(--cyber-muted)]">
                {stackMode === 'frontend'
                  ? 'Precision UI engineering with motion, 3D, and performance-first component systems.'
                  : 'Contract-first APIs, typed services, and production-grade data architecture.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(displaySkills.length ? displaySkills : skills)
                  .slice(0, 8)
                  .map((s) => (
                    <span key={s.id} className="cyber-tag">
                      {s.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--cyber-border)] px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
          <p>
            [ SYS_VER // {new Date().getFullYear()} ] {brandName}. All tactical rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--cyber-accent)] shadow-[0_0_6px_var(--cyber-accent)]" />
            System Operational // 99% UP
          </p>
        </div>
      </footer>
    </div>
  )
}
