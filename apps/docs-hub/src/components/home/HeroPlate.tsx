'use client';

import { PixelArt, projectIconArt } from '@tuwaio/docs-ui';

import { useI18n } from '@/i18n';
import { ecosystemCounts, stagedEntries, type StagedEntry } from '@/lib/ecosystem';
import { formatPlural } from '@/lib/plural';

/** A cell of the plate: its lines of 1px on the right and below (the plate draws the top and left ones) */
const cellClassName =
  'min-h-[128px] min-w-0 border-r border-b border-[var(--tuwa-border-primary)] flex flex-col md:min-h-[136px]';

/** A project on the plate: its stage, its icon assembling once and its short name, a link to its row below. */
function PlateLink({ entry }: { entry: StagedEntry }) {
  return (
    <a
      href={`#p-${entry.id}`}
      className={`group relative ${cellClassName} items-center gap-3 px-2.5 pt-[30px] pb-3.5 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]`}
    >
      <span className="absolute top-[9px] left-2.5 font-mono text-[11px] font-medium leading-none text-[var(--tuwa-text-secondary)]">
        {String(entry.stage).padStart(2, '0')}
      </span>
      <PixelArt art={projectIconArt[entry.icon]} assemble className="h-9 w-9" />
      <span className="font-mono text-xs font-medium leading-[1.3] tracking-normal text-[var(--tuwa-text-primary)] [overflow-wrap:anywhere] group-hover:text-[var(--tuwa-text-accent)]">
        {entry.plateName ?? entry.name}
      </span>
    </a>
  );
}

/**
 * The plate of the hero: the eight TUWA projects on a 3 × 3 grid of raised paper on lines of 1px, each a link to its
 * row on the page with its stage, its pixel icon (assembling once) and its short name, around a cell of ink with the
 * count of the packages on npm, the products and the stages, all counted from the data. In the dark theme the cell is
 * sunken and the count lit, with the quiet glow of the dark logo.
 *
 * @returns The plate.
 */
export function HeroPlate() {
  const { locale, t } = useI18n();
  const { packages, products, stages } = ecosystemCounts();
  const entries = stagedEntries();
  const center = Math.floor(entries.length / 2);

  return (
    <nav
      aria-label={t.home.plate.ariaLabel}
      className="grid grid-cols-3 self-start border-t border-l border-[var(--tuwa-border-primary)] bg-[var(--tuwa-docs-raised)] lg:mt-[42px]"
    >
      {entries.slice(0, center).map((entry) => (
        <PlateLink key={entry.id} entry={entry} />
      ))}
      <div
        className={`${cellClassName} items-start justify-end gap-1 p-3.5 text-left bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)] dark:bg-[var(--tuwa-docs-sunken)] dark:text-[var(--tuwa-text-primary)]`}
      >
        <b className="tuwa-docs-glow mb-1.5 font-mono text-[42px] font-medium leading-none tracking-[-0.03em] dark:text-[var(--tuwa-docs-lit)]">
          {packages}
        </b>
        <span className="font-mono text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em]">
          {formatPlural(t.home.plate.packagesOnNpm, packages, locale)}
        </span>
        <span className="font-mono text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-[#c9c8c5] dark:text-[var(--tuwa-text-secondary)]">
          {formatPlural(t.home.plate.products, products, locale)}
        </span>
        <span className="font-mono text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-[#c9c8c5] dark:text-[var(--tuwa-text-secondary)]">
          {formatPlural(t.home.plate.stages, stages, locale)}
        </span>
      </div>
      {entries.slice(center).map((entry) => (
        <PlateLink key={entry.id} entry={entry} />
      ))}
    </nav>
  );
}
