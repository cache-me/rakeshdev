'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCallback, useRef, useState } from 'react'

import { extractPersonalDocumentToken } from '@portfolio/validation'

import { apiClient } from '@/lib/api'

import type { AiChatEducationCertificate, AiChatPersonalDocument } from '@portfolio/types'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  href?: string
  label?: string
  personalDocuments?: AiChatPersonalDocument[]
  educationCertificates?: AiChatEducationCertificate[]
}

function isPersonalDocUserRequest(text: string): boolean {
  if (extractPersonalDocumentToken(text)) return false
  const q = text.toLowerCase()
  return (
    /personal doc|private doc|aadhaar|aadhar|adhar|\bpan\b|passbook|bank account|bank detail|identity doc/i.test(
      q,
    ) || (/rakesh/i.test(q) && /doc|document|bank|aadhaar|pan/i.test(q))
  )
}

export function useAiChat() {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const personalDocTokenRef = useRef<string | null>(null)
  const personalDocContextRef = useRef<string | null>(null)

  const chat = useMutation({
    mutationFn: async (text: string) => {
      const fromMessage = extractPersonalDocumentToken(text)
      if (fromMessage) {
        personalDocTokenRef.current = fromMessage
      }

      const res = await apiClient.ai.chat({
        body: {
          message: text,
          personalDocumentToken: personalDocTokenRef.current ?? undefined,
          personalDocumentContext: personalDocContextRef.current ?? undefined,
        },
      })
      if (res.status !== 200 || !res.body.success) {
        throw new Error('Chat failed')
      }
      return res.body.data
    },
    onSuccess: (data) => {
      const hideNav =
        data.intent === 'VIEW_PERSONAL_DOCUMENTS' ||
        (data.personalDocuments?.length ?? 0) > 0 ||
        (data.educationCertificates?.length ?? 0) > 0

      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          href: hideNav ? undefined : data.navigation?.href,
          label: hideNav ? undefined : data.navigation?.label,
          personalDocuments: data.personalDocuments,
          educationCertificates: data.educationCertificates,
        },
      ])
    },
    onError: () => toast.error('Assistant is unavailable right now.'),
  })

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || chat.isPending) return
      if (isPersonalDocUserRequest(trimmed)) {
        personalDocContextRef.current = trimmed
      }
      setHistory((prev) => [...prev, { role: 'user', content: trimmed }])
      chat.mutate(trimmed)
    },
    [chat],
  )

  const reset = useCallback(() => {
    setHistory([])
    personalDocTokenRef.current = null
    personalDocContextRef.current = null
  }, [])

  const dumpLog = useCallback(() => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'copilot-session.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [history])

  return { history, send, reset, dumpLog, isPending: chat.isPending }
}
