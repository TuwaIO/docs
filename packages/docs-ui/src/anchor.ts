/**
 * The address of a page without its anchor: its path and its query. A change of the language or the theme starts the
 * page anew, not at the part a link of the page opened: the anchor goes, the query (such as the shared stack of a
 * configurator) stays.
 *
 * @param location - The path and the query of the page, as `window.location` has them.
 * @param location.pathname - The path.
 * @param location.search - The query, with its `?`, or an empty string.
 * @returns The path followed by the query.
 */
export function addressWithoutAnchor(location: { pathname: string; search: string }): string {
  return `${location.pathname}${location.search}`;
}

/**
 * Removes the anchor (`#…`) from the address of the page in place, keeping the entry of the history and its state (the
 * router of Next.js keeps its own in it), and the scroll position.
 *
 * Side effects: replaces the current entry of the browser history; nothing without an anchor or outside the browser.
 */
export function dropAnchor(): void {
  if (typeof window === 'undefined' || !window.location.hash) return;
  window.history.replaceState(window.history.state, '', addressWithoutAnchor(window.location));
}

/**
 * How long the scroll to an anchor of the page takes: 420ms for a short hop, longer the farther it goes, at most 960ms
 * across a long page.
 *
 * @param distance - The distance of the scroll in pixels, up or down.
 * @returns The duration in milliseconds.
 */
export function anchorScrollDuration(distance: number): number {
  return Math.round(Math.min(960, 420 + Math.abs(distance) * 0.18));
}

/**
 * The scroll position that brings a part of the page to its place under the header: its top, less its
 * `scroll-margin-top`, within the page.
 *
 * @param params - The part and the page.
 * @param params.top - The top of the part from the top of the page, in pixels.
 * @param params.margin - Its `scroll-margin-top`, in pixels.
 * @param params.maxScroll - The largest scroll position of the page.
 * @returns The scroll position.
 */
export function anchorScrollTarget(params: { top: number; margin: number; maxScroll: number }): number {
  return Math.max(0, Math.min(params.top - params.margin, params.maxScroll));
}
