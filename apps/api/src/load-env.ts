import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const apiRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const monorepoRoot = path.join(apiRoot, '../..')

config({ path: path.join(monorepoRoot, '.env') })
config({ path: path.join(apiRoot, '.env') })
