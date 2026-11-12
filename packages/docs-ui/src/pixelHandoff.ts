/**
 * @file The handoff of a page (`PixelHandoff`), as numbers: how far it has gone at a scroll position and where each
 * pixel is on its way. Pure functions: the browser is read and written in the component.
 */

/** A square of a pixel in the coordinates of the page: its top left corner and its side. */
export interface PixelBox {
  x: number;
  y: number;
  size: number;
}

/** A pixel that flies from its cell on the icon it leaves to its cell on the icon it lands on, with its seed. */
export interface HandoffPixel {
  from: PixelBox;
  to: PixelBox;
  /** A number of its own (its index), which sets its delay and its arc */
  seed: number;
}

/** The share of the flight by which the last pixel starts after the first. */
const STAGGER = 0.35;

/** A number in [0, 1) from a seed and a salt, the same on every render. */
function noise(seed: number, salt: number): number {
  let value = Math.imul(seed + 1, 0x9e3779b1) ^ Math.imul(salt + 7, 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 15), 0x2c1b3c6d);
  return ((value ^ (value >>> 12)) >>> 0) / 2 ** 32;
}

/** Eases in and out (cubic). */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * How far the handoff has gone at a scroll position.
 *
 * @param scrollY - The scroll position of the page.
 * @param range - The scroll positions where the pixels leave their icons and where they rest on the others.
 * @param range.start - Where they leave.
 * @param range.end - Where they rest.
 * @returns 0 before the start, 1 after the end, the share between.
 */
export function handoffProgress(scrollY: number, range: { start: number; end: number }): number {
  if (range.end <= range.start) return scrollY >= range.end ? 1 : 0;
  return Math.min(1, Math.max(0, (scrollY - range.start) / (range.end - range.start)));
}

/**
 * Where a pixel of the handoff is: it leaves its cell a little after or before the others, flies on an arc of its own
 * (out to one side and back, as the icon scatters and gathers) and grows or shrinks to the size of the cell it lands
 * on. At 0 it is on the cell it leaves, at 1 on the cell it lands on.
 *
 * @param pixel - The pixel.
 * @param progress - How far the handoff has gone, from 0 to 1.
 * @returns Its square in the coordinates of the page.
 */
export function handoffPixel(pixel: HandoffPixel, progress: number): PixelBox {
  const delay = noise(pixel.seed, 1) * STAGGER;
  const t = ease(Math.min(1, Math.max(0, (progress - delay) / (1 - STAGGER))));
  const angle = noise(pixel.seed, 2) * Math.PI * 2;
  const reach = (40 + noise(pixel.seed, 3) * 140) * Math.sin(Math.PI * t);
  return {
    x: pixel.from.x + (pixel.to.x - pixel.from.x) * t + Math.cos(angle) * reach,
    y: pixel.from.y + (pixel.to.y - pixel.from.y) * t + Math.sin(angle) * reach,
    size: pixel.from.size + (pixel.to.size - pixel.from.size) * t,
  };
}
