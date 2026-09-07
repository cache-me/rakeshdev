'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Terminal } from 'lucide-react'

import { openAiAssistant } from '@/lib/open-ai-assistant'
import { cn } from '@/lib/utils'

import { cyberBrandLogo, cyberNavLinks } from './cyber-nav-links'

type CyberHeaderProps = {
  brandName: string
}

export default function CyberHeader({ brandName }: CyberHeaderProps) {
  const pathname = usePathname()
  const brandLogo = cyberBrandLogo(brandName)

  return (
    <header className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-8">
      <Link href="/" className="text-sm font-bold tracking-[0.2em] text-white md:text-base">
        {brandLogo}
      </Link>
      <nav className="cyber-nav-pill flex max-w-[100vw] items-center gap-0.5 overflow-x-auto rounded-full px-1 py-1 lg:max-w-none lg:px-2 lg:py-1.5">
        {cyberNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition',
              pathname === link.href
                ? 'bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                : 'text-[var(--cyber-muted)] hover:bg-[var(--cyber-accent-dim)] hover:text-[var(--cyber-accent)]',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/ai" className="cyber-btn-primary flex items-center gap-2 rounded px-4 py-2">
          <Bot className="size-4" />
          AI Copilot
        </Link>
        <button
          type="button"
          onClick={() => openAiAssistant()}
          className="flex size-10 items-center justify-center rounded border border-[var(--cyber-border)] text-[var(--cyber-accent)]"
          aria-label="Terminal"
        >
          <Terminal className="size-4" />
        </button>
      </div>
    </header>
  )
}
