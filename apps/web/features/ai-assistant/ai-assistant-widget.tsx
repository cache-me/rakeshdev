'use client'

import { Bot, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import AiCopilotPanel from './ai-copilot-panel'

export const OPEN_AI_ASSISTANT_EVENT = 'portfolio:open-ai-assistant'

export default function AiAssistantWidget({ variant = 'default' }: { variant?: 'default' | 'hud' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener(OPEN_AI_ASSISTANT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_AI_ASSISTANT_EVENT, onOpen)
  }, [])

  return (
    <>
      {variant === 'hud' ? (
        <button
          type="button"
          aria-label="Open AI HUD assistant"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-l-lg border border-r-0 border-[var(--cyber-accent)]/40 bg-[var(--cyber-panel)] px-2 py-4 text-[10px] font-medium uppercase tracking-widest text-[var(--cyber-accent)] shadow-[0_0_24px_rgba(45,212,168,0.15)] md:flex"
        >
          <Bot className="size-5" />
          <span className="[writing-mode:vertical-rl] rotate-180">AI HUD</span>
        </button>
      ) : (
        <Button
          className="fixed bottom-5 right-5 z-50 size-12 rounded-full shadow-lg"
          aria-label="Open AI assistant"
          onClick={() => setOpen(true)}
        >
          <MessageCircle />
        </Button>
      )}

      <div
        className={cn(
          'fixed inset-0 z-[60] transition',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-label="AI Copilot"
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close copilot backdrop"
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            'cyber-page absolute inset-2 flex flex-col overflow-hidden rounded border border-[var(--cyber-accent)]/25 shadow-[0_0_40px_rgba(45,212,168,0.12)] md:inset-4 lg:inset-8',
            variant === 'hud' ? 'cyber-grid-bg' : '',
          )}
        >
          <AiCopilotPanel onClose={() => setOpen(false)} />
        </div>
      </div>
    </>
  )
}
