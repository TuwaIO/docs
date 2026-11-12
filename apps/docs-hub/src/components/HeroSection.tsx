'use client';

import { PixelArt } from '@tuwaio/docs-ui';
import type { TuwaLocale } from '@tuwaio/docs-ui/locale';

import Link from '@/components/LocaleNextLink';

import { useI18n } from '../i18n';
import { HeroPlate } from './home/HeroPlate';
import { Kicker } from './home/SectionHead';

// prettier-ignore
const ARROW_DOWN = ['...#...', '...#...', '...#...', '#..#..#', '.#.#.#.', '..###..', '...#...'];
// prettier-ignore
const ARROW_RIGHT = ['...#...', '....#..', '.....#.', '#######', '.....#.', '....#..', '...#...'];

/**
 * The size and tracking of the title by language, the size as a share of the width of its column (container query
 * units), measured on Geist Mono so the title fills the column on one line: "TUWA Docs", "TUWA 文档" (its two CJK
 * glyphs are wider than two Latin ones) and "TUWA Довідник", longer and smaller. Cyrillic keeps the normal tracking:
 * drawn tighter, its glyphs touch.
 */
const titleSize: Record<TuwaLocale, string> = {
  en: 'text-[19.6cqi] tracking-[-0.04em]',
  uk: 'text-[12.6cqi] tracking-normal',
  'zh-CN': 'text-[20.9cqi] tracking-[-0.04em]',
};

const buttonClassName =
  'group inline-flex h-11 items-center gap-2.5 whitespace-nowrap px-[18px] font-mono text-xs font-bold uppercase leading-none tracking-[0.12em] transition-colors';

/** The pixel arrow of a button: it steps the way it points while the button is under the pointer or the keyboard */
const arrowClassName =
  'h-3.5 w-3.5 [--tuwa-pixel-ink:currentColor] transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:!translate-none';

/**
 * The hero of the main page, in paper and ink: the kicker with a lit square, the title "TUWA Docs" in large mono set
 * to the width of its column, the lead, the licence with an Apache-2.0 chip, and two buttons in mono caps with pixel
 * arrows (to the packages of the first stage, and to the Playground) that step the way they point under the pointer or
 * the keyboard; beside it from 1024px, below it on narrower screens, the plate of the eight projects.
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
        <Kicker>{hero.badge}</Kicker>
        <h1
          id="hero-title"
          className={`mt-5 whitespace-nowrap font-mono font-medium leading-[0.92] text-[var(--tuwa-text-primary)] ${titleSize[locale]}`}
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
            <PixelArt
              art={ARROW_DOWN}
              className={`${arrowClassName} group-hover:translate-y-[3px] group-focus-visible:translate-y-[3px]`}
            />
          </a>
          <Link
            href="/playground"
            className={`${buttonClassName} border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]`}
          >
            {hero.tryPlayground}
            <PixelArt
              art={ARROW_RIGHT}
              className={`${arrowClassName} group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]`}
            />
          </Link>
        </div>
      </div>
      <HeroPlate />
    </section>
  );
}
