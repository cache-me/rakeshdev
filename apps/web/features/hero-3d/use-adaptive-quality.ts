'use client'

import { useSyncExternalStore } from 'react'

export type QualityTier = 'LOW' | 'MEDIUM' | 'HIGH'

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getInitialTier(): QualityTier {
  if (typeof window === 'undefined') return 'MEDIUM'
  if (getReducedMotion()) return 'LOW'
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  if (isMobile) return 'LOW'
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (memory && memory <= 4) return 'LOW'
  return 'HIGH'
}

export function useAdaptiveQuality(): QualityTier {
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)
  if (reduced) return 'LOW'
  return getInitialTier()
}
