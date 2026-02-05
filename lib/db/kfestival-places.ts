/**
 * kfestival_places 컬렉션 조회
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'

const COLLECTION_NAME = 'kfestival_places'

export type KFestivalPlace = {
  _id?: { $oid: string }
  name: {
    name_en: string
    name_ko: string
  }
  logoUrl?: string
  backgroundUrl?: string
}

/**
 * name으로 축제 조회 (대소문자 무시)
 * name.name_en 또는 name.name_ko에서 검색
 */
export async function getKFestivalPlaceByName(name: string): Promise<KFestivalPlace | null> {
  if (!name?.trim()) return null
  const client = await clientPromise
  const db = client.db(getMongoDbName())
  const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`^${escapedName}$`, 'i')
  const doc = await db
    .collection(COLLECTION_NAME)
    .findOne({
      $or: [
        { 'name.name_en': { $regex: regex } },
        { 'name.name_ko': { $regex: regex } }
      ]
    })
  if (!doc) return null
  
  const nameObj = (doc as any).name
  return {
    _id: doc._id ? { $oid: doc._id.toString() } : undefined,
    name: {
      name_en: nameObj?.name_en || '',
      name_ko: nameObj?.name_ko || '',
    },
    logoUrl: (doc as any).logoUrl,
    backgroundUrl: (doc as any).backgroundUrl,
  }
}

/**
 * 모든 kfestival_places 조회
 */
export async function getAllKFestivalPlaces(): Promise<KFestivalPlace[]> {
  const client = await clientPromise
  const db = client.db(getMongoDbName())
  const docs = await db.collection(COLLECTION_NAME).find({}).toArray()
  return docs.map((doc) => {
    const nameObj = (doc as any).name
    return {
      _id: doc._id ? { $oid: doc._id.toString() } : undefined,
      name: {
        name_en: nameObj?.name_en || '',
        name_ko: nameObj?.name_ko || '',
      },
      logoUrl: (doc as any).logoUrl,
      backgroundUrl: (doc as any).backgroundUrl,
    }
  })
}

