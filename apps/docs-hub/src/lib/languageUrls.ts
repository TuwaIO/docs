import { DEFAULT_LOCALE, localizedPath, type TuwaLocale } from '@tuwaio/docs-ui/locale';

const SECTIONS = ['/guides', '/quasar', '/comparisons', '/configurator', '/playground', '/policies'];

/**
 * Whether a route of the hub has its translations at their own URLs (`/uk/quasar/webhooks`): every page does, not the files next
 * to them (`/llms.txt`, `/quasar-openapi.yaml`).
 *
 * @param route - The route without a language, such as `/quasar/webhooks`.
 * @returns Whether it has language URLs.
 */
export const hasLanguageUrl = (route: string): boolean =>
  route === '/' || SECTIONS.some((section) => route === section || route.startsWith(`${section}/`));

/**
 * The internal path of a link in a language.
 *
 * @param href - The path in English.
 * @param locale - The language of the reader.
 * @returns The path to link to.
 */
export function hrefInLanguage(href: string, locale: TuwaLocale): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith('/') || !hasLanguageUrl(href.split(/[?#]/)[0] ?? '')) return href;
  return localizedPath(href, locale);
}
