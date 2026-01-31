/**
 * kpop_artists 컬렉션 조회
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'

const COLLECTION_NAME = 'kpop_artists'

export type KpopArtist = {
  name: string
  logoUrl?: string
  agency?: string
  youtube?: string
  instagram?: string
  twitter?: string
  wikipedia?: string
}

/**
 * name으로 아티스트 조회 (대소문자 무시, 공백/따옴표 정규화)
 */
export async function getKpopArtistByName(name: string): Promise<KpopArtist | null> {
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
    agency: (doc as any).agency,
    youtube: (doc as any).youtube,
    instagram: (doc as any).instagram,
    twitter: (doc as any).twitter,
    wikipedia: (doc as any).wikipedia,
  }
}
