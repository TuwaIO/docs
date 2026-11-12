import { readFileSync } from 'node:fs';
import path from 'node:path';

import { projectIconArt } from '@tuwaio/docs-ui';
import { describe, expect, it } from 'vitest';

import {
  boardEdges,
  boardPlaces,
  ecosystemCounts,
  entryLayerRange,
  layers,
  sdkReExports,
  stagedEntries,
  stageLayerRange,
} from './ecosystem';

const ecosystemSource = readFileSync(path.resolve(__dirname, 'ecosystem.ts'), 'utf8');
const buildData = readFileSync(path.resolve(__dirname, '../../scripts/build-data.mjs'), 'utf8');

describe('the counts of the hero', () => {
  it('come from the data: the packages on npm that are not deprecated, the products and the stages', () => {
    const counts = ecosystemCounts();
    // nova-icons (a dependency of nova-core) and create-cosmos-playground (the CLI of the SDK) joined the 23 of before
    expect(counts).toEqual({ packages: 25, products: 8, stages: 5 });
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

// The board of the architecture: what builds on what, by project ids, on a grid of five stage rows by three lanes
describe('the board of the architecture', () => {
  const entries = stagedEntries();
  const ids = new Set(entries.map((entry) => entry.id));

  it('places every project once, in its own stage row, with no two in one cell', () => {
    const cells = new Set<string>();
    for (const entry of entries) {
      const place = boardPlaces[entry.id];
      expect(place, entry.id).toBeDefined();
      expect(place!.row, entry.id).toBe(entry.stage);
      for (let lane = place!.lane; lane < place!.lane + (place!.span ?? 1); lane++) {
        expect(lane).toBeGreaterThanOrEqual(1);
        expect(lane).toBeLessThanOrEqual(3);
        const cell = `${place!.row}:${lane}`;
        expect(cells.has(cell), cell).toBe(false);
        cells.add(cell);
      }
    }
    expect(Object.keys(boardPlaces).sort()).toEqual([...ids].sort());
    expect(boardPlaces.sdk).toEqual({ row: 5, lane: 1, span: 3 });
  });

  it('draws only edges between projects on the board, from an earlier stage or beside it, with no cycle', () => {
    for (const edge of boardEdges) {
      expect(ids.has(edge.from), edge.from).toBe(true);
      expect(ids.has(edge.to), edge.to).toBe(true);
      const [from, to] = [boardPlaces[edge.from]!, boardPlaces[edge.to]!];
      // SIWX builds on Orbit in the same stage: an edge may run across its row
      if (edge.kind === 'or') expect(from.row).toBe(to.row);
      else expect(from.row).toBeLessThanOrEqual(to.row);
    }
    const next = (id: string) => boardEdges.filter((edge) => edge.from === id).map((edge) => edge.to);
    const visit = (id: string, path: string[]): void => {
      expect(path, `cycle through ${id}`).not.toContain(id);
      for (const to of next(id)) visit(to, [...path, id]);
    };
    for (const id of ids) visit(id, []);
    expect(boardEdges.map((edge) => `${edge.from}>${edge.to}${edge.kind ? ` ${edge.kind}` : ''}`)).toEqual([
      'orbit>siwx',
      'siwx>satellite optional',
      'orbit>satellite',
      'orbit>pulsar',
      'pulsar>quasar optional',
      'satellite>nova',
      'pulsar>nova',
      'orbit>nova',
      'siwx>nova optional',
      'nova>sdk',
      'quasar-community>quasar or',
    ]);
  });

  it('names the layers of each stage from its packages', () => {
    expect([1, 2, 3, 4, 5].map(stageLayerRange)).toEqual(['L1–L2', 'L3–L4', 'L5', 'L6–L7', 'L8–L9']);
    expect(entryLayerRange('quasar-community')).toBe('');
    expect(entryLayerRange('siwx')).toBe('L1–L2');
  });

  it('lists the projects the SDK re-exports', () => {
    expect(sdkReExports).toEqual(['orbit', 'siwx', 'satellite', 'pulsar', 'nova']);
    for (const id of sdkReExports) expect(ids.has(id)).toBe(true);
  });
});
