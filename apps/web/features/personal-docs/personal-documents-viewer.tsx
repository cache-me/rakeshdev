'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download, ExternalLink, Lock } from 'lucide-react'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'
import { apiClient } from '@/lib/api'

type Props = {
  initialToken?: string
}

export default function PersonalDocumentsViewer({ initialToken = '' }: Props) {
  const [tokenInput, setTokenInput] = useState(initialToken)
  const [activeToken, setActiveToken] = useState(initialToken)

  const access = useQuery({
    queryKey: ['personal-documents', activeToken],
    enabled: activeToken.length >= 16,
    queryFn: async () => {
      const res = await apiClient.personalDocuments.access({ query: { token: activeToken } })
      if (res.status !== 200 || !res.body.success) {
        const msg =
          res.status === 401 && res.body && 'error' in res.body && res.body.error
            ? res.body.error.message
            : 'Invalid or expired token'
        throw new Error(msg)
      }
      return res.body.data
    },
    retry: false,
  })

  const fileUrl = (documentId: string) =>
    `/api/personal-documents/file?token=${encodeURIComponent(activeToken)}&documentId=${encodeURIComponent(documentId)}`

  const errorMessage = access.error instanceof Error ? access.error.message : null

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 md:px-8">
      <p className="hud-label text-white/70">[ SECURE VIEW ]</p>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
        <Lock className="size-6 text-[var(--cyber-accent)]" />
        Personal documents
      </h1>
      <p className="mt-3 text-sm text-[var(--cyber-muted)]">
        Enter the access token shared by the portfolio owner. Tokens expire after 30–60 minutes.
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          setActiveToken(tokenInput.trim())
        }}
      >
        <input
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste access token…"
          className="flex-1 rounded border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm text-white"
          autoComplete="off"
        />
        <button type="submit" className="cyber-primary-btn px-4 py-2 text-sm">
          Unlock
        </button>
      </form>

      {access.isFetching ? (
        <p className="mt-8 text-sm text-[var(--cyber-muted)]">Verifying token…</p>
      ) : null}

      {errorMessage ? (
        <p className="mt-8 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {access.data ? (
        <ul className="mt-10 space-y-6">
          {access.data.map((doc) => (
            <li key={doc.id} className="hud-panel overflow-hidden">
              <div className="border-b border-[var(--cyber-border)] px-5 py-4">
                <p className="font-mono text-[10px] uppercase text-[var(--cyber-accent)]">
                  {doc.docType}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">{doc.title}</h2>
                {doc.description ? (
                  <p className="mt-2 text-sm text-[var(--cyber-muted)]">{doc.description}</p>
                ) : null}
              </div>
              <div className="bg-white/5 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileUrl(doc.id)}
                  alt={doc.title}
                  className="mx-auto max-h-[480px] w-full max-w-lg rounded object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-3 border-t border-[var(--cyber-border)] px-5 py-4">
                <CyberPrimaryLink href={fileUrl(doc.id)} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                  View full size
                </CyberPrimaryLink>
                <CyberOutlineLink href={fileUrl(doc.id)} download>
                  <Download className="size-4" />
                  Download
                </CyberOutlineLink>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <CyberOutlineLink href="/" className="mt-10">
        Back to site
      </CyberOutlineLink>
    </div>
  )
}
