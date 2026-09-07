import './load-env.js'

import { serve } from '@hono/node-server'

import { createApp } from './app.js'
import { assertDatabaseReady } from './lib/assert-db.js'
import { env } from './lib/env.js'

await assertDatabaseReady()

const app = createApp()

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    process.stdout.write(`API listening on http://localhost:${info.port}\n`)
  },
)
