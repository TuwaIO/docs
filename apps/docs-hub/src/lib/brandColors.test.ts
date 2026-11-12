import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// The brand of TUWA since Nova 0.15: the TUWA orange in the light theme (a deep shade for text, a bright one for fills
// and lit pixels) and the cyan of the dark logo in the dark one. The docs take the accent from Nova; what docs-ui and the
// hub set themselves follows it, and none of the TUWA blue of before is left in them.

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const read = (file: string) => readFileSync(file, 'utf8');
const siteCss = read(path.join(docsUi, 'src/styles/site.css'));
const globalsCss = read(path.resolve(__dirname, '../app/globals.css'));
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** The blues of the brand before: the TUWA blue, its hover, the dark accent and the hero gradient of the hub. */
const OLD_BLUES = /#0052ff|#0047de|#60a5fa|#93c5fd|#1d4ed8|#0284c7|#2563eb|#3b82f6|#7dd3fc/i;

describe('the brand colors of the docs', () => {
  it.each([
    ['docs-ui site.css', siteCss],
    ['docs-ui dist/site.css', read(path.join(docsUi, 'dist/site.css'))],
    ['hub globals.css', globalsCss],
  ])('keep none of the TUWA blue of before in %s', (_, css) => {
    expect(withoutComments(css)).not.toMatch(OLD_BLUES);
  });

  it('describe the accent to Nextra as the deep orange in light and the cyan of the logo in dark', () => {
    const [light, dark] = [...siteCss.matchAll(/--nextra-primary-hue:\s*(\d+)deg/g)].map((match) => Number(match[1]));
    expect([light, dark]).toEqual([17, 189]);
  });

  // The lit pixels and the lit marks are fills: the bright orange of Nova's main button in light, not the deep orange
  // of text, which read brown on paper
  it('light the pixels and the marks with the bright fill of the brand', () => {
    expect(siteCss).toContain('--tuwa-docs-lit: var(--tuwa-icon-accent, var(--tuwa-text-accent));');
    expect(
      siteCss.match(/fill: var\(--tuwa-pixel-lit, var\(--tuwa-icon-accent, var\(--tuwa-text-accent\)\)\);/g),
    ).toHaveLength(2);
    expect(withoutComments(siteCss)).not.toMatch(/var\(--tuwa-pixel-lit, var\(--tuwa-text-accent\)\)/);
    // A pixel of the handoff in flight, lit as the pixel it comes from
    expect(siteCss).toContain(
      'background-color: var(--tuwa-pixel-lit, var(--tuwa-icon-accent, var(--tuwa-text-accent)));',
    );
  });
});
