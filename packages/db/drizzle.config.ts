import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')
config({ path: path.join(root, '.env') })
config({ path: path.join(root, 'apps/api/.env') })

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://portfolio:portfolio@localhost:5433/portfolio',
  },
})
