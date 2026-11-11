'use client';

import { PixelArt } from '@tuwaio/docs-ui';
import type { TuwaLocale } from '@tuwaio/docs-ui/locale';

import Link from '@/components/LocaleNextLink';

import { useI18n } from '../i18n';
import { HeroPlate } from './home/HeroPlate';

// prettier-ignore
const ARROW_DOWN = ['...#...', '...#...', '...#...', '#..#..#', '.#.#.#.', '..###..', '...#...'];
// prettier-ignore
const ARROW_RIGHT = ['...#...', '....#..', '.....#.', '#######', '.....#.', '....#..', '...#...'];

/**
 * The size of the title by language, as a share of the width of its column (container query units): "TUWA Docs" and
 * "TUWA 文档" fill the column on one line; "TUWA Документація" is twice as long and takes a smaller size on one line.
 */
const titleSize: Record<TuwaLocale, string> = {
  en: 'text-[19cqi]',
  uk: 'text-[10.5cqi]',
  'zh-CN': 'text-[19cqi]',
};

const buttonClassName =
  'inline-flex h-11 items-center gap-2.5 whitespace-nowrap px-[18px] font-mono text-xs font-bold uppercase leading-none tracking-[0.12em] transition-colors';

/**
 * The hero of the main page, in paper and ink: the kicker with a lit square, the title "TUWA Docs" in large sans set
 * to the width of its column, the lead, the licence with an Apache-2.0 chip, and two buttons in mono caps with pixel
 * arrows (to the packages of the first stage, and to the Playground); beside it from 1024px, below it on narrower
 * screens, the plate of the eight projects.
 *
 * @returns The hero section.
 */
export function HeroSection() {
  const { locale, t } = useI18n();
  const hero = t.home.hero;

  return (
    <section
      id="overview"
      aria-labelledby="hero-title"
      className="grid scroll-mt-24 gap-10 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1fr)_396px] lg:items-start lg:gap-x-14 xl:pt-20"
    >
      <div className="@container min-w-0">
        <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase leading-[1.2] tracking-[0.12em] text-[var(--tuwa-text-secondary)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-[var(--tuwa-docs-lit)]" />
          {hero.badge}
        </p>
        <h1
          id="hero-title"
          className={`mt-5 whitespace-nowrap font-sans font-medium leading-[0.92] tracking-[-0.05em] text-[var(--tuwa-text-primary)] ${titleSize[locale]}`}
        >
          {hero.titlePrefix} {hero.titleHighlight}
        </h1>
        <p className="mt-7 max-w-[600px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)]">{hero.description}</p>
        <p className="mt-5 flex max-w-[600px] items-start gap-3.5 text-sm leading-normal text-[var(--tuwa-text-secondary)]">
          <span className="mt-px inline-grid h-6 shrink-0 place-items-center border border-[var(--tuwa-text-primary)] px-2 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-[var(--tuwa-text-primary)]">
            Apache-2.0
          </span>
          <span>{hero.license}</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#stage-1"
            className={`${buttonClassName} bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)] hover:bg-[var(--tuwa-button-primary-bg-hover)]`}
          >
            {hero.explorePackages}
            <PixelArt art={ARROW_DOWN} className="h-3.5 w-3.5 [--tuwa-pixel-ink:currentColor]" />
          </a>
          <Link
            href="/playground"
            className={`${buttonClassName} border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]`}
          >
            {hero.tryPlayground}
            <PixelArt art={ARROW_RIGHT} className="h-3.5 w-3.5 [--tuwa-pixel-ink:currentColor]" />
          </Link>
        </div>
      </div>
      <HeroPlate />
    </section>
  );
}
