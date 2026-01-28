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
import { getTmapApiKey } from '@/lib/config/env'

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
  // NOTE:
  // TMAP Vector Map SDK uses `document.write()` internally.
  // If the script is loaded asynchronously (e.g., injected after hydration),
  // browsers can throw: "Failed to execute 'write' on 'Document'..."
  // So we load it as a normal <script> in <head> during initial HTML parse.
  const tmapAppKey = getTmapApiKey()
  const tmapVectorSdkSrc = tmapAppKey
    ? `https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${tmapAppKey}`
    : undefined

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* TMAP Vector SDK uses document.write() internally.
            We must use a raw <script> tag (not Next.js Script component)
            to ensure it loads synchronously during initial HTML parse. */}
        {tmapVectorSdkSrc ? (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src={tmapVectorSdkSrc} />
        ) : null}
        
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

