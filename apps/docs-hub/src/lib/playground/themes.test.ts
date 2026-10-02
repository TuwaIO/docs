import { describe, expect, it } from 'vitest';

import { isThemeId, LENGTH_VARIABLES, THEME_GROUPS, THEME_PRESETS, THEME_VARIABLES, themeCss } from './themes';

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
    expect(isThemeId('toString')).toBe(false);
    expect(isThemeId(null)).toBe(false);
  });
});
