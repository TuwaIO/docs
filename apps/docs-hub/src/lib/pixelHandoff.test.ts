import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { handoffPixel, handoffProgress } from './pixelHandoff';

// Scrolling from the hero to the ecosystem, the pixels of the project icons scatter from the plate and gather into the
// icons of the board; scrolling back takes them back. No motion for reduced motion.

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
    const css = readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf8');
    expect(css).toMatch(/html\[data-handoff='flight'\] :is\(\[data-plate-icon\], \[data-board-icon\]\)/);
    expect(css).toMatch(/html\[data-handoff='plate'\] \[data-board-icon\]/);
    const source = readFileSync(path.resolve(__dirname, '../components/home/PixelHandoff.tsx'), 'utf8');
    expect(source).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches) return;");
  });
});
