/**
 * @file The parts the comparisons page draws more than once, in paper and ink, as classes.
 */

/** A framed part of the page: raised paper in a frame of 1px. */
export const frameClassName = 'border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-docs-raised)]';

/** A label in mono caps: the heads of columns, the names of groups. */
export const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';

/** A note: a frame of 1px with a strip of the accent down its left side, and no tint. */
export const noteClassName =
  'relative border border-[var(--tuwa-border-primary)] py-3 pr-4 pl-5 before:absolute before:-inset-y-px before:-left-px before:w-[3px] before:bg-[var(--tuwa-docs-lit)]';

/** A square chip in a frame of 1px: a licence, a count. */
export const chipClassName =
  'inline-flex h-6 items-center whitespace-nowrap border border-[var(--tuwa-border-strong)] px-1.5 font-mono text-[11px] leading-none text-[var(--tuwa-text-primary)]';
