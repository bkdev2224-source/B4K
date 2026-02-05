import type { Language } from '@/components/providers/LanguageContext'

/**
 * 언어에 따라 적절한 필드 반환
 * name_ko가 있으면 한국어일 때 사용, 없으면 항상 name 사용
 */
export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  fieldName: string,
  language: Language
): string {
  // 기본 필드
  const baseField = fieldName as keyof T
  const baseValue = obj[baseField] as string | undefined

  // 한국어일 때만 name_ko 체크
  if (language === 'ko') {
    const koField = `${fieldName}_ko` as keyof T
    const koValue = obj[koField] as string | undefined
    
    // name_ko가 있으면 사용, 없으면 기본 name 사용
    return koValue || baseValue || ''
  }

  // 영어일 때는 항상 기본 필드 사용
  return baseValue || ''
}

/**
 * KFestivalPlace의 이름 가져오기
 */
export function getKFestivalPlaceName(
  place: { name: { name_en: string; name_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? place.name.name_ko : place.name.name_en
}

/**
 * KFoodBrand의 이름 가져오기
 */
export function getKFoodBrandName(
  brand: { name: { name_en: string; name_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? brand.name.name_ko : brand.name.name_en
}

/**
 * KpopArtist의 이름 가져오기
 */
export function getKpopArtistName(
  artist: { name: { name_en: string; name_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? artist.name.name_ko : artist.name.name_en
}

/**
 * POI의 이름 가져오기
 */
export function getPOIName(
  poi: { name: { name_en: string; name_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? poi.name.name_ko : poi.name.name_en
}

/**
 * POI의 주소 가져오기
 */
export function getPOIAddress(
  poi: { address: { address_en: string; address_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? poi.address.address_ko : poi.address.address_en
}

/**
 * KContent의 subName 가져오기
 */
export function getKContentSubName(
  content: { subName: { subName_en: string; subName_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? content.subName.subName_ko : content.subName.subName_en
}

/**
 * KContent의 spotName 가져오기
 */
export function getKContentSpotName(
  content: { spotName: { spotName_en: string; spotName_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? content.spotName.spotName_ko : content.spotName.spotName_en
}

/**
 * KContent의 description 가져오기
 */
export function getKContentDescription(
  content: { description: { description_en: string; description_ko: string } | string }, 
  language: Language
): string {
  if (typeof content.description === 'string') {
    return content.description
  }
  return language === 'ko' ? content.description.description_ko : content.description.description_en
}

/**
 * TravelPackage의 concept 가져오기
 */
export function getPackageConcept(
  pkg: { concept: { concept_en: string; concept_ko: string } }, 
  language: Language
): string {
  return language === 'ko' ? pkg.concept.concept_ko : pkg.concept.concept_en
}

/**
 * TravelPackage의 cities 가져오기
 */
export function getPackageCities(
  pkg: { cities: { cities_en: string[]; cities_ko: string[] } }, 
  language: Language
): string[] {
  return language === 'ko' ? pkg.cities.cities_ko : pkg.cities.cities_en
}

/**
 * TravelPackage의 highlights 가져오기
 */
export function getPackageHighlights(
  pkg: { highlights: { highlights_en: string[]; highlights_ko: string[] } }, 
  language: Language
): string[] {
  return language === 'ko' ? pkg.highlights.highlights_ko : pkg.highlights.highlights_en
}

/**
 * TravelPackage의 includedServices 가져오기
 */
export function getPackageIncludedServices(
  pkg: { includedServices: { includedServices_en: string[]; includedServices_ko: string[] } }, 
  language: Language
): string[] {
  return language === 'ko' ? pkg.includedServices.includedServices_ko : pkg.includedServices.includedServices_en
}

