import { escapeHtml } from './escape-html.js'

/** Cyber-portfolio palette (inline-safe for email clients). */
export const emailTheme = {
  bg: '#080b10',
  panel: '#0c121c',
  panelBorder: 'rgba(45, 212, 168, 0.28)',
  accent: '#2dd4a8',
  accentMuted: 'rgba(45, 212, 168, 0.15)',
  text: '#e8edf4',
  muted: '#8b9cb3',
  purple: '#a78bfa',
  fontSans:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono: "ui-monospace, 'Cascadia Code', 'SF Mono', Consolas, monospace",
} as const

type LayoutOptions = {
  preheader?: string
  eyebrow: string
  title: string
  bodyHtml: string
  footerNote?: string
}

export function renderEmailLayout(options: LayoutOptions): string {
  const t = emailTheme
  const preheader = options.preheader ?? options.title
  const footer = options.footerNote ?? 'Portfolio contact system'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(options.title)}</title>
  <!--[if mso]><style type="text/css">body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${t.bg};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${t.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:${t.panel};border:1px solid ${t.panelBorder};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${t.accent} 0%, ${t.purple} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:${t.fontMono};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${t.accent};">
              ${escapeHtml(options.eyebrow)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;font-family:${t.fontSans};font-size:26px;font-weight:700;line-height:1.25;color:${t.text};">
              ${escapeHtml(options.title)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;font-family:${t.fontSans};font-size:15px;line-height:1.6;color:${t.muted};">
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${t.panelBorder};font-family:${t.fontMono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${t.muted};">
              ${escapeHtml(footer)}
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-family:${t.fontMono};font-size:10px;color:${t.muted};opacity:0.7;">
          ARCHITECT.IO · SECURE UPLINK
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function metaRow(label: string, value: string, valueIsEmail = false) {
  const t = emailTheme
  const valueHtml = valueIsEmail
    ? `<a href="mailto:${escapeHtml(value)}" style="color:${t.accent};text-decoration:none;">${escapeHtml(value)}</a>`
    : escapeHtml(value)

  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
  <tr>
    <td style="padding:12px 16px;background-color:${t.accentMuted};border:1px solid ${t.panelBorder};border-radius:8px;">
      <div style="font-family:${t.fontMono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};margin-bottom:4px;">${escapeHtml(label)}</div>
      <div style="font-family:${t.fontSans};font-size:15px;font-weight:600;color:${t.text};">${valueHtml}</div>
    </td>
  </tr>
</table>`
}
