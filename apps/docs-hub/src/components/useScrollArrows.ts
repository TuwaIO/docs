'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { scrollEdges, scrollStep } from '@/lib/scrollEdges';

/**
 * Follows a row that scrolls sideways: whether it has more out of sight on its left and on its right, and a way to
 * move it by an arrow.
 *
 * Side effects: a passive `scroll` listener and a `ResizeObserver` on the row and its items while it is mounted;
 * `scroll` moves the row, smoothly unless the reader asked for reduced motion.
 *
 * @param watch - A value that changes when the items of the row change (their count, their names): the edges are read
 * again.
 * @returns `ref` for the row; `before` and `after`, whether it has more on its left and on its right; `scroll`, which
 * moves it one step to the `left` or the `right`.
 */
export function useScrollArrows<T extends HTMLElement>(
  watch: unknown,
): { ref: RefObject<T | null>; before: boolean; after: boolean; scroll: (side: 'left' | 'right') => void } {
  const ref = useRef<T>(null);
  const [edges, setEdges] = useState({ before: false, after: false });

  useEffect(() => {
    const row = ref.current;
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
  }, [watch]);

  const scroll = useCallback((side: 'left' | 'right') => {
    const row = ref.current;
    if (!row) return;
    row.scrollBy({
      left: (side === 'left' ? -1 : 1) * scrollStep(row.clientWidth),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  return { ref, before: edges.before, after: edges.after, scroll };
}
