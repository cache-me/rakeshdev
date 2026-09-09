import HomePageClient from '@/features/home/home-page-client'
import { homeFallback } from '@/lib/home-fallback'
import { createPageMetadata, personJsonLd } from '@/lib/seo'

/**
 * No SSR API wait — Render cold starts / hung DB must not block first paint.
 * Live portfolio data is loaded in the browser via TanStack Query.
 */
export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: 'Rakesh — Full-Stack Developer',
  description:
    'Building fast, intelligent and immersive digital experiences — cyber-architect portfolio.',
  path: '/',
})

export default function HomePage() {
  const jsonLd = personJsonLd({
    name: homeFallback.brandName,
    title: homeFallback.roleLabel,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
    email: 'swainrakeshkumar60@gmail.com',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient initial={homeFallback} />
    </>
  )
}
