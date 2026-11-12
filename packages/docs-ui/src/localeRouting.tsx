'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { addressWithoutAnchor, dropAnchor } from './anchor';
import {
  DEFAULT_LOCALE,
  localeOfPath,
  localizedPath,
  normalizeLocale,
  pathWithoutLocale,
  type TuwaLocale,
} from './locale';

/** Ends the crossfade of a language change, once the page in the new language is rendered. */
let finishLanguageChange: (() => void) | undefined;

/**
 * Runs a change of language with a short crossfade of the page where the browser has view transitions (none for
 * reduced motion): the languages are separate root layouts, so the page is rendered anew, and the crossfade keeps the
 * change smooth while the flag of the language switch changes on the new page. It waits for the new page at most
 * 1.5 s; without view transitions the change just happens.
 *
 * @param change - Saves the language and goes to its URL.
 * @internal
 */
export function changeSmoothly(change: () => void) {
  if (!('startViewTransition' in document) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    change();
    return;
  }
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const finish = () => {
          clearTimeout(timer);
          finishLanguageChange = undefined;
          resolve();
        };
        const timer = setTimeout(finish, 1500);
        finishLanguageChange = finish;
        change();
      }),
  );
  // The browser skips the crossfade when the change loads another root layout (a new document, which crossfades by
  // the `@view-transition` rule of `site.css`) or another transition starts; nothing waits for it, so it is let go
  transition.ready.catch(() => {});
}

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
 * Side effects: navigates, with a short crossfade of the page where the browser has view transitions, to the page in the
 * picked language without the anchor of the current address (a page without language URLs drops the anchor and scrolls
 * to its top); the provider saves the choice.
 *
 * @param options - See {@link LocaleRoutingOptions}.
 * @returns The function to call with the language the reader picks.
 */
export function useLocaleRouting({ locale, setLocale, resolved, hasLanguageUrl }: LocaleRoutingOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const base = pathWithoutLocale(pathname);
  const onLanguageUrl = Boolean(localeOfPath(pathname));

  // The page in the new language is rendered (on a new root layout, or on the same one): the crossfade can run
  useEffect(() => {
    finishLanguageChange?.();
  }, [pathname]);

  useEffect(() => {
    if (onLanguageUrl || !resolved || locale === DEFAULT_LOCALE || !hasLanguageUrl(base)) return;
    // Coming from another language of this page, the reader just picked English: with blocked storage the choice is not saved
    const from = document.referrer ? new URL(document.referrer).pathname : '';
    if (from !== base && pathWithoutLocale(from) === base) return;
    router.replace(`${localizedPath(base, locale)}${window.location.search}${window.location.hash}`);
  }, [base, hasLanguageUrl, locale, onLanguageUrl, resolved, router]);

  // A language the reader picks opens the page anew, from its top: the anchor a link of the page opened goes (it took
  // the page in the new language back to that part), the query stays (a shared link of the configurator keeps its stack
  // in it). The redirect above keeps the anchor: there the reader came by a link to that part
  return (target: string) => {
    const picked = normalizeLocale(target);
    if (!picked) return;
    if (!hasLanguageUrl(base)) {
      dropAnchor();
      setLocale(picked);
      window.scrollTo(0, 0);
      return;
    }
    changeSmoothly(() => {
      setLocale(picked);
      router.push(addressWithoutAnchor({ pathname: localizedPath(base, picked), search: window.location.search }));
    });
  };
}
