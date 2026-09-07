'use client'

import { usePathname } from 'next/navigation'

import AiAssistantWidget from '@/features/ai-assistant/ai-assistant-widget'

export default function SiteChrome({ children }: React.PropsWithChildren) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <AiAssistantWidget variant="hud" />
    </>
  )
}
