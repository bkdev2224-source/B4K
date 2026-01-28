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

// Analytics IDs from environment variables
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

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
        
        {/* Microsoft Clarity Analytics */}
        {CLARITY_ID && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
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
                  gtag('config', '${GA_ID}', {
                    send_page_view: false
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors">
        <ThemeProvider>
          <SessionProvider>
            <SidebarProvider>
              <RouteProvider>
                <SearchProvider>
                  <CartProvider>
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

