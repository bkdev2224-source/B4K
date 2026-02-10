import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { getSiteUrl } from '@/lib/config/env'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { SidebarProvider } from '@/components/providers/SidebarContext'
import { RouteProvider } from '@/components/providers/RouteContext'
import { SearchProvider } from '@/components/providers/SearchContext'
import { CartProvider } from '@/components/providers/CartContext'
import { AnalyticsTracker } from '@/lib/hooks/useAnalytics'
import { ThemeProvider } from '@/components/ThemeContext'
import { LanguageProvider } from '@/components/providers/LanguageContext'
import AnalyticsGate from '@/components/analytics/AnalyticsGate'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const SITE_NAME = 'B4K'
const DEFAULT_DESCRIPTION =
  'Explore Korea with B4K — discover K-Pop spots, K-Beauty, K-Food, festivals, and K-Drama locations. Plan your trip with curated travel packages and maps.'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Korea Travel & Culture`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Korea Travel & Culture`,
    description: DEFAULT_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Korea Travel & Culture`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash: set dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            // Default is light. Only go dark if explicitly selected or if set to "system" + device prefers dark.
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||(t==='system'&&d);document.documentElement.classList.toggle('dark',!!dark);}catch(e){}})();`,
          }}
        />
        {/* Fonts: Pretendard (Korean) + Inter (Latin via next/font) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg dark:focus:bg-gray-900 dark:focus:text-gray-100 focus-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>
              <SidebarProvider>
                <RouteProvider>
                  <SearchProvider>
                    <CartProvider>
                      <Suspense fallback={null}>
                        <AnalyticsGate />
                      </Suspense>
                      <AnalyticsTracker />
                      {children}
                    </CartProvider>
                  </SearchProvider>
                </RouteProvider>
              </SidebarProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

