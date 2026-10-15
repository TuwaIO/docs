import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildSearchIndex, findPrerenderedPages } from '../../../../packages/docs-ui/src/searchIndex';

// Next 16.4 builds on Vercel with its adapter, which keeps prerendered pages in `.next/server/route-cache/<kind>/
// <hash of the route>/$/<path>.html` instead of `.next/server/app/<path>.html`; `pagefind --site .next/server/app` found
// no pages and failed the deploys. The documentation sites index both layouts with the URLs Pagefind gave them before.
const page = (title: string) =>
  `<html lang="en"><body><main data-pagefind-body><h1>${title}</h1><p>About ${title}.</p></main></body></html>`;

let root: string;
let server: string;
const write = (path: string, content: string) => {
  mkdirSync(dirname(join(server, path)), { recursive: true });
  writeFileSync(join(server, path), content);
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'docs-search-'));
  server = join(root, '.next/server');
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('search index of the documentation sites', () => {
  it('finds the pages that a build with an adapter keeps in the route cache', () => {
    write('route-cache/APP_PAGE/aaa/$/index.html', page('Home'));
    write('route-cache/APP_PAGE/aaa/$/packages/orbit-core.html', page('Orbit'));
    write('route-cache/APP_PAGE/aaa/$/packages/orbit-core.rsc', 'rsc');
    write('route-cache/APP_PAGE/bbb/$/_not-found.html', page('Not found'));
    write('route-cache/APP_ROUTE/ccc/$/llms.txt.body', 'text');

    expect(findPrerenderedPages(server).map((p) => p.sourcePath)).toEqual([
      '_not-found.html',
      'index.html',
      'packages/orbit-core.html',
    ]);
  });

  it('finds the pages of a build without an adapter in server/app', () => {
    write('app/index.html', page('Home'));
    write('app/guides/full-stack-react.html', page('Guide'));
    write('app/guides/full-stack-react.meta', '{}');

    expect(findPrerenderedPages(server).map((p) => p.sourcePath)).toEqual([
      'guides/full-stack-react.html',
      'index.html',
    ]);
  });

  it('writes a Pagefind index with the URLs of the pages', async () => {
    write('route-cache/APP_PAGE/aaa/$/index.html', page('Home'));
    write('route-cache/APP_PAGE/aaa/$/packages/orbit-core.html', page('Orbit'));
    const outputPath = join(root, 'public/_pagefind');

    const { urls } = await buildSearchIndex({ serverDir: server, outputPath });

    expect(urls).toEqual(['/', '/packages/orbit-core.html']);
    expect(existsSync(join(outputPath, 'pagefind.js'))).toBe(true);
  });

  it('fails when the build has no pages', async () => {
    write('app/_global-error.rsc', 'rsc');

    await expect(buildSearchIndex({ serverDir: server, outputPath: join(root, 'out') })).rejects.toThrow(
      /no prerendered pages/,
    );
  });
});
