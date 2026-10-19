import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import * as helpers from '@tuwaio/nova-core/utils';
import { describe, expect, it } from 'vitest';

// Code that needs only helpers of @tuwaio/nova-core (`cn`, `deepMerge`, `textCenterEllipsis`…) imports them from the
// light entry (`@tuwaio/nova-core/utils`, or `@tuwaio/sdk/nova-core/utils` through the SDK), which loads no component
// and no icon. The main entry is for files that also use its components or hooks. The code that the playground
// generates follows the same rule, so the hub, @tuwaio/docs-ui and the snippets people copy are checked together.
const roots = [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../../../packages/docs-ui/src')];
const helperNames = new Set(Object.keys(helpers));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return entry === 'generated' ? [] : sourceFiles(file);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [file] : [];
  });
}

describe('imports of @tuwaio/nova-core', () => {
  it('take the helpers from the utils entry when a file needs nothing else from the package', () => {
    const offenders = roots
      .flatMap(sourceFiles)
      .filter((file) =>
        [...readFileSync(file, 'utf8').matchAll(/import\s*\{([^}]*)\}\s*from\s*'@tuwaio\/(?:sdk\/)?nova-core'/g)].some(
          ([, names]) =>
            names
              .split(',')
              .map((name) => name.trim().split(/\s+as\s+/)[0])
              .filter(Boolean)
              .every((name) => helperNames.has(name)),
        ),
      )
      .map((file) => path.relative(path.resolve(__dirname, '../../../..'), file));

    expect(offenders).toEqual([]);
  });
});
