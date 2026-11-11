import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SiteLogo } from '../../../../packages/docs-ui/src/components/Logo';
import { Navbar } from '../../../../packages/docs-ui/src/components/NavBar';

// The headers of the documentation sites never cover the page (owner request 2026-10-28: on phones the header
// overlapped the content). The layout itself is checked in the browser at 320-2560px; these tests keep the parts that
// make it work: an opaque Nextra header below 768px, a logo that never shrinks under the next items, navbar links that
// show only their icons below 1024px, and the hub header that blurs and hides the page under it on phones.

vi.mock('nextra-theme-docs', () => ({
  // The Nextra navbar needs the Nextra layout; this stand-in renders its logo link, class name and children
  Navbar: ({ logo, className, children }: { logo: ReactNode; className?: string; children?: ReactNode }) =>
    createElement('nav', { className }, createElement('a', { href: '/' }, logo), children),
}));

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const read = (file: string) => readFileSync(path.join(docsUi, file), 'utf8');

/** The `@media` block of a stylesheet that contains `selector`, with its query and body. */
function mediaBlockOf(css: string, selector: string): { query: string; body: string } | undefined {
  for (const match of css.matchAll(/@media\s*([^{]+)\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g)) {
    if (match[2].includes(selector)) return { query: match[1].trim(), body: match[2] };
  }
  return undefined;
}

/** The body of a rule of the stylesheet outside any `@media` block, by its exact selector. */
function topLevelRuleOf(css: string, selector: string): string | undefined {
  const outside = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  for (const match of outside.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    if ((match[1] as string).trim() === selector) return match[2] as string;
  return undefined;
}

/** The selector Tailwind writes for a class name: every character other than letters, digits, `_` and `-` escaped. */
const selectorOf = (className: string) => `.${className.replace(/[^\w-]/g, (char) => `\\${char}`)}`;

describe('the Nextra header of @tuwaio/docs-ui', () => {
  it.each([
    ['source', 'src/styles/site.css'],
    ['build', 'dist/index.css'],
  ])('is opaque paper with scanlines and no glass at every width (%s)', (_, file) => {
    const css = read(file);
    const navbar = topLevelRuleOf(css, '.nextra-navbar');
    expect(navbar).toMatch(/backdrop-filter:\s*none/);
    expect(navbar).toMatch(/background:\s*rgb\(var\(--nextra-bg/);
    const glass = topLevelRuleOf(css, '.nextra-navbar-blur');
    expect(glass).toMatch(/backdrop-filter:\s*none/);
    expect(glass).toMatch(/background-color:\s*rgb\(var\(--nextra-bg/);
    expect(glass).toMatch(/background-image:\s*var\(--tuwa-docs-scan\)/);
    // No width brings the glass back
    expect(mediaBlockOf(css, '.nextra-navbar {')).toBeUndefined();
  });

  // The logo and both switches fit one row of the navbar on a 320px phone: the logo is sized by its height there
  it('fits the logo to the navbar by its height, and keeps it from shrinking', () => {
    const html = renderToStaticMarkup(createElement(SiteLogo, {}));
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image).toContain('tuwadocs:max-w-none');
      expect(image).toContain('tuwadocs:h-5 tuwadocs:sm:h-[22px] tuwadocs:w-auto');
      expect(image).not.toContain('width:126px');
    }
  });

  it('keeps a width it is given, for the headers that size the logo themselves', () => {
    const images = renderToStaticMarkup(createElement(SiteLogo, { width: 126 })).match(/<img [^>]*>/g) ?? [];
    expect(images).toHaveLength(2);
    for (const image of images) expect(image).toContain('width:126px');
  });

  it('does not let the logo link shrink, and shows the link titles from 1024px with the title as their name', () => {
    const html = renderToStaticMarkup(
      createElement(Navbar, {
        links: [{ title: 'Storybook', href: 'https://stories.tuwa.io', image: createElement('svg') }],
        children: createElement('button', { type: 'button' }, 'EN'),
      }),
    );
    expect(html).toContain('<nav class="tuwadocs:[&amp;&gt;:first-child]:shrink-0">');
    expect(html).toMatch(
      /<a [^>]*title="Storybook"[^>]*><svg><\/svg><span class="tuwadocs:sr-only tuwadocs:lg:not-sr-only">Storybook<\/span><\/a>/,
    );
    expect(html).toMatch(/<div class="[^"]*tuwadocs:shrink-0[^"]*">.*<button type="button">EN<\/button><\/div>/);
  });

  it('has every class of the navbar and the logo in the built stylesheet', () => {
    const css = read('dist/index.css');
    const classes = new Set(
      ['src/components/NavBar.tsx', 'src/components/Logo.tsx'].flatMap((file) =>
        [...read(file).matchAll(/tuwadocs:[^\s'"`]+/g)].map(([className]) => className),
      ),
    );
    expect(classes.size).toBeGreaterThan(10);
    expect([...classes].filter((className) => !css.includes(selectorOf(className)))).toEqual([]);
  });
});

describe('the header of the hub pages', () => {
  const source = readFileSync(path.resolve(__dirname, '../components/Header.tsx'), 'utf8');
  const headerClasses = source.match(/<header className="([^"]+)"/)?.[1].split(/\s+/) ?? [];
  const headerMarkup = source.slice(source.indexOf('<header'), source.indexOf('</header>'));
  const drawerMarkup = source.slice(source.indexOf('id="mobile-menu"'));

  // Paper and ink: the header is the paper of the page with its scanlines and a line of 1px below, at every width, so
  // nothing shows through it on a phone or a desktop; no glass, no translucent colour
  it('is opaque paper with scanlines and a 1px line, with no glass at any width', () => {
    expect(headerClasses).toEqual(
      expect.arrayContaining([
        'fixed',
        'h-[56px]',
        'bg-[var(--tuwa-docs-paper)]',
        'tuwa-docs-scan',
        'border-b',
        'border-[var(--tuwa-border-primary)]',
      ]),
    );
    expect(headerClasses.filter((name) => /backdrop-|blur|shadow|\/\d+$|\/\[/.test(name))).toEqual([]);
  });

  // The language, then the theme (as on every TUWA site), each in its own cell of the header at every width; the menu
  // of phones holds only the links
  it('puts the language before the theme, once, in the header, and keeps both out of the menu', () => {
    const order = [...source.matchAll(/<(LocaleSwitcher|ThemeSwitcher)\b/g)].map(([, name]) => name);
    expect(order).toEqual(['LocaleSwitcher', 'ThemeSwitcher']);
    expect(headerMarkup).toContain('<LocaleSwitcher');
    expect(headerMarkup).toContain('<ThemeSwitcher');
    expect(drawerMarkup).not.toMatch(/<(LocaleSwitcher|ThemeSwitcher)\b/);
  });

  it('switches between the inline links and the menu at one breakpoint, 1024px', () => {
    // Between 768 and 1024px the five links and both switchers need the whole row in Ukrainian; at `md` they touched
    const shown = [...source.matchAll(/"hidden (\w+):flex/g)].map(([, breakpoint]) => breakpoint);
    const hidden = [...source.matchAll(/[`"](\w+):hidden /g)].map(([, breakpoint]) => breakpoint);
    expect(shown).toEqual(['lg']);
    expect(hidden).toEqual(['lg', 'lg', 'lg']);
    // The menu closes when the window reaches the breakpoint of Tailwind's `lg` (64rem)
    expect(source).toContain("window.matchMedia('(min-width: 64rem)')");
  });

  // The logo cell is as wide as the flight plan of the main page from 1280px, so the two line up
  it('gives the logo a cell of the width of the flight plan from 1280px', () => {
    expect(headerMarkup).toMatch(/className="[^"]*\bxl:w-\[320px\][^"]*"/);
  });
});

describe('the frame of the hub pages', () => {
  const shell = readFileSync(path.resolve(__dirname, '../components/HubShell.tsx'), 'utf8');

  // The first stop of the keyboard is a link past the header to the content
  it('opens with a link to the content, before the header', () => {
    const skip = shell.indexOf('href="#content"');
    expect(skip).toBeGreaterThan(-1);
    expect(skip).toBeLessThan(shell.indexOf('<Header'));
    expect(shell).toMatch(/<main id="content"/);
  });
});
