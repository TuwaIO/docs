'use client';

import { ThemeSwitcher } from '@tuwaio/docs-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { setMenu } from 'nextra-theme-docs';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

// The same sections as the navbar of the Nextra pages (`src/content/_meta.tsx`)
const navLinks = [
  { href: '/guides', label: 'Guides' },
  { href: '/quasar', label: 'Quasar' },
  { href: '/comparisons', label: 'Comparisons' },
  { href: '/configurator', label: 'Configurator' },
];

const isCurrent = (pathname: string | null, href: string) => pathname === href || !!pathname?.startsWith(`${href}/`);

/**
 * Glassmorphic fixed header with logo slot, links and theme toggle. Below `md` the links and the toggle move to a
 * menu that slides in from the right, as on tuwa.io; it closes on a link click, the backdrop, Escape or a wider window,
 * and locks the page scroll while open.
 * @param props.logo - Server-rendered logo element passed from layout.
 */
export function Header({ logo }: { logo: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    // A link in the Nextra mobile menu that leads here unmounts the Nextra layout with the menu still open, which
    // leaves its scroll lock (`x:max-md:overflow-hidden` on <html>) behind: close that menu
    setMenu(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 768px)');
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--tuwa-border-primary)]/10 dark:border-white/[0.04] bg-[var(--tuwa-bg-primary)]/80 dark:bg-[#030303]/60 sm:bg-[var(--tuwa-bg-primary)]/50 sm:dark:bg-[#030303]/30 sm:backdrop-blur-xl">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {logo}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                  className="text-sm font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] aria-[current=page]:text-[var(--tuwa-text-primary)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {mounted && <ThemeSwitcher theme={resolvedTheme || 'dark'} onToggle={toggleTheme} />}
          </div>

          {/* Mobile menu button: two bars that turn into a cross */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden relative h-8 w-8 cursor-pointer"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="absolute top-1/2 left-1/2 flex w-6 -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span
                aria-hidden="true"
                className={`block h-0.5 w-full bg-[var(--tuwa-text-primary)] transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-1 rotate-45' : ''}`}
              />
              <span
                aria-hidden="true"
                className={`mt-1.5 block h-0.5 w-full bg-[var(--tuwa-text-primary)] transition-transform duration-300 ease-in-out ${isMenuOpen ? '-translate-y-1 -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would make it the containing block of these fixed elements */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`md:hidden fixed top-0 right-0 z-[70] h-full w-80 max-w-[85vw] flex flex-col border-l border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)]/90 dark:bg-[var(--tuwa-bg-primary)]/85 backdrop-blur-xl shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--tuwa-border-primary)]">
          <div onClick={closeMenu}>{logo}</div>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-[var(--tuwa-rounded-corners)] text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-secondary)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav aria-label="Mobile navigation" className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                className="block rounded-[var(--tuwa-rounded-corners)] px-4 py-2.5 text-lg font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-secondary)] aria-[current=page]:text-[var(--tuwa-text-primary)] aria-[current=page]:bg-[var(--tuwa-bg-secondary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-[var(--tuwa-border-primary)] p-4 flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--tuwa-text-secondary)]">Theme</span>
            {mounted && <ThemeSwitcher theme={resolvedTheme || 'dark'} onToggle={toggleTheme} />}
          </div>
        </div>
      </div>
    </>
  );
}
