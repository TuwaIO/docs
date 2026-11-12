import { readFileSync } from 'node:fs';
import path from 'node:path';

import { projectIconArt } from '@tuwaio/docs-ui';
import { describe, expect, it } from 'vitest';

import { en, uk, zhCN } from '../i18n';
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
    // Quasar Client is a product of its own, and the two checkout packages of its repository joined the 25 of before
    expect(counts).toEqual({ packages: 27, products: 9, stages: 5 });
    const npm = layers.flatMap((layer) => layer.entries.flatMap((entry) => entry.packages ?? []));
    expect(npm.filter((pkg) => pkg.isDeprecated).map((pkg) => pkg.name)).toEqual(['@tuwaio/satellite-siwe-next-auth']);
  });
});

describe('the plate of the hero', () => {
  // A 3 × 3 plate of the nine projects, under the counts. In every stage the project the others build on comes first:
  // Orbit Utils before SIWX, Pulsar before Satellite Connect; Quasar Client stands with the backend it calls
  it('has nine projects, each with its stage and an icon that exists', () => {
    const entries = stagedEntries();
    expect(entries).toHaveLength(9);
    expect(entries.map((entry) => `${entry.stage}:${entry.id}`)).toEqual([
      '1:orbit',
      '1:siwx',
      '2:pulsar',
      '2:satellite',
      '3:quasar',
      '3:quasar-community',
      '3:quasar-client',
      '4:nova',
      '5:sdk',
    ]);
    for (const entry of entries) expect(projectIconArt[entry.icon], entry.id).toBeDefined();
    expect(entries.find((entry) => entry.id === 'quasar-community')?.icon).toBe('server');
    expect(entries.find((entry) => entry.id === 'quasar-client')?.icon).toBe('card');
    // The plate draws them all, three in a row, with no cell kept for the counts, and numbers them 01 to 09: a stage
    // has several projects, so the number of its stage repeated from cell to cell and read as a wrong count
    const plate = readFileSync(path.resolve(__dirname, '../components/home/HeroPlate.tsx'), 'utf8');
    expect(plate).toContain('{stagedEntries().map((entry, index) => (');
    expect(plate).toContain('<PlateLink key={entry.id} entry={entry} number={index + 1} />');
    expect(plate).toContain("{String(number).padStart(2, '0')}");
    expect(plate).not.toContain('entry.stage');
    expect(plate).toMatch(/className="col-span-3 [^"]*bg-\[var\(--tuwa-text-primary\)\]/);
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

// The dialog and the preview of a package read its description from the dictionary of the language, and fall back to
// the English one of npm: a package added without its three descriptions showed English on the Ukrainian and Chinese
// pages (the icons of Nova, the CLI of the SDK and the two checkout packages did)
describe('the descriptions of the packages', () => {
  const dictionaries = { en, uk, 'zh-CN': zhCN };
  const packages = layers.flatMap((layer) =>
    layer.entries.flatMap((entry) =>
      (entry.packages ?? []).filter((pkg) => pkg.name.startsWith('@tuwaio/')).map((pkg) => pkg),
    ),
  );

  it.each(Object.keys(dictionaries))('describe every package of the stages in %s, and nothing else', (locale) => {
    const descriptions = dictionaries[locale as keyof typeof dictionaries].home.packageDialog.packageDescriptions;
    expect(Object.keys(descriptions).sort()).toEqual(packages.map((pkg) => pkg.name).sort());
    for (const text of Object.values(descriptions)) expect(text.length).toBeGreaterThan(40);
  });

  it('name the layer the stages give the package, in every language', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries))
      for (const pkg of packages.filter((item) => !item.isDeprecated))
        expect(dictionary.home.packageDialog.packageDescriptions[pkg.name], `${locale} ${pkg.name}`).toContain(
          pkg.layer,
        );
  });

  it('say every project and every stage in every language', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      expect(Object.keys(dictionary.home.entries).sort(), locale).toEqual(
        stagedEntries()
          .map((entry) => entry.id)
          .sort(),
      );
      expect(Object.keys(dictionary.home.timeline.stages), locale).toEqual(layers.map((_, index) => String(index + 1)));
    }
    // The English of the data is the English of the dictionary
    for (const [index, layer] of layers.entries()) {
      expect(en.home.timeline.stages[index + 1]?.subtitle).toBe(layer.subtitle);
      for (const entry of layer.entries) expect(en.home.entries[entry.id]?.tagline, entry.id).toBe(entry.tagline);
    }
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
      'quasar-community>quasar-client',
    ]);
  });

  // Quasar Cloud listed the package of the client and so counted "1 package": without it the board would call the
  // managed cloud self-hosted, the words it has for a project without packages
  it('says how a project without packages is run: managed or self-hosted', () => {
    const hosting = Object.fromEntries(
      entries.filter((entry) => entry.hosting).map((entry) => [entry.id, entry.hosting]),
    );
    expect(hosting).toEqual({ quasar: 'managed', 'quasar-community': 'self-hosted' });
    for (const entry of entries)
      expect(Boolean(entry.hosting), entry.id).toBe(
        !(entry.packages ?? []).some((pkg) => pkg.name.startsWith('@tuwaio/')),
      );
    const board = readFileSync(path.resolve(__dirname, '../components/home/EcosystemBoard.tsx'), 'utf8');
    expect(board).toMatch(/entry\.hosting === 'managed' \? \(\s*board\.managed\s*\) : \(\s*board\.selfHosted/);
  });

  // The repository of Quasar Client has three packages of three layers: each is listed with the project of its layer,
  // so the layers of the stages stay what they are
  it('lists the packages of the Quasar Client repository where their layers are', () => {
    const home = (name: string) => entries.find((entry) => entry.packages?.some((pkg) => pkg.name === name));
    const layerOf = (name: string) => home(name)?.packages?.find((pkg) => pkg.name === name)?.layer;
    expect([home('@tuwaio/quasar-sdk')?.id, layerOf('@tuwaio/quasar-sdk')]).toEqual(['quasar-client', 'L5']);
    // The checkout uses the whole of Nova UI Kit (L6–L7), so it is one layer above it: L8, as the SDK is
    expect([home('@tuwaio/nova-payments')?.id, layerOf('@tuwaio/nova-payments')]).toEqual(['nova', 'L8']);
    // It goes on top of @tuwaio/sdk (L8) and, for its Solana entry, of @tuwaio/solana-sdk (L9): one layer above them
    expect([home('@tuwaio/payments-sdk')?.id, layerOf('@tuwaio/payments-sdk')]).toEqual(['sdk', 'L10']);
    const packages = readFileSync(path.resolve(__dirname, 'packages.ts'), 'utf8');
    // Their reference and their source are those of that repository, whatever project lists them
    for (const prefix of ['quasar-sdk', 'payments-sdk', 'nova-payments'])
      expect(packages).toContain(`{ prefix: '${prefix}', ...quasarClient },`);
  });

  it('names the layers of each stage from its packages', () => {
    expect([1, 2, 3, 4, 5].map(stageLayerRange)).toEqual(['L1–L2', 'L3–L4', 'L5', 'L6–L8', 'L8–L10']);
    expect(entryLayerRange('quasar-community')).toBe('');
    expect(entryLayerRange('quasar')).toBe('');
    expect(entryLayerRange('quasar-client')).toBe('L5');
    expect(entryLayerRange('siwx')).toBe('L1–L2');
  });

  it('lists the projects the SDK re-exports', () => {
    expect(sdkReExports).toEqual(['orbit', 'siwx', 'satellite', 'pulsar', 'nova']);
    for (const id of sdkReExports) expect(ids.has(id)).toBe(true);
  });
});
