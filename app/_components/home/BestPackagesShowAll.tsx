"use client"

import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageContext'

const translations = {
  en: 'Show All',
  ko: '전체 보기',
}

export default function BestPackagesShowAll() {
  const { language } = useLanguage()
  
  return (
    <Link
      href="/package"
      className="focus-ring rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
      aria-label={translations[language]}
    >
      {translations[language]}
    </Link>
  )
}

