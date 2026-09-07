'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Input, Label, Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormValues = z.infer<typeof schema>

const fieldClass =
  'border-[var(--cyber-border)] bg-[#060a0f] font-mono text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-muted)]/60 focus-visible:border-[var(--cyber-accent)] focus-visible:ring-[var(--cyber-accent)]/30 rounded'

const labelClass =
  'font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--cyber-muted)]'

export default function ContactForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiClient.contact.submit({ body: values })
      if (res.status !== 201 || !res.body.success) {
        const body = res.body as { error?: { message?: string } }
        throw new Error(body?.error?.message ?? 'Transmission failed')
      }
      return res.body.data
    },
    onSuccess: () => {
      toast.success('Message transmitted — check your inbox for a reply soon.')
      form.reset()
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : 'Could not send message. Try again later.'),
  })

  const errors = form.formState.errors

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-1">
          <Label htmlFor="name" className={labelClass}>
            CALLSIGN / NAME
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
            aria-invalid={!!errors.name}
            {...form.register('name')}
          />
          {errors.name ? (
            <p className="font-mono text-[10px] text-red-400">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5 sm:col-span-1">
          <Label htmlFor="email" className={labelClass}>
            RETURN_ADDRESS / EMAIL
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            className={fieldClass}
            aria-invalid={!!errors.email}
            {...form.register('email')}
          />
          {errors.email ? (
            <p className="font-mono text-[10px] text-red-400">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="subject" className={labelClass}>
          SUBJECT_LINE
        </Label>
        <Input
          id="subject"
          placeholder="Project brief, collaboration, …"
          className={fieldClass}
          aria-invalid={!!errors.subject}
          {...form.register('subject')}
        />
        {errors.subject ? (
          <p className="font-mono text-[10px] text-red-400">{errors.subject.message}</p>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message" className={labelClass}>
          PAYLOAD / MESSAGE
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Timeline, scope, goals…"
          className={cn(fieldClass, 'min-h-[140px] resize-y')}
          aria-invalid={!!errors.message}
          {...form.register('message')}
        />
        {errors.message ? (
          <p className="font-mono text-[10px] text-red-400">{errors.message.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="cyber-btn-primary mt-2 w-full rounded px-5 py-3 font-mono text-[0.7rem] uppercase tracking-wider disabled:opacity-50"
      >
        {mutation.isPending ? 'TRANSMITTING…' : 'Transmit Message'}
      </button>

      <p className="font-mono text-[9px] leading-relaxed text-[var(--cyber-muted)]">
        Encrypted uplink · Stored securely · Notification via Resend when configured
      </p>
    </form>
  )
}
