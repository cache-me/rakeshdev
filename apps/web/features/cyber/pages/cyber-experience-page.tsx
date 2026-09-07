import { Download } from 'lucide-react'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'

type ExperienceItem = {
  id: string
  company: string
  role: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string
}

export default function CyberExperiencePage({
  items,
  resumeUrl,
}: {
  items: ExperienceItem[]
  resumeUrl: string | null
}) {
  const years = items.length > 0 ? `${Math.max(items.length, 4)}+` : '8+'

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 md:px-8">
      <div className="mb-10">
        <p className="hud-label text-white/70">[ EXPERIENCE // DOSSIER ]</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          OPERATIONAL HISTORY
        </h1>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Years Active', value: years },
          { label: 'Deployments', value: '50M+' },
          { label: 'Uptime SLA', value: '99.99%' },
          { label: 'Regions', value: '12' },
        ].map((stat) => (
          <div key={stat.label} className="hud-panel p-4 text-center">
            <p className="font-mono text-xl font-semibold text-[var(--cyber-accent)]">{stat.value}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-6 border-l border-[var(--cyber-border)] pl-6 md:pl-8">
        {items.map((item) => (
          <article key={item.id} className="relative hud-panel p-6">
            <span className="absolute -left-[31px] top-8 size-2.5 rounded-full bg-[var(--cyber-accent)] shadow-[0_0_8px_var(--cyber-accent)] md:-left-[39px]" />
            <p className="font-mono text-xs text-[var(--cyber-accent)]">
              [ {item.startDate} — {item.current ? 'PRESENT' : item.endDate ?? '—'} ]
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">{item.role}</h2>
            <p className="text-sm text-[var(--cyber-muted)]">
              {item.company}
              {item.location ? ` · ${item.location}` : ''}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--cyber-muted)]">
              {item.description}
            </p>
            <div className="mt-5">
              <CyberOutlineLink href="/projects">Inspect Deployments</CyberOutlineLink>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-end gap-3">
        {resumeUrl ? (
          <CyberPrimaryLink href={resumeUrl} target="_blank" rel="noreferrer">
            <Download className="size-4" />
            Export Dossier PDF
          </CyberPrimaryLink>
        ) : (
          <CyberPrimaryLink href="/resume">
            <Download className="size-4" />
            Export Dossier PDF
          </CyberPrimaryLink>
        )}
        <CyberOutlineLink href="/contact">Establish Contact</CyberOutlineLink>
      </div>
    </div>
  )
}
