'use client';

// The EVM and Solana entries of Nova Connect register its chain helpers: without them the connect modal has no networks
import '@tuwaio/evm-sdk/nova-connect';
import '@tuwaio/solana-sdk/nova-connect';
import '@tuwaio/sdk/styles/nova-transactions.css';
import '@tuwaio/sdk/styles/nova-connect.css';

import { useMemo, useState } from 'react';

import { DEFAULT_CUSTOMIZATION, type NovaCustomization } from '@/lib/playground/customization';
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  parseSettings,
  type PlaygroundSettings,
  settingsQuery,
  stageKey,
} from '@/lib/playground/settings';
import { THEME_PRESETS, type ThemeValues } from '@/lib/playground/themes';
import { replaceQuery, useQueryString } from '@/lib/queryState';

import { PlaygroundSession } from './PlaygroundSession';

/**
 * The Playground of `/playground`. It runs only in the browser (`PlaygroundLoader` imports it with `ssr: false`), so
 * the TUWA packages load on this page only. The settings live in the query string; a change of chains, UI or features
 * starts a new session (new stores and providers); the theme and the customization of Nova keep it.
 */
export default function PlaygroundStudio() {
  const query = useQueryString();
  const settings = useMemo(() => parseSettings(new URLSearchParams(query)), [query]);
  const [generation, setGeneration] = useState(0);
  const [themeEdits, setThemeEdits] = useState<Partial<ThemeValues>>({});
  const [customization, setCustomization] = useState<NovaCustomization>(DEFAULT_CUSTOMIZATION);

  const changeSettings = (patch: Partial<PlaygroundSettings>) => {
    if (patch.theme) setThemeEdits({});
    replaceQuery(settingsQuery(normalizeSettings({ ...settings, ...patch })));
  };

  return (
    <PlaygroundSession
      key={`${stageKey(settings)}#${generation}`}
      settings={settings}
      theme={{ ...THEME_PRESETS[settings.theme].values, ...themeEdits }}
      themeEdited={Object.keys(themeEdits).length > 0}
      changeSettings={changeSettings}
      editTheme={(variable, value) => setThemeEdits((edits) => ({ ...edits, [variable]: value }))}
      resetThemeEdits={() => setThemeEdits({})}
      resetTheme={() => changeSettings({ theme: DEFAULT_SETTINGS.theme })}
      customization={customization}
      changeCustomization={(patch) => setCustomization((current) => ({ ...current, ...patch }))}
      resetCustomization={() => setCustomization(DEFAULT_CUSTOMIZATION)}
      restart={() => setGeneration((value) => value + 1)}
    />
  );
}
