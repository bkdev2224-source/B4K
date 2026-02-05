/**
 * kpop_artists 컬렉션 조회
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'

const COLLECTION_NAME = 'kpop_artists'

export type KpopArtist = {
  name: {
    name_en: string
    name_ko: string
  }
  logoUrl?: string
  backgroundUrl?: string
  agency?: string
  youtube?: string
  instagram?: string
  twitter?: string
  wikipedia?: string
}

/**
 * name으로 아티스트 조회 (대소문자 무시, 공백/따옴표 정규화)
 * name.name_en 또는 name.name_ko에서 검색
 */
export async function getKpopArtistByName(name: string): Promise<KpopArtist | null> {
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
        { 'name.name_ko': { $regex: regex } },
        { name: { $regex: regex } }, // Fallback for old format
      ],
    })
  if (!doc) return null
  
  // Support both old string format and new nested format
  const docName = (doc as any).name
  const nameObj = typeof docName === 'string' 
    ? { name_en: docName, name_ko: '' }
    : docName
  
  return {
    name: nameObj,
    logoUrl: (doc as any).logoUrl,
    backgroundUrl: (doc as any).backgroundUrl,
    agency: (doc as any).agency,
    youtube: (doc as any).youtube,
    instagram: (doc as any).instagram,
    twitter: (doc as any).twitter,
    wikipedia: (doc as any).wikipedia,
  }
}
