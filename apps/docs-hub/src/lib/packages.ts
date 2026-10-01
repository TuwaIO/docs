import npmPackages from '../generated/npm-packages.json';
import packageGuides from '../generated/package-guides.json';
import { packageLayers } from './ecosystem';

interface NpmManifest {
  version: string;
  description?: string;
  deprecated?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

/**
 * A dependency of a package, as published on npm.
 */
export interface PackageDependency {
  /** npm name */
  name: string;
  /** Version range */
  range: string;
  /** Whether `peerDependenciesMeta` marks the peer optional (always `false` for regular dependencies) */
  optional: boolean;
}

/**
 * A page of the hub that uses a package.
 */
export interface PackageGuide {
  /** Sidebar title of the page */
  title: string;
  /** Path of the page, for example `/guides/full-stack-react` */
  route: string;
}

/**
 * The details of a TUWA package shown in the package dialog of the main page.
 */
export interface PackageDetails {
  /** npm name, for example `@tuwaio/satellite-react` */
  name: string;
  /** Layer badge as listed on the main page (`L4`) */
  layer?: string;
  /** Latest published version */
  version: string;
  /** Description without its layer prefix (`Layer N (LN) of the TUWA Ecosystem.` or `LN … (TUWA):`) */
  description: string;
  /** Deprecation message of the latest version */
  deprecated?: string;
  /** Reference page of the package (a package site, or the Packages section of the Nova Storybook) */
  docsUrl?: string;
  /** Source folder of the package on GitHub */
  sourceUrl?: string;
  /** Peer dependencies, the TUWA packages first */
  peers: PackageDependency[];
  /** TUWA packages among the regular dependencies (the SDK packages re-export them) */
  includes: PackageDependency[];
  /** SDK packages that list this one as a regular dependency, so apps on the SDK do not install it */
  includedIn: string[];
  /** TUWA packages that list this one as a peer or a dependency */
  usedBy: string[];
  /** Pages of the hub that mention the package, most mentions first (at most three) */
  guides: PackageGuide[];
  /**
   * What to install: `packages` is the package and the required peers it needs (see `getInstallPackages`),
   * `frameworkPeers` the required `react` and `react-dom`, which the app already has and the command leaves out.
   */
  install: { packages: string[]; frameworkPeers: PackageDependency[] };
}

// The site of the reference and the repository of each project, by the prefix of the package name
const projects: { prefix: string; reference?: (short: string) => string; repo: string }[] = [
  { prefix: 'orbit-', reference: (short) => `https://orbit.docs.tuwa.io/packages/${short}`, repo: 'orbit' },
  { prefix: 'siwx-', reference: (short) => `https://siwx.docs.tuwa.io/packages/${short}`, repo: 'siwx' },
  {
    prefix: 'satellite-',
    reference: (short) => `https://satellite.docs.tuwa.io/packages/${short}`,
    repo: 'satellite-connect',
  },
  { prefix: 'pulsar-', reference: (short) => `https://pulsar.docs.tuwa.io/packages/${short}`, repo: 'pulsar-core' },
  {
    prefix: 'nova-',
    reference: (short) => `https://stories.tuwa.io/?path=/docs/packages-${short}-overview--docs`,
    repo: 'nova-uikit',
  },
  { prefix: '', reference: (short) => `https://sdk.docs.tuwa.io/packages/${short}`, repo: 'sdk' },
];

// npm descriptions start with the layer in one of two forms; the page shows the layer separately
const LAYER_PREFIXES = [/^Layer \d+ \(L\d+\) of the TUWA Ecosystem\.\s*/, /^L\d+ [^:]+ \(TUWA\):\s*/];

// Required peers that every React app already has; the install command leaves them out
const FRAMEWORK_PEERS = new Set(['react', 'react-dom']);

function describe(description: string | undefined): string {
  const text = LAYER_PREFIXES.reduce((value, prefix) => value.replace(prefix, ''), description ?? '');
  // A sentence starts with a capital, but an identifier keeps its case (`useSiwx and useSiwxSession hooks…`)
  return /^[a-z]+[A-Z]/.test(text) ? text : text.charAt(0).toUpperCase() + text.slice(1);
}

const isTuwa = (name: string) => name.startsWith('@tuwaio/');

const byTuwaFirst = (a: string, b: string) => Number(isTuwa(b)) - Number(isTuwa(a)) || a.localeCompare(b);

function requiredPeers(manifest: NpmManifest): [string, string][] {
  const meta = manifest.peerDependenciesMeta ?? {};
  return Object.entries(manifest.peerDependencies ?? {}).filter(([peer]) => meta[peer]?.optional !== true);
}

/**
 * Turns a peer range into an install argument that needs no quoting in a shell: `5.x.x` → `zustand@5`, `1.1.x` →
 * `@wallet-standard/base@1.1`, `^0.7.2` and `0.4.0` stay, `>=0.3` → the bare name (the latest version satisfies it).
 * Of `A || B`, the last alternative is used.
 */
function installSpec(name: string, range: string): string {
  const alternative = range.split('||').at(-1)!.trim();
  const major = /^(\d+)(?:\.x){0,2}$/.exec(alternative);
  if (major) return `${name}@${major[1]}`;
  const minor = /^(\d+\.\d+)\.x$/.exec(alternative);
  if (minor) return `${name}@${minor[1]}`;
  if (/^[\^~]?\d+\.\d+\.\d+$/.test(alternative)) return `${name}@${alternative}`;
  return name;
}

/**
 * The install arguments of a package: the package, its required peers and, for TUWA peers, their required peers in
 * turn (an app must provide the peers of its peers). Packages that an installed package brings as a regular
 * dependency (the SDK brings the TUWA projects and their libraries) are left out, so the result matches the guides,
 * e.g. `@tuwaio/evm-sdk @tuwaio/sdk@^0.2.1 @wagmi/core@3 viem@2`. `react` and `react-dom` are left out too.
 *
 * @param name - npm name of the package.
 * @param manifests - npm manifests of the TUWA packages by name.
 * @returns The arguments (the package first, then TUWA packages, then the others) and the framework peers left out.
 */
function getInstallPackages(name: string, manifests: Record<string, NpmManifest>): PackageDetails['install'] {
  const specs = new Map<string, string>([[name, name]]);
  const frameworkPeers = new Map<string, string>();
  const provided = new Set<string>();
  const queue = [name];

  for (let current = queue.shift(); current; current = queue.shift()) {
    const manifest = manifests[current];
    if (!manifest) continue;
    for (const dependency of Object.keys(manifest.dependencies ?? {})) provided.add(dependency);
    for (const [peer, range] of requiredPeers(manifest)) {
      if (FRAMEWORK_PEERS.has(peer)) {
        if (!frameworkPeers.has(peer)) frameworkPeers.set(peer, range);
      } else if (!specs.has(peer)) {
        specs.set(peer, installSpec(peer, range));
        queue.push(peer);
      } else if (specs.get(peer) === peer) {
        // Another package asks for `>=` only: keep the version of the stricter range (`immer@11` over `immer`)
        specs.set(peer, installSpec(peer, range));
      }
    }
  }

  return {
    packages: [
      name,
      ...[...specs.keys()]
        .filter((spec) => spec !== name && !provided.has(spec))
        .sort(byTuwaFirst)
        .map((spec) => specs.get(spec)!),
    ],
    frameworkPeers: [...frameworkPeers].map(([peer, range]) => ({ name: peer, range, optional: false })),
  };
}

/**
 * The details of the TUWA packages listed on the main page, built from the files that `scripts/build-data.mjs`
 * saves to `src/generated/` before `next dev` and `next build`: the npm manifests and the hub pages that mention each
 * package. The page makes no requests: the data is as fresh as the last build.
 *
 * Deprecated packages get no reference or source link (their code and pages were removed).
 *
 * @returns The details by npm name; a package missing from the saved data (registry outage) is missing here too.
 */
export function getPackageDetails(): Record<string, PackageDetails> {
  const manifests = (npmPackages as { packages: Record<string, NpmManifest> }).packages;
  const guides = (packageGuides as { guides: Record<string, PackageGuide[]> }).guides;
  const details: Record<string, PackageDetails> = {};

  for (const [name, manifest] of Object.entries(manifests)) {
    const short = name.replace('@tuwaio/', '');
    const project = projects.find(({ prefix }) => short.startsWith(prefix))!;
    const meta = manifest.peerDependenciesMeta ?? {};
    const peers = Object.entries(manifest.peerDependencies ?? {})
      .map(([peer, range]) => ({ name: peer, range, optional: meta[peer]?.optional === true }))
      .sort((a, b) => byTuwaFirst(a.name, b.name));

    details[name] = {
      name,
      layer: packageLayers.get(name),
      version: manifest.version,
      description: describe(manifest.description),
      deprecated: manifest.deprecated,
      docsUrl: manifest.deprecated ? undefined : project.reference?.(short),
      sourceUrl: manifest.deprecated
        ? undefined
        : `https://github.com/TuwaIO/${project.repo}/tree/main/packages/${short}`,
      peers,
      includes: Object.entries(manifest.dependencies ?? {})
        .filter(([dependency]) => isTuwa(dependency))
        .map(([dependency, range]) => ({ name: dependency, range, optional: false }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      includedIn: [],
      usedBy: [],
      guides: manifest.deprecated ? [] : (guides[name] ?? []),
      install: getInstallPackages(name, manifests),
    };
  }

  for (const [name, manifest] of Object.entries(manifests)) {
    for (const dependency of Object.keys(manifest.dependencies ?? {})) details[dependency]?.includedIn.push(name);
    for (const dependency of new Set([
      ...Object.keys(manifest.peerDependencies ?? {}),
      ...Object.keys(manifest.dependencies ?? {}),
    ])) {
      details[dependency]?.usedBy.push(name);
    }
  }
  for (const entry of Object.values(details)) {
    entry.includedIn.sort();
    entry.usedBy.sort();
  }

  return details;
}
