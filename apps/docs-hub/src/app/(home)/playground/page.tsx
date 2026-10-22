import type { Metadata } from 'next';

import { JsonLd } from '../../../components/JsonLd';
import { PageBackground } from '../../../components/PageBackground';
import { PlaygroundLoader } from '../../../components/playground/PlaygroundLoader';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/playground';
const TITLE = 'Interactive Web3 Playground';
const DESCRIPTION =
  'Simulate wallet connections, test headless hooks vs Nova UI Kit, and preview real-time transaction tracking.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'TUWA Interactive Web3 Playground',
      description: DESCRIPTION,
      url: `${SITE_URL}${ROUTE}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      isPartOf: { '@id': WEBSITE_ID },
      publisher: ORGANIZATION,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Docs Hub', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Playground', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

/**
 * `/playground`: the Interactive Web3 Playground. The page is static; the Playground itself loads in the browser
 * only, with its TUWA packages (`PlaygroundLoader`).
 */
export default function PlaygroundPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <PageBackground />

      {/* Above the footer (z-10): the fixed Nova toasts of the stage render inside this layer */}
      <div className="relative z-20 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6">
          <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight font-geist-mono uppercase tracking-tight">
              <span className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] bg-clip-text text-transparent">
                {TITLE}
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">{DESCRIPTION}</p>
            <p className="mt-3 text-sm text-[var(--tuwa-text-tertiary)]">
              The real TUWA stores and Nova components run in your browser on simulated wallets and a simulated chain:
              nothing is signed or sent.
            </p>
          </header>
          <PlaygroundLoader />
        </div>
      </div>
    </>
  );
}
