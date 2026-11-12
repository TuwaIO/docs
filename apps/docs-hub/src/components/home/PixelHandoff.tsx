'use client';

import { useEffect, useRef } from 'react';

import { type HandoffPixel, handoffPixel, handoffProgress } from '@/lib/pixelHandoff';

/** The height of the fixed header: the plate leaves the view under it. */
const HEADER = 56;

/** The pixels of the icons of a part (`data-plate-icon` or `data-board-icon`), by project id, from a corner. */
function cellsOf(attribute: 'data-plate-icon' | 'data-board-icon', origin: { left: number; top: number }) {
  const icons = new Map<string, { x: number; y: number; size: number; lit: boolean; key: string }[]>();
  for (const svg of document.querySelectorAll<SVGSVGElement>(`svg[${attribute}]`)) {
    const box = svg.getBoundingClientRect();
    const grid = svg.viewBox.baseVal.width || 9;
    const size = box.width / grid;
    icons.set(
      svg.getAttribute(attribute) as string,
      [...svg.querySelectorAll('rect')].map((rect) => {
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

/**
 * The handoff of the main page: scrolling from the hero to the ecosystem, the pixels of the icons of the projects
 * scatter from the plate of the hero and gather into the icons of the same projects on the board, each pixel on its own
 * arc and a little after or before the others; scrolling back takes them back. The icons themselves hide while their
 * pixels fly (`html[data-handoff]` in `globals.css`): on the plate before, on the board after. The pixels are squares
 * in a layer of the page, not of the window, so they scroll with the page and rest exactly on the cells of the icons
 * (drawn over the window, they trailed the scroll by a frame and shook against the board). Nothing for reduced motion,
 * or without the plate or the board: both show their icons.
 *
 * Side effects: sets `data-handoff` on `<html>` while it is mounted; listens to the scroll and the size of the window and
 * of the page; moves its squares with `transform`.
 *
 * @returns The layer of the pixels, over the page it is placed in.
 */
export function PixelHandoff() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    let flights: (HandoffPixel & { square: HTMLElement })[] = [];
    let range = { start: 0, end: 1 };
    let frame = 0;

    const measure = () => {
      // The corner of the page the layer covers: the layer itself measures nothing while it is hidden
      const origin = (layer.parentElement ?? layer).getBoundingClientRect();
      const plate = cellsOf('data-plate-icon', origin);
      const board = cellsOf('data-board-icon', origin);
      layer.replaceChildren();
      flights = [];
      for (const [id, from] of plate) {
        const to = new Map((board.get(id) ?? []).map((cell) => [cell.key, cell]));
        for (const cell of from) {
          const target = to.get(cell.key);
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
      const plateBox = document.querySelector('svg[data-plate-icon]')?.closest('nav')?.getBoundingClientRect();
      const lanes = document.querySelector('#ecosystem [data-lanes]')?.getBoundingClientRect();
      if (!plateBox || !lanes) {
        layer.replaceChildren();
        flights = [];
        return;
      }
      // From when the plate starts to leave the view under the header to when the first row of the board sits a third
      // of the way down the window
      const start = Math.max(0, plateBox.top + window.scrollY - HEADER - window.innerHeight * 0.35);
      const end = Math.max(start + 240, lanes.top + window.scrollY - window.innerHeight * 0.3);
      range = { start, end };
    };

    const draw = () => {
      frame = 0;
      const progress = handoffProgress(window.scrollY, range);
      const state = flights.length === 0 ? '' : progress <= 0 ? 'plate' : progress >= 1 ? 'board' : 'flight';
      if (state) root.dataset.handoff = state;
      else delete root.dataset.handoff;
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
      layer.replaceChildren();
      delete root.dataset.handoff;
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      hidden
      className="pointer-events-none absolute inset-0 z-40 overflow-clip motion-reduce:hidden"
    />
  );
}
