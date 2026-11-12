import { cn } from '@tuwaio/nova-core/utils';
import React, {
  type ComponentType,
  type CSSProperties,
  type HTMLAttributes,
  type SVGAttributes,
  type SVGProps,
} from 'react';

import { type PackageType, type ProjectIcon, projectIconArt, projectIcons } from '../projectIcons';

/**
 * Props of {@link PixelArt}; the other props are applied to the `svg`.
 */
export interface PixelArtProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** The picture, row by row, in the notation of {@link projectIconArt}; every row has the same length */
  art: readonly string[];
  /** Whether the pixels fly in to their places once, when it renders (default: `false`); still for reduced motion */
  assemble?: boolean;
  /**
   * The icon whose own motion the picture plays while the reader points at it (`startPixelMotion`): the arrow glides
   * into the door of `sign-in`, a planet goes round `orbit`, and so on (see {@link ProjectIcon}). With `assemble` only.
   */
  motion?: ProjectIcon;
}

/**
 * Where a pixel starts when the picture assembles: up to 9 cells off its place on one axis. Integer arithmetic, so the
 * server and every browser render the same markup.
 */
const offsetOf = (index: number, axis: number) => {
  const seed = (Math.imul(index + 1, 2654435761) ^ Math.imul(axis + 1, 40503)) >>> 0;
  return ((seed % 181) - 90) / 10;
};

/**
 * A pixel picture in paper and ink: square pixels of ink and lit pixels of the accent (each fills a hair more than its
 * cell, so no seam shows), sized by the CSS of the `svg`. The colours come from `--tuwa-pixel-ink` and
 * `--tuwa-pixel-lit`, by default the text colour and the accent of the theme. With `assemble` the pixels fly in to
 * their places once, one after another, when it renders (CSS in `site.css`, nothing for reduced motion); with `motion`
 * too, the picture assembles again and plays the motion of its icon while the reader points at it
 * (`startPixelMotion`). The letters of the picture name the groups of pixels that move (`data-g`). Decorative: hidden
 * from assistive technology.
 *
 * @param props - See {@link PixelArtProps}.
 * @returns The `svg`.
 */
export function PixelArt({ art, assemble = false, motion, className, ...props }: PixelArtProps) {
  const width = art[0]?.length ?? 0;
  const pixels = art.flatMap((row, y) =>
    [...row].flatMap((cell, x) =>
      cell === '.'
        ? []
        : [
            {
              x,
              y,
              lit: cell === 'o' || cell !== cell.toLowerCase(),
              group: /[a-z]/i.test(cell) && cell !== 'o' ? cell.toLowerCase() : undefined,
            },
          ],
    ),
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${art.length}`}
      aria-hidden="true"
      focusable="false"
      data-motion={(assemble && motion) || undefined}
      className={cn('tuwa-pixel-art', assemble && 'tuwa-pixel-art--assemble', className)}
      {...props}
    >
      {pixels.map(({ x, y, lit, group }, index) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1.02}
          height={1.02}
          data-lit={lit || undefined}
          data-g={group}
          style={
            assemble
              ? ({
                  '--i': index,
                  '--x': x,
                  '--y': y,
                  '--dx': `${offsetOf(index, 0)}px`,
                  '--dy': `${offsetOf(index, 1)}px`,
                } as CSSProperties)
              : undefined
          }
        />
      ))}
      {/* The planet of the orbit, on the top of its ring: it shows and goes round while the reader points at the icon */}
      {assemble && motion === 'orbit' && (
        <g className="tuwa-pixel-art__spin">
          <rect className="tuwa-pixel-art__planet" x={3.7} y={-0.3} width={1.6} height={1.6} />
        </g>
      )}
    </svg>
  );
}

/**
 * Props of {@link CornerMarks}; the other props are applied to the `svg`.
 */
export interface CornerMarksProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'width' | 'height'> {
  /** Width of the marked box in pixels, the marks included */
  width: number;
  /** Height of the marked box in pixels, the marks included */
  height: number;
  /** Length of each arm of a mark in pixels (default: `6`) */
  arm?: number;
}

/**
 * Four corner marks of 1px, the viewfinder of paper and ink around a tile or a point that is aimed at, in the colour of
 * the text (`currentColor`). Decorative: hidden from assistive technology.
 *
 * @param props - See {@link CornerMarksProps}.
 * @returns The `svg`.
 */
export function CornerMarks({ width, height, arm = 6, className, ...props }: CornerMarksProps) {
  const right = width - 0.5;
  const bottom = height - 0.5;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      className={cn('tuwa-corner-marks', className)}
      {...props}
    >
      <path
        d={`M0.5 ${arm}V0.5H${arm}M${width - arm} 0.5H${right}V${arm}M${right} ${height - arm}V${bottom}H${width - arm}M${arm} ${bottom}H0.5V${height - arm}`}
      />
    </svg>
  );
}

/**
 * Props of {@link ProjectSquare}, besides the project or the icon; the other props are applied to the root `div`.
 */
export interface ProjectSquareOptions {
  /** An SVG icon to show instead of the pixel icon, in the colour of the text */
  svgIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** Side of the square in pixels, its frame included (default: `44`); the corner marks stand 5px outside it */
  size?: number;
  /** Whether it is the current one (the corner marks in the accent), as the stage being read (default: `false`) */
  active?: boolean;
  /** Whether the pixels fly in to their places once, when it renders (default: `true`); still for reduced motion */
  assemble?: boolean;
}

/**
 * Props of {@link ProjectSquare}: the project (`packageType`), its icon (`icon`, by default the icon of the project in
 * {@link projectIcons}) or both, and {@link ProjectSquareOptions}.
 */
export type ProjectSquareProps = (
  { packageType: PackageType; icon?: ProjectIcon } | { packageType?: PackageType; icon: ProjectIcon }
) &
  ProjectSquareOptions &
  Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * The square of a TUWA project, in paper and ink: a frame of 1px in the strong line colour with the pixel icon of the
 * project inside (or an SVG `svgIcon`), and four corner marks 5px outside it that turn to the accent when the square is
 * `active` or under the pointer inside an element with the `group` class. The pixels assemble once when it renders
 * (CSS in `site.css`), still for reduced motion and visible without JavaScript; a server can render it. With `assemble`,
 * `startPixelMotion` on a part around it plays the motion of its project until `stopPixelMotion`.
 *
 * @param props - See {@link ProjectSquareProps}.
 * @param ref - Ref of the root `div`.
 * @returns The square.
 */
export const ProjectSquare = React.forwardRef<HTMLDivElement, ProjectSquareProps>(
  (
    { packageType, icon, svgIcon: Icon, size = 44, active = false, assemble = true, className, style, ...props },
    ref,
  ) => {
    const iconName = icon ?? projectIcons[packageType as PackageType];
    return (
      <div
        ref={ref}
        className={cn('tuwa-project-square', active && 'tuwa-project-square--active', className)}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        {Icon ? (
          <Icon aria-hidden className="tuwa-project-square__art" />
        ) : (
          // With `assemble`, the icon plays the motion of its project while the reader points at it (`startPixelMotion`)
          <PixelArt
            art={projectIconArt[iconName]}
            assemble={assemble}
            motion={iconName}
            className="tuwa-project-square__art"
          />
        )}
        <CornerMarks width={size + 10} height={size + 10} className="tuwa-project-square__corners" />
      </div>
    );
  },
);

ProjectSquare.displayName = 'ProjectSquare';
