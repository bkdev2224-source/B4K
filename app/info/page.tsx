import PageLayout from '@/components/layout/PageLayout'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

  // Canonicalize old query-param routes.
  if (section === 'privacy') redirect('/privacy')
  if (section === 'terms') redirect('/terms')

  return (
    <PageLayout showSidePanel={true}>
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            B4K Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Learn more about B4K and find important links like our Privacy Policy and Terms.
          </p>

          <div className="space-y-8">
            {section === 'about' && (
              <section id="about">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  About Us
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  B4K helps you explore places, routes, and curated content about Korea. This page
                  is the central place for key information and policy links.
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div>
                    <Link className="underline" href="/privacy">
                      Privacy Policy
                    </Link>
                  </div>
                  <div>
                    <Link className="underline" href="/terms">
                      Terms &amp; Conditions
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

