'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { adminClient } from '@/lib/api'

import { AdminSubpage } from '@/features/admin/admin-subpage'

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const qc = useQueryClient()
  const list = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: async () => {
      const res = await adminClient.listContactMessages()
      if (res.status !== 200 || !res.body.success) throw new Error('Failed')
      return res.body.data as Message[]
    },
  })

  const markRead = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      adminClient.markContactRead({ params: { id }, body: { read } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin', 'messages'] }),
    onError: () => toast.error('Could not update message'),
  })

  return (
    <AdminSubpage title="Telemetry inbox">
      <div className="flex flex-col gap-3">
        {(list.data ?? []).map((msg) => (
          <article
            key={msg.id}
            className={`rounded border p-4 ${msg.read ? 'border-[var(--cyber-border)]' : 'border-[var(--cyber-accent)]/40 bg-[var(--cyber-accent-dim)]'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{msg.subject}</p>
                <p className="text-sm text-[var(--cyber-muted)]">
                  {msg.name} · {msg.email}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markRead.mutate({ id: msg.id, read: !msg.read })}
              >
                {msg.read ? 'Mark unread' : 'Mark read'}
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{msg.message}</p>
          </article>
        ))}
      </div>
    </AdminSubpage>
  )
}
