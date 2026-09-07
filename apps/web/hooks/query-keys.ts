export const queryKeys = {
  site: ['site'] as const,
  projects: (featured?: boolean) => ['projects', featured] as const,
  project: (slug: string) => ['project', slug] as const,
  skills: ['skills'] as const,
  experience: ['experience'] as const,
  education: ['education'] as const,
  services: ['services'] as const,
  testimonials: ['testimonials'] as const,
  blog: ['blog'] as const,
  blogPost: (slug: string) => ['blogPost', slug] as const,
  resume: ['resume'] as const,
  now: ['now'] as const,
}
