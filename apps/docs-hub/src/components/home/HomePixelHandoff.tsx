'use client';

import { PixelHandoff } from '@tuwaio/docs-ui';

/** The height of the fixed header: the plate leaves the view under it. */
const HEADER = 56;

/**
 * Where the handoff of the main page happens: from when the plate of the hero starts to leave the view under the
 * header to when the first row of the board sits a third of the way down the window.
 *
 * @returns The two scroll positions, or `null` without the plate or the board.
 */
function plateToBoard(): { start: number; end: number } | null {
  const plate = document.querySelector('[data-handoff-from]')?.closest('nav')?.getBoundingClientRect();
  const lanes = document.querySelector('#ecosystem [data-lanes]')?.getBoundingClientRect();
  if (!plate || !lanes) return null;
  const start = Math.max(0, plate.top + window.scrollY - HEADER - window.innerHeight * 0.35);
  return { start, end: Math.max(start + 240, lanes.top + window.scrollY - window.innerHeight * 0.3) };
}

/**
 * The handoff of the main page (`PixelHandoff` of docs-ui): scrolling from the hero to the ecosystem, the pixels of the
 * icons of the projects scatter from the plate of the hero and gather into the icons of the same projects on the board;
 * scrolling back takes them back.
 *
 * @returns The layer of the pixels, over the page it is placed in.
 */
export function HomePixelHandoff() {
  return <PixelHandoff range={plateToBoard} />;
}
