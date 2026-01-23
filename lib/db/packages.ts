/**
 * Travel Package database operations
 */

import clientPromise from '@/lib/config/mongodb'
import { ObjectId } from 'mongodb'
import { getMongoDbName } from '@/lib/config/env'
import type { TravelPackage, PackageCategory, CreateInput, UpdateInput } from '@/types'
import { convertIdToString, convertIdsToString, createTimestamps, updateTimestamp } from './utils'

const COLLECTION_NAME = 'packages'

/**
 * Get all packages
 */
export async function getAllPackages(): Promise<Array<TravelPackage & { _id: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const packages = await db.collection<TravelPackage>(COLLECTION_NAME).find({}).toArray()
    return convertIdsToString(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    throw error
  }
}

/**
 * Get package by ID
 */
export async function getPackageById(
  packageId: string
): Promise<(TravelPackage & { _id: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const pkg = await db.collection<TravelPackage>(COLLECTION_NAME).findOne({
      _id: new ObjectId(packageId),
    })
    
    if (!pkg) return null
    
    return convertIdToString(pkg)
  } catch (error) {
    console.error('Error fetching package by ID:', error)
    return null
  }
}

/**
 * Get packages by category
 */
export async function getPackagesByCategory(
  category: PackageCategory
): Promise<Array<TravelPackage & { _id: string }>> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    const packages = await db.collection<TravelPackage>(COLLECTION_NAME).find({
      category,
    }).toArray()
    
    return convertIdsToString(packages)
  } catch (error) {
    console.error('Error fetching packages by category:', error)
    return []
  }
}

/**
 * Create a new package
 */
export async function createPackage(
  packageData: CreateInput<TravelPackage>
): Promise<TravelPackage & { _id: string }> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).insertOne({
      ...packageData,
      ...createTimestamps(),
    } as any)
    
    const pkg = await db.collection<TravelPackage>(COLLECTION_NAME).findOne({
      _id: result.insertedId,
    })
    
    if (!pkg) {
      throw new Error('Failed to retrieve created package')
    }
    
    return convertIdToString(pkg)
  } catch (error) {
    console.error('Error creating package:', error)
    throw error
  }
}

/**
 * Update an existing package
 */
export async function updatePackage(
  packageId: string,
  updateData: UpdateInput<TravelPackage>
): Promise<(TravelPackage & { _id: string }) | null> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(packageId) },
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

    return convertIdToString(updated)
  } catch (error) {
    console.error('Error updating package:', error)
    return null
  }
}

/**
 * Delete a package
 */
export async function deletePackage(packageId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(getMongoDbName())
    
    const result = await db.collection<TravelPackage>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(packageId),
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}
