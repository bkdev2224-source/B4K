import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Terms & Conditions | B4K',
  description: 'Terms and conditions governing use of the B4K service.',
}

export default function TermsPage() {
  const lang = cookies().get('language')?.value === 'ko' ? 'ko' : 'en'
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {lang === 'ko' ? '이용약관' : 'Terms & Conditions'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ko' ? '최종 업데이트: 2026-02-02' : 'Last updated: 2026-02-02'}
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '약관 동의' : 'Acceptance of These Terms'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? 'B4K(이하 “서비스”)에 접근하거나 서비스를 이용함으로써 본 이용약관에 동의하는 것으로 간주됩니다. 동의하지 않는 경우 서비스를 이용하지 마세요.'
                  : 'By accessing or using B4K (the "Service"), you agree to these Terms & Conditions. If you do not agree, do not use the Service.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '서비스' : 'The Service'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? 'B4K는 장소, 여행 루트 및 관련 여행 정보를 탐색할 수 있는 콘텐츠와 도구를 제공합니다. 서비스는 변경될 수 있으며, 경우에 따라 일시적으로 이용이 제한될 수 있습니다.'
                  : 'B4K provides content and tools for exploring places, routes, and related travel information. The Service may change over time and may be unavailable occasionally.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '계정' : 'Accounts'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '일부 기능은 로그인이 필요할 수 있습니다. 구글로 로그인하는 경우, 계정 보안 유지 및 이 기기에서의 세션 사용 활동에 대한 책임은 사용자에게 있습니다.'
                  : 'Some features may require you to sign in. If you sign in using Google, you are responsible for maintaining the security of your account and for activity that occurs under your session on this device.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '허용되는 이용' : 'Acceptable Use'}
              </h2>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  {lang === 'ko'
                    ? '서비스를 오용하거나 정상적인 운영을 방해하지 마세요.'
                    : 'Do not misuse the Service or interfere with its normal operation.'}
                </li>
                <li>
                  {lang === 'ko'
                    ? '권한 없이 비공개 영역 또는 시스템에 접근하려 시도하지 마세요.'
                    : 'Do not attempt to access non-public areas or systems without authorization.'}
                </li>
                <li>
                  {lang === 'ko'
                    ? '적용 법령 또는 제3자의 권리를 침해하기 위해 서비스를 이용하지 마세요.'
                    : 'Do not use the Service to violate applicable laws or third-party rights.'}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '제3자 서비스 및 링크' : 'Third-Party Services and Links'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '서비스는 구글 인증, 분석 제공자, 지도/지오코딩 제공자 등 제3자 서비스를 통합할 수 있습니다. 해당 서비스의 이용은 각 제3자의 약관 및 정책에 따르며, 당사는 제3자 서비스에 대해 책임을 지지 않습니다.'
                  : 'The Service integrates third-party services (for example: Google authentication, analytics providers, and map/geocoding providers). Your use of those services is subject to their terms and policies, and we are not responsible for third-party services.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '면책' : 'Disclaimers'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '서비스는 “있는 그대로(AS IS)”, “제공 가능한 범위 내(AS AVAILABLE)”로 제공됩니다. 당사는 정확성, 신뢰성, 특정 목적 적합성 등을 포함하여 명시적·묵시적 보증을 제공하지 않습니다.'
                  : 'The Service is provided on an "as is" and "as available" basis. We make no warranties of any kind, express or implied, including warranties of accuracy, reliability, or fitness for a particular purpose.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '책임의 제한' : 'Limitation of Liability'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '법이 허용하는 최대 범위 내에서, 당사는 서비스 이용으로 인해 발생하는 간접적/부수적/특별/결과적/징벌적 손해 또는 데이터/이익/매출 손실에 대해 책임을 지지 않습니다.'
                  : 'To the maximum extent permitted by law, B4K will not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of data, profits, or revenues, arising from your use of the Service.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '종료' : 'Termination'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '서비스, 사용자 보호 또는 법적 요구사항 준수를 위해 필요하다고 판단되는 경우, 당사는 언제든지 서비스 접근을 일시 중단하거나 종료할 수 있습니다.'
                  : 'We may suspend or terminate access to the Service at any time if needed to protect the Service, users, or comply with legal requirements.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                {lang === 'ko' ? '문의' : 'Contact'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko'
                  ? '본 이용약관에 대한 문의는 B4K에서 제공하는 연락 수단을 통해 서비스 운영자에게 연락해 주세요.'
                  : 'If you have questions about these Terms, please contact the Service owner using the contact information provided by B4K.'}
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'ko' ? (
                  <>
                    함께 보기:{' '}
                    <Link className="underline" href="/privacy">
                      개인정보처리방침
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
                    <Link className="underline" href="/privacy">
                      Privacy Policy
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

