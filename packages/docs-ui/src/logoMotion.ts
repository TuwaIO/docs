/**
 * @file The motion of the TUWA logo under the pointer, as numbers: how far its pixels are thrown at each moment of the
 * burst a press starts. Pure: the browser is written in `LogoMotion`.
 */

/** How far the pixels of the logo tremble under the pointer, in pixels. */
export const LOGO_SHAKE = 2;

/** How far a press throws them at most, in pixels. */
export const LOGO_BURST = 16;

/** How long the burst of a press lasts, in milliseconds. */
export const LOGO_BURST_MS = 700;

/** How often the pixels take new places while they tremble, in milliseconds: steps, not a smooth wave. */
export const LOGO_STEP_MS = 70;

/** The shares of the burst at which the pixels are fully apart, and at which they start back. */
const APART_AT = 0.15;
const BACK_AT = 0.38;

/**
 * How far the pixels of the logo are thrown at a moment of the burst a press starts: out fast, to the full distance
 * after a sixth of the time; apart for a moment, long enough to see; then back, slower and slower, to where the burst
 * leaves them.
 *
 * @param elapsed - The time since the press, in milliseconds.
 * @param rest - Where the burst leaves the pixels: the tremble if the pointer is still over the logo, else 0.
 * @returns The distance, in pixels: `rest` once the burst is over.
 */
export function logoBurst(elapsed: number, rest: number): number {
  const time = Math.min(1, Math.max(0, elapsed / LOGO_BURST_MS));
  if (time >= 1) return rest;
  if (time < APART_AT) return rest + (LOGO_BURST - rest) * (time / APART_AT);
  if (time < BACK_AT) return LOGO_BURST;
  const back = (time - BACK_AT) / (1 - BACK_AT);
  return rest + (LOGO_BURST - rest) * (1 - back) ** 3;
}
