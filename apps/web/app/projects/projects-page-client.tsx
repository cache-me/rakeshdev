'use client'

import { useQuery } from '@tanstack/react-query'

import CyberPage from '@/features/cyber/cyber-page'
import CyberProjectsPage from '@/features/cyber/pages/cyber-projects-page'
import { apiClient } from '@/lib/api'
import { homeFallback } from '@/lib/home-fallback'

type Project = (typeof homeFallback.projects)[number]

async function fetchProjects(): Promise<Project[]> {
  const res = await apiClient.projects.list({ query: {} })
  if (res.status === 200 && res.body.success && res.body.data.length > 0) {
    return res.body.data
  }
  return homeFallback.projects
}

export default function ProjectsPageClient({ brandName }: { brandName: string }) {
  const { data: projects = homeFallback.projects } = useQuery({
    queryKey: ['projects-page'],
    queryFn: fetchProjects,
    placeholderData: homeFallback.projects,
    staleTime: 30_000,
    refetchOnMount: 'always',
    retry: 2,
  })

  return (
    <CyberPage brandName={brandName}>
      <CyberProjectsPage projects={projects} />
    </CyberPage>
  )
}
