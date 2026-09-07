export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatMonthYear(iso: string | null): string {
  if (!iso) return ''
  const trimmed = iso.trim()
  if (/^\d{4}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/^(\d{4})-(\d{2})/)
  if (!match) return trimmed
  const month = Number(match[2])
  const year = match[1] ?? trimmed
  const names = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const label = names[month - 1]
  return label ? `${label} ${year}` : year
}

export function formatExperienceRange(
  startDate: string,
  endDate: string | null,
  current: boolean,
): string {
  const start = formatMonthYear(startDate)
  const end = current ? 'Present' : formatMonthYear(endDate) || 'Present'
  return `${start} — ${end}`
}

export function descriptionBullets(description: string): string[] {
  return description
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function proficiencyLabel(level: number): string {
  if (level >= 5) return 'Expert'
  if (level >= 4) return 'Advanced'
  if (level >= 3) return 'Intermediate'
  return 'Familiar'
}

export function proficiencyPercent(level: number): number {
  return Math.min(100, Math.max(10, level * 20))
}
