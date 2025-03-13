import { mysqlTable } from '@/db/utils'
import { generateId } from '@/lib/id'
import { sql } from 'drizzle-orm'

import { boolean, timestamp, varchar } from 'drizzle-orm/mysql-core'


export const guildBattleRecords = mysqlTable('guild_battle_records', {
  id: varchar('id', { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  code: varchar('code', { length: 128 }).notNull().unique(),
  title: varchar('title', { length: 128 }),
  status: varchar('status', {
    length: 30,
    enum: ['todo', 'in-progress', 'done', 'canceled'],
  })
    .notNull()
    .default('todo'),
  label: varchar('label', {
    length: 30,
    enum: ['bug', 'feature', 'enhancement', 'documentation'],
  })
    .notNull()
    .default('bug'),
    bossType: varchar('label', {
      length: 30,
      enum: ['bug', 'feature', 'enhancement', 'documentation'],
    })
      .notNull()
      .default('bug'),
  priority: varchar('priority', {
    length: 30,
    enum: ['low', 'medium', 'high'],
  })
    .notNull()
    .default('low'),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type GuildBattleRecords = typeof guildBattleRecords.$inferSelect
export type NewGuildBattleRecords = typeof guildBattleRecords.$inferInsert
