/**
 * POI의 address와 address_ko를 {address_en, address_ko} 구조로 변환
 * 
 * 사용법: npx tsx scripts/convert-poi-address-to-nested.ts
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
    const collection = db.collection('pois')

    console.log(`DB: ${DB_NAME} / 컬렉션: pois\n`)

    const cursor = collection.find({})
    let updatedCount = 0
    let skippedCount = 0

    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue

      const oldAddress = doc.address
      const oldAddressKo = doc.address_ko

      // Check if already converted
      if (typeof oldAddress === 'object' && oldAddress !== null && 'address_en' in oldAddress) {
        skippedCount++
        continue
      }

      const newAddress = {
        address_en: typeof oldAddress === 'string' ? oldAddress : '',
        address_ko: typeof oldAddressKo === 'string' ? oldAddressKo : (typeof oldAddress === 'string' ? oldAddress : ''),
      }

      await collection.updateOne(
        { _id: doc._id },
        {
          $set: {
            address: newAddress,
          },
          $unset: {
            address_ko: '', // Remove old address_ko field
          },
        }
      )
      updatedCount++
      console.log(`✓ 변환 완료: address_en="${newAddress.address_en}", address_ko="${newAddress.address_ko}"`)
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

