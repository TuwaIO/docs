'use client';

import { useEffect, useRef } from 'react';

import { LOGO_BURST_MS, LOGO_SHAKE, LOGO_STEP_MS, logoBurst } from '../logoMotion';

/** The id of the filter that moves the pixels of the logo; `site.css` applies it to a logo that is in motion. */
export const LOGO_FILTER_ID = 'tuwa-logo-pixels';

/**
 * A point every 3px, the size of a pixel of the logo, drawn by an image: in Safari the logo vanished under the pointer,
 * since WebKit draws nothing at all for a filter that tiles a point with `feTile`. Placed at (-60, -60) and 600 × 240 px
 * in the space of the logo, it covers the filter region of a logo up to about 370px wide, with the point of each block at
 * the place the tiled one had.
 */
const POINTS = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240"><defs><pattern id="p" width="3" height="3" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="1" height="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>',
)}`;

/**
 * Gives the TUWA logo (`SiteLogo`, every `.tuwa-logo` of the page) its motion: under the pointer its pixels tremble a
 * little, taking new places in steps, until the pointer leaves; a press throws them apart and they come back, once. The
 * logo itself is not touched: its images and where they come from stay as they are, and a filter over them moves what
 * they show in blocks the size of a pixel of the logo. Nothing moves for reduced motion. Mount it once, anywhere on the
 * page.
 *
 * Side effects: `pointerover`, `pointerout` and `pointerdown` listeners on the document while it is mounted; it sets
 * `data-pixels` on the logo in motion and removes it when the motion ends, and runs animation frames only meanwhile.
 *
 * @returns The filter, in an `svg` that takes no place on the page.
 */
export function LogoMotion() {
  const noise = useRef<SVGFETurbulenceElement>(null);
  const shift = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const turbulence = noise.current;
    const displacement = shift.current;
    if (!turbulence || !displacement) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let logo: Element | null = null;
    let hovered = false;
    let burstAt = -Infinity;
    let steppedAt = 0;
    let seed = 1;
    let frame = 0;

    const end = () => {
      logo?.removeAttribute('data-pixels');
      logo = null;
      displacement.setAttribute('scale', '0');
    };

    const tick = (now: number) => {
      frame = 0;
      const bursting = now - burstAt < LOGO_BURST_MS;
      if (!logo || (!hovered && !bursting)) return end();
      if (now - steppedAt >= LOGO_STEP_MS) {
        steppedAt = now;
        seed = (seed % 97) + 1;
        turbulence.setAttribute('seed', String(seed));
      }
      const rest = hovered ? LOGO_SHAKE : 0;
      displacement.setAttribute('scale', String(bursting ? logoBurst(now - burstAt, rest) : rest));
      frame = requestAnimationFrame(tick);
    };

    const start = (target: Element) => {
      if (logo && logo !== target) logo.removeAttribute('data-pixels');
      logo = target;
      logo.setAttribute('data-pixels', '');
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const logoOf = (event: Event) => (event.target instanceof Element ? event.target.closest('.tuwa-logo') : null);

    const onOver = (event: PointerEvent) => {
      const target = logoOf(event);
      // A touch has no pointer to hold over the logo: it gets the burst of its press alone
      if (!target || reduced.matches || event.pointerType === 'touch') return;
      hovered = true;
      start(target);
    };
    const onOut = (event: PointerEvent) => {
      const target = logoOf(event);
      if (!target || target !== logo) return;
      // Still over the logo: the pointer went from one of its parts to another
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
      hovered = false;
    };
    const onDown = (event: PointerEvent) => {
      const target = logoOf(event);
      if (!target || reduced.matches) return;
      burstAt = performance.now();
      start(target);
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('pointerdown', onDown);
    return () => {
      cancelAnimationFrame(frame);
      end();
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Room around the logo for the pixels a press throws out of it */}
        <filter id={LOGO_FILTER_ID} x="-15%" y="-40%" width="130%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.11" numOctaves="1" seed="1" result="noise" />
          {/* The noise in blocks of 3px, the size of a pixel of the logo: a point of it every 3px, grown to a block, so a
              pixel moves whole rather than melts. The points are an image (POINTS): WebKit draws nothing for feTile */}
          <feImage href={POINTS} x="-60" y="-60" width="600" height="240" preserveAspectRatio="none" result="points" />
          <feComposite in="noise" in2="points" operator="in" result="samples" />
          <feMorphology in="samples" operator="dilate" radius="1" result="blocks" />
          <feDisplacementMap
            ref={shift}
            in="SourceGraphic"
            in2="blocks"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
