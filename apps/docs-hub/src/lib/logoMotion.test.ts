import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SiteLogo } from '../../../../packages/docs-ui/src/components/Logo';
import { LOGO_FILTER_ID, LogoMotion } from '../../../../packages/docs-ui/src/components/LogoMotion';
import { LOGO_BURST, LOGO_BURST_MS, LOGO_SHAKE, logoBurst } from '../../../../packages/docs-ui/src/logoMotion';

// The TUWA logo in motion: under the pointer its pixels tremble a little, and a press throws them apart for a moment. The
// logo itself stays as it is: the same images from the same addresses, moved by a filter over them

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui/src');
const motion = readFileSync(path.join(docsUi, 'components/LogoMotion.tsx'), 'utf8');
const siteCss = readFileSync(path.join(docsUi, 'styles/site.css'), 'utf8');

describe('the burst of the logo', () => {
  it('throws the pixels out fast, holds them apart for a moment and brings them back', () => {
    expect(logoBurst(0, 0)).toBe(0);
    expect(logoBurst(LOGO_BURST_MS * 0.075, 0)).toBeCloseTo(LOGO_BURST / 2, 6);
    expect(logoBurst(LOGO_BURST_MS * 0.15, 0)).toBeCloseTo(LOGO_BURST, 6);
    // Apart long enough to see
    expect(logoBurst(LOGO_BURST_MS * 0.3, 0)).toBe(LOGO_BURST);
    let before = LOGO_BURST;
    for (let share = 0.4; share < 1; share += 0.05) {
      const now = logoBurst(LOGO_BURST_MS * share, 0);
      expect(now).toBeLessThanOrEqual(before);
      before = now;
    }
    expect(logoBurst(LOGO_BURST_MS, 0)).toBe(0);
    expect(logoBurst(LOGO_BURST_MS * 3, 0)).toBe(0);
    expect(logoBurst(-50, 0)).toBe(0);
  });

  // The pointer is still over the logo when the burst ends: the pixels go back to their tremble, not to rest
  it('leaves the pixels where the pointer has them', () => {
    expect(logoBurst(0, LOGO_SHAKE)).toBe(LOGO_SHAKE);
    expect(logoBurst(LOGO_BURST_MS, LOGO_SHAKE)).toBe(LOGO_SHAKE);
    expect(logoBurst(LOGO_BURST_MS * 0.2, LOGO_SHAKE)).toBe(LOGO_BURST);
    expect(LOGO_SHAKE).toBeLessThan(4);
    expect(LOGO_BURST).toBeGreaterThan(LOGO_SHAKE * 4);
  });
});

describe('the logo in motion', () => {
  // The effect must not change the logo: the same two images from tuwa.io, with no handlers of their own
  it('leaves the logo as it is: its images and where they come from', () => {
    const logo = renderToStaticMarkup(createElement(SiteLogo, {}));
    expect(logo.match(/<img [^>]*src="([^"]+)"/g)).toHaveLength(2);
    expect(logo).toContain('src="https://tuwa.io/brand/logo_v2.svg"');
    expect(logo).toContain('src="https://tuwa.io/brand/logo_glow.svg"');
    expect(logo).toMatch(/<div class="tuwa-logo /);
    const source = readFileSync(path.join(docsUi, 'components/Logo.tsx'), 'utf8');
    expect(source).not.toMatch(/'use client'|onPointer|onMouse|useEffect/);
  });

  it('moves the pixels with a filter over the logo, only while the logo is in motion', () => {
    const markup = renderToStaticMarkup(createElement(LogoMotion));
    expect(LOGO_FILTER_ID).toBe('tuwa-logo-pixels');
    expect(markup).toContain(`<filter id="${LOGO_FILTER_ID}"`);
    // At rest the filter moves nothing, and the logo has no filter or transform layer at all. While active,
    // `transform: translateZ(0)` keeps `feImage` in the logo's local coordinate space in Safari/WebKit so a logo
    // placed past y=180px (footers, scrolled fixed headers) stays inside the points mask instead of vanishing
    expect(markup).toMatch(/<feDisplacementMap in="SourceGraphic" in2="blocks" scale="0"/);
    expect(siteCss).toMatch(
      /\.tuwa-logo\[data-pixels\] \{\s*filter: url\(#tuwa-logo-pixels\);\s*transform: translateZ\(0\);\s*\}/,
    );
    expect(siteCss).not.toMatch(/\.tuwa-logo \{[^}]*(?:filter|transform)/);
    // The noise moves blocks the size of a pixel of the logo, so a pixel moves whole
    expect(markup).toMatch(/<feMorphology in="samples" operator="dilate" radius="1" result="blocks"/);
  });

  // In Safari the logo vanished under the pointer: WebKit draws nothing at all for a filter that tiles a point with
  // `feTile`. The points come from an image of them instead, which every engine draws
  it('draws its points without feTile, over the filter region of the logo', () => {
    const markup = renderToStaticMarkup(createElement(LogoMotion));
    expect(markup).not.toMatch(/<feTile|<feFlood/);
    const image = markup.match(/<feImage [^>]*>/)?.[0] ?? '';
    expect(image).toContain('result="points"');
    expect(image).toMatch(/x="-60" y="-60" width="600" height="240"/);
    const points = decodeURIComponent(image.match(/href="data:image\/svg\+xml;utf8,([^"]+)"/)?.[1] ?? '');
    // A point every 3px, at the same place in each block as before
    expect(points).toContain('<pattern id="p" width="3" height="3" patternUnits="userSpaceOnUse">');
    expect(points).toContain('<rect x="1" y="1" width="1" height="1"/>');
    expect(markup).toMatch(/<feComposite in="noise" in2="points" operator="in" result="samples"/);
  });

  it('trembles under the pointer and bursts on a press, and stops when the pointer leaves', () => {
    for (const event of ['pointerover', 'pointerout', 'pointerdown']) {
      expect(motion).toContain(`document.addEventListener('${event}',`);
      expect(motion).toContain(`document.removeEventListener('${event}',`);
    }
    expect(motion).toContain("logo.setAttribute('data-pixels', '');");
    expect(motion).toContain("logo?.removeAttribute('data-pixels');");
    // The frames run only while the logo moves: the loop ends with the motion
    expect(motion).toContain('if (!logo || (!hovered && !bursting)) return end();');
    expect(motion).not.toMatch(/setInterval|infinite|repeatCount/);
    expect(motion).toContain('cancelAnimationFrame(frame);');
  });

  it('does not move for reduced motion', () => {
    expect(motion.match(/reduced\.matches/g)?.length).toBeGreaterThanOrEqual(2);
    expect(motion).toContain("if (!target || reduced.matches || event.pointerType === 'touch') return;");
    expect(motion).toContain('if (!target || reduced.matches) return;');
  });

  it('is mounted once on the pages of the hub and of the documentation sites', () => {
    const shell = readFileSync(path.resolve(__dirname, '../components/HubShell.tsx'), 'utf8');
    expect(shell.match(/<LogoMotion \/>/g)).toHaveLength(1);
    const layout = readFileSync(path.join(docsUi, 'components/DocsLayout.tsx'), 'utf8');
    expect(layout.match(/<LogoMotion \/>/g)).toHaveLength(1);
  });
});
