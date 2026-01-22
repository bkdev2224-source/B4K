/**
 * MongoDB와 Cloudinary를 함께 사용하는 유틸리티 함수들
 */

import { uploadImageClient } from './cloudinary'
import { updatePOIImage } from '@/lib/db/pois'
import { updateKContentImage, addKContentImages } from '@/lib/db/kcontents'
import { updatePackageImage, addPackageImages } from '@/lib/db/packages'

/**
 * 이미지를 업로드하고 POI에 저장
 */
export async function uploadAndSavePOIImage(
  file: File,
  poiId: string,
  folder?: string
): Promise<{ url: string; publicId: string }> {
  const uploadResult = await uploadImageClient(file, folder || 'b4k/pois')
  await updatePOIImage(poiId, uploadResult.url, uploadResult.publicId)
  return uploadResult
}

/**
 * 이미지를 업로드하고 KContent에 저장
 */
export async function uploadAndSaveKContentImage(
  file: File,
  contentId: string,
  folder?: string,
  isMultiple: boolean = false
): Promise<{ url: string; publicId: string }> {
  const uploadResult = await uploadImageClient(file, folder || 'b4k/kcontents')
  
  if (isMultiple) {
    await addKContentImages(contentId, [uploadResult.url], [uploadResult.publicId])
  } else {
    await updateKContentImage(contentId, uploadResult.url, uploadResult.publicId)
  }
  
  return uploadResult
}

/**
 * 이미지를 업로드하고 Package에 저장
 */
export async function uploadAndSavePackageImage(
  file: File,
  packageId: string,
  folder?: string,
  isMultiple: boolean = false
): Promise<{ url: string; publicId: string }> {
  const uploadResult = await uploadImageClient(file, folder || 'b4k/packages')
  
  if (isMultiple) {
    await addPackageImages(packageId, [uploadResult.url], [uploadResult.publicId])
  } else {
    await updatePackageImage(packageId, uploadResult.url, uploadResult.publicId)
  }
  
  return uploadResult
}

/**
 * 여러 이미지를 업로드하고 저장
 */
export async function uploadAndSaveMultipleImages(
  files: File[],
  entityType: 'poi' | 'kcontent' | 'package',
  entityId: string,
  folder?: string
): Promise<Array<{ url: string; publicId: string }>> {
  const results = await Promise.all(
    files.map(file => uploadImageClient(file, folder || `b4k/${entityType}`))
  )

  const urls = results.map(r => r.url)
  const publicIds = results.map(r => r.publicId)

  switch (entityType) {
    case 'poi':
      // POI는 단일 이미지만 지원하므로 첫 번째 이미지만 저장
      if (results.length > 0) {
        await updatePOIImage(entityId, urls[0], publicIds[0])
      }
      break

    case 'kcontent':
      await addKContentImages(entityId, urls, publicIds)
      break

    case 'package':
      await addPackageImages(entityId, urls, publicIds)
      break
  }

  return results
}

