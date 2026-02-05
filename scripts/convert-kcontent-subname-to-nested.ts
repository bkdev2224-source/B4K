/**
 * KContent의 subName을 {subName_en, subName_ko} 구조로 변환
 * 
 * 사용법: npx tsx scripts/convert-kcontent-subname-to-nested.ts
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
    const collection = db.collection('kcontents')

    console.log(`DB: ${DB_NAME} / 컬렉션: kcontents\n`)

    const cursor = collection.find({})
    let updatedCount = 0
    let skippedCount = 0

    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue

      const oldSubName = doc.subName

      // Check if already converted
      if (typeof oldSubName === 'object' && oldSubName !== null && 'subName_en' in oldSubName) {
        skippedCount++
        continue
      }

      const newSubName = {
        subName_en: typeof oldSubName === 'string' ? oldSubName : '',
        subName_ko: '', // Default to empty string for Korean name
      }

      await collection.updateOne(
        { _id: doc._id },
        {
          $set: {
            subName: newSubName,
          },
        }
      )
      updatedCount++
      console.log(`✓ 변환 완료: subName_en="${newSubName.subName_en}", subName_ko="${newSubName.subName_ko}"`)
    }

    console.log(`\n완료:\n  - 업데이트: ${updatedCount}개\n  - 스킵: ${skippedCount}개`)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

