import Script from 'next/script'
import type { Metadata } from 'next'
import { getNaverMapClientId } from '@/lib/config/env'

export const metadata: Metadata = {
  title: 'Interactive Map',
  description: 'Explore Korea on an interactive map. Add POIs to your cart, plan routes, and discover K-Pop, K-Beauty, K-Food spots.',
}

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const naverMapClientId = getNaverMapClientId()

  return (
    <>
      {naverMapClientId && (
        <>
          <Script
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}&language=en&submodules=geocoder`}
            strategy="afterInteractive"
          />
          <Script
            id="naver-map-auth-failure"
            strategy="afterInteractive"
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
      {children}
    </>
  )
}
