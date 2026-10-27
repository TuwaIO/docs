import { getPolicyPageUrl, loadPolicy, type Policy, publishedPolicies } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';

import { JsonLd } from '../../../components/JsonLd';
import { PageBackground } from '../../../components/PageBackground';
import { PoliciesContent } from '../../../components/PoliciesContent';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/policies';
const TITLE = 'TUWA Policies: Terms, Privacy and More';
const DESCRIPTION =
  'The terms and policies of the TUWA ecosystem — the websites and documentation, Quasar Cloud, Quasar Community Edition and the open-source packages — with the official PDFs.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${ROUTE}`,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: ORGANIZATION,
      hasPart: publishedPolicies.map((policy) => ({
        '@type': 'WebPage',
        name: policy.title,
        url: getPolicyPageUrl(policy.slug),
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Docs Hub', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Policies', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

// The date of the version, read at build time. Without it the card shows no date: a warning, not an error, because
// the dev overlay of Next.js reports every console.error
async function versionDate(policy: Policy): Promise<string | undefined> {
  try {
    return (await loadPolicy(policy.slug, { revalidate: false })).updated;
  } catch (error) {
    console.warn(`/policies: no date for ${policy.slug} (${error instanceof Error ? error.message : String(error)})`);
    return undefined;
  }
}

/**
 * `/policies`: every published TUWA policy (`publishedPolicies` of `@tuwaio/docs-ui`), each with what it covers, the
 * date of its version and links to its page on tuwa.io and its PDF. A policy that is not in force, such as the Refund
 * Policy while Quota purchases are paused, is not listed. Then where to report a vulnerability and ask legal
 * questions. The dates are read at build time.
 */
export default async function PoliciesPage() {
  const dates = await Promise.all(publishedPolicies.map(versionDate));

  return (
    <>
      <JsonLd data={structuredData} />
      <PageBackground />
      <PoliciesContent dates={dates} />
    </>
  );
}
