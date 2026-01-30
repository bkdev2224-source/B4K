/**
 * kpop_artists 컬렉션에 youtube, instagram, twitter, wikipedia, agency 필드 업데이트
 *
 * 사용법: npx tsx scripts/update-kpop-artists.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'
import { kpopArtistsSocialData } from './kpop-artists-data'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

async function main() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = db.collection('kpop_artists')

    console.log(`DB: ${DB_NAME} / 컬렉션: kpop_artists\n`)

    let updated = 0
    let notFound: string[] = []

    for (const data of kpopArtistsSocialData) {
      // 5개 필드 전부 항상 설정 (누락 방지)
      const update: Record<string, string> = {
        youtube: data.youtube ?? '',
        instagram: data.instagram ?? '',
        twitter: data.twitter ?? '',
        wikipedia: data.wikipedia ?? '',
        agency: data.agency ?? '',
      }

      const result = await collection.updateOne(
        { name: data.name },
        { $set: update }
      )
      if (result.matchedCount > 0) {
        updated++
        console.log(`✓ ${data.name}`)
      } else {
        notFound.push(data.name)
      }
    }

    console.log(`\n총 ${updated}명 아티스트 정보 업데이트 완료. (DB: ${DB_NAME})`)
    if (notFound.length > 0) {
      console.log('매칭되지 않은 이름:', notFound.join(', '))
    }
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
