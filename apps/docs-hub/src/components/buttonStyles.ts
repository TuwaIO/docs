/**
 * @file The buttons of the hub in paper and ink, as classes: square, mono caps, no gradient and no shadow. A button
 * takes a size and one of the two fills.
 */

/** The primary fill: the accent of the brand under ink text, a shade deeper under the pointer. */
export const primaryButtonClassName =
  'bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)] hover:bg-[var(--tuwa-button-primary-bg-hover)]';

/** The secondary fill: no fill, a frame of 1px, a breath of ink under the pointer. */
export const secondaryButtonClassName =
  'border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]';

/** The small size: 34px high, mono caps of 11px. `group/button` lets an icon inside follow the pointer. */
export const smallButtonClassName =
  'group/button inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap px-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em] transition-colors';

/**
 * The large size: 44px high, mono caps of 12px, the buttons under a title. `group` lets the arrow inside step under the
 * pointer or the keyboard.
 */
export const largeButtonClassName =
  'group inline-flex h-11 items-center gap-2.5 whitespace-nowrap px-[18px] font-mono text-xs font-bold uppercase leading-none tracking-[0.12em] transition-colors';

/**
 * The pixel arrow of a large button: it steps the way it points while the button is under the pointer or the
 * keyboard (add the `group-hover` and `group-focus-visible` translate of its direction), once, and stays still for
 * reduced motion.
 */
export const buttonArrowClassName =
  'h-3.5 w-3.5 [--tuwa-pixel-ink:currentColor] transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:!translate-none';
