import type { MetadataRoute } from 'next';

import { getHubPages } from '@/lib/hubPages';
import { SITE_URL } from '@/lib/site';

/**
 * `/sitemap.xml`: the main page and every MDX page of the hub, built at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getHubPages();
  return [{ url: SITE_URL }, ...pages.map((page) => ({ url: `${SITE_URL}${page.route}` }))];
}
