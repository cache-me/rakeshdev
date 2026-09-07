import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Hono } from 'hono'

import { requireAdminSession } from '../lib/session.js'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const extByMime: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

function projectUploadDir() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../../web/public/uploads/projects')
}

export function registerAdminUploadRoutes(app: Hono) {
  app.post('/api/admin/upload/project-image', async (c) => {
    const auth = await requireAdminSession(c.req.raw)
    if (!auth.ok) {
      return c.json(auth.response.body, auth.response.status)
    }

    let body: Record<string, unknown>
    try {
      body = await c.req.parseBody({ all: false })
    } catch {
      return c.json({ message: 'Invalid multipart body' }, 400)
    }

    const file = body.file
    if (!(file instanceof File)) {
      return c.json({ message: 'Missing file field' }, 400)
    }

    if (!ALLOWED.has(file.type)) {
      return c.json({ message: 'Unsupported image type' }, 400)
    }
    if (file.size > MAX_BYTES) {
      return c.json({ message: 'File too large (max 5MB)' }, 400)
    }

    const ext =
      extByMime[file.type] ?? (path.extname(file.name) || '.jpg')
    const safeName = `${randomUUID()}${ext}`
    const dir = projectUploadDir()
    await mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, safeName), buffer)

    const url = `/uploads/projects/${safeName}`
    return c.json({ success: true as const, data: { url } }, 201)
  })
}
