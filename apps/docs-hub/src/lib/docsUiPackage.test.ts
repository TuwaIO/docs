import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../packages/docs-ui');
const src = join(packageRoot, 'src');
const dist = join(packageRoot, 'dist');

/** What a source file loads when it runs: type-only imports are gone from the build. */
const runtimeImports = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/^(?:import|export)\s+(?!type\b)[^;'"]*?from\s+'([^']+)'/gm)].map(
    (match) => match[1] as string,
  );

/** The source file of a relative import. */
const sourceOf = (from: string, target: string) =>
  ['.ts', '.tsx', '/index.ts']
    .map((ending) => resolve(dirname(from), `${target.replace(/\.js$/, '')}${ending}`))
    .find((file) => existsSync(file));

/** Every package the module graph of an entry loads when it runs. */
const packagesOf = (entry: string) => {
  const seen = new Set<string>();
  const packages = new Set<string>();
  const walk = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const target of runtimeImports(file)) {
      if (!target.startsWith('.')) packages.add(target);
      else {
        const next = sourceOf(file, target);
        if (next) walk(next);
      }
    }
  };
  walk(join(src, entry));
  return [...packages];
};

describe('the root entry of @tuwaio/docs-ui', () => {
  // The website and the Quasar dashboard take a language switch or a policy page from here: Nextra is not theirs to install
  it('loads neither Next.js nor Nextra', () => {
    expect(packagesOf('index.ts').filter((name) => /^(next|nextra)(\/|-|$)/.test(name))).toEqual([]);
  });

  it('has neither the navbar nor the footer, which wrap the Nextra theme', () => {
    const index = readFileSync(join(src, 'index.ts'), 'utf8');
    expect(index).not.toMatch(/components\/(NavBar|Footer)/);
    const nextra = readFileSync(join(src, 'nextra.ts'), 'utf8');
    expect(nextra).toMatch(/components\/NavBar/);
    expect(nextra).toMatch(/components\/Footer/);
  });

  // The square of a project and its pixel art are for the website and Quasar as well as the hub; Orb stays as its old name
  it('exports the square of a project, its pixel art and the old name Orb', () => {
    const index = readFileSync(join(src, 'index.ts'), 'utf8');
    expect(index).toContain("export * from './components/ProjectSquare';");
    expect(index).toContain("export * from './projectIcons';");
    expect(index).toContain("export * from './components/Orb';");
  });

  // The flight plan and the handoff are for every TUWA site (the hub and tuwa.io fly them): they come from the root
  // entry and load neither Next.js nor Nextra
  it('exports the flight plan and the handoff of the pixel icons', () => {
    const index = readFileSync(join(src, 'index.ts'), 'utf8');
    expect(index).toContain("export * from './components/FlightPlan';");
    expect(index).toContain("export * from './components/PixelHandoff';");
    for (const entry of ['components/FlightPlan.tsx', 'components/PixelHandoff.tsx'])
      expect(packagesOf(entry).filter((name) => /^(next|nextra)(\/|-|$)/.test(name))).toEqual([]);
  });

  it('declares what only the Nextra entries need as optional', () => {
    const { peerDependenciesMeta } = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
    for (const name of ['next', 'nextra', 'nextra-theme-docs'])
      expect(peerDependenciesMeta[name]).toEqual({ optional: true });
  });
});

describe('the stylesheets of @tuwaio/docs-ui', () => {
  const localUrlsOf = (css: string) =>
    [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)]
      .map((match) => match[2] as string)
      .filter((url) => !/^(data:|https?:|#)/.test(url));

  // A bundler fails the build of a site on a url() it cannot resolve, and Tailwind writes paths of this package's build
  it.each(['index.css', 'site.css'])('%s names only files published next to it', (file) => {
    const urls = localUrlsOf(readFileSync(join(dist, file), 'utf8'));
    expect(urls.filter((url) => !existsSync(join(dist, url)))).toEqual([]);
    for (const url of urls) expect(url.startsWith('./')).toBe(true);
  });

  it('carries the fonts of Nova Core with their license in the stylesheet that inlines it', () => {
    const css = readFileSync(join(dist, 'index.css'), 'utf8');
    expect(localUrlsOf(css).length).toBeGreaterThan(0);
    expect(existsSync(join(dist, 'fonts', 'OFL-Geist.txt'))).toBe(true);
  });

  // Each Nova package builds Tailwind with its own prefix on the default mono, a system font. Nova Core maps them to
  // --tuwa-font-mono, and a project site has only the copy inlined at the build of this package
  it('keeps the inlined Nova Core on the mono font of TUWA', () => {
    const css = readFileSync(join(dist, 'index.css'), 'utf8').replace(/\s/g, '');
    expect(css.includes('--novacon-font-mono:var(--tuwa-font-mono)')).toBe(true);
    expect(css.includes('--novatx-font-mono:var(--tuwa-font-mono)')).toBe(true);
  });

  // An app that loads Nova Core itself would otherwise carry it twice, with a frozen copy over its own version
  it('has a stylesheet without Nova Core for an app that loads it itself', () => {
    const css = readFileSync(join(dist, 'site.css'), 'utf8');
    expect(css).not.toContain('@font-face');
    expect(css).not.toContain('novacore\\:');
    expect(css).toContain('--nextra-primary-hue');
  });

  // Classes in use live next to dead ones: removing by range once took a class in use with it. Other repositories pin
  // some of them too: Quasar's dashboard stills the theme switch through its classes and keyframes
  // (admin-layout-contract.test.ts) and hands article links their own colours back (docs-ui-article-links.test.ts)
  it('keeps the classes in use', () => {
    const css = readFileSync(join(dist, 'site.css'), 'utf8');
    for (const name of [
      '.tuwa-project-square',
      '.tuwa-project-square__corners',
      '.tuwa-pixel-art',
      '.tuwa-pixel-art--assemble',
      '.tuwa-corner-marks',
      '.tuwa-theme-switch__knob--to-dark',
      '.tuwa-theme-switch__knob--to-light',
      '.tuwa-switch-appear',
      '.tuwa-footer-link--npm',
    ])
      expect(css).toContain(name);
  });

  it.each([
    ['.tuwa-switch-appear', 'tuwa-switch-appear'],
    ['.tuwa-theme-switch__knob--to-dark', 'tuwa-knob-to-dark'],
    ['.tuwa-theme-switch__knob--to-light', 'tuwa-knob-to-light'],
  ])('moves %s by its keyframes without !important, so an app can still it', (selector, keyframes) => {
    const css = readFileSync(join(dist, 'site.css'), 'utf8');
    const index = css.indexOf(`${selector} {`);
    expect(index).toBeGreaterThan(-1);
    const rule = css.slice(index, css.indexOf('}', index));
    expect(rule).toMatch(new RegExp(`animation:\\s*${keyframes}\\s[^;]*both`));
    expect(rule).not.toContain('!important');
  });

  it('keeps the accent of article links with !important, which Quasar undoes for its cards', () => {
    expect(readFileSync(join(dist, 'site.css'), 'utf8')).toMatch(/article a\s*\{[^}]*color:[^;]*!important/);
  });

  // The labels of paper and ink are monospace caps spaced 0.12em. A rule that made every monospace run tight and one line
  // high, with !important, flattened them all: it now leaves a part that sets its own tracking or line height alone
  it.each(['site.css', 'index.css'])('lets a monospace part keep its own tracking and line height (%s)', (file) => {
    const css = readFileSync(join(dist, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...css.matchAll(/([^{};]+)\{([^{}]*)\}/g)].map((match) => ({
      selector: (match[1] as string).replace(/\s+/g, ' ').trim(),
      body: match[2] as string,
    }));
    const monospace = rules.filter((rule) => rule.selector.startsWith("[class*='font-mono']"));
    const tracking = monospace.filter((rule) => /letter-spacing/.test(rule.body));
    const leading = monospace.filter((rule) => /line-height/.test(rule.body));
    expect(tracking.map((rule) => rule.selector)).toEqual(["[class*='font-mono']:not([class*='tracking-'])"]);
    expect(leading.map((rule) => rule.selector)).toEqual(["[class*='font-mono']:not([class*='leading-'])"]);
    // Ukrainian resets only tight tracking; a label spaced wider keeps its spacing (Nova has a rule of its own for its parts)
    const ukrainian = rules.filter(
      (rule) =>
        rule.selector.startsWith(':lang(uk)') &&
        !rule.selector.includes('novacore:') &&
        /letter-spacing/.test(rule.body),
    );
    expect(ukrainian).toHaveLength(1);
    expect(ukrainian[0]!.selector).toContain(":not([class*='tracking-'])");
    expect(ukrainian[0]!.selector).toContain("[class*='tracking-tight']");
    // Chinese: no capitals and no tracking on a caps label
    const chinese = rules.filter((rule) => rule.selector.startsWith(':lang(zh)'));
    expect(chinese).toHaveLength(1);
    expect(chinese[0]!.selector).toContain("[class*='uppercase']");
    expect(chinese[0]!.body).toMatch(/text-transform:\s*none/);
    expect(chinese[0]!.body).toMatch(/letter-spacing:\s*normal/);
  });

  it.each([
    'tuwa-gradient-text',
    'tuwa-heart',
    'tuwa-badge',
    'tuwa-card',
    'tuwa-float',
    'tuwa-pulse',
    'tuwa-orb-pulse',
    'tuwa-orb-float',
    'tuwa-orb-spin',
    'tuwa-orb',
    'tuwa-orb__pixel',
    'tuwa-orb__glow',
    'remote-logo',
  ])('drops %s, which nothing uses', (name) => {
    expect(readFileSync(join(dist, 'site.css'), 'utf8')).not.toMatch(new RegExp(`\\.${name}(?![\\w-])`));
  });
});
