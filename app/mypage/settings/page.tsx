"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import PageLayout from '@/components/layout/PageLayout'
import { useLanguage } from '@/components/providers/LanguageContext'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { language } = useLanguage()

  const t =
    language === 'ko'
      ? {
          back: '프로필로 돌아가기',
          title: '설정',
          desc: '화면 및 개인정보 설정을 관리하세요.',
          appearance: '화면',
          appearanceDesc: '테마 및 표시 설정.',
          privacy: '데이터 및 개인정보',
          privacyDesc: '분석 및 개인정보 설정.',
          signedInAs: '로그인 계정',
        }
      : {
          back: 'Back to Profile',
          title: 'Settings',
          desc: 'Manage your preferences for appearance and privacy.',
          appearance: 'Appearance',
          appearanceDesc: 'Theme and display preferences.',
          privacy: 'Data & Privacy',
          privacyDesc: 'Analytics and privacy controls.',
          signedInAs: 'Signed in as',
        }

  if (status === "loading") {
    return (
      <PageLayout>
        <div className="px-6 py-10">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <Link
              href="/mypage"
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

          <div className="space-y-4">
            <Link
              href="/mypage/settings/appearance"
              className="focus-ring block border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/70 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {t.appearance}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.appearanceDesc}</p>
            </Link>
            <Link
              href="/mypage/settings/privacy"
              className="focus-ring block border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white/70 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {t.privacy}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.privacyDesc}</p>
            </Link>
          </div>

          {session && (
            <section className="mt-8 border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t.signedInAs}</h3>
              <div className="mt-3 flex items-center gap-4">
                {session.user?.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-lg font-bold border-2 border-gray-300 dark:border-gray-600">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{session.user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{session.user?.email}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
