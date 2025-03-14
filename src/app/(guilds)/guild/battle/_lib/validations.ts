import type { GuildBattleRecords } from '@/db/schemas/guild'
import { guildBattleRecords } from '@/db/schemas/guild'

import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(['advancedTable', 'floatingBar'])).withDefault(
    [],
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<GuildBattleRecords>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  participantName: parseAsString.withDefault(''),
  bossType: parseAsArrayOf(z.enum(guildBattleRecords.bossType.enumValues)).withDefault([]),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

// 用于转换前端提交的datetime字符串到数据库timestamp
export function convertToDbTimestamp(datetimeStr: string): Date {
  return new Date(datetimeStr)
}

export const createGuildBattleRecordSchema = z.object({
  participantName: z.string().min(1, '玩家名称不能为空'),
  bossType: z.enum(guildBattleRecords.bossType.enumValues, {
    errorMap: () => ({ message: '请选择有效的BOSS类型' }),
  }),
  damage: z.number().int().positive('伤害必须为正整数'),
  participationTime: z.string().datetime({ message: '请输入有效的日期时间格式' }),
  combatPower: z.number().int().positive('战斗力必须为正整数'),
  seasonName: z.string().min(1, '赛季名称不能为空'),
  guildName: z.string().min(1, '公会名称不能为空'),
})

export const updateGuildBattleRecordSchema = z.object({
  participantName: z.string().optional(),
  bossType: z.enum(guildBattleRecords.bossType.enumValues).optional(),
  seasonName: z.string().optional(),
  guildName: z.string().optional(),
})

export type GetGuildBattleRecordSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>

export type CreateGuildBattleRecordSchema = z.infer<typeof createGuildBattleRecordSchema>
export type UpdateGuildBattleRecordSchema = z.infer<typeof updateGuildBattleRecordSchema>
