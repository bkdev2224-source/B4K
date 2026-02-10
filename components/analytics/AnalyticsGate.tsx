"use client"

import Script from 'next/script'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getStoredConsent, setStoredConsent, type ConsentState } from '@/lib/consent'

export default function AnalyticsGate() {
  const searchParams = useSearchParams()
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

  const requireConsent =
    process.env.NEXT_PUBLIC_REQUIRE_ANALYTICS_CONSENT === 'true'

  const hasAnyAnalytics = useMemo(() => !!gaId || !!clarityId, [gaId, clarityId])

  // Force-show modal for testing: add ?cookie_prompt=1 to the URL (dismisses after one choice)
  const forceShowPrompt = searchParams.get('cookie_prompt') === '1'
  const [forcePreviewDismissed, setForcePreviewDismissed] = useState(false)

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

  const dialogRef = useRef<HTMLDivElement>(null)

  const canLoad = !requireConsent || consent === 'granted'
  const shouldPrompt =
    (forceShowPrompt && !forcePreviewDismissed) ||
    (requireConsent && hasAnyAnalytics && consent !== 'granted')

  useEffect(() => {
    if (!shouldPrompt) return
    const el = dialogRef.current
    if (!el) return
    const focusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  }, [shouldPrompt])

  return (
    <>
      {/* Consent modal (optional; controlled by NEXT_PUBLIC_REQUIRE_ANALYTICS_CONSENT). */}
      {shouldPrompt && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
          style={{
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-dialog-title"
          aria-describedby="consent-dialog-desc"
        >
          {/* Backdrop — matches SidePanel overlay */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/50 border-0 cursor-default"
            aria-hidden
          />
          {/* Dialog — site styles: bg, border, rounded, shadow */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          >
            <div className="px-5 py-5 sm:px-6 sm:py-6 flex flex-col gap-4">
              <div className="text-sm">
                <h2
                  id="consent-dialog-title"
                  className="font-semibold text-gray-900 dark:text-gray-100"
                >
                  Analytics preferences
                </h2>
                <p
                  id="consent-dialog-desc"
                  className="mt-2 text-gray-600 dark:text-gray-400"
                >
                  We use analytics (Google Analytics) and session recording (Microsoft Clarity) to understand usage and improve the service. You can accept, decline, or customize your preferences.
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStoredConsent('denied')
                    setConsent('denied')
                    if (forceShowPrompt) setForcePreviewDismissed(true)
                  }}
                  className="focus-ring order-2 sm:order-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Decline
                </button>
                <Link
                  href="/cookie-settings"
                  className="focus-ring order-1 sm:order-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                >
                  Manage Preferences
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStoredConsent('granted')
                    setConsent('granted')
                    if (forceShowPrompt) setForcePreviewDismissed(true)
                  }}
                  className="focus-ring order-0 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                >
                  Accept All
                </button>
              </div>
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

