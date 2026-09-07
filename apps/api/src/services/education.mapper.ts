import type { EducationMetrics, EducationSemester, EducationSubject, QualificationType } from '@portfolio/validation'
import { educationMetricsSchema } from '@portfolio/validation'

type EducationRow = {
  id: string
  institution: string
  degree: string
  startDate: string | null
  endDate: string | null
  description: string | null
  qualificationType: string
  boardOrIssuer: string | null
  resultSummary: string | null
  certificateUrl: string | null
  subjectsJson: string
  metricsJson: string
  sortOrder: number
}

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch {
    return fallback
  }
}

function parseMetrics(raw: string): EducationMetrics | null {
  try {
    const parsed = JSON.parse(raw) as unknown
    const result = educationMetricsSchema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function mapEducationRow(row: EducationRow) {
  return {
    id: row.id,
    institution: row.institution,
    degree: row.degree,
    startDate: row.startDate,
    endDate: row.endDate,
    description: row.description,
    qualificationType: row.qualificationType as QualificationType,
    boardOrIssuer: row.boardOrIssuer,
    resultSummary: row.resultSummary,
    certificateUrl: row.certificateUrl,
    subjects: parseJsonArray<EducationSubject>(row.subjectsJson, []),
    metrics: parseMetrics(row.metricsJson),
  }
}
