/**
 * Shared database utility functions
 */

import { ObjectId, Document } from 'mongodb'
import type { POI, KContent } from '@/types'

/**
 * Build MongoDB query for ID (supports both string IDs and ObjectIds)
 */
export function buildIdQuery(id: string): { _id: string } | { $or: Array<{ _id: string | ObjectId }> } {
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { _id: new ObjectId(id) }] }
  }
  return { _id: id }
}

/**
 * Convert MongoDB document _id to string
 */
export function convertIdToString<T extends { _id: ObjectId | string }>(
  doc: T
): T & { _id: string } {
  return {
    ...doc,
    _id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
  }
}

/**
 * Convert array of MongoDB documents, converting _id to string
 */
export function convertIdsToString<T extends { _id: ObjectId | string }>(
  docs: T[]
): Array<T & { _id: string }> {
  return docs.map(convertIdToString)
}

/**
 * Convert POI document with proper type handling
 */
export function convertPOI(poi: POI): POI & { _id: string } {
  return convertIdToString(poi)
}

/**
 * Convert KContent document with proper type handling for poiId
 */
export function convertKContent(content: KContent): KContent & { _id: string; poiId: string } {
  return {
    ...convertIdToString(content),
    poiId: content.poiId instanceof ObjectId ? content.poiId.toString() : content.poiId,
  }
}

/**
 * Convert array of KContent documents
 */
export function convertKContents(contents: KContent[]): Array<KContent & { _id: string; poiId: string }> {
  return contents.map(convertKContent)
}

/**
 * Create timestamps object
 */
export function createTimestamps(): { createdAt: Date; updatedAt: Date } {
  const now = new Date()
  return {
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Update timestamp object
 */
export function updateTimestamp(): { updatedAt: Date } {
  return {
    updatedAt: new Date(),
  }
}
