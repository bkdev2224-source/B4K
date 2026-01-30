import PageLayout from '@/components/layout/PageLayout'
import Link from 'next/link'

type InfoPageProps = {
  searchParams?: {
    section?: string
  }
}

export default function InfoPage({ searchParams }: InfoPageProps) {
  const section = (searchParams?.section || 'about') as 'about' | 'privacy' | 'terms'

  return (
    <PageLayout showSidePanel={true}>
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            B4K Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Learn more about B4K, how we handle your data, and the terms that apply when you
            use this service.
          </p>

          <div className="space-y-8">
            {section === 'about' && (
              <section id="about">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  About Us
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This page will contain details about the B4K project, its purpose, and how to
                  get in touch. You can expand this section with your own content.
                </p>
              </section>
            )}

            {section === 'privacy' && (
              <section id="privacy">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Privacy Policy
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Describe how you collect, use, and store personal data. You can move your full
                  privacy policy text here or link out to a dedicated document.
                </p>
              </section>
            )}

            {section === 'terms' && (
              <section id="terms">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Terms &amp; Conditions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Outline the conditions under which users may use B4K, including limitations of
                  liability, user responsibilities, and other legal details.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

