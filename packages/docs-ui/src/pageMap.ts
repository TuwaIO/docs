import type { PageMapItem } from 'nextra';

type TitledValue = { title?: unknown } & Record<string, unknown>;

/** The `_meta` value of a page with its title replaced, when the value has a text title. */
function localizeMetaValue(value: unknown, titles: Readonly<Record<string, string>>): unknown {
  if (typeof value === 'string') return titles[value] ?? value;
  if (value && typeof value === 'object' && typeof (value as TitledValue).title === 'string') {
    const translated = titles[(value as TitledValue).title as string];
    return translated ? { ...(value as TitledValue), title: translated } : value;
  }
  return value;
}

/**
 * Translates the titles of a Nextra page map: the sidebar, the top-level menu, the breadcrumbs and the previous / next
 * links all read them. Titles are matched by their English text (the `_meta` titles, the `title` of each item and the
 * front matter `title`), so a site lists each English title once, whatever the page; titles without a translation,
 * such as package names, stay as they are. The page map is not modified: changed items are copied.
 *
 * @example
 * ```ts
 * localizePageMap(pageMap, { Introduction: 'Вступ', Packages: 'Пакети' });
 * ```
 *
 * @param pageMap - The page map of the site, the result of `getPageMap()` of `nextra/page-map`.
 * @param titles - Translated titles by English title.
 * @returns The page map with translated titles.
 */
export function localizePageMap(pageMap: PageMapItem[], titles: Readonly<Record<string, string>>): PageMapItem[] {
  if (Object.keys(titles).length === 0) return pageMap;
  return pageMap.map((item) => {
    if ('data' in item) {
      const data = Object.fromEntries(
        Object.entries(item.data).map(([key, value]) => [key, localizeMetaValue(value, titles)]),
      );
      return { ...item, data } as PageMapItem;
    }
    const copy: Record<string, unknown> = { ...item };
    // `getPageMap()` also copies the `_meta` title onto each item as `title`, which the sidebar reads
    const title = (item as { title?: unknown }).title;
    if (typeof title === 'string' && titles[title]) copy.title = titles[title];
    if ('frontMatter' in item && item.frontMatter && typeof item.frontMatter.title === 'string') {
      const title = titles[item.frontMatter.title];
      if (title) copy.frontMatter = { ...item.frontMatter, title };
    }
    if ('children' in item && Array.isArray(item.children)) copy.children = localizePageMap(item.children, titles);
    return copy as PageMapItem;
  });
}
