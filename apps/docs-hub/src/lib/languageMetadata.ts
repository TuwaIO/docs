import { localizedPath, normalizeLocale, type TuwaLocale } from '@tuwaio/docs-ui/locale';
import type { Metadata } from 'next';

import { uk } from '../i18n/locales/uk';
import { zhCN } from '../i18n/locales/zhCN';
import { PAGE_METADATA } from '../i18n/pageMetadata';
import { SITE_URL, withPageMetadata } from './site';

/** What a page of the hub gets from its route: the language of the URL, none on an English page. */
export type LanguagePageProps = { params: Promise<{ lang?: string }> };

const NEXTRA_TEXTS: Partial<Record<TuwaLocale, typeof uk.nextra>> = { uk: uk.nextra, 'zh-CN': zhCN.nextra };

/**
 * The title and the description of a page in a language: from `PAGE_METADATA` for a page without an MDX file, from the titles of
 * the sidebar and the descriptions of the dictionaries for an MDX page. What has no translation stays English.
 *
 * @param route - The route without a language.
 * @param locale - The language.
 * @param metadata - The metadata of the English page.
 * @returns The metadata with the texts of the language.
 */
export function languageTexts<T extends { title?: unknown; description?: unknown }>(
  route: string,
  locale: TuwaLocale,
  metadata: T,
): T {
  const page = PAGE_METADATA[locale]?.[route];
  if (page) return { ...metadata, ...page };
  const texts = NEXTRA_TEXTS[locale];
  const key = route.slice(1);
  const title =
    key === 'guides'
      ? texts?.guidesOverview.title
      : (texts?.sidebar[key] ?? texts?.sidebar[route.split('/').at(-1) ?? '']);
  const description = texts?.pageDescriptions[key] ?? texts?.pageDescriptions[`${key}/index`];
  return { ...metadata, ...(title && { title }), ...(description && { description }) };
}

/**
 * The `generateMetadata` of a page at its language URL, from the metadata of its English page.
 *
 * @param metadata - The metadata of the English page.
 * @param route - The route without a language.
 * @returns The function for the route.
 */
export function languageMetadata(metadata: Metadata, route: string) {
  return async ({ params }: LanguagePageProps): Promise<Metadata> => {
    const locale = normalizeLocale((await params).lang) ?? 'en';
    return withPageMetadata(languageTexts(route, locale, metadata), localizedPath(route, locale));
  };
}

/**
 * Structured data of a page in the language of its URL: the language, the URLs of the page, and the name and the description of
 * the node of the page.
 *
 * @param data - The structured data of the English page.
 * @param route - The route without a language.
 * @param lang - The language of the URL; none leaves the data as it is.
 * @returns The data for `JsonLd`.
 */
export function localizedJsonLd<T>(data: T, route: string, lang?: string): T {
  const locale = normalizeLocale(lang);
  if (!locale || locale === 'en') return data;
  const page = route === '/' ? SITE_URL : `${SITE_URL}${route}`;
  const url = `${SITE_URL}${localizedPath(route, locale)}`;
  const texts = PAGE_METADATA[locale]?.[route];
  return JSON.parse(
    JSON.stringify(data)
      .replaceAll('"inLanguage":"en"', `"inLanguage":"${locale}"`)
      .replaceAll(`"${page}"`, `"${url}"`),
    (_key, value: unknown) => {
      if (!texts || typeof value !== 'object' || value === null || (value as { url?: unknown }).url !== url)
        return value;
      return { ...value, name: texts.title, description: texts.description };
    },
  ) as T;
}
