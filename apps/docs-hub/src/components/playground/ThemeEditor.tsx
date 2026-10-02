'use client';

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';

import { LENGTH_VARIABLES, THEME_GROUPS, THEME_PRESETS, themeCss, type ThemeVariable } from '@/lib/playground/themes';

import { usePlayground } from './PlaygroundContext';

const LENGTH_LIMITS: Partial<Record<ThemeVariable, number>> = {
  '--tuwa-rounded-corners': 24,
  '--tuwa-ring-width': 4,
};

/**
 * The theme editor: the presets, every Nova variable of the stage, and the CSS to paste into an app after the Nova
 * styles. Edits apply to the stage at once and are dropped when another preset is picked.
 */
export function ThemeEditor() {
  const { settings, theme, themeEdited, changeSettings, editTheme, resetThemeEdits } = usePlayground();
  const { isCopied, copy } = useCopyToClipboard(2000);
  const preset = THEME_PRESETS[settings.theme];

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
              'flex flex-col gap-2 rounded-[var(--tuwa-rounded-corners)] border p-3 text-left transition-colors cursor-pointer',
              settings.theme === option.id
                ? 'border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10'
                : 'border-[var(--tuwa-border-primary)]/50 dark:border-white/10 hover:border-[var(--tuwa-border-primary)]',
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
                  className="h-4 w-4 rounded-full border border-black/10 dark:border-white/20"
                  style={{ background: option.values[variable] }}
                />
              ))}
            </span>
            <span className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{option.label}</span>
            <span className="text-xs text-[var(--tuwa-text-secondary)]">{option.description}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => copy(themeCss(theme, themeEdited ? `${preset.label} (edited)` : preset.label))}
          disabled={isCopied}
          className="inline-flex items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/50 cursor-pointer disabled:cursor-default"
        >
          {isCopied ? (
            <CheckIcon className="h-4 w-4 text-emerald-500" />
          ) : (
            <ClipboardDocumentIcon className="h-4 w-4" />
          )}
          {isCopied ? 'CSS copied' : 'Copy CSS'}
        </button>
        {themeEdited && (
          <button
            type="button"
            onClick={resetThemeEdits}
            className="text-xs text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
          >
            Reset edits
          </button>
        )}
      </div>

      {THEME_GROUPS.map((group) => (
        <fieldset key={group.label} className="min-w-0">
          <legend className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
            {group.label}
          </legend>
          {/* Label and control side by side when the panel is wide enough, stacked on narrow screens */}
          <div className="@container flex flex-col gap-2">
            {group.variables.map((variable) => {
              const id = `theme-${variable.slice(2)}`;
              const label = variable.replace('--tuwa-', '');
              const row = 'grid grid-cols-1 gap-1.5 @2xs:grid-cols-[9rem_minmax(0,1fr)] @2xs:items-center @2xs:gap-3';
              const labelClass = 'font-mono text-xs text-[var(--tuwa-text-secondary)]';
              const valueClass = 'font-mono text-xs text-[var(--tuwa-text-tertiary)]';
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
                      className="h-7 w-10 shrink-0 cursor-pointer rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/50 bg-transparent"
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
