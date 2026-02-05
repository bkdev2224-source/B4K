"use client"

import { useLanguage } from '@/components/providers/LanguageContext'

const translations = {
  en: 'B4K Best Packages',
  ko: 'B4K 베스트 패키지',
}

export default function BestPackagesTitle() {
  const { language } = useLanguage()
  
  return (
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
      {translations[language]}
    </h2>
  )
}

