'use client';

// The EVM and Solana entries of Nova Connect register its chain helpers: without them the connect modal has no networks
import '@tuwaio/evm-sdk/nova-connect';
import '@tuwaio/solana-sdk/nova-connect';
import '@tuwaio/sdk/styles/nova-transactions.css';
import '@tuwaio/sdk/styles/nova-connect.css';

import { useEffect, useMemo, useState } from 'react';

import { useI18n } from '@/i18n';
import { DEFAULT_CUSTOMIZATION, type NovaCustomization, type NovaLanguage } from '@/lib/playground/customization';
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  parseSettings,
  type PlaygroundSettings,
  settingsQuery,
  stageKey,
} from '@/lib/playground/settings';
import { pickStyle, pickTheme, THEME_PRESETS, type ThemeId, type ThemeValues } from '@/lib/playground/themes';
import { replaceQuery, useQueryString } from '@/lib/queryState';

import { PlaygroundSession } from './PlaygroundSession';

function toNovaLanguage(locale: 'en' | 'uk' | 'zh-CN'): NovaLanguage {
  return locale === 'zh-CN' ? 'zh' : locale;
}

/**
 * The Playground of `/playground`. It runs only in the browser (`PlaygroundLoader` imports it with `ssr: false`), so
 * the TUWA packages load on this page only. The settings live in the query string; a change of chains, UI or features
 * starts a new session (new stores and providers); the theme and the customization of Nova keep it. A theme drawn for
 * one style kit (Isometric) and that kit are picked together: see `pickTheme` and `pickStyle`.
 */
export default function PlaygroundStudio() {
  const { locale } = useI18n();
  const query = useQueryString();
  const settings = useMemo(() => parseSettings(new URLSearchParams(query)), [query]);
  const [generation, setGeneration] = useState(0);
  const [themeEdits, setThemeEdits] = useState<Partial<ThemeValues>>({});
  const [customization, setCustomization] = useState<NovaCustomization>(() => ({
    ...DEFAULT_CUSTOMIZATION,
    language: toNovaLanguage(locale),
    style: pickTheme(settings.theme, DEFAULT_CUSTOMIZATION.style).style,
  }));

  useEffect(() => {
    const nextLang = toNovaLanguage(locale);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomization((current) => (current.language === nextLang ? current : { ...current, language: nextLang }));
  }, [locale]);

  const changeSettings = (patch: Partial<PlaygroundSettings>) => {
    if (patch.theme) {
      setThemeEdits({});
      const { style } = pickTheme(patch.theme, customization.style);
      if (style !== customization.style) setCustomization((current) => ({ ...current, style }));
    }
    replaceQuery(settingsQuery(normalizeSettings({ ...settings, ...patch })));
  };

  // A theme picked together with a style kit, without the pairing of `changeSettings`
  const switchTheme = (theme: ThemeId) => {
    if (theme === settings.theme) return;
    setThemeEdits({});
    replaceQuery(settingsQuery(normalizeSettings({ ...settings, theme })));
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
      resetTheme={() => changeSettings({ theme: DEFAULT_SETTINGS.theme })}
      customization={customization}
      changeCustomization={changeCustomization}
      resetCustomization={() => {
        setCustomization(DEFAULT_CUSTOMIZATION);
        switchTheme(pickStyle(DEFAULT_CUSTOMIZATION.style, settings.theme).theme);
      }}
      restart={() => setGeneration((value) => value + 1)}
    />
  );
}
