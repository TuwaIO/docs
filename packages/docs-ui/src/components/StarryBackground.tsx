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
}

// A rare shooting star: a pixel head with a trail of fading pixels, crossing a part of the sky once
interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  start: number;
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
const TWINKLE_SPEED = 0.001;

// Shooting stars: rare, short and faint
const COMET_INTERVAL_MIN = 10_000;
const COMET_INTERVAL_RANGE = 8_000;
const COMET_DURATION = 1_400;
const COMET_TRAIL = 9; // Pixels of the trail
const COMET_TRAIL_GAP = 3; // CSS pixels between two pixels of the trail

// The colours of the stars, the arms of the sparkles and the lines, on a dark and on a light page
const PALETTE: Record<'dark' | 'light', Record<Tint, Rgb> & { arm: Rgb; line: Rgb; alpha: number }> = {
  dark: {
    neutral: [255, 255, 255],
    blue: [147, 197, 253], // blue-300
    amber: [252, 211, 77], // amber-300
    arm: [147, 197, 253],
    line: [147, 197, 253],
    alpha: 1,
  },
  light: {
    neutral: [15, 23, 42], // slate-900
    blue: [29, 78, 216], // blue-700
    amber: [180, 83, 9], // amber-700
    arm: [71, 85, 105], // slate-600
    line: [71, 85, 105],
    alpha: 0.85,
  },
};

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

/**
 * A full-size canvas of slowly drifting, twinkling stars joined by dotted lines, which move away from the mouse pointer
 * and shine a little brighter near it. The stars are crisp pixels on the pixel grid of the screen, in the pixel manner
 * of the TUWA switches: specks of dust, larger stars and sparkles whose four arms reach out while they are at their
 * brightest; a few are blue or amber. Now and then (every 10 to 18 seconds) a faint pixel shooting star crosses a part
 * of the sky, except for reduced motion. Place it behind the content of a page; it takes the size of the window and
 * follows its resizes.
 *
 * Side effects: `mousemove` and `resize` listeners on `window` and a `requestAnimationFrame` loop, all removed on
 * unmount; it reads the `prefers-reduced-motion` media query before each shooting star.
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

    // Shooting stars only for those who have not asked for less motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let comet: Comet | null = null;
    let nextComet = Date.now() + COMET_INTERVAL_MIN / 2 + Math.random() * COMET_INTERVAL_RANGE;

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
        });
      }
      return stars;
    };

    // A shooting star from the upper part of the sky, sliding down to one side at a shallow angle
    const launchComet = (now: number): Comet => {
      const toRight = Math.random() < 0.5;
      const distance = Math.min(width, height) * (0.25 + Math.random() * 0.15);
      const angle = (12 + Math.random() * 14) * (Math.PI / 180);
      return {
        x: width * (toRight ? 0.1 + Math.random() * 0.5 : 0.4 + Math.random() * 0.5),
        y: height * Math.random() * 0.4,
        vx: (toRight ? 1 : -1) * Math.cos(angle) * distance,
        vy: Math.sin(angle) * distance,
        start: now,
      };
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
     * Draws a shooting star: its head and a trail of pixels that fade behind it, the whole fading in and out.
     * @param now Current time in milliseconds.
     * @param colours The palette of the theme.
     * @returns Whether it is still crossing the sky.
     */
    const drawComet = (now: number, colours: (typeof PALETTE)['dark']) => {
      if (!comet) return false;
      const t = (now - comet.start) / COMET_DURATION;
      if (t >= 1) return false;
      const eased = 1 - (1 - t) ** 3;
      const fade = Math.sin(Math.PI * t) * 0.8 * colours.alpha;
      const length = Math.hypot(comet.vx, comet.vy);
      const ux = comet.vx / length;
      const uy = comet.vy / length;
      const headX = comet.x + comet.vx * eased;
      const headY = comet.y + comet.vy * eased;
      const unit = snap(1.5);
      for (let i = COMET_TRAIL; i >= 0; i--) {
        const px = snap(headX - ux * i * COMET_TRAIL_GAP);
        const py = snap(headY - uy * i * COMET_TRAIL_GAP);
        ctx.fillStyle = rgba(i === 0 ? colours.neutral : colours.arm, fade * (1 - i / (COMET_TRAIL + 1)));
        ctx.fillRect(px, py, i === 0 ? unit * 1.5 : unit, i === 0 ? unit * 1.5 : unit);
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
        star.opacity = 0.3 + Math.sin(timestamp * TWINKLE_SPEED + star.x) * 0.5 + 0.5;
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

      // --- Phase 3: A shooting star now and then ---
      if (!drawComet(timestamp, colours)) {
        comet = null;
        if (timestamp >= nextComet) {
          if (!reducedMotion.matches && document.visibilityState === 'visible') comet = launchComet(timestamp);
          nextComet = timestamp + COMET_INTERVAL_MIN + Math.random() * COMET_INTERVAL_RANGE;
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
