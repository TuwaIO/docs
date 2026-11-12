import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { SCALAR_PAPER_INK_CSS } from './scalarTheme';

// The API reference of Quasar (Scalar) in the paper and ink of the hub: Scalar draws itself from its own custom
// properties, and the theme hands each of them a token of the hub

const hub = path.resolve(__dirname, '..');
const docsUi = path.resolve(hub, '../../../packages/docs-ui');
const reference = readFileSync(path.join(hub, 'components/QuasarApiReference.tsx'), 'utf8');
const css = SCALAR_PAPER_INK_CSS.replace(/\/\*[\s\S]*?\*\//g, '');
const value = (property: string) => css.match(new RegExp(`\\n\\s*${property}:\\s*([^;]+);`))?.[1];

describe('the API reference of Quasar', () => {
  it('takes the theme of the hub, and still asks fonts.scalar.com for nothing', () => {
    expect(reference).toContain('customCss: SCALAR_PAPER_INK_CSS,');
    expect(reference).toContain('withDefaultFonts: false,');
    expect(value('--scalar-font')).toBe('var(--tuwa-font-sans)');
    expect(value('--scalar-font-code')).toBe('var(--tuwa-font-mono)');
  });

  it('is paper, ink and lines of the hub', () => {
    expect(value('--scalar-background-1')).toBe('var(--tuwa-docs-paper)');
    expect(value('--scalar-background-2')).toBe('var(--tuwa-docs-raised)');
    expect(value('--scalar-color-1')).toBe('var(--tuwa-text-primary)');
    expect(value('--scalar-color-accent')).toBe('var(--tuwa-text-accent)');
    expect(value('--scalar-border-color')).toBe('var(--tuwa-border-primary)');
    expect(value('--scalar-button-1')).toBe('var(--tuwa-button-primary-bg)');
    expect(value('--scalar-button-1-color')).toBe('var(--tuwa-text-on-accent)');
  });

  // Scalar draws the example of a request as a dark card in the light theme, a part with its own `dark-mode`: every
  // such part takes the same tokens, or a black card stands on the paper
  it('themes the parts that carry their own light or dark mode too', () => {
    expect(css).toMatch(/\.scalar-app,\s*\.scalar-app \.light-mode,\s*\.scalar-app \.dark-mode \{/);
  });

  it('has a colour of its own nowhere: every colour is a token of the hub', () => {
    expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(|display-p3/i);
    const colours = [
      ...css.matchAll(
        /\n\s*(--scalar-(?:color|background|button|link|focus|tooltip|scrollbar|sidebar)[\w-]*):\s*([^;]+);/g,
      ),
    ];
    expect(colours.length).toBeGreaterThan(30);
    for (const [, property, colour] of colours)
      expect(colour, property).toMatch(
        /^(var\(--tuwa-[\w-]+\)|color-mix\(in srgb, var\(--tuwa-[\w-]+\) [\d.]+%, transparent\))$/,
      );
  });

  it('uses only tokens that Nova, docs-ui or the hub define', () => {
    const nova = readFileSync(
      createRequire(path.join(docsUi, 'package.json')).resolve('@tuwaio/nova-core/dist/index.css'),
      'utf8',
    );
    const defined = nova + readFileSync(path.join(docsUi, 'src/styles/site.css'), 'utf8');
    const tokens = new Set([...css.matchAll(/var\((--tuwa-[\w-]+)\)/g)].map((match) => match[1] as string));
    expect(tokens.size).toBeGreaterThan(10);
    for (const token of tokens) expect(defined, token).toContain(`${token}:`);
  });

  // The header of the site is fixed over the page: the sticky sidebar of Scalar stood under it, its search out of sight
  it('keeps the sidebar of Scalar under the header of the site', () => {
    expect(value('--scalar-custom-header-height')).toBe('var(--nextra-navbar-height, 64px)');
    const scalar = readFileSync(
      createRequire(path.join(hub, '../package.json')).resolve('@scalar/api-reference-react/style.css'),
      'utf8',
    );
    // Scalar still places its sticky parts by this property
    expect(scalar).toMatch(/--refs-header-height:\s*calc\(\s*var\(--scalar-custom-header-height, 0px\)/);
  });

  // The open item is a block of ink: a method in ink (GET) was not seen on it, and the green of POST was faint
  it('writes the method of the open item of the sidebar in paper', () => {
    const open = css.slice(css.indexOf('.scalar-app .t-doc__sidebar a.bg-sidebar-b-active {'));
    const rule = open.slice(0, open.indexOf('}'));
    for (const colour of ['blue', 'green', 'red', 'orange', 'yellow', 'purple'])
      expect(rule).toContain(`--scalar-color-${colour}: var(--tuwa-docs-paper);`);
  });

  it('has square corners and no shadow', () => {
    const radii = [...css.matchAll(/\n\s*(--scalar-radius[\w-]*):\s*([^;]+);/g)];
    expect(radii.length).toBeGreaterThanOrEqual(8);
    for (const [, property, radius] of radii) expect(radius, property).toBe('0');
    expect(value('--scalar-shadow-1')).toBe('none');
    expect(value('--scalar-shadow-2')).toBe('none');
    expect(css).toMatch(/\.scalar-app \*,[^{]*\{\s*border-radius: 0 !important;\s*\}/);
    expect(css).not.toMatch(/gradient\(|box-shadow|blur\(/);
  });

  // The docs theme paints every link of an article in the accent with !important, and sizes its headings as the
  // headings of a page: the reference is inside the article of its page
  it('hands the sidebar its ink back, and the client the headings of a form', () => {
    expect(css).toMatch(/\.scalar-app \.t-doc__sidebar a \{\s*color: var\(--scalar-sidebar-color-2\) !important;/);
    expect(css).toMatch(
      /\.scalar-app \.t-doc__sidebar a\.bg-sidebar-b-active \{\s*background-color: var\(--tuwa-text-primary\) !important;\s*color: var\(--tuwa-docs-paper\) !important;/,
    );
    // Were Scalar to rename the class of the open item, its text would still be ink on a breath of ink, not paper on paper
    expect(value('--scalar-sidebar-color-active')).toBe('var(--tuwa-text-primary)');
    expect(value('--scalar-sidebar-item-active-background')).toMatch(/^color-mix\(/);
    expect(css).toMatch(
      /\.scalar-app \.scalar-client :is\(h1, h2, h3, h4, h5, h6\) \{\s*font-size: inherit !important;/,
    );
  });
});
