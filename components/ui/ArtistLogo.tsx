'use client'

import { useState, useEffect } from 'react'
import { getLogoSrcBySubName, getInitials } from '@/lib/utils/logo'

export type ArtistLogoSize = 'sm' | 'md' | 'lg' | number

export type ArtistLogoVariant = 'default' | 'banner'

/** 배너 variant에서 원형 배경: 'dark'=흰 로고용 검정 원, 'light'=검정 로고용 흰 원 */
export type ArtistLogoBackground = 'dark' | 'light'

const sizeMap: Record<Exclude<ArtistLogoSize, number>, { base: string; sm?: string }> = {
  sm: { base: 'w-8 h-8' },
  md: { base: 'w-28 h-28', sm: 'sm:w-32 sm:h-32' },
  lg: { base: 'w-[140px] h-[140px]' },
}

function getSizeClasses(size: ArtistLogoSize): string {
  if (typeof size === 'number') {
    return ''
  }
  const c = sizeMap[size]
  return [c.base, c.sm].filter(Boolean).join(' ')
}

export interface ArtistLogoProps {
  /** 아티스트/브랜드 표시명 (이니셜·alt에 사용) */
  subName: string
  /** 로고 이미지 URL (DB/Cloudinary 등). 없으면 getLogoSrcBySubName(subName)으로 fallback */
  logoUrl?: string | null
  /** 원형 크기: 'sm' | 'md' | 'lg' 또는 픽셀 숫자 */
  size?: ArtistLogoSize
  /** 'banner' = 배너 위 오버레이 스타일(밝은 테두리·흰 글자) */
  variant?: ArtistLogoVariant
  /** 배너일 때 원형 배경: 'dark'=검정(흰 로고), 'light'=흰색(검정 로고). 미지정 시 dark */
  background?: ArtistLogoBackground
  /** 컨테이너 추가 클래스 */
  className?: string
  /** img alt 오버라이드 */
  alt?: string
}

export function ArtistLogo({
  subName,
  logoUrl,
  size = 'md',
  variant = 'default',
  background = 'dark',
  className = '',
  alt,
}: ArtistLogoProps) {
  const resolvedLogoUrl = logoUrl ?? getLogoSrcBySubName(subName)
  const initials = getInitials(subName)
  const isNumericSize = typeof size === 'number'

  const [imgError, setImgError] = useState(false)
  useEffect(() => {
    setImgError(false)
  }, [resolvedLogoUrl])

  const showPlaceholder = !resolvedLogoUrl || imgError

  const containerBase =
    'rounded-full overflow-hidden flex items-center justify-center shrink-0'
  const variantClasses =
    variant === 'banner'
      ? background === 'light'
        ? 'bg-white border-2 border-white/80 shadow-lg'
        : 'bg-black/95 border-2 border-white/40 shadow-lg'
      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'
  const placeholderClasses =
    variant === 'banner'
      ? background === 'light'
        ? 'text-gray-800 font-bold'
        : 'text-white drop-shadow-md font-bold'
      : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-bold'
  const textSizeClass =
    size === 'lg' || (typeof size === 'number' && size >= 100)
      ? 'text-4xl'
      : size === 'sm'
        ? 'text-sm'
        : 'text-xl'

  return (
    <div
      className={`${containerBase} ${variantClasses} ${getSizeClasses(size)} ${className}`}
      style={isNumericSize ? { width: size, height: size } : undefined}
    >
      {showPlaceholder ? (
        <div
          className={`w-full h-full flex items-center justify-center ${placeholderClasses} ${textSizeClass}`}
        >
          {initials}
        </div>
      ) : (
        // 로고 로드 실패 시 onError로 이니셜로 전환해 빈 원 방지
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedLogoUrl}
          alt={alt ?? `${subName} logo`}
          className={`w-full h-full object-contain ${variant === 'banner' ? 'p-2' : 'p-4'}`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  )
}
