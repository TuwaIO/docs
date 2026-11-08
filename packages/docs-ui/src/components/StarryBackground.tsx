'use client';

import { useEffect, useRef } from 'react';

// Star properties mapping
interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number; // Twinkling alpha state
  tint: Tint; // The colour of the star: most are neutral, a few are blue or amber
  phase: number; // Where the star is in its twinkle, fixed: it does not change as the star drifts
  speed: number; // How fast it twinkles, in radians per millisecond
}

// A rare event of the sky, one at a time: a shooting star, a supernova, a satellite passing or a rocket taking off
type SkyEventKind = 'comet' | 'supernova' | 'satellite' | 'rocket';
interface SkyEvent {
  kind: SkyEventKind;
  x: number;
  y: number;
  vx: number; // Pixels per millisecond (or, for a shooting star, the whole way it goes)
  vy: number;
  start: number;
  duration: number;
}

type Tint = 'neutral' | 'blue' | 'amber';
type Rgb = readonly [number, number, number];

// --- Configuration Constants ---
// Removes magic numbers and allows easy customization of the effect
const NUM_STARS = 100;
const STAR_RADIUS_MIN = 0.9;
const STAR_RADIUS_MAX = 2.7;
const STAR_VELOCITY_FACTOR = 0.3; // Speed scaling factor
const STAR_INITIAL_OPACITY_MIN = 0.5;
const STAR_INITIAL_OPACITY_RANGE = 0.5; // (min + Math.random() * range)
const BLUE_SHARE = 0.16; // Shares of the tinted stars; the rest are neutral
const AMBER_SHARE = 0.08;

// Mouse repulsion settings
const MOUSE_REPEL_DISTANCE = 150;
const MOUSE_REPEL_DISTANCE_SQ = MOUSE_REPEL_DISTANCE * MOUSE_REPEL_DISTANCE; // Pre-calculated squared distance
const MOUSE_REPEL_FORCE = 2;
const MOUSE_BRIGHTEN = 0.45; // Stars near the pointer shine a little brighter

// The kinds of stars by radius: dust (one pixel), stars (a larger pixel) and sparkles (a core with four arms that
// reach out further while the star is at its brightest)
const STAR_RADIUS_STAR = 1.6;
const SPARKLE_RADIUS_MIN = 2.3;
const SPARKLE_ARM_OPACITY = 0.5;
const SPARKLE_FAR_ARM_OPACITY = 0.25;

// Connector lines configuration: a dotted line of pixels, as a constellation drawn on a chart
const LINE_MAX_DISTANCE = 120;
const LINE_MAX_DISTANCE_SQ = LINE_MAX_DISTANCE * LINE_MAX_DISTANCE; // Pre-calculated squared distance
const LINE_DASH = [2, 3];
// A slow twinkle: each star brightens and dims over 2.5 to 4.5 seconds
const TWINKLE_PERIOD_MIN = 2_500;
const TWINKLE_PERIOD_RANGE = 2_000;

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

// The sprites: `#` the body, `o` a lit window, `a` a blinking light, `f` and `F` a flickering flame
const SATELLITE_ART = ['....a....', '....#....', '##.###.##', '#########', '##.###.##'] as const;
const ROCKET_ART = ['..#..', '.###.', '.#o#.', '.###.', '#####', '#.#.#', '.fFf.', '..f..'] as const;

// The colours of the stars, the arms of the sparkles and the lines, on a dark and on a light page
type Palette = Record<Tint, Rgb> & {
  arm: Rgb;
  line: Rgb;
  body: Rgb; // The body of a satellite or a rocket
  flame: Rgb;
  flameHot: Rgb;
  signal: Rgb; // The blinking light of a satellite
  alpha: number;
};
const PALETTE: Record<'dark' | 'light', Palette> = {
  dark: {
    neutral: [255, 255, 255],
    blue: [147, 197, 253], // blue-300
    amber: [252, 211, 77], // amber-300
    arm: [147, 197, 253],
    line: [147, 197, 253],
    body: [203, 213, 225], // slate-300
    flame: [251, 191, 36], // amber-400
    flameHot: [253, 230, 138], // amber-200
    signal: [248, 113, 113], // red-400
    alpha: 1,
  },
  light: {
    neutral: [15, 23, 42], // slate-900
    blue: [29, 78, 216], // blue-700
    amber: [180, 83, 9], // amber-700
    arm: [71, 85, 105], // slate-600
    line: [71, 85, 105],
    body: [71, 85, 105], // slate-600
    flame: [217, 119, 6], // amber-600
    flameHot: [245, 158, 11], // amber-500
    signal: [220, 38, 38], // red-600
    alpha: 0.85,
  },
};

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

/**
 * A full-size canvas of slowly drifting stars that twinkle calmly (each over 2.5 to 4.5 seconds), joined by dotted
 * lines; they move away from the mouse pointer and shine a little brighter near it. The stars are crisp pixels on the
 * pixel grid of the screen, in the pixel manner of the TUWA switches: specks of dust, larger stars and sparkles whose
 * four arms reach out while they are at their brightest; a few are blue or amber. Now and then (every 12 to 20 seconds)
 * one small, faint event of the sky: a shooting star, a supernova flaring with a ring of light spreading from it, a
 * satellite drifting across with its light blinking, or a rocket taking off with a flickering flame; none for reduced
 * motion. Place it behind the content of a page; it takes the size of the window and follows its resizes.
 *
 * Side effects: `mousemove` and `resize` listeners on `window` and a `requestAnimationFrame` loop, all removed on
 * unmount; it reads the `prefers-reduced-motion` media query before each event.
 *
 * @returns The canvas.
 */
export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The pixels of the screen, so the stars are crisp: at most two per CSS pixel, which is sharp enough and cheap
    let dpr = 1;
    let width = 0;
    let height = 0;

    // Rescale canvas viewport dimensions
    const setCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // A position or a size on the pixel grid of the screen
    const snap = (value: number) => Math.round(value * dpr) / dpr;

    // The rare events only for those who have not asked for less motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let event: SkyEvent | null = null;
    let nextEvent = Date.now() + EVENT_INTERVAL_MIN / 2 + Math.random() * EVENT_INTERVAL_RANGE;

    // Populate stars using predefined dimensions and limits
    const createStars = (): Star[] => {
      const stars: Star[] = [];
      for (let i = 0; i < NUM_STARS; i++) {
        const pick = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (STAR_RADIUS_MAX - STAR_RADIUS_MIN) + STAR_RADIUS_MIN,
          vx: (Math.random() - 0.5) * STAR_VELOCITY_FACTOR,
          vy: (Math.random() - 0.5) * STAR_VELOCITY_FACTOR,
          opacity: Math.random() * STAR_INITIAL_OPACITY_RANGE + STAR_INITIAL_OPACITY_MIN,
          tint: pick < BLUE_SHARE ? 'blue' : pick < BLUE_SHARE + AMBER_SHARE ? 'amber' : 'neutral',
          phase: Math.random() * Math.PI * 2,
          speed: (Math.PI * 2) / (TWINKLE_PERIOD_MIN + Math.random() * TWINKLE_PERIOD_RANGE),
        });
      }
      return stars;
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

    // --- Event Handler Methods ---

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleResize = () => {
      setCanvasSize();
      starsRef.current = createStars(); // Re-initialize star field on dimension change
    };

    // --- Main Rendering Loop ---

    /**
     * Draws a small pixel sprite.
     * @param art The rows of the sprite.
     * @param left Left edge in CSS pixels.
     * @param top Top edge in CSS pixels.
     * @param alpha Its opacity.
     * @param colourOf The colour of a cell of the sprite, or nothing for an empty one.
     */
    const drawSprite = (
      art: readonly string[],
      left: number,
      top: number,
      alpha: number,
      colourOf: (cell: string) => Rgb | null,
    ) => {
      const unit = snap(SPRITE_UNIT);
      art.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const colour = colourOf(row[x]);
          if (!colour) continue;
          ctx.fillStyle = rgba(colour, alpha);
          ctx.fillRect(snap(left + x * unit), snap(top + y * unit), unit, unit);
        }
      });
    };

    /**
     * Draws the rare event of the sky, if one is on.
     * @param now Current time in milliseconds.
     * @param colours The palette of the theme.
     * @returns Whether it is still on.
     */
    const drawEvent = (now: number, colours: Palette) => {
      if (!event) return false;
      const elapsed = now - event.start;
      const t = elapsed / event.duration;
      if (t >= 1) return false;
      const unit = snap(SPRITE_UNIT);

      if (event.kind === 'comet') {
        // A pixel head with a trail of pixels that fade behind it, the whole fading in and out
        const eased = 1 - (1 - t) ** 3;
        const fade = Math.sin(Math.PI * t) * 0.8 * colours.alpha;
        const length = Math.hypot(event.vx, event.vy);
        const ux = event.vx / length;
        const uy = event.vy / length;
        const headX = event.x + event.vx * eased;
        const headY = event.y + event.vy * eased;
        for (let i = COMET_TRAIL; i >= 0; i--) {
          const size = i === 0 ? snap(unit * 1.5) : unit;
          ctx.fillStyle = rgba(i === 0 ? colours.neutral : colours.arm, fade * (1 - i / (COMET_TRAIL + 1)));
          ctx.fillRect(snap(headX - ux * i * COMET_TRAIL_GAP), snap(headY - uy * i * COMET_TRAIL_GAP), size, size);
        }
        return true;
      }

      if (event.kind === 'supernova') {
        // A star flares up fast and fades slowly; its rays reach out and a ring of light spreads from it
        const flare = t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82;
        const alpha = Math.max(0, flare) * colours.alpha;
        const core = snap(unit * (1 + flare));
        const cx = snap(event.x - core / 2);
        const cy = snap(event.y - core / 2);
        ctx.fillStyle = rgba(colours.neutral, alpha);
        ctx.fillRect(cx, cy, core, core);
        const reach = Math.round(1 + flare * 3);
        for (let i = 1; i <= reach; i++) {
          ctx.fillStyle = rgba(colours.arm, alpha * (1 - i / (reach + 1)));
          ctx.fillRect(cx - i * unit, cy + (core - unit) / 2, unit, unit);
          ctx.fillRect(cx + core + (i - 1) * unit, cy + (core - unit) / 2, unit, unit);
          ctx.fillRect(cx + (core - unit) / 2, cy - i * unit, unit, unit);
          ctx.fillRect(cx + (core - unit) / 2, cy + core + (i - 1) * unit, unit, unit);
        }
        const radius = (1 - (1 - t) ** 3) * SUPERNOVA_RADIUS;
        ctx.fillStyle = rgba(colours.flame, (1 - t) * 0.6 * colours.alpha);
        for (let i = 0; i < SUPERNOVA_RING; i++) {
          const angle = (i / SUPERNOVA_RING) * Math.PI * 2;
          ctx.fillRect(snap(event.x + Math.cos(angle) * radius), snap(event.y + Math.sin(angle) * radius), unit, unit);
        }
        return true;
      }

      // A satellite or a rocket: in and out softly
      const fade = Math.min(1, t / 0.12, (1 - t) / (event.kind === 'rocket' ? 0.25 : 0.12)) * colours.alpha;

      if (event.kind === 'satellite') {
        // It drifts across with its light blinking now and then
        const blink = elapsed % 1_400 < 260;
        drawSprite(
          SATELLITE_ART,
          event.x + event.vx * elapsed - (SATELLITE_ART[0].length * unit) / 2,
          event.y + event.vy * elapsed,
          fade * 0.8,
          (cell) => (cell === '#' ? colours.body : cell === 'a' && blink ? colours.signal : null),
        );
        return true;
      }

      // The rocket rises faster and faster, its flame flickering, a trail of sparks behind it
      const rise = t * t;
      const left = event.x - (ROCKET_ART[0].length * unit) / 2;
      const top = event.y + event.vy * rise;
      const flicker = Math.floor(elapsed / 90) % 2 === 0;
      drawSprite(ROCKET_ART, left, top, fade * 0.85, (cell) => {
        if (cell === '#') return colours.body;
        if (cell === 'o') return colours.blue;
        if (cell === 'f') return flicker ? colours.flame : colours.flameHot;
        if (cell === 'F') return flicker ? colours.flameHot : colours.flame;
        return null;
      });
      for (let i = 1; i <= 4; i++) {
        ctx.fillStyle = rgba(colours.flame, fade * 0.5 * (1 - i / 5));
        ctx.fillRect(
          snap(event.x - unit / 2 + (i % 2 === 0 ? unit : -unit) * 0.5),
          snap(top + ROCKET_ART.length * unit + i * 3),
          unit,
          unit,
        );
      }
      return true;
    };

    /**
     * Updates physics states and renders the canvas elements.
     * @param timestamp System animation timestamp.
     */
    const updateAndDrawScene = (timestamp: number) => {
      // Clear viewport
      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // Determine active theme on the fly
      const colours = document.documentElement.classList.contains('dark') ? PALETTE.dark : PALETTE.light;

      // --- Phase 1: Update and Draw Stars (O(n)) ---
      for (const star of stars) {
        // 1. Move stars
        star.x += star.vx;
        star.y += star.vy;

        // 2. Collision boundaries
        if (star.x < 0 || star.x > width) star.vx = -star.vx;
        if (star.y < 0 || star.y > height) star.vy = -star.vy;

        // 3. Mouse repulsion physics
        const dxMouse = mouse.x - star.x;
        const dyMouse = mouse.y - star.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        let near = 0;

        // Optimize: Calculate square root only if stars are within reach
        if (distMouseSq < MOUSE_REPEL_DISTANCE_SQ) {
          const distance = Math.sqrt(distMouseSq);
          const force = (MOUSE_REPEL_DISTANCE - distance) / MOUSE_REPEL_DISTANCE;
          const forceX = (dxMouse / distance) * force * MOUSE_REPEL_FORCE;
          const forceY = (dyMouse / distance) * force * MOUSE_REPEL_FORCE;

          star.x -= forceX;
          star.y -= forceY;
          near = force;
        }

        // 4. Update twinkling alpha state
        star.opacity = 0.3 + Math.sin(timestamp * star.speed + star.phase) * 0.5 + 0.5;
        const twinkle = Math.min(star.opacity, 1.0);
        const alpha = Math.min(1, twinkle * (1 + near * MOUSE_BRIGHTEN)) * colours.alpha;

        // 5. Draw the star as a pixel on the grid of the screen: dust, a larger star, or a sparkle with four arms
        const size = snap(star.radius >= SPARKLE_RADIUS_MIN ? 2 : star.radius >= STAR_RADIUS_STAR ? 1.5 : 1);
        const x = snap(star.x - size / 2);
        const y = snap(star.y - size / 2);
        ctx.fillStyle = rgba(colours[star.tint], alpha);
        ctx.fillRect(x, y, size, size);
        if (star.radius >= SPARKLE_RADIUS_MIN) {
          const arm = star.tint === 'neutral' ? colours.arm : colours[star.tint];
          ctx.fillStyle = rgba(arm, alpha * SPARKLE_ARM_OPACITY);
          ctx.fillRect(x - size, y, size, size);
          ctx.fillRect(x + size, y, size, size);
          ctx.fillRect(x, y - size, size, size);
          ctx.fillRect(x, y + size, size, size);
          // The far ends of the arms come in smoothly as the star nears its brightest
          const reach = Math.max(0, (twinkle - 0.6) / 0.4);
          if (reach > 0) {
            const half = snap(size / 2);
            ctx.fillStyle = rgba(arm, alpha * SPARKLE_FAR_ARM_OPACITY * reach);
            ctx.fillRect(x - size - half, y + half / 2, half, half);
            ctx.fillRect(x + size * 2, y + half / 2, half, half);
            ctx.fillRect(x + half / 2, y - size - half, half, half);
            ctx.fillRect(x + half / 2, y + size * 2, half, half);
          }
        }
      }

      // --- Phase 2: Draw Connection Lines (O(n^2)) ---
      ctx.lineWidth = Math.max(1 / dpr, 0.5);
      ctx.setLineDash(LINE_DASH);

      for (let i = 0; i < stars.length; i++) {
        const star1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const star2 = stars[j];

          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distanceSq = dx * dx + dy * dy;

          // Optimize: Compare squared distance values directly
          if (distanceSq < LINE_MAX_DISTANCE_SQ) {
            // Optimize: Calculate opacity based on distanceSq to avoid Math.sqrt calls
            // This yields quadratic decay instead of linear, which looks visually organic and runs much faster
            // (a little stronger than a solid line would be, as the dots leave gaps)
            const opacity = 0.28 * (1 - distanceSq / LINE_MAX_DISTANCE_SQ);
            ctx.strokeStyle = rgba(colours.line, colours === PALETTE.light ? opacity * 1.5 : opacity);
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // --- Phase 3: A rare event now and then ---
      if (!drawEvent(timestamp, colours)) {
        event = null;
        if (timestamp >= nextEvent) {
          if (!reducedMotion.matches && document.visibilityState === 'visible') event = launchEvent(timestamp);
          nextEvent = timestamp + EVENT_INTERVAL_MIN + Math.random() * EVENT_INTERVAL_RANGE;
        }
      }
    };

    // Frame scheduler loop
    const animate = () => {
      const timestamp = Date.now(); // Grab current system time once per frame
      updateAndDrawScene(timestamp);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // --- Init ---
    setCanvasSize();
    starsRef.current = createStars();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="tuwadocs:fixed tuwadocs:inset-0 tuwadocs:w-full tuwadocs:h-full tuwadocs:pointer-events-none tuwadocs:bg-gradient-to-b tuwadocs:from-slate-200 tuwadocs:to-slate-350 tuwadocs:dark:from-[#0a0e27] tuwadocs:dark:to-[#1a1f3a]"
    />
  );
}
