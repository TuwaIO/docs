import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { handoffPixel, handoffProgress } from '../../../../packages/docs-ui/src/pixelHandoff';

// Scrolling from the hero to the ecosystem, the pixels of the project icons scatter from the plate and gather into the
// icons of the board; scrolling back takes them back. No motion for reduced motion. The handoff is `PixelHandoff` of
// docs-ui.

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui/src');

const pixel = (seed: number) => ({
  from: { x: 100, y: 200, size: 4 },
  to: { x: 300, y: 1200, size: 3 },
  seed,
});

describe('the handoff of the project icons', () => {
  it('follows the scroll between its two positions, and rests outside them', () => {
    const range = { start: 100, end: 900 };
    expect(handoffProgress(0, range)).toBe(0);
    expect(handoffProgress(100, range)).toBe(0);
    expect(handoffProgress(500, range)).toBe(0.5);
    expect(handoffProgress(900, range)).toBe(1);
    expect(handoffProgress(5000, range)).toBe(1);
    expect(handoffProgress(10, { start: 50, end: 50 })).toBe(0);
  });

  it('puts every pixel on its cell of the plate at the start and of the board at the end', () => {
    for (let seed = 0; seed < 50; seed++) {
      expect(handoffPixel(pixel(seed), 0)).toEqual({ x: 100, y: 200, size: 4 });
      const end = handoffPixel(pixel(seed), 1);
      expect(end.x).toBeCloseTo(300, 6);
      expect(end.y).toBeCloseTo(1200, 6);
      expect(end.size).toBe(3);
    }
  });

  it('scatters the pixels on arcs of their own on the way, the same on every render', () => {
    const middle = Array.from({ length: 40 }, (_, seed) => handoffPixel(pixel(seed), 0.5));
    const straight = { x: 200, y: 700 };
    const off = middle.map(({ x, y }) => Math.hypot(x - straight.x, y - straight.y));
    expect(Math.max(...off)).toBeGreaterThan(60);
    expect(new Set(middle.map(({ x }) => Math.round(x))).size).toBeGreaterThan(30);
    expect(handoffPixel(pixel(7), 0.42)).toEqual(handoffPixel(pixel(7), 0.42));
  });

  it('hides the icons only while their pixels fly, and draws nothing for reduced motion', () => {
    const css = readFileSync(path.resolve(docsUi, 'styles/site.css'), 'utf8');
    expect(css).toMatch(
      /html\[data-handoff='flight'\]\s+\.tuwa-pixel-art:is\(\[data-handoff-from\], \[data-handoff-to\], \[data-handoff-from\] \*, \[data-handoff-to\] \*\),\s*html\[data-handoff='from'\] \.tuwa-pixel-art:is\(\[data-handoff-to\], \[data-handoff-to\] \*\) \{\s*visibility: hidden;/,
    );
    const source = readFileSync(path.resolve(docsUi, 'components/PixelHandoff.tsx'), 'utf8');
    expect(source).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches) return;");
  });

  // The component is that of docs-ui, which other sites fly too: the main page gives it its two ends and its range
  it('flies from the plate of the hero to the board of the ecosystem', () => {
    const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
    expect(read('components/home/HeroPlate.tsx')).toContain('data-handoff-from={entry.id}');
    expect(read('components/home/EcosystemBoard.tsx')).toContain('data-handoff-to={entry.id}');
    const home = read('components/home/HomePixelHandoff.tsx');
    expect(home).toContain('return <PixelHandoff range={plateToBoard} />;');
    expect(home).toContain("document.querySelector('[data-handoff-from]')?.closest('nav')");
    expect(home).toContain("document.querySelector('#ecosystem [data-lanes]')");
    expect(read('app/(default)/(home)/page.tsx')).toContain('<HomePixelHandoff />');
  });

  // A page may move the icons its pixels leave (the orbits of tuwa.io): the pixels leave from where the icons stand
  it('measures the icons when the pixels take off, after the attribute that stops their motion is set', () => {
    const source = readFileSync(path.resolve(docsUi, 'components/PixelHandoff.tsx'), 'utf8');
    const change = source.slice(source.indexOf('if (next !== state) {'), source.indexOf('state = next;'));
    expect(change.indexOf('root.dataset.handoff = next;')).toBeGreaterThan(0);
    expect(change.indexOf('root.dataset.handoff = next;')).toBeLessThan(
      change.indexOf("if (next === 'flight') takeOff();"),
    );
    expect(source).toContain("const next = !range ? '' : progress <= 0 ? 'from' : progress >= 1 ? 'to' : 'flight';");
  });
});
