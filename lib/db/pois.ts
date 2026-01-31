/**
 * POI (Point of Interest) database operations
 */

import clientPromise from '@/lib/config/mongodb'
import { getMongoDbName } from '@/lib/config/env'
import type { POI, CreateInput, UpdateInput } from '@/types'
import { buildIdQuery, convertPOI, convertIdsToString, createTimestamps, updateTimestamp } from './utils'

const COLLECTION_NAME = 'pois'

/**
 * Get all POIs
 */
export async function getAllPOIs(): Promise<Array<POI & { _id: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const pois = await db.collection<POI>(COLLECTION_NAME).find({}).toArray()
    return convertIdsToString(pois)
  } catch (error) {
    console.error('Error fetching POIs:', error)
    throw error
  }
}

/**
 * Get POI by ID (supports both string IDs and ObjectIds)
 */
export async function getPOIById(poiId: string): Promise<(POI & { _id: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const poi = await db.collection<POI>(COLLECTION_NAME).findOne(buildIdQuery(poiId) as any)
    
    if (!poi) return null
    
    return convertPOI(poi)
  } catch (error) {
    console.error('Error fetching POI by ID:', error)
    return null
  }
}

/**
 * Create a new POI
 */
export async function createPOI(poiData: CreateInput<POI>): Promise<POI & { _id: string }> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<POI>(COLLECTION_NAME).insertOne({
      ...poiData,
      ...createTimestamps(),
    } as any)
    
    const poi = await db.collection<POI>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    if (!poi) {
      throw new Error('Failed to retrieve created POI')
    }
    
    return convertPOI(poi)
  } catch (error) {
    console.error('Error creating POI:', error)
    throw error
  }
}

/**
 * Update an existing POI
 */
export async function updatePOI(
  poiId: string,
  updateData: UpdateInput<POI>
): Promise<(POI & { _id: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const result = await db.collection<POI>(COLLECTION_NAME).findOneAndUpdate(
      buildIdQuery(poiId) as any,
      {
        $set: {
          ...updateData,
          ...updateTimestamp(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result?.value) return null

    return convertPOI(result.value)
  } catch (error) {
    console.error('Error updating POI:', error)
    return null
  }
}

/**
 * Delete a POI
 */
export async function deletePOI(poiId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<POI>(COLLECTION_NAME).deleteOne(
      buildIdQuery(poiId) as any
    )
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting POI:', error)
    return false
  }
}

/**
 * Get POIs by category tag
 */
export async function getPOIsByCategory(category: string): Promise<Array<POI & { _id: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const pois = await db.collection<POI>(COLLECTION_NAME).find({
      categoryTags: category,
    }).toArray()
    
    return convertIdsToString(pois)
  } catch (error) {
    console.error('Error fetching POIs by category:', error)
    return []
  }
}
