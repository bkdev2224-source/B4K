/**
 * 클라이언트 사이드에서 사용할 수 있는 Cloudinary 유틸리티 함수들
 */

/**
 * 이미지 업로드 함수 (클라이언트에서 사용)
 */
export async function uploadImageClient(
  file: File,
  folder?: string
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append('file', file)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload image')
  }

  const data = await response.json()
  return {
    url: data.url,
    publicId: data.publicId,
  }
}

/**
 * Cloudinary 이미지 URL 생성 (클라이언트에서 사용)
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
    return ''
  }

  const transformations: string[] = []

  if (options?.width || options?.height) {
    const size = options.width && options.height
      ? `w_${options.width},h_${options.height}`
      : options.width
      ? `w_${options.width}`
      : `h_${options.height}`
    transformations.push(size)
  }

  if (options?.crop) {
    transformations.push(`c_${options.crop}`)
  }

  if (options?.quality) {
    transformations.push(`q_${options.quality}`)
  }

  if (options?.format) {
    transformations.push(`f_${options.format}`)
  }

  const transformationString = transformations.length > 0
    ? transformations.join(',') + '/'
    : ''

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`
}

