'use client';

import type { PageMapItem } from 'nextra';
import { Search } from 'nextra/components';
import { LastUpdated, Layout } from 'nextra-theme-docs';
import { type ReactNode, useMemo } from 'react';

import { DocsI18nProvider, useDocsI18n } from '../docsI18n';
import { policyLanguageOf, type TuwaLocale } from '../locale';
import { localizePageMap } from '../pageMap';
import { Footer } from './Footer';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Navbar, type SocialLink } from './NavBar';

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
  /** Fixed language (tests, previews): detection and the stored choice are skipped. */
  initialLocale?: TuwaLocale;
  /** The page and anything rendered next to it, such as a top loading bar. */
  children: ReactNode;
}

function LocalizedLayout({
  logo,
  links,
  footerLinks,
  pageMap,
  docsRepositoryBase,
  sidebarTitles,
  children,
}: DocsLayoutProps) {
  const { locale, setLocale, t } = useDocsI18n();
  const siteTitles = locale === 'en' ? undefined : sidebarTitles?.[locale];
  const localizedPageMap = useMemo(
    () => localizePageMap(pageMap, { ...t.sidebar, ...siteTitles }),
    [pageMap, t.sidebar, siteTitles],
  );

  return (
    <Layout
      navbar={
        <Navbar logo={logo} links={links}>
          <LocaleSwitcher locale={locale} onSelect={setLocale} ariaLabel={t.selectLanguage} />
        </Navbar>
      }
      footer={<Footer logo={logo} links={footerLinks} labels={t.footer} policyLanguage={policyLanguageOf(locale)} />}
      pageMap={localizedPageMap}
      docsRepositoryBase={docsRepositoryBase}
      navigation={{ prev: true, next: true }}
      editLink={t.nextra.editThisPage}
      feedback={{ content: t.nextra.feedback }}
      lastUpdated={<LastUpdated locale={locale}>{t.nextra.lastUpdated}</LastUpdated>}
      toc={{ title: t.nextra.onThisPage, backToTop: t.nextra.scrollToTop }}
      themeSwitch={{ light: t.nextra.themeLight, dark: t.nextra.themeDark, system: t.nextra.themeSystem }}
      search={
        <Search
          placeholder={t.nextra.searchPlaceholder}
          emptyResult={t.nextra.searchEmpty}
          errorText={t.nextra.searchError}
          loading={t.nextra.searchLoading}
        />
      }
    >
      {children}
    </Layout>
  );
}

/**
 * The layout of a TUWA project documentation site in three languages (English, Ukrainian, Simplified Chinese): the
 * Nextra `Layout` with the docs-ui {@link Navbar} (the language switch after the links; the theme switch stays in the
 * Nextra sidebar and the mobile menu), the {@link Footer}, the search, the table of contents, the edit, feedback and
 * last-updated texts and the sidebar titles in the language of the reader. Render it in the `<body>` of the root
 * layout, around the page; pages rendered with `createDocsPage` (`@tuwaio/docs-ui/nextra/page`) switch to their
 * translation.
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
      <LocalizedLayout {...props} />
    </DocsI18nProvider>
  );
}
