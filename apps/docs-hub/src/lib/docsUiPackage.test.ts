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

  // An app that loads Nova Core itself would otherwise carry it twice, with a frozen copy over its own version
  it('has a stylesheet without Nova Core for an app that loads it itself', () => {
    const css = readFileSync(join(dist, 'site.css'), 'utf8');
    expect(css).not.toContain('@font-face');
    expect(css).not.toContain('novacore\\:');
    expect(css).toContain('--nextra-primary-hue');
  });

  // The classes of the Orb live next to the dead ones: removing by range once took a class in use with it
  it('keeps the classes in use', () => {
    const css = readFileSync(join(dist, 'site.css'), 'utf8');
    for (const name of ['.tuwa-orb-float', '.tuwa-slide-dark', '.tuwa-footer-link--npm']) expect(css).toContain(name);
  });

  it.each([
    'tuwa-gradient-text',
    'tuwa-heart',
    'tuwa-badge',
    'tuwa-card',
    'tuwa-float',
    'tuwa-pulse',
    'tuwa-orb-pulse',
    'remote-logo',
  ])('drops %s, which nothing uses', (name) => {
    expect(readFileSync(join(dist, 'site.css'), 'utf8')).not.toMatch(new RegExp(`\\.${name}(?![\\w-])`));
  });
});
