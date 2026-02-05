"use client"

import PageLayout from '@/components/layout/PageLayout'
import { useTheme } from '@/components/ThemeContext'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageContext'

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language } = useLanguage()

  const t =
    language === 'ko'
      ? {
          back: '설정으로 돌아가기',
          title: '화면',
          desc: '테마 및 표시 설정.',
          themeTitle: '테마',
          themeDesc: '원하는 색상 모드를 선택하세요.',
          light: '라이트',
          dark: '다크',
          device: '기기',
        }
      : {
          back: 'Back to Settings',
          title: 'Appearance',
          desc: 'Theme and display preferences.',
          themeTitle: 'Theme',
          themeDesc: 'Select your preferred color scheme.',
          light: 'Light',
          dark: 'Dark',
          device: 'Device',
        }

  const themes = [
    { value: 'light' as const, label: t.light },
    { value: 'dark' as const, label: t.dark },
    { value: 'system' as const, label: t.device },
  ]

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <Link
              href="/mypage/settings"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.back}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              {t.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.desc}</p>
          </header>

          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/70 dark:bg-gray-900/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t.themeTitle}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.themeDesc}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`focus-ring px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      theme === t.value
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  )
}

