'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

import {
  activeWaypoint,
  approach,
  flightEnd,
  flightPercent,
  flightProgress,
  readingStops,
  turnsBack,
  WAYPOINT_REACH,
  waypointStops,
} from '@/lib/flightPlan';

/** What the flight plan knows of the page once it has measured it. */
export interface FlightMeasure {
  /** The flight at which each waypoint is reached, from 0 to 1 (the last one), in the order of the page */
  stops: number[];
  /** How far the craft of the rail travels from the first waypoint to the Earth, in pixels (0 while it is hidden) */
  railTravel: number;
  /** How far the craft of the strip travels from edge to the Earth, in pixels (0 while the strip is hidden) */
  stripTravel: number;
  /** The margin of the page on the left of its column, where the rail stands, in pixels */
  margin: number;
  /** The width of the longest name of a section among the labels of the rail, in pixels */
  sectionNames: number;
  /** The width of the longest name of a stage among the labels of the rail, in pixels */
  stageNames: number;
}

/** Where the craft is heading: `ahead` down the page (to the Earth), `back` up the page. */
export type FlightHeading = 'ahead' | 'back';

/** How long after the craft has stopped its flame goes out, in milliseconds. */
const FLAME_OUT_MS = 140;

const sameMeasure = (a: FlightMeasure | null, b: FlightMeasure) =>
  !!a &&
  a.railTravel === b.railTravel &&
  a.stripTravel === b.stripTravel &&
  a.margin === b.margin &&
  a.sectionNames === b.sectionNames &&
  a.stageNames === b.stageNames &&
  a.stops.length === b.stops.length &&
  a.stops.every((stop, index) => Math.abs(stop - (b.stops[index] as number)) < 0.0005);

/** The width of the widest of the elements, in whole pixels. */
const widest = (elements: Iterable<Element>) =>
  Math.ceil(Math.max(0, ...[...elements].map((element) => element.getBoundingClientRect().width)));

/**
 * Flies the craft of the flight plan with the scroll of the page, from the top of the page to its last waypoint: the
 * flight is over where a link to that waypoint leaves the page, and the craft stays there to the end of the page. It
 * measures where the parts of the page start (on mount, when the window or the page changes its size and when the fonts
 * have loaded, never while scrolling), follows the scroll with a passive listener and moves the craft in animation
 * frames, eased; for reduced motion the craft is where the scroll is at once, with no flame.
 *
 * Side effects, on the element of `rootRef` and its descendants, without a render of React: the custom properties
 * `--flight` (the flight so far, 0 to 1), `--flight-y` and `--flight-x` (the way of the craft of the rail and of the
 * strip, in whole pixels); the attributes `data-ready` (the page is measured), `data-moving` (the craft is under way)
 * and `data-arrived` (it is at the end of the flight); the text of every `[data-flight-percent]` and the
 * `aria-valuenow` of every `[role="progressbar"]`. On the page: `data-flight="here"` on the part the reader reads,
 * removed from the others. Listeners: `scroll` and `resize` on the window, a `ResizeObserver` on the body and on the
 * tracks, the reduced-motion media query.
 *
 * @param ids - The ids of the parts of the page that are waypoints, in the order of the page.
 * @param fixed - What of the rail and of the strip is not the way of the craft, in pixels: the length of the way is
 * the height of `[data-flight-rail]` less `fixed.rail`, and the width of `[data-flight-strip]` less `fixed.strip`.
 * @param fixed.rail - For the rail: the hull of the craft and the Earth with the space around it.
 * @param fixed.strip - For the strip: the same. The margin of the page is the left edge of `[data-flight-column]`;
 * the widths of the names are those of `[data-flight-name="section"]` and `[data-flight-name="stage"]`.
 * @returns `rootRef` for the element that holds the rail and the strip; the measure of the page (`null` before the
 * first one); `here`, the index of the waypoint whose part the reader reads (the craft has locked on it: its part has
 * come up to the reading line of the window); `reached`, the index of the last waypoint the craft has reached (its
 * part has been at its place under the header), both -1 before the first waypoint, `reached` never ahead of `here`;
 * and `heading`, which way the craft flew last.
 */
export function useFlight(
  ids: readonly string[],
  fixed: { rail: number; strip: number },
): {
  rootRef: RefObject<HTMLDivElement | null>;
  measure: FlightMeasure | null;
  here: number;
  reached: number;
  heading: FlightHeading;
} {
  const rootRef = useRef<HTMLDivElement>(null);
  const [measure, setMeasure] = useState<FlightMeasure | null>(null);
  const [active, setActive] = useState({ here: -1, reached: -1 });
  const [heading, setHeading] = useState<FlightHeading>('ahead');
  const key = ids.join(' ');
  const { rail: railFixed, strip: stripFixed } = fixed;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const partIds = key.split(' ');
    const rail = root.querySelector<HTMLElement>('[data-flight-rail]');
    const column = root.querySelector<HTMLElement>('[data-flight-column]');
    const strip = root.querySelector<HTMLElement>('[data-flight-strip]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let end = 0;
    let stops: number[] = [];
    let reads: number[] = [];
    let railTravel = 0;
    let stripTravel = 0;
    let shown = 0;
    let target = 0;
    let frame = 0;
    let measuring = 0;
    let last = 0;
    let flameOut: ReturnType<typeof setTimeout> | undefined;
    let percent = -1;
    let here = -2;
    let reached = -2;
    let back = false;
    let ready = false;

    const paint = () => {
      root.style.setProperty('--flight', shown.toFixed(5));
      root.style.setProperty('--flight-y', `${Math.round(shown * railTravel)}px`);
      root.style.setProperty('--flight-x', `${Math.round(shown * stripTravel)}px`);
      root.toggleAttribute('data-arrived', shown >= 1 - WAYPOINT_REACH);

      const nextPercent = flightPercent(shown);
      if (nextPercent !== percent) {
        percent = nextPercent;
        const text = String(percent).padStart(3, '0');
        for (const element of root.querySelectorAll('[data-flight-percent]')) element.textContent = text;
        for (const bar of root.querySelectorAll('[role="progressbar"]'))
          bar.setAttribute('aria-valuenow', String(percent));
      }

      const nextHere = activeWaypoint(reads, shown);
      const nextReached = activeWaypoint(stops, shown);
      if (nextHere === here && nextReached === reached) return;
      if (nextHere !== here)
        partIds.forEach((id, index) => {
          const part = document.getElementById(id);
          if (index === nextHere) part?.setAttribute('data-flight', 'here');
          else part?.removeAttribute('data-flight');
        });
      here = nextHere;
      reached = nextReached;
      setActive({ here, reached });
    };

    const stopFlame = () => root.removeAttribute('data-moving');

    const tick = (now: number) => {
      frame = 0;
      shown = reduced.matches ? target : approach(shown, target, now - last);
      last = now;
      paint();
      if (shown !== target) frame = requestAnimationFrame(tick);
      else flameOut = setTimeout(stopFlame, FLAME_OUT_MS);
    };

    const fly = () => {
      clearTimeout(flameOut);
      // The craft turns to where it is going, once it has a real way to go there
      const nextBack = turnsBack(back, shown, target, Math.max(railTravel, stripTravel));
      if (nextBack !== back) {
        back = nextBack;
        setHeading(back ? 'back' : 'ahead');
      }
      if (!reduced.matches && shown !== target) root.setAttribute('data-moving', '');
      if (frame) return;
      // The first step covers one frame
      last = performance.now() - 16;
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = flightProgress(window.scrollY, end);
      fly();
    };

    const read = () => {
      measuring = 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const parts = partIds.map((id) => {
        const part = document.getElementById(id);
        return part
          ? {
              top: part.getBoundingClientRect().top + window.scrollY,
              margin: parseFloat(getComputedStyle(part).scrollMarginTop) || 0,
            }
          : { top: 0, margin: 0 };
      });
      end = flightEnd(parts, maxScroll);
      stops = waypointStops(parts, end);
      reads = readingStops(parts, end, window.innerHeight);
      railTravel = Math.max(0, (rail?.clientHeight ?? 0) - railFixed);
      stripTravel = Math.max(0, (strip?.clientWidth ?? 0) - stripFixed);
      const next = {
        stops,
        railTravel,
        stripTravel,
        margin: Math.max(0, Math.round(column?.getBoundingClientRect().left ?? 0)),
        sectionNames: widest(root.querySelectorAll('[data-flight-name="section"]')),
        stageNames: widest(root.querySelectorAll('[data-flight-name="stage"]')),
      };
      setMeasure((current) => (sameMeasure(current, next) ? current : next));

      target = flightProgress(window.scrollY, end);
      if (ready) {
        // The page changed under a craft in flight or at rest: it goes on to its new place
        paint();
        fly();
        return;
      }
      // The first measure: the craft starts where the page is, without a flight from the top
      ready = true;
      shown = target;
      paint();
      root.setAttribute('data-ready', '');
    };

    const remeasure = () => {
      if (!measuring) measuring = requestAnimationFrame(read);
    };

    read();
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    if (rail) observer.observe(rail);
    if (strip) observer.observe(strip);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    reduced.addEventListener('change', remeasure);
    let mounted = true;
    void document.fonts?.ready.then(() => mounted && remeasure());

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measuring);
      clearTimeout(flameOut);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      reduced.removeEventListener('change', remeasure);
      for (const id of partIds) document.getElementById(id)?.removeAttribute('data-flight');
    };
  }, [key, railFixed, stripFixed]);

  return { rootRef, measure, here: active.here, reached: active.reached, heading };
}
