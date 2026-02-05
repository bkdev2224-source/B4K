/**
 * Shared TypeScript types and interfaces for the B4K application
 */

import type { ObjectId } from 'mongodb'

// ============================================================================
// Common Types
// ============================================================================

/**
 * MongoDB ObjectId wrapper for JSON serialization
 */
export interface OidWrapper {
  $oid: string
}

/**
 * K-Content categories
 */
export type KContentCategory = 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama'

/**
 * Package categories
 */
export type PackageCategory = 'kpop' | 'kdrama' | 'all'

// ============================================================================
// POI Types
// ============================================================================

/**
 * GeoJSON Point location
 */
export interface GeoLocation {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

/**
 * POI (Point of Interest) - JSON format (from mockupdata)
 */
export interface POIJson {
  _id: OidWrapper
  name: {
    name_en: string
    name_ko: string
  }
  address: {
    address_en: string
    address_ko: string
  }
  location: GeoLocation
  categoryTags: string[]
  openingHours: string
  entryFee: string
  needsReservation: boolean
}

/**
 * POI - MongoDB format
 */
export interface POI {
  _id: ObjectId | string
  name: {
    name_en: string
    name_ko: string
  }
  address: {
    address_en: string
    address_ko: string
  }
  location: GeoLocation
  categoryTags: string[]
  openingHours: string
  entryFee: string
  needsReservation: boolean
  createdAt?: Date
  updatedAt?: Date
}

// ============================================================================
// KContent Types
// ============================================================================

/**
 * KContent - JSON format (from mockupdata)
 */
export interface KContentJson {
  subName: {
    subName_en: string
    subName_ko: string
  }
  poiId: OidWrapper
  spotName: {
    spotName_en: string
    spotName_ko: string
  }
  description: string
  tags: string[]
  popularity?: number
  [key: string]: unknown
}

/**
 * KContent - MongoDB format
 */
export interface KContent {
  _id: ObjectId | string
  subName: {
    subName_en: string
    subName_ko: string
  }
  poiId: ObjectId | string
  spotName: {
    spotName_en: string
    spotName_ko: string
  }
  description: {
    description_en: string
    description_ko: string
  }
  tags: string[]
  popularity?: number
  category: KContentCategory
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

// ============================================================================
// Package Types
// ============================================================================

/**
 * Travel package itinerary day
 */
export interface ItineraryDay {
  day: number
  city: string
  activities: string[]
}

/**
 * TravelPackage - JSON format (from mockupdata)
 */
export interface TravelPackageJson {
  _id: OidWrapper
  name: string
  duration: number
  concept: {
    concept_en: string
    concept_ko: string
  }
  cities: {
    cities_en: string[]
    cities_ko: string[]
  }
  highlights: {
    highlights_en: string[]
    highlights_ko: string[]
  }
  includedServices: {
    includedServices_en: string[]
    includedServices_ko: string[]
  }
  itinerary: ItineraryDay[]
  category: PackageCategory
  imageUrl: string
}

/**
 * TravelPackage - MongoDB format
 */
export interface TravelPackage {
  _id: ObjectId | string
  name: string
  duration: number
  concept: {
    concept_en: string
    concept_ko: string
  }
  cities: {
    cities_en: string[]
    cities_ko: string[]
  }
  highlights: {
    highlights_en: string[]
    highlights_ko: string[]
  }
  includedServices: {
    includedServices_en: string[]
    includedServices_ko: string[]
  }
  itinerary: ItineraryDay[]
  category: PackageCategory
  imageUrl: string
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * MongoDB document with timestamps
 */
export interface TimestampedDocument {
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Create document input (without _id and timestamps)
 */
export type CreateInput<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>

/**
 * Update document input (without _id and timestamps)
 */
export type UpdateInput<T> = Partial<Omit<T, '_id' | 'createdAt'>>
