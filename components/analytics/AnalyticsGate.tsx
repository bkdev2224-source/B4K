"use client"

import Script from 'next/script'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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

export default function AnalyticsGate() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

  const requireConsent =
    process.env.NEXT_PUBLIC_REQUIRE_ANALYTICS_CONSENT === 'true'

  const hasAnyAnalytics = useMemo(() => !!gaId || !!clarityId, [gaId, clarityId])

  const [consent, setConsent] = useState<ConsentState>(
    requireConsent ? 'unknown' : 'granted'
  )

  useEffect(() => {
    if (!requireConsent) {
      setConsent('granted')
      return
    }
    setConsent(getStoredConsent())
  }, [requireConsent])

  const canLoad = !requireConsent || consent === 'granted'
  const shouldPrompt = requireConsent && hasAnyAnalytics && consent === 'unknown'

  return (
    <>
      {/* Consent banner (optional; controlled by NEXT_PUBLIC_REQUIRE_ANALYTICS_CONSENT). */}
      {shouldPrompt && (
        <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              <div className="font-semibold">Analytics preferences</div>
              <div className="text-gray-600 dark:text-gray-400">
                We use analytics (Google Analytics) and session recording (Microsoft Clarity) to understand usage and improve the service. You can accept, decline, or customize your preferences.
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setStoredConsent('denied')
                  setConsent('denied')
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Decline
              </button>
              <Link
                href="/cookie-settings"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Manage Preferences
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStoredConsent('granted')
                  setConsent('granted')
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics scripts */}
      {canLoad && (
        <>
          {/* Microsoft Clarity */}
          {clarityId && (
            <Script
              id="clarity-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${clarityId}");
                `,
              }}
            />
          )}

          {/* Google Analytics 4 */}
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      send_page_view: false
                    });
                  `,
                }}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

