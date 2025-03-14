import type { GuildBattleRecords } from '@/db/schemas/guild'
import type { Task } from '@/db/schemas/tasks'
import { guildBattleRecords } from '@/db/schemas/guild'
import { generateId } from '@/lib/id'
import { faker } from '@faker-js/faker/locale/zh_CN'

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleHelp,
  CircleIcon,
  CircleX,
  Timer,
} from 'lucide-react'

// 生成随机公会名称
function generateGuildName() {
  const length = faker.number.int({ min: 2, max: 7 })
  return faker.string.fromCharacters('天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩体率宾归王鸣凤在竹白驹食场化被草木赖及万方盖此身发四大五常恭惟鞠养岂敢毁伤女慕贞洁男效才良知过必改得能莫忘罔谈彼短靡恃己长信使可覆器欲难量墨悲丝染诗赞羔羊景行维贤克念作圣德建名立形端表正空谷传声虚堂习听祸因恶积福缘善庆尺璧非宝寸阴是竞资父事君曰严与敬孝当竭力忠则尽命临深履薄夙兴温凊似兰斯馨如松之盛川流不息渊澄取映容止若思言辞安定笃初诚美慎终宜令荣业所基籍甚无竟学优登仕摄职从政存以甘棠去而益咏乐殊贵贱礼别尊卑上和下睦夫唱妇随外受傅训入奉母仪诸姑伯叔犹子比儿孔怀兄弟同气连枝交友投分切磨箴规仁慈隐恻造次弗离节义廉退颠沛匪亏性静情逸心动神疲守真志满逐物意移坚持雅操好爵自縻', length)
}

// 生成随机伤害值（1-5亿）
function generateDamage() {
  return faker.number.int({ min: 100000000, max: 500000000 })
}

// 生成随机战斗力（200-250万）
function generateCombatPower() {
  return faker.number.int({ min: 2000000, max: 2500000 })
}

// 生成随机时间（最近30天内）
function generateParticipationTime() {
  return faker.date.recent({ days: 30 })
}

// 生成随机赛季名称
function generateSeasonName() {
  const seasons = ['命运叹咏季', '星辰咏叹季', '永恒咏叹季', '命运交响季']
  const season = faker.helpers.arrayElement(seasons)
  const number = faker.number.int({ min: 1, max: 9 })
  return `${season}-0${number}`
}

// 生成随机记录
export function generateRandomRecords(guildNames: string[]): GuildBattleRecords {
  const now = new Date()
  return {
    id: generateId('records'),
    participantName: faker.person.fullName(),
    bossType: faker.helpers.arrayElement(guildBattleRecords.bossType.enumValues),
    damage: generateDamage(),
    participationTime: generateParticipationTime(),
    combatPower: generateCombatPower(),
    seasonName: generateSeasonName(),
    guildName: faker.helpers.arrayElement(guildNames),
    createdAt: now,
    updatedAt: now,
  }
}

// 生成指定数量的记录
export function generateMultipleRecords(count: number): GuildBattleRecords[] {
  // 生成1-5个公会名称
  const guildCount = faker.number.int({ min: 1, max: 5 })
  const guildNames = Array.from({ length: guildCount }, () => generateGuildName())

  // 生成指定数量的记录
  return Array.from({ length: count }, () => generateRandomRecords(guildNames))
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Task['status']) {
  const statusIcons = {
    'canceled': CircleX,
    'done': CheckCircle2,
    'in-progress': Timer,
    'todo': CircleHelp,
  }

  return statusIcons[status] || CircleIcon
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Task['priority']) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
}
