// Saves the data of the main page and of llms.txt to src/generated/ before `next dev` and `next build`, so the pages
// make no requests and the data is as fresh as the last deployment:
// - npm-packages.json: the latest npm manifests of the @tuwaio packages listed in src/lib/ecosystem.ts;
// - package-readmes.json: the README of each of these versions (from jsDelivr), for llms-full.txt;
// - releases.json: the latest vX.Y.Z tag of the repositories in RELEASES (git ls-remote, no GitHub API limit);
// - package-guides.json: the hub pages that mention each package, most mentions first.
// A step that fails keeps its last saved file (or saves an empty one), so an outage never fails the build.
import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const GENERATED = new URL('../src/generated/', import.meta.url);
const ECOSYSTEM = new URL('../src/lib/ecosystem.ts', import.meta.url);
const CONTENT = new URL('../src/content/', import.meta.url);
const FIELDS = ['version', 'description', 'deprecated', 'dependencies', 'peerDependencies', 'peerDependenciesMeta'];

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
]);
