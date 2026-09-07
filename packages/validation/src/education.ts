import { z } from 'zod'

export const QUALIFICATION_TYPES = [
  'matric',
  'intermediate',
  'undergraduate',
  'postgraduate',
  'professional',
] as const

export type QualificationType = (typeof QUALIFICATION_TYPES)[number]

export const educationPaperSchema = z.object({
  subject: z.string(),
  credits: z.number().optional(),
  maxInternal: z.number().optional(),
  maxFinal: z.number().optional(),
  marksInternal: z.number().optional(),
  marksFinal: z.number().optional(),
  total: z.number().optional(),
  creditPoints: z.number().optional(),
  grade: z.string().optional(),
})

export const educationSemesterSchema = z.object({
  name: z.string(),
  sgpa: z.number(),
  totalMarks: z.number(),
  credits: z.number(),
  papers: z.array(educationPaperSchema),
})

export const educationSubjectSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  maxMarks: z.number().optional(),
  marks: z.number().optional(),
  grade: z.string().optional(),
})

export const educationMetricsSchema = z.object({
  totalMarks: z.number().optional(),
  maxMarks: z.number().optional(),
  cgpa: z.number().optional(),
  division: z.string().optional(),
  grade: z.string().optional(),
  certificateId: z.string().optional(),
  learningHours: z.number().optional(),
  rollNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  stream: z.string().optional(),
  coreSubject: z.string().optional(),
  admissionYear: z.string().optional(),
  publishedAt: z.string().optional(),
  categoryTotals: z.record(z.number()).optional(),
  semesters: z.array(educationSemesterSchema).optional(),
})

export const educationRecordSchema = z.object({
  id: z.string().uuid(),
  institution: z.string(),
  degree: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  description: z.string().nullable(),
  qualificationType: z.enum(QUALIFICATION_TYPES),
  boardOrIssuer: z.string().nullable(),
  resultSummary: z.string().nullable(),
  certificateUrl: z.string().nullable(),
  subjects: z.array(educationSubjectSchema),
  metrics: educationMetricsSchema.nullable(),
})

export type EducationPaper = z.infer<typeof educationPaperSchema>
export type EducationSemester = z.infer<typeof educationSemesterSchema>
export type EducationRecord = z.infer<typeof educationRecordSchema>
export type EducationSubject = z.infer<typeof educationSubjectSchema>
export type EducationMetrics = z.infer<typeof educationMetricsSchema>

export const aiChatEducationCertificateSchema = z.object({
  id: z.string().uuid(),
  qualificationType: z.enum(QUALIFICATION_TYPES),
  degree: z.string(),
  institution: z.string(),
  resultSummary: z.string().nullable(),
  imageUrl: z.string().nullable(),
})

export type EducationQualFilter = QualificationType | 'all'

/** User wants certificate/marksheet scans in chat (not private Aadhaar/PAN). */
export function isEducationCertificateChatRequest(message: string): boolean {
  const q = message.toLowerCase()
  if (/aadhaar|aadhar|\bpan\b|passbook|bank account|personal doc|private doc/i.test(q)) {
    return false
  }

  const certWords = /certificate|marksheet|mark sheet|marks sheet|scan|document|cert\b/i
  const qualWords =
    /matric|10th|class x|matriculation|intermediate|\+2|12th|higher secondary|hsc|chse|plus two|graduation|graduate|bsc|b\.?sc|undergrad|bachelor|honours|post.?grad|postgraduate|msc|m\.?sc|master|masai|professional|education|degree|qualification/i

  if (certWords.test(q) && qualWords.test(q)) return true

  if (
    /show|view|see|display|open|download|dikhao|dekho/i.test(q) &&
    /matric|intermediate|\+2|12th|bsc|msc|graduation|masai|marksheet|certificate|degree cert/i.test(q)
  ) {
    return true
  }

  return false
}

export function detectEducationCertificateFilters(message: string): EducationQualFilter[] {
  const q = message.toLowerCase()

  if (/all cert|every cert|all marksheet|all education|saare cert|sab cert|all qualification/i.test(q)) {
    return ['all']
  }

  const filters: QualificationType[] = []
  if (/matric|10th|class x|matriculation|secondary examination/i.test(q)) {
    filters.push('matric')
  }
  if (/intermediate|\+2|12th|higher secondary|hsc|chse|plus two/i.test(q)) {
    filters.push('intermediate')
  }
  if (
    /graduation|graduate|undergrad|under graduate|bsc|b\.?sc|bachelor| honours|honours|degree honours/i.test(
      q,
    )
  ) {
    filters.push('undergraduate')
  }
  if (/post.?grad|postgraduate|msc|m\.?sc|master'?s degree/i.test(q)) {
    filters.push('postgraduate')
  }
  if (/masai|professional cert|bootcamp|full stack program|industry program/i.test(q)) {
    filters.push('professional')
  }

  if (filters.length > 0) return filters
  return ['all']
}
