/**
 * @file The model of the star field of `StarryBackground`, apart from the canvas: how many stars a window holds, the
 * stars themselves, the pairs close enough to be joined by a line and the pixels of a dotted line. Pure functions,
 * tested on their own.
 */

/** The narrowest window with stars, in CSS pixels: phones have none. */
export const STARFIELD_MIN_WIDTH = 768;

/** The media query of the windows with stars. */
export const STARFIELD_QUERY = `(min-width: ${STARFIELD_MIN_WIDTH}px)`;

/** How far apart two stars may be and still be joined by a dotted line, in CSS pixels. */
export const LINE_MAX_DISTANCE = 120;

/** The step of the dotted lines, in CSS pixels: a pixel of 1px, then a gap of 2px. */
export const LINE_DOT_STEP = 3;

/** One star for so many square CSS pixels of the window, within the bounds below. */
const AREA_PER_STAR = 18_000;
const MIN_STARS = 48;
const MAX_STARS = 150;

/** The share of the stars lit in the colour of the brand: the rare bright ones. */
const LIT_SHARE = 0.1;

/** The shares of the kinds of stars: specks of dust, larger stars and the rest sparkles. */
const DUST_SHARE = 0.55;
const STAR_SHARE = 0.33;

/** The fastest drift, in CSS pixels per millisecond on each axis: about 9px a second. */
const MAX_DRIFT = 0.009;

/** A twinkle takes 2.5 to 4.5 seconds. */
const TWINKLE_PERIOD_MIN = 2_500;
const TWINKLE_PERIOD_RANGE = 2_000;

/** A speck of dust (one pixel), a star (a larger pixel) or a sparkle (a pixel with four arms). */
export type StarKind = 'dust' | 'star' | 'sparkle';

/** A star of the field. */
export interface Star {
  /** Where it is, in CSS pixels from the top left corner of the window. */
  x: number;
  y: number;
  /** Its drift, in CSS pixels per millisecond. */
  vx: number;
  vy: number;
  kind: StarKind;
  /** Whether it shines in the colour of the brand rather than in ink. */
  lit: boolean;
  /** Where it is in its twinkle, in radians: fixed, so a still star keeps its brightness. */
  phase: number;
  /** How fast it twinkles, in radians per millisecond. */
  speed: number;
}

/**
 * How many stars a window holds: one for every 18,000 square CSS pixels, from 48 to 150, and none in a window narrower
 * than {@link STARFIELD_MIN_WIDTH}.
 *
 * @param width - The width of the window, in CSS pixels.
 * @param height - Its height, in CSS pixels.
 * @returns The number of stars.
 */
export function starCount(width: number, height: number): number {
  if (width < STARFIELD_MIN_WIDTH || height <= 0) return 0;
  return Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round((width * height) / AREA_PER_STAR)));
}

/**
 * The stars of a window, spread at random over it: mostly specks of dust, a third larger stars, a few sparkles, one in
 * ten lit in the colour of the brand, each drifting and twinkling at its own pace.
 *
 * @param width - The width of the window, in CSS pixels.
 * @param height - Its height, in CSS pixels.
 * @param random - The source of random numbers in [0, 1) (default: `Math.random`).
 * @returns The stars, {@link starCount} of them.
 */
export function createStars(width: number, height: number, random: () => number = Math.random): Star[] {
  return Array.from({ length: starCount(width, height) }, () => {
    const pick = random();
    return {
      x: random() * width,
      y: random() * height,
      vx: (random() - 0.5) * 2 * MAX_DRIFT,
      vy: (random() - 0.5) * 2 * MAX_DRIFT,
      kind: pick < DUST_SHARE ? 'dust' : pick < DUST_SHARE + STAR_SHARE ? 'star' : 'sparkle',
      lit: random() < LIT_SHARE,
      phase: random() * Math.PI * 2,
      speed: (Math.PI * 2) / (TWINKLE_PERIOD_MIN + random() * TWINKLE_PERIOD_RANGE),
    };
  });
}

/**
 * The pairs of stars close enough to be joined by a line. The stars are sorted into square cells as wide as the
 * distance, and a star is measured only against the stars of its own cell and of the cells around it, so the work
 * grows with the number of stars, not with the number of pairs.
 *
 * @param stars - The positions of the stars, in CSS pixels.
 * @param maxDistance - The longest line, in CSS pixels (default: {@link LINE_MAX_DISTANCE}).
 * @returns Each pair once, as the indexes of its stars (the lower first) and the square of the distance between them.
 */
export function neighbourPairs(
  stars: readonly { x: number; y: number }[],
  maxDistance: number = LINE_MAX_DISTANCE,
): [number, number, number][] {
  const maxSq = maxDistance * maxDistance;
  const cells = new Map<string, number[]>();
  const cellOf = (index: number) => {
    const star = stars[index]!;
    return [Math.floor(star.x / maxDistance), Math.floor(star.y / maxDistance)] as const;
  };
  stars.forEach((_, index) => {
    const [cx, cy] = cellOf(index);
    const key = `${cx},${cy}`;
    const cell = cells.get(key);
    if (cell) cell.push(index);
    else cells.set(key, [index]);
  });

  const pairs: [number, number, number][] = [];
  const measure = (a: number, b: number) => {
    const dx = stars[a]!.x - stars[b]!.x;
    const dy = stars[a]!.y - stars[b]!.y;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < maxSq) pairs.push(a < b ? [a, b, distanceSq] : [b, a, distanceSq]);
  };
  // Half of the cells around: the right one and the three below, so every two cells meet once
  const forward = [
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ] as const;
  for (const [key, members] of cells) {
    const [cx, cy] = key.split(',').map(Number) as [number, number];
    for (let i = 0; i < members.length; i++)
      for (let j = i + 1; j < members.length; j++) measure(members[i]!, members[j]!);
    for (const [dx, dy] of forward) {
      const other = cells.get(`${cx + dx},${cy + dy}`);
      if (!other) continue;
      for (const a of members) for (const b of other) measure(a, b);
    }
  }
  return pairs;
}

/**
 * The pixels of a dotted line between two stars: one every {@link LINE_DOT_STEP} CSS pixels along it, on whole CSS
 * pixels, leaving a gap of a step at each star.
 *
 * @param x1 - Where the line starts, in CSS pixels.
 * @param y1 - Where the line starts, in CSS pixels.
 * @param x2 - Where it ends, in CSS pixels.
 * @param y2 - Where it ends, in CSS pixels.
 * @param visit - Called with each pixel: its left and top edges.
 * @param step - The distance between two pixels (default: {@link LINE_DOT_STEP}).
 */
export function forEachLineDot(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  visit: (x: number, y: number) => void,
  step: number = LINE_DOT_STEP,
): void {
  const length = Math.hypot(x2 - x1, y2 - y1);
  if (length <= step * 2) return;
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  for (let distance = step; distance <= length - step; distance += step)
    visit(Math.round(x1 + ux * distance), Math.round(y1 + uy * distance));
}

/**
 * How bright a star is in its twinkle, from 0 (dimmest) to 1 (brightest).
 *
 * @param star - The star.
 * @param time - The time, in milliseconds; a still star is drawn at time 0.
 * @returns Its brightness.
 */
export function twinkleOf(star: Pick<Star, 'phase' | 'speed'>, time: number): number {
  return 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
}
