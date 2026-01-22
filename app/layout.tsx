import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import { SidebarProvider } from '@/components/SidebarContext'
import { RouteProvider } from '@/components/RouteContext'
import { SearchProvider } from '@/components/SearchContext'
import { CartProvider } from '@/components/CartContext'
import { getTmapApiKey } from '@/lib/env'

export const metadata: Metadata = {
  title: 'B4K',
  description: 'B4K Project',
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
    <html lang="ko">
      <head>
        {tmapVectorSdkSrc ? (
          <Script src={tmapVectorSdkSrc} strategy="beforeInteractive" />
        ) : null}
      </head>
      <body>
        <SessionProvider>
          <SidebarProvider>
            <RouteProvider>
              <SearchProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </SearchProvider>
            </RouteProvider>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

