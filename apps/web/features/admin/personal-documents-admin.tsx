'use client'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Link2, Shield } from 'lucide-react'
import { toast } from 'sonner'

import { adminClient } from '@/lib/api'

export default function PersonalDocumentsAdmin() {
  const qc = useQueryClient()
  const [minutes, setMinutes] = useState<30 | 60>(60)
  const [lastToken, setLastToken] = useState<string | null>(null)
  const [lastShareUrl, setLastShareUrl] = useState<string | null>(null)

  const docs = useQuery({
    queryKey: ['admin', 'personal-documents'],
    queryFn: async () => {
      const res = await adminClient.listPersonalDocuments()
      if (res.status !== 200 || !res.body.success) throw new Error('Failed to load')
      return res.body.data
    },
  })

  const tokens = useQuery({
    queryKey: ['admin', 'personal-document-tokens'],
    queryFn: async () => {
      const res = await adminClient.listPersonalDocumentTokens()
      if (res.status !== 200 || !res.body.success) throw new Error('Failed to load')
      return res.body.data
    },
  })

  const createToken = useMutation({
    mutationFn: async () => {
      const res = await adminClient.createPersonalDocumentToken({
        body: { expiresInMinutes: minutes },
      })
      if (res.status !== 201 || !res.body.success) throw new Error('Create failed')
      return res.body.data
    },
    onSuccess: (data) => {
      setLastToken(data.token)
      setLastShareUrl(data.shareUrl)
      void qc.invalidateQueries({ queryKey: ['admin', 'personal-document-tokens'] })
      toast.success('Access token created')
    },
    onError: () => toast.error('Could not create token'),
  })

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminClient.revokePersonalDocumentToken({ params: { id } })
      if (res.status !== 200) throw new Error('Revoke failed')
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'personal-document-tokens'] })
      toast.success('Token revoked')
    },
  })

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--cyber-accent)]">
          [ PRIVATE VAULT ]
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Personal documents</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--cyber-muted)]">
          Aadhaar, PAN, and bank passbook are stored privately on the server. Generate a time-limited
          token (30 or 60 minutes) and share the link — recipients can view documents only while the
          token is valid.
        </p>
      </div>

      <section className="hud-panel p-5">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase text-white/80">
          <Shield className="size-4 text-[var(--cyber-accent)]" />
          Registered documents
        </h2>
        <ul className="mt-4 space-y-2">
          {(docs.data ?? []).map((doc) => (
            <li
              key={doc.id}
              className="rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90"
            >
              <span className="font-mono text-[10px] uppercase text-[var(--cyber-accent)]">
                {doc.docType}
              </span>
              <span className="ml-2 font-medium">{doc.title}</span>
              {doc.description ? (
                <p className="mt-1 text-xs text-[var(--cyber-muted)]">{doc.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="hud-panel p-5">
        <h2 className="font-mono text-xs uppercase text-white/80">Generate access token</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase text-white/50">Valid for</span>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value) as 30 | 60)}
              className="mt-1 block rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </label>
          <button
            type="button"
            disabled={createToken.isPending}
            onClick={() => createToken.mutate()}
            className="cyber-primary-btn px-4 py-2 text-sm"
          >
            Generate token
          </button>
        </div>

        {lastToken ? (
          <div className="mt-6 space-y-3 rounded border border-[var(--cyber-accent)]/40 bg-[var(--cyber-accent)]/5 p-4">
            <p className="font-mono text-[10px] uppercase text-[var(--cyber-accent)]">
              Share with viewer (expires automatically)
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded border border-white/20 px-3 py-1.5 text-xs text-white"
                onClick={() => copy(lastToken, 'Token')}
              >
                <Copy className="size-3.5" />
                Copy token
              </button>
              {lastShareUrl ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded border border-white/20 px-3 py-1.5 text-xs text-white"
                  onClick={() => copy(lastShareUrl, 'Share link')}
                >
                  <Link2 className="size-3.5" />
                  Copy share link
                </button>
              ) : null}
            </div>
            <p className="break-all font-mono text-[10px] text-white/60">{lastShareUrl}</p>
          </div>
        ) : null}
      </section>

      <section className="hud-panel p-5">
        <h2 className="font-mono text-xs uppercase text-white/80">Token audit log</h2>
        <ul className="mt-4 space-y-2">
          {(tokens.data ?? []).map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/10 px-3 py-2 text-xs"
            >
              <div>
                <p className="text-white/90">
                  Expires {new Date(t.expiresAt).toLocaleString()}
                  {t.expired ? ' · expired/revoked' : ''}
                </p>
                <p className="text-[var(--cyber-muted)]">
                  Views: {t.accessCount}
                  {t.lastAccessedAt
                    ? ` · Last: ${new Date(t.lastAccessedAt).toLocaleString()}`
                    : ''}
                </p>
              </div>
              {!t.expired ? (
                <button
                  type="button"
                  className="text-[var(--cyber-accent)] hover:underline"
                  onClick={() => revoke.mutate(t.id)}
                >
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
