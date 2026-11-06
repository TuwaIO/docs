// Saves the data of the main page, of llms.txt and of the Playground to src/generated/ before `next dev` and
// `next build`, so the pages make no requests and the data is as fresh as the last deployment:
// - npm-packages.json: the latest npm manifests of the @tuwaio packages listed in src/lib/ecosystem.ts;
// - package-readmes.json: the README of each of these versions (from jsDelivr), for llms-full.txt;
// - releases.json: the latest vX.Y.Z tag of the repositories in RELEASES (git ls-remote, no GitHub API limit);
// - package-guides.json: the hub pages that mention each package, most mentions first;
// - playground-sources.json: the Nova customization files of the Playground (components/playground/nova), shown by
//   its Code tab as they run on the stage;
// - bundle-sizes.json: the own code of each package (its main entry, or all subpaths of an SDK package), minified and
//   gzipped, measured from its latest npm tarball with every dependency left out (the badges of the main page and the
//   table of the comparisons page).
// A step that fails keeps its last saved file (or saves an empty one), so an outage never fails the build.
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { gzipSync } from 'node:zlib';

import { entryPoints, staticClosure, tarballUrl } from '../src/lib/bundleSize.ts';

const GENERATED = new URL('../src/generated/', import.meta.url);
const ECOSYSTEM = new URL('../src/lib/ecosystem.ts', import.meta.url);
const CONTENT = new URL('../src/content/', import.meta.url);
const PLAYGROUND_NOVA = new URL('../src/components/playground/nova/', import.meta.url);
const FIELDS = [
  'version',
  'description',
  'license',
  'deprecated',
  'dependencies',
  'peerDependencies',
  'peerDependenciesMeta',
];

// Entry id in src/lib/ecosystem.ts → GitHub repository whose latest tag the card shows
const RELEASES = { 'quasar-community': 'TuwaIO/quasar-community' };

// Sections of src/content scanned for package mentions; their overview pages list every project, so they are skipped
const GUIDE_SECTIONS = ['guides', 'quasar'];
const SKIPPED_PAGES = new Set(['/guides']);
const GUIDES_PER_PACKAGE = 3;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function packageNames() {
  const source = await readFile(ECOSYSTEM, 'utf8');
  return [...new Set([...source.matchAll(/name: '(@tuwaio\/[a-z0-9-]+)'/g)].map((match) => match[1]))].sort();
}

async function fetchManifests(names) {
  const manifests = await Promise.all(
    names.map((name) => getJson(`https://registry.npmjs.org/${name}/latest`).catch(() => null)),
  );
  const packages = {};
  names.forEach((name, index) => {
    const manifest = manifests[index];
    if (manifest) {
      packages[name] = Object.fromEntries(FIELDS.filter((field) => field in manifest).map((f) => [f, manifest[f]]));
    }
  });
  if (Object.keys(packages).length === 0) throw new Error('the registry returned no manifests');
  return { packages };
}

async function fetchReadmes(packages) {
  const entries = await Promise.all(
    Object.entries(packages).map(async ([name, { version }]) => {
      const readme = await getText(`https://cdn.jsdelivr.net/npm/${name}@${version}/README.md`).catch(() => null);
      return readme && [name, readme];
    }),
  );
  const readmes = Object.fromEntries(entries.filter(Boolean));
  if (Object.keys(readmes).length === 0) throw new Error('jsDelivr returned no READMEs');
  return { readmes };
}

async function fetchLatestTag(repo) {
  // Tags are compared numerically: a lexical order puts v0.0.10 before v0.0.9
  const { stdout } = await promisify(execFile)('git', [
    'ls-remote',
    '--tags',
    '--refs',
    `https://github.com/${repo}.git`,
  ]);
  const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  let latest = null;
  for (const match of stdout.matchAll(/refs\/tags\/(v(\d+)\.(\d+)\.(\d+))$/gm)) {
    const version = match.slice(2, 5).map(Number);
    if (!latest || compare(version, latest.version) > 0) latest = { tag: match[1], version };
  }
  return latest && { tag: latest.tag, url: `https://github.com/${repo}/tree/${latest.tag}` };
}

async function fetchReleases() {
  const entries = await Promise.all(
    Object.entries(RELEASES).map(async ([id, repo]) => [id, await fetchLatestTag(repo)]),
  );
  return { releases: Object.fromEntries(entries) };
}

// Sidebar titles from the `'slug': 'Title'` entries of a _meta.tsx file
function metaTitles(source) {
  return Object.fromEntries(
    [...source.matchAll(/^\s*'?([a-z0-9-]+)'?: '([^']+)',?$/gm)].map((match) => [match[1], match[2]]),
  );
}

async function findGuides(names) {
  const guides = Object.fromEntries(names.map((name) => [name, []]));
  for (const section of GUIDE_SECTIONS) {
    const folder = new URL(`${section}/`, CONTENT);
    const titles = metaTitles(await readFile(new URL('_meta.tsx', folder), 'utf8').catch(() => ''));
    for (const file of (await readdir(folder)).filter((f) => f.endsWith('.mdx'))) {
      const slug = file.replace(/\.mdx$/, '');
      const route = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
      if (SKIPPED_PAGES.has(route)) continue;
      const source = await readFile(new URL(file, folder), 'utf8');
      // An overview is titled `Overview` in the sidebar: take the title of the page instead
      const title = (slug !== 'index' && titles[slug]) || /^title: '?(.+?)'?$/m.exec(source)?.[1] || slug;
      for (const name of names) {
        // `@tuwaio/sdk/pulsar` counts for `@tuwaio/sdk`, `@tuwaio/sdk-x` does not
        const count = source.split(new RegExp(`${name.replace('/', '\\/')}(?![a-z0-9-])`)).length - 1;
        if (count > 0) guides[name].push({ title, route, count });
      }
    }
  }
  for (const name of names) {
    guides[name] = guides[name]
      .sort((a, b) => b.count - a.count || a.route.localeCompare(b.route))
      .slice(0, GUIDES_PER_PACKAGE)
      .map(({ title, route }) => ({ title, route }));
  }
  return { guides };
}

// The copyable Nova customization files of the Playground, by file name
async function readPlaygroundSources() {
  const names = (await readdir(PLAYGROUND_NOVA)).filter((name) => /\.tsx?$/.test(name)).sort();
  const files = {};
  for (const name of names) files[name] = await readFile(new URL(name, PLAYGROUND_NOVA), 'utf8');
  return { files };
}

// esbuild comes with tsup, the build tool of packages/docs-ui; the hub does not depend on it directly
function loadEsbuild() {
  const fromDocsUi = createRequire(new URL('../../../packages/docs-ui/package.json', import.meta.url));
  return createRequire(fromDocsUi.resolve('tsup/package.json'))('esbuild');
}

async function measurePackage(esbuild, name, version, dir) {
  const res = await fetch(tarballUrl(name, version));
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for the ${name}@${version} tarball`);
  const archive = join(dir, 'package.tgz');
  await writeFile(archive, Buffer.from(await res.arrayBuffer()));
  await promisify(execFile)('tar', ['-xzf', archive, '-C', dir]);
  const root = join(dir, 'package');
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  // One bundle of all entries (namespace re-exports keep every export), so code they share is counted once; with
  // code splitting, chunks behind dynamic imports stay separate and are counted as loaded later
  const entry = join(root, 'measure-entry.js');
  await writeFile(
    entry,
    entryPoints(manifest)
      .map((file, index) => `export * as e${index} from ${JSON.stringify(file.startsWith('.') ? file : `./${file}`)};`)
      .join('\n'),
  );
  const outdir = join(dir, 'out');
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    splitting: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    // The own code only: dependencies and peers are other packages, the app may already have them
    packages: 'external',
    loader: { '.css': 'empty' },
    outdir,
    metafile: true,
    write: false,
    logLevel: 'silent',
  });
  const files = new Map(
    result.outputFiles.filter((file) => file.path.endsWith('.js')).map((file) => [file.path, file.contents]),
  );
  const outputs = Object.fromEntries(
    Object.entries(result.metafile.outputs).map(([path, output]) => [join(process.cwd(), path), output]),
  );
  const imports = Object.fromEntries(
    Object.entries(outputs).map(([path, output]) => [
      path,
      { imports: output.imports.map((i) => ({ ...i, path: join(process.cwd(), i.path) })) },
    ]),
  );
  const entryOutput = Object.keys(outputs).find((path) => outputs[path].entryPoint);
  if (!entryOutput || !files.has(entryOutput)) throw new Error('esbuild returned no entry file');
  const upfront = new Set(staticClosure(imports, entryOutput));
  let minified = 0;
  let gzip = 0;
  let lazyGzip = 0;
  for (const [path, contents] of files) {
    const zipped = gzipSync(contents).byteLength;
    if (upfront.has(path)) {
      minified += contents.byteLength;
      gzip += zipped;
    } else lazyGzip += zipped;
  }
  return { version, minified, gzip, ...(lazyGzip > 0 ? { lazyGzip } : {}) };
}

async function measureBundleSizes(packages) {
  const esbuild = loadEsbuild();
  const root = await mkdtemp(join(tmpdir(), 'tuwa-bundle-'));
  try {
    const entries = await Promise.all(
      Object.entries(packages).map(async ([name, { version }], index) => {
        const dir = join(root, String(index));
        await mkdir(dir);
        return measurePackage(esbuild, name, version, dir).then(
          (size) => [name, size],
          (error) => {
            console.warn(`build-data: ${name}@${version} not measured (${error.message})`);
            return null;
          },
        );
      }),
    );
    const sizes = Object.fromEntries(entries.filter(Boolean));
    if (Object.keys(sizes).length === 0) throw new Error('no package could be measured');
    return { measuredAt: new Date().toISOString().slice(0, 10), packages: sizes };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function save(file, label, produce, empty) {
  const target = new URL(file, GENERATED);
  try {
    const data = await produce();
    await writeFile(target, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`build-data: ${label} saved to src/generated/${file}`);
    return data;
  } catch (error) {
    const saved = await readFile(target, 'utf8').catch(() => null);
    if (!saved) await writeFile(target, `${JSON.stringify(empty, null, 2)}\n`);
    console.warn(`build-data: ${label} failed (${error.message}); ${saved ? 'kept the saved data' : 'saved none'}`);
    return saved ? JSON.parse(saved) : empty;
  }
}

await mkdir(GENERATED, { recursive: true });
const names = await packageNames();
const { packages } = await save('npm-packages.json', `${names.length} npm manifests`, () => fetchManifests(names), {
  packages: {},
});
await Promise.all([
  save('package-readmes.json', 'READMEs', () => fetchReadmes(packages), { readmes: {} }),
  save('releases.json', 'release tags', fetchReleases, { releases: {} }),
  save('package-guides.json', 'guide mentions', () => findGuides(names), { guides: {} }),
  save('playground-sources.json', 'Playground sources', readPlaygroundSources, { files: {} }),
  save('bundle-sizes.json', 'bundle sizes', () => measureBundleSizes(packages), { packages: {} }),
]);
