import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import StarryBackground from '../../../../packages/docs-ui/src/components/StarryBackground';
import {
  createStars,
  forEachLineDot,
  LINE_DOT_STEP,
  LINE_MAX_DISTANCE,
  neighbourPairs,
  starCount,
  STARFIELD_MIN_WIDTH,
  STARFIELD_QUERY,
} from '../../../../packages/docs-ui/src/starfield';

// The pixel star field of the TUWA documentation, redrawn in paper and ink: a transparent canvas over the paper, ink and
// rare lit stars, dotted lines of 1px pixels between neighbours only, nothing on phones, still for reduced motion,
// paused in a hidden tab, as faint everywhere on a page (the hero no brighter)

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const read = (file: string) => readFileSync(file, 'utf8');
const componentSource = read(path.join(docsUi, 'src/components/StarryBackground.tsx'));

/** A seeded source of random numbers in [0, 1), so a field is the same on every run. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Every pair of stars closer than the distance, measured one by one. */
function bruteForcePairs(stars: { x: number; y: number }[], maxDistance: number) {
  const pairs: string[] = [];
  for (let a = 0; a < stars.length; a++)
    for (let b = a + 1; b < stars.length; b++)
      if (Math.hypot(stars[a]!.x - stars[b]!.x, stars[a]!.y - stars[b]!.y) < maxDistance) pairs.push(`${a}-${b}`);
  return pairs.sort();
}

describe('the stars of a window', () => {
  // Phones have no stars at all: the field starts at the `md` width of Tailwind, where the canvas shows
  it('are none on a phone', () => {
    expect(STARFIELD_MIN_WIDTH).toBe(768);
    expect(STARFIELD_QUERY).toBe('(min-width: 768px)');
    for (const [width, height] of [
      [320, 640],
      [390, 844],
      [767, 1024],
    ])
      expect(starCount(width, height)).toBe(0);
    expect(createStars(390, 844, seeded(1))).toEqual([]);
  });

  it('grow with the window, within bounds', () => {
    expect(starCount(768, 1024)).toBe(48);
    expect(starCount(1920, 1080)).toBe(115);
    expect(starCount(2560, 1440)).toBe(150);
    expect(createStars(1920, 1080, seeded(2))).toHaveLength(115);
  });

  it('are mostly ink, a few lit in the colour of the brand, inside the window', () => {
    const stars = Array.from({ length: 20 }, (_, seed) => createStars(1920, 1080, seeded(seed + 10))).flat();
    const lit = stars.filter((star) => star.lit).length / stars.length;
    expect(lit).toBeGreaterThan(0.06);
    expect(lit).toBeLessThan(0.14);
    expect(new Set(stars.map((star) => star.kind))).toEqual(new Set(['dust', 'star', 'sparkle']));
    expect(stars.filter((star) => star.kind === 'sparkle').length / stars.length).toBeLessThan(0.2);
    for (const star of stars) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThan(1920);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThan(1080);
    }
  });
});

describe('the lines between stars', () => {
  // Only neighbours are measured (the cells around a star), yet no pair is lost or counted twice
  it('join exactly the pairs closer than the longest line', () => {
    for (let seed = 0; seed < 12; seed++) {
      const stars = createStars(1920, 1080, seeded(seed));
      // Some stars pushed out of the window by the pointer, or bouncing at its edges
      stars.slice(0, 6).forEach((star, index) => {
        star.x = index % 2 ? -40 - index * 7 : 1920 + index * 9;
        star.y = index * 31 - 50;
      });
      const pairs = neighbourPairs(stars)
        .map(([a, b]) => `${a}-${b}`)
        .sort();
      expect(pairs).toEqual(bruteForcePairs(stars, LINE_MAX_DISTANCE));
      expect(new Set(pairs).size).toBe(pairs.length);
    }
  });

  it('carry the distance of each pair, the lower star first', () => {
    const stars = [
      { x: 10, y: 10 },
      { x: 70, y: 90 },
      { x: 500, y: 500 },
    ];
    expect(neighbourPairs(stars)).toEqual([[0, 1, 60 * 60 + 80 * 80]]);
  });

  it('are dotted with pixels of 1px on whole pixels, a step apart, with a gap at each star', () => {
    const dots: [number, number][] = [];
    forEachLineDot(10.4, 20.6, 100.2, 80.9, (x, y) => dots.push([x, y]));
    const length = Math.hypot(100.2 - 10.4, 80.9 - 20.6);
    expect(dots).toHaveLength(Math.floor((length - LINE_DOT_STEP) / LINE_DOT_STEP));
    for (const [x, y] of dots) {
      expect(Number.isInteger(x) && Number.isInteger(y)).toBe(true);
      expect(Math.hypot(x - 10.4, y - 20.6)).toBeGreaterThan(LINE_DOT_STEP - 1);
      expect(Math.hypot(x - 100.2, y - 80.9)).toBeGreaterThan(LINE_DOT_STEP - 1);
    }
    for (let i = 1; i < dots.length; i++) {
      const gap = Math.hypot(dots[i]![0] - dots[i - 1]![0], dots[i]![1] - dots[i - 1]![1]);
      expect(gap).toBeGreaterThan(LINE_DOT_STEP - 1.5);
      expect(gap).toBeLessThan(LINE_DOT_STEP + 1.5);
    }
  });

  it('leave out a line too short for a dot', () => {
    const dots: number[] = [];
    forEachLineDot(0, 0, LINE_DOT_STEP * 2, 0, (x) => dots.push(x));
    expect(dots).toEqual([]);
  });
});

describe('the canvas of the star field', () => {
  const markup = renderToStaticMarkup(createElement(StarryBackground));
  const classes = markup.match(/class="([^"]*)"/)?.[1]?.split(' ') ?? [];

  it('is a decoration behind the content that the pointer passes through', () => {
    expect(markup).toMatch(/^<canvas /);
    expect(markup).toContain('aria-hidden="true"');
    expect(classes).toEqual(
      expect.arrayContaining(['tuwadocs:pointer-events-none', 'tuwadocs:fixed', 'tuwadocs:inset-0', 'tuwadocs:-z-10']),
    );
  });

  // Phones get no stars: the canvas is hidden below 768px, and the field draws nothing there either
  it('shows from 768px only', () => {
    expect(classes).toEqual(expect.arrayContaining(['tuwadocs:hidden', 'tuwadocs:md:block']));
    expect(componentSource).toMatch(/window\.matchMedia\(STARFIELD_QUERY\)/);
    expect(componentSource).toMatch(/if \(!wide\.matches\) \{\s*if \(fitted\) release\(\);\s*return;/);
  });

  // Transparent: the paper shows through it, in both themes (the canvas before paper and ink painted a midnight blue)
  it('paints no background of its own and takes its colours from the theme', () => {
    expect(classes.filter((name) => /(^|:)(bg-|from-|via-|to-)/.test(name))).toEqual([]);
    expect(markup).toContain('color:var(--tuwa-text-primary, #101014)');
    expect(markup).toContain('outline-color:var(--tuwa-docs-lit, var(--tuwa-text-accent, #b93b0a))');
    // No colours of its own: the blue and amber stars of the look before are gone
    expect(componentSource).not.toMatch(/\[\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*\]/);
    expect(componentSource).not.toMatch(/rgba?\(/);
  });

  // As faint everywhere on a page: one look per theme, nothing brighter for the hero
  it('has one look per theme', () => {
    expect(componentSource).toMatch(/const LOOKS: Record<'light' \| 'dark', Look>/);
    expect(componentSource).not.toMatch(/hero/i);
  });

  it('stands still for reduced motion, with no events', () => {
    expect(componentSource).toMatch(/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
    expect(componentSource).toMatch(/if \(still\.matches\) \{\s*event = null;\s*draw\(0, false\);\s*return;/);
    expect(componentSource).toMatch(/if \(!moving\) return;/);
  });

  it('pauses in a hidden tab', () => {
    expect(componentSource).toMatch(/document\.addEventListener\('visibilitychange', start\)/);
    expect(componentSource).toMatch(/if \(document\.visibilityState !== 'visible'\) return;/);
  });
});

describe('the place of the star field', () => {
  // The field sits at z-index -10: the body must hold it over its paper, or it falls behind the paper and never shows
  it('is held over the paper of the body', () => {
    expect(read(path.join(docsUi, 'src/styles/site.css'))).toMatch(/\nbody \{\s*isolation: isolate;\s*\}/);
  });

  // A page of the documentation is for reading: the stars moved behind its text and drew the eye away from it
  it('is on the pages of the hub that are not documentation, and never behind a page of the documentation', () => {
    const layout = read(path.join(docsUi, 'src/components/DocsLayout.tsx'));
    expect(layout).not.toContain('<StarryBackground');
    expect(layout).not.toContain("from './StarryBackground'");
    expect(read(path.resolve(__dirname, '../components/PageBackground.tsx'))).toContain('<StarryBackground />');
    // The Nextra sections of the hub take no background of the other pages either
    expect(read(path.resolve(__dirname, '../lib/nextraSection.tsx'))).not.toContain('PageBackground');
    expect(read(path.resolve(__dirname, '../components/NextraLocalizedShell.tsx'))).not.toContain('PageBackground');
  });
});
