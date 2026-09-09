'use client'

import { useQuery } from '@tanstack/react-query'

import CyberHomePage, { type CyberHomeProps } from '@/features/home/cyber-home-page'
import { apiClient } from '@/lib/api'

async function fetchHomePortfolio(initial: CyberHomeProps): Promise<CyberHomeProps> {
  const res = await apiClient.site.getHome({ query: { featured: true } })
  if (res.status !== 200 || !res.body.success) return initial

  const { settings, projects, skills, experience, services } = res.body.data

  return {
    brandName: settings?.name ?? initial.brandName,
    roleLabel: settings?.title ?? initial.roleLabel,
    headline: settings?.tagline ?? initial.headline,
    heroDescription: settings?.bio ?? initial.heroDescription,
    projects: projects.length > 0 ? projects : initial.projects,
    experience: experience.length > 0 ? experience : initial.experience,
    skills: skills.length > 0 ? skills : initial.skills,
    services: services.length > 0 ? services : initial.services,
  }
}

export default function HomePageClient({ initial }: { initial: CyberHomeProps }) {
  const { data } = useQuery({
    queryKey: ['home-portfolio'],
    queryFn: () => fetchHomePortfolio(initial),
    // Show seed/fallback immediately, always try live DB (initialData would skip refetch)
    placeholderData: initial,
    staleTime: 30_000,
    refetchOnMount: 'always',
    retry: 2,
    retryDelay: 1500,
  })

  return <CyberHomePage {...(data ?? initial)} />
}
