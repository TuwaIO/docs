'use client';

import { LocaleSwitcher, ThemeSwitcher } from '@tuwaio/docs-ui';
import { pathWithoutLocale } from '@tuwaio/docs-ui/locale';
import { useLocaleRouting } from '@tuwaio/docs-ui/routing';
import { CloseIcon } from '@tuwaio/nova-core';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { setMenu } from 'nextra-theme-docs';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import Link from '@/components/LocaleNextLink';
import { useI18n } from '@/i18n';
import { hasLanguageUrl } from '@/lib/languageUrls';

const isCurrent = (pathname: string | null, href: string) => pathname === href || !!pathname?.startsWith(`${href}/`);

/** A cell of the header: a line of 1px on its left, its control in the middle */
const cellClassName = 'shrink-0 items-center border-l border-[var(--tuwa-border-primary)] px-2';

/** A row of the menu of phones with a switch: its name in mono caps on the left, the switch on the right */
const menuRowClassName =
  'flex min-h-[60px] items-center justify-between gap-4 border-b border-[var(--tuwa-border-primary)] px-5 py-2';
const menuLabelClassName =
  'font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--tuwa-text-secondary)]';

/**
 * The fixed header of the hub pages, in paper and ink: 56px of the paper of the page with its scanlines and a line of
 * 1px below, a little clear over a light blur of the page (`tuwa-docs-glass`) at every width. A row of cells on lines
 * of 1px: the logo (in a cell of 320px from 1280px), then from `lg` (1024px) the links in mono caps, the language and
 * the theme (the language first, as on every TUWA site). Below `lg` a square menu button opens a panel of the same
 * glass under the header with the links in mono caps on lines of 1px and, under them, the language and the theme, each
 * on a row with its name: on a phone the header keeps the logo at the size of tuwa.io and the button (at 768px the five
 * links and both switchers need the whole row in Ukrainian). The panel closes on a link, the scrim, Escape or a wider
 * window, and locks the page scroll while open.
 *
 * @param props.logo - The logo link, rendered on the server by the layout.
 * @returns The header and the menu panel.
 */
export function Header({ logo }: { logo: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, resolved, t } = useI18n();
  const selectLocale = useLocaleRouting({ locale, setLocale, resolved, hasLanguageUrl });
  const pathname = pathWithoutLocale(usePathname());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/guides', label: t.nav.guides },
    { href: '/quasar', label: t.nav.quasar },
    { href: '/comparisons', label: t.nav.comparisons },
    { href: '/configurator', label: t.nav.configurator },
    { href: '/playground', label: t.nav.playground },
  ];

  useEffect(() => {
    // A link in the Nextra mobile menu that leads here unmounts the Nextra layout with the menu still open, which
    // leaves its scroll lock (`x:max-md:overflow-hidden` on <html>) behind: close that menu
    setMenu(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 64rem)');
    const closeOnDesktop = (event: MediaQueryListEvent) => event.matches && setIsMenuOpen(false);

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [isMenuOpen]);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-[56px] items-stretch border-b border-[var(--tuwa-border-primary)] tuwa-docs-glass tuwa-docs-scan">
        <div className="flex shrink-0 items-stretch border-r border-[var(--tuwa-border-primary)] xl:w-[320px]">
          {logo}
        </div>

        <nav aria-label={t.nav.mainNavAria} className="hidden lg:flex items-stretch pl-[6px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
              className="flex items-center px-[18px] font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--tuwa-text-secondary)] transition-colors hover:text-[var(--tuwa-text-primary)] aria-[current=page]:text-[var(--tuwa-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="min-w-0 flex-1" />

        <div className={`hidden lg:flex ${cellClassName}`}>
          <LocaleSwitcher locale={locale} onSelect={selectLocale} ariaLabel={t.nav.selectLanguage} />
        </div>
        <div className={`hidden lg:flex ${cellClassName}`}>
          {/* The switch renders a placeholder of its size while the page hydrates, so the header does not move */}
          <ThemeSwitcher theme={resolvedTheme ?? 'light'} onToggle={toggleTheme} ariaLabel={t.nav.toggleTheme} />
        </div>
        <div className={`flex lg:hidden ${cellClassName}`}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {isMenuOpen ? (
              <CloseIcon aria-hidden="true" className="h-5 w-5" />
            ) : (
              <>
                <span aria-hidden="true" className="absolute top-[15px] right-[10px] left-[10px] h-0.5 bg-current" />
                <span aria-hidden="true" className="absolute top-[21px] right-[10px] left-[10px] h-0.5 bg-current" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Under the header, which stays on top with the menu button: the scrim of Nova's dialogs and the panel */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`lg:hidden fixed inset-x-0 top-[56px] bottom-0 z-[44] bg-[rgb(16_16_20/0.5)] transition-opacity duration-200 motion-reduce:transition-none ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`lg:hidden fixed top-[56px] right-0 bottom-0 z-[45] w-80 max-w-full overflow-y-auto border-l border-[var(--tuwa-border-primary)] tuwa-docs-glass tuwa-docs-scan transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav aria-label={t.nav.mobileNavAria}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
              className="flex h-[52px] items-center border-b border-[var(--tuwa-border-primary)] px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--tuwa-text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] hover:text-[var(--tuwa-text-primary)] aria-[current=page]:bg-[var(--tuwa-text-primary)] aria-[current=page]:text-[var(--tuwa-docs-paper)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* The language, then the theme, each on a row with its name: on a phone the header has no room for them */}
        <div className={menuRowClassName}>
          <span className={menuLabelClassName}>{t.nav.language}</span>
          <LocaleSwitcher locale={locale} onSelect={selectLocale} ariaLabel={t.nav.selectLanguage} />
        </div>
        <div className={menuRowClassName}>
          <span className={menuLabelClassName}>{t.nav.theme}</span>
          <ThemeSwitcher theme={resolvedTheme ?? 'light'} onToggle={toggleTheme} ariaLabel={t.nav.toggleTheme} />
        </div>
      </div>
    </>
  );
}
