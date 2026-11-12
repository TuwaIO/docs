'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

import { type HandoffPixel, handoffPixel, handoffProgress } from '../pixelHandoff';

/** Props of {@link PixelHandoff}. */
export interface PixelHandoffProps {
  /**
   * Measures the page: the scroll positions where the pixels leave their icons (`start`) and where they rest on the
   * others (`end`), or `null` for a page that has no room to show the flight. Called when the page is measured: on
   * mount, when the window or the page changes its size and when the fonts have loaded, never while scrolling.
   * Default: from the first step of the scroll (a tenth of the window, at most 96px) to when the first icon the pixels
   * land on is two fifths of the way down the window.
   */
  range?: () => { start: number; end: number } | null;
}

type Cell = { x: number; y: number; size: number; lit: boolean; key: string };

/**
 * The pixels of the icons of one end of the flight, by the id the attribute gives, from a corner. The attribute stands
 * on a pixel picture or on a part around one. An icon that is not displayed has none.
 */
function cellsOf(attribute: 'data-handoff-from' | 'data-handoff-to', origin: { left: number; top: number }) {
  const icons = new Map<string, Cell[]>();
  for (const holder of document.querySelectorAll(`[${attribute}]`)) {
    const svg = holder instanceof SVGSVGElement ? holder : holder.querySelector<SVGSVGElement>('svg.tuwa-pixel-art');
    const box = svg?.getBoundingClientRect();
    if (!svg || !box || box.width === 0) continue;
    const size = box.width / (svg.viewBox.baseVal.width || 9);
    icons.set(
      holder.getAttribute(attribute) as string,
      // The planet of the Orbit icon is not on the grid: it shows only while the icon moves
      [...svg.querySelectorAll('rect:not(.tuwa-pixel-art__planet)')].map((rect) => {
        const [x, y] = [Number(rect.getAttribute('x')), Number(rect.getAttribute('y'))];
        return {
          x: box.left - origin.left + x * size,
          y: box.top - origin.top + y * size,
          size,
          lit: rect.hasAttribute('data-lit'),
          key: `${x}-${y}`,
        };
      }),
    );
  }
  return icons;
}

/** The default {@link PixelHandoffProps.range}. */
function rangeToFirstIcon(): { start: number; end: number } | null {
  const first = document.querySelector('[data-handoff-to]')?.getBoundingClientRect();
  if (!first) return null;
  const start = Math.min(96, window.innerHeight * 0.1);
  return { start, end: Math.max(start + 240, first.top + window.scrollY - window.innerHeight * 0.4) };
}

/**
 * The handoff of a page: as the reader scrolls from one part of it to another, the pixels of the pixel icons of the
 * first part (`PixelArt`, `ProjectSquare`) scatter and gather into the same icons of the second part, each pixel on its
 * own arc and a little after or before the others; scrolling back takes them back. Mark an icon the pixels leave with
 * `data-handoff-from="<id>"` and the icon they land on with `data-handoff-to="<id>"`, on the pixel picture or on a
 * part around it: the pixels of an id fly between its two icons, cell to cell.
 *
 * While it is mounted and has pixels to fly, `<html>` carries `data-handoff`: `from` before the flight, `flight`
 * during it and `to` after it. `site.css` hides the icons while their pixels fly (both sets during the flight, the
 * icons the pixels land on before it); a page can stop its own motion of the icons by the same attribute, and the
 * pixels leave from where the icons stand when the flight starts. The pixels are squares in a layer of the page, not of
 * the window, so they scroll with the page and rest exactly on the cells of the icons. Nothing for reduced motion, or
 * where the icons the pixels leave are not displayed, or without the other icons: every icon shows.
 *
 * Place it once, in a positioned part of the page that holds both sets of icons (its layer covers that part).
 *
 * Side effects: sets and removes `data-handoff` on `<html>`; listens to the scroll and the size of the window and of
 * the page; moves its squares with `transform`.
 *
 * @param props - See {@link PixelHandoffProps}.
 * @returns The layer of the pixels, over the part it is placed in.
 */
export function PixelHandoff({ range: rangeOf = rangeToFirstIcon }: PixelHandoffProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const readRange = useEffectEvent(() => rangeOf());

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    let flights: (HandoffPixel & { square: HTMLElement })[] = [];
    let range: { start: number; end: number } | null = null;
    let state = '';
    let frame = 0;

    const land = () => {
      layer.replaceChildren();
      flights = [];
    };

    /** Whether the page has both ends of the flight, and the scroll positions between which it happens. */
    const measure = () => {
      const leaves = document.querySelector('[data-handoff-from]');
      const lands = document.querySelector('[data-handoff-to]');
      range = leaves?.getClientRects().length && lands?.getClientRects().length ? readRange() : null;
    };

    /** The pixels take off from where their icons stand: a page may move them until then. */
    const takeOff = () => {
      // The corner of the page the layer covers: the layer itself measures nothing while it is hidden
      const corner = (layer.parentElement ?? layer).getBoundingClientRect();
      const from = cellsOf('data-handoff-from', corner);
      const to = cellsOf('data-handoff-to', corner);
      land();
      for (const [id, cells] of from) {
        const targets = new Map((to.get(id) ?? []).map((cell) => [cell.key, cell]));
        for (const cell of cells) {
          const target = targets.get(cell.key);
          if (!target) continue;
          const square = document.createElement('span');
          square.className = cell.lit ? 'tuwa-handoff-pixel tuwa-handoff-pixel--lit' : 'tuwa-handoff-pixel';
          layer.append(square);
          flights.push({
            from: { x: cell.x, y: cell.y, size: cell.size },
            to: { x: target.x, y: target.y, size: target.size },
            seed: flights.length,
            square,
          });
        }
      }
    };

    const draw = () => {
      frame = 0;
      const progress = range ? handoffProgress(window.scrollY, range) : 0;
      const next = !range ? '' : progress <= 0 ? 'from' : progress >= 1 ? 'to' : 'flight';
      if (next !== state) {
        // The attribute first: a page stops the motion of its icons by it, so the pixels leave from where they stand
        if (next) root.dataset.handoff = next;
        else delete root.dataset.handoff;
        if (next === 'flight') takeOff();
        else land();
        state = next;
      }
      layer.hidden = state !== 'flight';
      if (state !== 'flight') return;
      for (const flight of flights) {
        const { x, y, size } = handoffPixel(flight, progress);
        // A hair larger than its cell, as the pixels of the icons, so no seam shows
        flight.square.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${size * 1.02})`;
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const remeasure = () => {
      measure();
      // The page changed under the pixels in flight: they take off again from the new places
      if (state === 'flight') state = '';
      request();
    };

    measure();
    draw();
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', remeasure);
    void document.fonts?.ready.then(remeasure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', remeasure);
      land();
      delete root.dataset.handoff;
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      hidden
      className="tuwadocs:pointer-events-none tuwadocs:absolute tuwadocs:inset-0 tuwadocs:z-40 tuwadocs:overflow-clip tuwadocs:motion-reduce:hidden"
    />
  );
}
