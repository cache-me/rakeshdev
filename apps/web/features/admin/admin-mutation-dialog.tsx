'use client'

import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

type AdminMutationDialogProps = {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function AdminMutationDialog({
  open,
  title,
  subtitle,
  onClose,
  children,
  className,
}: AdminMutationDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mutation-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#040608]/80 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={cn(
          'hud-panel relative z-10 flex max-h-[min(90vh,820px)] w-full max-w-2xl flex-col overflow-hidden',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--cyber-border)] px-5 py-4">
          <div>
            <p id="mutation-dialog-title" className="hud-label">
              {title}
            </p>
            {subtitle ? (
              <p className="mt-1 font-mono text-[10px] text-[var(--cyber-muted)]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded border border-[var(--cyber-border)] text-[var(--cyber-muted)] transition hover:border-[var(--cyber-accent)] hover:text-[var(--cyber-accent)]"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
