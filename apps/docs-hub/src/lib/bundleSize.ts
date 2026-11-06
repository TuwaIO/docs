// Bundle size of the TUWA packages: what `scripts/build-data.mjs` measures and what the main page and the comparisons
// page show. The script imports this file too (Node runs TypeScript), so it has no imports and no TypeScript-only
// runtime syntax.

/** The own code of one package (see `entryPoints`), as `scripts/build-data.mjs` measured it. */
export interface PackageSize {
  /** The version that was measured, the latest on npm at build time */
  version: string;
  /** Bytes after minification, of what loads with the import (dynamic imports left out) */
  minified: number;
  /** Bytes after minification and gzip, of what loads with the import (each file gzipped on its own) */
  gzip: number;
  /** Gzip bytes of the code the package loads later through dynamic imports (images, rare screens) */
  lazyGzip?: number;
}

export interface BundleSizes {
  /** YYYY-MM-DD of the measurement */
  measuredAt?: string;
  packages: Record<string, PackageSize>;
}

type ExportTarget = string | null | undefined | { [condition: string]: ExportTarget };

const isTypes = (path: string) => /\.d\.[cm]?ts$/.test(path);

/** The file a bundler takes for an export target: the ESM build, never the types. */
function pickTarget(target: ExportTarget): string | undefined {
  if (typeof target === 'string') return isTypes(target) ? undefined : target;
  if (!target || typeof target !== 'object') return undefined;
  for (const condition of ['import', 'module', 'browser', 'default']) {
    const found = pickTarget(target[condition]);
    if (found) return found;
  }
  return undefined;
}

/**
 * The main entry of a published package, as a browser bundler resolves `import '<name>'`.
 * @param manifest - The package.json of the published version.
 * @returns A path relative to the package root.
 */
export function mainEntry(manifest: { exports?: ExportTarget; module?: string; main?: string }): string {
  const { exports } = manifest;
  let root: ExportTarget;
  if (typeof exports === 'string') root = exports;
  else if (exports && typeof exports === 'object') {
    const subpaths = Object.keys(exports).some((key) => key.startsWith('.'));
    root = subpaths ? exports['.'] : exports;
  }
  return pickTarget(root) ?? manifest.module ?? manifest.main ?? './index.js';
}

/**
 * What the measurement bundles: the main entry, or, for a package without one (the SDK packages, which only re-export
 * other packages under subpaths), every JavaScript subpath.
 */
export function entryPoints(manifest: { exports?: ExportTarget; module?: string; main?: string }): string[] {
  const { exports } = manifest;
  if (
    exports &&
    typeof exports === 'object' &&
    !('.' in exports) &&
    Object.keys(exports).some((key) => key.startsWith('.'))
  ) {
    const files = Object.entries(exports)
      .filter(([subpath]) => subpath !== './package.json')
      .map(([, target]) => pickTarget(target))
      .filter((file): file is string => !!file && /\.[cm]?js$/.test(file));
    if (files.length > 0) return [...new Set(files)];
  }
  return [mainEntry(manifest)];
}

/**
 * The output files that load together with the entry: the entry and everything it reaches through static imports.
 * Dynamic imports load later, on demand, and imports of other packages are not outputs.
 * @param outputs - The `outputs` of an esbuild metafile.
 * @returns Output paths, sorted.
 */
export function staticClosure(
  outputs: Record<string, { imports: { path: string; kind: string }[] }>,
  entry: string,
): string[] {
  const seen = new Set<string>([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    for (const { path, kind } of outputs[queue.shift()!]?.imports ?? []) {
      if (kind === 'import-statement' && path in outputs && !seen.has(path)) {
        seen.add(path);
        queue.push(path);
      }
    }
  }
  return [...seen].sort();
}

/** The registry tarball of a published version. */
export function tarballUrl(name: string, version: string): string {
  return `https://registry.npmjs.org/${name}/-/${name.split('/').pop()}-${version}.tgz`;
}

/** Bytes as kilobytes with one decimal (1 kB = 1024 bytes). */
export function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

/**
 * The gzip size of a set of packages: the sum of their main entries.
 * @returns `complete: false` when a package of the set was not measured (registry outage).
 */
export function setSize(packages: string[], sizes: Record<string, PackageSize>): { gzip: number; complete: boolean } {
  let gzip = 0;
  let complete = true;
  for (const name of packages) {
    const size = sizes[name];
    if (size) gzip += size.gzip;
    else complete = false;
  }
  return { gzip, complete };
}

/** Typical installs, as the comparisons page lists them; the labels are in the locales (`comparisons.bundle.sets`). */
export const BUNDLE_SETS: { id: string; packages: string[] }[] = [
  {
    id: 'pulsarEvm',
    packages: ['@tuwaio/orbit-core', '@tuwaio/orbit-evm', '@tuwaio/pulsar-core', '@tuwaio/pulsar-evm'],
  },
  {
    id: 'pulsarSolana',
    packages: ['@tuwaio/orbit-core', '@tuwaio/orbit-solana', '@tuwaio/pulsar-core', '@tuwaio/pulsar-solana'],
  },
  {
    id: 'siwxEvm',
    packages: ['@tuwaio/orbit-core', '@tuwaio/siwx-core', '@tuwaio/siwx-evm', '@tuwaio/siwx-react'],
  },
  {
    id: 'siwxSolana',
    packages: [
      '@tuwaio/orbit-core',
      '@tuwaio/orbit-solana',
      '@tuwaio/siwx-core',
      '@tuwaio/siwx-solana',
      '@tuwaio/siwx-react',
    ],
  },
  {
    id: 'connect',
    packages: [
      '@tuwaio/orbit-core',
      '@tuwaio/orbit-evm',
      '@tuwaio/orbit-solana',
      '@tuwaio/satellite-core',
      '@tuwaio/satellite-evm',
      '@tuwaio/satellite-solana',
      '@tuwaio/satellite-react',
    ],
  },
  {
    id: 'sdkWithNova',
    packages: [
      '@tuwaio/sdk',
      '@tuwaio/evm-sdk',
      '@tuwaio/solana-sdk',
      '@tuwaio/orbit-core',
      '@tuwaio/orbit-evm',
      '@tuwaio/orbit-solana',
      '@tuwaio/satellite-core',
      '@tuwaio/satellite-evm',
      '@tuwaio/satellite-solana',
      '@tuwaio/satellite-react',
      '@tuwaio/pulsar-core',
      '@tuwaio/pulsar-evm',
      '@tuwaio/pulsar-solana',
      '@tuwaio/pulsar-react',
      '@tuwaio/siwx-core',
      '@tuwaio/siwx-evm',
      '@tuwaio/siwx-solana',
      '@tuwaio/siwx-react',
      '@tuwaio/nova-core',
      '@tuwaio/nova-transactions',
      '@tuwaio/nova-connect',
    ],
  },
];
