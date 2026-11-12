'use client';

import { PixelArt, projectIconArt, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';

import { useI18n } from '@/i18n';
import { ecosystemCounts, productsInOrder, type StagedEntry } from '@/lib/ecosystem';
import { formatPlural } from '@/lib/plural';

/** A cell of the plate: its lines of 1px on the right and below (the plate draws the top and left ones) */
const cellClassName =
  'min-h-[128px] min-w-0 border-r border-b border-[var(--tuwa-border-primary)] flex flex-col md:min-h-[136px]';

/**
 * A project on the plate: its number in the order of the projects (01 to 09: a stage has several projects, so the
 * number of its stage would repeat), its icon assembling once and its short name, a link to its row below. While the
 * reader points at it, its icon assembles again and moves in the way of its project.
 */
function PlateLink({ entry, number }: { entry: StagedEntry; number: number }) {
  return (
    <a
      href={`#p-${entry.id}`}
      onMouseEnter={(event) => startPixelMotion(event.currentTarget)}
      onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}
      onFocus={(event) => startPixelMotion(event.currentTarget)}
      onBlur={(event) => stopPixelMotion(event.currentTarget)}
      className={`group relative ${cellClassName} items-center gap-3 px-2.5 pt-[30px] pb-3.5 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]`}
    >
      <span className="absolute top-[9px] left-2.5 font-mono text-[11px] font-medium leading-none text-[var(--tuwa-text-secondary)]">
        {String(number).padStart(2, '0')}
      </span>
      <PixelArt
        art={projectIconArt[entry.icon]}
        assemble
        motion={entry.icon}
        data-handoff-from={entry.id}
        className="h-9 w-9"
      />
      <span className="font-mono text-xs font-medium leading-[1.3] tracking-normal text-[var(--tuwa-text-primary)] [overflow-wrap:anywhere] group-hover:text-[var(--tuwa-text-accent)]">
        {entry.plateName ?? entry.name}
      </span>
    </a>
  );
}

/**
 * The plate of the hero: a strip of ink with the count of the packages on npm, the products and the stages, all counted
 * from the data, over the nine TUWA projects on a 3 × 3 grid of raised paper on lines of 1px, in the order they build
 * on one another (`productOrder`: Quasar Client last), each a link to its row on the page with its number, its pixel icon (assembling once) and its short
 * name. In the dark theme the strip is sunken
 * and the count lit, with the quiet glow of the dark logo.
 *
 * @returns The plate.
 */
export function HeroPlate() {
  const { locale, t } = useI18n();
  const { packages, products, stages } = ecosystemCounts();
  const countClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em]';

  return (
    <nav
      aria-label={t.home.plate.ariaLabel}
      className="grid grid-cols-3 self-start border-t border-l border-[var(--tuwa-border-primary)] bg-[var(--tuwa-docs-raised)] lg:mt-[42px]"
    >
      <div className="col-span-3 flex items-end justify-between gap-4 border-r border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-text-primary)] px-3.5 py-3 text-[var(--tuwa-docs-paper)] dark:bg-[var(--tuwa-docs-sunken)] dark:text-[var(--tuwa-text-primary)]">
        <span className="flex items-end gap-2.5">
          <b className="tuwa-docs-glow font-mono text-[42px] leading-[0.9] font-medium tracking-[-0.03em] dark:text-[var(--tuwa-docs-lit)]">
            {packages}
          </b>
          <span className={countClassName}>{formatPlural(t.home.plate.packagesOnNpm, packages, locale)}</span>
        </span>
        <span className="flex flex-col items-end gap-1 text-right text-[#c9c8c5] dark:text-[var(--tuwa-text-secondary)]">
          <span className={countClassName}>{formatPlural(t.home.plate.products, products, locale)}</span>
          <span className={countClassName}>{formatPlural(t.home.plate.stages, stages, locale)}</span>
        </span>
      </div>
      {productsInOrder().map((entry, index) => (
        <PlateLink key={entry.id} entry={entry} number={index + 1} />
      ))}
    </nav>
  );
}
