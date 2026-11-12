import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CommandLine, PackageManagerSwitch } from '../components/CommandLine';
import { I18nProvider } from '../i18n';
import { layers, projectOfPackage } from './ecosystem';

// The dialog of a package and the command line, in paper and ink: square chips and buttons, a `$` prompt in the accent,
// a command that wraps instead of fading out on the right, pixel icons of Nova, and every section the dialog had

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const dialogSource = read('components/PackageDialog.tsx');
const commandSource = read('components/CommandLine.tsx');
const inEnglish = (element: ReturnType<typeof createElement>) =>
  renderToStaticMarkup(createElement(I18nProvider, { initialLocale: 'en', children: element }));

describe('the command line', () => {
  const command = 'pnpm add @tuwaio/satellite-react @tuwaio/orbit-core @tuwaio/satellite-core immer@11 zustand@5';
  const markup = inEnglish(createElement(CommandLine, { command }));

  // The prompt is decoration: a reader who selects or copies the command gets the command alone
  it('shows a prompt that is not part of the command', () => {
    expect(markup).toMatch(/<span aria-hidden="true" class="[^"]*select-none[^"]*">\$<\/span>/);
    expect(markup).toContain(`>${command}</span>`);
    expect(commandSource).toContain('copy(command)');
  });

  // A long command wraps, all of it in sight: before, it scrolled sideways under a fade (a gradient mask)
  it('wraps a long command, with no fade and no sideways scroll', () => {
    expect(markup).toContain('[overflow-wrap:anywhere]');
    expect(markup).toContain('flex-wrap');
    expect(commandSource).not.toMatch(/mask-image|gradient|overflow-x-auto|whitespace-nowrap py/);
  });

  it('copies with the small secondary button and the copy icon of Nova', () => {
    expect(markup).toMatch(/<button type="button" title="Copy the command" class="[^"]*h-\[34px\][^"]*border /);
    expect(commandSource).toMatch(/import \{[^}]*\bCopyIcon\b[^}]*\} from '@tuwaio\/nova-core'/);
    expect(commandSource).not.toContain('@heroicons');
  });
});

describe('the switch of the package manager', () => {
  const markup = inEnglish(createElement(PackageManagerSwitch, { value: 'yarn', onChange: () => {} }));

  it('names its group and marks the chosen manager', () => {
    expect(markup).toContain('role="group" aria-label="Package manager"');
    expect(
      [...markup.matchAll(/aria-pressed="(true|false)"[^>]*>(?:<!-- -->)?(\w+)/g)].map((m) => [m[2], m[1]]),
    ).toEqual([
      ['pnpm', 'false'],
      ['npm', 'false'],
      ['yarn', 'true'],
      ['bun', 'false'],
    ]);
  });

  it('draws the chosen manager in ink, square', () => {
    const pressed = markup.match(/<button type="button" aria-pressed="true" class="([^"]*)"/)?.[1] ?? '';
    expect(pressed).toContain('bg-[var(--tuwa-text-primary)]');
    expect(pressed).toContain('text-[var(--tuwa-docs-paper)]');
    expect(markup).not.toMatch(/rounded/);
  });
});

describe('the dialog of a package', () => {
  it('finds the project of every package of the main page', () => {
    const names = layers.flatMap((layer) =>
      layer.entries.flatMap((entry) => (entry.packages ?? []).map((p) => p.name)),
    );
    expect(names.length).toBeGreaterThan(20);
    for (const name of names) expect(projectOfPackage(name), name).toBeDefined();
    expect(projectOfPackage('@tuwaio/satellite-react')).toMatchObject({ id: 'satellite', name: 'Satellite Connect' });
    expect(projectOfPackage('@tuwaio/satellite-react')?.icon).toBeTruthy();
    expect(projectOfPackage('left-pad')).toBeUndefined();
  });

  it('has the square of the project, whose icon moves under the pointer, and a square close button', () => {
    expect(dialogSource).toMatch(/<ProjectSquare icon=\{project\.icon\}/);
    expect(dialogSource).toContain('onMouseEnter={(event) => startPixelMotion(event.currentTarget)}');
    expect(dialogSource).toContain('onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}');
    expect(dialogSource).toMatch(/<DialogClose[\s\S]{0,120}className="grid h-10 w-10 /);
  });

  // The sections the sketch left out stay: optional peers, what the package includes and what includes it, the
  // lighter entries and the guides
  it('keeps every section it had', () => {
    for (const part of [
      't.ui.requiredPeers',
      't.ui.optionalPeersHeading',
      't.ui.includesHeading',
      't.ui.usedBy',
      't.ui.includedInPrefix',
      't.home.packageDialog.lighterEntryHeading',
      't.home.packageDialog.guidesHeading',
      't.home.packageDialog.viewOnNpm',
      't.ui.referenceLink',
      't.ui.sourceLink',
    ])
      expect(dialogSource, part).toContain(part);
  });

  // The command leaves `react` out, so the note under it says what it installs and what the app still needs: a
  // fixed "required peers are included" would not be true for a package with such peers
  it('says what the command installs and what the app still needs', () => {
    expect(dialogSource).toContain('t.ui.installsWithPeers');
    expect(dialogSource).toContain('t.ui.alsoNeedsFrameworkPeers');
  });

  it('draws packages as square chips a finger finds, optional ones in dashed frames', () => {
    expect(dialogSource).toMatch(/const chipClassName =\s*'inline-flex h-6 /);
    expect(dialogSource).toContain("optional && 'border-dashed'");
    expect(dialogSource).not.toMatch(/rounded/);
  });

  it('takes its icons from Nova, none from heroicons', () => {
    expect(dialogSource).not.toContain('@heroicons');
    expect(dialogSource).toContain("from '@tuwaio/sdk/nova-icons/24/outline'");
    expect(dialogSource).toMatch(/import \{[^}]*\bExternalLinkIcon\b[^}]*\} from '@tuwaio\/nova-core'/);
  });
});
