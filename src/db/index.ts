import { env } from '@/env.js'
import { drizzle } from 'drizzle-orm/mysql2'

export const db = drizzle({ connection: { uri: env.DATABASE_URL } })
