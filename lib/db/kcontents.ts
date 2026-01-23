/**
 * KContent database operations
 */

import clientPromise from '@/lib/config/mongodb'
import { ObjectId } from 'mongodb'
import { getMongoDbName } from '@/lib/config/env'
import type { KContent, KContentCategory, CreateInput, UpdateInput } from '@/types'
import { convertKContent, convertKContents, createTimestamps, updateTimestamp } from './utils'

const COLLECTION_NAME = 'kcontents'

/**
 * Get all KContents
 */
export async function getAllKContents(): Promise<Array<KContent & { _id: string; poiId: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({}).toArray()
    return convertKContents(contents)
  } catch (error) {
    console.error('Error fetching KContents:', error)
    throw error
  }
}

/**
 * Get KContent by ID
 */
export async function getKContentById(
  contentId: string
): Promise<(KContent & { _id: string; poiId: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const content = await db.collection<KContent>(COLLECTION_NAME).findOne({
      _id: new ObjectId(contentId),
    })
    
    if (!content) return null
    
    return convertKContent(content)
  } catch (error) {
    console.error('Error fetching KContent by ID:', error)
    return null
  }
}

/**
 * Get KContents by POI ID (supports both string IDs and ObjectIds)
 */
export async function getKContentsByPOIId(
  poiId: string
): Promise<Array<KContent & { _id: string; poiId: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    // Support both string IDs (poi_001) and ObjectIds (24hex)
    const query = ObjectId.isValid(poiId)
      ? { $or: [{ poiId }, { poiId: new ObjectId(poiId) }] }
      : { poiId }
    
    const contents = await db.collection<KContent>(COLLECTION_NAME).find(query as any).toArray()
    
    return convertKContents(contents)
  } catch (error) {
    console.error('Error fetching KContents by POI ID:', error)
    return []
  }
}

/**
 * Get KContents by category
 */
export async function getKContentsByCategory(
  category: KContentCategory
): Promise<Array<KContent & { _id: string; poiId: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({
      category,
    }).toArray()
    
    return convertKContents(contents)
  } catch (error) {
    console.error('Error fetching KContents by category:', error)
    return []
  }
}

/**
 * Get KContents by subName
 */
export async function getKContentsBySubName(
  subName: string
): Promise<Array<KContent & { _id: string; poiId: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const contents = await db.collection<KContent>(COLLECTION_NAME).find({
      subName,
    }).toArray()
    
    return convertKContents(contents)
  } catch (error) {
    console.error('Error fetching KContents by subName:', error)
    return []
  }
}

/**
 * Create a new KContent
 */
export async function createKContent(
  contentData: CreateInput<KContent>
): Promise<KContent & { _id: string; poiId: string }> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<KContent>(COLLECTION_NAME).insertOne({
      ...contentData,
      ...createTimestamps(),
    } as any)
    
    const content = await db.collection<KContent>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    if (!content) {
      throw new Error('Failed to retrieve created KContent')
    }
    
    return convertKContent(content)
  } catch (error) {
    console.error('Error creating KContent:', error)
    throw error
  }
}

/**
 * Update an existing KContent
 */
export async function updateKContent(
  contentId: string,
  updateData: UpdateInput<KContent>
): Promise<(KContent & { _id: string; poiId: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<KContent>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(contentId) },
      {
        $set: {
          ...updateData,
          ...updateTimestamp(),
        },
      },
      { returnDocument: 'after' }
    )
    
    const updated = result?.value
    if (!updated) return null

    return convertKContent(updated)
  } catch (error) {
    console.error('Error updating KContent:', error)
    return null
  }
}

/**
 * Delete a KContent
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
