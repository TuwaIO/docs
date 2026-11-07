import type { Metadata } from 'next';

import { ConfiguratorHeader, StackConfigurator } from '../../../components/configurator/StackConfigurator';
import { JsonLd } from '../../../components/JsonLd';
import { PageBackground } from '../../../components/PageBackground';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/configurator';
const TITLE = 'Stack Configurator: Set Up TUWA in Your App';
const DESCRIPTION =
  'Pick Next.js, Vite or Vanilla TS, EVM or Solana, Nova UI or headless, SIWX and Quasar: get the install command, the setup files and a starter template.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'TUWA Stack Configurator',
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
        { '@type': 'ListItem', position: 2, name: 'Configurator', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

/**
 * `/configurator`: the Stack Configurator. The page is static; the options are read from the query string in the
 * browser. The generated stacks are type-checked by `tools/configurator-check`.
 */
export default function ConfiguratorPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <PageBackground />

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6">
          <ConfiguratorHeader />
          <StackConfigurator />
        </div>
      </div>
    </>
  );
}
