import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { SidebarProvider } from '@/components/providers/SidebarContext'
import { RouteProvider } from '@/components/providers/RouteContext'
import { SearchProvider } from '@/components/providers/SearchContext'
import { CartProvider } from '@/components/providers/CartContext'
import { AnalyticsTracker } from '@/lib/hooks/useAnalytics'
import { ThemeProvider } from '@/components/ThemeContext'
import AnalyticsGate from '@/components/analytics/AnalyticsGate'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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

