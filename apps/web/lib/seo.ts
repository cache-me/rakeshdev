import type { Metadata } from 'next'

export function createPageMetadata(input: {
  title: string
  description: string
  path?: string
}): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  const url = input.path ? `${site}${input.path}` : site
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  }
}

export function personJsonLd(input: {
  name: string
  title: string
  url: string
  email?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.title,
    url: input.url,
    email: input.email ?? undefined,
  }
}
