import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getPageMap, normalizePageMap } from 'nextra/page-map';

/** The MDX sections of the hub (`src/content/<id>`), in the order of the navbar */
export const HUB_SECTIONS = [
  { id: 'guides', title: 'Guides' },
  { id: 'quasar', title: 'Quasar' },
] as const;

/**
 * An MDX page of the hub.
 */
export interface HubPage {
  /** Path of the page, for example `/guides/full-stack-react` (a section overview is `/guides`) */
  route: string;
  /** Section of the page */
  section: (typeof HUB_SECTIONS)[number];
  /** Title from the front matter */
  title: string;
  /** Description from the front matter */
  description?: string;
}

/**
 * The MDX pages of every section, in the order of the sidebar (`_meta.tsx`), from the page map of Nextra. Links in
 * the sidebar to other sites and separators are left out. For build-time code: the sitemap and llms.txt.
 *
 * @returns The pages, the overview of each section first.
 */
export async function getHubPages(): Promise<HubPage[]> {
  const pages: HubPage[] = [];
  for (const section of HUB_SECTIONS) {
    for (const item of normalizePageMap(await getPageMap(`/${section.id}`))) {
      if (!('route' in item) || !('frontMatter' in item) || 'children' in item) continue;
      const { title, description } = (item.frontMatter ?? {}) as { title?: string; description?: string };
      pages.push({ route: item.route, section, title: title ?? item.name, description });
    }
  }
  return pages;
}

/**
 * Reads the MDX source of a page from `src/content`. For build-time code only: the source files are not deployed.
 *
 * @param route - Path of the page.
 * @returns The source of `<route>.mdx`, or of `<route>/index.mdx` for a section overview.
 */
export async function readPageSource(route: string): Promise<string> {
  const base = path.join(process.cwd(), 'src', 'content', ...route.split('/').filter(Boolean));
  return readFile(`${base}.mdx`, 'utf8').catch(() => readFile(path.join(base, 'index.mdx'), 'utf8'));
}
