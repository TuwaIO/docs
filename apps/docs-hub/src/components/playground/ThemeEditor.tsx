'use client';

import { cn, CopyIcon, useCopyToClipboard } from '@tuwaio/nova-core';

import { useI18n } from '@/i18n';
import {
  BADGE_CORNERS,
  LENGTH_VARIABLES,
  scanlineFor,
  THEME_GROUPS,
  THEME_PRESETS,
  themeCss,
  type ThemeVariable,
} from '@/lib/playground/themes';

import { Choice } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';
import { capsClassName, fieldClassName } from './playgroundStyles';

const LENGTH_LIMITS: Partial<Record<ThemeVariable, number>> = {
  '--tuwa-rounded-corners': 24,
  '--tuwa-ring-width': 4,
};

/**
 * The theme editor: the presets, every Nova variable of the stage, and the CSS to paste into an app after the Nova
 * styles. Edits apply to the stage at once and are dropped when another preset is picked. A color is a color field; a
 * length is a slider. Three variables have a control of their own, because a color field cannot hold their values: the
 * corners of badges are square or round, the scanlines are on (the faint lines of Nova, a color with an alpha) or off,
 * and the fill of a standard button is a color or none (`transparent`).
 */
export function ThemeEditor() {
  const { t } = useI18n();
  const { settings, theme, themeEdited, changeSettings, editTheme, resetThemeEdits } = usePlayground();
  const { isCopied, copy } = useCopyToClipboard(2000);
  const preset = THEME_PRESETS[settings.theme];
  const cust = t.playground.inspector.customize;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        {Object.values(THEME_PRESETS).map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={settings.theme === option.id}
            onClick={() => changeSettings({ theme: option.id })}
            className={cn(
              'flex cursor-pointer flex-col gap-2 border p-3 text-left transition-colors',
              settings.theme === option.id
                ? 'border-[var(--tuwa-text-primary)] bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]'
                : 'border-[var(--tuwa-border-primary)] hover:border-[var(--tuwa-border-strong)]',
            )}
          >
            <span className="flex gap-1" aria-hidden="true">
              {(
                [
                  '--tuwa-bg-primary',
                  '--tuwa-text-primary',
                  '--tuwa-button-gradient-from',
                  '--tuwa-button-gradient-to',
                ] as const
              ).map((variable) => (
                <span
                  key={variable}
                  className="h-4 w-4 border border-[var(--tuwa-border-strong)]"
                  style={{ background: option.values[variable] }}
                />
              ))}
            </span>
            <span className="text-sm font-semibold text-[var(--tuwa-text-primary)]">
              {cust.themePresets[option.id]?.label ?? option.label}
            </span>
            <span className="text-xs text-[var(--tuwa-text-secondary)]">
              {cust.themePresets[option.id]?.description ?? option.description}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => copy(themeCss(theme, themeEdited ? `${preset.label} ${cust.editedSuffix}` : preset.label))}
          disabled={isCopied}
          className={cn(fieldClassName, 'disabled:cursor-default')}
        >
          <CopyIcon copied={isCopied} className="h-4 w-4" />
          {isCopied ? cust.cssCopied : cust.copyCss}
        </button>
        {themeEdited && (
          <button
            type="button"
            onClick={resetThemeEdits}
            className="text-xs text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
          >
            {cust.resetEdits}
          </button>
        )}
      </div>

      {THEME_GROUPS.map((group) => (
        <fieldset key={group.label} className="min-w-0">
          <legend className={cn('mb-2 text-[var(--tuwa-text-secondary)]', capsClassName)}>
            {cust.themeGroups[group.label] ?? group.label}
          </legend>
          {/* Label and control side by side when the panel is wide enough, stacked on narrow screens */}
          <div className="@container flex flex-col gap-2">
            {group.variables.map((variable) => {
              const id = `theme-${variable.slice(2)}`;
              const label = variable.replace('--tuwa-', '');
              const row = 'grid grid-cols-1 gap-1.5 @2xs:grid-cols-[9rem_minmax(0,1fr)] @2xs:items-center @2xs:gap-3';
              const labelClass = 'font-mono text-xs text-[var(--tuwa-text-secondary)]';
              const valueClass = 'font-mono text-xs text-[var(--tuwa-text-secondary)]';
              if (variable === '--tuwa-rounded-full') {
                const round = theme[variable] !== BADGE_CORNERS.square;
                return (
                  <div key={variable} className={row} role="group" aria-label={label}>
                    <span className={labelClass}>{label}</span>
                    <div className="flex">
                      <Choice pressed={!round} onClick={() => editTheme(variable, BADGE_CORNERS.square)} compact>
                        {cust.themeSquare}
                      </Choice>
                      <Choice pressed={round} onClick={() => editTheme(variable, BADGE_CORNERS.round)} compact>
                        {cust.themeRound}
                      </Choice>
                    </div>
                  </div>
                );
              }
              if (variable === '--tuwa-scanline') {
                const on = theme[variable] !== 'transparent';
                return (
                  <div key={variable} className={row} role="group" aria-label={label}>
                    <span className={labelClass}>{label}</span>
                    <div className="flex">
                      <Choice pressed={on} onClick={() => editTheme(variable, scanlineFor(theme))} compact>
                        {cust.themeOn}
                      </Choice>
                      <Choice pressed={!on} onClick={() => editTheme(variable, 'transparent')} compact>
                        {cust.themeOff}
                      </Choice>
                    </div>
                  </div>
                );
              }
              if (variable === '--tuwa-standart-button-bg') {
                const none = theme[variable] === 'transparent';
                return (
                  <div key={variable} className={row}>
                    <label htmlFor={id} className={labelClass}>
                      {label}
                    </label>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                      <input
                        id={id}
                        type="color"
                        // With no fill the field shows what a fill would start from: the muted surface
                        value={none ? theme['--tuwa-bg-muted'] : theme[variable]}
                        onChange={(event) => editTheme(variable, event.target.value)}
                        className="h-7 w-10 shrink-0 cursor-pointer border border-[var(--tuwa-border-strong)] bg-transparent"
                      />
                      <span className={valueClass}>{theme[variable]}</span>
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--tuwa-text-secondary)]">
                        <input
                          type="checkbox"
                          checked={none}
                          onChange={(event) =>
                            editTheme(variable, event.target.checked ? 'transparent' : theme['--tuwa-bg-muted'])
                          }
                          className="h-4 w-4 shrink-0 cursor-pointer accent-[var(--tuwa-text-accent)]"
                        />
                        {cust.themeNone}
                      </label>
                    </div>
                  </div>
                );
              }
              if (LENGTH_VARIABLES.includes(variable)) {
                return (
                  <div key={variable} className={row}>
                    <label htmlFor={id} className={labelClass}>
                      {label}
                    </label>
                    <div className="flex min-w-0 items-center gap-3">
                      <input
                        id={id}
                        type="range"
                        min={0}
                        max={LENGTH_LIMITS[variable]}
                        value={Number.parseInt(theme[variable], 10)}
                        onChange={(event) => editTheme(variable, `${event.target.value}px`)}
                        className="h-5 min-w-0 flex-1 cursor-pointer accent-[var(--tuwa-text-accent)]"
                      />
                      <span className={cn('w-10 shrink-0 text-right', valueClass)}>{theme[variable]}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={variable} className={row}>
                  <label htmlFor={id} className={labelClass}>
                    {label}
                  </label>
                  <div className="flex min-w-0 items-center gap-2">
                    <input
                      id={id}
                      type="color"
                      value={theme[variable]}
                      onChange={(event) => editTheme(variable, event.target.value)}
                      className="h-7 w-10 shrink-0 cursor-pointer border border-[var(--tuwa-border-strong)] bg-transparent"
                    />
                    <span className={valueClass}>{theme[variable]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
