'use client';

import { LogoMotion, SiteLogo, SmoothAnchors } from '@tuwaio/docs-ui';
import { pathWithoutLocale } from '@tuwaio/docs-ui/locale';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import Link from '@/components/LocaleNextLink';
import { useI18n } from '@/i18n';

import { Footer } from './Footer';
import { Header } from './Header';

/** The pages whose column has the frame of the main page: under them the footer takes the sides of that frame. */
const FRAMED_PAGES = ['/', '/comparisons', '/configurator', '/policies', '/playground'];

/**
 * The frame of the React pages of the Docs Hub (the main page, comparisons, configurator, playground, policies and the
 * 404 page): a link past the header to the content, first for the keyboard, the fixed header with the logo, the content
 * under the header and the footer; the links to anchors of the page scroll smoothly (`SmoothAnchors`) and the pixels
 * of the logo tremble under the pointer (`LogoMotion`). Under a page
 * whose column has the frame of the main page, in every language, the footer takes the sides of that frame (`framed`).
 *
 * @param props.children - The page.
 * @param props.framed - Whether the page has the frame of the main page whatever its address is: the 404 page, which
 * answers every unknown address (default: `false`, the address decides).
 * @returns The frame with the page.
 */
export function HubShell({ children, framed = false }: { children: ReactNode; framed?: boolean }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const isFramed = framed || FRAMED_PAGES.includes(pathWithoutLocale(pathname));
  const navbarLogo = (
    <Link href="/" aria-label={t.nav.homeAria} className="flex items-center px-4 xl:pl-6">
      <SiteLogo />
    </Link>
  );

  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:border focus:border-[var(--tuwa-text-primary)] focus:bg-[var(--tuwa-docs-raised)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.12em] focus:text-[var(--tuwa-text-primary)]"
      >
        {t.nav.skipToContent}
      </a>
      <SmoothAnchors />
      <LogoMotion />
      <Header logo={navbarLogo} />
      <main id="content" className="flex-1 pt-[56px]">
        {children}
      </main>
      <Footer framed={isFramed} />
    </div>
  );
}
