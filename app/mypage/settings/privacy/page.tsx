"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { useLanguage } from '@/components/providers/LanguageContext'

type ConsentState = 'unknown' | 'granted' | 'denied'
const CONSENT_STORAGE_KEY = 'b4k_analytics_consent'

function getStoredConsent(): ConsentState {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (v === 'granted' || v === 'denied') return v
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

export default function PrivacySettingsPage() {
  const [consent, setConsent] = useState<ConsentState>('unknown')
  const { language } = useLanguage()

  const t =
    language === 'ko'
      ? {
          back: '설정으로 돌아가기',
          title: '데이터 및 개인정보',
          desc: '분석 및 개인정보 설정.',
          analyticsTitle: '분석 및 추적',
          analyticsDesc: '서비스 개선을 위해 사용 데이터가 수집·이용되는 방식을 관리합니다.',
          enabled: '사용',
          disabled: '사용 안 함',
          notSet: '미설정',
          cookieSettings: '쿠키 설정',
          resourcesTitle: '개인정보 관련 링크',
          privacy: '개인정보처리방침',
          terms: '이용약관',
        }
      : {
          back: 'Back to Settings',
          title: 'Data & Privacy',
          desc: 'Analytics and privacy controls.',
          analyticsTitle: 'Analytics & Tracking',
          analyticsDesc: 'Control how we collect and use your usage data to improve our service.',
          enabled: 'Enabled',
          disabled: 'Disabled',
          notSet: 'Not Set',
          cookieSettings: 'Cookie settings',
          resourcesTitle: 'Privacy resources',
          privacy: 'Privacy Policy',
          terms: 'Terms & Conditions',
        }

  useEffect(() => {
    setConsent(getStoredConsent())
  }, [])

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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.desc}
            </p>
          </header>

          <div className="space-y-6">
            <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/70 dark:bg-gray-900/40">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t.analyticsTitle}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.analyticsDesc}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    consent === 'granted'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : consent === 'denied'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {consent === 'granted' ? t.enabled : consent === 'denied' ? t.disabled : t.notSet}
                </span>
              </div>

              <Link
                href="/cookie-settings"
                className="focus-ring inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors bg-white/70 dark:bg-gray-900/40"
              >
                {t.cookieSettings}
              </Link>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/70 dark:bg-gray-900/40">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t.resourcesTitle}</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/privacy" className="focus-ring text-purple-600 dark:text-purple-400 hover:underline">
                  {t.privacy}
                </Link>
                <Link href="/terms" className="focus-ring text-purple-600 dark:text-purple-400 hover:underline">
                  {t.terms}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

