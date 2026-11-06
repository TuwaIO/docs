import { describe, expect, it } from 'vitest';

import { BUNDLE_SETS, entryPoints, formatKb, mainEntry, setSize, staticClosure, tarballUrl } from './bundleSize';

const sizes = {
  '@tuwaio/a': { version: '1.0.0', minified: 30_000, gzip: 10_240 },
  '@tuwaio/b': { version: '1.0.0', minified: 6_000, gzip: 2_048 },
};

describe('bundle sizes', () => {
  it('formats bytes as kB with one decimal', () => {
    expect(formatKb(10_240)).toBe('10.0 kB');
    expect(formatKb(1_587)).toBe('1.5 kB');
  });

  it('sums the gzip size of a set and lists its packages', () => {
    expect(setSize(['@tuwaio/a', '@tuwaio/b'], sizes)).toEqual({ gzip: 12_288, complete: true });
  });

  it('marks a set incomplete when a package was not measured', () => {
    expect(setSize(['@tuwaio/a', '@tuwaio/missing'], sizes)).toEqual({ gzip: 10_240, complete: false });
  });

  it('defines sets only from real TUWA package names', () => {
    for (const set of BUNDLE_SETS) {
      expect(set.packages.length).toBeGreaterThan(0);
      for (const name of set.packages) expect(name).toMatch(/^@tuwaio\/[a-z0-9-]+$/);
    }
  });
});

describe('mainEntry', () => {
  it('takes the ESM file of the "." export, never the types', () => {
    expect(
      mainEntry({
        exports: {
          '.': { import: { types: './dist/index.d.mts', default: './dist/index.mjs' }, require: './dist/index.cjs' },
        },
        main: './dist/index.cjs',
      }),
    ).toBe('./dist/index.mjs');
  });

  it('accepts exports given as a string or a flat condition map', () => {
    expect(mainEntry({ exports: './dist/main.js' })).toBe('./dist/main.js');
    expect(mainEntry({ exports: { types: './dist/index.d.ts', import: './dist/index.js' } })).toBe('./dist/index.js');
  });

  it('falls back to module, then main', () => {
    expect(mainEntry({ module: './esm/index.js', main: './cjs/index.js' })).toBe('./esm/index.js');
    expect(mainEntry({ main: './cjs/index.js' })).toBe('./cjs/index.js');
    expect(mainEntry({ exports: { '.': { types: './dist/index.d.ts' } }, main: './dist/index.js' })).toBe(
      './dist/index.js',
    );
  });
});

describe('tarballUrl', () => {
  it('builds the registry tarball path of a scoped package', () => {
    expect(tarballUrl('@tuwaio/pulsar-core', '0.11.0')).toBe(
      'https://registry.npmjs.org/@tuwaio/pulsar-core/-/pulsar-core-0.11.0.tgz',
    );
  });
});

describe('entryPoints', () => {
  it('is the main entry when the package has one', () => {
    expect(
      entryPoints({ exports: { '.': { import: './dist/index.js' }, './safe': { import: './dist/safe.js' } } }),
    ).toEqual(['./dist/index.js']);
  });

  it('is every JavaScript subpath when there is no main entry, as in the SDK packages', () => {
    expect(
      entryPoints({
        exports: {
          './pulsar': { types: './dist/pulsar.d.ts', import: './dist/pulsar.js', require: './dist/pulsar.cjs' },
          './satellite': { import: './dist/satellite.js' },
          './styles.css': './dist/styles.css',
          './package.json': './package.json',
        },
      }),
    ).toEqual(['./dist/pulsar.js', './dist/satellite.js']);
  });
});

describe('staticClosure', () => {
  it('follows static imports from the entry and leaves dynamic ones out', () => {
    const outputs = {
      'out/entry.js': {
        imports: [
          { path: 'out/chunk-a.js', kind: 'import-statement' },
          { path: 'out/image.js', kind: 'dynamic-import' },
        ],
      },
      'out/chunk-a.js': { imports: [{ path: 'out/chunk-c.js', kind: 'import-statement' }] },
      'out/chunk-c.js': { imports: [] },
      'out/image.js': { imports: [{ path: 'out/chunk-d.js', kind: 'import-statement' }] },
      'out/chunk-d.js': { imports: [] },
    };
    expect(staticClosure(outputs, 'out/entry.js')).toEqual(['out/chunk-a.js', 'out/chunk-c.js', 'out/entry.js']);
  });

  it('ignores imports of files that are not outputs (external packages)', () => {
    expect(
      staticClosure({ 'out/entry.js': { imports: [{ path: 'react', kind: 'import-statement' }] } }, 'out/entry.js'),
    ).toEqual(['out/entry.js']);
  });
});
