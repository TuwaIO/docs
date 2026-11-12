import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SETTINGS,
  familiesOf,
  hasTheme,
  parseSettings,
  settingsQuery,
  stackOptionsFor,
  stageKey,
} from './settings';

describe('Playground settings', () => {
  it('starts with the full stack', () => {
    expect(parseSettings(new URLSearchParams(''))).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips through the query string', () => {
    const settings = { ...DEFAULT_SETTINGS, solana: false, ui: 'headless' as const, theme: 'cyberpunk' as const };
    expect(parseSettings(new URLSearchParams(settingsQuery(settings)))).toEqual(settings);
  });

  it('reads the parameters of the Stack Configurator', () => {
    expect(parseSettings(new URLSearchParams('fw=vite&chains=solana&ui=nova&auth=siwx'))).toEqual({
      ...DEFAULT_SETTINGS,
      evm: false,
      quasar: false,
    });
  });

  it('turns SIWX on with Quasar and keeps one chain family', () => {
    const settings = parseSettings(new URLSearchParams('chains=&quasar=1'));
    expect(settings.siwx).toBe(true);
    expect(familiesOf(settings)).toEqual([OrbitAdapter.EVM]);
  });

  it('ignores an unknown theme', () => {
    expect(parseSettings(new URLSearchParams('theme=__proto__')).theme).toBe('paper-dark');
  });

  // The presets "Default Dark" and "Clean Light" became Nova's paper themes: a link from before opens the stage in
  // the theme it would have without a theme
  it('opens a link that names a preset from before in the theme of the hub', () => {
    for (const old of ['default-dark', 'clean-light']) {
      expect(hasTheme(new URLSearchParams(`theme=${old}`))).toBe(false);
      expect(parseSettings(new URLSearchParams(`theme=${old}`), 'paper-light').theme).toBe('paper-light');
    }
  });

  // Until the reader picks a theme, the stage wears Nova's theme for the theme of the hub
  it('follows the theme of the hub while the query names no theme', () => {
    expect(parseSettings(new URLSearchParams(''), 'paper-light').theme).toBe('paper-light');
    expect(parseSettings(new URLSearchParams('chains=evm'), 'paper-light').theme).toBe('paper-light');
    expect(parseSettings(new URLSearchParams('theme=minimalist'), 'paper-light').theme).toBe('minimalist');
    expect(hasTheme(new URLSearchParams('theme=minimalist'))).toBe(true);
    expect(hasTheme(new URLSearchParams('chains=evm'))).toBe(false);
  });

  it('names the theme in the query only when asked to', () => {
    expect(new URLSearchParams(settingsQuery(DEFAULT_SETTINGS)).get('theme')).toBe('paper-dark');
    expect(new URLSearchParams(settingsQuery(DEFAULT_SETTINGS, false)).has('theme')).toBe(false);
  });

  it('maps to Stack Configurator options', () => {
    expect(stackOptionsFor(DEFAULT_SETTINGS, 'vite')).toEqual({
      framework: 'vite',
      evm: true,
      solana: true,
      ui: 'nova',
      siwx: true,
      quasar: true,
    });
  });

  it('keeps the app on a theme change', () => {
    expect(stageKey({ ...DEFAULT_SETTINGS, theme: 'minimalist' })).toBe(stageKey(DEFAULT_SETTINGS));
    expect(stageKey({ ...DEFAULT_SETTINGS, ui: 'headless' })).not.toBe(stageKey(DEFAULT_SETTINGS));
  });
});
