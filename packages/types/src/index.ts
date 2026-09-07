export const AI_INTENTS = [
  'VIEW_HOME',
  'VIEW_ABOUT',
  'VIEW_PROJECTS',
  'VIEW_PROJECT',
  'VIEW_EXPERIENCE',
  'VIEW_EDUCATION',
  'VIEW_SKILLS',
  'VIEW_BLOG',
  'VIEW_BLOG_POST',
  'VIEW_RESUME',
  'VIEW_CONTACT',
  'VIEW_SERVICES',
  'VIEW_NOW',
  'SEARCH_PROJECTS',
  'SEARCH_SKILLS',
  'SEARCH_EXPERIENCE',
  'VIEW_PERSONAL_DOCUMENTS',
  'GENERAL_QUESTION',
] as const

export type AiIntent = (typeof AI_INTENTS)[number]

export type NavigationAction = {
  type: 'route'
  href: string
  label: string
}

export type AiChatPersonalDocument = {
  id: string
  docType: 'aadhaar' | 'pan' | 'bank' | 'other'
  title: string
  imageUrl: string
}

export type AiChatEducationCertificate = {
  id: string
  qualificationType: 'matric' | 'intermediate' | 'undergraduate' | 'postgraduate' | 'professional'
  degree: string
  institution: string
  resultSummary: string | null
  imageUrl: string | null
}

export type AiChatResponse = {
  message: string
  intent: AiIntent
  navigation?: NavigationAction
  personalDocuments?: AiChatPersonalDocument[]
  educationCertificates?: AiChatEducationCertificate[]
}

export type ApiErrorBody = {
  success: false
  error: {
    code: string
    message: string
  }
}

export const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/experience',
  '/skills',
  '/education',
  '/blog',
  '/contact',
  '/resume',
  '/now',
] as const

export type StaticRoute = (typeof STATIC_ROUTES)[number]
