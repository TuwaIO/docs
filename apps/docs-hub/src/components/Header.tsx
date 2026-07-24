'use client';

import { ThemeSwitcher } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

/**
 * Glassmorphic fixed header with logo slot and theme toggle.
 * @param props.logo - Server-rendered logo element passed from layout.
 */
export function Header({ logo }: { logo: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--tuwa-border-primary)]/10 dark:border-white/[0.04] bg-[var(--tuwa-bg-primary)]/50 dark:bg-[#030303]/30 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-2 sm:px-6 h-14 flex items-center justify-between">
        {logo}
        {mounted && <ThemeSwitcher theme={resolvedTheme || 'dark'} onToggle={toggleTheme} />}
      </div>
    </header>
  );
}
