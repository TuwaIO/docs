/**
 * Puts the fonts of Nova Core next to `dist/index.css`, which inlines its stylesheet. Tailwind writes their `url()` as paths of
 * this package's build, and a site that imports the file would fail to build on them.
 */
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const stylesheet = createRequire(import.meta.url).resolve('@tuwaio/nova-core/dist/index.css');

cpSync(join(dirname(stylesheet), 'fonts'), join(dist, 'fonts'), { recursive: true });

const file = join(dist, 'index.css');
let moved = 0;
const css = readFileSync(file, 'utf8').replace(
  /url\((['"]?)[^)'"]*\/fonts\/([\w.-]+\.woff2)\1\)/g,
  (_, _quote, name) => {
    moved += 1;
    return `url(./fonts/${name})`;
  },
);
if (moved === 0)
  throw new Error('[docs-ui] dist/index.css names no fonts of Nova Core: read how its stylesheet names them now');
writeFileSync(file, css);
