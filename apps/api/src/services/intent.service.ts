import type { AiIntent, NavigationAction, StaticRoute } from '@portfolio/types'
import { STATIC_ROUTES } from '@portfolio/types'
import { extractPersonalDocumentToken } from '@portfolio/validation'

import { getBlogPostBySlug, getProjectBySlug } from './portfolio.service.js'

const ROUTE_LABELS: Record<StaticRoute, string> = {
  '/': 'View Home',
  '/about': 'View About',
  '/projects': 'View Projects',
  '/experience': 'View Experience',
  '/education': 'View Education',
  '/skills': 'View Skills',
  '/blog': 'View Blog',
  '/contact': 'View Contact',
  '/resume': 'Open Resume',
  '/now': 'View Now',
}
export const PERSONAL_DOCUMENTS_ASK_MESSAGE = `These are **private documents** (Aadhaar, PAN, bank passbook) — they are not part of the public portfolio. To view them you need a **time-limited access token** (30 or 60 minutes) that the portfolio owner generates and shares with you.

Agar aapke paas token hai, use **yahi chat mein paste** karein — main verify karke requested documents yahi chat mein dikha dunga. Token ke bina main yahan personal identity ya bank documents show nahi kar sakta.`

export { extractPersonalDocumentToken }

export function isPersonalDocumentsQuestion(message: string): boolean {
  const q = message.toLowerCase()
  return (
    /personal doc|private doc|private vault|secure doc|identity doc|kyc/i.test(q) ||
    /aadhaar|aadhar|pan card|\bpan\b|passbook|bank passbook|bank account detail/i.test(q) ||
    (/rakesh/i.test(q) && /personal|aadhaar|aadhar|pan|passbook|private|bank/i.test(q)) ||
    (/doc|document/i.test(q) &&
      /personal|private|aadhaar|aadhar|pan|passbook|identity|bank account/i.test(q))
  )
}

/** Follow-up in chat after a token was already shared (e.g. "show pan"). */
export function isPersonalDocumentsFollowUp(message: string): boolean {
  const q = message.toLowerCase()
  return (
    /aadhaar|aadhar|\bpan\b|pan card|passbook|bank account|bank passbook|personal doc|private doc|all doc|every doc|saare|sab doc/i.test(
      q,
    )
  )
}

export function detectIntent(message: string): AiIntent {
  const q = message.toLowerCase()

  if (extractPersonalDocumentToken(message) || isPersonalDocumentsQuestion(message)) {
    return 'VIEW_PERSONAL_DOCUMENTS'
  }

  if (/^show me projects|^view projects|my projects|all projects/i.test(q)) {
    return 'VIEW_PROJECTS'
  }
  if (/project.+(called|named)|show me the project/i.test(message)) {
    return 'VIEW_PROJECT'
  }
  if (/react project|search project|filter project/i.test(q)) return 'SEARCH_PROJECTS'
  if (/projects|portfolio work|case stud/i.test(q)) return 'VIEW_PROJECTS'
  if (/experience|work history|jobs|career|prodios|searchingyard/i.test(q)) {
    return 'VIEW_EXPERIENCE'
  }
  if (/education|degree|university|college|studied|msc|bsc|certification|masai|utkal|educat|matric|intermediate|marksheet|graduation|postgrad/i.test(q)) {
    return 'VIEW_EDUCATION'
  }
  if (/skills|technologies|tech stack|stack/i.test(q)) return 'VIEW_SKILLS'
  if (/three\.?js|webgl|3d/i.test(q)) return 'SEARCH_SKILLS'
  if (/blog|articles|writing/i.test(q)) return 'VIEW_BLOG'
  if (/resume|cv|download/i.test(q)) return 'VIEW_RESUME'
  if (/contact|email|reach|hire/i.test(q)) return 'VIEW_CONTACT'
  if (/services|offerings|what do you do/i.test(q)) return 'VIEW_SERVICES'
  if (/now|currently|current work/i.test(q)) return 'VIEW_NOW'
  if (/about|who (is|are)|introduce/i.test(q)) return 'VIEW_ABOUT'
  if (/home|landing/i.test(q)) return 'VIEW_HOME'

  return 'GENERAL_QUESTION'
}

function extractProjectSlug(message: string): string | null {
  const quoted = message.match(/["']([^"']+)["']/)
  if (quoted?.[1]) {
    return quoted[1].toLowerCase().replace(/\s+/g, '-')
  }
  const called = message.match(/(?:called|named)\s+([a-z0-9\s-]+)/i)
  if (called?.[1]) {
    return called[1].trim().toLowerCase().replace(/\s+/g, '-')
  }
  return null
}

export async function validateNavigation(
  intent: AiIntent,
  message: string,
  draft?: NavigationAction,
): Promise<NavigationAction | undefined> {
  if (intent === 'VIEW_PROJECT') {
    const slugGuess = extractProjectSlug(message) ?? draft?.href.split('/').pop()
    if (!slugGuess) return undefined
    const project = await getProjectBySlug(slugGuess)
    if (!project) return undefined
    return {
      type: 'route',
      href: `/projects/${project.slug}`,
      label: 'View Project',
    }
  }

  if (intent === 'VIEW_BLOG_POST') {
    const slug = draft?.href.split('/').pop()
    if (!slug) return undefined
    const post = await getBlogPostBySlug(slug)
    if (!post) return undefined
    return { type: 'route', href: `/blog/${post.slug}`, label: 'Read Article' }
  }

  const staticMap: Partial<Record<AiIntent, StaticRoute>> = {
    VIEW_HOME: '/',
    VIEW_ABOUT: '/about',
    VIEW_PROJECTS: '/projects',
    SEARCH_PROJECTS: '/projects',
    VIEW_EXPERIENCE: '/experience',
    VIEW_EDUCATION: '/education',
    VIEW_SKILLS: '/skills',
    SEARCH_SKILLS: '/skills',
    SEARCH_EXPERIENCE: '/experience',
    VIEW_BLOG: '/blog',
    VIEW_RESUME: '/resume',
    VIEW_CONTACT: '/contact',
    VIEW_SERVICES: '/projects',
    VIEW_NOW: '/now',
  }

  const href = staticMap[intent]
  if (!href || !STATIC_ROUTES.includes(href)) return undefined

  if (draft && draft.href !== href) return undefined

  return { type: 'route', href, label: ROUTE_LABELS[href] }
}

export function buildGroundedFacts(context: Awaited<
  ReturnType<typeof import('./portfolio.service.js').getPortfolioContext>
>) {
  const { settings, projects, skills, experience, services, education } = context
  if (!settings) return 'No site settings available.'

  const links = settings.socialLinks ?? {}
  const educationEntries = education.filter((ed) => ed.qualificationType !== 'professional')
  const certificationRows = education.filter((ed) => ed.qualificationType === 'professional')

  const spokenLanguages = skills
    .filter((s) => s.category.toLowerCase() === 'language')
    .map((s) => ({ name: s.name, proficiency: s.proficiency }))

  const technicalSkills = skills.filter(
    (s) =>
      s.category.toLowerCase() !== 'language' &&
      !s.category.toLowerCase().startsWith('personal'),
  )

  return JSON.stringify(
    {
      person: {
        name: settings.name,
        title: settings.title,
        bio: settings.bio,
        location: settings.location,
        availability: settings.availability,
        email: settings.email,
        phone: links.phone ?? null,
        website: links.website ?? null,
        linkedIn: links.linkedin ?? links.linkedIn ?? null,
      },
      projects: projects.map((p) => ({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        technologies: p.technologies,
      })),
      skills: technicalSkills.map((s) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
      })),
      languages: spokenLanguages,
      experience: experience.map((e) => ({
        role: e.role,
        company: e.company,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
        description: e.description,
      })),
      education: educationEntries.map((ed) => ({
        degree: ed.degree,
        institution: ed.institution,
        startDate: ed.startDate,
        endDate: ed.endDate,
        board: ed.boardOrIssuer,
        result: ed.resultSummary,
        subjects: ed.subjects,
        metrics: ed.metrics,
      })),
      certifications: certificationRows.map((ed) => ({
        title: ed.degree,
        institution: ed.institution,
        year: ed.endDate ?? ed.startDate,
        certificateId: ed.metrics?.certificateId ?? null,
        learningHours: ed.metrics?.learningHours ?? null,
      })),
      services: services.map((s) => ({ title: s.title, description: s.description })),
      personalDocumentsVault: {
        description:
          'Private Aadhaar, PAN, and bank passbook scans — not in public portfolio data.',
        access:
          'Requires a 30–60 minute token from the site owner. Visitors paste the token in the AI chat or at /personal-documents/view.',
        neverShareWithoutToken: true,
      },
    },
    null,
    2,
  )
}
