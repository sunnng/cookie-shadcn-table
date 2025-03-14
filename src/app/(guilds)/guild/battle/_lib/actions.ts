import type { CreateGuildBattleRecordSchema } from './validations'

import { db } from '@/db'
import { guildBattleRecords } from '@/db/schemas/guild'

import { eq } from 'drizzle-orm'

import { convertToDbTimestamp } from './validations'

// 随机生成公会讨伐战记录

// 创建公会讨伐战记录
export async function createGuildBattleRecord(input: CreateGuildBattleRecordSchema) {
  try {
    // 转换时间戳
    const participationTime = convertToDbTimestamp(input.participationTime)

    // 验证转换后的时间戳
    if (!participationTime) {
      throw new Error('无效的参与时间格式')
    }

    // 插入记录
    const [insertedId] = await db
      .insert(guildBattleRecords)
      .values({
        ...input,
        participationTime,
      })
      .$returningId()

    // 获取插入的记录
    const [record] = await db
      .select()
      .from(guildBattleRecords)
      .where(eq(guildBattleRecords.id, insertedId.id))

    return {
      success: true,
      data: record,
      error: null,
    }
  }
  catch (err) {
    // 处理特定类型的错误
    if (err instanceof Error) {
      // 处理唯一索引冲突
      if (err.message.includes('Duplicate entry')) {
        return {
          success: false,
          data: null,
          error: '该记录已存在，请勿重复提交',
        }
      }

      // 处理其他数据库错误
      if (err.message.includes('SQL')) {
        console.error('数据库操作错误:', err)
        return {
          success: false,
          data: null,
          error: '数据库操作失败，请稍后重试',
        }
      }
    }

    // 处理其他未知错误
    console.error('创建记录时发生错误:', err)
    return {
      success: false,
      data: null,
      error: '创建记录失败，请稍后重试',
    }
  }
}
