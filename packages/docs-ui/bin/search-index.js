#!/usr/bin/env node
// `tuwa-docs-search-index`: the postbuild step of the TUWA documentation sites, after `next build` (see README)
import { buildSearchIndex } from '../dist/searchIndex.js';

const flag = process.argv.indexOf('--force-language');
const forceLanguage = flag === -1 ? undefined : process.argv[flag + 1];

buildSearchIndex({ forceLanguage }).then(
  ({ urls }) => console.log(`Pagefind: indexed ${urls.length} pages into public/_pagefind`),
  (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  },
);
