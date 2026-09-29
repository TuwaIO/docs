import parse, { type DOMNode, domToReact, Element } from 'html-react-parser';
import React from 'react';

const LOGO_URL = 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg';

/**
 * Props of {@link RemoteLogo}: the SVG attributes are applied to the root `svg` element.
 */
export interface RemoteLogoProps extends React.SVGProps<SVGSVGElement> {
  /** URL of the SVG (default: the TUWA logo on jsDelivr, `cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg`) */
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
