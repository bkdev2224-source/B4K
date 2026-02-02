import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { SidebarProvider } from '@/components/providers/SidebarContext'
import { RouteProvider } from '@/components/providers/RouteContext'
import { SearchProvider } from '@/components/providers/SearchContext'
import { CartProvider } from '@/components/providers/CartContext'
import { AnalyticsTracker } from '@/lib/hooks'
import { ThemeProvider } from '@/components/ThemeContext'
import { getNaverMapClientId } from '@/lib/config/env'
import AnalyticsGate from '@/components/analytics/AnalyticsGate'

export const metadata: Metadata = {
  title: 'B4K',
  description: 'B4K Project',
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
  const naverMapClientId = getNaverMapClientId()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Naver Maps API - 공식 문서 예제에 따라 ncpKeyId와 language=en 사용 */}
        {naverMapClientId && (
          <>
            <Script
              src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}&language=en&submodules=geocoder`}
              strategy="beforeInteractive"
            />
            {/* 인증 실패 시 처리 */}
            <Script
              id="naver-map-auth-failure"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.navermap_authFailure = function() {
                    console.error('Naver Maps API 인증 실패: 클라이언트 ID를 확인하세요.');
                  };
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg dark:focus:bg-gray-900 dark:focus:text-gray-100 focus-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <SessionProvider>
            <SidebarProvider>
              <RouteProvider>
                <SearchProvider>
                  <CartProvider>
                    <AnalyticsGate />
                    <AnalyticsTracker />
                    {children}
                  </CartProvider>
                </SearchProvider>
              </RouteProvider>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

