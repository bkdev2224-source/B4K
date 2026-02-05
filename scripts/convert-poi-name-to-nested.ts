/**
 * pois 컬렉션의 name을 name 서브 도큐먼트로 변환
 * 
 * 사용법: npx tsx scripts/convert-poi-name-to-nested.ts
 * 
 * 기존: { name: "..." }
 * 변경: { name: { name_en: "...", name_ko: "..." } }
 * 
 * 기존 name을 name_en으로 복사하고, name_ko는 빈 문자열로 설정합니다.
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

    // 모든 문서 가져오기
    const docs = await collection.find({}).toArray()
    console.log(`총 ${docs.length}개 문서 발견\n`)

    let updated = 0
    let skipped = 0

    for (const doc of docs) {
      const currentName = (doc as any).name
      
      // 이미 name이 서브 도큐먼트로 되어 있으면 스킵
      if ((doc as any).name && typeof (doc as any).name === 'object' && (doc as any).name.name_en !== undefined) {
        console.log(`⏭  이미 name 서브 도큐먼트로 변환됨: ${(doc as any).name.name_en || (doc as any).name.name_ko}`)
        skipped++
        continue
      }

      // name 필드가 없으면 스킵
      if (!currentName) {
        console.log(`⚠  name 필드가 없는 문서: ${doc._id}`)
        skipped++
        continue
      }

      // name을 name 서브 도큐먼트로 변환
      // 기존 name을 name_en으로 복사하고, name_ko는 빈 문자열로 설정
      const updateDoc: any = {
        $set: {
          name: {
            name_en: currentName,
            name_ko: '', // 나중에 수동으로 추가
          }
        }
      }

      const result = await collection.updateOne(
        { _id: doc._id },
        updateDoc
      )

      if (result.modifiedCount > 0) {
        updated++
        console.log(`✓ 변환 완료: name_en="${currentName}", name_ko=""`)
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

