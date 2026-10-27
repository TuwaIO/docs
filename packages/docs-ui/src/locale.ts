/**
 * Locale primitives shared by the TUWA sites (docs hub, website, Quasar dashboard). Pure functions without React and
 * without a `'use client'` directive, so server code (metadata, sitemaps) can call them too.
 *
 * Privacy: the locale is resolved from signals the browser already has (Local Storage, `navigator.languages`, the
 * time zone). No GeoIP lookup, no cookie and no request is ever made.
 */

/** A locale of the TUWA sites. */
export type TuwaLocale = 'en' | 'uk' | 'zh-CN';

/** Every supported locale, the default first. */
export const TUWA_LOCALES: readonly TuwaLocale[] = ['en', 'uk', 'zh-CN'];

/** The locale used on the server and when nothing else matches. */
export const DEFAULT_LOCALE: TuwaLocale = 'en';

/**
 * Local Storage key of the locale the visitor picked. Shared by every TUWA site, so a choice on one origin of the same
 * site is kept; list it in `PreferenceExpiry` to forget it after 30 days (Cookie Policy).
 */
export const LOCALE_STORAGE_KEY = 'tuwa-locale';

const UKRAINE_TIMEZONES = new Set([
  'europe/kyiv',
  'europe/kiev',
  'europe/uzhgorod',
  'europe/zaporozhye',
  'europe/simferopol',
]);

const CHINA_TIMEZONES = new Set([
  'asia/shanghai',
  'asia/chongqing',
  'asia/harbin',
  'asia/urumqi',
  'asia/beijing',
  'prc',
]);

const MASKED_TIMEZONES = new Set(['', 'utc', 'gmt', 'etc/utc', 'etc/gmt']);

/** Whether a tag names Ukraine as its region (`ru-UA`, `en-UA`). */
function hasUkraineRegion(tag: string): boolean {
  return /(?:^|[-_])ua(?:$|[-_])/.test(tag);
}

/** Whether a tag names Simplified Chinese or mainland China (`zh`, `zh-CN`, `zh-Hans`, `zh-Hans-CN`). */
function isSimplifiedChinese(tag: string): boolean {
  if (tag === 'zh' || tag === 'zh-cn' || tag === 'zh_cn' || tag.startsWith('zh-hans') || tag.startsWith('zh_hans')) {
    return true;
  }
  // Traditional Chinese (zh-TW, zh-HK, zh-Hant) is not served: those readers get English
  return tag.startsWith('zh-') && !/hant|tw|hk|mo/.test(tag);
}

/**
 * Maps a language tag or a stored value to a supported locale.
 *
 * @param tag - A BCP 47 tag (`uk-UA`, `zh-Hans`, `en-US`), a region alias (`ua`) or a stored value.
 * @returns The matching {@link TuwaLocale}, or `null` when the tag names none.
 */
export function normalizeLocale(tag: string | null | undefined): TuwaLocale | null {
  if (!tag) return null;
  const lower = tag.trim().toLowerCase();
  if (!lower) return null;
  if (lower === 'uk' || lower === 'ua' || lower.startsWith('uk-') || lower.startsWith('uk_')) return 'uk';
  if (isSimplifiedChinese(lower)) return 'zh-CN';
  if (lower === 'en' || lower.startsWith('en-') || lower.startsWith('en_')) return 'en';
  return null;
}

/**
 * Browser signals read by {@link detectLocale}. Each is optional, so tests and server code can pass what they have.
 */
export interface LocaleSignals {
  /** The locale saved under {@link LOCALE_STORAGE_KEY}. */
  stored?: string | null;
  /** `navigator.languages`, or `[navigator.language]`. */
  languages?: readonly string[];
  /** IANA time zone, `Intl.DateTimeFormat().resolvedOptions().timeZone`. */
  timeZone?: string;
  /** Locale of the system, `Intl.DateTimeFormat().resolvedOptions().locale`. */
  systemLocale?: string;
  /** Offset of January 1 in minutes, `new Date(year, 0, 1).getTimezoneOffset()`. */
  januaryOffset?: number;
  /** Offset of July 1 in minutes, `new Date(year, 6, 1).getTimezoneOffset()`. */
  julyOffset?: number;
}

/**
 * Picks the locale from browser signals, in this order:
 * 1. The locale the visitor picked (`stored`).
 * 2. Ukrainian or Simplified Chinese in the browser languages, in the order the visitor ranked them.
 * 3. A Ukrainian time zone, or a language or system locale with the region Ukraine (`ru-UA`, `en-UA`).
 * 4. A mainland China time zone or system locale.
 * 5. Russian with a masked time zone (UTC) and the Eastern European offsets (UTC+2 in winter, UTC+3 in summer).
 * 6. English.
 *
 * @param signals - What the browser exposes.
 * @returns The resolved {@link TuwaLocale}.
 */
export function detectLocale(signals: LocaleSignals): TuwaLocale {
  const stored = normalizeLocale(signals.stored);
  if (stored) return stored;

  const languages = (signals.languages ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  for (const tag of languages) {
    const locale = normalizeLocale(tag);
    if (locale === 'uk' || locale === 'zh-CN') return locale;
    // The first explicit English ranks above every regional heuristic below
    if (locale === 'en' && !hasUkraineRegion(tag)) break;
  }

  const timeZone = (signals.timeZone ?? '').trim().toLowerCase();
  const systemLocale = (signals.systemLocale ?? '').trim().toLowerCase();
  const explicitEnglish = languages.some((tag) => normalizeLocale(tag) === 'en' && !hasUkraineRegion(tag));

  if (UKRAINE_TIMEZONES.has(timeZone) || hasUkraineRegion(systemLocale) || languages.some(hasUkraineRegion)) {
    return 'uk';
  }
  if (CHINA_TIMEZONES.has(timeZone) || (systemLocale && isSimplifiedChinese(systemLocale))) {
    return 'zh-CN';
  }
  if (
    !explicitEnglish &&
    MASKED_TIMEZONES.has(timeZone) &&
    languages.some((tag) => tag === 'ru' || tag.startsWith('ru-')) &&
    signals.januaryOffset === -120 &&
    signals.julyOffset === -180
  ) {
    return 'uk';
  }
  return DEFAULT_LOCALE;
}

/**
 * Reads the browser signals and resolves the locale with {@link detectLocale}. Returns {@link DEFAULT_LOCALE} on the
 * server. Never throws: blocked storage or a missing `Intl` only drop that signal.
 *
 * @param storageKey - Local Storage key of the picked locale (default: {@link LOCALE_STORAGE_KEY}).
 * @returns The resolved {@link TuwaLocale}.
 */
export function resolveClientLocale(storageKey: string = LOCALE_STORAGE_KEY): TuwaLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const signals: LocaleSignals = {};

  try {
    signals.stored = window.localStorage.getItem(storageKey);
  } catch {
    // Storage blocked (strict private mode)
  }
  try {
    if (typeof navigator !== 'undefined') {
      signals.languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    }
  } catch {
    // No navigator
  }
  try {
    const options = Intl.DateTimeFormat().resolvedOptions();
    signals.timeZone = options.timeZone;
    signals.systemLocale = options.locale;
    const year = new Date().getFullYear();
    signals.januaryOffset = new Date(year, 0, 1).getTimezoneOffset();
    signals.julyOffset = new Date(year, 6, 1).getTimezoneOffset();
  } catch {
    // No Intl
  }
  return detectLocale(signals);
}

/**
 * Replaces `{name}` tokens of a template with values, as the labels of Nova UI Kit do. Unknown tokens stay.
 *
 * @param template - Text with `{name}` tokens.
 * @param values - Values by token name.
 * @returns The text with the values in place.
 */
export function formatLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/**
 * The language of the TUWA policies for a site locale: policies exist in English and Ukrainian only.
 *
 * @param locale - The site locale.
 * @returns `uk` for Ukrainian, `en` otherwise.
 */
export function policyLanguageOf(locale: TuwaLocale): 'en' | 'uk' {
  return locale === 'uk' ? 'uk' : 'en';
}
