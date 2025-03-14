import { seedGuildBattleRecords } from '@/app/(guilds)/guild/battle/_lib/seeds'

async function runSeed() {
  console.log('⏳ Running seed...')

  const start = Date.now()

  await seedGuildBattleRecords({ count: 5400 })

  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error('❌ Seed failed')
  console.error(err)
  process.exit(1)
})
