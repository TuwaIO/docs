import React, { type ComponentType, type CSSProperties, type HTMLAttributes, type SVGProps } from 'react';

import type { PackageType, ProjectIcon } from '../projectIcons';
import { ProjectSquare } from './ProjectSquare';

/**
 * A pixel icon of an {@link Orb}.
 *
 * @deprecated Use `ProjectIcon`: the icons of {@link ProjectSquare}.
 */
export type OrbIcon = ProjectIcon;

/**
 * Props of {@link Orb}; the other props are applied to the root `div`.
 *
 * @deprecated Use `ProjectSquareProps`, the props of {@link ProjectSquare}.
 */
export interface OrbProps extends HTMLAttributes<HTMLDivElement> {
  /** The project, which selects the default icon */
  packageType: PackageType;
  /** Side of the square in pixels (default: `120`) */
  size?: number;
  /** The pixel icon (default: the icon of `packageType`) */
  pixelIcon?: OrbIcon;
  /** An SVG icon to show instead of the pixel icon */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** A CSS colour for the lit pixels instead of the accent, for example `var(--tuwa-text-accent)` */
  color?: string;
}

/**
 * The badge of a TUWA project. It was a round knob in the brand colour of the project; in paper and ink it is the
 * {@link ProjectSquare} of the project, square and in ink, which it renders with the same props (`size` is the side of
 * the square, `color` the colour of the lit pixels).
 *
 * @deprecated Use {@link ProjectSquare}.
 * @param props - See {@link OrbProps}.
 * @param ref - Ref of the root `div`.
 * @returns The square of the project.
 */
export const Orb = React.forwardRef<HTMLDivElement, OrbProps>(
  ({ packageType, size = 120, pixelIcon, icon, color, style, ...props }, ref) => (
    <ProjectSquare
      ref={ref}
      packageType={packageType}
      icon={pixelIcon}
      svgIcon={icon}
      size={size}
      style={color ? ({ '--tuwa-pixel-lit': color, ...style } as CSSProperties) : style}
      {...props}
    />
  ),
);

Orb.displayName = 'Orb';
