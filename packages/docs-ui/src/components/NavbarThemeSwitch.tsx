'use client';

import { useTheme } from 'nextra-theme-docs';

import { ThemeSwitcher } from './ThemeSwitcher';

/**
 * The theme switch of the Nextra navbar of a TUWA documentation site, after the language switch: the docs-ui
 * {@link ThemeSwitcher}, wired to the theme of the page through the `next-themes` hook that `nextra-theme-docs`
 * re-exports, so docs-ui needs no peer of its own for it. Nextra's own Light / Dark / System select is turned off
 * (`darkMode: false`), so the page has one theme switch, in the header, as on the hub and the website. A first visit
 * follows the system theme; a click picks light or dark, kept under `theme` in Local Storage.
 *
 * @param props - The accessible name of the switch.
 * @param props.ariaLabel - Accessible name of the switch button.
 * @returns The switch.
 * @internal
 */
export function NavbarThemeSwitch({ ariaLabel }: { ariaLabel: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <ThemeSwitcher
      theme={resolvedTheme ?? 'light'}
      onToggle={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      ariaLabel={ariaLabel}
    />
  );
}
