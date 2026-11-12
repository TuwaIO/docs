'use client';

// The EVM and Solana entries of Nova Connect register its chain helpers: without them the connect modal has no networks
import '@tuwaio/evm-sdk/nova-connect';
import '@tuwaio/solana-sdk/nova-connect';
import '@tuwaio/sdk/styles/nova-transactions.css';
import '@tuwaio/sdk/styles/nova-connect.css';

import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

import { useI18n } from '@/i18n';
import { DEFAULT_CUSTOMIZATION, defaultCustomizationFor, type NovaCustomization } from '@/lib/playground/customization';
import {
  hasTheme,
  normalizeSettings,
  parseSettings,
  type PlaygroundSettings,
  settingsQuery,
  stageKey,
} from '@/lib/playground/settings';
import {
  novaThemeFor,
  pickStyle,
  pickTheme,
  THEME_PRESETS,
  type ThemeId,
  type ThemeValues,
} from '@/lib/playground/themes';
import { replaceQuery, useQueryString } from '@/lib/queryState';

import { PlaygroundSession } from './PlaygroundSession';

/**
 * The Playground of `/playground`. It runs only in the browser (`PlaygroundLoader` imports it with `ssr: false`), so
 * the TUWA packages load on this page only. The settings live in the query string; a change of chains, UI or features
 * starts a new session (new stores and providers); the theme and the customization of Nova keep it. A theme drawn for
 * one style kit (Isometric) and that kit are picked together: see `pickTheme` and `pickStyle`.
 *
 * Until the reader picks a theme, the stage wears Nova's own theme for the theme of the hub (Paper Light on a light
 * page, Paper Dark on a dark one) and changes with it; the query string then names no theme. A picked theme is named in
 * the query string and stays; "reset" goes back to following the hub.
 */
export default function PlaygroundStudio() {
  const { locale } = useI18n();
  const query = useQueryString();
  const { resolvedTheme } = useTheme();
  const hubTheme = novaThemeFor(resolvedTheme !== 'light');
  // Whether the reader has picked a theme: the query string names it
  const themePicked = useMemo(() => hasTheme(new URLSearchParams(query)), [query]);
  const settings = useMemo(() => parseSettings(new URLSearchParams(query), hubTheme), [query, hubTheme]);
  const [generation, setGeneration] = useState(0);
  const [themeEdits, setThemeEdits] = useState<Partial<ThemeValues>>({});
  const [customization, setCustomization] = useState<NovaCustomization>(() => ({
    ...defaultCustomizationFor(locale),
    style: pickTheme(settings.theme, DEFAULT_CUSTOMIZATION.style).style,
  }));

  useEffect(() => {
    const nextLang = defaultCustomizationFor(locale).language;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomization((current) => (current.language === nextLang ? current : { ...current, language: nextLang }));
  }, [locale]);

  const changeSettings = (patch: Partial<PlaygroundSettings>) => {
    if (patch.theme) {
      setThemeEdits({});
      const { style } = pickTheme(patch.theme, customization.style);
      if (style !== customization.style) setCustomization((current) => ({ ...current, style }));
    }
    // A change of the stack leaves the theme to the hub while the reader has picked none
    replaceQuery(settingsQuery(normalizeSettings({ ...settings, ...patch }), themePicked || !!patch.theme));
  };

  // A theme picked together with a style kit, without the pairing of `changeSettings`
  const switchTheme = (theme: ThemeId) => {
    if (theme === settings.theme) return;
    setThemeEdits({});
    replaceQuery(settingsQuery(normalizeSettings({ ...settings, theme })));
  };

  // Back to the theme of the hub: the query string names no theme
  const followHubTheme = () => {
    setThemeEdits({});
    replaceQuery(settingsQuery(normalizeSettings(settings), false));
  };

  const changeCustomization = (patch: Partial<NovaCustomization>) => {
    setCustomization((current) => ({ ...current, ...patch }));
    if (patch.style) switchTheme(pickStyle(patch.style, settings.theme).theme);
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
      resetTheme={followHubTheme}
      customization={customization}
      changeCustomization={changeCustomization}
      resetCustomization={() => {
        setCustomization(defaultCustomizationFor(locale));
        // The default kit fits every theme: only a theme drawn for another kit gives way
        const { theme } = pickStyle(DEFAULT_CUSTOMIZATION.style, settings.theme);
        if (theme !== settings.theme) switchTheme(theme);
      }}
      restart={() => setGeneration((value) => value + 1)}
    />
  );
}
