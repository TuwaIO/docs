'use client';

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DEFAULT_LOCALE,
  formatLabel,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  resolveClientLocale,
  type TuwaLocale,
} from './locale';

/** State and setter returned by {@link useLocaleState}. */
export interface LocaleState {
  /** The active locale: {@link DEFAULT_LOCALE} on the server and in the first client render. */
  locale: TuwaLocale;
  /** Switches the locale, saves it under the storage key and updates `<html lang>`. Unknown values fall back. */
  setLocale: (next: TuwaLocale | string) => void;
  /** Whether the locale of the browser has been read (`false` during SSR and the first client render). */
  resolved: boolean;
}

/** Options of {@link useLocaleState} and {@link createI18n}. */
export interface LocaleStateOptions {
  /** Fixed locale (tests, a page rendered in one language): detection is skipped. */
  initialLocale?: TuwaLocale;
  /** Local Storage key of the picked locale (default: {@link LOCALE_STORAGE_KEY}). */
  storageKey?: string;
}

function applyDocumentLanguage(locale: TuwaLocale) {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

/**
 * Locale state without dictionaries: renders {@link DEFAULT_LOCALE} first, so the server HTML and the first client
 * render match, then reads the locale of the browser after mount ({@link resolveClientLocale}). Use it directly when an
 * app keeps its texts elsewhere; {@link createI18n} builds on it.
 *
 * @param options - See {@link LocaleStateOptions}.
 * @returns The locale, its setter and whether detection ran.
 */
export function useLocaleState(options: LocaleStateOptions = {}): LocaleState {
  const { initialLocale, storageKey = LOCALE_STORAGE_KEY } = options;
  const [locale, setLocaleState] = useState<TuwaLocale>(initialLocale ?? DEFAULT_LOCALE);
  const [resolved, setResolved] = useState(Boolean(initialLocale));

  useEffect(() => {
    const next = initialLocale ?? resolveClientLocale(storageKey);
    // Reading the browser can only happen after mount; the server rendered the default
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(next);
    setResolved(true);
    applyDocumentLanguage(next);
  }, [initialLocale, storageKey]);

  // Another tab picked a language: follow it
  useEffect(() => {
    if (initialLocale) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const next = normalizeLocale(event.newValue);
      if (next) {
        setLocaleState(next);
        applyDocumentLanguage(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [initialLocale, storageKey]);

  const setLocale = useCallback(
    (target: TuwaLocale | string) => {
      const next = normalizeLocale(target) ?? DEFAULT_LOCALE;
      setLocaleState(next);
      applyDocumentLanguage(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage blocked: the choice lasts for this page only
      }
    },
    [storageKey],
  );

  return { locale, setLocale, resolved };
}

/** Value of the context created by {@link createI18n}. */
export interface I18nContextValue<Labels> extends LocaleState {
  /** Texts of the active locale. */
  t: Labels;
  /** {@link formatLabel}, for `{name}` tokens in the texts. */
  format: typeof formatLabel;
}

/** Props of the provider created by {@link createI18n}. */
export interface I18nProviderProps extends LocaleStateOptions {
  children: ReactNode;
}

/** What {@link createI18n} returns. */
export interface I18nKit<Labels> {
  /** Provides the locale and the texts to the tree. */
  I18nProvider: ComponentType<I18nProviderProps>;
  /** Reads the locale, its setter and the texts; outside the provider it returns the English texts and a no-op. */
  useI18n: () => I18nContextValue<Labels>;
  /** The dictionaries, by locale. */
  dictionaries: Readonly<Record<TuwaLocale, Labels>>;
}

/**
 * Creates a typed i18n kit for one app: a provider and a hook over its own dictionaries. Each TUWA site keeps its texts
 * (and their schema) in the app, and shares detection, persistence and switching through this package.
 *
 * @example
 * ```tsx
 * export const { I18nProvider, useI18n } = createI18n<SiteLabels>({ en, uk, 'zh-CN': zhCN });
 * ```
 *
 * @param dictionaries - The texts of every {@link TuwaLocale}; the English ones are the fallback.
 * @param defaults - Options applied to every provider of the kit.
 * @returns The provider, the hook and the dictionaries.
 */
export function createI18n<Labels>(
  dictionaries: Readonly<Record<TuwaLocale, Labels>>,
  defaults: LocaleStateOptions = {},
): I18nKit<Labels> {
  const fallback: I18nContextValue<Labels> = {
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    resolved: false,
    t: dictionaries[DEFAULT_LOCALE],
    format: formatLabel,
  };
  const Context = createContext<I18nContextValue<Labels>>(fallback);

  function I18nProvider({ children, initialLocale, storageKey }: I18nProviderProps) {
    const state = useLocaleState({
      initialLocale: initialLocale ?? defaults.initialLocale,
      storageKey: storageKey ?? defaults.storageKey,
    });
    const { locale, setLocale, resolved } = state;
    const value = useMemo<I18nContextValue<Labels>>(
      () => ({
        locale,
        setLocale,
        resolved,
        t: dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE],
        format: formatLabel,
      }),
      [locale, setLocale, resolved],
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useI18n() {
    return useContext(Context);
  }

  return { I18nProvider, useI18n, dictionaries };
}

/**
 * Renders the child of the active locale: content prepared for every locale on the server (translated MDX pages),
 * switched on the client without a request. The server HTML holds the {@link DEFAULT_LOCALE} child, so crawlers and
 * the search index read English.
 *
 * @param props.locale - The active locale.
 * @param props.variants - Content by locale; a missing locale shows the default.
 * @returns The content of the locale.
 */
export function LocaleVariant({
  locale,
  variants,
}: {
  locale: TuwaLocale;
  variants: Partial<Record<TuwaLocale, ReactNode>> & { en: ReactNode };
}) {
  return <>{variants[locale] ?? variants[DEFAULT_LOCALE]}</>;
}
