/**
 * kpop_artists 컬렉션 필드 누락 감사
 * agency, instagram, twitter, wikipedia, youtube 전부 있는지 확인
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const FIELDS = ['agency', 'instagram', 'twitter', 'wikipedia', 'youtube'] as const

async function main() {
  const client = new MongoClient(getMongoUriRequired())
  await client.connect()
  const db = client.db(getMongoDbName())
  const docs = await db.collection('kpop_artists').find({}).toArray()

  const missing: { name: string; missing: string[] }[] = []
  const complete: string[] = []

  for (const doc of docs) {
    const d = doc as Record<string, unknown>
    const name = (d.name as string) ?? '?'
    const missingFields = FIELDS.filter((f) => d[f] == null || d[f] === '')
    if (missingFields.length > 0) {
      missing.push({ name, missing: missingFields })
    } else {
      complete.push(name)
    }
  }

  console.log('=== kpop_artists 필드 누락 감사 ===\n')
  console.log('전체 아티스트 수:', docs.length)
  console.log('5개 필드 모두 있는 아티스트:', complete.length)
  console.log('누락 있는 아티스트:', missing.length, '\n')

  if (missing.length > 0) {
    console.log('--- 누락 상세 ---')
    for (const { name, missing: m } of missing) {
      console.log(`${name}: 누락 필드 [${m.join(', ')}]`)
    }
  }
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
