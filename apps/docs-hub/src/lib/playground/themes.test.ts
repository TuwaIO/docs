import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  BADGE_CORNERS,
  isThemeId,
  LENGTH_VARIABLES,
  novaThemeFor,
  OPTIONAL_COLOR_VARIABLES,
  pickStyle,
  pickTheme,
  scanlineFor,
  THEME_GROUPS,
  THEME_PRESETS,
  THEME_VARIABLES,
  themeCss,
  type ThemeVariable,
} from './themes';

// The WCAG contrast ratio of two `#rrggbb` colors
function contrast(first: string, second: string): number {
  const luminance = (hex: string) => {
    const [red, green, blue] = [1, 3, 5].map((start) => {
      const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('theme presets', () => {
  // A color is `#rrggbb` (the editor has a color field for it). Two colors may be `transparent`, and a scanline is a
  // color with an alpha: Nova's lines are 1.2 to 1.5 percent of ink
  it('set every Nova variable with a valid value', () => {
    for (const preset of Object.values(THEME_PRESETS)) {
      for (const variable of THEME_VARIABLES) {
        const value = preset.values[variable];
        const valid = LENGTH_VARIABLES.includes(variable)
          ? /^\d+px$/
          : variable === '--tuwa-scanline'
            ? /^(transparent|rgb\(\d+ \d+ \d+ \/ 0\.0\d+\))$/
            : OPTIONAL_COLOR_VARIABLES.includes(variable)
              ? /^(transparent|#[0-9a-f]{6})$/
              : /^#[0-9a-f]{6}$/;
        expect(value, `${preset.id} ${variable}`).toMatch(valid);
      }
    }
  });

  // The presets of Nova itself are the values of its stylesheet: what a reader copies from the editor is the theme of
  // the package, in both themes
  it("copies Nova's own light and dark themes from the stylesheet of @tuwaio/nova-core", () => {
    const css = readFileSync(
      createRequire(path.resolve(__dirname, '../../../../../packages/docs-ui/package.json')).resolve(
        '@tuwaio/nova-core/dist/index.css',
      ),
      'utf8',
    );
    const blockOf = (selector: string) =>
      Object.fromEntries(
        [...css.matchAll(new RegExp(`(?:^|[}\\s])${selector.replace('.', '\\.')}\\s*\\{([^{}]*)\\}`, 'g'))].flatMap(
          (rule) =>
            [...(rule[1] as string).matchAll(/(--tuwa-[\w-]+)\s*:\s*([^;]+);/g)].map((d) => [d[1], d[2]?.trim()]),
        ),
      ) as Record<string, string>;
    const root = blockOf(':root');
    const dark = { ...root, ...blockOf('.dark') };
    // Colors Nova writes as hex or as a plain value; its status colors are `oklch()` there and `#rrggbb` here
    const literal = /^(#[0-9a-f]{6}|transparent|\d+px|rgb\([^)]+\))$/;
    for (const [id, nova] of [
      ['paper-light', root],
      ['paper-dark', dark],
    ] as const) {
      const compared = THEME_VARIABLES.filter((variable) => literal.test(nova[variable] ?? ''));
      expect(compared.length, id).toBeGreaterThan(20);
      for (const variable of compared)
        expect(THEME_PRESETS[id].values[variable], `${id} ${variable}`).toBe(nova[variable]);
      // The primary button is the start of the button gradient, as in Nova
      expect(THEME_PRESETS[id].values['--tuwa-button-primary-bg']).toBe(nova['--tuwa-button-gradient-from']);
    }
  });

  it('names the theme of Nova for a light and for a dark page, and its scanline', () => {
    expect(novaThemeFor(true)).toBe('paper-dark');
    expect(novaThemeFor(false)).toBe('paper-light');
    expect(scanlineFor(THEME_PRESETS.minimalist.values)).toBe(THEME_PRESETS['paper-light'].values['--tuwa-scanline']);
    expect(scanlineFor(THEME_PRESETS.cyberpunk.values)).toBe(THEME_PRESETS['paper-dark'].values['--tuwa-scanline']);
  });

  it('draws badges square in paper and ink and in the line drawings, round in Minimalist', () => {
    for (const id of ['paper-dark', 'paper-light', 'cyberpunk', 'isometric-light', 'isometric-dark'] as const)
      expect(THEME_PRESETS[id].values['--tuwa-rounded-full'], id).toBe(BADGE_CORNERS.square);
    expect(THEME_PRESETS.minimalist.values['--tuwa-rounded-full']).toBe(BADGE_CORNERS.round);
  });

  it('put every variable in exactly one editor group', () => {
    expect(THEME_GROUPS.flatMap((group) => group.variables).sort()).toEqual([...THEME_VARIABLES].sort());
  });

  it('render as a CSS rule', () => {
    const css = themeCss(THEME_PRESETS.cyberpunk.values, 'Cyberpunk');
    expect(css).toContain('/* Nova UI Kit theme: Cyberpunk */\n:root {\n  --tuwa-bg-primary: #0a0014;');
    expect(css.trim().endsWith('}')).toBe(true);
  });

  it('recognise only own preset ids', () => {
    expect(isThemeId('minimalist')).toBe(true);
    expect(isThemeId('isometric-light')).toBe(true);
    expect(isThemeId('isometric-dark')).toBe(true);
    expect(isThemeId('toString')).toBe(false);
    expect(isThemeId(null)).toBe(false);
  });

  it('draws the Isometric themes with square corners and pairs them with the Isometric style', () => {
    for (const id of ['isometric-light', 'isometric-dark'] as const) {
      expect(THEME_PRESETS[id].values['--tuwa-rounded-corners']).toBe('0px');
      expect(THEME_PRESETS[id].pairedStyle).toBe('iso');
    }
    expect(THEME_PRESETS['paper-dark'].pairedStyle).toBeUndefined();
  });

  it('draws Isometric Light in one ink and Isometric Dark in dimmed gray lines', () => {
    const light = THEME_PRESETS['isometric-light'].values;
    expect(light['--tuwa-border-primary']).toBe(light['--tuwa-text-primary']);
    expect(light['--tuwa-button-gradient-from']).toBe(light['--tuwa-text-primary']);
    const dark = THEME_PRESETS['isometric-dark'].values;
    // Lines and the fill of bars and buttons are grays, darker than the text; the text on them stays light
    expect(dark['--tuwa-border-primary']).not.toBe(dark['--tuwa-text-primary']);
    expect(dark['--tuwa-button-gradient-from']).not.toBe(dark['--tuwa-text-primary']);
    expect(dark['--tuwa-text-on-accent']).toBe(dark['--tuwa-text-primary']);
  });

  it('keeps the text, the accent and the status icons of the Isometric themes readable', () => {
    for (const id of ['isometric-light', 'isometric-dark'] as const) {
      const values = THEME_PRESETS[id].values;
      const pairs: [ThemeVariable, ThemeVariable, number][] = [
        ['--tuwa-text-primary', '--tuwa-bg-secondary', 4.5],
        ['--tuwa-text-secondary', '--tuwa-bg-secondary', 4.5],
        ['--tuwa-text-accent', '--tuwa-bg-secondary', 4.5],
        ['--tuwa-text-on-accent', '--tuwa-button-gradient-from', 4.5],
        ['--tuwa-success-icon', '--tuwa-success-bg', 3],
        ['--tuwa-error-icon', '--tuwa-error-bg', 3],
        ['--tuwa-pending-icon', '--tuwa-pending-bg', 3],
        ['--tuwa-info-icon', '--tuwa-info-bg', 3],
      ];
      for (const [color, background, minimum] of pairs) {
        expect(contrast(values[color], values[background]), `${id} ${color} on ${background}`).toBeGreaterThanOrEqual(
          minimum,
        );
      }
    }
  });

  it('draws the Isometric themes on one surface color, which Nova parts on the primary background share', () => {
    for (const id of ['isometric-light', 'isometric-dark'] as const) {
      const values = THEME_PRESETS[id].values;
      expect(values['--tuwa-bg-primary'], id).toBe(values['--tuwa-bg-secondary']);
    }
  });
});

describe('themes and style kits', () => {
  it('picks the Isometric style with an Isometric theme', () => {
    expect(pickTheme('isometric-dark', 'nova')).toEqual({ theme: 'isometric-dark', style: 'iso' });
    expect(pickTheme('isometric-light', 'mono')).toEqual({ theme: 'isometric-light', style: 'iso' });
  });

  it('drops the Isometric style for Nova when another theme is picked', () => {
    expect(pickTheme('cyberpunk', 'iso')).toEqual({ theme: 'cyberpunk', style: 'nova' });
    expect(pickTheme('paper-light', 'iso')).toEqual({ theme: 'paper-light', style: 'nova' });
  });

  it('keeps a style drawn for every theme', () => {
    expect(pickTheme('paper-light', 'mono')).toEqual({ theme: 'paper-light', style: 'mono' });
    expect(pickTheme('paper-dark', 'nova')).toEqual({ theme: 'paper-dark', style: 'nova' });
  });

  it('picks an Isometric theme with the Isometric style, dark after a dark theme', () => {
    expect(pickStyle('iso', 'paper-dark')).toEqual({ theme: 'isometric-dark', style: 'iso' });
    expect(pickStyle('iso', 'cyberpunk')).toEqual({ theme: 'isometric-dark', style: 'iso' });
    expect(pickStyle('iso', 'paper-light')).toEqual({ theme: 'isometric-light', style: 'iso' });
    expect(pickStyle('iso', 'isometric-dark')).toEqual({ theme: 'isometric-dark', style: 'iso' });
  });

  it("leaves an Isometric theme for Nova's own when another style is picked", () => {
    expect(pickStyle('nova', 'isometric-dark')).toEqual({ theme: 'paper-dark', style: 'nova' });
    expect(pickStyle('mono', 'isometric-light')).toEqual({ theme: 'paper-light', style: 'mono' });
    expect(pickStyle('mono', 'cyberpunk')).toEqual({ theme: 'cyberpunk', style: 'mono' });
  });
});
