import { describe, expect, it } from 'vitest';

import {
  isThemeId,
  LENGTH_VARIABLES,
  pickStyle,
  pickTheme,
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
  it('set every Nova variable with a valid value', () => {
    for (const preset of Object.values(THEME_PRESETS)) {
      for (const variable of THEME_VARIABLES) {
        const value = preset.values[variable];
        expect(value, `${preset.id} ${variable}`).toMatch(
          LENGTH_VARIABLES.includes(variable) ? /^\d+px$/ : /^#[0-9a-f]{6}$/,
        );
      }
    }
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
    expect(THEME_PRESETS['default-dark'].pairedStyle).toBeUndefined();
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
    expect(pickTheme('clean-light', 'iso')).toEqual({ theme: 'clean-light', style: 'nova' });
  });

  it('keeps a style drawn for every theme', () => {
    expect(pickTheme('clean-light', 'mono')).toEqual({ theme: 'clean-light', style: 'mono' });
    expect(pickTheme('default-dark', 'nova')).toEqual({ theme: 'default-dark', style: 'nova' });
  });

  it('picks an Isometric theme with the Isometric style, dark after a dark theme', () => {
    expect(pickStyle('iso', 'default-dark')).toEqual({ theme: 'isometric-dark', style: 'iso' });
    expect(pickStyle('iso', 'cyberpunk')).toEqual({ theme: 'isometric-dark', style: 'iso' });
    expect(pickStyle('iso', 'clean-light')).toEqual({ theme: 'isometric-light', style: 'iso' });
    expect(pickStyle('iso', 'isometric-dark')).toEqual({ theme: 'isometric-dark', style: 'iso' });
  });

  it("leaves an Isometric theme for Nova's own when another style is picked", () => {
    expect(pickStyle('nova', 'isometric-dark')).toEqual({ theme: 'default-dark', style: 'nova' });
    expect(pickStyle('mono', 'isometric-light')).toEqual({ theme: 'clean-light', style: 'mono' });
    expect(pickStyle('mono', 'cyberpunk')).toEqual({ theme: 'cyberpunk', style: 'mono' });
  });
});
