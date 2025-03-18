import type { AppType } from '@/app/api/[[...route]]/route'
import { env } from '@/env.js'

import { hc } from 'hono/client'

export const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL)
