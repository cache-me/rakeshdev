import type { CyberHomeProps } from '@/features/home/cyber-home-page'

/** Shown immediately while the browser loads live API data (or if Render/DB is down). */
export const homeFallback: CyberHomeProps = {
  brandName: 'Rakesh Kumar Swain',
  roleLabel: 'Full Stack Developer',
  headline: 'MERN stack developer building e-governance and product-grade web apps.',
  heroDescription:
    'An aspiring full-stack web developer with a specialization in MERN stack. Enthusiastic, hard-working, and passionate about coding, with the ability to contribute toward organizational goals.',
  projects: [
    {
      id: 'fallback-p1',
      title: 'Immersive 3D Portfolio',
      slug: 'immersive-3d-portfolio',
      summary: 'Cinematic portfolio with adaptive WebGL quality and AI guide.',
      coverImageUrl: '/images/projects/portfolio.jpg',
      demoUrl: null,
      technologies: ['Next.js', 'Three.js', 'TypeScript'],
    },
    {
      id: 'fallback-p2',
      title: 'Realtime Analytics Dashboard',
      slug: 'realtime-analytics-dashboard',
      summary: 'Low-latency dashboards with TanStack Query and streaming APIs.',
      coverImageUrl: '/images/projects/analytics.jpg',
      demoUrl: null,
      technologies: ['React', 'Hono', 'PostgreSQL'],
    },
  ],
  experience: [
    {
      id: 'fallback-e1',
      company: 'Prodios Lab',
      role: 'Software Developer',
      startDate: '2023-08',
      endDate: null,
      current: true,
      description:
        'E-governance platforms (Apuni Sarkar, ITDA, UCC Uttarakhand, UKSRLM) with React, Next.js, NestJS, and typed APIs.',
    },
    {
      id: 'fallback-e2',
      company: 'SearchingYard Software Private Limited',
      role: 'Software Developer',
      startDate: '2022-12',
      endDate: '2023-06',
      current: false,
      description: 'MERN stack product engineering — React UIs, Node/Express APIs, and performance work.',
    },
  ],
  skills: [
    { id: 's1', name: 'React JS', category: 'Frontend' },
    { id: 's2', name: 'Next JS', category: 'Frontend' },
    { id: 's3', name: 'Node JS', category: 'Backend' },
    { id: 's4', name: 'Nestjs', category: 'Backend' },
    { id: 's5', name: 'Typescript', category: 'Frontend' },
    { id: 's6', name: 'PostgreSQL', category: 'Database' },
  ],
  services: [
    {
      id: 'svc1',
      title: 'Full-Stack Development',
      description: 'End-to-end product engineering with modern TypeScript stacks.',
    },
    {
      id: 'svc2',
      title: '3D & Interactive UX',
      description: 'WebGL experiences that stay performant and accessible.',
    },
    {
      id: 'svc3',
      title: 'AI Product Integration',
      description: 'Grounded assistants, search, and workflow automation.',
    },
  ],
}
