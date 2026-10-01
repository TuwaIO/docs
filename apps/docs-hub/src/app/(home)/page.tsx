import { StarryBackground } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';

import { HeroSection } from '../../components/HeroSection';
import { JsonLd } from '../../components/JsonLd';
import { LayerTimeline } from '../../components/LayerTimeline';
import { QuickStartSection } from '../../components/QuickStartSection';
import { getReleases } from '../../lib/github';
import { getPackageDetails } from '../../lib/packages';
import { ORGANIZATION, SITE_NAME, SITE_URL, TUWA_SUMMARY, WEBSITE_ID } from '../../lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// The hub as a website of the TUWA organization, for search engines
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: TUWA_SUMMARY,
      inLanguage: 'en',
      publisher: { '@id': ORGANIZATION['@id'] },
    },
    ORGANIZATION,
  ],
};

/**
 * Docs Hub main page — StarryBackground on desktop, decorative orbs on mobile.
 */
export default function DocsHubPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="hidden md:block">
        <StarryBackground />
      </div>

      {/* Mobile-only decorative background — soft brand-colored orbs */}
      <div aria-hidden className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-[var(--tuwa-button-gradient-from)]/15 to-[var(--tuwa-button-gradient-to)]/8 blur-2xl" />
        <div className="absolute top-1/3 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/12 to-fuchsia-500/6 blur-2xl" />
        <div className="absolute bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-tl from-cyan-500/12 to-emerald-500/6 blur-2xl" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-2 sm:px-6">
          <HeroSection />
          <LayerTimeline releases={getReleases()} packages={getPackageDetails()} />
          <QuickStartSection />
        </div>
      </div>
    </>
  );
}
