import type { GetGuildBattleRecordSchema } from './validations'
import { db } from '@/db'
import { guildBattleRecords } from '@/db/schemas/guild'
import { tasks } from '@/db/schemas/tasks'

import { filterColumns } from '@/lib/filter-columns'
import { unstable_cache } from '@/lib/unstable-cache'

import {
  and,
  asc,
  count,
  desc,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm'
import 'server-only'

export async function getRecords(input: GetGuildBattleRecordSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage
        const fromDate = input.from ? new Date(input.from) : undefined
        const toDate = input.to ? new Date(input.to) : undefined
        const advancedTable = input.flags.includes('advancedTable')

        const advancedWhere = filterColumns({
          table: tasks,
          filters: input.filters,
          joinOperator: input.joinOperator,
        })

        const where = advancedTable
          ? advancedWhere
          : and(
              input.participantName ? ilike(guildBattleRecords.participantName, `%${input.participantName}%`) : undefined,
              input.bossType.length > 0
                ? inArray(guildBattleRecords.bossType, input.bossType)
                : undefined,
              fromDate ? gte(guildBattleRecords.createdAt, fromDate) : undefined,
              toDate ? lte(guildBattleRecords.createdAt, toDate) : undefined,
            )

        const orderBy
          = input.sort.length > 0
            ? input.sort.map(item =>
                item.desc ? desc(guildBattleRecords[item.id]) : asc(guildBattleRecords[item.id]),
              )
            : [asc(tasks.createdAt)]

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(guildBattleRecords)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy)

          const total = await tx
            .select({
              count: count(),
            })
            .from(guildBattleRecords)
            .where(where)
            .execute()
            .then(res => res[0]?.count ?? 0)

          return {
            data,
            total,
          }
        })

        const pageCount = Math.ceil(total / input.perPage)
        return { data, pageCount }
      }
      catch (_err) {
        return { data: [], pageCount: 0 }
      }
    },
    [JSON.stringify(input)],
    {
      // 3600-3900秒随机过期
      revalidate: 3600 + Math.floor(Math.random() * 300),
      tags: ['tasks'],
    },
  )()
}
