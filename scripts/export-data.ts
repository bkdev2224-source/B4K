/**
 * MongoDB 데이터를 JSON 파일로 내보내는 스크립트 (백업)
 * 
 * 사용법:
 * npm run export-data
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient, ObjectId } from 'mongodb'
import { writeFileSync } from 'fs'
import { getMongoDbName, getMongoUriRequired } from '../lib/env'

// .env.local 파일 로드
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DB_NAME = getMongoDbName()
const MONGODB_URI = getMongoUriRequired()

// ObjectId를 { $oid } 형태로 변환하는 헬퍼 (기본)
function convertObjectIdToString(obj: any): any {
  if (obj instanceof ObjectId) {
    return { $oid: obj.toString() }
  }
  if (Array.isArray(obj)) {
    return obj.map(convertObjectIdToString)
  }
  if (obj && typeof obj === 'object') {
    const converted: any = {}
    for (const key in obj) {
      if (obj[key] instanceof Date) {
        converted[key] = obj[key].toISOString()
      } else {
        converted[key] = convertObjectIdToString(obj[key])
      }
    }
    return converted
  }
  return obj
}

function wrapId(id: any) {
  // JSON 백업은 기존 mockupdata 형식에 맞춰 { $oid: "..." } 로 통일
  if (id instanceof ObjectId) return { $oid: id.toString() }
  if (typeof id === 'string') return { $oid: id }
  if (id && typeof id === 'object' && typeof id.$oid === 'string') return { $oid: id.$oid }
  return { $oid: String(id) }
}

async function exportData() {
  console.log('🔌 MongoDB 연결 시도 중...')
  console.log(`데이터베이스: ${DB_NAME}`)
  
  const client = new MongoClient(MONGODB_URI!)
  
  try {
    console.log('⏳ 연결 중... (최대 30초 대기)')
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('연결 타임아웃 (30초)')), 30000)
      )
    ])
    console.log('✅ MongoDB 연결 성공')
    
    const db = client.db(DB_NAME)
    
    // 1. POI 데이터 내보내기
    console.log('\n📍 POI 데이터 내보내기 중...')
    const poisCollection = db.collection('pois')
    const pois = await poisCollection.find({}).toArray()
    const poisData = pois.map((poi: any) => ({
      ...convertObjectIdToString(poi),
      _id: wrapId(poi._id),
    }))
    
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/pois.json'),
      JSON.stringify(poisData, null, 2),
      'utf-8'
    )
    console.log(`✅ ${pois.length}개의 POI를 save/pois.json에 저장 완료`)
    
    // 2. Package 데이터 내보내기
    console.log('\n📦 Package 데이터 내보내기 중...')
    const packagesCollection = db.collection('packages')
    const packages = await packagesCollection.find({}).toArray()
    const packagesData = packages.map((pkg: any) => ({
      ...convertObjectIdToString(pkg),
      _id: wrapId(pkg._id),
    }))
    
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/packages.json'),
      JSON.stringify(packagesData, null, 2),
      'utf-8'
    )
    console.log(`✅ ${packages.length}개의 Package를 save/packages.json에 저장 완료`)
    
    // 3. KContent 데이터 내보내기
    console.log('\n📝 KContent 데이터 내보내기 중...')
    const kcontentsCollection = db.collection('kcontents')
    const kcontents = await kcontentsCollection.find({}).toArray()
    
    // 카테고리별로 분리
    const kpopData = kcontents
      .filter(c => c.category === 'kpop')
      .map(c => {
        const converted = convertObjectIdToString(c)
        const { _id, category, createdAt, updatedAt, ...rest } = converted
        return {
          ...rest,
          poiId: wrapId((c as any).poiId),
        }
      })
    
    const kbeautyData = kcontents
      .filter(c => c.category === 'kbeauty')
      .map(c => {
        const converted = convertObjectIdToString(c)
        const { _id, category, createdAt, updatedAt, ...rest } = converted
        return {
          ...rest,
          poiId: wrapId((c as any).poiId),
        }
      })
    
    const kfoodData = kcontents
      .filter(c => c.category === 'kfood')
      .map(c => {
        const converted = convertObjectIdToString(c)
        const { _id, category, createdAt, updatedAt, ...rest } = converted
        return {
          ...rest,
          poiId: wrapId((c as any).poiId),
        }
      })
    
    const kfestivalData = kcontents
      .filter(c => c.category === 'kfestival')
      .map(c => {
        const converted = convertObjectIdToString(c)
        const { _id, category, createdAt, updatedAt, ...rest } = converted
        return {
          ...rest,
          poiId: wrapId((c as any).poiId),
        }
      })
    
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/kcontents/kpop.json'),
      JSON.stringify(kpopData, null, 2),
      'utf-8'
    )
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/kcontents/kbeauty.json'),
      JSON.stringify(kbeautyData, null, 2),
      'utf-8'
    )
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/kcontents/kfood.json'),
      JSON.stringify(kfoodData, null, 2),
      'utf-8'
    )
    writeFileSync(
      resolve(process.cwd(), 'mockupdata/save/kcontents/kfestival.json'),
      JSON.stringify(kfestivalData, null, 2),
      'utf-8'
    )
    console.log(`✅ ${kcontents.length}개의 KContent를 save/kcontents/에 저장 완료`)
    
    console.log('\n🎉 모든 데이터 내보내기 완료!')
    console.log(`\n데이터베이스: ${DB_NAME}`)
    console.log(`- POIs: ${pois.length}개 → mockupdata/save/pois.json`)
    console.log(`- Packages: ${packages.length}개 → mockupdata/save/packages.json`)
    console.log(`- KContents: ${kcontents.length}개 → mockupdata/save/kcontents/`)
    
  } catch (error) {
    console.error('❌ 에러 발생:', error)
    throw error
  } finally {
    await client.close()
    console.log('\n🔌 MongoDB 연결 종료')
  }
}

// 스크립트 실행
exportData()
  .then(() => {
    console.log('\n✅ 스크립트 실행 완료')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 스크립트 실행 실패:', error)
    process.exit(1)
  })

