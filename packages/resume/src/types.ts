import type { ResumeTemplateId } from '@portfolio/validation'

export type ResumeExperience = {
  role: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string
}

export type ResumeEducation = {
  institution: string
  degree: string
  startDate: string | null
  endDate: string | null
  description: string | null
}

export type ResumeSkill = {
  name: string
  category: string
  proficiency: number
}

export type ResumeCertification = {
  title: string
  year: string | null
  institution: string
}

export type ResumeMoreInfo = {
  gender?: string
  dateOfBirth?: string
  nationality?: string
}

export type ResumeRatedItem = {
  name: string
  proficiency: number
}

export type ResumeDocument = {
  name: string
  title: string
  summary: string
  email: string | null
  phone: string | null
  website: string | null
  linkedIn: string | null
  location: string | null
  profileImageUrl: string | null
  hobbies: string[]
  moreInfo: ResumeMoreInfo | null
  skills: ResumeSkill[]
  languages: ResumeRatedItem[]
  personalSkills: ResumeRatedItem[]
  certifications: ResumeCertification[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  generatedAt: string
}

export type ResumeTemplateMeta = {
  id: ResumeTemplateId
  name: string
  category: 'white' | 'color'
  description: string
  accent: string
}

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  {
    id: 'navy-orange-pro',
    name: 'Navy & Orange Pro',
    category: 'color',
    description: 'Dark sidebar with orange accents, skill dots, and photo header — your live CV style.',
    accent: '#d97706',
  },
  {
    id: 'white-classic',
    name: 'Classic White',
    category: 'white',
    description: 'Clean single-column layout with bold section headers.',
    accent: '#111827',
  },
  {
    id: 'white-serif',
    name: 'Traditional Serif',
    category: 'white',
    description: 'Serif typography with a professional, print-ready feel.',
    accent: '#1f2937',
  },
  {
    id: 'white-minimal',
    name: 'Minimal White',
    category: 'white',
    description: 'Lightweight layout with contact details in the header row.',
    accent: '#374151',
  },
  {
    id: 'teal-center',
    name: 'Teal Centered',
    category: 'color',
    description: 'Centered headings with teal accents and timeline dates.',
    accent: '#0f766e',
  },
  {
    id: 'maroon-center',
    name: 'Maroon Executive',
    category: 'color',
    description: 'Centered maroon titles with balanced two-column skills.',
    accent: '#7f1d1d',
  },
  {
    id: 'blue-margin',
    name: 'Blue Margin',
    category: 'color',
    description: 'Section labels in the left margin with blue highlights.',
    accent: '#2563eb',
  },
  {
    id: 'slate-columns',
    name: 'Slate Columns',
    category: 'color',
    description: 'Two-column body with slate section rails and photo header.',
    accent: '#475569',
  },
  {
    id: 'gray-sidebar',
    name: 'Gray Sidebar',
    category: 'color',
    description: 'Contact and skills in a soft gray sidebar.',
    accent: '#64748b',
  },
  {
    id: 'mauve-banner',
    name: 'Mauve Banner',
    category: 'color',
    description: 'Full-width banner header with margin section titles.',
    accent: '#9d8189',
  },
  {
    id: 'yellow-sidebar',
    name: 'Yellow Accent',
    category: 'color',
    description: 'White body with a warm yellow sidebar for contact.',
    accent: '#ca8a04',
  },
  {
    id: 'teal-sidebar',
    name: 'Teal Sidebar',
    category: 'color',
    description: 'Teal sidebar with summary and skills; experience on the right.',
    accent: '#0d9488',
  },
  {
    id: 'teal-photo',
    name: 'Teal Photo',
    category: 'color',
    description: 'Wide content column with photo and contact on the right.',
    accent: '#0891b2',
  },
]
