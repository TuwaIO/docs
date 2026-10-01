import { StarryBackground } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';

import { StackConfigurator } from '../../../components/configurator/StackConfigurator';
import { JsonLd } from '../../../components/JsonLd';
import { allStackOptions } from '../../../lib/configurator/generate';
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
      <div className="hidden md:block">
        <StarryBackground />
      </div>
      <div aria-hidden className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-[var(--tuwa-button-gradient-from)]/15 to-[var(--tuwa-button-gradient-to)]/8 blur-2xl" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6">
          <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight font-geist-mono uppercase tracking-tight">
              <span className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] bg-clip-text text-transparent">
                Stack Configurator
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
              Pick your framework, chains and features. Get the install command, every setup file and the closest
              starter template. Each of the {allStackOptions().length} stacks is type-checked against the published
              packages.
            </p>
          </header>
          <StackConfigurator />
        </div>
      </div>
    </>
  );
}
