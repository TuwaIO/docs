'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useScrollEdges } from '../useScrollArrows';
import { ScrollArrow } from './ScrollArrow';

/** Where the row of the pages stands in the header, in pixels from the sides of the header. */
interface RowPlace {
  left: number;
  right: number;
}

/** The line of 1px under the header: the cells of the arrows stand on it, not over it. */
const LINE = 1;

/**
 * The row of a navbar that scrolls sideways: the first child of the `nav` whose content the browser lets scroll that
 * way. In the navbar of `nextra-theme-docs` it is the row of the top-level pages.
 */
const findRow = (nav: Element | null | undefined) =>
  [...(nav?.children ?? [])].find((child): child is HTMLElement =>
    ['auto', 'scroll'].includes(getComputedStyle(child).overflowX),
  ) ?? null;

/**
 * The arrows of the row of top-level pages in the navbar of a TUWA documentation site. Between the phone menu and a
 * wide window the pages do not all fit beside the logo, the search and the switches, and their row scrolls sideways:
 * an arrow on a cell of glass stands over the end that has more, and moves the row ({@link ScrollArrow}). Rendered by
 * {@link Navbar}, inside the `nav` of the header; the arrows are placed over the ends of the row, across the height of
 * the header down to the line under it.
 *
 * Side effects: the row is found in the page after the first render; a `ResizeObserver` on the row and on the header
 * follows where the row stands.
 *
 * @returns The two arrows, hidden while the row has nothing out of sight.
 */
export function NavbarScrollArrows() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLElement | null>(null);
  const [place, setPlace] = useState<RowPlace | null>(null);

  // Before the passive effects, where `useScrollEdges` reads the row
  useLayoutEffect(() => {
    rowRef.current = findRow(anchorRef.current?.closest('nav'));
  }, []);

  const { before, after, scroll } = useScrollEdges(rowRef, null);

  useEffect(() => {
    const row = rowRef.current;
    // The arrows are placed against the header: the nearest positioned part around them. Asked of the part that holds
    // them, because the anchor is hidden and a hidden element has no such part
    const header = anchorRef.current?.parentElement?.offsetParent;
    if (!row || !header) return;
    const read = () => {
      const rowBox = row.getBoundingClientRect();
      const headerBox = header.getBoundingClientRect();
      const next =
        rowBox.width > 0
          ? { left: Math.round(rowBox.left - headerBox.left), right: Math.round(headerBox.right - rowBox.right) }
          : null;
      setPlace((current) => (current?.left === next?.left && current?.right === next?.right ? current : next));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(row);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={anchorRef} hidden />
      {place && (
        <>
          <ScrollArrow
            side="left"
            shown={before}
            onClick={() => scroll('left')}
            style={{ left: place.left, bottom: LINE }}
          />
          <ScrollArrow
            side="right"
            shown={after}
            onClick={() => scroll('right')}
            style={{ right: place.right, bottom: LINE }}
          />
        </>
      )}
    </>
  );
}
