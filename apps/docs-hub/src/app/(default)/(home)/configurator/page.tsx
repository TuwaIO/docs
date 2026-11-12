import type { Metadata } from 'next';

import { type LanguagePageProps, localizedJsonLd } from '@/lib/languageMetadata';

import { ConfiguratorHeader, StackConfigurator } from '../../../../components/configurator/StackConfigurator';
import { homeContentClassName, homeFrameClassName } from '../../../../components/home/homeLayout';
import { CrossMark } from '../../../../components/home/SectionHead';
import { JsonLd } from '../../../../components/JsonLd';
import { PageBackground } from '../../../../components/PageBackground';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../../lib/site';

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
      inLanguage: 'en',
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
export default async function ConfiguratorPage({ params }: LanguagePageProps) {
  const { lang } = await params;
  return (
    <>
      <JsonLd data={localizedJsonLd(structuredData, '/configurator', lang)} />
      <PageBackground />

      <div className="relative z-10">
        {/* The frame of the column, as on the main page: its sides run on into the footer */}
        <div className={`${homeContentClassName} ${homeFrameClassName}`}>
          <CrossMark x="left" y="top" />
          <CrossMark x="right" y="top" />
          <ConfiguratorHeader />
          <StackConfigurator />
        </div>
      </div>
    </>
  );
}
