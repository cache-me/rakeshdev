'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { CyberOutlineButton, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'
import { cn } from '@/lib/utils'

import { adminNav, adminNavLabel } from './admin-nav'

export default function AdminShell({ children }: React.PropsWithChildren) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [mobileNav, setMobileNav] = useState(false)
  const isOverview = pathname === '/admin'

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/admin/login')
    }
  }, [isPending, session, router])

  useEffect(() => {
    setMobileNav(false)
  }, [pathname])

  if (isPending) {
    return (
      <div className="cyber-page flex min-h-screen items-center justify-center font-mono text-sm text-[var(--cyber-muted)]">
        Loading session…
      </div>
    )
  }

  if (!session) {
    return (
      <div className="cyber-page flex min-h-screen items-center justify-center font-mono text-sm text-[var(--cyber-muted)]">
        Redirecting to login…
      </div>
    )
  }

  const userId = session.user.id.slice(0, 8).toUpperCase()
  const displayName = session.user.name ?? session.user.email?.split('@')[0] ?? 'ADMIN'

  function signOut() {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.assign('/admin/login')
        },
      },
    })
  }

  return (
    <div className="cyber-page cyber-grid-bg relative flex min-h-screen flex-col">
      <header className="relative z-10 border-b border-[var(--cyber-border)] bg-[rgba(8,11,16,0.92)] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded border border-[var(--cyber-border)] text-[var(--cyber-accent)] md:hidden"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileNav ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--cyber-text)]">
              <span className="text-[var(--cyber-muted)]">[</span>
              DEV ARCHITECT.IO
              <span className="text-[var(--cyber-muted)]">]</span>
              <span className="text-[var(--cyber-muted)]">{' // '}</span>
              KERNEL_ADMIN
            </p>
          </div>
          <div className="hidden flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)] lg:flex">
            <span>
              SYS_HEALTH: <span className="text-[var(--cyber-accent)]">99.98%</span>
            </span>
            <span>
              EDGE_SYNC: <span className="text-[var(--cyber-accent)]">[ACTIVE]</span>
            </span>
            <span>PROTOCOL: TLS_1.3</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <CyberPrimaryLink href="/admin/projects" className="hidden px-3 py-2 text-[9px] sm:inline-flex">
              DEPLOY_GLOBAL
            </CyberPrimaryLink>
            <div className="hidden text-right sm:block">
              <p className="text-[var(--cyber-accent)]">ROOT_OPERATOR</p>
              <p className="text-[var(--cyber-muted)]">AUTH_LVL: 5</p>
            </div>
            <div className="hidden text-right md:block">
              <p className="text-[var(--cyber-accent)]">ADMIN_ROOT</p>
              <p className="text-[var(--cyber-muted)]">
                {displayName.toUpperCase()} // ID-{userId}
              </p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full border border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)] text-[10px] font-bold text-[var(--cyber-accent)]">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <CyberOutlineButton
              type="button"
              className="gap-1.5 px-3 py-2 text-[9px]"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">LOG_OUT</span>
            </CyberOutlineButton>
          </div>
        </div>
        {!isOverview ? (
          <div className="border-t border-[var(--cyber-border)] px-4 py-2 md:px-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-accent)]">
              [{adminNavLabel(pathname)}]
            </p>
          </div>
        ) : null}
      </header>

      <div className="relative z-10 flex flex-1">
        <aside
          className={cn(
            'flex w-64 shrink-0 flex-col border-r border-[var(--cyber-border)] bg-[rgba(8,11,16,0.88)] p-4',
            mobileNav ? 'absolute inset-y-0 left-0 top-[57px] z-20 shadow-xl md:relative md:top-0' : 'hidden md:flex',
          )}
        >
          <p className="hud-label px-2">DIRECTIVES_CMS</p>
          <nav className="mt-4 flex flex-1 flex-col gap-1">
            {adminNav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider transition',
                    active
                      ? 'bg-[var(--cyber-accent)] text-[#041510] shadow-[0_0_20px_rgba(45,212,168,0.35)]'
                      : 'text-[var(--cyber-muted)] hover:bg-[var(--cyber-accent-dim)] hover:text-[var(--cyber-accent)]',
                  )}
                >
                  [{item.bracket}]
                </Link>
              )
            })}
          </nav>
          <div className="mt-4 space-y-1 border-t border-[var(--cyber-border)] pt-4 font-mono text-[9px] uppercase text-[var(--cyber-muted)]">
            <p>
              SYS_LOAD_CORE <span className="text-[var(--cyber-accent)]">24.1%</span>
            </p>
            <p>
              MEM_CACHE_ALLOC <span className="text-[var(--cyber-accent)]">512MB</span> / 4GB
            </p>
            <p>
              UPTIME <span className="text-[var(--cyber-accent)]">1420h 31m [STABLE]</span>
            </p>
          </div>
          <button
            type="button"
            className="cyber-btn-outline mt-4 flex items-center justify-center gap-2 rounded px-3 py-2 font-mono text-[10px] uppercase"
            onClick={signOut}
          >
            <LogOut className="size-3.5" />
            [TERMINATE SESSION]
          </button>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
