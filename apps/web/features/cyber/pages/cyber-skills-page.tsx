'use client'

import { Cpu, FileJson, Layers } from 'lucide-react'

import { CyberOutlineButton, CyberPrimaryButton } from '@/features/cyber/cyber-buttons'
import { openAiAssistant } from '@/lib/open-ai-assistant'

type Skill = {
  id: string
  name: string
  category: string
}

const categoryMeta: Record<string, { title: string; icon: typeof Cpu }> = {
  Backend: { title: 'Backend & Distributed Systems', icon: Cpu },
  Frontend: { title: 'Frontend Architecture', icon: Layers },
  '3D': { title: '3D & Spatial Graphics', icon: Layers },
  Database: { title: 'Data & Persistence', icon: Cpu },
  Language: { title: 'Core Languages', icon: Cpu },
}

export default function CyberSkillsPage({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] ??= []
    acc[skill.category]?.push(skill)
    return acc
  }, {})

  function exportSpec() {
    const payload = Object.fromEntries(
      Object.entries(grouped).map(([cat, items]) => [cat, items.map((s) => s.name)]),
    )
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stack-spec.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 md:px-8">
      <div className="mb-10">
        <p className="hud-label text-white/70">[ SKILLS // STACK_MATRIX ]</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          HARDWARE, SOFTWARE & SPATIAL COMPUTING
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--cyber-muted)]">
          Typed contracts, resilient APIs, immersive WebGL, and production-grade delivery.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => {
          const meta = categoryMeta[category] ?? { title: category, icon: Cpu }
          const Icon = meta.icon
          return (
            <article key={category} className="hud-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded border border-[var(--cyber-accent)]/40 bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]">
                  <Icon className="size-5" />
                </div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-white">
                  {meta.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill.id} className="cyber-tag">
                    {skill.name}
                  </span>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <section className="mt-12 hud-panel p-6 md:p-8">
        <h2 className="hud-label text-white">[ CORE WEB VITALS & AUDITS ]</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {['Performance', 'Accessibility', 'Best Practices', 'SEO'].map((label, i) => (
            <div key={label} className="text-center">
              <p className="font-mono text-2xl font-semibold text-[var(--cyber-accent)]">
                {99 - i}%
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CyberPrimaryButton type="button" onClick={exportSpec}>
            <FileJson className="size-4" />
            Export Spec JSON
          </CyberPrimaryButton>
          <CyberOutlineButton type="button" onClick={() => openAiAssistant()}>
            Simulate Load
          </CyberOutlineButton>
        </div>
      </section>
    </div>
  )
}
