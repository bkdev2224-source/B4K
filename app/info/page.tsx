import PageLayout from '@/components/layout/PageLayout'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

type InfoPageProps = {
  searchParams?: {
    section?: string
  }
}

export const metadata: Metadata = {
  title: 'Info | B4K',
  description: 'About B4K and important information for using the service.',
}

export default function InfoPage({ searchParams }: InfoPageProps) {
  const section = (searchParams?.section || 'about') as 'about' | 'privacy' | 'terms'
  const lang = cookies().get('language')?.value === 'ko' ? 'ko' : 'en'

  // Canonicalize old query-param routes.
  if (section === 'privacy') redirect('/privacy')
  if (section === 'terms') redirect('/terms')

  const t =
    lang === 'ko'
      ? {
          title: 'B4K 정보',
          desc: 'B4K에 대해 더 알아보고 개인정보처리방침 및 이용약관 등 중요한 링크를 확인하세요.',
          aboutTitle: '소개',
          aboutBody:
            'B4K는 한국의 장소, 여행 루트, 큐레이션 콘텐츠를 탐색할 수 있도록 도와줍니다. 이 페이지는 핵심 정보와 정책 링크를 모아둔 안내 페이지입니다.',
          privacy: '개인정보처리방침',
          terms: '이용약관',
        }
      : {
          title: 'B4K Information',
          desc: 'Learn more about B4K and find important links like our Privacy Policy and Terms.',
          aboutTitle: 'About Us',
          aboutBody:
            'B4K helps you explore places, routes, and curated content about Korea. This page is the central place for key information and policy links.',
          privacy: 'Privacy Policy',
          terms: 'Terms & Conditions',
        }

  return (
    <PageLayout showSidePanel={true}>
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            {t.desc}
          </p>

          <div className="space-y-8">
            {section === 'about' && (
              <section id="about">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t.aboutTitle}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.aboutBody}
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div>
                    <Link className="underline" href="/privacy">
                      {t.privacy}
                    </Link>
                  </div>
                  <div>
                    <Link className="underline" href="/terms">
                      {t.terms}
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

