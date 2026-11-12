'use client';

import { cn } from '@tuwaio/nova-core/utils';
import { type CSSProperties, useState, useSyncExternalStore } from 'react';

import { dropAnchor } from '../anchor';

const subscribeNothing = () => () => {};

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

/**
 * A pixel of the 7 × 7 grid; `twinkle` makes it shine on and off after a change (the stars), a corner rounds that
 * corner of the pixel (the disc of the sun, so it reads as a disc).
 */
type Pixel = readonly [x: number, y: number, mark?: 'twinkle' | 'tl' | 'tr' | 'bl' | 'br'];

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
  [6, 0, 'twinkle'], [5, 3, 'twinkle'],
];

/** The sun: a round disc and eight rays, steady and solid so it reads at a glance in a header. */
// prettier-ignore
const SUN: Pixel[] = [
  [2, 2, 'tl'], [3, 2], [4, 2, 'tr'],
  [2, 3], [3, 3], [4, 3],
  [2, 4, 'bl'], [3, 4], [4, 4, 'br'],
  [3, 0], [5, 1], [6, 3], [5, 5], [3, 6], [1, 5], [0, 3], [1, 1],
];

/** The pixels of both pictures in the order of their angle around the centre, so each pixel travels a short way. */
const byAngle = (pixels: Pixel[]) =>
  [...pixels].sort(([ax, ay], [bx, by]) => Math.atan2(ay - 3, ax - 3) - Math.atan2(by - 3, bx - 3));
const MOON_PATH = byAngle(MOON);
const SUN_PATH = byAngle(SUN);
const COUNT = Math.max(MOON_PATH.length, SUN_PATH.length);

/**
 * A light/dark switch in the cosmic manner of TUWA: a knob that slides with a spring and stretches on its way; on it a
 * pixel crescent moon with stars in the dark and a solid pixel sun with a round disc and a warm halo in the light, each
 * pixel travelling to its place when the theme changes; for about two seconds after a change the stars dim and shine
 * once and a satellite or a planet passes slowly on its orbit, then all is still (it sits in a header); a glow along an
 * edge of the knob, the accent under it in the dark and warm amber over it in the light. Flat, in the TUWA style: the
 * borders, backgrounds and radius of the theme. Only CSS (`site.css`), nothing to install; still at once for reduced
 * motion. It stores no theme itself: pass the resolved theme and a toggle. A click removes the anchor (`#…`) from the
 * address, keeping the page where it is (it replaces the current entry of the browser history). While the page hydrates it renders an
 * invisible placeholder of the same size, so the server output does not depend on the theme; rendered on the client
 * (as after a change of language) it shows at once.
 *
 * @param props - See {@link ThemeSwitcherProps}.
 * @returns The switch button.
 */
export function ThemeSwitcher({ theme, onToggle, ariaLabel = 'Toggle theme' }: ThemeSwitcherProps) {
  // A placeholder only while the page hydrates: a switch rendered on the client (the next page after a language
  // change, a separate root layout) shows at once, with nothing blinking
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  // The first render places the knob without moving it; the moves of later toggles play
  const [moved, setMoved] = useState(false);

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
        // A change of the theme leaves the page where it is, without the anchor a link of the page opened
        dropAnchor();
        onToggle();
      }}
      className={cn(
        'tuwa-theme-switch tuwa-switch-appear',
        isDark ? 'tuwa-theme-switch--dark' : 'tuwa-theme-switch--light',
      )}
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
            const mark = pixel?.[2];
            return (
              <span
                key={index}
                className={cn(
                  'tuwa-theme-switch__pixel',
                  mark === 'twinkle' && 'tuwa-theme-switch__pixel--twinkle',
                  mark && mark !== 'twinkle' && `tuwa-theme-switch__pixel--${mark}`,
                )}
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
