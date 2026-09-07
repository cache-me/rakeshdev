'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { Input, Label } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

import { CyberPrimaryButton } from '@/features/cyber/cyber-buttons'

const cyberInputClass =
  'h-10 rounded border border-[var(--cyber-border)] bg-[#060a0f] font-mono text-sm text-[var(--cyber-text)] shadow-none ring-offset-0 placeholder:text-[var(--cyber-muted)] focus-visible:border-[var(--cyber-accent)] focus-visible:ring-2 focus-visible:ring-[var(--cyber-accent)]/25 focus-visible:ring-offset-0'

const cyberLabelClass =
  'font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]'

export default function AdminLoginForm() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace('/admin')
    }
  }, [session, sessionPending, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const normalizedEmail = email.trim().toLowerCase()
    try {
      if (mode === 'signin') {
        const { error } = await authClient.signIn.email({
          email: normalizedEmail,
          password,
        })
        if (error) {
          toast.error(error.message ?? 'Invalid email or password')
          return
        }
        toast.success('Signed in')
        window.location.assign('/admin')
        return
      } else {
        const { error } = await authClient.signUp.email({
          email: normalizedEmail,
          password,
          name: name.trim() || 'Admin',
        })
        if (error) {
          toast.error(error.message ?? 'Sign up failed')
          return
        }
        toast.message(
          'Account created. Run: pnpm create-admin <email> <password> to grant admin role.',
        )
      }
    } catch {
      toast.error('Authentication failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="hud-panel mx-auto mt-10 flex max-w-md flex-col gap-4 p-6"
    >
      <p className="hud-label">KERNEL_AUTH // ADMIN_GATE</p>
      <h1 className="font-mono text-xl font-semibold uppercase tracking-wide text-[var(--cyber-text)]">
        Admin login
      </h1>
      <p className="font-mono text-[11px] leading-relaxed text-[var(--cyber-muted)]">
        Sign in with an admin account. First time? Run{' '}
        <code className="rounded border border-[var(--cyber-border)] bg-[#060a0f] px-1 py-0.5 text-[10px] text-[var(--cyber-accent)]">
          pnpm create-admin email password
        </code> from the repo root.
      </p>
      {mode === 'signup' ? (
        <div className="grid gap-2">
          <Label htmlFor="name" className={cyberLabelClass}>
            Operator name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cyberInputClass}
            placeholder="Display name"
            autoComplete="name"
          />
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="email" className={cyberLabelClass}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cyberInputClass}
          placeholder="admin@domain.io"
          autoComplete="email"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password" className={cyberLabelClass}>
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${cyberInputClass} pr-10`}
            placeholder="••••••••"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-[var(--cyber-muted)] transition hover:text-[var(--cyber-accent)]"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <CyberPrimaryButton type="submit" disabled={pending} className="w-full">
        {pending ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </CyberPrimaryButton>
      <button
        type="button"
        className="font-mono text-[11px] text-[var(--cyber-muted)] underline"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}
