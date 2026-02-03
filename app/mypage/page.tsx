"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import PageLayout from '@/components/layout/PageLayout'
import { useTheme } from '@/components/ThemeContext'

// Theme toggle button component
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const themes = [
    { 
      value: 'light' as const, 
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      value: 'dark' as const, 
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      value: 'system' as const, 
      label: 'Device',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === t.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      // Use replace to avoid a back-button loop (mypage -> signin -> back -> mypage -> signin...)
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent("/mypage")}`)
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <PageLayout className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  if (!session) {
    return (
      <PageLayout className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to sign in…</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout className="pb-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Profile</h1>
          
          {/* Profile Card */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              {session.user?.image ? (
                <>
                  {/* Use a plain <img> so this does NOT go through Next.js Image Optimizer.
                      This avoids needing remotePatterns for third-party OAuth avatars (e.g. Google). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300 dark:border-gray-600">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{session.user?.name || 'User'}</h2>
                <p className="text-gray-500 dark:text-gray-400">{session.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile Information</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">You can manage your profile information here.</p>
                <Link
                  href="/mypage/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Go to Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Favorites Card */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Favorites</h3>
              <button
                type="button"
                onClick={() => {
                  // TODO: Navigate to favorites page or open modal
                  console.log('Favorites clicked')
                }}
                className="focus-ring p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="View all favorites"
                title="View all favorites"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your saved places and favorite locations will appear here.
              </p>
              <button
                type="button"
                onClick={() => {
                  // TODO: Navigate to favorites page or open modal
                  console.log('View favorites clicked')
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View All Favorites
              </button>
            </div>
          </div>

          {/* Quick Settings Card */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Settings</h3>
              <Link
                href="/mypage/settings"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">Theme</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Select your preferred color scheme</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
    </PageLayout>
  )
}

