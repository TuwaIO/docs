import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// Owner 11-09: the copy and external-link icons of the hub pages are those of our Nova kit (`CopyIcon`, whose sheets
// fold into a check mark, and `ExternalLinkIcon`, whose arrow moves out on hover), not heroicons. The copyable Nova
// files of the playground (components/playground/nova) are code for people to take, and are left alone.
const root = path.resolve(__dirname, '..');
const heroiconsCopyOrLink =
  /import\s*\{[^}]*\b(ArrowTopRightOnSquareIcon|ClipboardDocumentIcon|ClipboardIcon|DocumentDuplicateIcon)\b[^}]*\}\s*from\s*'@heroicons\/react/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return ['nova', 'generated'].includes(entry) ? [] : sourceFiles(file);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [file] : [];
  });
}

describe('the copy and link icons of the hub', () => {
  it('are the icons of Nova, not heroicons', () => {
    const offenders = sourceFiles(root)
      .filter((file) => heroiconsCopyOrLink.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(root, file));
    expect(offenders).toEqual([]);
  });
});
