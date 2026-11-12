/**
 * @file The parts of the Playground in paper and ink, as classes: lines of 1px, mono caps, square fields and menus on
 * the raised paper, with no fill of glass, no shadow and no round corner.
 */

/** A line of 1px of the hub. */
export const lineClassName = 'border-[var(--tuwa-border-primary)]';

/** The labels of the Playground: mono caps of 11px. */
export const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';

/**
 * A field in the look of an unpressed `Choice` of the configurator, 34px high: a frame of 1px, mono caps, a breath of
 * ink under the pointer. A button, a menu button or the frame of a select.
 */
export const fieldClassName =
  'inline-flex h-[34px] cursor-pointer items-center gap-2 border border-[var(--tuwa-border-strong)] px-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] whitespace-nowrap text-[var(--tuwa-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]';

/** A menu that drops from a field: the raised paper in a frame of 1px, with no shadow. */
export const menuClassName =
  'absolute top-full left-0 z-30 mt-1 flex flex-col border border-[var(--tuwa-border-strong)] bg-[var(--tuwa-docs-raised)] p-1';

/** An option of such a menu: mono caps; the chosen one is a block of ink. */
export const menuOptionClassName =
  'flex cursor-pointer items-center gap-2 px-2.5 py-2 text-left font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-[var(--tuwa-text-secondary)] transition-colors hover:text-[var(--tuwa-text-primary)] aria-selected:bg-[var(--tuwa-text-primary)] aria-selected:text-[var(--tuwa-docs-paper)]';

/** A pixel icon of 16px in a field or a cell. */
export const iconClassName = 'h-4 w-4 shrink-0';
