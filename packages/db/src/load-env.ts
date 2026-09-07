import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const monorepoRoot = path.join(pkgRoot, '../..')

config({ path: path.join(monorepoRoot, '.env') })
config({ path: path.join(monorepoRoot, 'apps/api/.env') })
config({ path: path.join(pkgRoot, '.env') })

export const defaultDatabaseUrl =
  'postgresql://portfolio:portfolio@localhost:5433/portfolio'

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL ?? defaultDatabaseUrl
}
