/**
 * kfestival_places 컬렉션의 name_en, name_ko를 name 서브 도큐먼트로 변환
 * 
 * 사용법: npx tsx scripts/convert-kfestival-name-to-nested.ts
 * 
 * 기존: { name_en: "...", name_ko: "..." }
 * 변경: { name: { name_en: "...", name_ko: "..." } }
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
    const collection = db.collection('kfestival_places')

    console.log(`DB: ${DB_NAME} / 컬렉션: kfestival_places\n`)

    // 모든 문서 가져오기
    const docs = await collection.find({}).toArray()
    console.log(`총 ${docs.length}개 문서 발견\n`)

    let updated = 0
    let skipped = 0

    for (const doc of docs) {
      const nameEn = (doc as any).name_en
      const nameKo = (doc as any).name_ko
      
      // 이미 name이 서브 도큐먼트로 되어 있으면 스킵
      if ((doc as any).name && typeof (doc as any).name === 'object' && (doc as any).name.name_en !== undefined) {
        console.log(`⏭  이미 name 서브 도큐먼트로 변환됨: ${(doc as any).name.name_en || (doc as any).name.name_ko}`)
        skipped++
        continue
      }

      // name_en이나 name_ko가 없으면 스킵
      if (!nameEn && !nameKo) {
        console.log(`⚠  name_en과 name_ko가 모두 없는 문서: ${doc._id}`)
        skipped++
        continue
      }

      // name 서브 도큐먼트로 변환
      const updateDoc: any = {
        $set: {
          name: {
            name_en: nameEn || '',
            name_ko: nameKo || '',
          }
        },
        $unset: {
          name_en: '',
          name_ko: '',
        }
      }

      const result = await collection.updateOne(
        { _id: doc._id },
        updateDoc
      )

      if (result.modifiedCount > 0) {
        updated++
        console.log(`✓ 변환 완료: name_en="${nameEn || ''}", name_ko="${nameKo || ''}"`)
      }
    }

    console.log(`\n완료:`)
    console.log(`  - 업데이트: ${updated}개`)
    console.log(`  - 스킵: ${skipped}개`)
    
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

