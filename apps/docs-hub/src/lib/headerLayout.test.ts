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

/** The selector Tailwind writes for a class name: every character other than letters, digits, `_` and `-` escaped. */
const selectorOf = (className: string) => `.${className.replace(/[^\w-]/g, (char) => `\\${char}`)}`;

describe('the Nextra header of @tuwaio/docs-ui', () => {
  it.each([
    ['source', 'src/styles/general.css'],
    ['build', 'dist/index.css'],
  ])('is opaque in the theme background on phones in portrait and on touch screens up to 1024px (%s)', (_, file) => {
    const block = mediaBlockOf(read(file), '.nextra-navbar');
    expect(block?.query).toBe('(max-width: 767.98px), (pointer: coarse) and (max-width: 1023.98px)');
    expect(block?.body).toMatch(/background:\s*rgb\(var\(--nextra-bg/);
    expect(block?.body).not.toMatch(/background:\s*white/);
  });

  it('keeps the logo at its width, so it cannot paint over the next items', () => {
    const html = renderToStaticMarkup(createElement(SiteLogo, {}));
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image).toContain('tuwadocs:max-w-none');
      expect(image).toContain('width:126px');
    }
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

  it('blurs the page under it at every width and is nearly opaque on phones', () => {
    expect(headerClasses).toContain('backdrop-blur-xl');
    const phoneOpacity = (variant: string) =>
      Number(headerClasses.find((name) => name.startsWith(`${variant}bg-`))?.match(/\/(\d+)$/)?.[1]);
    expect(phoneOpacity('')).toBeGreaterThanOrEqual(90);
    expect(phoneOpacity('dark:')).toBeGreaterThanOrEqual(90);
  });

  it('stays nearly opaque until the inline links show, so phones in landscape do not see the page through it', () => {
    expect(headerClasses.some((name) => name.startsWith('sm:bg-') || name.startsWith('sm:dark:bg-'))).toBe(false);
    expect(headerClasses).toEqual(
      expect.arrayContaining([expect.stringMatching(/^lg:bg-/), expect.stringMatching(/^lg:dark:bg-/)]),
    );
  });

  it('puts the language before the theme, in the header and in the menu (owner 2026-10-28)', () => {
    const order = [...source.matchAll(/<(LocaleSwitcher|ThemeSwitcher)\b/g)].map(([, name]) => name);
    expect(order).toEqual(['LocaleSwitcher', 'ThemeSwitcher', 'LocaleSwitcher', 'ThemeSwitcher']);
  });

  it('switches between the inline links and the menu at one breakpoint, 1024px', () => {
    // Between 768 and 1024px the five links and both switchers need the whole row in Ukrainian; at `md` they touched
    const shown = [...source.matchAll(/"hidden (\w+):flex/g)].map(([, breakpoint]) => breakpoint);
    const hidden = [...source.matchAll(/[`"](\w+):hidden /g)].map(([, breakpoint]) => breakpoint);
    expect(shown).toEqual(['lg', 'lg']);
    expect(hidden).toEqual(['lg', 'lg', 'lg']);
    // The menu closes when the window reaches the breakpoint of Tailwind's `lg` (64rem)
    expect(source).toContain("window.matchMedia('(min-width: 64rem)')");
  });
});
