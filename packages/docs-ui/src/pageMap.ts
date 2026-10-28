import type { PageMapItem } from 'nextra';

type TitledValue = { title?: unknown } & Record<string, unknown>;

/** Options of {@link localizePageMap}. */
export interface LocalizePageMapOptions {
  /**
   * Translated titles by route instead of English title: `<folder>/<name>` (for example `guides/full-stack-react`),
   * then the bare `<name>` (`guides`, `index`). A route title wins over an English title and also replaces the front
   * matter `title`. The docs hub keys its sidebar this way.
   */
  routes?: Readonly<Record<string, string>>;
}

/** The `_meta` value of a page with its title replaced: by its route title, else by its English title. */
function localizeMetaValue(
  value: unknown,
  routeTitle: string | undefined,
  titles: Readonly<Record<string, string>>,
): unknown {
  if (typeof value === 'string') return routeTitle ?? titles[value] ?? value;
  if (!value || typeof value !== 'object' || !('title' in value)) return value;
  const title = (value as TitledValue).title;
  const translated = routeTitle ?? (typeof title === 'string' ? titles[title] : undefined);
  return translated ? { ...(value as TitledValue), title: translated } : value;
}

/** {@link localizePageMap} for the items of one folder, `parent` being the route of that folder. */
function localizeItems(
  items: PageMapItem[],
  titles: Readonly<Record<string, string>>,
  routes: Readonly<Record<string, string>>,
  parent?: string,
): PageMapItem[] {
  const routeTitle = (name: string) => routes[parent ? `${parent}/${name}` : name] ?? routes[name];
  return items.map((item) => {
    if ('data' in item) {
      const data = Object.fromEntries(
        Object.entries(item.data).map(([key, value]) => [key, localizeMetaValue(value, routeTitle(key), titles)]),
      );
      return { ...item, data } as PageMapItem;
    }
    const copy: Record<string, unknown> = { ...item };
    const name = (item as { name?: unknown }).name;
    const route = typeof name === 'string' ? (parent ? `${parent}/${name}` : name) : parent;
    const byRoute = typeof name === 'string' ? routeTitle(name) : undefined;
    // `getPageMap()` also copies the `_meta` title onto each item as `title`, which the sidebar reads
    const title = (item as { title?: unknown }).title;
    if (byRoute) copy.title = byRoute;
    else if (typeof title === 'string' && titles[title]) copy.title = titles[title];
    if ('frontMatter' in item && item.frontMatter) {
      const frontTitle = item.frontMatter.title;
      const translated = byRoute ?? (typeof frontTitle === 'string' ? titles[frontTitle] : undefined);
      if (translated) copy.frontMatter = { ...item.frontMatter, title: translated };
    }
    if ('children' in item && Array.isArray(item.children)) {
      copy.children = localizeItems(item.children, titles, routes, route);
    }
    return copy as PageMapItem;
  });
}

/**
 * Translates the titles of a Nextra page map: the sidebar, the top-level menu, the breadcrumbs and the previous / next
 * links all read them. The project sites match titles by their English text (the `_meta` titles, the `title` of each
 * item and the front matter `title`), so a site lists each English title once, whatever the page; titles without a
 * translation, such as package names, stay as they are. The docs hub matches them by route instead
 * (`options.routes`). The page map is not modified: changed items are copied.
 *
 * @example
 * ```ts
 * localizePageMap(pageMap, { Introduction: 'Вступ', Packages: 'Пакети' });
 * localizePageMap(pageMap, {}, { routes: { guides: 'Посібники', 'guides/starter-templates': 'Стартові шаблони' } });
 * ```
 *
 * @param pageMap - The page map of the site, the result of `getPageMap()` of `nextra/page-map`.
 * @param titles - Translated titles by English title.
 * @param options - See {@link LocalizePageMapOptions}.
 * @returns The page map with translated titles, or `pageMap` itself when there is nothing to translate.
 */
export function localizePageMap(
  pageMap: PageMapItem[],
  titles: Readonly<Record<string, string>>,
  options: LocalizePageMapOptions = {},
): PageMapItem[] {
  const routes = options.routes ?? {};
  if (Object.keys(titles).length === 0 && Object.keys(routes).length === 0) return pageMap;
  return localizeItems(pageMap, titles, routes);
}
