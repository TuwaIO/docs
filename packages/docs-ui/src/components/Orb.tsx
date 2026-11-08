'use client';

import { cn } from '@tuwaio/nova-core/utils';
import React, { type CSSProperties, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * A TUWA project with its own brand color and {@link Orb} icon.
 */
export type PackageType = 'orbit' | 'pulsar' | 'satellite' | 'nova' | 'quasar' | 'siwx' | 'sdk';

/**
 * A pixel icon of an {@link Orb}, each with its own quiet motion: `sign-in` (an arrow gliding into a door), `orbit` (a
 * planet going round its star), `satellite` (floating, sending a signal), `pulsar` (a neutron star whose two beams
 * pulse outwards), `cloud` (data rising into a cloud), `server` (two racks with blinking lights), `supernova` (a star
 * that flares and throws a shock wave out), `terminal` (a prompt being typed) and `rocket` (it takes off once, into its
 * place, when it comes into view).
 */
export type OrbIcon =
  'sign-in' | 'orbit' | 'satellite' | 'pulsar' | 'cloud' | 'server' | 'supernova' | 'terminal' | 'rocket';

/**
 * Props of {@link Orb}; the other props are applied to the root `div`.
 */
export interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The project, which selects the color and the default icon */
  packageType: PackageType;
  /** Diameter in pixels (default: `120`) */
  size?: number;
  /** The pixel icon (default: the icon of `packageType`) */
  pixelIcon?: OrbIcon;
  /** An SVG icon to show instead of the pixel icon, in the color of the project */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** A CSS color instead of the brand color of the project, for example `var(--tuwa-text-accent)` */
  color?: string;
}

/** Brand color per package */
const packageColors: Record<PackageType, string> = {
  siwx: '#10b981',
  orbit: '#0d9488',
  satellite: '#0052ff',
  pulsar: '#f59e0b',
  quasar: '#2563eb',
  nova: '#0284c7',
  sdk: '#1d4ed8',
};

/** The icon of each project when no other is given. */
const defaultIcons: Record<PackageType, OrbIcon> = {
  siwx: 'sign-in',
  orbit: 'orbit',
  satellite: 'satellite',
  pulsar: 'pulsar',
  quasar: 'cloud',
  nova: 'supernova',
  sdk: 'terminal',
};

/**
 * The icons on a 9 × 9 grid: `#` a pixel, `o` a lit pixel, `.` none. A letter is a pixel of a group that moves (`site.css`
 * animates each group of each icon): a lowercase one plain, an uppercase one lit.
 */
// prettier-ignore
const iconArt: Record<OrbIcon, string[]> = {
  // The arrow (a) glides into the door
  'sign-in': [
    '.....####',
    '........#',
    '....a...#',
    '.....a..#',
    'aaaaaaA.#',
    '.....a..#',
    '....a...#',
    '........#',
    '.....####',
  ],
  // A star in the middle of an orbit; the planet that goes round it is an element of its own
  orbit: [
    '...###...',
    '.##...##.',
    '.#.....#.',
    '#..ooo..#',
    '#..ooo..#',
    '#..ooo..#',
    '.#.....#.',
    '.##...##.',
    '...###...',
  ],
  // The light of the antenna (A) blinks and its signal (b) goes out
  satellite: [
    '...b.b...',
    '....A....',
    '....#....',
    '...###...',
    '##.###.##',
    '#########',
    '##.###.##',
    '...###...',
    '.........',
  ],
  // A neutron star with its two beams: a pulse runs out along them (A, B, C)
  pulsar: [
    '........C',
    '.......B.',
    '....#.A..',
    '...ooo...',
    '..#ooo#..',
    '...ooo...',
    '..A.#....',
    '.B.......',
    'C........',
  ],
  // Data (A, B, C) rises into the cloud
  cloud: [
    '.........',
    '....ooo..',
    '..##...#.',
    '.#......#',
    '#.......#',
    '#.......#',
    '.#######.',
    '..A.B.C..',
    '.........',
  ],
  // The lights of the two racks (A, B) blink in turn
  server: [
    '.........',
    '.#######.',
    '.#A.####.',
    '.#######.',
    '.........',
    '.#######.',
    '.#B.####.',
    '.#######.',
    '.........',
  ],
  // A star that flares (C) and throws a shock wave out (A), the tips of its rays (b) catching the light
  supernova: [
    'A...b...A',
    '....#....',
    '..#.#.#..',
    '...CCC...',
    'b##CCC##b',
    '...CCC...',
    '..#.#.#..',
    '....#....',
    'A...b...A',
  ],
  // A prompt: the characters (A, B) are typed and the cursor (C) blinks
  terminal: [
    '#########',
    '#########',
    '#.......#',
    '#.#.....#',
    '#..#....#',
    '#.#.ABC.#',
    '#.......#',
    '#.......#',
    '#########',
  ],
  // A rocket with its window lit and its flame (A, b), which flickers while it takes off
  rocket: [
    '....#....',
    '...###...',
    '...#o#...',
    '...###...',
    '...###...',
    '..#####..',
    '.#.###.#.',
    '...bAb...',
    '....b....',
  ],
};

/** The pixels of an icon: their column, row, whether each is lit and the group it moves with. */
const pixelsOf = (icon: OrbIcon) =>
  iconArt[icon].flatMap((row, y) =>
    [...row].flatMap((cell, x) => {
      if (cell === '.') return [];
      const group = /[a-z]/i.test(cell) && cell !== 'o' ? cell.toLowerCase() : undefined;
      return [{ x, y, lit: cell === 'o' || cell !== cell.toLowerCase(), group }];
    }),
  );

/**
 * The badge of a TUWA project, in the manner of the TUWA switches: a flat round knob with the borders and background of
 * the theme, a pixel icon in the brand color of the project (or an SVG `icon`) and a quiet glow of that color along its
 * lower edge. When it first comes into view the icon gathers pixel by pixel, in a wave from one corner, and then moves
 * slowly in its own way (see {@link OrbIcon}); still for reduced motion, and visible without JavaScript.
 *
 * Side effects: an `IntersectionObserver` until the badge has come into view.
 *
 * @param props - See {@link OrbProps}.
 * @param ref - Ref of the root `div`.
 * @returns The badge.
 */
export const Orb = React.forwardRef<HTMLDivElement, OrbProps>(
  ({ packageType, size = 120, pixelIcon, icon: Icon, color, className, style, ...props }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
    const [shown, setShown] = useState(false);
    const iconName = pixelIcon ?? defaultIcons[packageType];

    useEffect(() => {
      const root = rootRef.current;
      if (!root || typeof IntersectionObserver === 'undefined') {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShown(true);
            observer.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(root);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={rootRef}
        className={cn('tuwa-orb', `tuwa-orb--${iconName}`, shown && 'tuwa-orb--shown', className)}
        style={
          {
            width: size,
            height: size,
            '--orb': color ?? packageColors[packageType],
            '--orb-step': `${size / 16}px`,
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        <span aria-hidden className="tuwa-orb__glow" />
        {Icon ? (
          <Icon aria-hidden className="tuwa-orb__svg" />
        ) : (
          <span aria-hidden className="tuwa-orb__pixels">
            {pixelsOf(iconName).map(({ x, y, lit, group }) => (
              <span
                key={`${x}-${y}`}
                data-g={group}
                className={cn('tuwa-orb__pixel', lit && 'tuwa-orb__pixel--lit')}
                style={{ '--x': x, '--y': y, '--delay': `${(x + y) * 28}ms` } as CSSProperties}
              />
            ))}
            {iconName === 'orbit' && (
              <span className="tuwa-orb__spin">
                <span className="tuwa-orb__planet" />
              </span>
            )}
          </span>
        )}
      </div>
    );
  },
);

Orb.displayName = 'Orb';
