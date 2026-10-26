'use client';

import { cn } from '@tuwaio/nova-core/utils';
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

/**
 * Built-in vector SVG flag for the United Kingdom / English language.
 * Rendered locally without external network requests or third-party image dependencies.
 *
 * @param props - Component properties.
 * @param props.className - Optional CSS classes for dimensioning and positioning.
 * @returns An SVG element representing the Union Jack.
 * @internal
 */
function FlagUK({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="m75 0 245 180L565 0h75v60L435 240l205 180v60h-75L320 300 75 480H0v-60l205-180L0 60V0h75z" />
      <path
        fill="#C8102E"
        d="m425 285 215 165v30h-35L380 300l45-15zM215 195 0 30v-30h35l225 180-45 15zm0 90L0 450v30h35l225-180-45-15zm210-90L640 30v-30h-35L380 180l45 15z"
      />
      <path fill="#FFF" d="M250 0h140v480H250zM0 170h640v140H0z" />
      <path fill="#C8102E" d="M276 0h88v480h-88zM0 196h640v88H0z" />
    </svg>
  );
}

/**
 * Built-in vector SVG flag for Ukraine / Ukrainian language.
 * Rendered locally without external network requests or third-party image dependencies.
 *
 * @param props - Component properties.
 * @param props.className - Optional CSS classes for dimensioning and positioning.
 * @returns An SVG element representing the Ukrainian national flag.
 * @internal
 */
function FlagUkraine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <path fill="#0057b7" d="M0 0h640v240H0z" />
      <path fill="#ffd700" d="M0 240h640v240H0z" />
    </svg>
  );
}

/**
 * Built-in vector SVG flag for China / Simplified Chinese language.
 * Rendered locally without external network requests or third-party image dependencies.
 *
 * @param props - Component properties.
 * @param props.className - Optional CSS classes for dimensioning and positioning.
 * @returns An SVG element representing the Chinese national flag.
 * @internal
 */
function FlagChina({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <rect width="640" height="480" fill="#ee1c25" />
      <path
        fill="#ffde00"
        d="M120 72l14.1 43.4H180l-36.9 26.8 14.1 43.4-37.2-26.8-37.2 26.8 14.1-43.4L60 115.4h45.9z"
      />
      <circle cx="200" cy="40" r="12" fill="#ffde00" />
      <circle cx="240" cy="80" r="12" fill="#ffde00" />
      <circle cx="240" cy="140" r="12" fill="#ffde00" />
      <circle cx="200" cy="180" r="12" fill="#ffde00" />
    </svg>
  );
}

/**
 * Animated chevron arrow matching the exact motion curves and transitions of Nova UI Kit's `ChevronArrowWithAnim`.
 *
 * Rationale: Instead of a generic 180-degree rotation that causes visual disorientation in compact navigation bars,
 * this component smoothly translates along the Y-axis (±3px), scales vertically (`scaleY(0.8)`), and fades opacity
 * over a 400ms ease-out curve. Fully respects WCAG 2.3.3 via `motion-reduce:transition-none`.
 *
 * @param props - Component properties.
 * @param props.isOpen - Whether the parent dropdown menu is open.
 * @param props.className - Optional additional CSS classes.
 * @returns A composite animated chevron indicator.
 * @internal
 */
function ChevronArrowWithAnim({ isOpen, className }: { isOpen: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'tuwadocs:relative tuwadocs:inline-flex tuwadocs:h-3.5 tuwadocs:w-3.5 tuwadocs:items-center tuwadocs:justify-center tuwadocs:overflow-hidden tuwadocs:shrink-0',
        className,
      )}
      aria-hidden="true"
    >
      {/* Down Chevron */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        stroke="currentColor"
        className={cn(
          'tuwadocs:absolute tuwadocs:h-3.5 tuwadocs:w-3.5 tuwadocs:transition-all tuwadocs:duration-400 tuwadocs:ease-out tuwadocs:motion-reduce:transition-none tuwadocs:motion-reduce:transform-none',
          isOpen
            ? 'tuwadocs:opacity-0 -tuwadocs:translate-y-[3px] tuwadocs:scale-y-[0.8] tuwadocs:pointer-events-none'
            : 'tuwadocs:opacity-100 tuwadocs:translate-y-0 tuwadocs:scale-y-100',
        )}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>

      {/* Up Chevron */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        stroke="currentColor"
        className={cn(
          'tuwadocs:absolute tuwadocs:h-3.5 tuwadocs:w-3.5 tuwadocs:transition-all tuwadocs:duration-400 tuwadocs:ease-out tuwadocs:motion-reduce:transition-none tuwadocs:motion-reduce:transform-none',
          isOpen
            ? 'tuwadocs:opacity-100 tuwadocs:translate-y-0 tuwadocs:scale-y-100'
            : 'tuwadocs:opacity-0 tuwadocs:translate-y-[3px] tuwadocs:scale-y-[0.8] tuwadocs:pointer-events-none',
        )}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
      </svg>
    </span>
  );
}

/**
 * Returns a locally embedded SVG flag node for a given locale code.
 *
 * Supported built-in codes:
 * - English: `'en'`, `'en-US'`, `'en-GB'`
 * - Ukrainian: `'uk'`, `'ua'`
 * - Chinese: `'zh'`, `'zh-CN'`, `'zh-Hans'`
 *
 * @param code - The BCP-47 or ISO language tag (e.g. `'en'`, `'uk'`, `'zh-CN'`).
 * @returns The SVG icon node or `undefined` if no built-in flag is available.
 */
export function getLocaleFlag(code: string): ReactNode {
  const normalized = code.toLowerCase();
  const flagClass =
    'tuwadocs:h-3 tuwadocs:w-4 tuwadocs:rounded-[2px] tuwadocs:object-cover tuwadocs:shadow-xs tuwadocs:border tuwadocs:border-black/10 tuwadocs:dark:border-white/20 tuwadocs:shrink-0';
  if (normalized === 'en' || normalized === 'en-us' || normalized === 'en-gb') {
    return <FlagUK className={flagClass} />;
  }
  if (normalized === 'uk' || normalized === 'ua') {
    return <FlagUkraine className={flagClass} />;
  }
  if (normalized === 'zh' || normalized === 'zh-cn' || normalized === 'zh-hans') {
    return <FlagChina className={flagClass} />;
  }
  return undefined;
}

/**
 * A supported locale option for {@link LocaleSwitcher}.
 */
export interface LocaleOption {
  /** The language tag or locale code, for example `'en'`, `'uk'`, or `'zh-CN'`. */
  code: string;
  /** Full native name of the language, for example `'English'`, `'Українська'`, or `'简体中文'`. */
  label: string;
  /** Short label displayed on the compact trigger button, for example `'EN'`, `'UK'`, or `'ZH'`. */
  short?: string;
  /** Optional custom flag element. If omitted, built-in vector flags are used. */
  flag?: ReactNode;
}

/**
 * Default list of supported locales across the TUWA documentation ecosystem.
 */
export const DEFAULT_LOCALES: readonly LocaleOption[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'uk', label: 'Українська', short: 'UK' },
  { code: 'zh-CN', label: '简体中文', short: 'ZH' },
] as const;

/**
 * Props of {@link LocaleSwitcher}.
 */
export interface LocaleSwitcherProps {
  /** The currently active locale code (e.g. `'en'`, `'uk'`). */
  locale: string;
  /** Callback fired when a new locale is selected by the user. */
  onSelect: (code: string) => void;
  /** The list of available locales. Defaults to {@link DEFAULT_LOCALES}. */
  locales?: readonly LocaleOption[] | LocaleOption[];
  /** Preferred placement of the dropdown menu (`'auto'`, `'bottom'`, or `'top'`). Defaults to `'auto'`. */
  placement?: 'auto' | 'bottom' | 'top';
  /** Optional additional CSS classes for the root container. */
  className?: string;
  /** Accessible name for the button and listbox. Defaults to `'Select language'`. */
  ariaLabel?: string;
  /**
   * Whether to render an invisible native `<select>` overlay on mobile touch devices (`pointer: coarse`).
   * When `true`, tapping on iOS or Android summons the native system wheel/sheet picker.
   * Defaults to `true`.
   */
  nativeTouch?: boolean;
}

/**
 * Resolves the intended English/Latin letter from a keyboard event regardless of the user's active keyboard layout.
 *
 * Architectural Rationale:
 * Users frequently navigate documentation while their operating system keyboard input source is set to a non-Latin
 * script (such as Ukrainian, Russian, Greek, or Arabic). In these layouts, pressing the physical keycap "E" produces
 * `event.key === 'у'` (Cyrillic U), which previously caused "E" to jump to "Українська" instead of English, while
 * pressing "Z" produced `'я'` and was dropped completely.
 *
 * This function enforces layout-independence by:
 * 1. Prioritizing standard ASCII Latin characters (`/^[a-zA-Z]$/`) if the user is already on a Latin layout (QWERTY, AZERTY, Dvorak).
 * 2. Falling back to the physical key position via `event.code` (`'KeyE'` -> `'e'`, `'KeyZ'` -> `'z'`, `'KeyU'` -> `'u'`)
 *    whenever `event.key` emits a non-Latin character.
 *
 * @param event - The React keyboard event.
 * @returns The lowercase Latin character (e.g. `'e'`, `'z'`, `'u'`) or `null` if not an alphanumeric key.
 * @internal
 */
function resolveLatinChar(event: KeyboardEvent<HTMLElement>): string | null {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }
  // 1. If event.key is already an ASCII Latin letter, use it directly (respects AZERTY, Dvorak, etc.)
  if (/^[a-zA-Z]$/.test(event.key)) {
    return event.key.toLowerCase();
  }
  // 2. If event.key is non-Latin, read the physical key from event.code (e.g. 'KeyE' -> 'e', 'KeyZ' -> 'z')
  if (event.code && event.code.startsWith('Key')) {
    return event.code.slice(3).toLowerCase();
  }
  return null;
}

/**
 * Checks whether a locale option matches an intended English/Latin search character.
 *
 * Matches against:
 * 1. The locale code prefix (e.g. `'en'`, `'es'`).
 * 2. The short label prefix (e.g. `'EN'`, `'ZH'`).
 * 3. The full native label prefix (e.g. `'English'`, `'Deutsch'`).
 * 4. Common phonetic/international aliases (e.g. `'z'` and `'c'` for Chinese, `'u'` for Ukrainian, `'s'` for Spanish, `'g'` for German).
 *
 * @param item - The locale option to inspect.
 * @param char - The lowercase Latin character to match against.
 * @returns `true` if the locale matches the search character.
 * @internal
 */
function matchesLocaleOption(item: LocaleOption, char: string): boolean {
  const code = item.code.toLowerCase();
  const short = (item.short ?? '').toLowerCase();
  const label = item.label.toLowerCase();

  // Direct prefix matches on code, short label, or full native name
  if (code.startsWith(char) || short.startsWith(char) || label.startsWith(char)) {
    return true;
  }

  // Chinese aliases: both 'z' (ZH, Zhongwen) and 'c' (Chinese, CN)
  if ((code.startsWith('zh') || short === 'zh') && (char === 'z' || char === 'c')) {
    return true;
  }

  // Ukrainian aliases: 'u' (UK, UA, Ukrainian)
  if ((code.startsWith('uk') || code.startsWith('ua') || short === 'uk' || short === 'ua') && char === 'u') {
    return true;
  }

  // Spanish aliases: 's' (Spanish)
  if ((code.startsWith('es') || short === 'es') && char === 's') {
    return true;
  }

  // German aliases: 'g' (German)
  if ((code.startsWith('de') || short === 'de') && char === 'g') {
    return true;
  }

  return false;
}

/**
 * A glassmorphic language select dropdown matching the visual footprint, theme variables, and interaction
 * standards of `ThemeSwitcher`.
 *
 * ### Architectural Features:
 * - **Zero Layout Shift:** Rigid static dimensions (`w-[5.25rem] md:w-[4.75rem]`) and fixed-width label slots
 *   prevent any layout reflow or navigation jumping when switching between language codes of varying character widths.
 * - **Nova Motion Language:** Chevron arrow utilizes directional vertical translation (±3px), vertical scale
 *   compression (`scaleY(0.8)`), and opacity curves matching Nova UI Kit's `ChevronArrowWithAnim`.
 * - **Flush Edge Indicator:** Replaced traditional checkboxes with a flush, zero-margin left-edge blue accent bar
 *   and glowing status indicator, cleanly abutting the dropdown boundary.
 * - **Collision Detection & Dynamic Placement:** When configured with `'auto'` placement, dynamically calculates
 *   available viewport clearance below the trigger button. If rendered inside a mobile sheet, drawer, or footer
 *   with insufficient bottom clearance, it automatically opens upwards (`bottom-full`).
 * - **Layout-Independent Latin Typeahead (WCAG 2.1.1):** Normalizes keystrokes through physical `event.code`
 *   to ensure keys like `E`, `U`, and `Z` reliably navigate to English, Ukrainian, and Chinese regardless of the user's
 *   active OS keyboard layout.
 * - **Native Touch Device Support (`pointer: coarse`):** On mobile devices, an invisible native `<select>` overlay
 *   activates, triggering the operating system's native wheel picker (iOS Safari) or bottom sheet dialog (Android Chrome)
 *   with full system haptics and touch fluidness while retaining the custom visual trigger design.
 * - **WCAG 2.1 & 2.2 AA/AAA Compliance:**
 *   - WCAG 2.5.3 (Label in Name): The accessible name of the button begins with the visible label text.
 *   - WCAG 3.1.2 (Language of Parts): Every option specifies its native `lang` attribute for screen readers.
 *   - WCAG 2.4.7 (Focus Visible): High-contrast focus rings with distinct offset colors.
 *   - WCAG 2.3.3 (Animation from Interactions): `motion-reduce:transition-none` disables transitions for sensitive users.
 *   - WCAG 4.1.2 (Name, Role, Value): WAI-ARIA `listbox`, `option`, `aria-activedescendant`, and `aria-selected`.
 *
 * @param props - Component properties (see {@link LocaleSwitcherProps}).
 * @returns The rendered locale switcher trigger button, touch overlay, and dropdown menu.
 */
export function LocaleSwitcher({
  locale,
  onSelect,
  locales = DEFAULT_LOCALES,
  placement: placementProp = 'auto',
  className,
  ariaLabel = 'Select language',
  nativeTouch = true,
}: LocaleSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resolvedPlacement, setResolvedPlacement] = useState<'bottom' | 'top'>('bottom');
  const [isTouch, setIsTouch] = useState(false);

  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Detect primary touch pointer (smartphones, tablets) to conditionally engage native select overlay
    const query = window.matchMedia('(pointer: coarse)');
    const updateTouch = () => {
      setIsTouch(query.matches && !window.matchMedia('(pointer: fine)').matches);
    };
    updateTouch();

    query.addEventListener?.('change', updateTouch);
    return () => {
      query.removeEventListener?.('change', updateTouch);
    };
  }, []);

  /**
   * Recalculates available viewport space below the button to determine whether the dropdown
   * should open downwards or flip upwards (e.g. when in mobile bottom sheets).
   */
  const updatePlacement = () => {
    if (placementProp !== 'auto') {
      setResolvedPlacement(placementProp);
      return;
    }
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Estimate menu height: ~40px per option + container borders and margins
      const estimatedHeight = Math.min(locales.length * 40, 260) + 16;
      setResolvedPlacement(spaceBelow < estimatedHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  };

  /**
   * Opens the dropdown menu and initializes the active highlight to the currently selected locale.
   */
  const openMenu = () => {
    // On pure touch devices, the native select overlay handles user selection natively
    if (isTouch) return;
    updatePlacement();
    const currentIndex = locales.findIndex((item) => item.code === locale);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    setIsOpen(true);
  };

  /**
   * Closes the dropdown menu and returns keyboard focus to the trigger button.
   */
  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  /**
   * Selects a locale by code, closes the menu, and notifies the parent listener.
   *
   * @param code - The chosen language code.
   */
  const pickLocale = (code: string) => {
    closeMenu();
    if (code !== locale) {
      onSelect(code);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Automatically focus the listbox container so keyboard navigation immediately responds
    listRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  // Ensure active option is scrolled into view when navigating via arrow keys
  useEffect(() => {
    if (!isOpen) return;
    const activeEl = document.getElementById(`${listboxId}-option-${locales[activeIndex]?.code}`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, listboxId, locales]);

  /**
   * Unified keyboard navigation handler shared by both the trigger button and the listbox container.
   * Supports Arrow navigation, Home/End, Enter/Space, Escape, Tab, and Latin typeahead.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const last = locales.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
      } else {
        setActiveIndex((prev) => (prev < last ? prev + 1 : 0));
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : last));
      }
      return;
    }

    if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End' && isOpen) {
      event.preventDefault();
      setActiveIndex(last);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
      } else {
        const targetOption = locales[activeIndex];
        if (targetOption) {
          pickLocale(targetOption.code);
        }
      }
      return;
    }

    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
      }
      return;
    }

    if (event.key === 'Tab') {
      if (isOpen) {
        closeMenu();
      }
      return;
    }

    // Layout-independent English/Latin typeahead navigation (WCAG 2.1.1)
    const char = resolveLatinChar(event);
    if (char) {
      const matchAfter = locales.findIndex((item, idx) => idx > activeIndex && matchesLocaleOption(item, char));
      const matchFromStart = locales.findIndex((item) => matchesLocaleOption(item, char));
      const targetIndex = matchAfter >= 0 ? matchAfter : matchFromStart;

      if (targetIndex >= 0) {
        event.preventDefault();
        if (!isOpen) {
          updatePlacement();
          setActiveIndex(targetIndex);
          setIsOpen(true);
        } else {
          setActiveIndex(targetIndex);
        }
      }
    }
  };

  const defaultStyles =
    'tuwadocs:bg-black/5 tuwadocs:border-black/5 tuwadocs:hover:bg-black/10 tuwadocs:dark:bg-white/10 tuwadocs:dark:border-white/10 tuwadocs:dark:hover:bg-white/20';

  // Constant static dimensions to prevent any layout shift across languages
  const staticSize = 'tuwadocs:h-10 tuwadocs:w-[5.25rem] tuwadocs:md:h-8 tuwadocs:md:w-[4.75rem]';

  if (!mounted) {
    return (
      <div
        className={cn(
          'tuwadocs:relative tuwadocs:flex tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:opacity-0',
          staticSize,
          defaultStyles,
          className,
        )}
      />
    );
  }

  const activeOption = locales.find((item) => item.code === locale) ?? locales[0];
  const shortText = activeOption?.short ?? activeOption?.code?.slice(0, 2).toUpperCase() ?? 'EN';
  const activeFlag = activeOption?.flag ?? getLocaleFlag(activeOption?.code ?? 'en');

  return (
    <div ref={containerRef} className={cn('tuwadocs:relative tuwadocs:inline-block', className)}>
      {/* Native touch select overlay: on touch devices (pointer: coarse), sits directly over the button to open iOS/Android native pickers */}
      {nativeTouch && (
        <select
          value={locale}
          onChange={(event) => pickLocale(event.target.value)}
          aria-label={ariaLabel}
          tabIndex={isTouch ? 0 : -1}
          aria-hidden={!isTouch}
          className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:z-10 tuwadocs:h-full tuwadocs:w-full tuwadocs:cursor-pointer tuwadocs:appearance-none tuwadocs:border-none tuwadocs:bg-transparent tuwadocs:opacity-0 tuwadocs:outline-none tuwadocs:hidden tuwadocs:pointer-coarse:block tuwadocs:pointer-fine:hidden"
        >
          {locales.map((item) => (
            <option key={item.code} value={item.code} lang={item.code}>
              {item.label} ({item.short ?? item.code.toUpperCase()})
            </option>
          ))}
        </select>
      )}

      <button
        ref={buttonRef}
        type="button"
        tabIndex={isTouch ? -1 : 0}
        aria-hidden={isTouch ? true : undefined}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={cn(
          'tuwadocs:group tuwadocs:relative tuwadocs:flex tuwadocs:cursor-pointer tuwadocs:items-center tuwadocs:justify-between tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:px-2 tuwadocs:transition-all tuwadocs:duration-300 tuwadocs:ease-in-out tuwadocs:backdrop-blur-sm tuwadocs:border tuwadocs:motion-reduce:transition-none',
          'tuwadocs:focus-visible:ring-2 tuwadocs:focus-visible:ring-[var(--tuwa-text-accent)] tuwadocs:focus-visible:outline-none tuwadocs:focus-visible:ring-offset-1 tuwadocs:focus-visible:ring-offset-[var(--tuwa-bg-primary)]',
          staticSize,
          defaultStyles,
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
      >
        {/* Local Flag Icon */}
        <span
          aria-hidden="true"
          className="tuwadocs:flex tuwadocs:items-center tuwadocs:justify-center tuwadocs:shrink-0"
        >
          {activeFlag}
        </span>

        {/* Visible label starts accessible name, full language and action follow (WCAG 2.5.3) */}
        <span className="tuwadocs:w-5 tuwadocs:text-center tuwadocs:font-mono tuwadocs:text-xs tuwadocs:font-bold tuwadocs:tracking-tight tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:shrink-0">
          {shortText}
        </span>
        <span className="tuwadocs:sr-only">
          , {activeOption.label} — {ariaLabel}
        </span>

        {/* Nova-Style Animated Chevron Arrow */}
        <ChevronArrowWithAnim
          isOpen={isOpen}
          className="tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:group-hover:text-[var(--tuwa-text-primary)]"
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`${listboxId}-option-${locales[activeIndex]?.code}`}
          onKeyDown={handleKeyDown}
          className={cn(
            'tuwadocs:absolute tuwadocs:right-0 tuwadocs:z-50 tuwadocs:min-w-[12rem] tuwadocs:max-h-[min(20rem,60vh)] tuwadocs:overflow-y-auto tuwadocs:overflow-x-hidden tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:bg-[var(--tuwa-bg-primary)]/95 tuwadocs:p-0 tuwadocs:shadow-xl tuwadocs:backdrop-blur-md tuwadocs:outline-none',
            resolvedPlacement === 'top' ? 'tuwadocs:bottom-full tuwadocs:mb-1.5' : 'tuwadocs:top-full tuwadocs:mt-1.5',
          )}
        >
          {locales.map((item, i) => {
            const isSelected = item.code === locale;
            const isFocused = i === activeIndex;
            const flag = item.flag ?? getLocaleFlag(item.code);
            return (
              <button
                key={item.code}
                id={`${listboxId}-option-${item.code}`}
                type="button"
                role="option"
                lang={item.code}
                tabIndex={-1}
                aria-selected={isSelected}
                onClick={() => pickLocale(item.code)}
                onPointerMove={() => {
                  if (activeIndex !== i) setActiveIndex(i);
                }}
                className={cn(
                  'tuwadocs:relative tuwadocs:flex tuwadocs:w-full tuwadocs:cursor-pointer tuwadocs:items-center tuwadocs:justify-between tuwadocs:gap-2.5 tuwadocs:px-3.5 tuwadocs:py-2.5 tuwadocs:text-xs tuwadocs:transition-colors tuwadocs:outline-none',
                  'tuwadocs:focus-visible:ring-1 tuwadocs:focus-visible:ring-inset tuwadocs:focus-visible:ring-[var(--tuwa-text-accent)]',
                  isSelected
                    ? isFocused
                      ? 'tuwadocs:bg-gradient-to-r tuwadocs:from-[var(--tuwa-text-accent)]/25 tuwadocs:via-[var(--tuwa-text-accent)]/10 tuwadocs:to-transparent tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:font-bold'
                      : 'tuwadocs:bg-gradient-to-r tuwadocs:from-[var(--tuwa-text-accent)]/15 tuwadocs:via-[var(--tuwa-text-accent)]/5 tuwadocs:to-transparent tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:font-bold'
                    : isFocused
                      ? 'tuwadocs:bg-[var(--tuwa-bg-muted)]/70 tuwadocs:text-[var(--tuwa-text-primary)]'
                      : 'tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:hover:bg-[var(--tuwa-bg-muted)]/50 tuwadocs:hover:text-[var(--tuwa-text-primary)]',
                )}
              >
                {/* Flush left edge accent bar — directly on the outer container edge */}
                {isSelected && (
                  <span
                    className="tuwadocs:absolute tuwadocs:left-0 tuwadocs:top-0 tuwadocs:bottom-0 tuwadocs:w-[3px] tuwadocs:bg-[var(--tuwa-text-accent)] tuwadocs:shadow-[0_0_8px_var(--tuwa-text-accent)]"
                    aria-hidden="true"
                  />
                )}

                <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-2 tuwadocs:truncate">
                  {flag && (
                    <span aria-hidden="true" className="tuwadocs:shrink-0">
                      {flag}
                    </span>
                  )}
                  <span className="tuwadocs:truncate">{item.label}</span>
                </div>

                <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-1.5 tuwadocs:shrink-0">
                  <span
                    className={cn(
                      'tuwadocs:font-mono tuwadocs:text-[10px] tuwadocs:uppercase tuwadocs:px-1.5 tuwadocs:py-0.5 tuwadocs:rounded',
                      isSelected
                        ? 'tuwadocs:bg-[var(--tuwa-text-accent)]/15 tuwadocs:text-[var(--tuwa-text-accent)] tuwadocs:font-bold'
                        : 'tuwadocs:text-[var(--tuwa-text-tertiary)]',
                    )}
                  >
                    {item.short ?? item.code}
                  </span>
                  {isSelected && (
                    <span
                      className="tuwadocs:h-1.5 tuwadocs:w-1.5 tuwadocs:rounded-full tuwadocs:bg-[var(--tuwa-text-accent)] tuwadocs:shadow-[0_0_8px_var(--tuwa-text-accent)]"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
