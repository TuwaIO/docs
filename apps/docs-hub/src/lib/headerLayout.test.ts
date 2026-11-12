import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SiteLogo } from '../../../../packages/docs-ui/src/components/Logo';
import { Navbar } from '../../../../packages/docs-ui/src/components/NavBar';

// The headers of the documentation sites never cover the page (owner request 2026-10-28: on phones the header
// overlapped the content). The layout itself is checked in the browser at 320-2560px; these tests keep the parts that
// make it work: a header of paper a little clear over a light blur, under which the page shows only as a haze, a logo
// that never shrinks under the next items, navbar links that show only their icons below 1024px, and the switches of
// the hub header in its menu on phones.

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

/**
 * The body of a top-level rule by its exact selector, nested blocks included: the build writes a fallback for
 * `color-mix()` inside the rule (`@supports (…) { … }`).
 */
function ruleBlockOf(css: string, selector: string): string | undefined {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const start = source.search(new RegExp(`(^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  if (start === -1) return undefined;
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let index = open; index < source.length; index++) {
    if (source[index] === '{') depth++;
    else if (source[index] === '}' && --depth === 0) return source.slice(open + 1, index);
  }
  return undefined;
}

/** The selector Tailwind writes for a class name: every character other than letters, digits, `_` and `-` escaped. */
const selectorOf = (className: string) => `.${className.replace(/[^\w-]/g, (char) => `\\${char}`)}`;

describe('the Nextra header of @tuwaio/docs-ui', () => {
  // The header stays over the page as it scrolls: the paper a little clear over a light blur of the page, with the
  // scanlines, at every width. The glass is on Nextra's own layer under the header, not on the header itself, whose
  // fixed menus a backdrop filter would pin to it
  it.each([
    ['source', 'src/styles/site.css'],
    ['build', 'dist/index.css'],
  ])('is paper a little clear over a light blur, with scanlines, at every width (%s)', (_, file) => {
    const css = read(file);
    const navbar = topLevelRuleOf(css, '.nextra-navbar');
    expect(navbar).toMatch(/backdrop-filter:\s*none/);
    expect(navbar).toMatch(/background:\s*transparent/);
    const glass = ruleBlockOf(css, '.nextra-navbar-blur');
    expect(glass).toMatch(/background-color:\s*color-mix\(in srgb,\s*var\(--tuwa-docs-paper\) 86%,\s*transparent\)/);
    expect(glass).toMatch(/(^|[;\s])backdrop-filter:\s*blur\(12px\)/);
    expect(glass).toMatch(/background-image:\s*var\(--tuwa-docs-scan\)/);
    // No width brings another look
    expect(mediaBlockOf(css, '.nextra-navbar {')).toBeUndefined();
  });

  // The logo of the docs is the logo of tuwa.io, at its size there (110px on phones, 126px from 640px): at 20px high it
  // was too small to read. The row of the navbar still fits a 320px phone, checked in the browser
  it('gives the logo the size of the logo of tuwa.io, and keeps it from shrinking', () => {
    const html = renderToStaticMarkup(createElement(SiteLogo, {}));
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image).toContain('tuwadocs:max-w-none');
      expect(image).toContain('tuwadocs:w-[110px] tuwadocs:sm:w-[126px] tuwadocs:h-auto');
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

  // Paper and ink: the header is the glass of the docs (the paper a little clear over a light blur) with its
  // scanlines and a line of 1px below, at every width; no other blur, shadow or translucent colour
  it('is the glass of the docs with scanlines and a 1px line, at every width', () => {
    expect(headerClasses).toEqual(
      expect.arrayContaining([
        'fixed',
        'h-[56px]',
        'tuwa-docs-glass',
        'tuwa-docs-scan',
        'border-b',
        'border-[var(--tuwa-border-primary)]',
      ]),
    );
    expect(headerClasses.filter((name) => /backdrop-|blur|shadow|\/\d+$|\/\[/.test(name))).toEqual([]);
  });

  // The language, then the theme (as on every TUWA site): in cells of the header from 1024px, and below it in the menu,
  // each on a row with its name, so a phone header keeps the logo at the size of tuwa.io and the menu button
  it('puts the language before the theme, in the header from 1024px and in the menu below it', () => {
    const order = (markup: string) =>
      [...markup.matchAll(/<(LocaleSwitcher|ThemeSwitcher)\b/g)].map(([, name]) => name);
    expect(order(headerMarkup)).toEqual(['LocaleSwitcher', 'ThemeSwitcher']);
    expect(order(drawerMarkup)).toEqual(['LocaleSwitcher', 'ThemeSwitcher']);
    const cells = [
      ...headerMarkup.matchAll(/<div className=\{`hidden lg:flex \$\{cellClassName\}`\}>\s*(?:\{[^}]*\}\s*)?<(\w+)/g),
    ].map(([, name]) => name);
    expect(cells).toEqual(['LocaleSwitcher', 'ThemeSwitcher']);
    expect(drawerMarkup).toContain('{t.nav.language}');
    expect(drawerMarkup).toContain('{t.nav.theme}');
  });

  it('switches between the inline links and the menu at one breakpoint, 1024px', () => {
    // Between 768 and 1024px the five links and both switchers need the whole row in Ukrainian; at `md` they touched
    const shown = [...source.matchAll(/hidden (\w+):flex/g)].map(([, breakpoint]) => breakpoint);
    const hidden = [...source.matchAll(/[`" ](\w+):hidden /g)].map(([, breakpoint]) => breakpoint);
    expect(shown).toEqual(['lg', 'lg', 'lg']);
    expect(new Set(hidden)).toEqual(new Set(['lg']));
    // The menu closes when the window reaches the breakpoint of Tailwind's `lg` (64rem)
    expect(source).toContain("window.matchMedia('(min-width: 64rem)')");
  });

  // The logo has a cell of its own from 1280px, as wide on every page of the hub
  it('gives the logo a cell of 320px from 1280px', () => {
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

describe('the size of the switches on narrow phones', () => {
  const siteCss = readFileSync(path.resolve(__dirname, '../../../../packages/docs-ui/src/styles/site.css'), 'utf8');
  const switcher = readFileSync(
    path.resolve(__dirname, '../../../../packages/docs-ui/src/components/LocaleSwitcher.tsx'),
    'utf8',
  );
  /** The rules inside every media query of the given condition. */
  const mediaRules = (condition: string) =>
    [...siteCss.matchAll(new RegExp(`@media \\(${condition}\\) \\{\\n([\\s\\S]*?)\\n\\}\\n`, 'g'))]
      .map((match) => match[1] ?? '')
      .join('\n');

  // Below 400px the language and the theme switch took a smaller size, so that the navbar of Nextra holds its row at
  // 320px. The rule reached the menu of the hub too, where each switch has a row of its own and room to spare: there
  // they keep the size they have on a wider phone
  it('makes them smaller in the navbar of Nextra only, never in a menu', () => {
    const narrow = mediaRules('max-width: 399\\.98px');
    const selectors = [...narrow.matchAll(/^\s*([.\w][^{}\n]*) \{$/gm)].map((match) => (match[1] ?? '').trim());
    expect(selectors.sort()).toEqual([
      '.nextra-navbar .tuwa-locale-switch',
      '.nextra-navbar .tuwa-locale-switch__knob',
      '.nextra-navbar .tuwa-theme-switch',
    ]);
    const narrowest = [...mediaRules('max-width: 360px').matchAll(/^\s*([.\w][^{}\n]*) \{$/gm)].map((match) =>
      (match[1] ?? '').trim(),
    );
    for (const selector of narrowest) expect(selector).toMatch(/^\.nextra-navbar /);
    expect(narrowest.length).toBeGreaterThan(0);
  });

  it('gives the language switch no width of its own for a narrow screen', () => {
    expect(switcher).not.toMatch(/max-\[\d+px\]/);
    expect(switcher).toContain(
      "'tuwa-locale-switch tuwadocs:h-10 tuwadocs:w-[5.25rem] tuwadocs:md:h-8 tuwadocs:md:w-[4.75rem]'",
    );
    expect(switcher).toContain('className="tuwa-locale-switch__chevron ');
  });

  it('keeps the switches of the hub out of the navbar of Nextra: in the menu on phones', () => {
    const header = readFileSync(path.resolve(__dirname, '../components/Header.tsx'), 'utf8');
    expect(header).not.toContain('nextra-navbar');
    expect(header).toMatch(/<LocaleSwitcher/);
    expect(header).toMatch(/<ThemeSwitcher/);
  });
});
