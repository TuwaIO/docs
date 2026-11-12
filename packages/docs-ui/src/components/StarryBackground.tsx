'use client';

import { useEffect, useRef } from 'react';

import {
  createStars,
  forEachLineDot,
  LINE_MAX_DISTANCE,
  neighbourPairs,
  type Star,
  STARFIELD_QUERY,
  twinkleOf,
} from '../starfield';

// A rare event of the sky, one at a time: a shooting star, a supernova, a satellite passing or a rocket taking off
type SkyEventKind = 'comet' | 'supernova' | 'satellite' | 'rocket';
interface SkyEvent {
  kind: SkyEventKind;
  x: number;
  y: number;
  vx: number; // CSS pixels per millisecond (or, for a shooting star, the whole way it goes)
  vy: number;
  start: number;
  duration: number;
}

/**
 * How faint the field is in a theme, as opacities: the stars of ink and the lit ones between their dimmest and their
 * brightest, a line where it is shortest, and the rare events. The same everywhere on a page: under the text it stays
 * faint enough to read over.
 */
interface Look {
  ink: readonly [number, number];
  lit: readonly [number, number];
  line: number;
  event: number;
}
const LOOKS: Record<'light' | 'dark', Look> = {
  light: { ink: [0.14, 0.44], lit: [0.35, 0.85], line: 0.2, event: 0.6 },
  dark: { ink: [0.14, 0.5], lit: [0.3, 0.85], line: 0.18, event: 0.7 },
};

// The arms of a sparkle, and their far ends, which come in as it nears its brightest
const ARM_OPACITY = 0.5;
const FAR_ARM_OPACITY = 0.25;

// The pointer: stars move away from it and shine a little brighter near it
const MOUSE_REPEL_DISTANCE = 150;
const MOUSE_REPEL_FORCE = 2; // CSS pixels for a frame of 60 a second, at the pointer itself
const MOUSE_BRIGHTEN = 0.45;
const FRAME = 1_000 / 60;
const LONGEST_STEP = 50; // After a pause the stars go on from where they were, not leap

// The rare events of the sky: one every 12 to 20 seconds, small and faint, picked by these weights
const EVENT_INTERVAL_MIN = 12_000;
const EVENT_INTERVAL_RANGE = 8_000;
const EVENT_WEIGHTS: [SkyEventKind, number][] = [
  ['comet', 0.4],
  ['supernova', 0.2],
  ['satellite', 0.2],
  ['rocket', 0.2],
];
const COMET_DURATION = 1_400;
const COMET_TRAIL = 9; // Pixels of the trail
const COMET_TRAIL_GAP = 3; // CSS pixels between two pixels of the trail
const SUPERNOVA_DURATION = 2_800;
const SUPERNOVA_RING = 16; // Pixels of the shock wave
const SUPERNOVA_RADIUS = 22; // CSS pixels the shock wave reaches
const SATELLITE_DURATION = 10_000;
const ROCKET_DURATION = 3_600;
const SPRITE_UNIT = 1.5; // CSS pixels per pixel of a sprite

// The sprites: `#` the body in ink; `o` a lit window, `a` a blinking light, `f` and `F` a flickering flame, all lit
const SATELLITE_ART = ['....a....', '....#....', '##.###.##', '#########', '##.###.##'] as const;
const ROCKET_ART = ['..#..', '.###.', '.#o#.', '.###.', '#####', '#.#.#', '.fFf.', '..f..'] as const;

/** The two colours of the field, as the canvas reads them from its own style: ink and lit. */
interface Colours {
  ink: string;
  lit: string;
}

/**
 * A field of pixel stars in paper and ink on a transparent canvas the size of the window, behind the content of a
 * page: the paper shows through it. Its stars are crisp pixels — specks of dust, larger stars and sparkles whose four
 * arms reach out at their brightest — in ink, faint on the paper of the light theme and light on the paper of the dark
 * one, and one in ten lit in the colour of the brand (`--tuwa-docs-lit`: the TUWA orange in light, the cyan of the logo
 * in dark). Neighbouring stars are joined by dotted lines of 1px pixels. The stars drift and twinkle calmly (each over
 * 2.5 to 4.5 seconds), move away from the pointer and shine a little brighter near it; now and then (every 12 to 20
 * seconds) one small, faint event of the sky: a shooting star, a supernova with a ring of light, a satellite drifting
 * across with its light blinking, or a rocket taking off with a flickering flame. The field is as faint everywhere on a
 * page.
 *
 * - Phones have none: the canvas shows from 768px and draws nothing narrower.
 * - Reduced motion: the stars stand still, with their lines, and no events.
 * - A hidden tab: the field pauses and goes on from where it was.
 * - Its colours follow the theme: ink is `--tuwa-text-primary`, lit is `--tuwa-docs-lit` (or `--tuwa-text-accent`).
 *
 * Place it once on a page. It is `fixed` with `z-index: -10`: it shows over the background of the nearest stacking
 * context and under its content, so give that context the paper (docs-ui's `site.css` isolates the `<body>`, which
 * holds the paper).
 *
 * Side effects: a `requestAnimationFrame` loop while it shows and the tab is visible; `mousemove`, `mouseleave`,
 * `resize` and `visibilitychange` listeners, listeners on the `(min-width: 768px)` and `prefers-reduced-motion` media
 * queries, and a `MutationObserver` on the attributes of `<html>` (the theme), all removed on unmount.
 *
 * @returns The canvas.
 */
export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const wide = window.matchMedia(STARFIELD_QUERY);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    // The pixels of the screen, so the stars are crisp: at most two per CSS pixel, which is sharp enough and cheap
    let dpr = 1;
    let width = 0;
    let height = 0;
    let fitted = false;
    let stars: Star[] = [];
    let colours: Colours = { ink: '', lit: '' };
    let look = LOOKS.light;
    let frame = 0;
    let last = 0;
    let event: SkyEvent | null = null;
    let nextEvent = performance.now() + EVENT_INTERVAL_MIN / 2 + Math.random() * EVENT_INTERVAL_RANGE;
    const mouse = { x: -1e4, y: -1e4 };

    // A position or a size on the pixel grid of the screen
    const snap = (value: number) => Math.round(value * dpr) / dpr;

    const paint = (colour: string, alpha: number, x: number, y: number, w: number, h: number) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = colour;
      ctx.fillRect(x, y, w, h);
    };

    const readColours = () => {
      const style = getComputedStyle(canvas);
      colours = { ink: style.color, lit: style.outlineColor };
      look = root.classList.contains('dark') ? LOOKS.dark : LOOKS.light;
    };

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
      fitted = true;
    };

    const release = () => {
      canvas.width = 0;
      canvas.height = 0;
      stars = [];
      event = null;
      fitted = false;
    };

    // A rare event at a place of the sky that suits it
    const launchEvent = (now: number): SkyEvent => {
      let roll = Math.random();
      const kind = EVENT_WEIGHTS.find(([, weight]) => (roll -= weight) < 0)?.[0] ?? 'comet';
      const toRight = Math.random() < 0.5;
      switch (kind) {
        case 'supernova':
          return {
            kind,
            x: width * (0.1 + Math.random() * 0.8),
            y: height * (0.1 + Math.random() * 0.5),
            vx: 0,
            vy: 0,
            start: now,
            duration: SUPERNOVA_DURATION,
          };
        case 'satellite':
          // It crosses about two fifths of the screen, slowly, as satellites do
          return {
            kind,
            x: width * (toRight ? 0.05 + Math.random() * 0.45 : 0.5 + Math.random() * 0.45),
            y: height * (0.08 + Math.random() * 0.37),
            vx: ((toRight ? 1 : -1) * width * 0.4) / SATELLITE_DURATION,
            vy: (height * (Math.random() - 0.5) * 0.06) / SATELLITE_DURATION,
            start: now,
            duration: SATELLITE_DURATION,
          };
        case 'rocket':
          return {
            kind,
            x: width * (0.15 + Math.random() * 0.7),
            y: height * (0.7 + Math.random() * 0.2),
            vx: 0,
            vy: -height * 0.45,
            start: now,
            duration: ROCKET_DURATION,
          };
        default: {
          // A shooting star from the upper part of the sky, sliding down to one side at a shallow angle
          const distance = Math.min(width, height) * (0.25 + Math.random() * 0.15);
          const angle = (12 + Math.random() * 14) * (Math.PI / 180);
          return {
            kind: 'comet',
            x: width * (toRight ? 0.1 + Math.random() * 0.5 : 0.4 + Math.random() * 0.5),
            y: height * Math.random() * 0.4,
            vx: (toRight ? 1 : -1) * Math.cos(angle) * distance,
            vy: Math.sin(angle) * distance,
            start: now,
            duration: COMET_DURATION,
          };
        }
      }
    };

    /**
     * Draws a small pixel sprite: the body in ink, the other cells in the lit colour.
     * @param art The rows of the sprite.
     * @param left Left edge in CSS pixels.
     * @param top Top edge in CSS pixels.
     * @param alphaOf The opacity of a cell, or 0 for an empty one.
     */
    const drawSprite = (art: readonly string[], left: number, top: number, alphaOf: (cell: string) => number) => {
      const unit = snap(SPRITE_UNIT);
      art.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const cell = row[x] as string;
          const alpha = alphaOf(cell);
          if (alpha <= 0) continue;
          paint(
            cell === '#' ? colours.ink : colours.lit,
            alpha,
            snap(left + x * unit),
            snap(top + y * unit),
            unit,
            unit,
          );
        }
      });
    };

    /**
     * Draws the rare event of the sky, if one is on.
     * @param now The time, in milliseconds.
     * @returns Whether it is still on.
     */
    const drawEvent = (now: number) => {
      if (!event) return false;
      const elapsed = now - event.start;
      const t = elapsed / event.duration;
      if (t >= 1 || t < 0) return false;
      const unit = snap(SPRITE_UNIT);
      const strength = look.event;

      if (event.kind === 'comet') {
        // A pixel head with a trail of pixels that fade behind it, the whole fading in and out
        const eased = 1 - (1 - t) ** 3;
        const fade = Math.sin(Math.PI * t) * strength;
        const length = Math.hypot(event.vx, event.vy);
        const ux = event.vx / length;
        const uy = event.vy / length;
        const headX = event.x + event.vx * eased;
        const headY = event.y + event.vy * eased;
        for (let i = COMET_TRAIL; i >= 0; i--) {
          const size = i === 0 ? snap(unit * 1.5) : unit;
          paint(
            colours.ink,
            fade * (1 - i / (COMET_TRAIL + 1)),
            snap(headX - ux * i * COMET_TRAIL_GAP),
            snap(headY - uy * i * COMET_TRAIL_GAP),
            size,
            size,
          );
        }
        return true;
      }

      if (event.kind === 'supernova') {
        // A star flares up fast and fades slowly; its rays reach out and a lit ring spreads from it
        const flare = Math.max(0, t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82);
        const alpha = flare * strength;
        const core = snap(unit * (1 + flare));
        const cx = snap(event.x - core / 2);
        const cy = snap(event.y - core / 2);
        paint(colours.ink, alpha, cx, cy, core, core);
        const reach = Math.round(1 + flare * 3);
        for (let i = 1; i <= reach; i++) {
          const rayAlpha = alpha * (1 - i / (reach + 1));
          paint(colours.ink, rayAlpha, cx - i * unit, cy + (core - unit) / 2, unit, unit);
          paint(colours.ink, rayAlpha, cx + core + (i - 1) * unit, cy + (core - unit) / 2, unit, unit);
          paint(colours.ink, rayAlpha, cx + (core - unit) / 2, cy - i * unit, unit, unit);
          paint(colours.ink, rayAlpha, cx + (core - unit) / 2, cy + core + (i - 1) * unit, unit, unit);
        }
        const radius = (1 - (1 - t) ** 3) * SUPERNOVA_RADIUS;
        for (let i = 0; i < SUPERNOVA_RING; i++) {
          const angle = (i / SUPERNOVA_RING) * Math.PI * 2;
          paint(
            colours.lit,
            (1 - t) * 0.8 * strength,
            snap(event.x + Math.cos(angle) * radius),
            snap(event.y + Math.sin(angle) * radius),
            unit,
            unit,
          );
        }
        return true;
      }

      // A satellite or a rocket: in and out softly
      const fade = Math.min(1, t / 0.12, (1 - t) / (event.kind === 'rocket' ? 0.25 : 0.12)) * strength;

      if (event.kind === 'satellite') {
        // It drifts across with its light blinking now and then
        const blink = elapsed % 1_400 < 260;
        drawSprite(
          SATELLITE_ART,
          event.x + event.vx * elapsed - (SATELLITE_ART[0].length * unit) / 2,
          event.y + event.vy * elapsed,
          (cell) => (cell === '#' ? fade * 0.8 : cell === 'a' && blink ? fade : 0),
        );
        return true;
      }

      // The rocket rises faster and faster, its lit flame flickering, a trail of sparks behind it
      const rise = t * t;
      const left = event.x - (ROCKET_ART[0].length * unit) / 2;
      const top = event.y + event.vy * rise;
      const flicker = Math.floor(elapsed / 90) % 2 === 0;
      drawSprite(ROCKET_ART, left, top, (cell) => {
        if (cell === '#') return fade * 0.85;
        if (cell === 'o') return fade;
        if (cell === 'f') return fade * (flicker ? 1 : 0.55);
        if (cell === 'F') return fade * (flicker ? 0.55 : 1);
        return 0;
      });
      for (let i = 1; i <= 4; i++)
        paint(
          colours.lit,
          fade * 0.5 * (1 - i / 5),
          snap(event.x - unit / 2 + (i % 2 === 0 ? unit : -unit) * 0.5),
          snap(top + ROCKET_ART.length * unit + i * 3),
          unit,
          unit,
        );
      return true;
    };

    /**
     * Draws a star as a pixel on the grid of the screen: a speck of dust, a larger star, or a sparkle with four arms.
     * @param star The star.
     * @param twinkle Where it is in its twinkle, from 0 to 1.
     * @param near How close the pointer is, from 0 (far) to 1 (on it).
     */
    const drawStar = (star: Star, twinkle: number, near: number) => {
      const [dimmest, brightest] = star.lit ? look.lit : look.ink;
      const alpha = Math.min(1, (dimmest + (brightest - dimmest) * twinkle) * (1 + near * MOUSE_BRIGHTEN));
      const colour = star.lit ? colours.lit : colours.ink;
      const size = snap(star.kind === 'sparkle' ? 2 : star.kind === 'star' ? 1.5 : 1);
      const x = snap(star.x - size / 2);
      const y = snap(star.y - size / 2);
      paint(colour, alpha, x, y, size, size);
      if (star.kind !== 'sparkle') return;
      paint(colour, alpha * ARM_OPACITY, x - size, y, size, size);
      paint(colour, alpha * ARM_OPACITY, x + size, y, size, size);
      paint(colour, alpha * ARM_OPACITY, x, y - size, size, size);
      paint(colour, alpha * ARM_OPACITY, x, y + size, size, size);
      const reach = Math.max(0, (twinkle - 0.6) / 0.4);
      if (reach <= 0) return;
      const half = snap(size / 2);
      const far = alpha * FAR_ARM_OPACITY * reach;
      paint(colour, far, x - size - half, y + half / 2, half, half);
      paint(colour, far, x + size * 2, y + half / 2, half, half);
      paint(colour, far, x + half / 2, y - size - half, half, half);
      paint(colour, far, x + half / 2, y + size * 2, half, half);
    };

    /**
     * Draws the field: the dotted lines between neighbours, then the stars over them, then the event of the sky.
     * @param time The time, in milliseconds (0 for a still field).
     * @param moving Whether the field moves: only a moving one has events.
     */
    const draw = (time: number, moving: boolean) => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = colours.ink;
      for (const [a, b, distanceSq] of neighbourPairs(stars)) {
        const from = stars[a] as Star;
        const to = stars[b] as Star;
        ctx.globalAlpha = look.line * (1 - distanceSq / (LINE_MAX_DISTANCE * LINE_MAX_DISTANCE));
        ctx.beginPath();
        forEachLineDot(from.x, from.y, to.x, to.y, (x, y) => ctx.rect(x, y, 1, 1));
        ctx.fill();
      }

      for (const star of stars) {
        const distance = moving ? Math.hypot(mouse.x - star.x, mouse.y - star.y) : Infinity;
        const near = distance < MOUSE_REPEL_DISTANCE ? (MOUSE_REPEL_DISTANCE - distance) / MOUSE_REPEL_DISTANCE : 0;
        drawStar(star, twinkleOf(star, time), near);
      }

      if (!moving) return;
      if (!drawEvent(time)) {
        event = null;
        if (time >= nextEvent) {
          event = launchEvent(time);
          nextEvent = time + EVENT_INTERVAL_MIN + Math.random() * EVENT_INTERVAL_RANGE;
        }
      }
    };

    /**
     * Moves the stars on: their drift, a bounce at the edges of the window, and away from the pointer.
     * @param dt The time since the last frame, in milliseconds.
     */
    const step = (dt: number) => {
      for (const star of stars) {
        star.x += star.vx * dt;
        star.y += star.vy * dt;
        if (star.x < 0 || star.x > width) star.vx = -star.vx;
        if (star.y < 0 || star.y > height) star.vy = -star.vy;
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq >= MOUSE_REPEL_DISTANCE * MOUSE_REPEL_DISTANCE || distanceSq === 0) continue;
        const distance = Math.sqrt(distanceSq);
        const force = ((MOUSE_REPEL_DISTANCE - distance) / MOUSE_REPEL_DISTANCE) * MOUSE_REPEL_FORCE * (dt / FRAME);
        star.x -= (dx / distance) * force;
        star.y -= (dy / distance) * force;
      }
    };

    const tick = (now: number) => {
      step(Math.min(now - last, LONGEST_STEP));
      last = now;
      draw(now, true);
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    // Runs the field as the window, the tab and the settings of the reader allow: nothing on a phone, still for reduced
    // motion, paused in a hidden tab
    const start = () => {
      stop();
      if (!wide.matches) {
        if (fitted) release();
        return;
      }
      if (!fitted) fit();
      if (still.matches) {
        event = null;
        draw(0, false);
        return;
      }
      if (document.visibilityState !== 'visible') return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      if (wide.matches) fit();
      start();
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    // The theme: new colours, drawn at once on a still field (a moving one takes them on its next frame)
    const theme = new MutationObserver(() => {
      readColours();
      if (fitted && still.matches) draw(0, false);
    });

    readColours();
    start();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', start);
    wide.addEventListener('change', start);
    still.addEventListener('change', start);
    theme.observe(root, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', start);
      wide.removeEventListener('change', start);
      still.removeEventListener('change', start);
      theme.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="tuwadocs:pointer-events-none tuwadocs:fixed tuwadocs:inset-0 tuwadocs:-z-10 tuwadocs:hidden tuwadocs:h-full tuwadocs:w-full tuwadocs:md:block tuwadocs:print:hidden"
      // The colours the field reads: its ink and, as the colour of an outline it never draws, the lit colour of the theme
      style={{
        color: 'var(--tuwa-text-primary, #101014)',
        outlineColor: 'var(--tuwa-docs-lit, var(--tuwa-text-accent, #b93b0a))',
      }}
    />
  );
}
