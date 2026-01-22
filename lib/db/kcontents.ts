import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getMongoDbName } from '@/lib/env'

export interface KContent {
  _id: ObjectId | string
  subName: string
  poiId: ObjectId | string
  spotName: string
  description: string
  tags: string[]
  popularity?: number
  category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'
  images?: string[] // 여러 이미지 URL 배열
  createdAt?: Date
  updatedAt?: Date
}

const COLLECTION_NAME = 'kcontents'

/**
 * 모든 KContent 조회
 */
export async function getAllKContents(): Promise<KContent[]> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({}).toArray()
    return contents.map(content => ({
      ...content,
      _id: content._id.toString(),
      poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
    }))
  } catch (error) {
    console.error('Error fetching KContents:', error)
    throw error
  }
}

/**
 * ID로 KContent 조회
 */
export async function getKContentById(contentId: string): Promise<KContent | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const content = await db.collection<KContent>(COLLECTION_NAME).findOne({
      _id: new ObjectId(contentId),
    })
    
    if (!content) return null
    
    return {
      ...content,
      _id: content._id.toString(),
      poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
    }
  } catch (error) {
    console.error('Error fetching KContent by ID:', error)
    return null
  }
}

/**
 * POI ID로 KContent 조회
 */
export async function getKContentsByPOIId(poiId: string): Promise<KContent[]> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    // poiId는 문자열(poi_001 등) 또는 ObjectId(24hex) 둘 다 지원
    const query =
      ObjectId.isValid(poiId)
        ? { $or: [{ poiId }, { poiId: new ObjectId(poiId) }] }
        : { poiId }
    const contents = await db.collection<KContent>(COLLECTION_NAME).find(query as any).toArray()
    
    return contents.map(content => ({
      ...content,
      _id: content._id.toString(),
      poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
    }))
  } catch (error) {
    console.error('Error fetching KContents by POI ID:', error)
    return []
  }
}

/**
 * 카테고리로 KContent 조회
 */
export async function getKContentsByCategory(
  category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'
): Promise<KContent[]> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({
      category,
    }).toArray()
    
    return contents.map(content => ({
      ...content,
      _id: content._id.toString(),
      poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
    }))
  } catch (error) {
    console.error('Error fetching KContents by category:', error)
    return []
  }
}

/**
 * subName으로 KContent 조회
 */
export async function getKContentsBySubName(subName: string): Promise<KContent[]> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({
      subName,
    }).toArray()
    
    return contents.map(content => ({
      ...content,
      _id: content._id.toString(),
      poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
    }))
  } catch (error) {
    console.error('Error fetching KContents by subName:', error)
    return []
  }
}

/**
 * KContent 생성
 */
export async function createKContent(
  contentData: Omit<KContent, '_id' | 'createdAt' | 'updatedAt'>
): Promise<KContent> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const now = new Date()
    const poiId = contentData.poiId
 
    const result = await db.collection<KContent>(COLLECTION_NAME).insertOne({
      ...contentData,
      poiId,
      createdAt: now,
      updatedAt: now,
    } as any)
    
    const content = await db.collection<KContent>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    return {
      ...content!,
      _id: content!._id.toString(),
      poiId: content!.poiId instanceof ObjectId ? content!.poiId.toString() : content!.poiId,
    }
  } catch (error) {
    console.error('Error creating KContent:', error)
    throw error
  }
}

/**
 * KContent 업데이트
 */
export async function updateKContent(
  contentId: string,
  updateData: Partial<Omit<KContent, '_id' | 'createdAt'>>
): Promise<KContent | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<KContent>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(contentId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )
    
    const updated = result?.value
    if (!updated) return null

    return {
      ...updated,
      _id: updated._id.toString(),
      poiId: updated.poiId instanceof ObjectId ? updated.poiId.toString() : updated.poiId,
    }
  } catch (error) {
    console.error('Error updating KContent:', error)
    return null
  }
}

/**
 * KContent 삭제
 */
export async function deleteKContent(contentId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<KContent>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(contentId),
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting KContent:', error)
    return false
  }
}

