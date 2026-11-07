'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {
  DEFAULT_LOCALE,
  localeOfPath,
  localizedPath,
  normalizeLocale,
  pathWithoutLocale,
  type TuwaLocale,
} from './locale';

/** What {@link useLocaleRouting} needs. */
export interface LocaleRoutingOptions {
  /** The language shown. */
  locale: TuwaLocale;
  /**
   * Saves the choice of language (`setLocale` of the provider).
   *
   * @param locale - The language picked.
   */
  setLocale: (locale: TuwaLocale) => void;
  /** Whether the provider has read the language of the reader. */
  resolved: boolean;
  /**
   * Whether a page has its translations at their own URLs.
   *
   * @param route - The route without a language.
   * @returns Whether it has.
   */
  hasLanguageUrl: (route: string) => boolean;
}

/**
 * Keeps the language of a reader and the URL together, on the pages that have language URLs: picking a language goes to its URL,
 * and a reader whose language is not English, who opens the English URL of such a page, is taken to the URL of that language.
 * Search engines have no saved language and a browser in English, so they stay on the URL they asked for.
 *
 * Side effects: navigates; the provider saves the choice.
 *
 * @param options - See {@link LocaleRoutingOptions}.
 * @returns The function to call with the language the reader picks.
 */
export function useLocaleRouting({ locale, setLocale, resolved, hasLanguageUrl }: LocaleRoutingOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const base = pathWithoutLocale(pathname);
  const onLanguageUrl = Boolean(localeOfPath(pathname));

  useEffect(() => {
    if (onLanguageUrl || !resolved || locale === DEFAULT_LOCALE || !hasLanguageUrl(base)) return;
    // Coming from another language of this page, the reader just picked English: with blocked storage the choice is not saved
    const from = document.referrer ? new URL(document.referrer).pathname : '';
    if (from !== base && pathWithoutLocale(from) === base) return;
    router.replace(`${localizedPath(base, locale)}${window.location.search}${window.location.hash}`);
  }, [base, hasLanguageUrl, locale, onLanguageUrl, resolved, router]);

  return (target: string) => {
    const picked = normalizeLocale(target);
    if (!picked) return;
    setLocale(picked);
    // The query and the anchor stay: a shared link of the configurator keeps its stack in the query
    if (hasLanguageUrl(base))
      router.push(`${localizedPath(base, picked)}${window.location.search}${window.location.hash}`);
  };
}
