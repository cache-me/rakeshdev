import { eq } from 'drizzle-orm'

import { createDb } from './index'
import { getDatabaseUrl } from './load-env'
import {
  blogPosts,
  categories,
  education,
  experience,
  projectTechnologies,
  projects,
  services,
  siteSettings,
  skills,
  testimonials,
} from './schema/portfolio'
import { personalDocumentAccessTokens, personalDocuments } from './schema/personal-documents.js'
import { educationSeedRows } from './seed-education-data.js'
import { seedPersonalDocuments } from './seed-personal-docs.js'

async function main() {
  const url = getDatabaseUrl()
  const { db, client } = createDb(url)

  await db.delete(projectTechnologies)
  await db.delete(projects)
  await db.delete(blogPosts)
  await db.delete(categories)
  await db.delete(skills)
  await db.delete(experience)
  await db.delete(education)
  await db.delete(personalDocumentAccessTokens)
  await db.delete(personalDocuments)
  await db.delete(services)
  await db.delete(testimonials)
  await db.delete(siteSettings)

  await db.insert(siteSettings).values({
    name: 'Rakesh Kumar Swain',
    title: 'Full Stack Developer',
    tagline: 'MERN stack developer building e-governance and product-grade web apps.',
    bio: 'An aspiring full-stack web developer with a specialization in MERN stack. Enthusiastic, hard-working, and passionate about coding, with the ability to contribute toward organizational goals. Looking forward to working as a software developer in a challenging work environment.',
    heroIntro:
      "Hi, I'm Rakesh Kumar Swain — a full-stack developer specializing in React, Next.js, and Node ecosystems.",
    profileImageUrl: '/images/profile.jpg',
    resumeUrl: '/resume.pdf',
    email: 'swainrakeshkumar60@gmail.com',
    location: 'Apilo, Cuttack',
    availability: 'Open to software developer roles',
    nowContent:
      'Building e-governance platforms at Prodios Lab and sharpening full-stack skills across React, NestJS, and modern API tooling.',
    socialLinks: JSON.stringify({
      linkedin: 'https://www.linkedin.com/in/rakesh-kumar-swain-8259a7164/',
      website: 'https://rakesh-swain.netlify.app/',
      phone: '+91 765 3862 991',
      gender: 'Masculine',
      dateOfBirth: '1998-05-11',
      nationality: 'Indian',
      hobbies: 'Photography|Volleyball|Cricket|Watching Movie',
    }),
    seoTitle: 'Rakesh Kumar Swain — Full Stack Developer',
    seoDescription:
      'Portfolio of Rakesh Kumar Swain — full-stack developer (MERN), e-governance platforms, and modern TypeScript stacks.',
  })

  const [cat] = await db
    .insert(categories)
    .values({ name: 'Engineering', slug: 'engineering' })
    .returning()

  await db
    .insert(skills)
    .values([
      { name: 'React JS', category: 'Frontend', proficiency: 4, sortOrder: 1, searchText: 'react frontend' },
      { name: 'Next JS', category: 'Frontend', proficiency: 4, sortOrder: 2, searchText: 'nextjs react' },
      { name: 'Node JS', category: 'Backend', proficiency: 4, sortOrder: 3, searchText: 'node backend' },
      { name: 'Express JS', category: 'Backend', proficiency: 4, sortOrder: 4, searchText: 'express node' },
      { name: 'MongoDB', category: 'Database', proficiency: 4, sortOrder: 5, searchText: 'mongodb database' },
      { name: 'TailwindCSS', category: 'Frontend', proficiency: 4, sortOrder: 6, searchText: 'tailwind css' },
      { name: 'HTML5', category: 'Frontend', proficiency: 4, sortOrder: 7, searchText: 'html' },
      { name: 'CSS', category: 'Frontend', proficiency: 4, sortOrder: 8, searchText: 'css' },
      { name: 'JavaScript', category: 'Frontend', proficiency: 4, sortOrder: 9, searchText: 'javascript' },
      { name: 'Typescript', category: 'Frontend', proficiency: 4, sortOrder: 10, searchText: 'typescript' },
      { name: 'Nestjs', category: 'Backend', proficiency: 4, sortOrder: 11, searchText: 'nestjs backend' },
      { name: 'Trpc', category: 'Backend', proficiency: 4, sortOrder: 12, searchText: 'trpc api' },
      { name: 'Shadcn', category: 'Frontend', proficiency: 4, sortOrder: 13, searchText: 'shadcn ui' },
      { name: 'AI Agent', category: 'Tools', proficiency: 3, sortOrder: 14, searchText: 'ai agent' },
      { name: 'English', category: 'Language', proficiency: 3, sortOrder: 20, searchText: 'english language' },
      { name: 'Hindi', category: 'Language', proficiency: 4, sortOrder: 21, searchText: 'hindi language' },
      { name: 'Odia', category: 'Language', proficiency: 5, sortOrder: 22, searchText: 'odia language' },
      { name: 'Time management', category: 'Personal Skill', proficiency: 4, sortOrder: 30, searchText: 'soft skill' },
      { name: 'Teamwork', category: 'Personal Skill', proficiency: 4, sortOrder: 31, searchText: 'soft skill' },
      { name: 'Problem-solving', category: 'Personal Skill', proficiency: 4, sortOrder: 32, searchText: 'soft skill' },
      { name: 'Adaptability', category: 'Personal Skill', proficiency: 4, sortOrder: 33, searchText: 'soft skill' },
      { name: 'Stress management', category: 'Personal Skill', proficiency: 4, sortOrder: 34, searchText: 'soft skill' },
      { name: 'Creativity', category: 'Personal Skill', proficiency: 4, sortOrder: 35, searchText: 'soft skill' },
    ])
    .returning()

  await db.insert(experience).values([
    {
      company: 'Prodios Lab',
      role: 'Software Developer',
      location: 'India',
      startDate: '2023-08',
      endDate: null,
      current: true,
      description:
        'Contributed to the development of multiple e-Governance projects including Apuni Sarkar (e-Service), ITDA Portal, Uniform Civil Code (UCC Uttarakhand), and UKSRLM (Uttarakhand Rural Livelihoods Mission). Led the frontend and backend implementation for critical platforms using React.js, Next.js, NestJS, TRPC, ts-rest, and Prisma. Developed and maintained a custom CMS for the Positive Mind Care App, enabling streamlined content management for mental health services. Integrated third-party services like Aadhaar Authentication, CSC Payment Gateway, and SBI Payment Gateway to enable secure and reliable digital service delivery. Built dynamic and user-friendly UI components using shadcn/ui for consistent and accessible user experiences. Ensured robust API communication and type safety with modern API design tools (TRPC and ts-rest), improving developer productivity and reducing bugs. Collaborated closely with government stakeholders and internal teams to align digital solutions with public service goals and compliance standards.',
      sortOrder: 1,
      searchText: 'prodios lab software developer egovernance',
    },
    {
      company: 'SearchingYard Software Private Limited',
      role: 'Software Developer',
      location: 'India',
      startDate: '2022-12',
      endDate: '2023-06',
      current: false,
      description:
        'Develop and maintain web applications using the MERN stack, ensuring end-to-end functionality and performance. This includes building both front-end and back-end components, integrating APIs, and handling data storage and retrieval. Create user-friendly and visually appealing user interfaces using React.js and related front-end technologies. Implement responsive designs to ensure optimal user experiences across various devices and browsers. Design and implement server-side logic using Node.js and Express.js to handle data processing, user authentication, and API development. Ensure server performance and scalability for handling concurrent requests. Optimize web application performance to achieve fast loading times and smooth user interactions. Identify and address bottlenecks and performance issues.',
      sortOrder: 2,
      searchText: 'searchingyard mern software developer',
    },
  ])

  await db.insert(education).values([...educationSeedRows])

  const [p1] = await db
    .insert(projects)
    .values({
      title: 'Immersive 3D Portfolio',
      slug: 'immersive-3d-portfolio',
      summary: 'Cinematic portfolio with adaptive WebGL quality and AI guide.',
      body: 'A production-grade portfolio featuring React Three Fiber, adaptive rendering, and grounded AI navigation.',
      featured: true,
      coverImageUrl: '/images/projects/portfolio.jpg',
      demoUrl: 'https://example.com',
      sortOrder: 1,
      searchText: 'portfolio threejs ai webgl',
    })
    .returning()

  const [p2] = await db
    .insert(projects)
    .values({
      title: 'Realtime Analytics Dashboard',
      slug: 'realtime-analytics-dashboard',
      summary: 'Low-latency dashboards with TanStack Query and streaming APIs.',
      body: 'Built with Next.js, Hono, and PostgreSQL for operational analytics.',
      featured: true,
      coverImageUrl: '/images/projects/analytics.jpg',
      sortOrder: 2,
      searchText: 'react dashboard analytics',
    })
    .returning()

  if (p1) {
    await db.insert(projectTechnologies).values([
      { projectId: p1.id, technology: 'Next.js' },
      { projectId: p1.id, technology: 'Three.js' },
      { projectId: p1.id, technology: 'TypeScript' },
    ])
  }
  if (p2) {
    await db.insert(projectTechnologies).values([
      { projectId: p2.id, technology: 'React' },
      { projectId: p2.id, technology: 'Hono' },
      { projectId: p2.id, technology: 'PostgreSQL' },
    ])
  }

  await db.insert(services).values([
    {
      title: 'Full-Stack Development',
      description: 'End-to-end product engineering with modern TypeScript stacks.',
      iconKey: 'code',
      sortOrder: 1,
      searchText: 'fullstack development',
    },
    {
      title: '3D & Interactive UX',
      description: 'WebGL experiences that stay performant and accessible.',
      iconKey: 'box',
      sortOrder: 2,
      searchText: '3d webgl interactive',
    },
    {
      title: 'AI Product Integration',
      description: 'Grounded assistants, search, and workflow automation.',
      iconKey: 'sparkles',
      sortOrder: 3,
      searchText: 'ai integration chatbot',
    },
  ])

  await db.insert(testimonials).values([
    {
      author: 'Alex Chen',
      role: 'Product Lead',
      quote:
        'Rakesh delivers premium interfaces without sacrificing performance or maintainability.',
      sortOrder: 1,
    },
    {
      author: 'Priya Sharma',
      role: 'Design Director',
      quote:
        'Rare combination of engineering depth and cinematic UX sensibility.',
      sortOrder: 2,
    },
  ])

  await db.insert(blogPosts).values([
    {
      title: 'Adaptive WebGL for Production Sites',
      slug: 'adaptive-webgl-production',
      excerpt: 'Quality tiers, FPS monitoring, and respectful fallbacks.',
      content: 'Full article content about adaptive 3D rendering strategies...',
      publishedAt: new Date(),
      categoryId: cat?.id,
      searchText: 'webgl performance adaptive',
    },
    {
      title: 'Grounded AI Assistants for Portfolios',
      slug: 'grounded-ai-portfolio-assistants',
      excerpt: 'Intent detection and validated navigation actions.',
      content: 'How to prevent hallucinations in personal portfolio bots...',
      publishedAt: new Date(),
      categoryId: cat?.id,
      searchText: 'ai portfolio chatbot',
    },
  ])

  const settings = await db.select().from(siteSettings).limit(1)
  if (settings[0]) {
    await db
      .update(siteSettings)
      .set({ updatedAt: new Date() })
      .where(eq(siteSettings.id, settings[0].id))
  }

  await seedPersonalDocuments(db)

  await client.end()
  console.log('Seed completed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
