import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import { SidebarProvider } from '@/components/SidebarContext'
import { RouteProvider } from '@/components/RouteContext'

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
  const tmapAppKey =
    process.env.NEXT_PUBLIC_TMAP_API_KEY || process.env.TMAP_API_KEY || ''
  const tmapVectorSdkSrc = tmapAppKey
    ? `https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${tmapAppKey}`
    : ''

  return (
    <html lang="ko">
      <head>
        {tmapVectorSdkSrc ? <script src={tmapVectorSdkSrc} /> : null}
      </head>
      <body>
        <SessionProvider>
          <SidebarProvider>
            <RouteProvider>
              {children}
            </RouteProvider>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

