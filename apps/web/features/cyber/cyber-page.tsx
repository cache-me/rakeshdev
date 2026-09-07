import type { ReactNode } from 'react'

import CyberFooter from './cyber-footer'
import CyberHeader from './cyber-header'

type CyberPageProps = {
  brandName: string
  children: ReactNode
}

export default function CyberPage({ brandName, children }: CyberPageProps) {
  return (
    <div className="cyber-page cyber-grid-bg relative min-h-screen">
      <CyberHeader brandName={brandName} />
      <div className="relative z-10">{children}</div>
      <CyberFooter brandName={brandName} />
    </div>
  )
}
