'use client'

import Link from 'next/link'
import { ArtistLogo } from './ArtistLogo'
import type { KBeautyPlace } from '@/lib/db/kbeauty-places'
import { SOCIAL_ICON_URLS } from '@/lib/config/social-icons'

export interface BeautyBrandCardProps {
  brand: KBeautyPlace
  className?: string
}

export function BeautyBrandCard({ brand, className = '' }: BeautyBrandCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-[border-color,box-shadow] duration-200 shadow-sm hover:shadow-lg ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <ArtistLogo
          subName={brand.name}
          logoUrl={brand.logoUrl ?? null}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {brand.name}
          </h3>
          {brand.wikipedia && (
            <Link
              href={brand.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Wikipedia →
            </Link>
          )}
        </div>
      </div>

      {/* 소셜 미디어 링크 */}
      {(brand.youtube || brand.instagram || brand.twitter) && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          {brand.youtube && (
            <a
              href={brand.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
              aria-label="YouTube"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SOCIAL_ICON_URLS.youtube} alt="" className="w-4 h-4 object-contain" />
            </a>
          )}
          {brand.instagram && (
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SOCIAL_ICON_URLS.instagram} alt="" className="w-4 h-4 object-contain" />
            </a>
          )}
          {brand.twitter && (
            <a
              href={brand.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
              aria-label="X"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SOCIAL_ICON_URLS.x} alt="" className="w-4 h-4 object-contain" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

