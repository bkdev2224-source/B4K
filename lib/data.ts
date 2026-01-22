import poisData from '@/mockupdata/pois.json'
import packagesData from '@/mockupdata/packages.json'

export interface POI {
  _id: { $oid: string }
  name: string
  address: string
  location: {
    type: string
    coordinates: number[]
  }
  categoryTags: string[]
  openingHours: string
  entryFee: string
  needsReservation: boolean
}

export interface KContent {
  subName: string
  poiId: { $oid: string }
  spotName: string
  description: string
  tags: string[]
  popularity?: number
  [key: string]: any
}

export function getAllPOIs(): POI[] {
  return poisData as POI[]
}

// MongoDB에서 KContents 가져오기 (서버 컴포넌트용)
export async function getKContentsByPOIId(poiId: string): Promise<KContent[]> {
  const { getKContentsByPOIId: getByPOIId } = await import('@/lib/db/kcontents')
  const contents = await getByPOIId(poiId)
  
  // MongoDB 형식을 기존 JSON 형식으로 변환
  return contents.map(content => ({
    subName: content.subName,
    poiId: { $oid: typeof content.poiId === 'string' ? content.poiId : content.poiId.toString() },
    spotName: content.spotName,
    description: content.description,
    tags: content.tags,
    popularity: content.popularity,
    category: content.category,
  })) as KContent[]
}

export function getPOIById(poiId: string): POI | undefined {
  return (poisData as POI[]).find((poi) => poi._id.$oid === poiId)
}

// MongoDB에서 KContents 가져오기 (서버 컴포넌트용)
export async function getKContentsByCategory(category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'): Promise<KContent[]> {
  const { getKContentsByCategory: getByCategory } = await import('@/lib/db/kcontents')
  const contents = await getByCategory(category)
  
  // MongoDB 형식을 기존 JSON 형식으로 변환
  return contents.map(content => ({
    subName: content.subName,
    poiId: { $oid: typeof content.poiId === 'string' ? content.poiId : content.poiId.toString() },
    spotName: content.spotName,
    description: content.description,
    tags: content.tags,
    popularity: content.popularity,
    category: content.category,
  })) as KContent[]
}

// MongoDB에서 모든 KContents 가져오기 (서버 컴포넌트용)
export async function getAllKContents(): Promise<KContent[]> {
  const { getAllKContents: getAll } = await import('@/lib/db/kcontents')
  const contents = await getAll()
  
  // MongoDB 형식을 기존 JSON 형식으로 변환
  return contents.map(content => ({
    subName: content.subName,
    poiId: { $oid: typeof content.poiId === 'string' ? content.poiId : content.poiId.toString() },
    spotName: content.spotName,
    description: content.description,
    tags: content.tags,
    popularity: content.popularity,
    category: content.category,
  })) as KContent[]
}

// 클라이언트 컴포넌트용 동기 함수 (API 호출)
export function getAllKContentsSync(): KContent[] {
  // 클라이언트에서는 빈 배열 반환 (실제로는 API를 통해 가져와야 함)
  // 이 함수는 호환성을 위해 유지하되, 실제 사용은 API를 통해 해야 함
  return []
}

// K-Content가 어떤 카테고리에 속하는지 확인
export function getContentCategory(content: KContent): 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | null {
  // content 객체에 category 필드가 있으면 사용
  if ('category' in content && content.category) {
    return content.category as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'
  }
  return null
}

export interface TravelPackage {
  _id: { $oid: string }
  name: string
  duration: number
  concept: string
  cities: string[]
  highlights: string[]
  includedServices: string[]
  itinerary: Array<{
    day: number
    city: string
    activities: string[]
  }>
  category: 'kpop' | 'kdrama' | 'all'
  imageUrl: string
}

export function getAllPackages(): TravelPackage[] {
  return packagesData as TravelPackage[]
}

export function getPackageById(packageId: string): TravelPackage | undefined {
  return (packagesData as TravelPackage[]).find((pkg) => pkg._id.$oid === packageId)
}

// subName으로 KContents 찾기 (서버 컴포넌트용)
export async function getKContentsBySubName(subName: string): Promise<KContent[]> {
  const { getKContentsBySubName: getBySubName } = await import('@/lib/db/kcontents')
  const contents = await getBySubName(subName)
  
  // MongoDB 형식을 기존 JSON 형식으로 변환
  return contents.map(content => ({
    subName: content.subName,
    poiId: { $oid: typeof content.poiId === 'string' ? content.poiId : content.poiId.toString() },
    spotName: content.spotName,
    description: content.description,
    tags: content.tags,
    popularity: content.popularity,
    category: content.category,
  })) as KContent[]
}

// subName이 존재하는지 확인 (서버 컴포넌트용)
export async function hasSubName(subName: string): Promise<boolean> {
  const contents = await getKContentsBySubName(subName)
  return contents.length > 0
}