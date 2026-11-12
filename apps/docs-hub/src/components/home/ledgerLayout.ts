/**
 * The grid of a package row of a stage ledger and of the heads of its columns: on phones the layer, the name over the
 * version, licence and size, and the arrow; from 768px one line of columns (layer, package, version, licence, gzip,
 * arrow), the heads above them on the same grid.
 */
export const ledgerRowGrid =
  'grid grid-cols-[40px_minmax(0,1fr)_16px] gap-x-3 md:grid-cols-[48px_minmax(0,1fr)_76px_96px_64px_18px]';

/** The sides of a package row: none on phones and tablets, inside the column of the rows from 1024px. */
export const ledgerRowPadding = 'lg:pr-3 lg:pl-4';

/**
 * A product of a ledger from 1024px: the cell of the project (260px, 300px from 1440px) beside its rows; the heads of
 * the columns use the same split.
 */
export const ledgerProductGrid =
  'lg:grid lg:grid-cols-[260px_minmax(0,1fr)] min-[1440px]:grid-cols-[300px_minmax(0,1fr)]';

/** A label in mono caps, as the heads of the columns and the markers of the rows. */
export const ledgerCaps = 'font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em]';

/** The fill of a row under the pointer: a breath of ink. */
export const ledgerHover = 'hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]';
