import { readFileSync } from 'node:fs';
import path from 'node:path';

import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import { describe, expect, it } from 'vitest';

import { CODE_COLOR_REPLACEMENTS } from './codeColors';

// The code of the hub (the Stack Configurator, the Playground, the snippets of the pages) is highlighted with the
// GitHub themes of Shiki and has no fill of its own: it stands on the paper of the hub, which is darker than the white
// of GitHub in the light theme and lighter than its black in the dark one. Four colours of the light theme and one of
// the dark theme did not reach 4.5:1 there (axe `color-contrast`, 45 texts of the Code tab of the Playground)

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');

type Theme = { tokenColors?: { scope?: string | string[]; settings: { foreground?: string; background?: string } }[] };
const THEMES = { 'github-light': githubLight as Theme, 'github-dark': githubDark as Theme };

/** The surfaces a code block of the hub can stand on: raised, paper and sunken of each theme (Nova Core). */
const SURFACES = {
  'github-light': ['#faf9f7', '#f2f1ee', '#e9e8e4'],
  'github-dark': ['#101014', '#17181b', '#222327'],
};

/** The relative luminance of a colour (WCAG 2). */
const luminance = (hex: string) => {
  const [red, green, blue] = [1, 3, 5]
    .map((at) => parseInt(hex.slice(at, at + 2), 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (one: string, two: string) => {
  const [lighter, darker] = [luminance(one), luminance(two)].sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
};

/** The colours a theme gives to tokens that stand on the paper: a rule with a fill of its own stands on that fill. */
const tokenColours = (theme: Theme) => [
  ...new Set(
    (theme.tokenColors ?? [])
      .filter((rule) => rule.settings.foreground && !rule.settings.background)
      .map((rule) => (rule.settings.foreground as string).toLowerCase()),
  ),
];

describe('the colours of the code of the hub', () => {
  it('reach 4.5:1 on every surface of the hub, in both themes', () => {
    for (const name of ['github-light', 'github-dark'] as const) {
      const colours = tokenColours(THEMES[name]);
      expect(colours.length).toBeGreaterThan(8);
      for (const colour of colours) {
        const shown = CODE_COLOR_REPLACEMENTS[name][colour] ?? colour;
        for (const surface of SURFACES[name])
          expect(contrast(shown, surface), `${name} ${colour} → ${shown} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('replaces only colours the themes have and that fail on a surface, by a colour of the same hue', () => {
    for (const name of ['github-light', 'github-dark'] as const) {
      const colours = tokenColours(THEMES[name]);
      for (const [from, to] of Object.entries(CODE_COLOR_REPLACEMENTS[name])) {
        // Shiki matches the colours of a theme in lower case
        expect(from).toMatch(/^#[0-9a-f]{6}$/);
        expect(to).toMatch(/^#[0-9a-f]{6}$/);
        expect(colours, `${name} ${from}`).toContain(from);
        expect(Math.min(...SURFACES[name].map((surface) => contrast(from, surface)))).toBeLessThan(4.5);
        // The same colour, darker on the light paper and lighter on the dark one: no channel moves the other way
        const channels = [1, 3, 5].map(
          (at) => parseInt(to.slice(at, at + 2), 16) - parseInt(from.slice(at, at + 2), 16),
        );
        expect(channels.every((change) => (name === 'github-light' ? change <= 0 : change >= 0))).toBe(true);
      }
    }
    expect(Object.keys(CODE_COLOR_REPLACEMENTS['github-light'])).toHaveLength(4);
    expect(Object.keys(CODE_COLOR_REPLACEMENTS['github-dark'])).toHaveLength(1);
  });

  it('are given to Shiki by both components that highlight code', () => {
    for (const file of ['components/configurator/CodeBlock.tsx', 'components/localized/CodeSnippet.tsx']) {
      const source = read(file);
      expect(source, file).toContain("import { CODE_COLOR_REPLACEMENTS } from '@/lib/codeColors';");
      expect(source, file).toMatch(
        /themes: \{ light: 'github-light', dark: 'github-dark' \},\s+defaultColor: false,\s+colorReplacements: CODE_COLOR_REPLACEMENTS,/,
      );
    }
    // No other file of the hub highlights code on its own
    expect(read('components/configurator/CodeBlock.tsx').match(/codeToHtml\(/g)).toHaveLength(1);
    expect(read('components/localized/CodeSnippet.tsx').match(/codeToHtml\(/g)).toHaveLength(1);
  });
});
