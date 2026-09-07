'use client'

import Link from 'next/link'
import {
  Bot,
  Copy,
  Cpu,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CyberOutlineButton, CyberPrimaryButton } from '@/features/cyber/cyber-buttons'
import { cn } from '@/lib/utils'

import { type ChatMessage, useAiChat } from './use-ai-chat'

const tacticalVectors = [
  'Compare edge vs serverless latency',
  'Show featured projects',
  'Summarize experience timeline',
  'List core backend skills',
  'Open contact channel',
]

const modelModules = [
  { name: 'Portfolio RAG', status: 'ACTIVE', load: 42 },
  { name: 'Intent Router', status: 'ACTIVE', load: 28 },
  { name: 'Nav Guard', status: 'STANDBY', load: 12 },
]

function extractCodeBlock(content: string) {
  const match = content.match(/```(?:\w+)?\n([\s\S]*?)```/)
  return match?.[1]?.trim() ?? null
}

function MessageBody({ content, href, label, personalDocuments, educationCertificates }: ChatMessage) {
  const code = extractCodeBlock(content)
  const prose = code ? content.replace(/```[\s\S]*?```/, '').trim() : content

  async function copyCode() {
    if (!code) return
    await navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard')
  }

  return (
    <div className="space-y-3">
      {prose ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--cyber-muted)]">
          {prose.replace(/\*\*/g, '')}
        </p>
      ) : null}
      {personalDocuments?.length ? (
        <ul className="space-y-4 pt-2">
          {personalDocuments.map((doc) => (
            <li
              key={doc.id}
              className="overflow-hidden rounded border border-[var(--cyber-border)] bg-black/30"
            >
              <div className="border-b border-[var(--cyber-border)] px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-accent)]">
                  {doc.docType}
                </p>
                <p className="text-sm font-medium text-white">{doc.title}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doc.imageUrl}
                alt={doc.title}
                className="mx-auto max-h-[min(420px,55vh)] w-full max-w-md object-contain bg-white/5 p-3"
              />
            </li>
          ))}
        </ul>
      ) : null}
      {educationCertificates?.length ? (
        <ul className="space-y-4 pt-2">
          {educationCertificates.map((cert) => (
            <li
              key={cert.id}
              className="overflow-hidden rounded border border-[var(--cyber-border)] bg-black/30"
            >
              <div className="border-b border-[var(--cyber-border)] px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-accent)]">
                  {cert.qualificationType.replace('_', ' ')}
                </p>
                <p className="text-sm font-medium text-white">{cert.degree}</p>
                <p className="text-xs text-[var(--cyber-muted)]">{cert.institution}</p>
                {cert.resultSummary ? (
                  <p className="mt-1 text-xs text-white/80">{cert.resultSummary}</p>
                ) : null}
              </div>
              {cert.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={cert.imageUrl}
                  alt={cert.degree}
                  className="mx-auto max-h-[min(420px,55vh)] w-full max-w-md object-contain bg-white/5 p-3"
                />
              ) : (
                <p className="px-3 py-4 text-xs text-[var(--cyber-muted)]">
                  No certificate scan on file for this qualification yet.
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {code ? (
        <div className="overflow-hidden rounded border border-[var(--cyber-border)] bg-[#060a0f]">
          <div className="flex items-center justify-between border-b border-[var(--cyber-border)] px-3 py-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
              src/hyperdrive-router.ts
            </span>
            <div className="flex gap-2">
              <CyberPrimaryButton type="button" className="px-3 py-1 text-[9px]">
                <Play className="size-3" />
                Sandbox Exec
              </CyberPrimaryButton>
              <CyberOutlineButton type="button" className="px-3 py-1 text-[9px]" onClick={copyCode}>
                <Copy className="size-3" />
                Copy Code
              </CyberOutlineButton>
            </div>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[var(--cyber-accent)]">
            <code>{code}</code>
          </pre>
        </div>
      ) : null}
      {href && label ? (
        <Link
          href={href}
          className="inline-flex font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)] hover:underline"
        >
          {label} →
        </Link>
      ) : null}
    </div>
  )
}

type AiCopilotPanelProps = {
  embedded?: boolean
  onClose?: () => void
}

export default function AiCopilotPanel({ embedded = false, onClose }: AiCopilotPanelProps) {
  const { history, send, reset, dumpLog, isPending } = useAiChat()
  const [message, setMessage] = useState('')
  const neuralLoad = useMemo(() => Math.min(94, 38 + history.length * 8), [history.length])

  function transmit() {
    send(message)
    setMessage('')
  }

  return (
    <div className={cn('flex flex-col', embedded ? 'min-h-[calc(100vh-8rem)]' : 'h-full')}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cyber-border)] px-4 py-3 md:px-6">
        <div>
          <p className="hud-label flex items-center gap-2 text-white">
            <Sparkles className="size-4 text-[var(--cyber-accent)]" />
            AI Copilot // Neural Interface
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--cyber-muted)]">
            Grounded on portfolio data · intent-safe navigation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CyberOutlineButton type="button" className="px-3 py-1.5 text-[9px]" onClick={reset}>
            <RotateCcw className="size-3" />
            Reset Session
          </CyberOutlineButton>
          <CyberOutlineButton type="button" className="px-3 py-1.5 text-[9px]" onClick={dumpLog}>
            <Save className="size-3" />
            Dump Log
          </CyberOutlineButton>
          {onClose ? (
            <button
              type="button"
              aria-label="Close copilot"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded border border-[var(--cyber-border)] text-[var(--cyber-muted)] hover:text-white"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 md:flex-row md:p-6">
        <aside className="flex shrink-0 flex-col gap-4 md:w-[280px]">
          <div className="hud-panel p-4">
            <p className="hud-label text-[10px] text-white/80">Model Subsystem</p>
            <ul className="mt-3 space-y-2">
              {modelModules.map((m) => (
                <li
                  key={m.name}
                  className="flex items-center justify-between font-mono text-[10px] text-[var(--cyber-muted)]"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="size-3 text-[var(--cyber-accent)]" />
                    {m.name}
                  </span>
                  <span className="text-[var(--cyber-accent)]">{m.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hud-panel p-4">
            <div className="flex items-center justify-between">
              <p className="hud-label text-[10px] text-white/80">Neural Load Matrix</p>
              <span className="font-mono text-xs text-[var(--cyber-accent)]">{neuralLoad}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0f1419]">
              <div
                className="h-full bg-[var(--cyber-accent)] shadow-[0_0_12px_var(--cyber-accent)] transition-all duration-500"
                style={{ width: `${neuralLoad}%` }}
              />
            </div>
          </div>

          <div className="hud-panel flex-1 p-4">
            <p className="hud-label text-[10px] text-white/80">Tactical Vectors</p>
            <ul className="mt-3 space-y-2">
              {tacticalVectors.map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    onClick={() => send(prompt)}
                    className="w-full text-left font-mono text-[10px] leading-snug text-[var(--cyber-muted)] transition hover:text-[var(--cyber-accent)]"
                  >
                    &gt; {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col hud-panel">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
            {history.length === 0 ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
                <Bot className="size-10 text-[var(--cyber-accent)]" />
                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--cyber-muted)]">
                  Awaiting uplink prompt
                </p>
                <p className="mt-2 max-w-md text-sm text-[var(--cyber-muted)]">
                  Ask about projects, stack, experience, or request navigation to a portfolio section.
                </p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className={cn(
                    'rounded border px-4 py-3',
                    item.role === 'user'
                      ? 'ml-4 border-[var(--cyber-accent)]/30 bg-[var(--cyber-accent-dim)] md:ml-12'
                      : 'mr-4 border-[var(--cyber-border)] bg-[#0a0f14] md:mr-12',
                  )}
                >
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-accent)]">
                    {item.role === 'user' ? 'Operator' : 'Copilot'}
                  </p>
                  <MessageBody {...item} />
                </div>
              ))
            )}
            {isPending ? (
              <p className="font-mono text-[10px] text-[var(--cyber-accent)] animate-pulse">
                &gt; Processing inference stream…
              </p>
            ) : null}
          </div>

          <form
            className="border-t border-[var(--cyber-border)] p-4 md:p-5"
            onSubmit={(e) => {
              e.preventDefault()
              transmit()
            }}
          >
            <label className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
              Command Line Interface
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded border border-[var(--cyber-border)] bg-[#060a0f] px-3 py-2.5">
                <span className="font-mono text-sm text-[var(--cyber-accent)]">&gt;</span>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter tactical query…"
                  aria-label="Copilot message"
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-[var(--cyber-muted)]"
                />
              </div>
              <CyberPrimaryButton
                type="submit"
                disabled={isPending || !message.trim()}
                className="shrink-0 px-6 py-3"
              >
                Transmit Prompt
                <Zap className="size-4" />
              </CyberPrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
