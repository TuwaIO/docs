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
  theme: 'paper-dark',
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
 * Whether a query string names a theme of the Playground. Without one the stage follows the theme of the hub.
 *
 * @param params - The query string.
 * @returns Whether `theme` is a preset id.
 */
export function hasTheme(params: URLSearchParams): boolean {
  return isThemeId(params.get('theme'));
}

/**
 * Reads the settings from a query string. The parameters are those of the Stack Configurator (`chains`, `ui`,
 * `auth=siwx`, `quasar=1`) plus `theme`; a query without `chains` gives {@link DEFAULT_SETTINGS}.
 *
 * @param params - The query string.
 * @param fallbackTheme - The theme when the query names none, or an unknown one (a link from before a preset was
 * renamed): Nova's theme for the theme of the hub (default: the theme of {@link DEFAULT_SETTINGS}).
 * @returns The settings.
 */
export function parseSettings(
  params: URLSearchParams,
  fallbackTheme: ThemeId = DEFAULT_SETTINGS.theme,
): PlaygroundSettings {
  const named = params.get('theme');
  const theme = isThemeId(named) ? named : fallbackTheme;
  if (!params.has('chains')) return { ...DEFAULT_SETTINGS, theme };
  const { evm, solana, ui, siwx, quasar } = parseStackOptions(params);
  return normalizeSettings({ evm, solana, ui, siwx, quasar, theme });
}

/**
 * The query string of the settings, the inverse of {@link parseSettings}.
 *
 * @param settings - The settings.
 * @param withTheme - Whether the query names the theme (default: `true`). Without it the stage keeps following the
 * theme of the hub.
 * @returns The query string.
 */
export function settingsQuery(settings: PlaygroundSettings, withTheme = true): string {
  const params = new URLSearchParams(stackQuery(stackOptionsFor(settings, 'next')));
  params.delete('fw');
  if (withTheme) params.set('theme', settings.theme);
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
