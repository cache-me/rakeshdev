'use client'

import { useEffect, useState } from 'react'

import { CyberOutlineButton, CyberPrimaryButton } from '@/features/cyber/cyber-buttons'

const seedLines = [
  '[SYS_BOOT] Portfolio kernel v4.8 — edge nodes synchronized',
  '[GATEWAY] ts-rest /api handshake OK — latency 1.2ms',
  '[AUTH] Better Auth session validator — role=admin',
  '[DB] Drizzle pool warm — postgres:5433',
  '[SHADER_ENGINE] WebGL context deferred to client tier',
  '[AI_COPILOT] Intent router standby — rule fallback armed',
]

type ToggleId = 'maintenance' | 'webgl' | 'copilot'

export default function AdminTelemetryPanel() {
  const [lines, setLines] = useState(seedLines)
  const [toggles, setToggles] = useState<Record<ToggleId, string>>({
    maintenance: 'OFF',
    webgl: 'AUTO',
    copilot: 'ENABLED',
  })

  useEffect(() => {
    const id = window.setInterval(() => {
      const stamp = new Date().toISOString().slice(11, 19)
      setLines((prev) => {
        const next = `[${stamp}] [HEARTBEAT] edge_sync nominal — ${Math.floor(Math.random() * 40 + 60)}ms`
        return [...prev.slice(-11), next]
      })
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  function cycleToggle(key: ToggleId) {
    setToggles((t) => {
      if (key === 'maintenance') {
        return { ...t, maintenance: t.maintenance === 'OFF' ? 'ON' : 'OFF' }
      }
      if (key === 'webgl') {
        const order = ['AUTO', 'FORCE_2D', 'FORCE_WEBGL'] as const
        const current = t.webgl as (typeof order)[number]
        const i = order.indexOf(current)
        const next = order[(i + 1) % order.length] ?? 'AUTO'
        return { ...t, webgl: next }
      }
      return { ...t, copilot: t.copilot === 'ENABLED' ? 'DISABLED' : 'ENABLED' }
    })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="hud-panel flex flex-col p-4">
        <p className="hud-label">TELEMETRY_LOGS // LIVE_STREAM_EDGE</p>
        <div className="mt-3 max-h-48 flex-1 overflow-y-auto rounded border border-[var(--cyber-border)] bg-[#060a0f] p-3">
          {lines.map((line, i) => (
            <p key={`${line}-${i}`} className="terminal-line">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
          <span className="cyber-tag">FILTER: ALL</span>
          <span className="cyber-tag">SEVERITY: INFO+</span>
        </div>
      </div>

      <div className="hud-panel p-4">
        <p className="hud-label">ENVIRONMENT_SWITCHBOARD // TIER_0</p>
        <ul className="mt-4 space-y-3 font-mono text-[11px]">
          <li className="flex items-center justify-between gap-4 border-b border-[var(--cyber-border)] pb-2">
            <span className="text-[var(--cyber-muted)]">MAINTENANCE_MODE</span>
            <button
              type="button"
              className="cyber-tag hover:border-[var(--cyber-accent)]"
              onClick={() => cycleToggle('maintenance')}
            >
              [{toggles.maintenance}]
            </button>
          </li>
          <li className="flex items-center justify-between gap-4 border-b border-[var(--cyber-border)] pb-2">
            <span className="text-[var(--cyber-muted)]">WEBGL_FALLBACK</span>
            <button
              type="button"
              className="cyber-tag hover:border-[var(--cyber-accent)]"
              onClick={() => cycleToggle('webgl')}
            >
              [{toggles.webgl}]
            </button>
          </li>
          <li className="flex items-center justify-between gap-4 border-b border-[var(--cyber-border)] pb-2">
            <span className="text-[var(--cyber-muted)]">AI_COPILOT_CORE</span>
            <button
              type="button"
              className={
                toggles.copilot === 'ENABLED'
                  ? 'rounded border border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)] px-2 py-0.5 font-mono text-[10px] text-[var(--cyber-accent)]'
                  : 'cyber-tag'
              }
              onClick={() => cycleToggle('copilot')}
            >
              [{toggles.copilot}]
            </button>
          </li>
        </ul>
        <p className="mt-4 font-mono text-[10px] text-[var(--cyber-muted)]">
          EDGE: San Francisco · Frankfurt · Tokyo —{' '}
          <span className="text-[var(--cyber-accent)]">ACTIVE</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <CyberOutlineButton className="text-[10px]">PURGE GLOBAL CACHE (ALL_REGIONS)</CyberOutlineButton>
          <CyberPrimaryButton className="text-[10px]" onClick={() => window.open('/', '_blank')}>
            PREVIEW PUBLIC SITE
          </CyberPrimaryButton>
        </div>
      </div>
    </div>
  )
}
