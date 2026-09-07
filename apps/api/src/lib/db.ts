import { createDb } from '@portfolio/db'

import { env } from './env.js'

const { db } = createDb(env.DATABASE_URL)

export { db }
