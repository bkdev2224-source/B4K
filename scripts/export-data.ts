/**
 * MongoDB 데이터를 JSON 파일로 내보내는 스크립트 (백업)
 * 
 * 사용법:
 * npm run export-data
 * 
 * 이 스크립트는 MongoDB의 데이터를 mockupdata 형식의 JSON 파일로 내보냅니다.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient, ObjectId, Db, Collection, Document, WithId } from 'mongodb'
import { writeFileSync, mkdirSync } from 'fs'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'

// ============================================================================
// Constants
// ============================================================================

const COLLECTION_NAMES = {
  POIS: 'pois',
  PACKAGES: 'packages',
  KCONTENTS: 'kcontents',
} as const

const KCONTENT_CATEGORIES = ['kpop', 'kbeauty', 'kfood', 'kfestival'] as const

type KContentCategory = typeof KCONTENT_CATEGORIES[number]

const OUTPUT_PATHS = {
  BASE: 'mockupdata/save',
  POIS: 'mockupdata/save/pois.json',
  PACKAGES: 'mockupdata/save/packages.json',
  KCONTENTS_DIR: 'mockupdata/save/kcontents',
} as const

const CONNECTION_TIMEOUT_MS = 30000

// ============================================================================
// Types
// ============================================================================

interface OidWrapper {
  $oid: string
}

interface ExportedDocument {
  _id: OidWrapper
  [key: string]: unknown
}

interface KContentDocument extends Document {
  category: KContentCategory
  poiId: ObjectId | string | OidWrapper
  subName: string
  spotName: string
  description: string
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

interface ExportResult {
  collection: string
  count: number
  filePath: string
}

// ============================================================================
// Environment Setup
// ============================================================================

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * ObjectId를 { $oid: string } 형태로 변환
 */
function wrapObjectId(id: ObjectId | string | OidWrapper | unknown): OidWrapper {
  if (id instanceof ObjectId) {
    return { $oid: id.toString() }
  }
  if (typeof id === 'string') {
    return { $oid: id }
  }
  if (id && typeof id === 'object' && '$oid' in id && typeof (id as { $oid: unknown }).$oid === 'string') {
    return { $oid: (id as { $oid: string }).$oid }
  }
  return { $oid: String(id) }
}

/**
 * MongoDB 문서의 ObjectId와 Date를 JSON 호환 형식으로 변환
 */
function convertMongoDocumentToJson(doc: WithId<Document>): ExportedDocument {
  const converted: Record<string, unknown> = {}
  
  for (const key in doc) {
    const value = doc[key]
    
    if (value instanceof ObjectId) {
      converted[key] = { $oid: value.toString() }
    } else if (value instanceof Date) {
      converted[key] = value.toISOString()
    } else if (Array.isArray(value)) {
      converted[key] = value.map(item => 
        item instanceof ObjectId 
          ? { $oid: item.toString() }
          : item instanceof Date
          ? item.toISOString()
          : item
      )
    } else if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof ObjectId)) {
      // 재귀적으로 처리하되, Document 타입으로 캐스팅
      converted[key] = convertMongoDocumentToJson(value as WithId<Document>)
    } else {
      converted[key] = value
    }
  }
  
  return {
    ...converted,
    _id: wrapObjectId(doc._id),
  } as ExportedDocument
}

/**
 * KContent 문서를 export 형식으로 변환 (메타데이터 제거)
 */
function transformKContentForExport(content: WithId<KContentDocument>): Omit<ExportedDocument, '_id' | 'category' | 'createdAt' | 'updatedAt'> & { poiId: OidWrapper } {
  const converted = convertMongoDocumentToJson(content)
  const { _id, category, createdAt, updatedAt, ...rest } = converted
  
  return {
    ...rest,
    poiId: wrapObjectId(content.poiId),
  } as Omit<ExportedDocument, '_id' | 'category' | 'createdAt' | 'updatedAt'> & { poiId: OidWrapper }
}

/**
 * JSON 파일로 저장
 */
function saveJsonFile(filePath: string, data: unknown): void {
  const fullPath = resolve(process.cwd(), filePath)
  const jsonContent = JSON.stringify(data, null, 2)
  writeFileSync(fullPath, jsonContent, 'utf-8')
}

/**
 * 디렉토리가 없으면 생성
 */
function ensureDirectoryExists(dirPath: string): void {
  const fullPath = resolve(process.cwd(), dirPath)
  try {
    mkdirSync(fullPath, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하면 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// ============================================================================
// Export Functions
// ============================================================================

/**
 * 컬렉션에서 모든 문서를 가져와서 JSON 파일로 저장
 */
async function exportCollection(
  collection: Collection<Document>,
  collectionName: string,
  outputPath: string
): Promise<ExportResult> {
  const documents = await collection.find({}).toArray()
  const exportedData = documents.map(convertMongoDocumentToJson)
  
  saveJsonFile(outputPath, exportedData)
  
  return {
    collection: collectionName,
    count: documents.length,
    filePath: outputPath,
  }
}

/**
 * KContent를 카테고리별로 분리하여 저장
 */
async function exportKContentsByCategory(
  collection: Collection<Document>,
  categories: readonly KContentCategory[]
): Promise<ExportResult[]> {
  const allContents = await collection.find({}).toArray() as WithId<KContentDocument>[]
  const results: ExportResult[] = []
  
  // 출력 디렉토리 생성
  ensureDirectoryExists(OUTPUT_PATHS.KCONTENTS_DIR)
  
  for (const category of categories) {
    const categoryContents = allContents
      .filter(content => content.category === category)
      .map(transformKContentForExport)
    
    const fileName = `${category}.json`
    const filePath = resolve(process.cwd(), OUTPUT_PATHS.KCONTENTS_DIR, fileName)
    
    saveJsonFile(filePath, categoryContents)
    
    results.push({
      collection: `${COLLECTION_NAMES.KCONTENTS} (${category})`,
      count: categoryContents.length,
      filePath: filePath,
    })
  }
  
  return results
}

// ============================================================================
// Main Export Function
// ============================================================================

/**
 * MongoDB에서 모든 데이터를 내보내기
 */
async function exportAllData(): Promise<void> {
  console.log('🔌 MongoDB 연결 시도 중...')
  console.log(`데이터베이스: ${DB_NAME}`)
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    console.log(`⏳ 연결 중... (최대 ${CONNECTION_TIMEOUT_MS / 1000}초 대기)`)
    
    await Promise.race([
      client.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`연결 타임아웃 (${CONNECTION_TIMEOUT_MS / 1000}초)`)), CONNECTION_TIMEOUT_MS)
      ),
    ])
    
    console.log('✅ MongoDB 연결 성공')
    
    const db: Db = client.db(DB_NAME)
    const results: ExportResult[] = []
    
    // 1. POI 데이터 내보내기
    console.log(`\n📍 ${COLLECTION_NAMES.POIS.toUpperCase()} 데이터 내보내기 중...`)
    const poisResult = await exportCollection(
      db.collection(COLLECTION_NAMES.POIS),
      COLLECTION_NAMES.POIS,
      OUTPUT_PATHS.POIS
    )
    results.push(poisResult)
    console.log(`✅ ${poisResult.count}개의 POI를 ${OUTPUT_PATHS.POIS}에 저장 완료`)
    
    // 2. Package 데이터 내보내기
    console.log(`\n📦 ${COLLECTION_NAMES.PACKAGES.toUpperCase()} 데이터 내보내기 중...`)
    const packagesResult = await exportCollection(
      db.collection(COLLECTION_NAMES.PACKAGES),
      COLLECTION_NAMES.PACKAGES,
      OUTPUT_PATHS.PACKAGES
    )
    results.push(packagesResult)
    console.log(`✅ ${packagesResult.count}개의 Package를 ${OUTPUT_PATHS.PACKAGES}에 저장 완료`)
    
    // 3. KContent 데이터 내보내기 (카테고리별)
    console.log(`\n📝 ${COLLECTION_NAMES.KCONTENTS.toUpperCase()} 데이터 내보내기 중...`)
    const kcontentsResults = await exportKContentsByCategory(
      db.collection(COLLECTION_NAMES.KCONTENTS),
      KCONTENT_CATEGORIES
    )
    results.push(...kcontentsResults)
    
    const totalKContents = kcontentsResults.reduce((sum, r) => sum + r.count, 0)
    console.log(`✅ ${totalKContents}개의 KContent를 ${OUTPUT_PATHS.KCONTENTS_DIR}/에 저장 완료`)
    
    // 결과 요약
    console.log('\n🎉 모든 데이터 내보내기 완료!')
    console.log(`\n데이터베이스: ${DB_NAME}`)
    console.log('\n📊 내보내기 요약:')
    results.forEach(result => {
      console.log(`  - ${result.collection}: ${result.count}개 → ${result.filePath}`)
    })
    
  } catch (error) {
    console.error('❌ 에러 발생:', error)
    throw error
  } finally {
    await client.close()
    console.log('\n🔌 MongoDB 연결 종료')
  }
}

// ============================================================================
// Script Execution
// ============================================================================

exportAllData()
  .then(() => {
    console.log('\n✅ 스크립트 실행 완료')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 스크립트 실행 실패:', error)
    process.exit(1)
  })
