import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import QueryProvider from '@/components/providers/query-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import SiteChrome from '@/components/site-chrome'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <SmoothScrollProvider>
              <SiteChrome>{children}</SiteChrome>
              <Toaster richColors position="top-center" />
            </SmoothScrollProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
