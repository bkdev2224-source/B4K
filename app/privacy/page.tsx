import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | B4K',
  description: 'Privacy Policy describing how B4K collects, uses, and shares data.',
}

export default function PrivacyPolicyPage() {
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: 2026-02-02
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Privacy Policy explains what information B4K collects, how we use it, and
                the choices you have when using the B4K website and services (the &quot;Service&quot;).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Account information (Google sign-in)
                  </h3>
                  <p>
                    If you sign in with Google, we receive basic profile information such as your
                    name, email address, and profile image. We use this to create and maintain your
                    signed-in session.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Usage and interaction data
                  </h3>
                  <p>
                    When analytics are enabled, we may collect information about how you use the
                    Service (for example: pages you visit and certain in-app events such as search
                    actions and content/POI views).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Local device storage
                  </h3>
                  <p>
                    The Service stores some preferences and client-side state in your browser&apos;s
                    local storage, such as your theme preference and cart items (e.g. saved POIs).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Cookies and Similar Technologies</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use cookies and similar technologies for core functionality such as maintaining
                your authenticated session. If analytics are enabled, third-party analytics tools
                may also set cookies or use similar identifiers as described below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Authentication (Google)
                  </h3>
                  <p>
                    We use Google OAuth (via NextAuth) to allow you to sign in. Google&apos;s handling
                    of your data is governed by Google&apos;s own policies.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Analytics (GA4 and Microsoft Clarity)
                  </h3>
                  <p>
                    If enabled by configuration, we use Google Analytics 4 (GA4) and Microsoft
                    Clarity to understand usage patterns and improve the Service. These tools may
                    collect information about your device and interactions with the Service.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Maps and geocoding (Naver Maps)
                  </h3>
                  <p>
                    The Service uses Naver Maps. When map features are used, addresses may be sent
                    to Naver&apos;s geocoding services to convert them into coordinates for display.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    External images
                  </h3>
                  <p>
                    Some pages may load images from third-party hosts (for example, placeholder
                    images). Your browser will request those images directly from the host.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  You can sign out at any time to end your authenticated session.
                </li>
                <li>
                  You can clear site data in your browser to remove locally stored preferences and
                  cart items.
                </li>
                <li>
                  If an analytics consent prompt is enabled on your deployment, you can accept or
                  decline analytics tracking. You can manage your cookie preferences at any time by visiting our{' '}
                  <Link className="underline" href="/cookie-settings">
                    Cookie Settings
                  </Link>{' '}
                  page.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you have questions about this Privacy Policy, please contact the Service owner
                using the contact information provided by B4K.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Also see:{' '}
                <Link className="underline" href="/terms">
                  Terms &amp; Conditions
                </Link>
                {' '}and{' '}
                <Link className="underline" href="/info">
                  Info
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

