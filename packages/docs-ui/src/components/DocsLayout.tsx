'use client';

import type { PageMapItem } from 'nextra';
import { Search } from 'nextra/components';
import { LastUpdated, Layout } from 'nextra-theme-docs';
import { type ComponentProps, type ReactNode, useMemo } from 'react';

import { DocsI18nProvider, useDocsI18n } from '../docsI18n';
import type { DocsLabels } from '../docsLabels';
import { normalizeLocale, policyLanguageOf, type TuwaLocale } from '../locale';
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

/**
 * Props of {@link NextraDocsLayout}.
 */
export interface NextraDocsLayoutProps {
  /** Logo of the site, for example `SiteLogo`; rendered in the navbar and the footer. */
  logo: ReactNode;
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
 * switch after the links (the theme switch stays in the Nextra sidebar and the mobile menu), the {@link Footer}, the
 * search, the table of contents, the edit, feedback and last-updated texts and the theme switch options from
 * `labels`. It keeps no state: {@link DocsLayout} renders it with the language of its provider, and the docs hub with
 * its own dictionaries, so every site words and wires its chrome the same way.
 *
 * @param props - See {@link NextraDocsLayoutProps}.
 * @returns The layout.
 */
export function NextraDocsLayout({
  logo,
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
        <Navbar logo={logo} links={links}>
          <LocaleSwitcher
            locale={locale}
            onSelect={(code) => {
              const picked = normalizeLocale(code);
              if (picked) onLocaleChange(picked);
            }}
            ariaLabel={labels.selectLanguage}
          />
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
      themeSwitch={{
        light: labels.nextra.themeLight,
        dark: labels.nextra.themeDark,
        system: labels.nextra.themeSystem,
      }}
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

function LocalizedLayout({ pageMap, sidebarTitles, ...props }: Omit<DocsLayoutProps, 'initialLocale'>) {
  const { locale, setLocale, t } = useDocsI18n();
  const siteTitles = locale === 'en' ? undefined : sidebarTitles?.[locale];
  const localizedPageMap = useMemo(
    () => localizePageMap(pageMap, { ...t.sidebar, ...siteTitles }),
    [pageMap, t.sidebar, siteTitles],
  );

  return (
    <NextraDocsLayout {...props} pageMap={localizedPageMap} locale={locale} onLocaleChange={setLocale} labels={t} />
  );
}

/**
 * The layout of a TUWA project documentation site in three languages (English, Ukrainian, Simplified Chinese):
 * {@link NextraDocsLayout} (the Nextra `Layout` with the docs-ui {@link Navbar}, the language switch after the links,
 * the theme switch in the Nextra sidebar and the mobile menu, the {@link Footer}, the search, the table of contents,
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
      <LocalizedLayout {...props} />
    </DocsI18nProvider>
  );
}
