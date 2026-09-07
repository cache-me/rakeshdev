/** Throw with API error message when admin write responses are not successful. */
export async function assertAdminWrite(
  promise: Promise<{ status: number; body?: unknown }>,
  okStatuses: number[] = [200, 201],
) {
  const res = await promise
  if (!okStatuses.includes(res.status)) {
    const body = res.body as {
      message?: string
      error?: { message?: string }
    }
    throw new Error(
      body?.message ?? body?.error?.message ?? `Request failed (${res.status})`,
    )
  }
  return res
}

export function projectBodyFromForm(form: Record<string, string>) {
  if (!form.title?.trim()) throw new Error('Title is required')
  if (!form.slug?.trim()) throw new Error('Slug is required')
  if (!form.summary?.trim()) throw new Error('Summary is required')
  if (!form.body?.trim()) throw new Error('Body is required')

  const cover = form.coverImageUrl?.trim() ?? ''

  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    featured: form.featured === 'true' || form.featured === 'yes',
    status: form.status === 'draft' ? ('draft' as const) : ('published' as const),
    coverImageUrl: cover || null,
    demoUrl: null,
    repoUrl: null,
    startedAt: null,
    completedAt: null,
    sortOrder: Number(form.sortOrder || 0),
    technologies: (form.technologies ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  }
}

/** Full project payload for partial admin updates (e.g. home show/hide toggle). */
export function projectBodyFromAdminRow(row: {
  title: string
  slug: string
  summary: string
  body: string
  featured: boolean
  status: string
  coverImageUrl?: string | null
  sortOrder?: number | null
  technologies?: string[]
}) {
  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    featured: row.featured,
    status: row.status === 'draft' ? ('draft' as const) : ('published' as const),
    coverImageUrl: row.coverImageUrl ?? null,
    demoUrl: null,
    repoUrl: null,
    startedAt: null,
    completedAt: null,
    sortOrder: Number(row.sortOrder ?? 0),
    technologies: row.technologies ?? [],
  }
}

export function educationBodyFromForm(form: Record<string, string>) {
  if (!form.institution?.trim()) throw new Error('Institution is required')
  if (!form.degree?.trim()) throw new Error('Degree is required')

  const endDateRaw = form.endDate?.trim() ?? ''
  const startDate = form.startDate?.trim() ?? ''
  const ongoing =
    !endDateRaw ||
    /^(continue|present|current|ongoing)$/i.test(endDateRaw)

  return {
    institution: form.institution.trim(),
    degree: form.degree.trim(),
    startDate: startDate || null,
    endDate: ongoing ? null : endDateRaw,
    description: form.description?.trim() || null,
    sortOrder: Number(form.sortOrder || 0),
  }
}

export function experienceBodyFromForm(form: Record<string, string>) {
  const endDateRaw = form.endDate?.trim() ?? ''
  const startDate = form.startDate?.trim() ?? ''
  const ongoing =
    !endDateRaw ||
    /^(continue|present|current|ongoing)$/i.test(endDateRaw)
  if (!form.company?.trim()) throw new Error('Company is required')
  if (!form.role?.trim()) throw new Error('Role is required')
  if (!startDate) throw new Error('Start date is required')

  return {
    company: form.company.trim(),
    role: form.role.trim(),
    location: form.location?.trim() || null,
    startDate,
    endDate: ongoing ? null : endDateRaw,
    current: ongoing,
    description: form.description?.trim() || '—',
    sortOrder: Number(form.sortOrder || 0),
  }
}
