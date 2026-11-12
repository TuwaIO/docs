'use client';

import dynamic from 'next/dynamic';

import { useI18n } from '@/i18n';

import { homeBleedClassName } from '../home/homeLayout';
import { CrossMark, Kicker } from '../home/SectionHead';
import { capsClassName, lineClassName } from './playgroundStyles';

/**
 * The layout of the Playground while its packages load: its three parts (the controls, the stage, the inspector) as
 * empty frames of 1px from line to line of the frame of the page, with a label in mono caps. It does not move.
 */
function PlaygroundSkeleton() {
  const { t } = useI18n();
  return (
    <div
      aria-busy="true"
      aria-label={t.ui.playgroundExtra.loadingAria}
      className={`relative flex flex-col gap-8 border-t py-8 ${lineClassName} ${homeBleedClassName}`}
    >
      <CrossMark x="left" y="top" />
      <CrossMark x="right" y="top" />
      <p className={`m-0 text-[var(--tuwa-text-secondary)] ${capsClassName}`}>{t.ui.playgroundExtra.loadingAria}</p>
      {/* The controls, the stage and the inspector */}
      {['h-36 sm:h-48', 'h-[600px]', 'h-80'].map((size) => (
        <div key={size} className={`${size} border ${lineClassName}`} />
      ))}
    </div>
  );
}

// The TUWA packages of the Playground load in the browser only, on this page only
const PlaygroundStudio = dynamic(() => import('./PlaygroundStudio'), { ssr: false, loading: PlaygroundSkeleton });

/**
 * The header of `/playground`, in paper and ink: the kicker (what the stage runs on: simulated wallets and a
 * simulated chain), the title in large mono ink, the lead and a note that nothing is signed or sent.
 *
 * @returns The header.
 */
export function PlaygroundHeader() {
  const { locale, t } = useI18n();
  return (
    <header className="pt-12 pb-14 md:pt-16 md:pb-16 xl:pt-20">
      <Kicker>{t.playground.stage.simulatedLabel}</Kicker>
      <h1
        className={`mt-5 font-mono text-[clamp(36px,6.2vw,76px)] leading-[0.98] font-medium text-[var(--tuwa-text-primary)] ${locale === 'uk' ? 'tracking-normal' : 'tracking-[-0.04em]'}`}
      >
        {t.playground.titlePrefix} {t.playground.titleHighlight}
      </h1>
      <p className="mt-7 max-w-[680px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)]">
        {t.playground.description}
      </p>
      <p className="mt-4 max-w-[680px] text-sm leading-normal text-[var(--tuwa-text-secondary)]">
        {t.ui.playgroundExtra.subnote}
      </p>
    </header>
  );
}

/** Loads the Playground in the browser, with the frames of its layout meanwhile. */
export function PlaygroundLoader() {
  return <PlaygroundStudio />;
}
