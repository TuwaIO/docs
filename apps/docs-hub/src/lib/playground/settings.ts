import { OrbitAdapter } from '@tuwaio/sdk/orbit';

import { normalizeStackOptions, parseStackOptions, type StackOptions, stackQuery } from '../configurator/generate';
import { isThemeId, type ThemeId } from './themes';
import type { SimulatedFamily } from './types';

/** The settings of the Playground, kept in the query string so a setup can be shared as a link. */
export interface PlaygroundSettings {
  evm: boolean;
  solana: boolean;
  /** Nova UI Kit, or hand-written components on the stores. */
  ui: 'nova' | 'headless';
  theme: ThemeId;
  /** Sign-in with the wallet after connecting. */
  siwx: boolean;
  /** Sync of the transactions to the simulated Quasar. Requires `siwx`. */
  quasar: boolean;
}

/** Everything on: both chain families, Nova UI Kit, SIWX and Quasar. */
export const DEFAULT_SETTINGS: PlaygroundSettings = {
  evm: true,
  solana: true,
  ui: 'nova',
  theme: 'default-dark',
  siwx: true,
  quasar: true,
};

/**
 * Applies the rules of the stack: at least one chain family, and Quasar turns SIWX on (it syncs the transactions of
 * a signed-in wallet). The rules are those of `normalizeStackOptions` of the Stack Configurator.
 */
export function normalizeSettings(settings: PlaygroundSettings): PlaygroundSettings {
  const { evm, solana, siwx, quasar } = normalizeStackOptions({ framework: 'next', ...settings });
  return { ...settings, evm, solana, siwx, quasar };
}

/**
 * Reads the settings from a query string. The parameters are those of the Stack Configurator (`chains`, `ui`,
 * `auth=siwx`, `quasar=1`) plus `theme`; a query without `chains` gives {@link DEFAULT_SETTINGS}.
 */
export function parseSettings(params: URLSearchParams): PlaygroundSettings {
  const theme = params.get('theme');
  if (!params.has('chains')) return { ...DEFAULT_SETTINGS, theme: isThemeId(theme) ? theme : DEFAULT_SETTINGS.theme };
  const { evm, solana, ui, siwx, quasar } = parseStackOptions(params);
  return normalizeSettings({ evm, solana, ui, siwx, quasar, theme: isThemeId(theme) ? theme : DEFAULT_SETTINGS.theme });
}

/** The query string of the settings, the inverse of {@link parseSettings}. */
export function settingsQuery(settings: PlaygroundSettings): string {
  const params = new URLSearchParams(stackQuery(stackOptionsFor(settings, 'next')));
  params.delete('fw');
  params.set('theme', settings.theme);
  return params.toString();
}

/** The Stack Configurator options of the settings, for the Code tab and the link to `/configurator`. */
export function stackOptionsFor(settings: PlaygroundSettings, framework: StackOptions['framework']): StackOptions {
  const { evm, solana, ui, siwx, quasar } = settings;
  return normalizeStackOptions({ framework, evm, solana, ui, siwx, quasar });
}

/** The chain families the stage simulates. */
export function familiesOf(settings: PlaygroundSettings): SimulatedFamily[] {
  return [settings.evm && OrbitAdapter.EVM, settings.solana && OrbitAdapter.SOLANA].filter(
    (family): family is SimulatedFamily => family !== false,
  );
}

/**
 * The settings that need a new app on the stage (new stores and providers). A theme change keeps the app.
 */
export function stageKey(settings: PlaygroundSettings): string {
  return [
    settings.evm && 'evm',
    settings.solana && 'solana',
    settings.ui,
    settings.siwx && 'siwx',
    settings.quasar && 'quasar',
  ]
    .filter(Boolean)
    .join('-');
}
