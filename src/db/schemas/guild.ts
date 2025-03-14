import { mysqlTable } from '@/db/utils'
import { generateId } from '@/lib/id'
import { sql } from 'drizzle-orm'

import { int, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

// 公会讨伐战记录表
export const guildBattleRecords = mysqlTable('guild_battle_records', {
  id: varchar('id', { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  participantName: varchar('participantName', { length: 128 }).notNull(),
  bossType: varchar('bossType', {
    length: 30,
    enum: ['结块的甘草海深渊', '命运大天使', '红丝绒蛋糕龙'],
  })
    .notNull(),
  damage: int('damage').notNull(),
  participationTime: timestamp('participationTime').notNull(),
  combatPower: int('combatPower').notNull(),
  seasonName: varchar('seasonName', { length: 128 }).notNull(),
  guildName: varchar('guildName', { length: 128 }).notNull(),
  createdAt: timestamp('created_at').default(sql`current_timestamp`).notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
}, table => [
  uniqueIndex('battle_record_unique_idx').on(
    table.participantName,
    table.guildName,
    table.seasonName,
    table.damage,
    table.bossType,
    table.combatPower,
  ),
])

export type GuildBattleRecords = typeof guildBattleRecords.$inferSelect
export type NewGuildBattleRecords = typeof guildBattleRecords.$inferInsert
