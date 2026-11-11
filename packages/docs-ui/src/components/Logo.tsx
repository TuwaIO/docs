import React from 'react';

const LIGHT_LOGO_URL = 'https://tuwa.io/brand/logo_v2.svg';
const DARK_LOGO_URL = 'https://tuwa.io/brand/logo_glow.svg';

export interface SiteLogoProps {
  /**
   * Width in pixels. Without it the logo fits the navbar of a documentation site by its height: 20px, 22px from 640px
   * wide, so the logo and both switches fit one row on a 320px phone.
   */
  width?: number;
  /** Height attribute in pixels, for the aspect ratio before the image loads (default: 40) */
  height?: number;
  /** Additional CSS classes for wrapper */
  className?: string;
  /** Light mode logo source (default: https://tuwa.io/brand/logo_v2.svg) */
  lightSrc?: string;
  /** Dark mode logo source (default: https://tuwa.io/brand/logo_glow.svg) */
  darkSrc?: string;
}

/**
 * SiteLogo renders the TUWA brand logo:
 * - Light mode: ink pixel logo with the nodes in the TUWA accent (https://tuwa.io/brand/logo_v2.svg)
 * - Dark mode: cyan pixel logo (https://tuwa.io/brand/logo_glow.svg) with constellation nodes and lines and a soft glow
 *
 * Using standalone <img> tags isolates each SVG document context, completely avoiding
 * WebKit/Safari SVG ID collision and gradient-rendering bugs.
 * Pure presentation element with no event handlers, ensuring it can safely cross Server/Client component boundaries.
 *
 * The logo keeps its size in a narrow flex row: the images opt out of the `max-width: 100%` of Tailwind's base styles,
 * which let the logo link of the Nextra navbar shrink below the logo, so the logo painted over the next items.
 */
export function SiteLogo({
  width,
  height = 40,
  className = '',
  lightSrc = LIGHT_LOGO_URL,
  darkSrc = DARK_LOGO_URL,
}: SiteLogoProps) {
  // A given width is kept, for the headers that size the logo themselves; otherwise the height of the docs navbar
  const sizeClass = width === undefined ? 'tuwadocs:h-5 tuwadocs:sm:h-[22px] tuwadocs:w-auto' : 'tuwadocs:h-auto';
  const sizeStyle = width === undefined ? {} : { width: `${width}px`, height: 'auto' };
  return (
    <div
      className={`tuwadocs:relative tuwadocs:flex tuwadocs:items-center tuwadocs:justify-center tuwadocs:shrink-0 ${className}`}
    >
      {/* Light theme: crisp black logo */}
      <img
        src={lightSrc}
        alt="TUWA"
        width={width ?? 126}
        height={height}
        className={`tuwadocs:block tuwadocs:dark:hidden ${sizeClass} tuwadocs:max-w-none tuwadocs:transition-opacity tuwadocs:duration-300`}
        style={sizeStyle}
        loading="eager"
        decoding="async"
      />
      {/* Dark theme: cyan glowing logo with constellation geometry and drop-shadow glow */}
      <img
        src={darkSrc}
        alt="TUWA"
        width={width ?? 126}
        height={height}
        className={`tuwadocs:hidden tuwadocs:dark:block ${sizeClass} tuwadocs:max-w-none tuwadocs:transition-opacity tuwadocs:duration-300`}
        style={{
          ...sizeStyle,
          // A soft glow, in step with the quiet glows of the header switches; a wide bright halo pulled the eye
          filter: 'drop-shadow(0 0 4px rgba(34, 195, 230, 0.32))',
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
