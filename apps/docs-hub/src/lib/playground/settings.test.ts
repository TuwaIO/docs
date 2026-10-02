import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, familiesOf, parseSettings, settingsQuery, stackOptionsFor, stageKey } from './settings';

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
    expect(parseSettings(new URLSearchParams('theme=__proto__')).theme).toBe('default-dark');
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
