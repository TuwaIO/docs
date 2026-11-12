'use client';

import { useEffect } from 'react';

import { anchorScrollDuration, anchorScrollTarget } from '../anchor';

/** Starts slowly, runs and settles slowly (ease in and out, quartic). */
const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/** How long the class that marks a landing stays on its part, a little longer than its motion in `site.css`. */
const LANDED_MS = 1200;

/**
 * Makes the links to anchors of the page (`#…`) scroll smoothly to their part: it starts slowly, runs and settles, in
 * 420–960ms by the distance; there a frame of the accent closes in on the part and fades, once (`.tuwa-landed` in
 * `site.css`). The address takes the anchor as a new entry of the history, so Back returns, and the keyboard goes on from
 * the part. A wheel or a touch of the reader stops the scroll where it is. For reduced motion the page goes there at
 * once, without the frame. A click with a modifier key, or on a link to an anchor the page does not have, is left to the
 * browser. Mount it once, anywhere on the page.
 *
 * Side effects: a click listener on the document and wheel and touch listeners on the window while it is mounted; it
 * scrolls the window, adds an entry to the browser history, sets `tabindex="-1"` on a part that cannot take the focus
 * and focuses it.
 *
 * @returns Nothing visible.
 */
export function SmoothAnchors(): null {
  useEffect(() => {
    let frame = 0;
    let landing: ReturnType<typeof setTimeout> | undefined;

    const land = (target: HTMLElement, reduced: boolean) => {
      if (!target.matches('a[href], button, input, select, textarea, [tabindex]'))
        target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (reduced) return;
      clearTimeout(landing);
      target.classList.remove('tuwa-landed');
      // Read the layout so the motion starts again on a part that has just played it
      void target.offsetWidth;
      target.classList.add('tuwa-landed');
      landing = setTimeout(() => target.classList.remove('tuwa-landed'), LANDED_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!(link instanceof HTMLAnchorElement) || link.hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      cancelAnimationFrame(frame);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const from = window.scrollY;
      const to = anchorScrollTarget({
        top: target.getBoundingClientRect().top + from,
        margin: parseFloat(getComputedStyle(target).scrollMarginTop) || 0,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      });
      if (window.location.hash !== link.hash) window.history.pushState(window.history.state, '', link.hash);

      if (reduced || to === from) {
        window.scrollTo(0, to);
        land(target, reduced);
        return;
      }
      const duration = anchorScrollDuration(to - from);
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        window.scrollTo(0, from + (to - from) * ease(progress));
        if (progress < 1) frame = requestAnimationFrame(step);
        else land(target, false);
      };
      frame = requestAnimationFrame(step);
    };
    const stop = () => cancelAnimationFrame(frame);

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(landing);
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };
  }, []);

  return null;
}
