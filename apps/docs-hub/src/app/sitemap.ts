import { localizedPath, TUWA_LOCALES } from '@tuwaio/docs-ui/locale';
import type { MetadataRoute } from 'next';

import { getHubPages } from '@/lib/hubPages';
import { SITE_URL } from '@/lib/site';

/**
 * `/sitemap.xml`: the main page, `/comparisons`, `/configurator`, `/playground`, `/policies` and every MDX page of the hub, built at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getHubPages();
  const routes = ['/', '/comparisons', '/configurator', '/playground', '/policies', ...pages.map((page) => page.route)];
  return routes.flatMap((route) =>
    TUWA_LOCALES.map((locale) => ({ url: `${SITE_URL}${localizedPath(route, locale).replace(/^\/$/, '')}` })),
  );
}
