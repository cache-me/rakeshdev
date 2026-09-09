import { contract } from '@portfolio/contracts'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'


import { sql } from 'drizzle-orm'

import { auth } from './lib/auth.js'
import { db, runWithDb } from './lib/db.js'
import { env } from './lib/env.js'
import { createHonoEndpoints } from './lib/ts-rest-hono.js'
import { apiRouter } from './routes/api.router.js'
import { registerAdminUploadRoutes } from './routes/admin-upload.js'
import { registerPersonalDocumentPublicRoutes } from './routes/personal-documents.routes.js'
import { registerResumeRoutes } from './routes/resume.routes.js'

export function createApp() {
  const app = new Hono()
    .use('*', requestId())
    .use('*', secureHeaders())
    .use(
      '*',
      cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
      }),
    )
    // Fresh/serialized Postgres access (avoids hung PgBouncer sockets + pool exhaustion)
    .use('*', async (c, next) => {
      if (c.req.path === '/api/health') {
        await next()
        return
      }
      try {
        await runWithDb(() => next())
      } catch (err) {
        if (err instanceof Error && err.message === 'DB_TIMEOUT') {
          return c.json(
            {
              success: false,
              error: { code: 'DB_TIMEOUT', message: 'Database query timed out' },
            },
            503,
          )
        }
        throw err
      }
    })
    .onError((err, c) => {
      if (err instanceof HTTPException) {
        return c.json(
          {
            success: false,
            error: { code: 'HTTP_ERROR', message: err.message },
          },
          err.status,
        )
      }
      return c.json(
        {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
        },
        500,
      )
    })

  // Liveness (no DB). Use /api/health/db to verify Postgres from the app pool.
  app.get('/api/health/db', async (c) => {
    const started = Date.now()
    try {
      await db.execute(sql`SELECT 1`)
      return c.json({ ok: true as const, db: true as const, ms: Date.now() - started })
    } catch (err) {
      return c.json(
        {
          ok: false as const,
          db: false as const,
          ms: Date.now() - started,
          error: err instanceof Error ? err.message : String(err),
        },
        503,
      )
    }
  })

  app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

  registerAdminUploadRoutes(app)
  registerResumeRoutes(app)
  registerPersonalDocumentPublicRoutes(app)

  createHonoEndpoints(app, contract, apiRouter, { basePath: '/api' })

  return app
}

export type AppType = ReturnType<typeof createApp>
