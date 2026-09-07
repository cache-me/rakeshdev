import { resumePdfQuerySchema } from '@portfolio/validation'
import type { Hono } from 'hono'

import {
  buildResumeDocument,
  renderResumePdf,
  renderResumePreviewHtml,
} from '../services/resume.service.js'

export function registerResumeRoutes(app: Hono) {
  app.get('/api/resume/preview', async (c) => {
    const parsed = resumePdfQuerySchema.safeParse({
      template: c.req.query('template'),
    })
    if (!parsed.success) {
      return c.text('Invalid template', 400)
    }
    const doc = await buildResumeDocument()
    if (!doc) {
      return c.text('Resume data unavailable', 404)
    }
    const html = renderResumePreviewHtml(doc, parsed.data.template)
    return c.html(html)
  })

  app.get('/api/resume/pdf', async (c) => {
    const parsed = resumePdfQuerySchema.safeParse({
      template: c.req.query('template'),
    })
    if (!parsed.success) {
      return c.text('Invalid template', 400)
    }
    const doc = await buildResumeDocument()
    if (!doc) {
      return c.text('Resume data unavailable', 404)
    }
    try {
      const pdf = await renderResumePdf(doc, parsed.data.template)
      const filename = `${doc.name.replace(/\s+/g, '-').toLowerCase()}-resume.pdf`
      return new Response(new Uint8Array(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'private, max-age=60',
        },
      })
    } catch (err) {
      console.error('[resume/pdf]', err)
      return c.text(
        'PDF generation failed. Install Chromium for Playwright: pnpm exec playwright install chromium',
        503,
      )
    }
  })
}
