import type { MetadataRoute } from 'next'

import { apiClient } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  const staticRoutes = ['', '/about', '/projects', '/experience', '/skills', '/blog', '/contact', '/resume', '/now']
  const projectsRes = await apiClient.projects.list({ query: {} })
  const blogRes = await apiClient.blog.list()
  const projects =
    projectsRes.status === 200 && projectsRes.body.success ? projectsRes.body.data : []
  const posts = blogRes.status === 200 && blogRes.body.success ? blogRes.body.data : []

  return [
    ...staticRoutes.map((path) => ({
      url: `${site}${path}`,
      lastModified: new Date(),
    })),
    ...projects.map((p) => ({
      url: `${site}/projects/${p.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `${site}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    })),
  ]
}
