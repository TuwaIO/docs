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
