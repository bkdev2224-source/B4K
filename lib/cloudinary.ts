import { v2 as cloudinary } from 'cloudinary'

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// 이미지 업로드 함수
export async function uploadImage(
  file: string | Buffer,
  options?: {
    folder?: string
    public_id?: string
    transformation?: any[]
  }
): Promise<{ secure_url: string; public_id: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options?.folder || 'b4k',
      public_id: options?.public_id,
      transformation: options?.transformation,
    })
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// 이미지 삭제 함수
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

// 이미지 URL 생성 함수 (최적화 옵션 포함)
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
    gravity?: string
  }
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not set')
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

  if (options?.gravity) {
    transformations.push(`g_${options.gravity}`)
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

