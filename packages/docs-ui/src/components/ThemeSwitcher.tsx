'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { useEffect, useState } from 'react';

export interface ThemeSwitcherProps {
  theme: string;
  onToggle: () => void;
}

export function ThemeSwitcher({ theme, onToggle }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const defaultStyles =
    'tuwadocs:bg-black/5 tuwadocs:border-black/5 tuwadocs:hover:bg-black/10 tuwadocs:dark:bg-white/10 tuwadocs:dark:border-white/10 tuwadocs:dark:hover:bg-white/20';

  if (!mounted) {
    return (
      <div
        className={cn(
          'tuwadocs:relative tuwadocs:flex tuwadocs:h-10 tuwadocs:w-20 tuwadocs:md:h-8 tuwadocs:md:w-16 tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:opacity-0',
          defaultStyles,
        )}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className={cn(
        'tuwadocs:group tuwadocs:relative tuwadocs:flex tuwadocs:h-10 tuwadocs:w-20 tuwadocs:md:h-8 tuwadocs:md:w-16 tuwadocs:cursor-pointer tuwadocs:items-center tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:p-1 tuwadocs:transition-all tuwadocs:duration-300 tuwadocs:ease-in-out tuwadocs:backdrop-blur-sm tuwadocs:border',
        defaultStyles,
      )}
      aria-label="Toggle theme"
    >
      {/* Mobile slide indicator with custom spring-like keyframe animation */}
      <div
        className={cn(
          'tuwadocs:absolute tuwadocs:top-[1px] tuwadocs:left-[2px] tuwadocs:z-10 tuwadocs:h-9 tuwadocs:w-9 tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:bg-[var(--tuwa-bg-primary)] tuwadocs:shadow-md tuwadocs:md:hidden',
          isDark ? 'tuwa-slide-dark' : 'tuwa-slide-light',
        )}
      />
      {/* Desktop slide indicator with custom spring-like keyframe animation */}
      <div
        className={cn(
          'tuwadocs:absolute tuwadocs:top-[1px] tuwadocs:left-[2px] tuwadocs:z-10 tuwadocs:h-9 tuwadocs:w-9 tuwadocs:md:h-7 tuwadocs:md:w-7 tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:bg-[var(--tuwa-bg-primary)] tuwadocs:shadow-md tuwadocs:hidden tuwadocs:md:block',
          isDark ? 'tuwa-slide-dark' : 'tuwa-slide-light',
        )}
      />

      <div className="tuwadocs:relative tuwadocs:z-20 tuwadocs:flex tuwadocs:w-full tuwadocs:justify-between">
        {/* Sun Icon */}
        <div className="tuwadocs:flex tuwadocs:flex-1 tuwadocs:items-center tuwadocs:justify-center">
          <SunIcon
            className={`tuwadocs:h-6 tuwadocs:w-6 tuwadocs:relative tuwadocs:-left-[2px] tuwadocs:md:h-5 tuwadocs:md:w-5 tuwadocs:transition-colors tuwadocs:duration-300 ${
              !isDark
                ? 'tuwadocs:text-yellow-500' // Active color
                : 'tuwadocs:text-slate-500 tuwadocs:group-hover:text-yellow-400' // Passive + Hover color
            }`}
          />
        </div>
        {/* Moon Icon */}
        <div className="tuwadocs:flex tuwadocs:flex-1 tuwadocs:justify-center">
          <MoonIcon
            className={`tuwadocs:h-6 tuwadocs:w-6 tuwadocs:relative tuwadocs:left-[2px] tuwadocs:md:h-5 tuwadocs:md:w-5 tuwadocs:transition-colors tuwadocs:duration-300 ${
              isDark
                ? 'tuwadocs:text-indigo-400' // Active color
                : 'tuwadocs:text-slate-500 tuwadocs:group-hover:text-indigo-300' // Passive + Hover color
            }`}
          />
        </div>
      </div>
    </button>
  );
}
