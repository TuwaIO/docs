import type { Metadata } from 'next';

import { ComparisonsContent } from '../../../components/comparisons/ComparisonsContent';
import { JsonLd } from '../../../components/JsonLd';
import { PageBackground } from '../../../components/PageBackground';
import { COMPETITORS, verifiedAsOf } from '../../../lib/comparisons';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/comparisons';
const TITLE = 'TUWA vs RainbowKit, Privy, Dynamic, thirdweb & More';
const DESCRIPTION =
  'How TUWA compares with RainbowKit, ConnectKit, AppKit, Privy, Dynamic, thirdweb, Alchemy and The Graph on custody, openness and cost, with sources.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${ROUTE}`,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      author: ORGANIZATION,
      publisher: ORGANIZATION,
      dateModified: verifiedAsOf(),
      about: COMPETITORS.map((product) => ({ '@type': 'SoftwareApplication', name: product.name, url: product.url })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Docs Hub', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Comparisons', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

/**
 * `/comparisons`: TUWA against eight products on six axes, with the radar, every criterion with its source, when to
 * choose each product instead, and the methodology. The data is `src/lib/comparisons.ts`.
 */
export default function ComparisonsPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <PageBackground />
      <ComparisonsContent />
    </>
  );
}
