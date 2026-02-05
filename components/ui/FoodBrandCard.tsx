'use client'

import { ArtistLogo } from './ArtistLogo'
import type { KFoodBrand } from '@/lib/db/kfood-brands'
import { useLanguage } from '@/components/providers/LanguageContext'
import { getKFoodBrandName } from '@/lib/utils/locale'

export interface FoodBrandCardProps {
  brand: KFoodBrand
  className?: string
}

export function FoodBrandCard({ brand, className = '' }: FoodBrandCardProps) {
  const { language } = useLanguage()
  const brandName = getKFoodBrandName(brand, language)
  
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-[border-color,box-shadow] duration-200 shadow-sm hover:shadow-lg ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <ArtistLogo
          subName={brandName}
          logoUrl={brand.logoUrl ?? null}
          size="md"
        />
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {brandName}
          </h3>
        </div>
      </div>
    </div>
  )
}

