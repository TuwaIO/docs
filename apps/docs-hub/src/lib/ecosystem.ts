import { type PackageType, type ProjectIcon, projectIcons } from '@tuwaio/docs-ui';

// The stages, projects and packages of the main page. Kept out of the client components, so server code (llms.txt,
// the sitemap) reads the same data. `scripts/build-data.mjs` reads the `@tuwaio/` package names from this file.

/**
 * A row of the packages list of a project card: an npm package with its layer, or a link.
 */
export interface PackageBadge {
  /** npm name (`@tuwaio/...`) or the label of a link */
  name: string;
  /** TUWA layer of an npm package (`L1`–`L9`) */
  layer?: string;
  /** Target of a link row; npm rows link to npm when they have no details */
  url?: string;
  /** Shows the package crossed out with a "Deprecated" badge */
  isDeprecated?: boolean;
}

/**
 * A project card of the main page.
 */
export interface DocEntry {
  id: string;
  /** The project whose icon the entry shows; defaults to `id`. Lets an entry without its own icon reuse another's. */
  orb?: PackageType;
  /** Pixel icon of the entry; defaults to the icon of its project */
  pixelIcon?: ProjectIcon;
  name: string;
  /** The short name on the plate of the hero (default: `name`) */
  plateName?: string;
  tagline: string;
  gradientFrom: string;
  gradientTo: string;
  docsUrl: string;
  githubUrl: string;
  packages?: PackageBadge[];
}

/**
 * A stage of the TUWA ecosystem with its project cards.
 */
export interface EcosystemLayer {
  label: string;
  subtitle: string;
  accentClass: string;
  dotGradient: string;
  entries: DocEntry[];
}

const QUASAR_DASHBOARD_URL = process.env.NEXT_PUBLIC_QUASAR_DASHBOARD_URL || 'https://quasar.tuwa.io/';

export const layers: EcosystemLayer[] = [
  {
    label: 'Stage 1 — Core Auth & Primitives',
    subtitle: 'Chain-agnostic CAIP-122 auth & multi-chain primitives',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    dotGradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500',
    entries: [
      {
        id: 'siwx',
        name: 'Sign-In With X (SIWX)',
        plateName: 'SIWX',
        tagline: 'CAIP-122 authentication engine & adapters',
        gradientFrom: 'from-emerald-600 dark:from-emerald-400',
        gradientTo: 'to-teal-600 dark:to-emerald-500',
        docsUrl: 'https://siwx.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/siwx',
        packages: [
          { name: '@tuwaio/siwx-core', layer: 'L1' },
          { name: '@tuwaio/siwx-evm', layer: 'L2' },
          { name: '@tuwaio/siwx-solana', layer: 'L2' },
          { name: '@tuwaio/siwx-react', layer: 'L2' },
          { name: '@tuwaio/siwx-server', layer: 'L2' },
        ],
      },
      {
        id: 'orbit',
        name: 'Orbit Utils',
        tagline: 'Multi-chain utilities for EVM & Solana',
        gradientFrom: 'from-emerald-600 dark:from-emerald-400',
        gradientTo: 'to-teal-700 dark:to-teal-500',
        docsUrl: 'https://orbit.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/orbit',
        packages: [
          { name: '@tuwaio/orbit-core', layer: 'L1' },
          { name: '@tuwaio/orbit-evm', layer: 'L2' },
          { name: '@tuwaio/orbit-solana', layer: 'L2' },
        ],
      },
    ],
  },
  {
    label: 'Stage 2 — State & Connection',
    subtitle: 'Transaction tracking & wallet connectivity',
    accentClass: 'text-[#0052ff] dark:text-blue-400',
    dotGradient: 'from-[#0052ff] to-amber-500 dark:from-blue-500 dark:to-amber-400',
    entries: [
      {
        id: 'satellite',
        name: 'Satellite Connect',
        tagline: 'Headless wallet connection store for EVM & Solana',
        gradientFrom: 'from-[#0052ff] dark:from-blue-500',
        gradientTo: 'to-sky-600 dark:to-sky-400',
        docsUrl: 'https://satellite.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/satellite-connect',
        packages: [
          { name: '@tuwaio/satellite-core', layer: 'L3' },
          { name: '@tuwaio/satellite-evm', layer: 'L4' },
          { name: '@tuwaio/satellite-solana', layer: 'L4' },
          { name: '@tuwaio/satellite-react', layer: 'L4' },
          { name: '@tuwaio/satellite-siwe-next-auth', layer: 'L4', isDeprecated: true },
        ],
      },
      {
        id: 'pulsar',
        name: 'Pulsar',
        tagline: 'Transaction tracking that survives reloads',
        gradientFrom: 'from-amber-500 dark:from-amber-400',
        gradientTo: 'to-orange-600 dark:to-orange-500',
        docsUrl: 'https://pulsar.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/pulsar-core',
        packages: [
          { name: '@tuwaio/pulsar-core', layer: 'L3' },
          { name: '@tuwaio/pulsar-evm', layer: 'L4' },
          { name: '@tuwaio/pulsar-solana', layer: 'L4' },
          { name: '@tuwaio/pulsar-react', layer: 'L4' },
        ],
      },
    ],
  },
  {
    label: 'Stage 3 — Backend & Sync',
    subtitle: 'Managed cloud or self-hosted Quasar engine',
    accentClass: 'text-blue-700 dark:text-sky-400',
    dotGradient: 'from-[#0052ff] to-sky-600 dark:from-blue-500 dark:to-sky-400',
    entries: [
      {
        id: 'quasar',
        name: 'Quasar Cloud',
        tagline: 'Managed cloud · Transaction indexing & sync',
        gradientFrom: 'from-[#0052ff] dark:from-blue-500',
        gradientTo: 'to-blue-800 dark:to-sky-300',
        docsUrl: '/quasar',
        githubUrl: 'https://github.com/TuwaIO/quasar-client',
        packages: [
          { name: '@tuwaio/quasar-sdk', layer: 'L5' },
          { name: 'Quasar Dashboard', url: QUASAR_DASHBOARD_URL },
        ],
      },
      {
        id: 'quasar-community',
        orb: 'quasar',
        pixelIcon: 'server',
        name: 'Quasar Community',
        tagline: 'Self-hosted engine & admin · Apache-2.0',
        gradientFrom: 'from-teal-600 dark:from-teal-400',
        gradientTo: 'to-blue-700 dark:to-sky-400',
        docsUrl: '/quasar/self-hosting',
        githubUrl: 'https://github.com/TuwaIO/quasar-community',
        packages: [
          { name: 'Self-Hosting Guide', url: '/quasar/self-hosting' },
          { name: 'Live Showcase', url: 'https://github.com/TuwaIO/quasar-community#live-community-showcase' },
        ],
      },
    ],
  },
  {
    label: 'Stage 4 — User Interface',
    subtitle: 'React components for Satellite & Pulsar',
    accentClass: 'text-[#0052ff] dark:text-sky-400',
    dotGradient: 'from-[#0052ff] to-sky-600 dark:from-blue-500 dark:to-sky-400',
    entries: [
      {
        id: 'nova',
        name: 'Nova UI Kit',
        tagline: 'Design system & component library',
        gradientFrom: 'from-[#0052ff] dark:from-blue-500',
        gradientTo: 'to-sky-600 dark:to-sky-300',
        docsUrl: 'https://stories.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/nova-uikit',
        packages: [
          { name: '@tuwaio/nova-core', layer: 'L6' },
          { name: '@tuwaio/nova-icons', layer: 'L6' },
          { name: '@tuwaio/nova-connect', layer: 'L7' },
          { name: '@tuwaio/nova-transactions', layer: 'L7' },
        ],
      },
    ],
  },
  {
    label: 'Stage 5 — SDK Integration Layer',
    subtitle: 'Core SDK & network-specific adapters',
    accentClass: 'text-blue-700 dark:text-blue-400',
    dotGradient: 'from-blue-700 to-[#0052ff] dark:from-blue-500 dark:to-sky-300',
    entries: [
      {
        id: 'sdk',
        name: 'TUWA SDK',
        tagline: 'Unified client SDK & EVM/Solana network adapters',
        gradientFrom: 'from-blue-700 dark:from-blue-500',
        gradientTo: 'to-[#0052ff] dark:to-sky-300',
        docsUrl: 'https://sdk.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/sdk',
        packages: [
          { name: '@tuwaio/sdk', layer: 'L8' },
          { name: '@tuwaio/create-cosmos-playground', layer: 'L8' },
          { name: '@tuwaio/evm-sdk', layer: 'L9' },
          { name: '@tuwaio/solana-sdk', layer: 'L9' },
        ],
      },
    ],
  },
];

/**
 * The layer badge (`L4`) of each npm package listed on the main page.
 */
export const packageLayers: ReadonlyMap<string, string | undefined> = new Map(
  layers.flatMap((layer) =>
    layer.entries.flatMap((entry) => (entry.packages ?? []).map((pkg) => [pkg.name, pkg.layer] as const)),
  ),
);

/**
 * A project of the main page with the number of its stage (from 1) and its pixel icon.
 */
export type StagedEntry = DocEntry & { stage: number; icon: ProjectIcon };

/**
 * The projects of the main page in the order of the stages, each with its stage and its icon.
 *
 * @returns The projects.
 */
export function stagedEntries(): StagedEntry[] {
  return layers.flatMap((layer, index) =>
    layer.entries.map((entry) => ({
      ...entry,
      stage: index + 1,
      icon: entry.pixelIcon ?? projectIcons[entry.orb ?? (entry.id as PackageType)],
    })),
  );
}

/**
 * The size of the ecosystem, counted from the data so the hero never states an old number: the npm packages that are
 * not deprecated (link rows are not packages), the products and the stages.
 *
 * @returns The three counts.
 */
export function ecosystemCounts(): { packages: number; products: number; stages: number } {
  const entries = layers.flatMap((layer) => layer.entries);
  return {
    packages: entries
      .flatMap((entry) => entry.packages ?? [])
      .filter((pkg) => pkg.name.startsWith('@tuwaio/') && !pkg.isDeprecated).length,
    products: entries.length,
    stages: layers.length,
  };
}

/**
 * The cell of a project on the board of the architecture: its stage row (from 1), the first of the three lanes it
 * takes (from 1) and how many lanes it spans (default 1).
 */
export interface BoardPlace {
  row: number;
  lane: number;
  span?: number;
}

/**
 * Where each project sits on the board of the architecture, by project id: under the projects it builds on, so the
 * traces between them run short and straight.
 */
export const boardPlaces: Readonly<Record<string, BoardPlace>> = {
  siwx: { row: 1, lane: 1 },
  orbit: { row: 1, lane: 3 },
  satellite: { row: 2, lane: 1 },
  pulsar: { row: 2, lane: 3 },
  'quasar-community': { row: 3, lane: 2 },
  quasar: { row: 3, lane: 3 },
  nova: { row: 4, lane: 2 },
  sdk: { row: 5, lane: 1, span: 3 },
};

/**
 * An edge of the board of the architecture, by project ids: `to` builds on `from` and cannot work without it; with the
 * kind `optional`, the two work together and each works without the other (a solid line and a dotted one on the board);
 * with the kind `or`, the two are two ways to run the same thing (Quasar self-hosted or in the cloud).
 */
export interface BoardEdge {
  from: string;
  to: string;
  kind?: 'optional' | 'or';
}

/**
 * What builds on what, top to bottom: the traces of the board and the list that reads them out. Taken from the
 * dependencies of the packages: SIWX, Satellite, Pulsar and Nova import Orbit; Nova imports Satellite and Pulsar; the SDK
 * imports Nova. A sign-in with SIWX is optional to Satellite and Nova, and Pulsar syncs with Quasar only when an app
 * gives it a backend.
 */
export const boardEdges: readonly BoardEdge[] = [
  { from: 'orbit', to: 'siwx' },
  { from: 'siwx', to: 'satellite', kind: 'optional' },
  { from: 'orbit', to: 'satellite' },
  { from: 'orbit', to: 'pulsar' },
  { from: 'pulsar', to: 'quasar', kind: 'optional' },
  { from: 'satellite', to: 'nova' },
  { from: 'pulsar', to: 'nova' },
  { from: 'orbit', to: 'nova' },
  { from: 'siwx', to: 'nova', kind: 'optional' },
  { from: 'nova', to: 'sdk' },
  { from: 'quasar-community', to: 'quasar', kind: 'or' },
];

/** The projects whose packages the TUWA SDK re-exports, by id, in the order of its marks on the board. */
export const sdkReExports: readonly string[] = ['orbit', 'siwx', 'satellite', 'pulsar', 'nova'];

/** The range of the layers (`L1–L2`, `L5`) of npm packages, or an empty string without any. */
function layerRange(packages: PackageBadge[]): string {
  const numbers = [...new Set(packages.flatMap((pkg) => (pkg.layer ? [Number(pkg.layer.slice(1))] : [])))].sort(
    (a, b) => a - b,
  );
  if (numbers.length === 0) return '';
  return numbers.length === 1 ? `L${numbers[0]}` : `L${numbers[0]}–L${numbers[numbers.length - 1]}`;
}

/**
 * The layers a stage spans, from the layers of its packages.
 *
 * @param stage - The stage, from 1.
 * @returns The range, such as `L1–L2` or `L5`; empty for a stage without packages.
 */
export function stageLayerRange(stage: number): string {
  return layerRange((layers[stage - 1]?.entries ?? []).flatMap((entry) => entry.packages ?? []));
}

/**
 * The layers of the packages of a project.
 *
 * @param id - The id of the project.
 * @returns The range, such as `L1–L2` or `L5`; empty for a project without npm packages (Quasar Community).
 */
export function entryLayerRange(id: string): string {
  const entry = layers.flatMap((layer) => layer.entries).find((candidate) => candidate.id === id);
  return layerRange(entry?.packages ?? []);
}
