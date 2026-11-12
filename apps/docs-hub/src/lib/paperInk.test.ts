import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// Paper and ink, the look of the TUWA documentation: square corners, lines of 1px, no gradients, no soft shadows and no
// blur, on the paper of Nova and none of the cosmic colours before it. The parts not yet redrawn are listed below by name;
// each leaves the list when it is redrawn, until the list is empty. Two exceptions are not parts but rules: the scanlines,
// which are Nova's own (a repeating gradient of 1px lines), and the quiet cyan glow of the dark theme (the glow of the dark
// logo), allowed only under the dark theme.

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const siteCssFile = path.join(docsUi, 'src/styles/site.css');
const globalsFile = path.resolve(__dirname, '../app/globals.css');
const read = (file: string) => readFileSync(file, 'utf8');
const novaCss = read(createRequire(path.join(docsUi, 'package.json')).resolve('@tuwaio/nova-core/dist/index.css'));

/**
 * The parts of docs-ui not yet redrawn in paper and ink: their rules of site.css and their components. None is left:
 * the whole of docs-ui is checked.
 */
const notYetRedrawn: { part: string; selector: RegExp; files: string[] }[] = [];

/**
 * The few drawn details of the redrawn switches, the same as in the Nova Storybook, that the rules below would flag: each
 * by its exact selector and property, with the reason. Nothing else of a switch may break the rules.
 */
const drawnDetails: { selector: RegExp; property: RegExp; why: string }[] = [
  {
    selector: /^\.tuwa-(theme-switch__glow--(top|bottom)|locale-switch__glow)::before$/,
    property: /^mask-image$/,
    why: 'the line along one edge of a knob fades out on its sides: a mask, no colour',
  },
  {
    selector: /^\.tuwa-theme-switch__pixels::before$/,
    property: /^(background|border-radius)$/,
    why: 'the warm halo behind the disc of the sun',
  },
  {
    selector: /^\.tuwa-theme-switch__pixel--(tl|tr|bl|br)$/,
    property: /radius$/,
    why: 'the rounded corners of the disc of the sun',
  },
  {
    selector: /^(\.dark )?\.tuwa-locale-flag$/,
    property: /^box-shadow$/,
    why: 'a hair edge of 0.5px that keeps a flag in shape on paper, not a shadow',
  },
  {
    selector: /^\.(tuwa-docs-glass|nextra-navbar-blur)$/,
    property: /^(-webkit-)?backdrop-filter$/,
    why: 'the glass of what stays over the page as it scrolls (the headers, the bars of sections, the menu): a light blur under paper a little clear',
  },
];
const isDrawnDetail = (selector: string, property: string) =>
  drawnDetails.some((detail) => detail.selector.test(selector) && detail.property.test(property));

const squeeze = (text: string) => text.replace(/\s+/g, ' ').trim();
const withoutCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
// Line comments start a line or follow a space, unlike the `//` of a URL in a string
const withoutJsComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

/** Every rule without nested rules, with its selector and body. A statement before it ends with a semicolon. */
function rulesOf(css: string) {
  return [...withoutCssComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: squeeze((match[1] as string).split(';').at(-1) as string),
    body: match[2] as string,
  }));
}

/** The declarations of a rule body; `@apply` lists its classes as one declaration. */
function declarationsOf(body: string) {
  return [...body.matchAll(/(@apply|--[\w-]+|-?[a-z][a-z-]*)\s*:?\s*([^;]+);?/g)]
    .map((match) => ({ property: match[1] as string, value: squeeze(match[2] as string) }))
    .filter(({ value }) => value.length > 0);
}

const isRedrawn = (selector: string) => !notYetRedrawn.some(({ selector: part }) => part.test(selector));
const important = / ?!important$/;

/** Every selector of the list is under the dark theme. */
const darkOnly = (selector: string) =>
  selector.split(',').every((part) => /(^|\s|:where\()(html)?\.dark(\s|\)|$)/.test(part.trim()));

/** The quiet cyan glow of the dark theme: at most 4px for a drop shadow (6px for text), at most 35% of TUWA's cyan. */
function isQuietGlow(value: string, blurLimit: number) {
  const glows = [...value.matchAll(/0 0 ([\d.]+)px rgba\(\s*34,\s*195,\s*230,\s*([\d.]+)\s*\)/g)];
  // Every colour of the value is one of these glows
  const colours =
    value.match(/rgba?\(|hsla?\(|#[\da-f]{3,8}\b|color-mix\(|var\(|\b(?:transparent|currentcolor)\b/gi) ?? [];
  return (
    glows.length > 0 &&
    glows.length === colours.length &&
    glows.every((glow) => Number(glow[1]) <= blurLimit && Number(glow[2]) <= 0.35)
  );
}

/** The scanlines of Nova's `.tuwa-scanlines`: the one gradient paper and ink has. */
const novaScanlines = squeeze(
  rulesOf(novaCss)
    .find((rule) => rule.selector === '.tuwa-scanlines')
    ?.body.match(/background-image:\s*([^;]+);/)?.[1] ?? '',
);

// `inherit` follows the part it sits on, which takes a token itself
const radiusTokens = /^(0|0px|inherit|var\(--tuwa-rounded-(corners|full)\))$/;

/** What breaks paper and ink in a declaration of site.css, or `undefined`. */
function cssViolation(selector: string, property: string, value: string): string | undefined {
  const bare = value.replace(important, '');
  if (/gradient\(/.test(value)) {
    // The scanlines: Nova's rule, with a fallback for a Nova that has no --tuwa-scanline
    if (
      property === '--tuwa-docs-scan' &&
      bare.replace('var(--tuwa-scanline, transparent)', 'var(--tuwa-scanline)') === novaScanlines
    )
      return undefined;
    return 'a gradient';
  }
  if (property === 'box-shadow' && bare !== 'none') return 'a shadow';
  if (/backdrop-filter$/.test(property) && bare !== 'none') return 'a blur';
  if (property === 'filter' && /blur\(/.test(value)) return 'a blur';
  if (property === 'filter' && /drop-shadow\(/.test(value) && !(darkOnly(selector) && isQuietGlow(bare, 4)))
    return 'a shadow that is not the quiet glow of the dark theme';
  if (property === 'text-shadow' && bare !== 'none' && !(darkOnly(selector) && isQuietGlow(bare, 6)))
    return 'a text shadow that is not the quiet glow of the dark theme';
  if ((/radius$/.test(property) || /^--x-radius-/.test(property)) && !radiusTokens.test(bare))
    return 'a radius other than 0 or a radius token';
  if (property === '@apply') {
    const classes = bare.split(' ').map((name) => name.replace(/^tuwadocs:/, ''));
    return classes.map(classViolation).find(Boolean);
  }
  return undefined;
}

/** What breaks paper and ink in a Tailwind class (variants and prefix included), or `undefined`. */
function classViolation(name: string): string | undefined {
  const utility = name.replace(/^(?:[\w-]+:|\[[^\]]*\]:)*/, '').replace(/^!/, '');
  if (/^(bg-(gradient|linear|radial|conic)|from-|via-|to-)/.test(utility)) return `${name}: a gradient`;
  if (/^(shadow|drop-shadow|text-shadow)(?!-none$)/.test(utility)) return `${name}: a shadow`;
  if (/^(backdrop-|blur)(?!.*-none$)/.test(utility)) return `${name}: a blur`;
  if (
    /^rounded/.test(utility) &&
    !/^rounded(-[trblse]{1,2})?-(none|\[var\(--tuwa-rounded-(corners|full)\)\])$/.test(utility)
  )
    return `${name}: a radius other than 0 or a radius token`;
  return undefined;
}

/** The components of docs-ui, by file name. */
function componentsOf(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return componentsOf(file);
    return /\.tsx$/.test(entry) && !/\.test\.tsx$/.test(entry) ? [file] : [];
  });
}

/** The opening tag around a position of a component source. */
function tagAround(source: string, index: number) {
  const start = source.lastIndexOf('<', index);
  const end = source.indexOf('>', index);
  return source.slice(start, end === -1 ? undefined : end);
}

/** What breaks paper and ink in a component of docs-ui: its Tailwind classes and inline styles. */
function componentViolations(file: string) {
  const source = withoutJsComments(read(file));
  const found: string[] = [];
  for (const [name] of source.matchAll(/tuwadocs:[^\s'"`]+/g)) {
    const violation = classViolation(name);
    if (violation) found.push(violation);
  }
  if (/(linear|radial|conic)-gradient\(/.test(source)) found.push('a gradient in a style');
  for (const match of source.matchAll(/\b(boxShadow|backdropFilter|WebkitBackdropFilter)\s*:\s*(['"`])([^'"`]*)\2/g))
    if (match[3] !== 'none') found.push(`${match[1]}: ${match[3]}`);
  for (const match of source.matchAll(/\bborderRadius\s*:\s*(['"`]?)([^,'"`}]*)\1/g))
    if (!radiusTokens.test(match[2]!.trim())) found.push(`borderRadius: ${match[2]}`);
  for (const match of source.matchAll(/\b(filter|textShadow)\s*:\s*(['"`])([^'"`]*)\2/g)) {
    const property = match[1] as string;
    const value = match[3] as string;
    if (property === 'filter' && !/drop-shadow\(|blur\(/.test(value)) continue;
    // The glow may only be on what shows in the dark theme alone: hidden, and shown by a `dark:` variant
    const tag = tagAround(source, match.index ?? 0);
    const shownInDarkOnly =
      /tuwadocs:hidden\b/.test(tag) && /tuwadocs:dark:(block|inline|flex|grid|inline-block)\b/.test(tag);
    if (!(shownInDarkOnly && isQuietGlow(value, property === 'filter' ? 4 : 6))) found.push(`${property}: ${value}`);
  }
  return found;
}

describe('paper and ink in @tuwaio/docs-ui', () => {
  it('has no gradients, shadows, blur or rounded corners in the redrawn rules of site.css', () => {
    const violations = rulesOf(read(siteCssFile))
      .filter((rule) => isRedrawn(rule.selector))
      .flatMap((rule) =>
        declarationsOf(rule.body).flatMap(({ property, value }) => {
          if (isDrawnDetail(rule.selector, property)) return [];
          const violation = cssViolation(rule.selector, property, value);
          return violation ? [`${rule.selector} { ${property}: ${value} } — ${violation}`] : [];
        }),
      );
    expect(violations).toEqual([]);
  });

  it('has no gradients, shadows, blur or rounded corners in the redrawn components', () => {
    const files = componentsOf(path.join(docsUi, 'src'));
    expect(files.length).toBeGreaterThan(5);
    const violations = files
      .filter((file) => !notYetRedrawn.some((part) => part.files.includes(path.basename(file))))
      .flatMap((file) => componentViolations(file).map((violation) => `${path.basename(file)}: ${violation}`));
    expect(violations).toEqual([]);
  });

  // The guard itself: it would catch what it is meant to catch
  it.each([
    ['.a', 'box-shadow', '0 1px 2px rgb(0 0 0 / 0.08)'],
    ['.a', 'background', 'linear-gradient(135deg, #0052ff 0%, #0284c7 100%)'],
    ['.a', 'mask-image', 'linear-gradient(to top, #000 0%, transparent 46%)'],
    ['.a', 'backdrop-filter', 'blur(12px)'],
    ['.a', 'border-radius', '0.5rem'],
    ['.a', '--x-radius-md', '0.375rem'],
    ['.a', 'filter', 'drop-shadow(0 0 4px rgba(34, 195, 230, 0.32))'],
    ['.dark .a', 'filter', 'drop-shadow(0 0 10px rgba(34, 195, 230, 0.6))'],
    ['.dark .a', 'text-shadow', '0 0 6px rgba(56, 189, 248, 0.35)'],
    ['.a', '@apply', 'tuwadocs:shadow-xl tuwadocs:rounded-lg'],
  ])('flags %s { %s: %s }', (selector, property, value) => {
    expect(cssViolation(selector, property, value)).toBeDefined();
  });

  it.each([
    ['.dark .a', 'filter', 'drop-shadow(0 0 4px rgba(34, 195, 230, 0.32))'],
    ['html.dark .a', 'text-shadow', '0 0 6px rgba(34, 195, 230, 0.35)'],
    ['.a', 'border-radius', 'var(--tuwa-rounded-full)'],
    ['.a', 'box-shadow', 'none !important'],
    ['.a', 'backdrop-filter', 'none'],
  ])('allows %s { %s: %s }', (selector, property, value) => {
    expect(cssViolation(selector, property, value)).toBeUndefined();
  });

  // Motions play once: a page of documentation is read, and nothing on it moves for ever. The one exception is the
  // icon of a project while the reader points at it (`.tuwa-pixel-art--live`): it moves in its own way until the
  // pointer leaves
  it('has no motion that repeats for ever, but an icon the reader points at', () => {
    const endless = rulesOf(read(siteCssFile)).filter((rule) => /\binfinite\b/.test(rule.body));
    expect(endless.length).toBeGreaterThan(0);
    for (const rule of endless)
      for (const selector of rule.selector.split(','))
        expect(selector.trim(), 'an endless motion outside a pointed icon').toMatch(/^\.tuwa-pixel-art--live\b/);
  });

  it('draws its scanlines as Nova draws them', () => {
    expect(novaScanlines).toMatch(/^repeating-linear-gradient\(/);
    const scan = rulesOf(read(siteCssFile))
      .flatMap((rule) => declarationsOf(rule.body))
      .find(({ property }) => property === '--tuwa-docs-scan');
    expect(scan && cssViolation(':root', scan.property, scan.value)).toBeUndefined();
    expect(read(siteCssFile)).toMatch(/\.tuwa-docs-scan\s*\{\s*background-image:\s*var\(--tuwa-docs-scan\);\s*\}/);
  });

  it('allows the dark glow of the logo only on the logo of the dark theme', () => {
    expect(componentViolations(path.join(docsUi, 'src/components/Logo.tsx'))).toEqual([]);
    const source = read(path.join(docsUi, 'src/components/Logo.tsx'));
    expect(source).toMatch(/drop-shadow\(0 0 4px rgba\(34, 195, 230, 0\.32\)\)/);
  });

  // The cosmic midnight blue and the sky blue of the look before paper and ink
  it.each([
    ['docs-ui site.css', siteCssFile],
    ['hub globals.css', globalsFile],
  ])('%s has none of the cosmic colours', (_, file) => {
    const css = withoutCssComments(read(file)).toLowerCase();
    for (const colour of [/#0a0e27/, /#38bdf8/, /\b56,?\s*189,?\s*248\b/, /--nextra-bg:\s*10,?\s*14,?\s*39/])
      expect(css).not.toMatch(colour);
  });
});

/**
 * The parts of the hub not yet redrawn in paper and ink, by their path under `src`, with what waits for them. Every
 * other source file of the hub is checked.
 */
const hubNotYetRedrawn: { files: RegExp; why: string }[] = [
  { files: /^components\/playground\//, why: 'the playground, redrawn with its own stage' },
];

/** Every source file of the hub (not its tests, nor the data its scripts generate), by its path under `src`. */
function hubSources(dir = path.resolve(__dirname, '..'), base = dir): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return entry === 'generated' ? [] : hubSources(file, base);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [path.relative(base, file)] : [];
  });
}

const hubRedrawn = hubSources().filter((file) => !hubNotYetRedrawn.some((part) => part.files.test(file)));

/** What breaks paper and ink in a component of the hub: its Tailwind classes, inline styles and colours. */
function hubViolations(file: string) {
  const source = withoutJsComments(read(file));
  // Classes in a `className`, in a constant of classes (`chipClassName = '…'`) and in the strings of a `cn(…)` call
  const written = [
    ...[...source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)].map((match) => match[1] ?? match[2] ?? ''),
    ...[...source.matchAll(/\b\w*[cC]lass(?:Name)?\w*\s*=\s*(['"`])([^'"`]*)\1/g)].map((match) => match[2] ?? ''),
    ...[...source.matchAll(/\bcn\(([\s\S]*?)\)\}/g)].flatMap((call) =>
      [...(call[1] ?? '').matchAll(/(['"`])([^'"`]*)\1/g)].map((match) => match[2] ?? ''),
    ),
  ];
  const classes = written.flatMap((text) =>
    text
      .replace(/\$\{[^}]*\}/g, ' ')
      .split(/\s+/)
      .filter(Boolean),
  );
  const found = classes.map(classViolation).filter((violation): violation is string => !!violation);
  if (/(linear|radial|conic)-gradient\(/.test(source)) found.push('a gradient in a style');
  for (const match of source.matchAll(/\b(boxShadow|backdropFilter|filter|textShadow)\s*:\s*(['"`])([^'"`]*)\2/g))
    if (match[3] !== 'none') found.push(`${match[1]}: ${match[3]}`);
  for (const colour of [/#0a0e27/i, /#030303/i, /#38bdf8/i, /\bdark:bg-\[#/])
    if (colour.test(source)) found.push(`${colour}`);
  return found;
}

describe('paper and ink in the hub', () => {
  it('checks the whole hub but the parts that wait for their stage', () => {
    expect(hubRedrawn.length).toBeGreaterThan(80);
    expect(hubRedrawn).toContain('components/NotFoundContent.tsx');
    expect(hubRedrawn).toContain('app/rootDocument.tsx');
    for (const part of hubNotYetRedrawn)
      expect(
        hubSources().some((file) => part.files.test(file)),
        part.why,
      ).toBe(true);
  });

  it.each(hubRedrawn)('has no gradients, shadows, blur, rounded corners or cosmic colours in %s', (file) => {
    expect(hubViolations(path.resolve(__dirname, '..', file))).toEqual([]);
  });

  // The guard itself: it would catch what the hub had before
  it('flags the glass header and the gradients of the look before', () => {
    expect(classViolation('backdrop-blur-xl')).toBeDefined();
    expect(classViolation('lg:dark:bg-gradient-to-r')).toBeDefined();
    expect(classViolation('rounded-full')).toBeDefined();
    expect(classViolation('shadow-xl')).toBeDefined();
    expect(classViolation('rounded-none')).toBeUndefined();
  });

  // Classes kept in a constant or passed to `cn()` are checked as those written in a `className`
  it('reads the classes of constants and of cn() calls', () => {
    const file = path.resolve(__dirname, '../components/PackageDialog.tsx');
    const source = read(file);
    expect(source).toMatch(/const chipClassName =/);
    expect(source).toMatch(/className=\{cn\(/);
    expect(hubViolations(file)).toEqual([]);
  });
});

describe('the paper of the documentation sites', () => {
  const rules = rulesOf(read(siteCssFile));
  const valueOf = (selector: string, property: string) =>
    rules
      .filter((rule) => rule.selector === selector)
      .flatMap((rule) => declarationsOf(rule.body))
      .findLast((declaration) => declaration.property === property)?.value;
  const novaValue = (selector: string, property: string) =>
    rulesOf(novaCss)
      .filter((rule) => rule.selector === selector)
      .flatMap((rule) => declarationsOf(rule.body))
      .findLast((declaration) => declaration.property === property)?.value;
  const channels = (hex: string) =>
    [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(', ');

  // Nova swaps paper and raised between the themes: the page is --tuwa-bg-secondary in light, --tuwa-bg-primary in dark
  it('names the surfaces by their role in each theme', () => {
    expect(valueOf(':root', '--tuwa-docs-paper')).toBe('var(--tuwa-bg-secondary)');
    expect(valueOf(':root', '--tuwa-docs-raised')).toBe('var(--tuwa-bg-primary)');
    expect(valueOf('.dark', '--tuwa-docs-paper')).toBe('var(--tuwa-bg-primary)');
    expect(valueOf('.dark', '--tuwa-docs-raised')).toBe('var(--tuwa-bg-secondary)');
    for (const selector of [':root', '.dark'])
      expect(valueOf(selector, '--tuwa-docs-sunken')).toBe('var(--tuwa-bg-muted)');
  });

  it('gives Nextra the paper of Nova, in the channels it reads', () => {
    expect(valueOf(':root', '--nextra-bg')).toBe(channels(novaValue(':root', '--tuwa-bg-secondary') ?? ''));
    expect(valueOf('.dark', '--nextra-bg')).toBe(channels(novaValue('.dark', '--tuwa-bg-primary') ?? ''));
    expect(valueOf(':root', '--nextra-bg')).toBe('242, 241, 238');
    expect(valueOf('.dark', '--nextra-bg')).toBe('16, 16, 20');
  });

  it('paints the page with the paper', () => {
    expect(valueOf('html, body', 'background-color')).toBe('var(--tuwa-docs-paper)');
  });

  // Nextra writes --nextra-bg from the colours of its Head, after site.css: its sticky header and sidebar footer are
  // painted with them, so the hub gives it the paper too, not white and the midnight blue before it
  it('gives the Head of Nextra the paper of each theme', () => {
    const rootDocument = read(path.resolve(__dirname, '../app/rootDocument.tsx'));
    expect(rootDocument).toContain(
      `<Head backgroundColor={{ light: '${novaValue(':root', '--tuwa-bg-secondary')}', dark: '${novaValue('.dark', '--tuwa-bg-primary')}' }}>`,
    );
  });

  // Nextra 4 marks the current page of its sidebar with the class `active` on the item, not with a `data-active`
  // attribute: a rule on `[data-active]` matches nothing and leaves the pale accent block of Nextra in its place
  it('draws the current page of the sidebar as a block of ink, on the item Nextra marks', () => {
    const sidebar = read(path.join(docsUi, 'node_modules/nextra-theme-docs/dist/components/sidebar.js'));
    expect(sidebar).toMatch(/jsxs?\("li", \{ className: t3/);
    expect(sidebar).toMatch(/cn\(\{\s*open,\s*active\s*\}\)/);
    expect(sidebar).not.toContain('data-active');
    const current = '.nextra-sidebar li.active > :is(a, button), .nextra-mobile-nav li.active > :is(a, button)';
    expect(valueOf(current, 'background-color')).toBe('var(--tuwa-text-primary) !important');
    expect(valueOf(current, 'color')).toBe('var(--tuwa-docs-paper) !important');
    expect(rules.filter((rule) => /\.nextra-(sidebar|mobile-nav)\S*[^,]*\[data-active\]/.test(rule.selector))).toEqual(
      [],
    );
  });

  // Nextra's links, active items and focus take the accent of Nova, in each theme
  it('builds the accent scale of Nextra on the accent of Nova', () => {
    expect(valueOf(':root, .dark', '--x-color-primary-600')).toBe('var(--tuwa-text-accent)');
    for (const step of [50, 100, 200, 300, 400, 500, 700, 800, 900, 950])
      expect(valueOf(':root, .dark', `--x-color-primary-${step}`)).toMatch(
        /^color-mix\(in srgb, var\(--tuwa-text-accent\) /,
      );
  });
});
