import { escapeHtml } from './escape-html.js'
import { emailTheme, metaRow, renderEmailLayout } from './layout.js'

export type ContactEmailData = {
  name: string
  email: string
  subject: string
  message: string
  receivedAt?: Date
}

function formatTimestamp(date: Date) {
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
}

function messageBlock(message: string) {
  const t = emailTheme
  const safe = escapeHtml(message)
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:8px;">
  <tr>
    <td style="padding:20px;background-color:#060a0f;border:1px solid ${t.panelBorder};border-radius:8px;border-left:3px solid ${t.accent};">
      <div style="font-family:${t.fontMono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};margin-bottom:12px;">Message payload</div>
      <div style="font-family:${t.fontSans};font-size:15px;line-height:1.65;color:${t.text};white-space:pre-wrap;">${safe}</div>
    </td>
  </tr>
</table>`
}

/** Notification to portfolio owner when someone submits the contact form. */
export function renderContactAdminEmail(data: ContactEmailData): { html: string; text: string } {
  const at = data.receivedAt ?? new Date()
  const bodyHtml = `
${metaRow('From', `${data.name}`, false)}
${metaRow('Reply-to', data.email, true)}
${metaRow('Subject line', data.subject)}
${messageBlock(data.message)}
<p style="margin:20px 0 0;font-family:${emailTheme.fontMono};font-size:11px;color:${emailTheme.muted};">
  Received ${escapeHtml(formatTimestamp(at))} · Reply directly to this thread via your mail client.
</p>`

  const html = renderEmailLayout({
    preheader: `New message from ${data.name}: ${data.subject}`,
    eyebrow: '[ CONTACT // INBOUND ]',
    title: 'New uplink established',
    bodyHtml,
    footerNote: `Contact form · ${formatTimestamp(at)}`,
  })

  const text = [
    'NEW CONTACT MESSAGE',
    '-------------------',
    `From: ${data.name} <${data.email}>`,
    `Subject: ${data.subject}`,
    '',
    data.message,
    '',
    `Received: ${formatTimestamp(at)}`,
  ].join('\n')

  return { html, text }
}

/** Confirmation sent to the visitor after they submit the form. */
export function renderContactAutoReplyEmail(data: ContactEmailData): { html: string; text: string } {
  const t = emailTheme
  const firstName = data.name.trim().split(/\s+/)[0] ?? data.name

  const bodyHtml = `
<p style="margin:0 0 16px;color:${t.text};font-size:16px;">
  Hi ${escapeHtml(firstName)},
</p>
<p style="margin:0 0 20px;">
  Thanks for reaching out — your message was transmitted successfully. I review every uplink personally and will get back to you at
  <a href="mailto:${escapeHtml(data.email)}" style="color:${t.accent};">${escapeHtml(data.email)}</a>
  as soon as possible.
</p>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
  <tr>
    <td style="padding:16px;background-color:${t.accentMuted};border-radius:8px;border:1px solid ${t.panelBorder};">
      <div style="font-family:${t.fontMono};font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${t.muted};margin-bottom:8px;">Your subject</div>
      <div style="font-family:${t.fontSans};font-size:15px;font-weight:600;color:${t.text};">${escapeHtml(data.subject)}</div>
    </td>
  </tr>
</table>
<p style="margin:0;font-size:14px;">
  Typical response window: <strong style="color:${t.text};">24–48 hours</strong>. For urgent work, mention your timeline in the thread.
</p>`

  const html = renderEmailLayout({
    preheader: 'We received your message — talk soon.',
    eyebrow: '[ CONTACT // ACK ]',
    title: 'Message received',
    bodyHtml,
    footerNote: 'You are receiving this because you used the portfolio contact form.',
  })

  const text = [
    `Hi ${firstName},`,
    '',
    'Thanks for reaching out — your message was received successfully.',
    `I will reply to ${data.email} as soon as possible.`,
    '',
    `Subject: ${data.subject}`,
    '',
    'Typical response: 24–48 hours.',
  ].join('\n')

  return { html, text }
}
