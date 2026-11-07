import type { PageMapItem } from 'nextra';

import { localizedPath, type TuwaLocale } from './locale';

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

/**
 * The routes of a page map in a language, for a page at its language URL: Nextra finds the active page and the sidebar by
 * comparing these routes with the URL. The page map is not modified: changed items are copied.
 *
 * @param items - The page map.
 * @param locale - The language of the URL.
 * @param hasLanguageUrl - Whether a route without a language has a language URL: the others keep their route.
 * @returns The page map with the routes of that language.
 */
export function prefixPageMapRoutes(
  items: PageMapItem[],
  locale: TuwaLocale,
  hasLanguageUrl: (route: string) => boolean,
): PageMapItem[] {
  const inLanguage = <T>(path: T): T | string =>
    typeof path === 'string' && path.startsWith('/') && hasLanguageUrl(path.split(/[?#]/)[0] ?? '')
      ? localizedPath(path, locale)
      : path;
  // `getPageMap()` keeps the `href` of a `_meta` entry in `data` and copies it onto a flat item, which may have no route
  const withHref = <T extends object>(value: T): T =>
    'href' in value ? { ...value, href: inLanguage(value.href) } : value;

  return items.map((item) => {
    if ('data' in item) {
      const entries = Object.entries(item.data).map(([name, entry]) => [
        name,
        entry && typeof entry === 'object' ? withHref(entry as object) : entry,
      ]);
      return { ...item, data: Object.fromEntries(entries) } as PageMapItem;
    }
    const copy = { ...withHref(item), ...('route' in item && { route: inLanguage(item.route) }) };
    if ('children' in copy && copy.children) copy.children = prefixPageMapRoutes(copy.children, locale, hasLanguageUrl);
    return copy as PageMapItem;
  });
}
