"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from 'next/image'
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
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
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
      <PageLayout showSidePanel={false} className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  if (!session) {
    return (
      <PageLayout showSidePanel={false} className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to sign in…</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showSidePanel={false} className="pb-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">MyPage</h1>
          
          {/* Profile Card */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">You can manage your profile information here.</p>
              </div>
            </div>
          </div>

          {/* Theme Settings Card */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">Theme</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Select your preferred color scheme</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
    </PageLayout>
  )
}

