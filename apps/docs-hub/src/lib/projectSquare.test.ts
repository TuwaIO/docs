import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Orb } from '../../../../packages/docs-ui/src/components/Orb';
import { CornerMarks, PixelArt, ProjectSquare } from '../../../../packages/docs-ui/src/components/ProjectSquare';
import { projectIconArt, projectIcons } from '../../../../packages/docs-ui/src/projectIcons';

// Paper and ink turned the round badge of a project (Orb) into a square: a frame of 1px with the pixel icon of the
// project and corner marks that light up, its pixels assembling once. The round Orb stays as a name only, rendering the
// square, so the website and Quasar keep compiling until they move to ProjectSquare

const pixelCount = (art: readonly string[]) => art.join('').replace(/\./g, '').length;
const litCount = (art: readonly string[]) =>
  [...art.join('')].filter((cell) => cell === 'o' || /[A-Z]/.test(cell)).length;

describe('the pixel icons of the TUWA projects', () => {
  it('are pictures of 9 × 9 cells in the notation of the art', () => {
    for (const [name, art] of Object.entries(projectIconArt)) {
      expect(art, name).toHaveLength(9);
      for (const row of art) expect(row, name).toMatch(/^[.#oa-zA-Z]{9}$/);
    }
    expect(Object.keys(projectIconArt)).toContain('gear');
  });

  it('give every project an icon of its own', () => {
    const icons = Object.values(projectIcons);
    expect(new Set(icons).size).toBe(icons.length);
    for (const icon of icons) expect(projectIconArt[icon]).toBeDefined();
  });
});

describe('PixelArt', () => {
  it('draws a square of ink or a lit square for every pixel, hidden from assistive technology', () => {
    const art = projectIconArt.satellite;
    const html = renderToStaticMarkup(createElement(PixelArt, { art }));
    expect(html).toMatch(/^<svg viewBox="0 0 9 9" aria-hidden="true" focusable="false" class="tuwa-pixel-art"/);
    expect(html.match(/<rect /g)).toHaveLength(pixelCount(art));
    expect(html.match(/data-lit="true"/g)).toHaveLength(litCount(art));
    expect(html).not.toContain('--dx');
  });

  // The server and the browser must render the same start of each pixel, or the page would not hydrate
  it('assembles its pixels from the same places on every render', () => {
    const render = () => renderToStaticMarkup(createElement(PixelArt, { art: projectIconArt.orbit, assemble: true }));
    const html = render();
    expect(html).toContain('class="tuwa-pixel-art tuwa-pixel-art--assemble"');
    expect(html.match(/--dx:-?\d+(\.\d)?px;--dy:-?\d+(\.\d)?px/g)).toHaveLength(pixelCount(projectIconArt.orbit));
    expect(render()).toBe(html);
    const offsets = [...html.matchAll(/--d[xy]:(-?[\d.]+)px/g)].map((match) => Number(match[1]));
    expect(Math.max(...offsets.map(Math.abs))).toBeLessThanOrEqual(9);
    expect(new Set(offsets).size).toBeGreaterThan(5);
  });
});

describe('ProjectSquare', () => {
  it('frames the icon of the project with corner marks 5px outside it', () => {
    const html = renderToStaticMarkup(createElement(ProjectSquare, { packageType: 'pulsar' }));
    expect(html).toMatch(/^<div class="tuwa-project-square" style="width:44px;height:44px">/);
    expect(html.match(/<rect /g)).toHaveLength(pixelCount(projectIconArt.pulsar));
    expect(html).toContain('<svg width="54" height="54" viewBox="0 0 54 54"');
    expect(html).toContain('tuwa-project-square__corners');
  });

  it('takes an icon of its own, a size, the active state and no motion', () => {
    const html = renderToStaticMarkup(
      createElement(ProjectSquare, { icon: 'gear', size: 36, active: true, assemble: false }),
    );
    expect(html).toContain('class="tuwa-project-square tuwa-project-square--active"');
    expect(html.match(/<rect /g)).toHaveLength(pixelCount(projectIconArt.gear));
    expect(html).not.toContain('tuwa-pixel-art--assemble');
    expect(html).toContain('<svg width="46" height="46"');
  });

  it('has no rounded corners, shadows or brand colours', () => {
    const html = renderToStaticMarkup(createElement(ProjectSquare, { packageType: 'siwx' }));
    expect(html).not.toMatch(/rounded|shadow|border-radius|#10b981/);
  });
});

describe('CornerMarks', () => {
  it('draws four marks with arms of 6px on lines of 1px', () => {
    const html = renderToStaticMarkup(createElement(CornerMarks, { width: 54, height: 54 }));
    expect(html).toContain('d="M0.5 6V0.5H6M48 0.5H53.5V6M53.5 48V53.5H48M6 53.5H0.5V48"');
  });
});

describe('Orb, the old name of ProjectSquare', () => {
  it('renders the square of the project with the props of the round badge', () => {
    const html = renderToStaticMarkup(
      createElement(Orb, {
        packageType: 'sdk',
        pixelIcon: 'rocket',
        color: 'var(--tuwa-text-accent)',
        size: 56,
        className: 'mb-5',
      }),
    );
    expect(html).toMatch(
      /^<div class="tuwa-project-square mb-5" style="width:56px;height:56px;--tuwa-pixel-lit:var\(--tuwa-text-accent\)">/,
    );
    expect(html.match(/<rect /g)).toHaveLength(pixelCount(projectIconArt.rocket));
    expect(html).not.toContain('tuwa-orb');
  });

  it('is marked as deprecated', () => {
    const source = readFileSync(path.resolve(__dirname, '../../../../packages/docs-ui/src/components/Orb.tsx'), 'utf8');
    expect(source.match(/@deprecated/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
