import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { layers, linkHost, stagedEntries } from './ecosystem';
import { sizeMeasuredAt, splitPackageNames } from './ledger';

// The stage ledgers of the main page: a ledger per stage, its projects and their rows (npm packages, the deprecated one,
// the links of a project), as the approved sketch of the main page draws them, in paper and ink

const read = (file: string) => readFileSync(path.resolve(__dirname, file), 'utf8');

describe('the rows of the ledgers', () => {
  it('show a page of the hub by its path and another site by its host and path', () => {
    expect(linkHost('/quasar/self-hosting')).toBe('/quasar/self-hosting');
    expect(linkHost('https://quasar.tuwa.io/')).toBe('quasar.tuwa.io');
    expect(linkHost('https://github.com/TuwaIO/quasar-community#live-community-showcase')).toBe(
      'github.com/TuwaIO/quasar-community',
    );
    expect(linkHost('https://github.com/TuwaIO/quasar-community/tree/v0.4.3')).toBe(
      'github.com/TuwaIO/quasar-community/tree/v0.4.3',
    );
  });

  it('set the package names of a deprecation note as code', () => {
    expect(splitPackageNames('Use @tuwaio/siwx-react and @tuwaio/siwx-server instead.')).toEqual([
      { text: 'Use ', code: false },
      { text: '@tuwaio/siwx-react', code: true },
      { text: ' and ', code: false },
      { text: '@tuwaio/siwx-server', code: true },
      { text: ' instead.', code: false },
    ]);
    expect(splitPackageNames('使用 @tuwaio/siwx-react。')).toEqual([
      { text: '使用 ', code: false },
      { text: '@tuwaio/siwx-react', code: true },
      { text: '。', code: false },
    ]);
  });

  it('date the note on the sizes by the measurement of the build', () => {
    expect(sizeMeasuredAt({ a: {}, b: { sizeMeasuredAt: '2026-11-12' } })).toBe('2026-11-12');
    expect(sizeMeasuredAt({ a: {} })).toBeUndefined();
  });
});

describe('the markup of the ledgers', () => {
  const ledgers = read('../components/home/StageLedgers.tsx');
  const ledger = read('../components/home/StageLedger.tsx');
  const product = read('../components/home/ProductRow.tsx');
  const rows = read('../components/home/PackageRow.tsx');

  it('give every stage and project the anchor the plate and the board link to, under the header and the bar', () => {
    expect(ledger).toContain('id={`stage-${stage}`}');
    expect(product).toContain('id={`p-${entry.id}`}');
    for (const source of [ledger, product]) expect(source).toContain('scroll-mt-[120px]');
    expect(ledgers).toContain('<SectionBar');
    expect(layers).toHaveLength(5);
    expect(stagedEntries()).toHaveLength(8);
  });

  // A button may hold no block of content: the preview is a sibling of the row's button, inside its list item
  it('keep the preview beside the button of a row, not in it', () => {
    const npmRow = rows.slice(
      rows.indexOf('export function NpmPackageRow'),
      rows.indexOf('export function DeprecatedPackageRow'),
    );
    expect(npmRow.indexOf('</button>')).toBeLessThan(npmRow.indexOf('<PackagePreview'));
    expect(npmRow).toContain('aria-haspopup="dialog"');
  });

  // The heads of the columns are hidden from assistive technology: every value is read out with its name instead
  it('read every value of a row out with the name of its column', () => {
    expect(ledger).toMatch(/aria-hidden="true"\s+className=\{`hidden border-b/);
    expect(rows).toContain('<span className="sr-only">{label} </span>');
    expect(rows).toContain('<span className="sr-only">{t.home.ledger.version} </span>');
    expect(rows).toContain('<span className="sr-only">{labels.license} </span>');
    expect(rows).toContain('<span className="md:sr-only"> gzip</span>');
  });

  it('strike a deprecated package through, mark it and say what to use instead', () => {
    const deprecated = rows.slice(
      rows.indexOf('export function DeprecatedPackageRow'),
      rows.indexOf('export function LinkRow'),
    );
    expect(deprecated).toContain('<s ');
    expect(deprecated).toContain('{t.home.ledger.deprecated}');
    expect(deprecated).toContain('text-[var(--tuwa-error-text)]');
    expect(deprecated).toContain('splitPackageNames(note)');
  });

  it('open the preview below the row only, from 1024px on devices that hover', () => {
    const preview = read('../components/PackagePreview.tsx');
    expect(preview).toContain('top-[calc(100%+6px)]');
    expect(preview).not.toMatch(/bottom-full|placement/);
    expect(preview).toContain('lg:[@media(hover:hover)]:block');
    expect(preview).not.toMatch(/shadow-|rounded-full/);
  });
});
