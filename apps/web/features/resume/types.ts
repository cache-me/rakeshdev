export type ResumeTemplateId =
  | 'navy-orange-pro'
  | 'white-classic'
  | 'white-serif'
  | 'white-minimal'
  | 'teal-center'
  | 'maroon-center'
  | 'blue-margin'
  | 'slate-columns'
  | 'gray-sidebar'
  | 'mauve-banner'
  | 'yellow-sidebar'
  | 'teal-sidebar'
  | 'teal-photo'

export type ResumeTemplateMeta = {
  id: ResumeTemplateId
  name: string
  category: 'white' | 'color'
  description: string
  accent: string
}
