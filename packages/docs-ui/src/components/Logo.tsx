import parse, { type DOMNode, domToReact, Element } from 'html-react-parser';
import React from 'react';

const LOGO_URL = 'https://tuwa.io/brand/logo_v2.svg';

const LIGHT_LOGO_URL = 'https://tuwa.io/brand/logo_v2.svg';
const DARK_LOGO_URL = 'https://tuwa.io/brand/logo_glow.svg';

export interface SiteLogoProps {
  /** Width in pixels (default: 126) */
  width?: number;
  /** Height in pixels (default: 40) */
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
 * - Light mode: black vector logo (https://tuwa.io/brand/logo_v2.svg)
 * - Dark mode: glowing cyan vector logo (https://tuwa.io/brand/logo_glow.svg) with constellation nodes/lines and ambient drop-shadow
 *
 * Using standalone <img> tags isolates each SVG document context, completely avoiding
 * WebKit/Safari SVG ID collision and gradient-rendering bugs.
 * Pure presentation element with no event handlers, ensuring it can safely cross Server/Client component boundaries.
 */
export function SiteLogo({
  width = 126,
  height = 40,
  className = '',
  lightSrc = LIGHT_LOGO_URL,
  darkSrc = DARK_LOGO_URL,
}: SiteLogoProps) {
  return (
    <div
      className={`tuwadocs:relative tuwadocs:flex tuwadocs:items-center tuwadocs:justify-center tuwadocs:shrink-0 ${className}`}
    >
      {/* Light theme: crisp black logo */}
      <img
        src={lightSrc}
        alt="TUWA"
        width={width}
        height={height}
        className="tuwadocs:block tuwadocs:dark:hidden tuwadocs:h-auto tuwadocs:transition-opacity tuwadocs:duration-300"
        style={{ width: `${width}px`, height: 'auto' }}
        loading="eager"
        decoding="async"
      />
      {/* Dark theme: cyan glowing logo with constellation geometry and drop-shadow glow */}
      <img
        src={darkSrc}
        alt="TUWA"
        width={width}
        height={height}
        className="tuwadocs:hidden tuwadocs:dark:block tuwadocs:h-auto tuwadocs:transition-opacity tuwadocs:duration-300"
        style={{
          width: `${width}px`,
          height: 'auto',
          filter: 'drop-shadow(0 0 12px rgba(103, 232, 249, 0.45))',
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export const TuwaLogo = SiteLogo;

/**
 * Props of {@link RemoteLogo}: the SVG attributes are applied to the root `svg` element.
 */
export interface RemoteLogoProps extends React.SVGProps<SVGSVGElement> {
  /** URL of the SVG (default: the TUWA logo, `https://tuwa.io/brand/logo_v2.svg`) */
  url?: string;
}

/**
 * Renders a remote SVG, by default the TUWA logo, as React elements, so the logo inherits `className` and CSS such as
 * `currentColor`. It is an async React Server Component for the Next.js App Router: it fetches the SVG on the server
 * (cached by Next.js for 24 hours), removes the XML declaration and doctype, and adds the `remote-logo` class and the
 * props to the root element.
 *
 * Network: one request to `url` per revalidation. When the request fails, it logs the error and renders an empty
 * `svg` with the props.
 *
 * @param props - See {@link RemoteLogoProps}.
 * @returns The logo as an `svg` element.
 */
export async function RemoteLogo({ url = LOGO_URL, className, style, ...props }: RemoteLogoProps) {
  let rawSvg: string;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`);
    }

    rawSvg = await response.text();
  } catch (error) {
    console.error('RemoteLogo: Failed to fetch SVG from remote source:', error);
    return <svg className={className} style={style} {...props} />;
  }

  // Strip XML declarations and doctype, and fix React xml:space warning
  const cleanSvg = rawSvg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/\sxml:space=/g, ' xmlSpace=')
    .trim();

  // Parse SVG string into React elements, overriding root <svg> attributes
  const parsed = parse(cleanSvg, {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'svg') {
        // Merge fetched SVG root attributes with component props
        const children = domToReact(domNode.children as DOMNode[]);
        const attribs = { ...domNode.attribs };

        // Map lowercase xmlspace to camelCase xmlSpace to avoid React DOM warning
        if ('xmlspace' in attribs) {
          attribs.xmlSpace = attribs.xmlspace;
          delete attribs.xmlspace;
        }

        const svgClassName = [className, 'remote-logo'].filter(Boolean).join(' ');
        return (
          <svg {...attribs} className={svgClassName} style={style} {...props}>
            <defs>
              <linearGradient id="tuwa-dark-logo-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7cf3ff" />
                <stop offset="1" stopColor="#22c3e6" />
              </linearGradient>
            </defs>
            {children}
          </svg>
        );
      }
    },
  });

  const elements = Array.isArray(parsed) ? parsed : [parsed];
  const svgElement = elements.find((el) => React.isValidElement(el) && el.type === 'svg');

  return svgElement ? svgElement : <svg className={className} style={style} {...props} />;
}
