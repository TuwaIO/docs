import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

/** A page that `next build` prerendered: its HTML file and the path from which Pagefind derives its URL. */
export type PrerenderedPage = {
  /** The HTML file in `.next/server`. */
  file: string;
  /** The path of the page in the site, such as `packages/orbit-core.html` (URL `/packages/orbit-core.html`). */
  sourcePath: string;
};

type PagefindIndex = {
  addHTMLFile(file: { sourcePath: string; content: string }): Promise<{ errors: string[]; file?: { url: string } }>;
  writeFiles(options: { outputPath: string }): Promise<{ errors: string[] }>;
};
type Pagefind = {
  createIndex(): Promise<{ errors: string[]; index?: PagefindIndex }>;
  close(): Promise<unknown>;
};

const directories = (dir: string) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(dir, entry.name))
    : [];

const htmlFiles = (root: string): PrerenderedPage[] =>
  existsSync(root)
    ? readdirSync(root, { recursive: true, encoding: 'utf8' })
        .filter((path) => path.endsWith('.html'))
        .map((path) => ({ file: join(root, path), sourcePath: path.split(sep).join('/') }))
    : [];

/**
 * Lists the pages that `next build` prerendered as HTML. A build without an adapter keeps them in
 * `<serverDir>/app/<path>.html`; a build with an adapter (Next 16.3.8 and later on Vercel) keeps them in
 * `<serverDir>/route-cache/<kind>/<hash of the route>/$/<path>.html`. Both give the same paths.
 *
 * @param serverDir - The `.next/server` directory of the site.
 * @returns The pages, sorted by path.
 */
export function findPrerenderedPages(serverDir: string): PrerenderedPage[] {
  const roots = [
    join(serverDir, 'app'),
    ...directories(join(serverDir, 'route-cache'))
      .flatMap(directories)
      .map((route) => join(route, '$')),
  ];
  return roots.flatMap(htmlFiles).sort((a, b) => (a.sourcePath < b.sourcePath ? -1 : 1));
}

// `pagefind` exports only an ES module entry, which `require.resolve` cannot find: read it from the package of the site
async function loadPagefind(cwd: string): Promise<Pagefind> {
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    const manifest = join(dir, 'node_modules', 'pagefind', 'package.json');
    if (existsSync(manifest)) {
      const pkg = JSON.parse(readFileSync(manifest, 'utf8')) as {
        main?: string;
        exports?: { '.'?: { import?: string } };
      };
      const entry = pkg.exports?.['.']?.import ?? pkg.main ?? 'lib/index.js';
      return (await import(pathToFileURL(join(dirname(manifest), entry)).href)) as Pagefind;
    }
    if (dirname(dir) === dir) throw new Error('pagefind is not installed: add it to the dependencies of the site');
  }
}

/**
 * Builds the Pagefind index of a documentation site from the pages that `next build` prerendered, in either layout
 * of {@link findPrerenderedPages}, with the URLs `pagefind --site .next/server/app` gave them. Nextra's search loads it
 * from `/_pagefind/pagefind.js`.
 *
 * Side effects: starts the Pagefind binary of the site's `pagefind` package and writes the index to `outputPath`.
 *
 * @param options - Where to read and write, relative to `cwd`.
 * @param options.serverDir - The `.next/server` directory. Default `.next/server`.
 * @param options.outputPath - Where the index is written. Default `public/_pagefind`.
 * @param options.cwd - The directory of the site, where `pagefind` is installed. Default the current directory.
 * @returns The URLs of the indexed pages.
 * @throws When the build has no prerendered pages, or when Pagefind is missing or reports an error.
 */
export async function buildSearchIndex({
  serverDir = '.next/server',
  outputPath = 'public/_pagefind',
  cwd = process.cwd(),
}: { serverDir?: string; outputPath?: string; cwd?: string } = {}): Promise<{ urls: string[] }> {
  const pages = findPrerenderedPages(resolve(cwd, serverDir));
  if (!pages.length) throw new Error(`Found no prerendered pages in ${serverDir}: run next build first`);

  const pagefind = await loadPagefind(cwd);
  try {
    const { index, errors } = await pagefind.createIndex();
    if (!index) throw new Error(`Pagefind: ${errors.join('; ')}`);
    const urls: string[] = [];
    for (const page of pages) {
      const added = await index.addHTMLFile({ sourcePath: page.sourcePath, content: readFileSync(page.file, 'utf8') });
      if (added.errors.length || !added.file)
        throw new Error(`Pagefind, ${page.sourcePath}: ${added.errors.join('; ')}`);
      urls.push(added.file.url);
    }
    const written = await index.writeFiles({ outputPath: resolve(cwd, outputPath) });
    if (written.errors.length) throw new Error(`Pagefind: ${written.errors.join('; ')}`);
    return { urls };
  } finally {
    await pagefind.close();
  }
}
