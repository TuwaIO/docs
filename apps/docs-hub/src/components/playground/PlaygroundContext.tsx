'use client';

import type { NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { createContext, useContext } from 'react';

import type { NovaCustomization } from '@/lib/playground/customization';
import type { PlaygroundDevice } from '@/lib/playground/device';
import type { PlaygroundSettings } from '@/lib/playground/settings';
import type { SimulatedSiwx } from '@/lib/playground/siwx';
import type { ThemeValues, ThemeVariable } from '@/lib/playground/themes';
import type { SimulatedFamily } from '@/lib/playground/types';

/** What every part of the Playground reads: the settings, the simulated device and backends, and the actions. */
export interface PlaygroundContextValue {
  settings: PlaygroundSettings;
  families: SimulatedFamily[];
  device: PlaygroundDevice;
  /** The simulated SIWX backend calls. */
  siwx: SimulatedSiwx;
  /** The `siwx` prop of Nova Connect, or `undefined` without SIWX. */
  novaSiwx: NovaConnectProviderProps['siwx'];
  /** The theme of the stage: the preset with the edits of the Theme tab. */
  theme: ThemeValues;
  /** Whether the Theme tab changed the preset. */
  themeEdited: boolean;
  /** The customization of Nova beyond the theme (the Customize tab). */
  customization: NovaCustomization;
  changeSettings: (patch: Partial<PlaygroundSettings>) => void;
  editTheme: (variable: ThemeVariable, value: string) => void;
  resetThemeEdits: () => void;
  changeCustomization: (patch: Partial<NovaCustomization>) => void;
  resetCustomization: () => void;
  /** Starts over on a new simulated device: empty local pool, no wallet connection, no SIWX session. */
  openOnAnotherDevice: () => void;
  /**
   * Starts the Playground over: also empties the chain, Quasar and the event log, and resets the scenario, the theme
   * edits and the customization.
   */
  resetPlayground: () => void;
}

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

/** The Playground context. */
export function usePlayground(): PlaygroundContextValue {
  const value = useContext(PlaygroundContext);
  if (!value) throw new Error('usePlayground must be used inside the Playground.');
  return value;
}
