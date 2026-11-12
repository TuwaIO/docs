import { languageAlternates } from '@tuwaio/docs-ui/locale';
import type { Metadata } from 'next';

import { type LanguagePageProps, localizedJsonLd } from '@/lib/languageMetadata';

import { HeroSection } from '../../../components/HeroSection';
import { EcosystemBoard } from '../../../components/home/EcosystemBoard';
import { HomeFlightPlan } from '../../../components/home/HomeFlightPlan';
import { homeContentClassName, homeFrameClassName } from '../../../components/home/homeLayout';
import { PixelHandoff } from '../../../components/home/PixelHandoff';
import { CrossMark } from '../../../components/home/SectionHead';
import { StageLedgers } from '../../../components/home/StageLedgers';
import { JsonLd } from '../../../components/JsonLd';
import { PageBackground } from '../../../components/PageBackground';
import { QuickStartSection } from '../../../components/QuickStartSection';
import { getReleases } from '../../../lib/github';
import { getPackageDetails } from '../../../lib/packages';
import { ORGANIZATION, SITE_NAME, SITE_URL, TUWA_SUMMARY, WEBSITE_ID } from '../../../lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: languageAlternates('/') },
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
export default async function DocsHubPage({ params }: LanguagePageProps) {
  const { lang } = await params;
  return (
    <>
      <JsonLd data={localizedJsonLd(structuredData, '/', lang)} />
      <PageBackground />
      {/* Outside the page below: its strip lies over the line of the header */}
      <HomeFlightPlan />

      <div className="relative z-10">
        <PixelHandoff />
        {/* The frame of the column: its sides meet the line under the header with a cross and run on into the footer
            (`Footer framed`), so it has no bottom line of its own */}
        <div className={`${homeContentClassName} ${homeFrameClassName}`}>
          <CrossMark x="left" y="top" />
          <CrossMark x="right" y="top" />
          <HeroSection />
          <EcosystemBoard />
          <StageLedgers releases={getReleases()} packages={getPackageDetails()} />
          <QuickStartSection />
        </div>
      </div>
    </>
  );
}
