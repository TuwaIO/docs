'use client';

import React, { useEffect, useState } from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_v1.svg';

// Simple global cache to avoid refetching the SVG on every mount
let fetchPromise: Promise<string> | null = null;

// Helper to convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Helper to sanitize attribute names for React SVG elements
function cleanAttributeName(name: string): string {
  if (name === 'class') return 'className';
  if (name.includes(':')) {
    const parts = name.split(':');
    return parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return toCamelCase(name);
}

// Helper to parse CSS inline style strings to React style objects
function parseStyleString(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  styleStr.split(';').forEach((style) => {
    const trimmed = style.trim();
    if (!trimmed) return;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) return;
    const rule = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (rule && value) {
      styles[toCamelCase(rule)] = value;
    }
  });
  return styles;
}

// Recursive function to turn DOM nodes into React elements without using dangerouslySetInnerHTML
function domToReact(node: Node, key?: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tagName = el.tagName.toLowerCase();

    // Map attributes
    const attribs: Record<string, unknown> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      const cleanName = cleanAttributeName(attr.name);

      if (cleanName === 'style') {
        attribs.style = parseStyleString(attr.value);
      } else {
        attribs[cleanName] = attr.value;
      }
    }
    attribs.key = key;

    // Recursively convert children
    const children: React.ReactNode[] = [];
    for (let i = 0; i < el.childNodes.length; i++) {
      const child = domToReact(el.childNodes[i], `${key || 'node'}-${i}`);
      if (child !== null) {
        children.push(child);
      }
    }

    return React.createElement(tagName, attribs, ...children);
  }

  return null;
}

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

export function Logo({ width = 120, height = 40, className, style, ...props }: LogoProps) {
  const [svgPaths, setSvgPaths] = useState<React.ReactNode[] | null>(null);
  const [viewBox, setViewBox] = useState<string>('0 0 620 238'); // Safe default matching tuwa_v1.svg dimensions

  useEffect(() => {
    if (!fetchPromise) {
      fetchPromise = fetch(LOGO_URL)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch SVG');
          return res.text();
        })
        .catch((err) => {
          console.error('Error fetching logo SVG:', err);
          return '';
        });
    }

    let isMounted = true;
    fetchPromise.then((text) => {
      if (!isMounted || !text) return;

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (svgElement) {
          const vb = svgElement.getAttribute('viewBox') || '0 0 620 238';
          setViewBox(vb);

          const reactChildren: React.ReactNode[] = [];
          for (let i = 0; i < svgElement.childNodes.length; i++) {
            const reactChild = domToReact(svgElement.childNodes[i], `logo-child-${i}`);
            if (reactChild !== null) {
              reactChildren.push(reactChild);
            }
          }
          setSvgPaths(reactChildren);
        }
      } catch (err) {
        console.error('Error parsing logo SVG:', err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const mergedStyle: React.CSSProperties = {
    height: style?.height || (height ? (typeof height === 'number' ? `${height}px` : height) : 'auto'),
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    ...style,
  };

  return (
    <svg viewBox={viewBox} className={className} style={mergedStyle} {...props}>
      {svgPaths}
    </svg>
  );
}
