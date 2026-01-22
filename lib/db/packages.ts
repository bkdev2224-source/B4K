import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export interface TravelPackage {
  _id: ObjectId | string
  name: string
  duration: number
  concept: string
  cities: string[]
  highlights: string[]
  includedServices: string[]
  itinerary: Array<{
    day: number
    city: string
    activities: string[]
  }>
  category: 'kpop' | 'kdrama' | 'all'
  imageUrl: string // Cloudinary 이미지 URL
  cloudinaryPublicId?: string // Cloudinary public ID
  images?: string[] // 여러 이미지 URL 배열
  cloudinaryPublicIds?: string[] // 여러 Cloudinary public ID 배열
  createdAt?: Date
  updatedAt?: Date
}

const DB_NAME = process.env.MONGODB_DB_NAME || 'B4K_DEV'
const COLLECTION_NAME = 'packages'

/**
 * 모든 패키지 조회
 */
export async function getAllPackages(): Promise<TravelPackage[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const packages = await db.collection<TravelPackage>(COLLECTION_NAME).find({}).toArray()
    return packages.map(pkg => ({
      ...pkg,
      _id: pkg._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching packages:', error)
    throw error
  }
}

/**
 * ID로 패키지 조회
 */
export async function getPackageById(packageId: string): Promise<TravelPackage | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const pkg = await db.collection<TravelPackage>(COLLECTION_NAME).findOne({
      _id: new ObjectId(packageId),
    })
    
    if (!pkg) return null
    
    return {
      ...pkg,
      _id: pkg._id.toString(),
    }
  } catch (error) {
    console.error('Error fetching package by ID:', error)
    return null
  }
}

/**
 * 카테고리로 패키지 조회
 */
export async function getPackagesByCategory(
  category: 'kpop' | 'kdrama' | 'all'
): Promise<TravelPackage[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const packages = await db.collection<TravelPackage>(COLLECTION_NAME).find({
      category,
    }).toArray()
    
    return packages.map(pkg => ({
      ...pkg,
      _id: pkg._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching packages by category:', error)
    return []
  }
}

/**
 * 패키지 생성
 */
export async function createPackage(
  packageData: Omit<TravelPackage, '_id' | 'createdAt' | 'updatedAt'>
): Promise<TravelPackage> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const now = new Date()
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).insertOne({
      ...packageData,
      createdAt: now,
      updatedAt: now,
    } as any)
    
    const pkg = await db.collection<TravelPackage>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    return {
      ...pkg!,
      _id: pkg!._id.toString(),
    }
  } catch (error) {
    console.error('Error creating package:', error)
    throw error
  }
}

/**
 * 패키지 업데이트
 */
export async function updatePackage(
  packageId: string,
  updateData: Partial<Omit<TravelPackage, '_id' | 'createdAt'>>
): Promise<TravelPackage | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(packageId) },
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
    console.error('Error updating package:', error)
    return null
  }
}

/**
 * 패키지 이미지 업데이트 (Cloudinary 연동)
 */
export async function updatePackageImage(
  packageId: string,
  imageUrl: string,
  cloudinaryPublicId: string
): Promise<TravelPackage | null> {
  return updatePackage(packageId, {
    imageUrl,
    cloudinaryPublicId,
  })
}

/**
 * 패키지에 여러 이미지 추가
 */
export async function addPackageImages(
  packageId: string,
  imageUrls: string[],
  cloudinaryPublicIds: string[]
): Promise<TravelPackage | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(packageId) },
      {
        $push: {
          images: { $each: imageUrls },
          cloudinaryPublicIds: { $each: cloudinaryPublicIds },
        },
        $set: {
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
    console.error('Error adding package images:', error)
    return null
  }
}

/**
 * 패키지 삭제
 */
export async function deletePackage(packageId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(packageId),
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}

