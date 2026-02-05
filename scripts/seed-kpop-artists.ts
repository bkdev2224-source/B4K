/**
 * kcontents에서 category가 'kpop'인 문서의 subName을 중복 제거해
 * kpop_artists 컬렉션에 { name: "아티스트명" } 형태로 저장
 *
 * 사용법: npx tsx scripts/seed-kpop-artists.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

async function main() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const kcontents = db.collection('kcontents')
    const kpopArtists = db.collection('kpop_artists')

    const artists = await kcontents
      .aggregate<{ _id: string }>([
        { $match: { category: 'kpop' } },
        { $group: { _id: '$subName' } },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    const uniqueNames = artists
      .map((a) => a._id)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)

    const docs = uniqueNames.map((name) => ({ name }))

    if (docs.length === 0) {
      console.log('kpop category에 해당하는 subName이 없습니다.')
      return
    }

    await kpopArtists.deleteMany({})
    const result = await kpopArtists.insertMany(docs)
    console.log(`kpop_artists 컬렉션에 ${result.insertedCount}명의 아티스트가 저장되었습니다.`)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
