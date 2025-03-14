import type { Config } from 'drizzle-kit'
import { env } from '@/env.js'

import { databasePrefix } from '@/lib/constants'

export default {
  schema: './src/db/schemas',
  dialect: 'mysql',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: [`${databasePrefix}_*`],
} satisfies Config
