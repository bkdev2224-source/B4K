/**
 * POI의 name_en을 번역하여 name_ko에 저장
 * 
 * 사용법: npx tsx scripts/translate-poi-names.ts
 * 
 * Playwright를 사용하여 Google Translate에서 name_en을 한국어로 번역하고
 * MongoDB의 name_ko 필드에 저장합니다.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'
import { chromium } from 'playwright'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

/**
 * Naver Papago를 사용하여 영어를 한국어로 번역
 */
async function translateToKorean(text: string, browser: any): Promise<string> {
  try {
    const page = await browser.newPage()
    
    // Naver Papago 번역 페이지
    const translateUrl = `https://papago.naver.com/?sk=en&tk=ko&st=${encodeURIComponent(text)}`
    
    await page.goto(translateUrl, { waitUntil: 'networkidle' })
    
    // 번역 결과가 나타날 때까지 대기
    await page.waitForTimeout(3000)
    
    // 번역 결과 선택자 (Papago의 결과 영역)
    const translatedText = await page.evaluate(() => {
      // Papago의 번역 결과 선택자들
      const selectors = [
        '#txtTarget',
        '.edit_box___dPvcs',
        '[data-testid="target-textarea"]',
        'div[lang="ko"]',
      ]
      
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          const text = (element as HTMLElement).innerText || element.textContent
          if (text && text.trim()) {
            return text.trim()
          }
        }
      }
      
      // textarea나 input에서 찾기
      const textareas = Array.from(document.querySelectorAll('textarea'))
      for (const textarea of textareas) {
        if (textarea.value && textarea.value.trim()) {
          return textarea.value.trim()
        }
      }
      
      return null
    })
    
    await page.close()
    
    if (translatedText && translatedText !== text) {
      return translatedText
    }
    
    // 번역 실패 시 원본 반환
    return text
  } catch (error) {
    console.error(`번역 실패: ${text}`, error)
    return text
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI)
  const browser = await chromium.launch({ headless: true })
  
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = db.collection('pois')

    console.log(`DB: ${DB_NAME} / 컬렉션: pois\n`)

    // name_ko가 비어있는 POI만 가져오기
    const docs = await collection.find({
      'name.name_ko': { $in: ['', null] },
      'name.name_en': { $exists: true, $ne: '' }
    }).toArray()
    
    console.log(`번역이 필요한 문서: ${docs.length}개\n`)

    let updated = 0
    let skipped = 0
    let failed = 0

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i]
      const nameEn = (doc as any).name?.name_en || ''
      
      if (!nameEn) {
        console.log(`⏭  ${i + 1}/${docs.length} - name_en이 없음: ${doc._id}`)
        skipped++
        continue
      }

      console.log(`번역 중 (${i + 1}/${docs.length}): "${nameEn}"`)
      
      try {
        const translatedKo = await translateToKorean(nameEn, browser)
        
        if (translatedKo && translatedKo !== nameEn) {
          const result = await collection.updateOne(
            { _id: doc._id },
            {
              $set: {
                'name.name_ko': translatedKo
              }
            }
          )

          if (result.modifiedCount > 0) {
            updated++
            console.log(`  ✓ "${nameEn}" → "${translatedKo}"`)
          } else {
            console.log(`  ⚠ 업데이트 실패: ${nameEn}`)
            failed++
          }
        } else {
          console.log(`  ⚠ 번역 결과가 없거나 동일함: ${nameEn}`)
          skipped++
        }
        
        // API 제한을 피하기 위해 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`  ✗ 번역 실패: ${nameEn}`, error)
        failed++
      }
    }

    console.log(`\n완료:`)
    console.log(`  - 업데이트: ${updated}개`)
    console.log(`  - 스킵: ${skipped}개`)
    console.log(`  - 실패: ${failed}개`)
    
  } finally {
    await browser.close()
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

