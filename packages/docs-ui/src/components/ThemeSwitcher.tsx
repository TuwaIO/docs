'use client';

import { cn } from '@tuwaio/nova-core/utils';
import { type CSSProperties, useEffect, useState } from 'react';

/**
 * Props of {@link ThemeSwitcher}.
 */
export interface ThemeSwitcherProps {
  /** The resolved theme of the site; `'dark'` selects the moon, anything else the sun */
  theme: string;
  /** Called when the switch is clicked; switch the theme of the site here (for example with `next-themes`) */
  onToggle: () => void;
  /** Accessible name of the switch button (default: `'Toggle theme'`) */
  ariaLabel?: string;
}

/** A pixel of the 7 × 7 grid; `twinkle` makes it shine on and off (the stars, the rays). */
type Pixel = readonly [x: number, y: number, twinkle?: 1];

/** A crescent moon and two stars that twinkle. */
// prettier-ignore
const MOON: Pixel[] = [
  [2, 0], [3, 0], [4, 0],
  [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2],
  [0, 3], [1, 3], [2, 3],
  [0, 4], [1, 4], [2, 4],
  [1, 5], [2, 5], [3, 5],
  [2, 6], [3, 6], [4, 6],
  [6, 0, 1], [5, 3, 1],
];

/** A star like the sun: its disc and eight rays that pulse as a pulsar's. */
// prettier-ignore
const SUN: Pixel[] = [
  [2, 2], [3, 2], [4, 2],
  [2, 3], [3, 3], [4, 3],
  [2, 4], [3, 4], [4, 4],
  [3, 0, 1], [5, 1, 1], [6, 3, 1], [5, 5, 1], [3, 6, 1], [1, 5, 1], [0, 3, 1], [1, 1, 1],
];

/** The pixels of both pictures in the order of their angle around the centre, so each pixel travels a short way. */
const byAngle = (pixels: Pixel[]) =>
  [...pixels].sort(([ax, ay], [bx, by]) => Math.atan2(ay - 3, ax - 3) - Math.atan2(by - 3, bx - 3));
const MOON_PATH = byAngle(MOON);
const SUN_PATH = byAngle(SUN);
const COUNT = Math.max(MOON_PATH.length, SUN_PATH.length);

/**
 * A light/dark switch in the cosmic manner of TUWA: a knob that slides with a spring and stretches on its way; on it a
 * pixel crescent moon with twinkling stars and a satellite on its orbit in the dark, a pixel star like the sun with
 * pulsing rays and a planet on its orbit in the light, each pixel travelling to its place when the theme changes; a glow
 * along an edge of the knob, the accent under it in the dark and warm amber over it in the light. Flat, in the TUWA
 * style: the borders, backgrounds and radius of the theme. Only CSS (`site.css`), nothing to install; still at once for
 * reduced motion. It stores no theme itself: pass the
 * resolved theme and a toggle. Until it is mounted on the client it renders an invisible placeholder of the same size,
 * so the server output does not depend on the theme.
 *
 * @param props - See {@link ThemeSwitcherProps}.
 * @returns The switch button.
 */
export function ThemeSwitcher({ theme, onToggle, ariaLabel = 'Toggle theme' }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  // The first render places the knob without moving it; the moves of later toggles play
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div aria-hidden className="tuwa-theme-switch tuwa-theme-switch--placeholder" />;
  }

  const isDark = theme === 'dark';
  const pixels = isDark ? MOON_PATH : SUN_PATH;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={ariaLabel}
      onClick={() => {
        setMoved(true);
        onToggle();
      }}
      className={cn('tuwa-theme-switch', isDark ? 'tuwa-theme-switch--dark' : 'tuwa-theme-switch--light')}
    >
      <span
        aria-hidden
        className={cn(
          'tuwa-theme-switch__knob',
          moved && (isDark ? 'tuwa-theme-switch__knob--to-dark' : 'tuwa-theme-switch__knob--to-light'),
        )}
      >
        <span className="tuwa-theme-switch__glow tuwa-theme-switch__glow--top" />
        <span className="tuwa-theme-switch__glow tuwa-theme-switch__glow--bottom" />
        <span className="tuwa-theme-switch__pixels">
          {Array.from({ length: COUNT }, (_, index) => {
            const pixel = pixels[index];
            return (
              <span
                key={index}
                className={cn('tuwa-theme-switch__pixel', pixel?.[2] && 'tuwa-theme-switch__pixel--twinkle')}
                style={
                  {
                    '--x': pixel ? pixel[0] : 3,
                    '--y': pixel ? pixel[1] : 3,
                    '--delay': `${index * 14}ms`,
                    '--twinkle-delay': `${(index % 4) * 600}ms`,
                    opacity: pixel ? 1 : 0,
                  } as CSSProperties
                }
              />
            );
          })}
        </span>
        {/* A satellite around the moon, a planet around the sun: on a tilted orbit */}
        <span className="tuwa-theme-switch__orbit">
          <span className="tuwa-theme-switch__orbiter" />
        </span>
      </span>
    </button>
  );
}
