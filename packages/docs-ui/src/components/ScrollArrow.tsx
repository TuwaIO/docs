'use client';

import type { CSSProperties } from 'react';

import { ARROW_RIGHT } from '../pixelArrows';
import { PixelFold } from './PixelFold';

/**
 * An arrow over an end of a row that scrolls sideways, in paper and ink: a pixel arrow on a cell of glass (the paper, a
 * little clear over a light blur of what is under it, with no gradient), on a line of 1px. It shows only while the row
 * has more on its side, and moves the row that way: when it shows, its arrow unfolds, its pixels flying in to their
 * places; when the row reaches its end the pixels fly apart and the cell fades after them ({@link PixelFold}). Its
 * parent is positioned and holds the row; `style` places it elsewhere.
 *
 * A convenience for the pointer: the items of the row are reached by the keyboard and by a swipe, so the arrow is kept
 * from the keyboard and from assistive technology.
 *
 * @param props.side - The end of the row the arrow stands over, and the way it moves the row.
 * @param props.shown - Whether the row has more on that side.
 * @param props.onClick - Moves the row.
 * @param props.style - Styles of the cell, for a place other than the end of its parent.
 * @returns The arrow.
 */
export function ScrollArrow({
  side,
  shown,
  onClick,
  style,
}: {
  side: 'left' | 'right';
  shown: boolean;
  onClick: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={onClick}
      style={style}
      className={`tuwa-docs-glass tuwadocs:group/arrow tuwadocs:absolute tuwadocs:inset-y-0 tuwadocs:z-[2] tuwadocs:grid tuwadocs:w-9 tuwadocs:cursor-pointer tuwadocs:place-items-center tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:transition-[opacity,color] tuwadocs:duration-200 tuwadocs:hover:text-[var(--tuwa-text-primary)] tuwadocs:motion-reduce:transition-none ${side === 'left' ? 'tuwadocs:left-0 tuwadocs:border-r' : 'tuwadocs:right-0 tuwadocs:border-l'} ${
        // The cell fades after the pixels of its arrow have flown apart
        shown
          ? 'tuwadocs:opacity-100'
          : 'tuwadocs:pointer-events-none tuwadocs:opacity-0 tuwadocs:delay-[240ms] tuwadocs:motion-reduce:delay-0'
      }`}
    >
      <PixelFold
        art={ARROW_RIGHT}
        folded={!shown}
        className={`tuwadocs:h-3.5 tuwadocs:w-3.5 tuwadocs:transition-transform tuwadocs:duration-200 tuwadocs:ease-out tuwadocs:motion-reduce:transition-none tuwadocs:motion-reduce:!translate-none ${side === 'left' ? 'tuwadocs:-scale-x-100 tuwadocs:group-hover/arrow:-translate-x-0.5' : 'tuwadocs:group-hover/arrow:translate-x-0.5'}`}
      />
    </button>
  );
}
