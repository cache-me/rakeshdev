type CyberFooterProps = {
  brandName: string
}

export default function CyberFooter({ brandName }: CyberFooterProps) {
  return (
    <footer className="relative z-10 mt-16 border-t border-[var(--cyber-border)] px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
        <p>
          [ SYS_VER // {new Date().getFullYear()} ] {brandName}. All tactical rights reserved.
        </p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--cyber-accent)] shadow-[0_0_6px_var(--cyber-accent)]" />
          System Operational // 99% UP
        </p>
      </div>
    </footer>
  )
}
