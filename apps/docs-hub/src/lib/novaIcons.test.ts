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

// The icons of the hub and of docs-ui are the pixel icons of Nova (`@tuwaio/nova-icons`, in the hub through
// `@tuwaio/sdk/nova-icons`), which have the names and the props of heroicons. Heroicons stay only where they are listed
// here, with the reason: nowhere now. (The Playground may hand Nova its classic icons through
// `@tuwaio/sdk/nova-core/heroicons`, which is an import of the SDK, not of heroicons)
const heroiconsAllowed: { file: RegExp; why: string }[] = [];
const repo = path.resolve(root, '../../..');

function allSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return entry === 'generated' ? [] : allSourceFiles(file);
    return /\.(tsx?|mdx)$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [file] : [];
  });
}

describe('heroicons', () => {
  it('are imported nowhere in the hub and in docs-ui but where the list allows', () => {
    const files = [...allSourceFiles(root), ...allSourceFiles(path.join(repo, 'packages/docs-ui/src'))];
    expect(files.length).toBeGreaterThan(100);
    const offenders = files
      // An import, not a mention in the code examples of a guide
      .filter((file) => /^import\s[^;]*from\s*'@heroicons\/react/m.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(repo, file))
      .filter((file) => !heroiconsAllowed.some((allowed) => allowed.file.test(file)));
    expect(offenders).toEqual([]);
  });

  // The guard itself: every entry of the list still allows something
  it('have no stale entry in the list', () => {
    const files = allSourceFiles(root).map((file) => path.relative(repo, file));
    for (const allowed of heroiconsAllowed)
      expect(
        files.some(
          (file) =>
            allowed.file.test(file) && /from\s*'@heroicons\/react/.test(readFileSync(path.join(repo, file), 'utf8')),
        ),
        allowed.why,
      ).toBe(true);
  });

  it('are not a dependency of docs-ui, which imports none', () => {
    const manifest = JSON.parse(readFileSync(path.join(repo, 'packages/docs-ui/package.json'), 'utf8')) as Record<
      string,
      Record<string, string> | undefined
    >;
    for (const group of ['dependencies', 'peerDependencies', 'devDependencies'])
      expect(Object.keys(manifest[group] ?? {})).not.toContain('@heroicons/react');
  });
});
