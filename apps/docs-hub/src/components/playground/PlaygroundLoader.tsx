'use client';

import dynamic from 'next/dynamic';

import { useI18n } from '@/i18n';

function PlaygroundSkeleton() {
  const { t } = useI18n();
  return (
    <div aria-busy="true" aria-label={t.ui.playgroundExtra.loadingAria} className="flex flex-col gap-5">
      {/* The controls, the stage and the inspector */}
      {['h-36 sm:h-48', 'h-[600px]', 'h-80'].map((size) => (
        <div
          key={size}
          className={`${size} animate-pulse rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)]/60 dark:bg-white/[0.04]`}
        />
      ))}
    </div>
  );
}

// The TUWA packages of the Playground load in the browser only, on this page only
const PlaygroundStudio = dynamic(() => import('./PlaygroundStudio'), { ssr: false, loading: PlaygroundSkeleton });

/**
 * Localized header of `/playground`.
 */
export function PlaygroundHeader() {
  const { t } = useI18n();
  return (
    <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight font-geist-mono uppercase tracking-tight">
        <span className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] bg-clip-text text-transparent">
          {t.playground.titlePrefix} {t.playground.titleHighlight}
        </span>
      </h1>
      <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
        {t.playground.description}
      </p>
      <p className="mt-3 text-sm text-[var(--tuwa-text-tertiary)]">{t.ui.playgroundExtra.subnote}</p>
    </header>
  );
}

/** Loads the Playground in the browser, with a skeleton of its layout meanwhile. */
export function PlaygroundLoader() {
  return <PlaygroundStudio />;
}
