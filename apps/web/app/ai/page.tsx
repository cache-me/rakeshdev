import CyberPage from '@/features/cyber/cyber-page'
import AiCopilotPanel from '@/features/ai-assistant/ai-copilot-panel'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'AI Copilot — Rakesh',
  description: 'Neural interface for portfolio navigation and technical Q&A.',
  path: '/ai',
})

export default async function AiCopilotPage() {
  const brandName = await getSiteBrandName()

  return (
    <CyberPage brandName={brandName}>
      <div className="mx-auto max-w-[1400px] px-2 pb-4 md:px-4">
        <div className="mb-4 flex flex-wrap items-center gap-4 border border-[var(--cyber-border)] bg-[var(--cyber-panel)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
          <span className="flex items-center gap-2 text-[var(--cyber-accent)]">
            <span className="size-1.5 rounded-full bg-[var(--cyber-accent)] shadow-[0_0_6px_var(--cyber-accent)]" />
            Online
          </span>
          <span>Latency 12ms</span>
          <span>VRAM 4.2GB</span>
          <span>Uptime 99.99%</span>
        </div>
        <AiCopilotPanel embedded />
      </div>
    </CyberPage>
  )
}
