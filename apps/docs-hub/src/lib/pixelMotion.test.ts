import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PixelArt } from '../../../../packages/docs-ui/src/components/ProjectSquare';
import { startPixelMotion, stopPixelMotion } from '../../../../packages/docs-ui/src/pixelMotion';
import { projectIconArt } from '../../../../packages/docs-ui/src/projectIcons';

// While the reader points at the icon of a project (on the plate of the hero, on the board) it assembles again from its
// pixels, then moves in the way of its project, as the round badges did before paper and ink: the arrow glides into the
// door, a planet goes round the orbit, the beams of the pulsar pulse. It stops when the pointer leaves, without
// assembling again, and nothing moves for reduced motion.

/** A stand-in for an element: its classes, the steps taken on it, and whether it is assembling pixel art. */
function art() {
  const classes = new Set(['tuwa-pixel-art', 'tuwa-pixel-art--assemble']);
  const log: string[] = [];
  return {
    log,
    classes,
    matches: (selector: string) => selector === '.tuwa-pixel-art--assemble',
    getBoundingClientRect: () => log.push('layout'),
    classList: {
      remove: (...names: string[]) => names.forEach((name) => (classes.delete(name), log.push(`-${name}`))),
      add: (...names: string[]) => names.forEach((name) => (classes.add(name), log.push(`+${name}`))),
    },
  };
}

const css = readFileSync(path.resolve(__dirname, '../../../../packages/docs-ui/src/styles/site.css'), 'utf8');

describe('the motion of a project icon under the pointer', () => {
  it('starts anew: the motion goes, the layout is read, the icon settles and moves', () => {
    const icon = art();
    startPixelMotion(icon as unknown as Element);
    expect(icon.log).toEqual(['-tuwa-pixel-art--live', 'layout', '+tuwa-pixel-art--settled', '+tuwa-pixel-art--live']);
    stopPixelMotion(icon as unknown as Element);
    expect([...icon.classes]).toEqual(['tuwa-pixel-art', 'tuwa-pixel-art--assemble', 'tuwa-pixel-art--settled']);
  });

  it('moves the icons inside a part', () => {
    const icons = [art(), art()];
    const part = { matches: () => false, querySelectorAll: () => icons };
    startPixelMotion(part as unknown as Element);
    for (const icon of icons) expect(icon.classes.has('tuwa-pixel-art--live')).toBe(true);
  });

  it('marks the groups of pixels that move, and draws the planet of the orbit', () => {
    const pulsar = renderToStaticMarkup(
      createElement(PixelArt, { art: projectIconArt.pulsar, assemble: true, motion: 'pulsar' }),
    );
    expect(pulsar).toContain('data-motion="pulsar"');
    expect(pulsar.match(/data-g="[abc]"/g)).toHaveLength(6);
    const orbit = renderToStaticMarkup(
      createElement(PixelArt, { art: projectIconArt.orbit, assemble: true, motion: 'orbit' }),
    );
    expect(orbit).toContain('class="tuwa-pixel-art__planet"');
    // Without `assemble` the picture has no motion
    expect(renderToStaticMarkup(createElement(PixelArt, { art: projectIconArt.orbit, motion: 'orbit' }))).not.toMatch(
      /data-motion|tuwa-pixel-art__planet/,
    );
  });

  it('has a motion for every icon of a project on the main page', () => {
    for (const icon of ['sign-in', 'orbit', 'satellite', 'pulsar', 'cloud', 'server', 'supernova', 'terminal'])
      expect(css, icon).toContain(`.tuwa-pixel-art--live[data-motion='${icon}']`);
  });

  // Quasar Client is on the orbits and in the lineup of tuwa.io, not on the main page of the hub: its card moves as the
  // other icons do, its chip and the marks of its number blinking in turn
  it('has a motion for the card of Quasar Client', () => {
    expect(projectIconArt.card.join('')).toMatch(/B.*c/);
    expect(css).toMatch(
      /\.tuwa-pixel-art--live\[data-motion='card'\] rect\[data-g\] \{\s*animation:\s*var\(--again\),\s*tuwa-pixel-blink /,
    );
    const card = renderToStaticMarkup(
      createElement(PixelArt, { art: projectIconArt.card, assemble: true, motion: 'card' }),
    );
    expect(card).toContain('data-motion="card"');
    expect(card.match(/data-g="b"/g)).toHaveLength(4);
    expect(card.match(/data-g="c"/g)).toHaveLength(2);
  });

  it('stays still for reduced motion', () => {
    expect(css).toMatch(
      /\.tuwa-pixel-art--assemble rect,\s*\.tuwa-pixel-art--live,\s*\.tuwa-pixel-art--live rect,\s*\.tuwa-pixel-art--live \.tuwa-pixel-art__spin \{\s*animation: none;/,
    );
  });

  it('is started and stopped by the plate of the hero and the board, on pointing and keyboard focus', () => {
    const plate = readFileSync(path.resolve(__dirname, '../components/home/HeroPlate.tsx'), 'utf8');
    for (const handler of ['onMouseEnter', 'onFocus'])
      expect(plate).toMatch(new RegExp(`${handler}=\\{\\(event\\) => startPixelMotion\\(event\\.currentTarget\\)\\}`));
    for (const handler of ['onMouseLeave', 'onBlur'])
      expect(plate).toMatch(new RegExp(`${handler}=\\{\\(event\\) => stopPixelMotion\\(event\\.currentTarget\\)\\}`));
    const board = readFileSync(path.resolve(__dirname, '../components/home/EcosystemBoard.tsx'), 'utf8');
    expect(board).toContain('return { onMouseEnter: enter, onMouseLeave: leave, onFocus: enter, onBlur: leave };');
    for (const source of [plate, board]) expect(source).toContain('motion={entry.icon}');
  });
});
