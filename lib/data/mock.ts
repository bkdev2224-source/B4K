/**
 * Mock data access functions (for static JSON files)
 * 
 * Note: These functions work with static JSON files from mockupdata.
 * For MongoDB operations, use functions from lib/db/
 */

import poisData from '@/mockupdata/pois.json'
import packagesData from '@/mockupdata/packages.json'
import type { POIJson, TravelPackageJson, KContentJson, KContentCategory } from '@/types'

/**
 * Get all POIs from static JSON data
 */
export function getAllPOIs(): POIJson[] {
  return poisData as POIJson[]
}

/**
 * Get POI by ID from static JSON data
 */
export function getPOIById(poiId: string): POIJson | undefined {
  return (poisData as POIJson[]).find((poi) => poi._id.$oid === poiId)
}

/**
 * Get content category from KContent object
 */
export function getContentCategory(content: KContentJson): KContentCategory | null {
  if ('category' in content && content.category) {
    return content.category as KContentCategory
  }
  return null
}

/**
 * Get all packages from static JSON data
 */
export function getAllPackages(): TravelPackageJson[] {
  return packagesData as TravelPackageJson[]
}

/**
 * Get package by ID from static JSON data
 */
export function getPackageById(packageId: string): TravelPackageJson | undefined {
  return (packagesData as TravelPackageJson[]).find((pkg) => pkg._id.$oid === packageId)
}
