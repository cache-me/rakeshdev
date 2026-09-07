'use client'

import { useMemo, useState } from 'react'

import type { ResumeTemplateId, ResumeTemplateMeta } from '@/features/resume/types'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'

type ResumeStudioProps = {
  templates: ResumeTemplateMeta[]
  defaultTemplate: ResumeTemplateId
  updatedAt: string | null
}

export function ResumeStudio({ templates, defaultTemplate, updatedAt }: ResumeStudioProps) {
  const [template, setTemplate] = useState<ResumeTemplateId>(defaultTemplate)
  const [filter, setFilter] = useState<'all' | 'white' | 'color'>('all')

  const visible = useMemo(
    () => templates.filter((t) => filter === 'all' || t.category === filter),
    [filter, templates],
  )

  const selected = templates.find((t) => t.id === template) ?? templates[0]
  const previewUrl = `/api/resume/preview?template=${encodeURIComponent(template)}`
  const pdfUrl = `/resume.pdf?template=${encodeURIComponent(template)}`

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 md:px-8">
      <p className="hud-label text-white/70">[ RESUME // GENERATOR ]</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Career Dossier</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--cyber-muted)]">
        Choose a layout inspired by professional resume builders — including clean white templates —
        then preview and download a PDF generated from your portfolio data.
        {updatedAt ? ` Last updated ${new Date(updatedAt).toLocaleDateString()}.` : null}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['all', 'white', 'color'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
              filter === key
                ? 'border-[var(--cyber-accent)] bg-[var(--cyber-accent)]/15 text-white'
                : 'border-white/20 text-white/70 hover:border-white/40'
            }`}
          >
            {key === 'all' ? 'All templates' : key === 'white' ? 'White' : 'Color'}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/50">
            Templates ({visible.length})
          </p>
          <ul className="grid max-h-[520px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
            {visible.map((item) => {
              const active = item.id === template
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setTemplate(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      active
                        ? 'border-[var(--cyber-accent)] bg-white/5'
                        : 'border-white/10 bg-black/20 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-full border border-white/20"
                        style={{ background: item.accent }}
                        aria-hidden
                      />
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="ml-auto font-mono text-[9px] uppercase text-white/40">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--cyber-muted)]">{item.description}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              Preview — {selected?.name}
            </p>
            <div className="flex flex-wrap gap-2">
              <CyberPrimaryLink href={pdfUrl} target="_blank" rel="noreferrer">
                Open PDF
              </CyberPrimaryLink>
              <CyberOutlineLink href={pdfUrl} download>
                Download
              </CyberOutlineLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/15 bg-white shadow-2xl">
            <iframe
              key={previewUrl}
              title="Resume preview"
              src={previewUrl}
              className="h-[min(720px,70vh)] w-full bg-white"
            />
          </div>
        </div>
      </div>

      <CyberOutlineLink href="/experience" className="mt-8">
        View Experience Log
      </CyberOutlineLink>
    </div>
  )
}
