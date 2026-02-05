"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { useLanguage } from '@/components/providers/LanguageContext'

type ConsentState = 'unknown' | 'granted' | 'denied'

const CONSENT_STORAGE_KEY = 'b4k_analytics_consent'

function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown'
  const v = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (v === 'granted' || v === 'denied') return v
  return 'unknown'
}

function setStoredConsent(value: Exclude<ConsentState, 'unknown'>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
}

export default function CookieSettingsPage() {
  const { language } = useLanguage()
  const [consent, setConsent] = useState<ConsentState>('unknown')
  const [saved, setSaved] = useState(false)

  const t =
    language === 'ko'
      ? {
          title: '쿠키 설정',
          desc: '분석 및 추적을 위한 개인정보 설정을 관리하세요.',
          saved: '✓ 설정이 저장되었습니다.',
          essentialTitle: '필수 쿠키',
          essentialDesc: '웹사이트 작동에 필요하며 비활성화할 수 없습니다.',
          alwaysActive: '항상 활성',
          essentialItems: ['인증 세션 쿠키', '테마 설정', '장바구니 항목'],
          analyticsTitle: '분석 쿠키',
          analyticsDesc: '웹사이트 이용 방식 이해에 도움을 줍니다.',
          analyticsTools: [
            '• Google Analytics 4(GA4) — 페이지 조회, 이벤트, 기기 정보',
            '• Microsoft Clarity — 세션 기록, 히트맵',
          ],
          acceptAll: '모두 허용',
          rejectAll: '모두 거부',
          save: '설정 저장',
          learnMore: '자세히 알아보기:',
          privacy: '개인정보처리방침',
          terms: '이용약관',
        }
      : {
          title: 'Cookie Settings',
          desc: 'Manage your privacy preferences for analytics and tracking.',
          saved: '✓ Your preferences have been saved.',
          essentialTitle: 'Essential Cookies',
          essentialDesc: 'Required for the website to function. These cannot be disabled.',
          alwaysActive: 'Always Active',
          essentialItems: ['Authentication session cookies', 'Theme preferences', 'Cart items'],
          analyticsTitle: 'Analytics Cookies',
          analyticsDesc: 'Help us understand how visitors interact with our website.',
          analyticsTools: [
            '• Google Analytics 4 (GA4) — page views, events, device info',
            '• Microsoft Clarity — session recordings, heatmaps',
          ],
          acceptAll: 'Accept All',
          rejectAll: 'Reject All',
          save: 'Save Preferences',
          learnMore: 'Learn more:',
          privacy: 'Privacy Policy',
          terms: 'Terms & Conditions',
        }

  useEffect(() => {
    setConsent(getStoredConsent())
  }, [])

  const handleSave = () => {
    if (consent !== 'unknown') {
      setStoredConsent(consent)
      setSaved(true)
      // Reload page to apply changes (Clarity needs page reload to stop)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const handleAcceptAll = () => {
    setConsent('granted')
    setStoredConsent('granted')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleRejectAll = () => {
    setConsent('denied')
    setStoredConsent('denied')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.desc}
            </p>
          </header>

          {saved && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                {t.saved}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Essential Cookies (Always On) */}
            <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t.essentialTitle}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.essentialDesc}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                    {t.alwaysActive}
                  </span>
                </div>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                {t.essentialItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Analytics Cookies */}
            <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t.analyticsTitle}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t.analyticsDesc}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    {t.analyticsTools.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent === 'granted'}
                      onChange={(e) => {
                        setConsent(e.target.checked ? 'granted' : 'denied')
                        setSaved(false)
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t.rejectAll}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={consent === 'unknown'}
                className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.save}
              </button>
            </div>

            {/* Links */}
            <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t.learnMore}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link className="text-sm text-purple-600 dark:text-purple-400 hover:underline" href="/privacy">
                  {t.privacy}
                </Link>
                <Link className="text-sm text-purple-600 dark:text-purple-400 hover:underline" href="/terms">
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
