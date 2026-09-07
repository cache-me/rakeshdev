'use client'

import { adminClient } from '@/lib/api'

import { CyberMutationCrud } from './cyber-mutation-crud'
import type { CyberCrudUi } from './cyber-crud-ui'

type Field = {
  key: string
  label: string
  dockLabel?: string
  type?: 'text' | 'number' | 'textarea' | 'coverImage' | 'select'
  span?: 1 | 2
  options?: { value: string; label: string }[]
}

type Config = {
  moduleTag: string
  secCode: string
  title?: string
  listKey: string
  titleKey: string
  subtitleKey: string
  cloneSuffixKey?: string
  fields: Field[]
  list: () => Promise<{ status: number; body: unknown }>
  create: (body: Record<string, unknown>) => Promise<{ status: number }>
  update: (id: string, body: Record<string, unknown>) => Promise<{ status: number }>
  remove: (id: string) => Promise<{ status: number; body?: unknown }>
  ui?: CyberCrudUi
  toBody?: (form: Record<string, string>) => Record<string, unknown>
  fromRow?: (row: Record<string, unknown> & { id: string }) => Record<string, string>
}

export function SimpleAdminCrud({
  moduleTag,
  secCode,
  title,
  listKey,
  titleKey,
  subtitleKey,
  cloneSuffixKey,
  fields,
  list,
  create,
  update,
  remove,
  ui,
  toBody,
  fromRow,
}: Config) {
  return (
    <div>
      {title ? (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
          {title}
        </p>
      ) : null}
      <CyberMutationCrud
        moduleTag={moduleTag}
        secCode={secCode}
        listKey={listKey}
        titleKey={titleKey}
        subtitleKey={subtitleKey}
        cloneSuffixKey={cloneSuffixKey}
        fields={fields}
        list={list}
        create={create}
        update={update}
        remove={remove}
        ui={ui}
        toBody={toBody}
        fromRow={fromRow}
      />
    </div>
  )
}
