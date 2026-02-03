import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'Terms & Conditions | B4K',
  description: 'Terms and conditions governing use of the B4K service.',
}

export default function TermsPage() {
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <section className="w-full py-12 md:py-16">
        <div className="px-6 max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: 2026-02-02
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-2">Acceptance of These Terms</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By accessing or using B4K (the &quot;Service&quot;), you agree to these Terms &amp;
                Conditions. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">The Service</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                B4K provides content and tools for exploring places, routes, and related travel
                information. The Service may change over time and may be unavailable occasionally.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Accounts</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Some features may require you to sign in. If you sign in using Google, you are
                responsible for maintaining the security of your account and for activity that
                occurs under your session on this device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Acceptable Use</h2>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Do not misuse the Service or interfere with its normal operation.</li>
                <li>Do not attempt to access non-public areas or systems without authorization.</li>
                <li>Do not use the Service to violate applicable laws or third-party rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Third-Party Services and Links</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The Service integrates third-party services (for example: Google authentication,
                analytics providers, and map/geocoding providers). Your use of those services is
                subject to their terms and policies, and we are not responsible for third-party
                services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Disclaimers</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
                We make no warranties of any kind, express or implied, including warranties of
                accuracy, reliability, or fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To the maximum extent permitted by law, B4K will not be liable for indirect,
                incidental, special, consequential, or punitive damages, or any loss of data,
                profits, or revenues, arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Termination</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We may suspend or terminate access to the Service at any time if needed to protect
                the Service, users, or comply with legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you have questions about these Terms, please contact the Service owner using
                the contact information provided by B4K.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Also see:{' '}
                <Link className="underline" href="/privacy">
                  Privacy Policy
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

