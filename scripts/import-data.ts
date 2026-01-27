/**
 * MongoDB에 JSON 파일 데이터를 임포트하는 스크립트
 * 
 * 사용법:
 * npm run import-data
 * 
 * 이 스크립트는 mockupdata/save/ 디렉토리의 JSON 파일들을 MongoDB에 임포트합니다.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient, ObjectId, Db, Collection, Document } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'
import type { POIJson, TravelPackageJson, KContentJson, KContentCategory } from '../types'

// JSON 데이터 import
import poisData from '../mockupdata/save/pois.json'
import packagesData from '../mockupdata/save/packages.json'
import kpopData from '../mockupdata/save/kcontents/kpop.json'
import kbeautyData from '../mockupdata/save/kcontents/kbeauty.json'
import kfoodData from '../mockupdata/save/kcontents/kfood.json'
import kfestivalData from '../mockupdata/save/kcontents/kfestival.json'

// ============================================================================
// Constants
// ============================================================================

const COLLECTION_NAMES = {
  POIS: 'pois',
  PACKAGES: 'packages',
  KCONTENTS: 'kcontents',
} as const

const KCONTENT_CATEGORIES: readonly KContentCategory[] = ['kpop', 'kbeauty', 'kfood', 'kfestival'] as const

const CONNECTION_TIMEOUT_MS = 30000

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
 * Extract OID string from various ID formats
 */
function extractOidString(id: unknown): string {
  if (!id) return ''
  if (typeof id === 'string') return id
  if (typeof id === 'object' && id !== null && '$oid' in id && typeof (id as { $oid: unknown }).$oid === 'string') {
    return (id as { $oid: string }).$oid
  }
  return String(id)
}

/**
 * Transform POI JSON to MongoDB format
 */
function transformPOI(poi: POIJson): Document {
  return {
    _id: extractOidString(poi._id),
    name: poi.name,
    address: poi.address,
    location: {
      type: poi.location?.type || 'Point',
      coordinates: poi.location?.coordinates || [0, 0], // [longitude, latitude]
    },
    categoryTags: Array.isArray(poi.categoryTags) ? poi.categoryTags : [],
    openingHours: poi.openingHours || '',
    entryFee: poi.entryFee || '',
    needsReservation: Boolean(poi.needsReservation),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Transform Package JSON to MongoDB format
 */
function transformPackage(pkg: TravelPackageJson): Document {
  return {
    _id: extractOidString(pkg._id),
    name: pkg.name,
    duration: pkg.duration,
    concept: pkg.concept,
    cities: pkg.cities,
    highlights: pkg.highlights,
    includedServices: pkg.includedServices,
    itinerary: pkg.itinerary,
    category: pkg.category,
    imageUrl: pkg.imageUrl || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Transform KContent JSON to MongoDB format
 */
function transformKContent(content: KContentJson, category: KContentCategory): Document {
  return {
    _id: new ObjectId(),
    subName: content.subName || '',
    poiId: extractOidString(content.poiId),
    spotName: content.spotName || '',
    description: content.description || '',
    tags: Array.isArray(content.tags) ? content.tags : [],
    popularity: typeof content.popularity === 'number' ? content.popularity : undefined,
    category,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// ============================================================================
// Import Functions
// ============================================================================

/**
 * Import collection data (delete existing and insert new)
 */
async function importCollection(
  collection: Collection<Document>,
  collectionName: string,
  documents: Document[]
): Promise<number> {
  // Delete existing data
  await collection.deleteMany({})
  
  // Insert new data
  if (documents.length > 0) {
    const result = await collection.insertMany(documents)
    return result.insertedCount
  }
  
  return 0
}

/**
 * Import KContents by category
 */
async function importKContents(
  collection: Collection<Document>,
  categoryData: Record<KContentCategory, KContentJson[]>
): Promise<number> {
  const allKContents: Document[] = []
  
  for (const category of KCONTENT_CATEGORIES) {
    const contents = categoryData[category] || []
    const transformed = contents.map(content => transformKContent(content, category))
    allKContents.push(...transformed)
  }
  
  return importCollection(collection, COLLECTION_NAMES.KCONTENTS, allKContents)
}

// ============================================================================
// Main Import Function
// ============================================================================

/**
 * Import all data from JSON files to MongoDB
 */
async function importAllData(): Promise<void> {
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
    const results: Array<{ collection: string; count: number }> = []
    
    // 1. POI 데이터 임포트
    console.log(`\n📍 ${COLLECTION_NAMES.POIS.toUpperCase()} 데이터 임포트 중...`)
    const transformedPOIs = (poisData as unknown as POIJson[]).map(transformPOI)
    const poiCount = await importCollection(
      db.collection(COLLECTION_NAMES.POIS),
      COLLECTION_NAMES.POIS,
      transformedPOIs
    )
    results.push({ collection: COLLECTION_NAMES.POIS, count: poiCount })
    console.log(`✅ ${poiCount}개의 POI 임포트 완료`)
    
    // 2. Package 데이터 임포트
    console.log(`\n📦 ${COLLECTION_NAMES.PACKAGES.toUpperCase()} 데이터 임포트 중...`)
    const transformedPackages = (packagesData as TravelPackageJson[]).map(transformPackage)
    const packageCount = await importCollection(
      db.collection(COLLECTION_NAMES.PACKAGES),
      COLLECTION_NAMES.PACKAGES,
      transformedPackages
    )
    results.push({ collection: COLLECTION_NAMES.PACKAGES, count: packageCount })
    console.log(`✅ ${packageCount}개의 Package 임포트 완료`)
    
    // 3. KContent 데이터 임포트
    console.log(`\n📝 ${COLLECTION_NAMES.KCONTENTS.toUpperCase()} 데이터 임포트 중...`)
    // Helper function to normalize KContent data (convert null to undefined)
    const normalizeKContent = (data: unknown[]): KContentJson[] => {
      return (data as Array<{ popularity?: number | null; [key: string]: unknown }>).map(item => ({
        ...item,
        popularity: item.popularity === null ? undefined : item.popularity,
      })) as KContentJson[]
    }
    const kcontentData = {
      kpop: normalizeKContent(kpopData as unknown[]),
      kbeauty: normalizeKContent(kbeautyData as unknown[]),
      kfood: normalizeKContent(kfoodData as unknown[]),
      kfestival: normalizeKContent(kfestivalData as unknown[]),
    }
    const kcontentCount = await importKContents(
      db.collection(COLLECTION_NAMES.KCONTENTS),
      kcontentData
    )
    results.push({ collection: COLLECTION_NAMES.KCONTENTS, count: kcontentCount })
    console.log(`✅ ${kcontentCount}개의 KContent 임포트 완료`)
    
    // 결과 요약
    console.log('\n🎉 모든 데이터 임포트 완료!')
    console.log(`\n데이터베이스: ${DB_NAME}`)
    console.log('\n📊 임포트 요약:')
    results.forEach(result => {
      console.log(`  - ${result.collection}: ${result.count}개`)
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

importAllData()
  .then(() => {
    console.log('\n✅ 스크립트 실행 완료')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 스크립트 실행 실패:', error)
    process.exit(1)
  })
