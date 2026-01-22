"use client"

import Image from 'next/image'
import { useState } from 'react'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  quality?: number
  sizes?: string
  cloudinaryPublicId?: string
  transformation?: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
  }
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  quality = 75,
  sizes,
  cloudinaryPublicId,
  transformation,
}: CloudinaryImageProps) {
  const [imageSrc, setImageSrc] = useState(src)

  // Cloudinary public ID가 제공된 경우 최적화된 URL 생성
  const getOptimizedUrl = () => {
    if (!cloudinaryPublicId) return imageSrc

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Using original image source.')
      return imageSrc
    }

    const transformations: string[] = []

    if (transformation?.width || transformation?.height) {
      const size = transformation.width && transformation.height
        ? `w_${transformation.width},h_${transformation.height}`
        : transformation.width
        ? `w_${transformation.width}`
        : `h_${transformation.height}`
      transformations.push(size)
    }

    if (transformation?.crop) {
      transformations.push(`c_${transformation.crop}`)
    }

    if (transformation?.quality) {
      transformations.push(`q_${transformation.quality}`)
    }

    if (transformation?.format) {
      transformations.push(`f_${transformation.format}`)
    }

    const transformationString = transformations.length > 0
      ? transformations.join(',') + '/'
      : ''

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${cloudinaryPublicId}`
  }

  const optimizedSrc = cloudinaryPublicId ? getOptimizedUrl() : imageSrc

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onError={() => setImageSrc('/placeholder-image.png')}
      />
    )
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      onError={() => setImageSrc('/placeholder-image.png')}
    />
  )
}

