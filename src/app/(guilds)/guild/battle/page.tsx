import type { SearchParams } from '@/types'
import { Shell } from '@/components/shell'
import { getRecords } from './_lib/queries'
import { searchParamsCache } from './_lib/validations'

interface IndexPageProps {
  searchParams: Promise<SearchParams>
}

export default async function GuildBattePage({ searchParams }: IndexPageProps) {
  const search = searchParamsCache.parse(await searchParams)
  const { data, pageCount } = await getRecords(search)
  return <Shell><div>{data.map(item => item.participantName)}</div></Shell>
}
