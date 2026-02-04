"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import PageLayout from '@/components/layout/PageLayout'
import { useTheme } from '@/components/ThemeContext'

type ConsentState = 'unknown' | 'granted' | 'denied'
type TabType = 'profile' | 'appearance' | 'privacy'

const CONSENT_STORAGE_KEY = 'b4k_analytics_consent'

function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown'
  const v = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (v === 'granted' || v === 'denied') return v
  return 'unknown'
}

// Theme toggle component
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

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>('appearance')
  const [consent, setConsent] = useState<ConsentState>('unknown')

  useEffect(() => {
    setConsent(getStoredConsent())
  }, [])

  if (status === "loading") {
    return (
      <PageLayout className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  const isLoggedIn = Boolean(session)

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    ...(isLoggedIn
      ? [{
          id: 'profile' as const,
          label: 'Profile',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        }]
      : []),
    {
      id: 'appearance',
      label: 'Appearance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'privacy',
      label: 'Data & Privacy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ]

  return (
    <PageLayout className="pb-8 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`focus-ring flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && session && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Information</h2>
                
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  {session.user?.image ? (
                    <>
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{session.user?.name || 'User'}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={session.user?.name || ''}
                      disabled
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Managed by your Google account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={session.user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Managed by your Google account
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Theme</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select your preferred color scheme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Data & Privacy</h2>
                
                {/* Analytics Consent Status */}
                <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Analytics & Tracking
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Control how we collect and use your usage data to improve our service.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        consent === 'granted'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : consent === 'denied'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {consent === 'granted' ? 'Enabled' : consent === 'denied' ? 'Disabled' : 'Not Set'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/cookie-settings"
                    className="ml-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Manage
                  </Link>
                </div>

                {/* Data Collection Info */}
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    What We Collect
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside ml-2">
                    <li>Account information (name, email, profile image from Google)</li>
                    <li>Usage data (pages visited, searches, interactions) — only if analytics enabled</li>
                    <li>Local preferences (theme, cart items, saved locations)</li>
                  </ul>
                </div>

                {/* Privacy Links */}
                <div className="py-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Privacy Resources
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/privacy"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/cookie-settings"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Cookie Settings
                    </Link>
                    <Link
                      href="/terms"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
