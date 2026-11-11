'use client';

import type { PageMapItem } from 'nextra';
import { Search } from 'nextra/components';
import { LastUpdated, Layout } from 'nextra-theme-docs';
import { type ComponentProps, type ReactNode, useCallback, useMemo } from 'react';

import { DocsI18nProvider, useDocsI18n } from '../docsI18n';
import type { DocsLabels } from '../docsLabels';
import { localizedPath, normalizeLocale, policyLanguageOf, type TuwaLocale } from '../locale';
import { useLocaleRouting } from '../localeRouting';
import { localizePageMap, prefixPageMapRoutes } from '../pageMap';
import { type SocialLink } from '../utils';
import { Footer } from './Footer';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Navbar } from './NavBar';
import { NavbarThemeSwitch } from './NavbarThemeSwitch';

/**
 * Props of {@link DocsLayout}.
 */
export interface DocsLayoutProps {
  /** Logo of the site, for example `SiteLogo`; rendered in the navbar and the footer. */
  logo: ReactNode;
  /** External links of the navbar (default: `baseNavLinks`). */
  links?: SocialLink[];
  /** External links of the footer (default: `baseFooterLinks`). */
  footerLinks?: SocialLink[];
  /** The page map of the site, the result of `getPageMap()` of `nextra/page-map`. */
  pageMap: PageMapItem[];
  /** URL of the docs app in the repository, for the edit links (`https://github.com/TuwaIO/<repo>/tree/main/apps/docs`). */
  docsRepositoryBase: string;
  /**
   * Sidebar titles of the site's own pages, by language and English title (for example `{ uk: { 'EVM Trackers
   * Standalone': '…' } }`). `Introduction`, `Packages`, `Guides` and `Overview` are translated already.
   */
  sidebarTitles?: Partial<Record<Exclude<TuwaLocale, 'en'>, Record<string, string>>>;
  /**
   * The routes that have their translations at their own URLs, `/uk/...` and `/zh-CN/...`: the keys of the translated pages of the
   * site. The language switch goes to those URLs, a saved language leads to them, and the rest of the pages stay at one URL.
   */
  languageRoutes?: readonly string[];
  /** Fixed language, the language of the URL or for tests and previews: detection and the stored choice are skipped. */
  initialLocale?: TuwaLocale;
  /** The page and anything rendered next to it, such as a top loading bar. */
  children: ReactNode;
}

/**
 * Props of {@link NextraDocsLayout}.
 */
export interface NextraDocsLayoutProps {
  /** Logo of the site, for example `SiteLogo`; rendered in the navbar and the footer. */
  logo: ReactNode;
  /** Where the logo of the navbar leads (default: `/`), for a site with languages in its URLs. */
  logoLink?: string;
  /** External links of the navbar (default: `baseNavLinks`). */
  links?: SocialLink[];
  /** External links of the footer (default: `baseFooterLinks`). */
  footerLinks?: SocialLink[];
  /** The page map, already in the language of the reader (`localizePageMap`); passed to Nextra as it is. */
  pageMap: PageMapItem[];
  /** URL of the docs app in the repository, for the edit links. */
  docsRepositoryBase: string;
  /** The language of the reader, shown in the language switch and used for the dates and the policy links. */
  locale: TuwaLocale;
  /**
   * Called with the language the reader picks in the switch.
   *
   * @param locale - The picked language.
   */
  onLocaleChange: (locale: TuwaLocale) => void;
  /** The interface texts of that language, `docsLabels[locale]`. */
  labels: DocsLabels;
  /** Options of the Nextra sidebar (the `sidebar` prop of its `Layout`), for example `{ defaultMenuCollapseLevel: 1 }`. */
  sidebar?: ComponentProps<typeof Layout>['sidebar'];
  /** The page and anything rendered next to it. */
  children: ReactNode;
}

/**
 * The Nextra `Layout` of a TUWA documentation site in a given language: the docs-ui {@link Navbar} with the language
 * switch and then the theme switch after the links (Nextra's own theme select is off: `darkMode: false`), the
 * {@link Footer}, the search, the table of contents and the edit, feedback and last-updated texts from `labels`. It keeps no state: {@link DocsLayout} renders it with the language of its provider, and the docs hub with
 * its own dictionaries, so every site words and wires its chrome the same way.
 *
 * @param props - See {@link NextraDocsLayoutProps}.
 * @returns The layout.
 */
export function NextraDocsLayout({
  logo,
  logoLink,
  links,
  footerLinks,
  pageMap,
  docsRepositoryBase,
  locale,
  onLocaleChange,
  labels,
  sidebar,
  children,
}: NextraDocsLayoutProps) {
  return (
    <Layout
      navbar={
        <Navbar logo={logo} logoLink={logoLink} links={links}>
          <LocaleSwitcher
            locale={locale}
            onSelect={(code) => {
              const picked = normalizeLocale(code);
              if (picked) onLocaleChange(picked);
            }}
            ariaLabel={labels.selectLanguage}
          />
          <NavbarThemeSwitch ariaLabel={labels.toggleTheme} />
        </Navbar>
      }
      footer={
        <Footer logo={logo} links={footerLinks} labels={labels.footer} policyLanguage={policyLanguageOf(locale)} />
      }
      pageMap={pageMap}
      docsRepositoryBase={docsRepositoryBase}
      navigation={{ prev: true, next: true }}
      {...(sidebar && { sidebar })}
      editLink={labels.nextra.editThisPage}
      feedback={{ content: labels.nextra.feedback }}
      lastUpdated={<LastUpdated locale={locale}>{labels.nextra.lastUpdated}</LastUpdated>}
      toc={{ title: labels.nextra.onThisPage, backToTop: labels.nextra.scrollToTop }}
      // One theme switch per page, in the navbar: Nextra's own select in the sidebar and the mobile menu is off
      darkMode={false}
      search={
        <Search
          placeholder={labels.nextra.searchPlaceholder}
          emptyResult={labels.nextra.searchEmpty}
          errorText={labels.nextra.searchError}
          loading={labels.nextra.searchLoading}
        />
      }
    >
      {children}
    </Layout>
  );
}

function LocalizedLayout({
  pageMap,
  sidebarTitles,
  languageRoutes,
  urlLocale,
  ...props
}: Omit<DocsLayoutProps, 'initialLocale'> & { urlLocale?: TuwaLocale }) {
  const { locale, setLocale, resolved, t } = useDocsI18n();
  const hasLanguageUrl = useCallback((route: string) => languageRoutes?.includes(route) ?? false, [languageRoutes]);
  const selectLocale = useLocaleRouting({ locale, setLocale, resolved, hasLanguageUrl });
  const siteTitles = locale === 'en' ? undefined : sidebarTitles?.[locale];
  const localizedPageMap = useMemo(() => {
    const titled = localizePageMap(pageMap, { ...t.sidebar, ...siteTitles });
    return urlLocale ? prefixPageMapRoutes(titled, urlLocale, hasLanguageUrl) : titled;
  }, [pageMap, t.sidebar, siteTitles, urlLocale, hasLanguageUrl]);

  return (
    <NextraDocsLayout
      {...props}
      logoLink={urlLocale && localizedPath('/', urlLocale)}
      pageMap={localizedPageMap}
      locale={locale}
      onLocaleChange={selectLocale}
      labels={t}
    />
  );
}

/**
 * The layout of a TUWA project documentation site in three languages (English, Ukrainian, Simplified Chinese):
 * {@link NextraDocsLayout} (the Nextra `Layout` with the docs-ui {@link Navbar}, the language switch after the links,
 * then the theme switch, the {@link Footer}, the search, the table of contents,
 * the edit, feedback and last-updated texts) and the sidebar titles in the language of the reader. Render it in the
 * `<body>` of the root layout, around the page; pages rendered with `createDocsPage` (`@tuwaio/docs-ui/nextra/page`)
 * switch to their translation.
 *
 * The URL never changes with the language. The server renders English; after mount the language is read from
 * `tuwa-locale` in Local Storage, then the browser languages and the time zone (no cookie, no request), and a pick in
 * the switch is saved to `tuwa-locale` (add the key to `PreferenceExpiry`, so it is forgotten after 30 days) and sets
 * `<html lang>`.
 *
 * @param props - See {@link DocsLayoutProps}.
 * @returns The layout.
 */
export function DocsLayout({ initialLocale, ...props }: DocsLayoutProps) {
  return (
    <DocsI18nProvider initialLocale={initialLocale}>
      <LocalizedLayout
        urlLocale={props.languageRoutes && initialLocale !== 'en' ? initialLocale : undefined}
        {...props}
      />
    </DocsI18nProvider>
  );
}
