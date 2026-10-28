#!/usr/bin/env node
// `tuwa-docs-i18n-check`: checks the translated pages of a TUWA documentation site (src/i18n/<locale>) against their
// English pages (src/content), run from the docs app (see README)
import { checkSiteTranslations } from '../dist/translationCheck.js';

checkSiteTranslations().then(
  ({ files, issues }) => {
    for (const { file, message } of issues) console.error(`${file}: ${message}`);
    if (issues.length > 0) {
      console.error(`Translations: ${issues.length} problem(s) in ${files} translated page(s)`);
      process.exit(1);
    }
    console.log(`Translations: ${files} translated page(s) match their English pages`);
  },
  (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  },
);
