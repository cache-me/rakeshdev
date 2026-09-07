import { contract } from '@portfolio/contracts'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'


import { auth } from './lib/auth.js'
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

  app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

  registerAdminUploadRoutes(app)
  registerResumeRoutes(app)
  registerPersonalDocumentPublicRoutes(app)

  createHonoEndpoints(app, contract, apiRouter, { basePath: '/api' })

  return app
}

export type AppType = ReturnType<typeof createApp>
