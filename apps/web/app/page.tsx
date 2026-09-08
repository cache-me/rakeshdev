import { unstable_noStore as noStore } from 'next/cache'

import CyberHomePage from '@/features/home/cyber-home-page'
import { apiClient, SSR_REVALIDATE_SECONDS } from '@/lib/api'
import { createPageMetadata, personJsonLd } from '@/lib/seo'

/** Cache warm homepage HTML; skipped via noStore() when the API returns nothing. */
export const revalidate = SSR_REVALIDATE_SECONDS

export const metadata = createPageMetadata({
  title: 'Rakesh — Full-Stack Developer',
  description:
    'Building fast, intelligent and immersive digital experiences — cyber-architect portfolio.',
  path: '/',
})

async function loadHomeData() {
  const [settingsRes, projectsRes, skillsRes, experienceRes, servicesRes] = await Promise.all([
    apiClient.site.getSettings(),
    apiClient.projects.list({ query: { featured: true } }),
    apiClient.skills.list(),
    apiClient.experience.list(),
    apiClient.services.list(),
  ])

  const data = {
    settings: settingsRes.status === 200 && settingsRes.body.success ? settingsRes.body.data : null,
    projects:
      projectsRes.status === 200 && projectsRes.body.success ? projectsRes.body.data : [],
    skills: skillsRes.status === 200 && skillsRes.body.success ? skillsRes.body.data : [],
    experience:
      experienceRes.status === 200 && experienceRes.body.success ? experienceRes.body.data : [],
    services:
      servicesRes.status === 200 && servicesRes.body.success ? servicesRes.body.data : [],
  }

  // Do not ISR-cache an empty shell when Render/DB timed out
  const apiEmpty =
    !data.settings &&
    data.projects.length === 0 &&
    data.skills.length === 0 &&
    data.experience.length === 0
  if (apiEmpty) noStore()

  return data
}

export default async function HomePage() {
  const { settings, projects, skills, experience, services } = await loadHomeData()

  const name = settings?.name ?? 'Rakesh'
  const roleLabel = settings?.title ?? 'Senior Full-Stack Architect & Tech'
  const headline =
    settings?.tagline ?? 'Building fast, intelligent and immersive digital experiences.'
  const heroDescription =
    settings?.bio ??
    'Architecting hyper-performant backend systems with TypeScript & Hono, coupled with immersive WebGL frontends that redefine browser capabilities.'

  const jsonLd = personJsonLd({
    name,
    title: roleLabel,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
    email: settings?.email,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CyberHomePage
        brandName={name}
        roleLabel={roleLabel}
        headline={headline}
        heroDescription={heroDescription}
        projects={projects}
        experience={experience}
        skills={skills}
        services={services}
      />
    </>
  )
}
