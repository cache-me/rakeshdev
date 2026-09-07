export type CyberCrudUi = {
  registryTitle?: string
  addRecordLabel?: string
  commitLabel?: string
  purgeLabel?: string
  editActionLabel?: string
  cloneActionLabel?: string
  purgeActionLabel?: string
  extraActionLabel?: string
  recordIdPrefix?: string
  searchPlaceholder?: string
  exportLabel?: string
  secondaryExportLabel?: string
  dockEditLabel?: string
  pipelineLabels?: [string, string, string]
  showKernelFeed?: boolean
  showMediaStub?: boolean
  formatRecordTitle?: (row: Record<string, unknown>) => string
  formatRecordSubtitle?: (row: Record<string, unknown>) => string
  recordBadge?: (row: Record<string, unknown>, index: number) => string
  recordMetrics?: (row: Record<string, unknown>, index: number) => string[]
  recordTags?: (row: Record<string, unknown>) => string[]
  headerStats?: (rows: Record<string, unknown>[]) => string
  /** Open add/edit form in a centered dialog instead of the side dock */
  useAddDialog?: boolean
  addDialogTitle?: string
  /** Quick toggle for home featured section (e.g. projects.featured) */
  homeFeaturedToggle?: {
    fieldKey: string
    showLabel: string
    hideLabel: string
  }
}

export const educationCrudUi: CyberCrudUi = {
  registryTitle: 'ACADEMIC_CREDENTIAL_REGISTRY',
  addRecordLabel: '+ ADD EDUCATION ⚡',
  useAddDialog: true,
  addDialogTitle: 'MUTATION_DOCK // NEW EDUCATION RECORD',
  commitLabel: 'COMMIT & PUBLISH CREDENTIAL ⚡',
  purgeLabel: 'PURGE_RECORD',
  editActionLabel: 'EDIT / TUNE',
  cloneActionLabel: 'CLONE',
  purgeActionLabel: 'PURGE_RECORD',
  recordIdPrefix: 'EDU',
  searchPlaceholder: "grep -i 'degree/institution'",
  exportLabel: 'EXPORT JSON',
  dockEditLabel: 'EDIT CREDENTIAL',
  pipelineLabels: [
    'PUBLIC_PROFILE_INGRESS',
    'CREDENTIAL_ATTESTATION',
    'AI_ASSISTANT_RAG_SYNTHESIS',
  ],
  formatRecordTitle: (row) => String(row.degree ?? 'Degree'),
  formatRecordSubtitle: (row) => {
    const inst = row.institution ? String(row.institution) : 'Institution'
    const start = row.startDate ? String(row.startDate) : '—'
    const end = row.endDate ? String(row.endDate) : 'PRESENT'
    return `${inst} · ${start} → ${end}`
  },
  recordBadge: (_row, index) => {
    const badges = ['VERIFIED_CREDENTIAL', 'SYNCED_TO_PUBLIC', 'ARCHIVED_ACCESSIBLE'] as const
    return badges[index % badges.length] ?? 'VERIFIED_CREDENTIAL'
  },
}

export const experienceCrudUi: CyberCrudUi = {
  registryTitle: 'IMMUTABLE_CAREER_NODES',
  addRecordLabel: '+ ADD CAREER MILESTONE ⚡',
  useAddDialog: true,
  addDialogTitle: 'MUTATION_DOCK // NEW CAREER MILESTONE',
  commitLabel: 'COMMIT & PUBLISH MILESTONE ⚡',
  purgeLabel: 'PURGE_NODE',
  editActionLabel: 'EDIT / TUNE',
  cloneActionLabel: 'CLONE',
  purgeActionLabel: 'PURGE_RECORD',
  extraActionLabel: 'GENERATE_PROOF',
  recordIdPrefix: 'EXP',
  searchPlaceholder: "grep -i 'architect/rust'",
  exportLabel: 'EXPORT JSON',
  dockEditLabel: 'EDIT RECORD',
  pipelineLabels: [
    'PUBLIC_TIMELINE_INGRESS',
    'ATTESTATION_HASH_STAMP',
    'AI_ASSISTANT_RAG_SYNTHESIS',
  ],
  formatRecordTitle: (row) => `${String(row.role ?? 'Role')} @ ${String(row.company ?? 'Org')}`,
  formatRecordSubtitle: (row) => {
    const start = row.startDate ? String(row.startDate) : '—'
    const end = row.current || !row.endDate ? 'PRESENT' : String(row.endDate)
    const loc = row.location ? ` · ${String(row.location)}` : ''
    return `${start} → ${end}${loc}`
  },
  recordBadge: (row, index) => {
    if (row.current) return 'ACTIVE_NODE_PRIMARY'
    const badges = ['VERIFIED_COMPLETED', 'ARCHIVED_ACCESSIBLE', 'SYNCED_TO_PUBLIC'] as const
    return badges[index % badges.length] ?? 'VERIFIED_COMPLETED'
  },
  recordMetrics: (_row, index) => {
    const sets = [
      ['PIPELINE_SPEED: Sub-8ms', 'GRAPHICS_SUITE: 60 FPS', 'INFRA_COST_DELTA: -62.4%'],
      ['EDGE_LATENCY: 1.4ms', 'CACHE_HIT: 99.1%', 'DEPLOY_RING: us-east-1'],
      ['THROUGHPUT: 42k rps', 'ERROR_BUDGET: 99.95%', 'ROLLBACKS: 0'],
    ]
    return sets[index % sets.length] ?? sets[0]!
  },
}

export const projectCrudUi: CyberCrudUi = {
  registryTitle: 'REGISTRY_TABLE // REPO_ALLOCATION',
  addRecordLabel: '+ ADD NEW PROJECT ⚡',
  useAddDialog: true,
  addDialogTitle: 'MUTATION_DOCK // NEW PROJECT',
  commitLabel: 'COMMIT & DEPLOY PROJECT ⚡',
  purgeLabel: 'PURGE_PROJECT',
  cloneActionLabel: 'CLONE_REPO',
  recordIdPrefix: 'PRJ',
  searchPlaceholder: "grep -i 'compute/webgpu'",
  exportLabel: 'EXPORT_METRICS',
  secondaryExportLabel: 'EXPORT JSON',
  showKernelFeed: true,
  showMediaStub: false,
  pipelineLabels: [
    'PUBLIC_PORTFOLIO_INGRESS',
    'AI_COPILOT_RAG_INDEX',
    'GSAP_SCROLL_TRIGGER_HOOKS',
  ],
  formatRecordSubtitle: (row) => String(row.slug ?? ''),
  recordBadge: (row) => {
    if (row.status === 'draft') return 'HIDDEN // DRAFT'
    if (row.featured) return 'HOME_FEATURED // VISIBLE'
    return 'ARCHIVE_ONLY // NOT_ON_HOME'
  },
  homeFeaturedToggle: {
    fieldKey: 'featured',
    showLabel: 'SHOW ON HOME ⚡',
    hideLabel: 'HIDE FROM HOME',
  },
  recordMetrics: (_row, index) => {
    const sets = [
      ['LATENCY_P99: 6.2ms', 'OPS_SEC: 18.4k', 'STARS: 1.2k'],
      ['LATENCY_P99: 11ms', 'OPS_SEC: 9.1k', 'STARS: 842'],
      ['LATENCY_P99: 4.8ms', 'OPS_SEC: 24k', 'STARS: 2.1k'],
    ]
    return sets[index % sets.length] ?? sets[0]!
  },
  recordTags: (row) => {
    const tech = row.technologies
    if (Array.isArray(tech)) return tech.slice(0, 6).map(String)
    return []
  },
}

export const blogCrudUi: CyberCrudUi = {
  registryTitle: 'TECHNICAL_DISPATCH_FEED',
  addRecordLabel: '+ DRAFT NEW DISPATCH ⚡',
  commitLabel: 'PUBLISH TO EDGE // DEPLOY ⚡',
  purgeLabel: 'PURGE',
  editActionLabel: 'EDIT / WRITE',
  purgeActionLabel: 'PURGE_DISPATCH',
  extraActionLabel: 'REVALIDATE_ISR',
  recordIdPrefix: 'ART',
  searchPlaceholder: "grep -i 'webgpu/shader'",
  exportLabel: 'COPY_MARKDOWN',
  dockEditLabel: 'EDIT DISPATCH',
  pipelineLabels: [
    'LIVE_PORTFOLIO_INGRESS',
    'AI_COPILOT_KNOWLEDGE_INGEST',
    'DISPATCH_TELEMETRY_PINGS',
  ],
  formatRecordSubtitle: (row) => String(row.slug ?? ''),
  recordBadge: (row, index) => {
    if (!row.publishedAt && index % 3 === 2) return 'DRAFT_PENDING'
    return index === 0 ? 'ACTIVE_EDIT' : 'PUBLISHED_EDGE'
  },
  recordMetrics: (row, index) => {
    const words = String(row.content ?? row.excerpt ?? '').split(/\s+/).filter(Boolean).length
    return [
      `READ_TIME: ${Math.max(3, Math.round(words / 200))}m`,
      `WORD_COUNT: ${words || 420 + index * 120}`,
      `SYNC: EDGE_OK`,
    ]
  },
  headerStats: (rows) => {
    const total = rows.length
    const published = rows.filter((r) => r.publishedAt).length
    const drafts = total - published
    return `${total} TOTAL · ${published} PUBLISHED · ${drafts} DRAFTS`
  },
}

export function prefixedRecordId(prefix: string, _id: string, index: number) {
  const n = String(index + 1).padStart(3, '0')
  return `#${prefix}-${n}`
}
