import type { Metadata } from 'next';

import { HeroSection } from '../../components/HeroSection';
import { JsonLd } from '../../components/JsonLd';
import { LayerTimeline } from '../../components/LayerTimeline';
import { PageBackground } from '../../components/PageBackground';
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
 * Docs Hub main page, on the background of the hub pages (`PageBackground`).
 */
export default function DocsHubPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <PageBackground />

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
