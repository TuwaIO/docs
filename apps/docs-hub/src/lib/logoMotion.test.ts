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
    // At rest the filter moves nothing, and the logo has no filter at all
    expect(markup).toMatch(/<feDisplacementMap in="SourceGraphic" in2="blocks" scale="0"/);
    expect(siteCss).toMatch(/\.tuwa-logo\[data-pixels\] \{\s*filter: url\(#tuwa-logo-pixels\);\s*\}/);
    expect(siteCss).not.toMatch(/\.tuwa-logo \{[^}]*filter/);
    // The noise moves blocks the size of a pixel of the logo, so a pixel moves whole
    expect(markup).toMatch(/<feMorphology in="samples" operator="dilate" radius="1" result="blocks"/);
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
