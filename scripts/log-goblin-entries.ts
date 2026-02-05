/**
 * 도깨비 촬영지 데이터베이스 엔트리 로그 생성 스크립트
 * 
 * 사용법: npx tsx scripts/log-goblin-entries.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'
import { writeFileSync } from 'fs'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

interface LogEntry {
  timestamp: string
  collection: string
  totalCount: number
  entries: any[]
}

async function main() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    
    console.log(`\n📊 데이터베이스 엔트리 로그 생성 시작...`)
    console.log(`DB: ${DB_NAME}\n`)

    const timestamp = new Date().toISOString()
    const logEntries: LogEntry[] = []

    // POIs 컬렉션 조회
    const poisCollection = db.collection('pois')
    const pois = await poisCollection.find({ subName: '도깨비' }).sort({ _id: 1 }).toArray()
    
    logEntries.push({
      timestamp,
      collection: 'pois',
      totalCount: pois.length,
      entries: pois.map(poi => ({
        _id: poi._id,
        name: poi.name,
        subName: poi.subName,
        category: poi.category,
        address: poi.address,
        address_kr: poi.address_kr,
        etc: poi.etc,
        categoryTags: poi.categoryTags,
        location: poi.location,
        openingHours: poi.openingHours,
        entryFee: poi.entryFee,
        needsReservation: poi.needsReservation,
        createdAt: poi.createdAt,
        updatedAt: poi.updatedAt,
      }))
    })

    console.log(`✓ POIs: ${pois.length}개 엔트리 발견`)

    // KContents 컬렉션 조회
    const kcontentsCollection = db.collection('kcontents')
    const kcontents = await kcontentsCollection.find({ subName: '도깨비' }).sort({ _id: 1 }).toArray()
    
    logEntries.push({
      timestamp,
      collection: 'kcontents',
      totalCount: kcontents.length,
      entries: kcontents.map(content => ({
        _id: content._id,
        title: content.title,
        subName: content.subName,
        category: content.category,
        poi: content.poi,
        poiId: content.poiId,
        spotName: content.spotName,
        description: content.description,
        tags: content.tags,
        popularity: content.popularity,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      }))
    })

    console.log(`✓ KContents: ${kcontents.length}개 엔트리 발견`)

    // 로그 파일 생성
    const logData = {
      generatedAt: timestamp,
      database: DB_NAME,
      collections: logEntries,
      summary: {
        totalPOIs: pois.length,
        totalKContents: kcontents.length,
        totalEntries: pois.length + kcontents.length,
      }
    }

    // JSON 형식으로 저장
    const jsonLogPath = resolve(process.cwd(), 'logs', 'goblin-entries-log.json')
    writeFileSync(jsonLogPath, JSON.stringify(logData, null, 2), 'utf-8')
    console.log(`\n✓ JSON 로그 저장 완료: ${jsonLogPath}`)

    // 읽기 쉬운 텍스트 형식으로도 저장
    const textLogPath = resolve(process.cwd(), 'logs', 'goblin-entries-log.txt')
    let textLog = `================================================================================\n`
    textLog += `도깨비 촬영지 데이터베이스 엔트리 로그\n`
    textLog += `================================================================================\n`
    textLog += `생성 시간: ${timestamp}\n`
    textLog += `데이터베이스: ${DB_NAME}\n`
    textLog += `================================================================================\n\n`

    textLog += `📊 요약\n`
    textLog += `  - POIs: ${pois.length}개\n`
    textLog += `  - KContents: ${kcontents.length}개\n`
    textLog += `  - 총 엔트리: ${pois.length + kcontents.length}개\n\n`

    textLog += `================================================================================\n`
    textLog += `POIs 컬렉션 (${pois.length}개)\n`
    textLog += `================================================================================\n\n`

    pois.forEach((poi, index) => {
      textLog += `${index + 1}. ${poi.name} (${poi._id})\n`
      textLog += `   - 한글 주소: ${poi.address_kr || 'N/A'}\n`
      textLog += `   - 영문 주소: ${poi.address}\n`
      textLog += `   - 카테고리: ${poi.category}\n`
      textLog += `   - 특징: ${poi.etc || 'N/A'}\n`
      textLog += `   - 영업시간: ${poi.openingHours || 'N/A'}\n`
      textLog += `   - 입장료: ${poi.entryFee || 'N/A'}\n`
      textLog += `   - 예약 필요: ${poi.needsReservation ? 'Yes' : 'No'}\n`
      textLog += `   - 위치: [${poi.location?.coordinates?.[0] || 'N/A'}, ${poi.location?.coordinates?.[1] || 'N/A'}]\n`
      const createdAtDate = poi.createdAt instanceof Date ? poi.createdAt : (poi.createdAt?.$date ? new Date(poi.createdAt.$date) : null)
      textLog += `   - 생성일: ${createdAtDate ? createdAtDate.toISOString() : 'N/A'}\n`
      textLog += `\n`
    })

    textLog += `================================================================================\n`
    textLog += `KContents 컬렉션 (${kcontents.length}개)\n`
    textLog += `================================================================================\n\n`

    kcontents.forEach((content, index) => {
      textLog += `${index + 1}. ${content.spotName} (${content._id})\n`
      textLog += `   - 제목: ${content.title || 'N/A'}\n`
      textLog += `   - 서브네임: ${content.subName}\n`
      textLog += `   - 카테고리: ${content.category}\n`
      textLog += `   - 연결된 POI: ${content.poiId}\n`
      textLog += `   - 설명: ${content.description || 'N/A'}\n`
      textLog += `   - 태그: ${content.tags?.join(', ') || 'N/A'}\n`
      textLog += `   - 인기도: ${content.popularity || 'N/A'}\n`
      const contentCreatedAtDate = content.createdAt instanceof Date ? content.createdAt : (content.createdAt?.$date ? new Date(content.createdAt.$date) : null)
      textLog += `   - 생성일: ${contentCreatedAtDate ? contentCreatedAtDate.toISOString() : 'N/A'}\n`
      textLog += `\n`
    })

    textLog += `================================================================================\n`
    textLog += `로그 생성 완료\n`
    textLog += `================================================================================\n`

    writeFileSync(textLogPath, textLog, 'utf-8')
    console.log(`✓ 텍스트 로그 저장 완료: ${textLogPath}`)

    console.log(`\n✅ 모든 로그 파일 생성 완료!\n`)

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
