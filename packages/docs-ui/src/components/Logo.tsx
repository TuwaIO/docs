import parse, { type DOMNode, domToReact, Element } from 'html-react-parser';
import React from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/logo_v1.svg';

export interface RemoteLogoProps extends React.SVGProps<SVGSVGElement> {
  url?: string;
}

/**
 * Async Server Component that fetches a remote SVG and renders it
 * as native React elements using html-react-parser.
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

  // Strip XML declarations and doctype
  const cleanSvg = rawSvg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .trim();

  // Parse SVG string into React elements, overriding root <svg> attributes
  const parsed = parse(cleanSvg, {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'svg') {
        // Merge fetched SVG root attributes with component props
        const children = domToReact(domNode.children as DOMNode[]);
        return (
          <svg {...domNode.attribs} className={className} style={style} {...props}>
            {children}
          </svg>
        );
      }
    },
  });

  return <>{parsed}</>;
}
