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
}

// --- Configuration Constants ---
// Removes magic numbers and allows easy customization of the effect
const NUM_STARS = 100;
const STAR_RADIUS_MIN = 0.9;
const STAR_RADIUS_MAX = 2.7;
const STAR_VELOCITY_FACTOR = 0.3; // Speed scaling factor
const STAR_INITIAL_OPACITY_MIN = 0.5;
const STAR_INITIAL_OPACITY_RANGE = 0.5; // (min + Math.random() * range)

// Mouse repulsion settings
const MOUSE_REPEL_DISTANCE = 150;
const MOUSE_REPEL_DISTANCE_SQ = MOUSE_REPEL_DISTANCE * MOUSE_REPEL_DISTANCE; // Pre-calculated squared distance
const MOUSE_REPEL_FORCE = 2;

// The brightest stars are drawn as small pixel sparkles: a core and four arms
const SPARKLE_RADIUS_MIN = 2.3;
const SPARKLE_ARM_OPACITY = 0.45;

// Connector lines configuration
const LINE_MAX_DISTANCE = 120;
const LINE_MAX_DISTANCE_SQ = LINE_MAX_DISTANCE * LINE_MAX_DISTANCE; // Pre-calculated squared distance
const LINE_WIDTH = 0.75;
const TWINKLE_SPEED = 0.001;

/**
 * A full-size canvas of slowly drifting, twinkling stars joined by lines, which move away from the mouse pointer. The
 * stars are crisp pixels on the pixel grid of the screen, in the pixel manner of the TUWA switches, and the brightest
 * are small four-armed sparkles. Place it behind the content of a page; it takes the size of the window and follows
 * its resizes.
 *
 * Side effects: `mousemove` and `resize` listeners on `window` and a `requestAnimationFrame` loop, all removed on
 * unmount.
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

    // Populate stars using predefined dimensions and limits
    const createStars = (): Star[] => {
      const stars: Star[] = [];
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (STAR_RADIUS_MAX - STAR_RADIUS_MIN) + STAR_RADIUS_MIN,
          vx: (Math.random() - 0.5) * STAR_VELOCITY_FACTOR,
          vy: (Math.random() - 0.5) * STAR_VELOCITY_FACTOR,
          opacity: Math.random() * STAR_INITIAL_OPACITY_RANGE + STAR_INITIAL_OPACITY_MIN,
        });
      }
      return stars;
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
     * Updates physics states and renders the canvas elements.
     * @param timestamp System animation timestamp.
     */
    const updateAndDrawScene = (timestamp: number) => {
      // Clear viewport
      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // Determine active theme on the fly
      const isDark = document.documentElement.classList.contains('dark');

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

        // Optimize: Calculate square root only if stars are within reach
        if (distMouseSq < MOUSE_REPEL_DISTANCE_SQ) {
          const distance = Math.sqrt(distMouseSq);
          const force = (MOUSE_REPEL_DISTANCE - distance) / MOUSE_REPEL_DISTANCE;
          const forceX = (dxMouse / distance) * force * MOUSE_REPEL_FORCE;
          const forceY = (dyMouse / distance) * force * MOUSE_REPEL_FORCE;

          star.x -= forceX;
          star.y -= forceY;
        }

        // 4. Update twinkling alpha state
        star.opacity = 0.3 + Math.sin(timestamp * TWINKLE_SPEED + star.x) * 0.5 + 0.5;
        const clampedOpacity = Math.min(star.opacity, 1.0);

        // 5. Draw the star as a pixel on the grid of the screen; the brightest as a sparkle with four arms
        const size = Math.max(1 / dpr, snap(star.radius * 0.8));
        const x = snap(star.x - size / 2);
        const y = snap(star.y - size / 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${clampedOpacity})`
          : `rgba(15, 23, 42, ${clampedOpacity * 0.85})`; // slate-900
        ctx.fillRect(x, y, size, size);
        if (star.radius >= SPARKLE_RADIUS_MIN) {
          ctx.fillStyle = isDark
            ? `rgba(147, 197, 253, ${clampedOpacity * SPARKLE_ARM_OPACITY})` // blue-300
            : `rgba(71, 85, 105, ${clampedOpacity * SPARKLE_ARM_OPACITY})`; // slate-600
          ctx.fillRect(x - size, y, size, size);
          ctx.fillRect(x + size, y, size, size);
          ctx.fillRect(x, y - size, size, size);
          ctx.fillRect(x, y + size, size, size);
        }
      }

      // --- Phase 2: Draw Connection Lines (O(n^2)) ---
      ctx.lineWidth = LINE_WIDTH;

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
            const opacity = 0.2 * (1 - distanceSq / LINE_MAX_DISTANCE_SQ);

            if (isDark) {
              ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(71, 85, 105, ${opacity * 1.5})`; // slate-600
            }
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
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
