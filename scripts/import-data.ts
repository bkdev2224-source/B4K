/**
 * save.json 데이터를 MongoDB에 임포트하는 스크립트
 * 
 * save.json: import-data를 통해 MongoDB에 넣은 데이터 (백업본)
 * before.json: 사용자가 직접 검색해서 넣은 데이터 (백업본)
 * 
 * 사용법:
 * npm run import-data
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
import { MongoClient, ObjectId } from 'mongodb'
// save.json에서 데이터 읽기 (import-data를 통해 넣은 데이터)
import poisData from '../mockupdata/save/pois.json'
import packagesData from '../mockupdata/save/packages.json'
import kpopData from '../mockupdata/save/kcontents/kpop.json'
import kbeautyData from '../mockupdata/save/kcontents/kbeauty.json'
import kfoodData from '../mockupdata/save/kcontents/kfood.json'
import kfestivalData from '../mockupdata/save/kcontents/kfestival.json'
import { getMongoDbName, getMongoUriRequired } from '../lib/env'

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

function getOidString(id: any): string {
  if (!id) return ''
  if (typeof id === 'string') return id
  if (typeof id === 'object' && typeof id.$oid === 'string') return id.$oid
  return String(id)
}

// POI 데이터 변환 (MongoDB 형식에 맞게: _id는 "poi_001" 같은 문자열로 저장)
function transformPOI(poi: any) {
  return {
    _id: getOidString(poi._id),
    name: poi.name,
    address: poi.address,
    // GeoJSON 형식으로 변환 (MongoDB의 지리 공간 쿼리를 위해)
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

// Package 데이터 변환 (_id는 "package_001" 같은 문자열로 저장)
function transformPackage(pkg: any) {
  return {
    _id: getOidString(pkg._id),
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

// KContent 데이터 변환 (MongoDB 형식에 맞게, poiId는 POI _id 문자열을 참조)
function transformKContent(content: any, category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival') {
  return {
    _id: new ObjectId(),
    subName: content.subName || '',
    poiId: getOidString(content.poiId), // POI의 _id 문자열 참조 (e.g. "poi_001")
    spotName: content.spotName || '',
    description: content.description || '',
    tags: Array.isArray(content.tags) ? content.tags : [],
    popularity: typeof content.popularity === 'number' ? content.popularity : undefined,
    category: category,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

async function importData() {
  console.log('🔌 MongoDB 연결 시도 중...')
  console.log(`데이터베이스: ${DB_NAME}`)
  
  // MongoDB 연결 (연결 문자열에 SSL 설정이 포함되어 있으면 자동으로 사용됨)
  const client = new MongoClient(MONGODB_URI!)
  
  try {
    console.log('⏳ 연결 중... (최대 30초 대기)')
    // 연결 타임아웃 설정
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('연결 타임아웃 (30초)')), 30000)
      )
    ])
    console.log('✅ MongoDB 연결 성공')
    
    const db = client.db(DB_NAME)
    
    // 1. POI 데이터 삽입 (먼저 삽입하여 ID 매핑 생성)
    console.log('\n📍 POI 데이터 삽입 중...')
    const poisCollection = db.collection('pois')
    const transformedPOIs = (poisData as any[]).map(transformPOI)
    
    // 기존 데이터 삭제
    await poisCollection.deleteMany({})
    
    // POI 삽입
    const poiResult = await poisCollection.insertMany(transformedPOIs as any)
    console.log(`✅ ${poiResult.insertedCount}개의 POI 삽입 완료`)
    
    // 2. Package 데이터 삽입
    console.log('\n📦 Package 데이터 삽입 중...')
    const packagesCollection = db.collection('packages')
    const transformedPackages = (packagesData as any[]).map(transformPackage)
    
    await packagesCollection.deleteMany({})
    const packageResult = await packagesCollection.insertMany(transformedPackages as any)
    console.log(`✅ ${packageResult.insertedCount}개의 Package 삽입 완료`)
    
    // 3. KContent 데이터 삽입
    console.log('\n📝 KContent 데이터 삽입 중...')
    const kcontentsCollection = db.collection('kcontents')
    
    const kcontents = [
      ...(kpopData as any[]).map(c => transformKContent(c, 'kpop')),
      ...(kbeautyData as any[]).map(c => transformKContent(c, 'kbeauty')),
      ...(kfoodData as any[]).map(c => transformKContent(c, 'kfood')),
      ...(kfestivalData as any[]).map(c => transformKContent(c, 'kfestival')),
    ]
    
    await kcontentsCollection.deleteMany({})
    const kcontentResult = await kcontentsCollection.insertMany(kcontents)
    console.log(`✅ ${kcontentResult.insertedCount}개의 KContent 삽입 완료`)
    
    console.log('\n🎉 모든 데이터 임포트 완료!')
    console.log(`\n데이터베이스: ${DB_NAME}`)
    console.log(`- POIs: ${poiResult.insertedCount}개`)
    console.log(`- Packages: ${packageResult.insertedCount}개`)
    console.log(`- KContents: ${kcontentResult.insertedCount}개`)
    
  } catch (error) {
    console.error('❌ 에러 발생:', error)
    throw error
  } finally {
    await client.close()
    console.log('\n🔌 MongoDB 연결 종료')
  }
}

// 스크립트 실행
importData()
  .then(() => {
    console.log('\n✅ 스크립트 실행 완료')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 스크립트 실행 실패:', error)
    process.exit(1)
  })

