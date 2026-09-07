'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'
import { adminClient } from '@/lib/api'

import AdminTelemetryPanel from './admin-telemetry-panel'

function MatrixCard({
  page,
  title,
  route,
  status,
  children,
  actions,
}: {
  page: string
  title: string
  route: string
  status: React.ReactNode
  children: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <article className="hud-panel flex flex-col p-4">
      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
        {page} // {title}
      </p>
      <p className="mt-1 font-mono text-[10px] text-[var(--cyber-accent)]">ROUTE: {route}</p>
      <div className="mt-3 flex-1 text-xs leading-relaxed text-[var(--cyber-muted)]">{children}</div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)]">
        {status}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
    </article>
  )
}

export default function AdminHudDashboard() {
  const projects = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const res = await adminClient.listProjects()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })
  const blog = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const res = await adminClient.listBlogPosts()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })
  const skills = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: async () => {
      const res = await adminClient.listSkills()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })
  const experience = useQuery({
    queryKey: ['admin', 'experience'],
    queryFn: async () => {
      const res = await adminClient.listExperience()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })
  const messages = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: async () => {
      const res = await adminClient.listContactMessages()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })

  const projectCount = projects.data?.length ?? 0
  const blogCount = blog.data?.length ?? 0
  const skillCount = skills.data?.length ?? 0
  const expCount = experience.data?.length ?? 0
  const unread = (messages.data ?? []).filter((m: { read: boolean }) => !m.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--cyber-border)] pb-4">
        <div>
          <p className="hud-label">PORTFOLIO DEPLOYMENT MATRIX</p>
          <p className="mt-1 font-mono text-[10px] text-[var(--cyber-muted)]">
            Global status:{' '}
            <span className="text-[var(--cyber-accent)]">All_Services_Nominal</span>
          </p>
        </div>
        <CyberPrimaryLink href="/admin/projects" className="text-[10px]">
          + DISPATCH NEW DEPLOYMENT
        </CyberPrimaryLink>
      </div>

      <div className="grid gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)] md:grid-cols-4">
        <div className="hud-panel px-3 py-2">
          VRAM: <span className="text-[var(--cyber-accent)]">412MB</span> / 24GB
        </div>
        <div className="hud-panel px-3 py-2">
          HIT_RATIO: <span className="text-[var(--cyber-accent)]">99.4%</span>
        </div>
        <div className="hud-panel px-3 py-2">
          SOCKETS: <span className="text-[var(--cyber-accent)]">{1400 + projectCount}_LIVE</span>
        </div>
        <div className="hud-panel px-3 py-2">
          P99_LATENCY: <span className="text-[var(--cyber-accent)]">1.82ms</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MatrixCard
          page="PAGE.01"
          title="HOME_PAGE // FLAGSHIP"
          route="/"
          status="ONLINE_LIVE"
          actions={
            <>
              <CyberOutlineLink href="/admin/settings" className="px-3 py-1.5 text-[9px]">
                CONFIG
              </CyberOutlineLink>
              <CyberOutlineLink href="/" className="px-3 py-1.5 text-[9px]" target="_blank">
                PREVIEW
              </CyberOutlineLink>
            </>
          }
        >
          Landing zone — WebGL compute pipeline, hero shaders, cyber HUD chrome. Site settings control
          brand copy and SEO meta.
        </MatrixCard>

        <MatrixCard
          page="PAGE.02"
          title="PROJECTS_ARCHIVE // CLUSTER"
          route="/projects"
          status={`${projectCount} NODES ACTIVE`}
          actions={
            <>
              <CyberPrimaryLink href="/admin/projects" className="px-3 py-1.5 text-[9px]">
                + ADD
              </CyberPrimaryLink>
              <CyberOutlineLink href="/admin/projects" className="px-3 py-1.5 text-[9px]">
                VISIBILITY
              </CyberOutlineLink>
            </>
          }
        >
          Featured deployments and case studies. {unread > 0 ? `${unread} inbound signals pending.` : 'Telemetry pings nominal.'}
        </MatrixCard>

        <MatrixCard
          page="PAGE.03"
          title="SKILLS_ARSENAL // MATRIX"
          route="/skills"
          status={`${skillCount} SPECS LOADED`}
          actions={
            <>
              <CyberOutlineLink href="/admin/skills" className="px-3 py-1.5 text-[9px]">
                UPDATE SPECS
              </CyberOutlineLink>
              <Link
                href="/skills"
                target="_blank"
                className="cyber-btn-outline rounded px-3 py-1.5 text-[9px]"
              >
                BENCHMARK RUN
              </Link>
            </>
          }
        >
          Stack matrix — Rust, Go, Hono, Three.js, Next.js, Drizzle. WCAG audit path via public skills
          page.
        </MatrixCard>

        <MatrixCard
          page="PAGE.04"
          title="EXPERIENCE // CAREER_LOGS"
          route="/experience"
          status="IMMUTABLE_LOCKED"
          actions={
            <>
              <CyberPrimaryLink href="/admin/experience" className="px-3 py-1.5 text-[9px]">
                ADD MILESTONE
              </CyberPrimaryLink>
              <CyberOutlineLink href="/resume" className="px-3 py-1.5 text-[9px]" target="_blank">
                EXPORT DOSSIER
              </CyberOutlineLink>
            </>
          }
        >
          {expCount} career entries synced. Timeline renders on /experience with cyber timeline HUD.
        </MatrixCard>

        <MatrixCard
          page="PAGE.05"
          title="SIGNAL_LOGS // DISPATCHES"
          route="/blog"
          status={`${blogCount} ARTICLES`}
          actions={
            <>
              <CyberPrimaryLink href="/admin/blog" className="px-3 py-1.5 text-[9px]">
                + DRAFT DISPATCH
              </CyberPrimaryLink>
              <CyberOutlineLink href="/admin/blog" className="px-3 py-1.5 text-[9px]">
                MANAGE TAGS
              </CyberOutlineLink>
            </>
          }
        >
          RSS-ready articles and featured dispatch on blog index. Markdown body stored in Postgres.
        </MatrixCard>

        <MatrixCard
          page="PAGE.06"
          title="AI_COPILOT // RUNTIME_HUB"
          route="/ai"
          status="WEIGHTS_LOADED"
          actions={
            <>
              <CyberOutlineLink href="/admin/settings" className="px-3 py-1.5 text-[9px]">
                TUNE PROMPT
              </CyberOutlineLink>
              <CyberOutlineLink href="/ai" className="px-3 py-1.5 text-[9px]" target="_blank">
                INSPECT LOGS
              </CyberOutlineLink>
            </>
          }
        >
          Intent router + optional LLM backend. HUD widget on public routes; fullscreen copilot at /ai.
        </MatrixCard>
      </div>

      <AdminTelemetryPanel />
    </div>
  )
}
