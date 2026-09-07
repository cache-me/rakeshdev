'use client'

import { cn } from '@/lib/utils'

export function AdminSubpage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-mono text-xl font-semibold uppercase tracking-wide text-[var(--cyber-text)]">
        {title}
      </h1>
      <div
        className={cn(
          'mt-6 rounded border border-[var(--cyber-border)] bg-[var(--cyber-panel)] p-4 md:p-6',
          '[&_input]:border-[var(--cyber-border)] [&_input]:bg-[#060a0f] [&_input]:font-mono [&_input]:text-sm',
          '[&_label]:font-mono [&_label]:text-[10px] [&_label]:uppercase [&_label]:tracking-wider [&_label]:text-[var(--cyber-muted)]',
          '[&_button]:font-mono [&_button]:text-[10px] [&_button]:uppercase',
        )}
      >
        {children}
      </div>
    </div>
  )
}
