import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { anchorScrollDuration, anchorScrollTarget } from '../../../../packages/docs-ui/src/anchor';

// The links to anchors of a page scroll smoothly to their part and a frame of the accent closes in on it, once; for
// reduced motion the page goes there at once, without the frame

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const read = (file: string) => readFileSync(path.join(docsUi, file), 'utf8');

describe('the smooth scroll to an anchor', () => {
  it('takes longer the farther it goes, from 420ms to at most 960ms, up or down', () => {
    expect(anchorScrollDuration(0)).toBe(420);
    expect(anchorScrollDuration(1000)).toBe(600);
    expect(anchorScrollDuration(-1000)).toBe(600);
    expect(anchorScrollDuration(10_000)).toBe(960);
  });

  it('stops the part under the header by its scroll margin, within the page', () => {
    expect(anchorScrollTarget({ top: 1200, margin: 56, maxScroll: 5000 })).toBe(1144);
    expect(anchorScrollTarget({ top: 30, margin: 56, maxScroll: 5000 })).toBe(0);
    expect(anchorScrollTarget({ top: 4900, margin: 56, maxScroll: 4000 })).toBe(4000);
  });

  it('runs on every docs site and on the hub pages', () => {
    expect(read('src/components/DocsLayout.tsx')).toContain('<SmoothAnchors />');
    expect(read('src/index.ts')).toContain("export * from './components/SmoothAnchors';");
    expect(readFileSync(path.resolve(__dirname, '../components/HubShell.tsx'), 'utf8')).toContain('<SmoothAnchors />');
  });

  it.each([
    ['source', 'src/styles/site.css'],
    ['build', 'dist/site.css'],
  ])('draws the landing once and not for reduced motion (%s)', (_, file) => {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css).toMatch(/\.tuwa-landed\s*\{\s*animation:\s*tuwa-lock-on [^;]*both;?\s*\}/);
    expect(css).not.toMatch(/tuwa-lock-on[^;]*infinite/);
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.tuwa-landed\s*\{\s*animation:\s*none;?\s*\}\s*\}/,
    );
  });
});
