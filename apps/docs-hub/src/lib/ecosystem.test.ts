import { readFileSync } from 'node:fs';
import path from 'node:path';

import { projectIconArt } from '@tuwaio/docs-ui';
import { describe, expect, it } from 'vitest';

import { ecosystemCounts, layers, stagedEntries } from './ecosystem';

const ecosystemSource = readFileSync(path.resolve(__dirname, 'ecosystem.ts'), 'utf8');
const buildData = readFileSync(path.resolve(__dirname, '../../scripts/build-data.mjs'), 'utf8');

describe('the counts of the hero', () => {
  it('come from the data: the packages on npm that are not deprecated, the products and the stages', () => {
    const counts = ecosystemCounts();
    expect(counts).toEqual({ packages: 23, products: 8, stages: 5 });
    const npm = layers.flatMap((layer) => layer.entries.flatMap((entry) => entry.packages ?? []));
    expect(npm.filter((pkg) => pkg.isDeprecated).map((pkg) => pkg.name)).toEqual(['@tuwaio/satellite-siwe-next-auth']);
  });
});

describe('the plate of the hero', () => {
  // A 3 × 3 plate: the eight projects around the count
  it('has eight projects, each with its stage and an icon that exists', () => {
    const entries = stagedEntries();
    expect(entries).toHaveLength(8);
    expect(entries.map((entry) => `${entry.stage}:${entry.id}`)).toEqual([
      '1:siwx',
      '1:orbit',
      '2:satellite',
      '2:pulsar',
      '3:quasar',
      '3:quasar-community',
      '4:nova',
      '5:sdk',
    ]);
    for (const entry of entries) expect(projectIconArt[entry.icon], entry.id).toBeDefined();
    expect(entries.find((entry) => entry.id === 'quasar-community')?.icon).toBe('server');
    expect(entries.find((entry) => entry.id === 'siwx')?.plateName).toBe('SIWX');
  });
});

// build-data.mjs fetches every `name: '@tuwaio/…'` string of ecosystem.ts from npm: data added for the hero, the board
// or the ledgers names projects by their ids, never by a package name, or the build would fetch a package that is not one
describe('the data that build-data reads', () => {
  it('names as packages only the npm packages of the stages', () => {
    const pattern = buildData.match(/source\.matchAll\((\/name: .+?\/g)\)/)?.[1];
    expect(pattern).toBeDefined();
    const regex = new Function(`return ${pattern}`)() as RegExp;
    const fetched = [...new Set([...ecosystemSource.matchAll(regex)].map((match) => match[1]))].sort();
    const packages = [
      ...new Set(
        layers.flatMap((layer) =>
          layer.entries.flatMap((entry) =>
            (entry.packages ?? []).map((pkg) => pkg.name).filter((name) => name.startsWith('@tuwaio/')),
          ),
        ),
      ),
    ].sort();
    expect(fetched).toEqual(packages);
  });
});
