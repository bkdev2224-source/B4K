import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Privacy Policy | B4K',
  description: 'Privacy Policy describing how B4K collects, uses, and shares data.',
}

export default function PrivacyPolicyPage() {
  const lang = cookies().get('language')?.value === 'ko' ? 'ko' : 'en'
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ko' ? '최종 업데이트: 2026-02-02' : 'Last updated: 2026-02-02'}
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '개요' : 'Overview'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '이 개인정보처리방침은 B4K가 어떤 정보를 수집하는지, 어떻게 이용하는지, 그리고 B4K 웹사이트 및 서비스(이하 “서비스”) 이용 시 선택할 수 있는 사항을 설명합니다.'
                  : 'This Privacy Policy explains what information B4K collects, how we use it, and the choices you have when using the B4K website and services (the "Service").'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '수집하는 정보' : 'Information We Collect'}
              </h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '계정 정보(구글 로그인)' : 'Account information (Google sign-in)'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '구글로 로그인하면 이름, 이메일 주소, 프로필 이미지와 같은 기본 프로필 정보를 제공받습니다. 이 정보는 로그인 세션을 생성하고 유지하기 위해 사용됩니다.'
                      : 'If you sign in with Google, we receive basic profile information such as your name, email address, and profile image. We use this to create and maintain your signed-in session.'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '사용 및 상호작용 데이터' : 'Usage and interaction data'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '분석 기능이 활성화된 경우, 서비스 이용 방식(예: 방문한 페이지, 검색/콘텐츠·POI 조회 등의 일부 이벤트)에 대한 정보를 수집할 수 있습니다.'
                      : 'When analytics are enabled, we may collect information about how you use the Service (for example: pages you visit and certain in-app events such as search actions and content/POI views).'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '로컬(브라우저) 저장소' : 'Local device storage'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '서비스는 테마 설정이나 장바구니(예: 저장한 POI)와 같은 일부 환경설정 및 클라이언트 상태를 브라우저의 로컬 저장소에 저장합니다.'
                      : "The Service stores some preferences and client-side state in your browser's local storage, such as your theme preference and cart items (e.g. saved POIs)."}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '쿠키 및 유사 기술' : 'Cookies and Similar Technologies'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '서비스는 로그인 세션 유지 등 핵심 기능을 위해 쿠키 및 유사 기술을 사용할 수 있습니다. 분석 기능이 활성화된 경우, 아래에 설명된 제3자 분석 도구가 쿠키를 설정하거나 유사 식별자를 사용할 수 있습니다.'
                  : 'We use cookies and similar technologies for core functionality such as maintaining your authenticated session. If analytics are enabled, third-party analytics tools may also set cookies or use similar identifiers as described below.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '제3자 서비스' : 'Third-Party Services'}
              </h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '인증(구글)' : 'Authentication (Google)'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '서비스는 NextAuth를 통해 구글 OAuth 로그인을 제공합니다. 구글의 데이터 처리 방식은 구글의 자체 정책에 따릅니다.'
                      : "We use Google OAuth (via NextAuth) to allow you to sign in. Google's handling of your data is governed by Google's own policies."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '분석(GA4 및 Microsoft Clarity)' : 'Analytics (GA4 and Microsoft Clarity)'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '설정에 따라 Google Analytics 4(GA4)와 Microsoft Clarity를 사용하여 이용 패턴을 파악하고 서비스를 개선할 수 있습니다. 이 도구들은 기기 정보 및 서비스 내 상호작용 정보를 수집할 수 있습니다.'
                      : 'If enabled by configuration, we use Google Analytics 4 (GA4) and Microsoft Clarity to understand usage patterns and improve the Service. These tools may collect information about your device and interactions with the Service.'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '지도 및 지오코딩(네이버 지도)' : 'Maps and geocoding (Naver Maps)'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '서비스는 네이버 지도를 사용합니다. 지도 기능 사용 시 표시를 위해 주소가 네이버의 지오코딩 서비스로 전송되어 좌표로 변환될 수 있습니다.'
                      : "The Service uses Naver Maps. When map features are used, addresses may be sent to Naver's geocoding services to convert them into coordinates for display."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {lang === 'ko' ? '외부 이미지' : 'External images'}
                  </h3>
                  <p>
                    {lang === 'ko'
                      ? '일부 페이지는 제3자 호스트의 이미지를 불러올 수 있습니다(예: 플레이스홀더 이미지). 이 경우 브라우저가 해당 호스트에 직접 요청을 보냅니다.'
                      : 'Some pages may load images from third-party hosts (for example, placeholder images). Your browser will request those images directly from the host.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '선택사항' : 'Your Choices'}
              </h2>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  {lang === 'ko'
                    ? '언제든지 로그아웃하여 인증 세션을 종료할 수 있습니다.'
                    : 'You can sign out at any time to end your authenticated session.'}
                </li>
                <li>
                  {lang === 'ko'
                    ? '브라우저에서 사이트 데이터를 삭제하여 로컬에 저장된 환경설정과 장바구니 항목을 제거할 수 있습니다.'
                    : 'You can clear site data in your browser to remove locally stored preferences and cart items.'}
                </li>
                <li>
                  {lang === 'ko' ? (
                    <>
                      분석 동의 기능이 활성화된 경우, 분석 추적을 허용하거나 거부할 수 있습니다. 언제든지{' '}
                      <Link className="underline" href="/cookie-settings">
                        쿠키 설정
                      </Link>{' '}
                      페이지에서 쿠키 환경설정을 변경할 수 있습니다.
                    </>
                  ) : (
                    <>
                      If an analytics consent prompt is enabled on your deployment, you can accept or
                      decline analytics tracking. You can manage your cookie preferences at any time by visiting our{' '}
                      <Link className="underline" href="/cookie-settings">
                        Cookie Settings
                      </Link>{' '}
                      page.
                    </>
                  )}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '문의' : 'Contact'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '이 개인정보처리방침에 대한 문의는 B4K에서 제공하는 연락 수단을 통해 서비스 운영자에게 연락해 주세요.'
                  : 'If you have questions about this Privacy Policy, please contact the Service owner using the contact information provided by B4K.'}
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko' ? (
                  <>
                    함께 보기:{' '}
                    <Link className="underline" href="/terms">
                      이용약관
                    </Link>{' '}
                    및{' '}
                    <Link className="underline" href="/info">
                      정보
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Also see:{' '}
                    <Link className="underline" href="/terms">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link className="underline" href="/info">
                      Info
                    </Link>
                    .
                  </>
                )}
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

