import { personalDocAccessQuerySchema, personalDocFileQuerySchema } from '@portfolio/validation'
import type { Hono } from 'hono'

import {
  listDocumentsForToken,
  readDocumentFileForToken,
} from '../services/personal-document.service.js'

export function registerPersonalDocumentPublicRoutes(app: Hono) {
  app.get('/api/personal-documents/access', async (c) => {
    const parsed = personalDocAccessQuerySchema.safeParse({
      token: c.req.query('token'),
    })
    if (!parsed.success) {
      return c.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid token parameter.' } },
        400,
      )
    }

    const result = await listDocumentsForToken(parsed.data.token)
    if (!result.ok) {
      return c.json(
        { success: false, error: { code: result.code, message: result.message } },
        401,
      )
    }

    return c.json({ success: true, data: result.data })
  })

  app.get('/api/personal-documents/file', async (c) => {
    const parsed = personalDocFileQuerySchema.safeParse({
      token: c.req.query('token'),
      documentId: c.req.query('documentId'),
    })
    if (!parsed.success) {
      return c.text('Bad request', 400)
    }

    const result = await readDocumentFileForToken(parsed.data.token, parsed.data.documentId)
    if (!result.ok) {
      return c.text(result.message, result.code === 'NOT_FOUND' ? 404 : 401)
    }

    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `inline; filename="${result.filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  })
}
