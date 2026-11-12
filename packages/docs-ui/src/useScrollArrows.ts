'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { scrollEdges, scrollStep } from './scrollEdges';

/** What {@link useScrollEdges} knows of a row that scrolls sideways. */
export interface ScrollEdges {
  /** Whether the row has more out of sight on its left */
  before: boolean;
  /** Whether the row has more out of sight on its right */
  after: boolean;
  /** Moves the row one step to the `left` or the `right`, smoothly unless the reader asked for reduced motion */
  scroll: (side: 'left' | 'right') => void;
}

/**
 * Follows a row that scrolls sideways: whether it has more out of sight on its left and on its right, and a way to
 * move it by an arrow ({@link ScrollArrow}).
 *
 * Side effects: a passive `scroll` listener and a `ResizeObserver` on the row and its items while it is mounted;
 * `scroll` moves the row.
 *
 * @param rowRef - The row. It is read after the layout effects of the component, so a component may find the row in
 * the page in a layout effect of its own.
 * @param watch - A value that changes when the items of the row change (their count, their names): the edges are read
 * again.
 * @returns See {@link ScrollEdges}.
 */
export function useScrollEdges(rowRef: RefObject<HTMLElement | null>, watch: unknown): ScrollEdges {
  const [edges, setEdges] = useState({ before: false, after: false });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const read = () => {
      const next = scrollEdges(row);
      setEdges((current) => (current.before === next.before && current.after === next.after ? current : next));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(row);
    for (const item of row.children) observer.observe(item);
    row.addEventListener('scroll', read, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener('scroll', read);
    };
  }, [rowRef, watch]);

  const scroll = useCallback(
    (side: 'left' | 'right') => {
      const row = rowRef.current;
      if (!row) return;
      row.scrollBy({
        left: (side === 'left' ? -1 : 1) * scrollStep(row.clientWidth),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    },
    [rowRef],
  );

  return { before: edges.before, after: edges.after, scroll };
}

/**
 * {@link useScrollEdges} for a row the component renders itself.
 *
 * @param watch - A value that changes when the items of the row change (their count, their names): the edges are read
 * again.
 * @returns `ref` for the row, and what {@link useScrollEdges} returns.
 */
export function useScrollArrows<T extends HTMLElement>(watch: unknown): ScrollEdges & { ref: RefObject<T | null> } {
  const ref = useRef<T>(null);
  return { ref, ...useScrollEdges(ref, watch) };
}
