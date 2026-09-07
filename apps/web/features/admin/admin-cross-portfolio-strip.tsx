'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { adminClient } from '@/lib/api'

export default function AdminCrossPortfolioStrip() {
  const experience = useQuery({
    queryKey: ['admin', 'experience', 'strip'],
    queryFn: async () => {
      const res = await adminClient.listExperience()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })
  const projects = useQuery({
    queryKey: ['admin', 'projects', 'strip'],
    queryFn: async () => {
      const res = await adminClient.listProjects()
      if (res.status === 200 && res.body.success) return res.body.data
      return []
    },
  })

  const cards = [
    ...(experience.data ?? []).slice(0, 1).map((e: { role: string; company: string; id: string }) => ({
      href: '/admin/experience',
      tag: 'EXPERIENCE',
      title: `${e.role} @ ${e.company}`,
      id: e.id,
    })),
    ...(projects.data ?? []).slice(0, 1).map((p: { title: string; id: string }) => ({
      href: '/admin/projects',
      tag: 'PROJECTS',
      title: p.title,
      id: p.id,
    })),
  ]

  return (
    <div className="mt-8 border-t border-[var(--cyber-border)] pt-6">
      <p className="hud-label">CROSS_PORTFOLIO // UNIFIED CRUD DISPATCH STRIP</p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {cards.length === 0 ? (
          <p className="font-mono text-[10px] text-[var(--cyber-muted)]">No cross-links yet — add experience or projects.</p>
        ) : (
          cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="hud-panel min-w-[220px] shrink-0 p-3 transition hover:border-[var(--cyber-accent)]/50"
            >
              <p className="font-mono text-[9px] text-[var(--cyber-accent)]">{card.tag}</p>
              <p className="mt-1 font-mono text-[11px] text-[var(--cyber-text)]">{card.title}</p>
            </Link>
          ))
        )}
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
        SYSTEM_DIRECTIVE: IMMUTABLE_AUDIT_LOG_ENABLED // SIGNED_HASH_HMAC256
      </p>
    </div>
  )
}
