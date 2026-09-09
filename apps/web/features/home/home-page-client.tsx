'use client'

import { useQuery } from '@tanstack/react-query'

import CyberHomePage, { type CyberHomeProps } from '@/features/home/cyber-home-page'
import { apiClient } from '@/lib/api'

async function fetchHomePortfolio(initial: CyberHomeProps): Promise<CyberHomeProps> {
  const [settingsRes, projectsRes, skillsRes, experienceRes, servicesRes] = await Promise.all([
    apiClient.site.getSettings(),
    apiClient.projects.list({ query: { featured: true } }),
    apiClient.skills.list(),
    apiClient.experience.list(),
    apiClient.services.list(),
  ])

  const settings =
    settingsRes.status === 200 && settingsRes.body.success ? settingsRes.body.data : null
  const projects =
    projectsRes.status === 200 && projectsRes.body.success ? projectsRes.body.data : []
  const skills = skillsRes.status === 200 && skillsRes.body.success ? skillsRes.body.data : []
  const experience =
    experienceRes.status === 200 && experienceRes.body.success ? experienceRes.body.data : []
  const services =
    servicesRes.status === 200 && servicesRes.body.success ? servicesRes.body.data : []

  const hasLive =
    Boolean(settings) ||
    projects.length > 0 ||
    skills.length > 0 ||
    experience.length > 0 ||
    services.length > 0

  if (!hasLive) return initial

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
    initialData: initial,
    staleTime: 60_000,
    retry: 1,
  })

  return <CyberHomePage {...data} />
}
