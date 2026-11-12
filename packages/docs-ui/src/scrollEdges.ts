/**
 * @file A row that scrolls sideways, as numbers: whether it has more out of sight on either side, and how far an arrow
 * moves it. Pure functions: the browser is read in `useScrollArrows`.
 */

/**
 * Whether a row that scrolls sideways has content out of sight on its two sides. A pixel of slack: a browser may report
 * a scroll position a fraction short of the end.
 *
 * @param row - The row, as its element reports it.
 * @param row.scrollLeft - How far the row is scrolled, in pixels.
 * @param row.clientWidth - The width of the row in sight.
 * @param row.scrollWidth - The width of all its content.
 * @returns `before`: more on the left; `after`: more on the right.
 */
export function scrollEdges(row: { scrollLeft: number; clientWidth: number; scrollWidth: number }): {
  before: boolean;
  after: boolean;
} {
  return { before: row.scrollLeft > 1, after: row.scrollLeft + row.clientWidth < row.scrollWidth - 1 };
}

/**
 * How far an arrow moves the row: most of what is in sight, so the last item the reader saw stays in sight, and never
 * less than an item.
 *
 * @param clientWidth - The width of the row in sight.
 * @returns The distance, in pixels.
 */
export function scrollStep(clientWidth: number): number {
  return Math.max(120, Math.round(clientWidth * 0.7));
}
