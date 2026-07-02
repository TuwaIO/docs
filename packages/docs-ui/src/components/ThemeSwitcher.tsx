'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

// Simple NoSSR implementation to keep the component fully self-contained
function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

export interface ThemeSwitcherProps {
  theme: string;
  onToggle: () => void;
}

export function ThemeSwitcher({ theme, onToggle }: ThemeSwitcherProps) {
  const defaultStyles =
    'bg-black/5 border-black/5 hover:bg-black/10 dark:bg-white/10 dark:border-white/10 dark:hover:bg-white/20';

  return (
    <button
      onClick={onToggle}
      className={`group relative flex h-10 w-20 md:h-8 md:w-16 cursor-pointer items-center rounded-[var(--tuwa-rounded-corners)] p-1 transition-all duration-300 ease-in-out backdrop-blur-sm border ${defaultStyles}`}
      aria-label="Toggle theme"
    >
      <NoSSR>
        {/* Mobile slide indicator with custom spring-like cubic-bezier transition */}
        <div
          className="absolute top-[1px] left-[2px] z-10 h-9 w-9 md:h-7 md:w-7 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-primary)] shadow-md md:hidden"
          style={{
            transform: theme === 'dark' ? 'translateX(38px)' : 'translateX(0)',
            transition: 'transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {/* Desktop slide indicator with custom spring-like cubic-bezier transition */}
        <div
          className="absolute top-[1px] left-[2px] z-10 h-9 w-9 md:h-7 md:w-7 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-primary)] shadow-md hidden md:block"
          style={{
            transform: theme === 'dark' ? 'translateX(30px)' : 'translateX(0)',
            transition: 'transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </NoSSR>

      <div className="relative z-20 flex w-full justify-between">
        {/* Sun Icon */}
        <div className="flex flex-1 items-center justify-center">
          <NoSSR>
            <SunIcon
              className={`h-6 w-6 relative -left-[2px] md:h-5 md:w-5 transition-colors duration-300 ${
                theme === 'light'
                  ? 'text-yellow-500' // Active color
                  : 'text-slate-500 group-hover:text-yellow-400' // Passive + Hover color
              }`}
            />
          </NoSSR>
        </div>
        {/* Moon Icon */}
        <div className="flex flex-1 justify-center">
          <NoSSR>
            <MoonIcon
              className={`h-6 w-6 relative left-[2px] md:h-5 md:w-5 transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-indigo-400' // Active color
                  : 'text-slate-500 group-hover:text-indigo-300' // Passive + Hover color
              }`}
            />
          </NoSSR>
        </div>
      </div>
    </button>
  );
}
