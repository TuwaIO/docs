import React from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/logo_v1.svg';

export interface RemoteLogoProps extends React.SVGProps<SVGSVGElement> {
  url?: string;
}

// Convert kebab-case attributes to camelCase for React compliance
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}

// Parse inline style strings into a React-compatible object
function parseInlineStyle(styleStr: string): Record<string, string> {
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

interface SvgNode {
  tag: string;
  attrs: Record<string, string>;
  children: (SvgNode | string)[];
}

// Stack-based SVG parser that handles arbitrary nesting safely without regex backreference limitations
function parseSvg(html: string): SvgNode[] {
  const rootChildren: (SvgNode | string)[] = [];
  const stack: SvgNode[] = [];

  // Matches: comments, closing tags, opening/self-closing tags, and text content
  const tokenRegex = /(<!--[\s\S]*?-->)|(<\s*\/\s*([a-zA-Z0-9:-]+)\s*>)|(<\s*([a-zA-Z0-9:-]+)([^>]*?)\/?>)|([^<]+)/g;
  const attrRegex = /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/g;

  let match;
  while ((match = tokenRegex.exec(html)) !== null) {
    if (match[1]) {
      // Comment, ignore
      continue;
    }
    if (match[2]) {
      // Closing tag
      const tagName = match[3].toLowerCase();
      const tempStack: SvgNode[] = [];
      while (stack.length > 0 && stack[stack.length - 1].tag !== tagName) {
        tempStack.push(stack.pop()!);
      }
      if (stack.length > 0) {
        const closedNode = stack.pop()!;
        closedNode.children = [...tempStack.reverse(), ...closedNode.children];

        if (stack.length > 0) {
          stack[stack.length - 1].children.push(closedNode);
        } else {
          rootChildren.push(closedNode);
        }
      } else {
        // Unmatched closing tag, restore stack
        while (tempStack.length > 0) {
          stack.push(tempStack.pop()!);
        }
      }
      continue;
    }
    if (match[4]) {
      // Opening or self-closing tag
      const tagName = match[5].toLowerCase();
      const rawAttrs = match[6];
      const isSelfClosing = match[4].endsWith('/>') || match[4].endsWith('/ >');

      const attrs: Record<string, string> = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        attrs[attrMatch[1]] = attrMatch[2] || attrMatch[3] || '';
      }

      const node: SvgNode = {
        tag: tagName,
        attrs,
        children: [],
      };

      if (isSelfClosing) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        } else {
          rootChildren.push(node);
        }
      } else {
        stack.push(node);
      }
      continue;
    }
    if (match[7]) {
      // Text content
      const text = match[7].trim();
      if (text) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(text);
        } else {
          rootChildren.push(text);
        }
      }
    }
  }

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      rootChildren.push(node);
    }
  }

  return rootChildren.filter((c): c is SvgNode => typeof c !== 'string');
}

// Convert parsed SVG node tree to safe React elements
function svgNodeToReact(node: SvgNode, key: string): React.ReactNode {
  const tagName = node.tag;
  if (tagName === 'script') return null; // Security guard

  const props: Record<string, unknown> = { key };
  for (const [attrName, attrValue] of Object.entries(node.attrs)) {
    if (attrName === 'class') {
      props.className = attrValue;
    } else if (attrName === 'style') {
      props.style = parseInlineStyle(attrValue);
    } else if (attrName.includes(':')) {
      const [ns, name] = attrName.split(':');
      props[`${ns}${name.charAt(0).toUpperCase() + name.slice(1)}`] = attrValue;
    } else {
      props[toCamelCase(attrName)] = attrValue;
    }
  }

  const children = node.children
    .map((child, index) => {
      if (typeof child === 'string') {
        return child;
      }
      return svgNodeToReact(child, `${key}-${index}`);
    })
    .filter(Boolean);

  return React.createElement(tagName, props, ...children);
}

export async function RemoteLogo({ url = LOGO_URL, className, style, ...props }: RemoteLogoProps) {
  let children: React.ReactNode = null;
  let rootProps: React.SVGProps<SVGSVGElement> = {};
  let hasError = false;

  try {
    // Next.js patches fetch globally to handle server-side infrastructure caching
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache response for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SVG from remote source: ${response.status}`);
    }

    const rawText = await response.text();

    // Clean comments and XML declarations safely
    const cleanSvg = rawText
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\?xml[\s\S]*?\?>/g, '')
      .trim();

    // Extract root SVG attributes and inner content
    const svgRootMatch = cleanSvg.match(/<svg([^>]*?)>([\s\S]*?)<\/svg>/i);
    if (!svgRootMatch) {
      throw new Error('Invalid or corrupted SVG layout payload');
    }

    const rootAttrsRaw = svgRootMatch[1];
    const innerContent = svgRootMatch[2];

    // Parse root attributes to merge them with incoming component props
    const parsedAttrs: Record<string, unknown> = {};
    const attrRegex = /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(rootAttrsRaw)) !== null) {
      const name = attrMatch[1];
      const value = attrMatch[2] || attrMatch[3] || '';
      if (name !== 'class' && name !== 'style') {
        parsedAttrs[toCamelCase(name)] = value;
      }
    }
    rootProps = parsedAttrs as React.SVGProps<SVGSVGElement>;

    // Process nested pathing into typed React Nodes using stack-based parser
    const parsedChildren = parseSvg(innerContent);
    children = parsedChildren.map((child, index) => svgNodeToReact(child, `logo-node-${index}`));
  } catch (error) {
    console.error('Core/UI Runtime Error fetching remote SVG:', error);
    hasError = true;
  }

  if (hasError) {
    return <svg className={className} style={style} {...props} />;
  }

  return (
    <svg {...rootProps} className={className} style={style} {...props}>
      {children}
    </svg>
  );
}
