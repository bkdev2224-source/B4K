import Script from 'next/script'
import { getNaverMapClientId } from '@/lib/config/env'

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
            strategy="beforeInteractive"
          />
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
      {children}
    </>
  )
}
