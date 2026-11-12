'use client';

import { PixelArt } from '@tuwaio/docs-ui';

import { ARROW_RIGHT } from './home/pixelArrows';

/**
 * An arrow over an end of a row that scrolls sideways, in paper and ink: a pixel arrow on a cell of glass (the paper, a
 * little clear over a light blur of what is under it, with no gradient), on a line of 1px. It shows, softly, only while
 * the row has more on its side, and moves the row that way. Its parent is positioned and holds the row.
 *
 * A convenience for the pointer: the items of the row are reached by the keyboard and by a swipe, so the arrow is kept
 * from the keyboard and from assistive technology.
 *
 * @param props.side - The end of the row the arrow stands over, and the way it moves the row.
 * @param props.shown - Whether the row has more on that side.
 * @param props.onClick - Moves the row.
 * @returns The arrow.
 */
export function ScrollArrow({ side, shown, onClick }: { side: 'left' | 'right'; shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={onClick}
      className={`group/arrow absolute inset-y-0 z-[2] grid w-9 cursor-pointer place-items-center border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)] transition-[opacity,color] duration-200 tuwa-docs-glass hover:text-[var(--tuwa-text-primary)] motion-reduce:transition-none ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'} ${shown ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <PixelArt
        art={ARROW_RIGHT}
        className={`h-3.5 w-3.5 [--tuwa-pixel-ink:currentColor] transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:!translate-none ${side === 'left' ? '-scale-x-100 group-hover/arrow:-translate-x-0.5' : 'group-hover/arrow:translate-x-0.5'}`}
      />
    </button>
  );
}
