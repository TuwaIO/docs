import type { MetadataRoute } from 'next';

import { getHubPages } from '@/lib/hubPages';
import { SITE_URL } from '@/lib/site';

/**
 * `/sitemap.xml`: the main page, `/comparisons`, `/configurator`, `/playground` and every MDX page of the hub, built at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getHubPages();
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/comparisons` },
    { url: `${SITE_URL}/configurator` },
    { url: `${SITE_URL}/playground` },
    ...pages.map((page) => ({ url: `${SITE_URL}${page.route}` })),
  ];
}
