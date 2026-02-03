/**
 * kfood_brands 컬렉션 조회
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'

const COLLECTION_NAME = 'kfood_brands'

export type KFoodBrand = {
  name: string
  logoUrl?: string
}

/**
 * name으로 브랜드 조회 (대소문자 무시)
 */
export async function getKFoodBrandByName(name: string): Promise<KFoodBrand | null> {
  if (!name?.trim()) return null
  const client = await clientPromise
  const db = client.db(getMongoDbName())
  const doc = await db
    .collection(COLLECTION_NAME)
    .findOne({ name: { $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } })
  if (!doc) return null
  return {
    name: (doc as any).name,
    logoUrl: (doc as any).logoUrl,
  }
}

/**
 * 모든 kfood_brands 조회
 */
export async function getAllKFoodBrands(): Promise<KFoodBrand[]> {
  const client = await clientPromise
  const db = client.db(getMongoDbName())
  const docs = await db.collection(COLLECTION_NAME).find({}).toArray()
  return docs.map((doc) => ({
    name: (doc as any).name,
    logoUrl: (doc as any).logoUrl,
  }))
}

