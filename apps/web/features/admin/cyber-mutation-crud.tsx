'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Input, Label, Textarea } from '@/components/ui/input'
import { CyberOutlineButton, CyberPrimaryButton } from '@/features/cyber/cyber-buttons'
import { cn } from '@/lib/utils'

import AdminCrossPortfolioStrip from './admin-cross-portfolio-strip'
import AdminMutationDialog from './admin-mutation-dialog'
import { AdminProjectCoverUpload } from './admin-project-cover-upload'
import { assertAdminWrite } from './admin-api-helpers'
import { adminCrudTabs } from './admin-crud-tabs'
import type { CyberCrudUi } from './cyber-crud-ui'
import { prefixedRecordId } from './cyber-crud-ui'

export type CyberField = {
  key: string
  label: string
  dockLabel?: string
  type?: 'text' | 'number' | 'textarea' | 'coverImage' | 'select'
  span?: 1 | 2
  options?: { value: string; label: string }[]
}

type Row = Record<string, unknown> & { id: string }

export type CyberMutationCrudProps = {
  moduleTag: string
  secCode: string
  listKey: string
  titleKey: string
  subtitleKey: string
  cloneSuffixKey?: string
  fields: CyberField[]
  list: () => Promise<{ status: number; body: unknown }>
  create: (body: Record<string, unknown>) => Promise<{ status: number; body?: unknown }>
  update: (id: string, body: Record<string, unknown>) => Promise<{ status: number; body?: unknown }>
  remove: (id: string) => Promise<{ status: number; body?: unknown }>
  toBody?: (form: Record<string, string>) => Record<string, unknown>
  fromRow?: (row: Row) => Record<string, string>
  ui?: CyberCrudUi
}

const STATUS_BADGES = ['VERIFIED_IMMUTABLE', 'SYNCED_TO_PUBLIC', 'DRAFT_UNPUBLISHED'] as const

function recordBadge(row: Row, index: number): string {
  if (!row.description && !row.summary && !row.body) {
    return 'DRAFT_UNPUBLISHED'
  }
  return STATUS_BADGES[index % STATUS_BADGES.length] ?? 'SYNCED_TO_PUBLIC'
}

function shortId(id: string) {
  return `#${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export function CyberMutationCrud({
  moduleTag,
  secCode,
  listKey,
  titleKey,
  subtitleKey,
  cloneSuffixKey,
  fields,
  list,
  create,
  update,
  remove,
  toBody,
  fromRow,
  ui = {},
}: CyberMutationCrudProps) {
  const pathname = usePathname()
  const qc = useQueryClient()
  const emptyForm = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.key, ''])),
    [fields],
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>(emptyForm)
  const [sortDesc, setSortDesc] = useState(true)
  const [search, setSearch] = useState('')
  const [feedLines, setFeedLines] = useState<string[]>([
    '[KERNEL] mutation dock armed',
    '[INDEX] portfolio registry online',
  ])
  const [pipelines, setPipelines] = useState({
    public: true,
    rag: true,
    verified: false,
  })
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const useAddDialog = ui.useAddDialog === true

  const rows = useQuery({
    queryKey: ['admin', listKey],
    queryFn: async () => {
      const res = await list()
      const body = res.body as { success?: boolean; data?: Row[] }
      if (res.status !== 200 || !body.success) throw new Error('Failed')
      return body.data as Row[]
    },
  })

  const sortedRows = useMemo(() => {
    const data = [...(rows.data ?? [])]
    data.sort((a, b) => {
      const av = Number(a.sortOrder ?? 0)
      const bv = Number(b.sortOrder ?? 0)
      return sortDesc ? bv - av : av - bv
    })
    return data
  }, [rows.data, sortDesc])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedRows
    return sortedRows.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)),
    )
  }, [sortedRows, search])

  const pipelineLabels = ui.pipelineLabels ?? [
    'PUBLIC_PORTFOLIO_INGRESS',
    'AI_COPILOT_RAG_INDEX',
    'CRYPTO_VERIFIED_BADGE',
  ]

  useEffect(() => {
    if (!ui.showKernelFeed) return
    const id = window.setInterval(() => {
      const t = new Date().toISOString().slice(11, 19)
      setFeedLines((prev) => [...prev.slice(-4), `[${t}] [INDEX_SYNC] shard ok`])
    }, 5000)
    return () => window.clearInterval(id)
  }, [ui.showKernelFeed])

  const appendFeed = (line: string) => {
    if (!ui.showKernelFeed) return
    const t = new Date().toISOString().slice(11, 19)
    setFeedLines((prev) => [...prev.slice(-4), `[${t}] ${line}`])
  }

  const resetForm = useCallback(() => {
    setEditId(null)
    setForm(emptyForm)
    setFormDialogOpen(false)
  }, [emptyForm])

  const openForAdd = useCallback(() => {
    setEditId(null)
    setForm(emptyForm)
    setFormDialogOpen(true)
  }, [emptyForm])

  const openForEdit = useCallback(
    (row: Row) => {
      setEditId(row.id)
      setForm(
        fromRow
          ? fromRow(row)
          : Object.fromEntries(fields.map((f) => [f.key, String(row[f.key] ?? '')])),
      )
      if (useAddDialog) setFormDialogOpen(true)
    },
    [fields, fromRow, useAddDialog],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (formDialogOpen) setFormDialogOpen(false)
        else resetForm()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [formDialogOpen, resetForm])

  const save = useMutation({
    mutationFn: async () => {
      const body = toBody
        ? toBody(form)
        : (() => {
            const out: Record<string, unknown> = {}
            for (const field of fields) {
              const raw = form[field.key] ?? ''
              if (field.type === 'number') out[field.key] = raw === '' ? 0 : Number(raw)
              else out[field.key] = raw
            }
            return out
          })()
      if (editId) {
        return assertAdminWrite(update(editId, body), [200])
      }
      return assertAdminWrite(create(body), [201, 200])
    },
    onSuccess: () => {
      toast.success('Committed to portfolio edge')
      appendFeed('[MUTATION_COMMITTED] record synced')
      resetForm()
      void qc.invalidateQueries({ queryKey: ['admin', listKey] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Commit failed')
    },
  })

  const del = useMutation({
    mutationFn: (id: string) => assertAdminWrite(remove(id), [200]),
    onSuccess: () => {
      toast.success('Record purged')
      resetForm()
      void qc.invalidateQueries({ queryKey: ['admin', listKey] })
    },
  })

  const toggleHomeFeatured = useMutation({
    mutationFn: async (row: Row) => {
      const toggle = ui.homeFeaturedToggle
      if (!toggle) throw new Error('Toggle not configured')
      const key = toggle.fieldKey
      const current = Boolean(row[key])
      const next = !current
      if (next && row.status === 'draft') {
        throw new Error('Publish the project first (status: published)')
      }
      const body = fromRow
        ? (() => {
            const form = fromRow(row)
            form[key] = next ? 'yes' : 'no'
            return toBody ? toBody(form) : { ...row, [key]: next }
          })()
        : { ...row, [key]: next }
      return assertAdminWrite(update(row.id, body as Record<string, unknown>), [200])
    },
    onSuccess: (_data, row) => {
      const toggle = ui.homeFeaturedToggle
      const key = toggle?.fieldKey ?? 'featured'
      const nowFeatured = !Boolean(row[key])
      toast.success(nowFeatured ? 'Visible on home page' : 'Hidden from home page')
      void qc.invalidateQueries({ queryKey: ['admin', listKey] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Toggle failed')
    },
  })

  const clone = useMutation({
    mutationFn: async (row: Row) => {
      const baseForm = fromRow ? fromRow(row) : Object.fromEntries(
        fields.map((f) => [f.key, String(row[f.key] ?? '')]),
      )
      const body = toBody
        ? toBody(baseForm)
        : Object.fromEntries(
            fields.map((f) => [
              f.key,
              f.type === 'number' ? Number(baseForm[f.key] ?? 0) : baseForm[f.key],
            ]),
          )
      if (cloneSuffixKey && body[cloneSuffixKey]) {
        body[cloneSuffixKey] = `${String(body[cloneSuffixKey])} (copy)`
      }
      return create(body)
    },
    onSuccess: () => {
      toast.success('Record cloned')
      void qc.invalidateQueries({ queryKey: ['admin', listKey] })
    },
  })

  function exportJson() {
    const blob = new Blob([JSON.stringify(rows.data ?? [], null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${listKey}-export.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const nodeCount = sortedRows.length
  const statsLine = ui.headerStats?.(sortedRows)

  function onMutationSubmit(e: React.FormEvent) {
    e.preventDefault()
    save.mutate()
  }

  const dialogTitle = editId
    ? `MUTATION_DOCK // ${ui.dockEditLabel ?? 'EDIT RECORD'} [ARMED]`
    : (ui.addDialogTitle ?? 'MUTATION_DOCK // NEW RECORD')

  const dialogSubtitle =
    editId && ui.recordIdPrefix
      ? prefixedRecordId(
          ui.recordIdPrefix,
          editId,
          Math.max(0, sortedRows.findIndex((r) => r.id === editId)),
        )
      : undefined

  const mutationFields = (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.key}
          className={cn(
            'grid gap-1.5',
            field.span === 2 || field.type === 'textarea' || field.type === 'coverImage'
              ? 'sm:col-span-2'
              : '',
          )}
        >
          {field.type === 'coverImage' ? null : (
            <Label className="font-mono text-[9px] uppercase tracking-wider text-[var(--cyber-muted)]">
              {field.dockLabel ?? field.label}
            </Label>
          )}
          {field.type === 'textarea' ? (
            <Textarea
              rows={4}
              value={form[field.key] ?? ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="border-[var(--cyber-border)] bg-[#060a0f] font-mono text-xs"
            />
          ) : field.type === 'coverImage' ? (
            <AdminProjectCoverUpload
              value={form[field.key] ?? ''}
              onChange={(url) => setForm({ ...form, [field.key]: url })}
            />
          ) : field.type === 'select' ? (
            <select
              value={form[field.key] ?? ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="h-9 w-full rounded border border-[var(--cyber-border)] bg-[#060a0f] px-2 font-mono text-xs text-[var(--cyber-text)]"
            >
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              type={field.type === 'number' ? 'number' : 'text'}
              value={form[field.key] ?? ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="border-[var(--cyber-border)] bg-[#060a0f] font-mono text-xs"
            />
          )}
        </div>
      ))}
    </div>
  )

  const mutationPipelines = (
    <>
      <p className="mt-4 hud-label">DISPATCH CONTROL & PIPELINES</p>
      <ul className="mt-2 space-y-2 font-mono text-[10px]">
        {(
          [
            ['public', pipelineLabels[0]],
            ['rag', pipelineLabels[1]],
            ['verified', pipelineLabels[2]],
          ] as const
        ).map(([key, label]) => (
          <li key={key} className="flex items-center justify-between gap-2">
            <span className="text-[var(--cyber-muted)]">{label}</span>
            <button
              type="button"
              className={cn(
                'rounded border px-2 py-0.5 text-[9px]',
                pipelines[key]
                  ? 'border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                  : 'border-[var(--cyber-border)] text-[var(--cyber-muted)]',
              )}
              onClick={() => setPipelines((p) => ({ ...p, [key]: !p[key] }))}
            >
              [{pipelines[key] ? 'ON' : 'OFF'}]
            </button>
          </li>
        ))}
      </ul>
    </>
  )

  const mutationActions = (
    <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--cyber-border)] pt-4">
      <CyberOutlineButton type="button" className="text-[9px]" onClick={resetForm}>
        RESET
      </CyberOutlineButton>
      {editId ? (
        <CyberOutlineButton
          type="button"
          className="text-[9px]"
          onClick={() => del.mutate(editId)}
        >
          {ui.purgeLabel ?? 'PURGE'}
        </CyberOutlineButton>
      ) : null}
      <CyberPrimaryButton type="submit" disabled={save.isPending} className="flex-1 text-[10px]">
        {ui.commitLabel ?? 'COMMIT & DEPLOY ⚡'}
      </CyberPrimaryButton>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cyber-border)] pb-3">
        <div>
          <p className="hud-label">CRUD_MODULE // {secCode}</p>
          {ui.registryTitle ? (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--cyber-text)]">
              {ui.registryTitle}
            </p>
          ) : null}
          <p className="mt-1 font-mono text-[10px] text-[var(--cyber-muted)]">
            MUTATION_ENGINE: <span className="text-[var(--cyber-accent)]">[ARMED // ZERO_FAULT]</span>
            {statsLine ? (
              <>
                {' '}
                · <span className="text-[var(--cyber-accent)]">{statsLine}</span>
              </>
            ) : null}
          </p>
        </div>
        <CyberPrimaryButton
          type="button"
          className="text-[10px]"
          onClick={() => (useAddDialog ? openForAdd() : resetForm())}
        >
          {ui.addRecordLabel ?? '+ ADD RECORD ⚡'}
        </CyberPrimaryButton>
      </div>

      <div className="flex flex-wrap gap-2">
        {adminCrudTabs.map((tab) => {
          const active = pathname === tab.href
          const count = tab.href === pathname ? nodeCount : undefined
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'rounded border px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition',
                active
                  ? 'border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)] text-[var(--cyber-accent)]'
                  : 'border-[var(--cyber-border)] text-[var(--cyber-muted)] hover:text-[var(--cyber-accent)]',
              )}
            >
              [{tab.label}
              {count !== undefined ? ` · ${String(count).padStart(2, '0')} NODES` : ''}]
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase">
        <span className="cyber-tag text-[var(--cyber-muted)]">ESC TO CLEAR</span>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.searchPlaceholder ?? 'filter registry…'}
          className="h-8 max-w-xs border-[var(--cyber-border)] bg-[#060a0f] font-mono text-[10px]"
        />
        <button
          type="button"
          className="cyber-tag hover:border-[var(--cyber-accent)]"
          onClick={() => setSortDesc((v) => !v)}
        >
          [SORT: CHRONO // {sortDesc ? 'DESC' : 'ASC'}]
        </button>
        <CyberOutlineButton
          type="button"
          className="px-2 py-1 text-[9px]"
          onClick={() => {
            if (ui.exportLabel === 'COPY_MARKDOWN' && editId) {
              const row = sortedRows.find((r) => r.id === editId)
              if (row?.content) {
                void navigator.clipboard.writeText(String(row.content))
                toast.success('Markdown copied')
              }
              return
            }
            exportJson()
          }}
        >
          {ui.exportLabel ?? 'EXPORT JSON'}
        </CyberOutlineButton>
        {ui.secondaryExportLabel ? (
          <CyberOutlineButton type="button" className="px-2 py-1 text-[9px]" onClick={exportJson}>
            {ui.secondaryExportLabel}
          </CyberOutlineButton>
        ) : (
          <CyberOutlineButton
            type="button"
            className="px-2 py-1 text-[9px]"
            onClick={() => toast.message('Embeddings re-index queued (stub)')}
          >
            RE-INDEX EMBEDDINGS
          </CyberOutlineButton>
        )}
        {pathname === '/admin/blog' ? (
          <CyberOutlineButton
            type="button"
            className="px-2 py-1 text-[9px]"
            onClick={() => toast.message('Batch revalidate queued (stub)')}
          >
            BATCH_REVALIDATE_EDGE_CACHE
          </CyberOutlineButton>
        ) : null}
      </div>

      <div
        className={cn(
          'grid gap-4',
          !useAddDialog && 'xl:grid-cols-[1fr_minmax(300px,380px)]',
        )}
      >
        <div className="space-y-3">
          {filteredRows.map((row, index) => {
            const active = editId === row.id
            const title = ui.formatRecordTitle
              ? ui.formatRecordTitle(row)
              : String(row[titleKey] ?? 'Untitled')
            const subtitle = ui.formatRecordSubtitle
              ? ui.formatRecordSubtitle(row)
              : String(row[subtitleKey] ?? '')
            const badge = ui.recordBadge ? ui.recordBadge(row, index) : recordBadge(row, index)
            const metrics = ui.recordMetrics?.(row, index) ?? []
            const tags = ui.recordTags?.(row) ?? []
            const recordLabel = ui.recordIdPrefix
              ? prefixedRecordId(ui.recordIdPrefix, row.id, index)
              : shortId(row.id)
            return (
              <article
                key={row.id}
                className={cn(
                  'hud-panel p-4 transition',
                  active && 'border-[var(--cyber-accent)] shadow-[0_0_24px_rgba(45,212,168,0.12)]',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] text-[var(--cyber-muted)]">
                      {moduleTag} · {recordLabel}
                    </p>
                    <p className="font-mono text-sm font-semibold text-[var(--cyber-text)]">{title}</p>
                    <p className="mt-1 text-xs text-[var(--cyber-muted)]">{subtitle}</p>
                    {metrics.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {metrics.map((m) => (
                          <span key={m} className="cyber-tag text-[9px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {tags.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <span key={t} className="cyber-tag text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 font-mono text-[9px] text-[var(--cyber-accent)]">[{badge}]</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ui.homeFeaturedToggle ? (
                      <CyberOutlineButton
                        type="button"
                        className="px-2 py-1 text-[9px]"
                        disabled={toggleHomeFeatured.isPending}
                        onClick={() => toggleHomeFeatured.mutate(row)}
                      >
                        {row[ui.homeFeaturedToggle.fieldKey]
                          ? ui.homeFeaturedToggle.hideLabel
                          : ui.homeFeaturedToggle.showLabel}
                      </CyberOutlineButton>
                    ) : null}
                    {ui.extraActionLabel ? (
                      <CyberOutlineButton
                        type="button"
                        className="px-2 py-1 text-[9px]"
                        onClick={() => toast.message(`${ui.extraActionLabel} queued (stub)`)}
                      >
                        {ui.extraActionLabel}
                      </CyberOutlineButton>
                    ) : null}
                    <CyberOutlineButton
                      type="button"
                      className="px-2 py-1 text-[9px]"
                      onClick={() => openForEdit(row)}
                    >
                      {ui.editActionLabel ?? 'EDIT / TUNE'}
                    </CyberOutlineButton>
                    <CyberOutlineButton
                      type="button"
                      className="px-2 py-1 text-[9px]"
                      onClick={() => clone.mutate(row)}
                    >
                      {ui.cloneActionLabel ?? 'CLONE'}
                    </CyberOutlineButton>
                    <CyberOutlineButton
                      type="button"
                      className="px-2 py-1 text-[9px]"
                      onClick={() => del.mutate(row.id)}
                    >
                      {ui.purgeActionLabel ?? 'PURGE_RECORD'}
                    </CyberOutlineButton>
                  </div>
                </div>
              </article>
            )
          })}
          {filteredRows.length === 0 ? (
            <p className="font-mono text-[11px] text-[var(--cyber-muted)]">
              No records — dispatch + ADD RECORD.
            </p>
          ) : null}
        </div>

        {!useAddDialog ? (
        <form
          className="hud-panel sticky top-4 flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto p-4"
          onSubmit={onMutationSubmit}
        >
          <p className="hud-label">
            MUTATION_DOCK // {editId ? ui.dockEditLabel ?? 'EDIT RECORD' : 'NEW RECORD'}
            {editId ? ' [ARMED]' : ''}
          </p>
          {editId ? (
            <p className="mt-1 font-mono text-[10px] text-[var(--cyber-muted)]">
              {ui.recordIdPrefix
                ? prefixedRecordId(
                    ui.recordIdPrefix,
                    editId,
                    Math.max(0, sortedRows.findIndex((r) => r.id === editId)),
                  )
                : shortId(editId)}
            </p>
          ) : null}

          {mutationFields}

          {ui.showMediaStub ? (
            <div className="mt-4 rounded border border-[var(--cyber-border)] bg-[#060a0f] p-3">
              <p className="hud-label">MEDIA & 3D CANVAS ASSET</p>
              <div className="mt-2 flex h-24 items-center justify-center border border-dashed border-[var(--cyber-border)] font-mono text-[9px] text-[var(--cyber-muted)]">
                VIEWPORT PREVIEW (stub)
              </div>
              <div className="mt-2 flex gap-2">
                <CyberOutlineButton type="button" className="text-[9px]">
                  UPLOAD_GLTF/USDZ
                </CyberOutlineButton>
                <CyberOutlineButton type="button" className="text-[9px]">
                  PREVIEW_VIEWPORT
                </CyberOutlineButton>
              </div>
            </div>
          ) : null}

          {mutationPipelines}
          {mutationActions}

          {ui.showKernelFeed ? (
            <div className="mt-4 border-t border-[var(--cyber-border)] pt-3">
              <p className="hud-label">KERNEL_TRANSACTION_FEED</p>
              <div className="mt-2 space-y-1">
                {feedLines.map((line, i) => (
                  <p key={`${line}-${i}`} className="terminal-line">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </form>
        ) : null}
      </div>

      <AdminMutationDialog
        open={useAddDialog && formDialogOpen}
        title={dialogTitle}
        subtitle={dialogSubtitle}
        onClose={() => setFormDialogOpen(false)}
      >
        <form onSubmit={onMutationSubmit}>
          {mutationFields}
          {mutationPipelines}
          {mutationActions}
        </form>
      </AdminMutationDialog>

      <AdminCrossPortfolioStrip />
    </div>
  )
}
