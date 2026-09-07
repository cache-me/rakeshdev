import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const primaryClass =
  'cyber-btn-primary inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 font-mono'
const outlineClass =
  'cyber-btn-outline inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 font-mono transition hover:border-[var(--cyber-accent)] hover:bg-[var(--cyber-accent-dim)]'

export function CyberPrimaryLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={cn(primaryClass, className)} {...props} />
}

export function CyberOutlineLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={cn(outlineClass, className)} {...props} />
}

export function CyberPrimaryButton({
  className,
  ...props
}: ComponentProps<'button'>) {
  return <button type="button" className={cn(primaryClass, className)} {...props} />
}

export function CyberOutlineButton({
  className,
  ...props
}: ComponentProps<'button'>) {
  return <button type="button" className={cn(outlineClass, className)} {...props} />
}
