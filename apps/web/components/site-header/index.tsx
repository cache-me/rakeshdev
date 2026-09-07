'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { queryKeys } from '@/hooks/query-keys'
import { apiClient } from '@/lib/api'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  function prefetchProjects() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.projects(),
      queryFn: async () => {
        const res = await apiClient.projects.list({})
        if (res.status === 200 && res.body.success) return res.body.data
        return []
      },
    })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Portfolio
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={link.href === '/projects' ? prefetchProjects : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground',
                pathname === link.href && 'bg-muted text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
