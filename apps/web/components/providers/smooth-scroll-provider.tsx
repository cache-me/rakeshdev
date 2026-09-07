'use client'

import { useEffect } from 'react'

export function SmoothScrollProvider({ children }: React.PropsWithChildren) {
  useEffect(() => {
    let lenis: { destroy: () => void } | null = null
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    void import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true })
      function raf(time: number) {
        ;(lenis as InstanceType<typeof Lenis>).raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })

    return () => {
      lenis?.destroy()
    }
  }, [])

  return children
}
