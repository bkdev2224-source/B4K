import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export interface POI {
  _id: ObjectId | string
  name: string
  address: string
  location: {
    type: string
    coordinates: number[]
  }
  categoryTags: string[]
  openingHours: string
  entryFee: string
  needsReservation: boolean
  imageUrl?: string // Cloudinary 이미지 URL
  cloudinaryPublicId?: string // Cloudinary public ID
  createdAt?: Date
  updatedAt?: Date
}

const DB_NAME = process.env.MONGODB_DB_NAME || 'B4K_TEST'
const COLLECTION_NAME = 'pois'

function buildIdQuery(id: string) {
  // 지원: 문자열 _id (poi_001 등) + ObjectId _id(24hex)
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { _id: new ObjectId(id) }] }
  }
  return { _id: id }
}

/**
 * 모든 POI 조회
 */
export async function getAllPOIs(): Promise<POI[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const pois = await db.collection<POI>(COLLECTION_NAME).find({}).toArray()
    return pois.map(poi => ({
      ...poi,
      _id: poi._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching POIs:', error)
    throw error
  }
}

/**
 * ID로 POI 조회
 */
export async function getPOIById(poiId: string): Promise<POI | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const poi = await db.collection<POI>(COLLECTION_NAME).findOne(buildIdQuery(poiId) as any)
    
    if (!poi) return null
    
    return {
      ...poi,
      _id: poi._id.toString(),
    }
  } catch (error) {
    console.error('Error fetching POI by ID:', error)
    return null
  }
}

/**
 * POI 생성
 */
export async function createPOI(poiData: Omit<POI, '_id' | 'createdAt' | 'updatedAt'>): Promise<POI> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const now = new Date()
    
    const result = await db.collection<POI>(COLLECTION_NAME).insertOne({
      ...poiData,
      createdAt: now,
      updatedAt: now,
    } as any)
    
    const poi = await db.collection<POI>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    return {
      ...poi!,
      _id: poi!._id.toString(),
    }
  } catch (error) {
    console.error('Error creating POI:', error)
    throw error
  }
}

/**
 * POI 업데이트
 */
export async function updatePOI(
  poiId: string,
  updateData: Partial<Omit<POI, '_id' | 'createdAt'>>
): Promise<POI | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    const result = await db.collection<POI>(COLLECTION_NAME).findOneAndUpdate(
      buildIdQuery(poiId) as any,
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )
    
    if (!result) return null
    
    return {
      ...result,
      _id: result._id.toString(),
    }
  } catch (error) {
    console.error('Error updating POI:', error)
    return null
  }
}

/**
 * POI 이미지 업데이트 (Cloudinary 연동)
 */
export async function updatePOIImage(
  poiId: string,
  imageUrl: string,
  cloudinaryPublicId: string
): Promise<POI | null> {
  return updatePOI(poiId, {
    imageUrl,
    cloudinaryPublicId,
  })
}

/**
 * POI 삭제
 */
export async function deletePOI(poiId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    const result = await db.collection<POI>(COLLECTION_NAME).deleteOne({
      ...(buildIdQuery(poiId) as any),
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting POI:', error)
    return false
  }
}

/**
 * 카테고리 태그로 POI 검색
 */
export async function getPOIsByCategory(category: string): Promise<POI[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const pois = await db.collection<POI>(COLLECTION_NAME).find({
      categoryTags: category,
    }).toArray()
    
    return pois.map(poi => ({
      ...poi,
      _id: poi._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching POIs by category:', error)
    return []
  }
}

