/**
 * kbeauty_places 컬렉션 조회
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'

const COLLECTION_NAME = 'kbeauty_places'

export type KBeautyPlace = {
  name: string
  logoUrl?: string
  backgroundUrl?: string
  instagram?: string
  youtube?: string
  twitter?: string
  wikipedia?: string
}

/**
 * name으로 브랜드 조회 (대소문자 무시, 공백/따옴표 정규화)
 */
export async function getKBeautyPlaceByName(name: string): Promise<KBeautyPlace | null> {
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
    backgroundUrl: (doc as any).backgroundUrl,
    instagram: (doc as any).instagram,
    youtube: (doc as any).youtube,
    twitter: (doc as any).twitter,
    wikipedia: (doc as any).wikipedia,
  }
}

/**
 * 모든 kbeauty_places 조회
 */
export async function getAllKBeautyPlaces(): Promise<KBeautyPlace[]> {
  const client = await clientPromise
  const db = client.db(getMongoDbName())
  const docs = await db.collection(COLLECTION_NAME).find({}).toArray()
  return docs.map((doc) => ({
    name: (doc as any).name,
    logoUrl: (doc as any).logoUrl,
    backgroundUrl: (doc as any).backgroundUrl,
    instagram: (doc as any).instagram,
    youtube: (doc as any).youtube,
    twitter: (doc as any).twitter,
    wikipedia: (doc as any).wikipedia,
  }))
}

