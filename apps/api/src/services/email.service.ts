import { Resend } from 'resend'

import {
  renderContactAdminEmail,
  renderContactAutoReplyEmail,
} from '../emails/contact-templates.js'
import { env } from '../lib/env.js'

export async function sendContactEmail(input: {
  name: string
  email: string
  subject: string
  message: string
}) {
  if (!env.RESEND_API_KEY) {
    return { ok: true as const, skipped: true as const }
  }

  const to = env.CONTACT_TO_EMAIL
  const from = env.CONTACT_FROM_EMAIL
  if (!to || !from) {
    throw new Error('CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must be set when using Resend')
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const payload = { ...input, receivedAt: new Date() }
  const admin = renderContactAdminEmail(payload)

  const { error: adminError } = await resend.emails.send({
    from,
    to: [to],
    replyTo: input.email,
    subject: `[Portfolio] ${input.subject}`,
    html: admin.html,
    text: admin.text,
  })

  if (adminError) {
    throw new Error(adminError.message ?? 'Email delivery failed')
  }

  if (env.CONTACT_AUTO_REPLY !== false) {
    const reply = renderContactAutoReplyEmail(payload)
    const { error: replyError } = await resend.emails.send({
      from,
      to: [input.email],
      replyTo: to,
      subject: `Re: ${input.subject} — message received`,
      html: reply.html,
      text: reply.text,
    })

    if (replyError) {
      console.warn('[contact] Auto-reply failed:', replyError.message)
    }
  }

  return { ok: true as const, skipped: false as const }
}
