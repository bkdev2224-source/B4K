"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

export type Language = 'ko' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language from localStorage or detect from IP
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && ['ko', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
      // 쿠키에도 동기화
      document.cookie = `language=${savedLanguage}; path=/; max-age=31536000`
      setIsInitialized(true)
    } else {
      // IP 기반 감지 (서버에서 설정된 경우)
      fetch('/api/detect-locale')
        .then(res => res.json())
        .then(data => {
          if (data.language && ['ko', 'en'].includes(data.language)) {
            setLanguage(data.language)
            localStorage.setItem('language', data.language)
            // 쿠키에도 저장
            document.cookie = `language=${data.language}; path=/; max-age=31536000`
          }
          setIsInitialized(true)
        })
        .catch(() => {
          // 기본값은 영어
          setIsInitialized(true)
        })
    }
  }, [])

  const handleSetLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // 서버 컴포넌트에서 접근할 수 있도록 쿠키에도 저장
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000` // 1년
  }, [])

  const value = useMemo(
    () => ({ language, setLanguage: handleSetLanguage }),
    [language, handleSetLanguage]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

