import type { GuildBattleRecords } from '@/db/schemas/guild'
import { db } from '@/db/index'
import { guildBattleRecords } from '@/db/schemas/guild'

import { generateMultipleRecords } from './utils'

export async function seedGuildBattleRecords(input: { count: number }) {
  const count = input.count ?? 540

  try {
    const allRecords: GuildBattleRecords[] = generateMultipleRecords(count)

    await db.delete(guildBattleRecords)

    console.log('📝 Inserting tasks', allRecords.length)

    await db.insert(guildBattleRecords).values(allRecords)
  }
  catch (err) {
    console.error(err)
  }
}
