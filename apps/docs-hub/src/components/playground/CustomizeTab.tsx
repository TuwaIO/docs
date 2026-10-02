'use client';

import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

import {
  CONNECT_LABEL_MAX_LENGTH,
  DEFAULT_CUSTOMIZATION,
  type NovaCustomization,
  STYLE_KITS,
  type StyleKit,
  TOAST_POSITIONS,
} from '@/lib/playground/customization';

import { Choice, Group } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';
import { ThemeEditor } from './ThemeEditor';

// The settings that are switched on and off
type Flag = {
  [Key in keyof NovaCustomization]: NovaCustomization[Key] extends boolean ? Key : never;
}[keyof NovaCustomization];

const COMPONENTS: { flag: Flag; label: string; api: string }[] = [
  { flag: 'historyIcons', label: 'Icons by transaction type in the history', api: 'HistoryItem' },
  { flag: 'confirmationsBar', label: 'Confirmations as a bar in the toasts', api: 'ConfirmationsBadge' },
  { flag: 'emptyHistory', label: 'Illustrated empty history', api: 'Placeholder' },
];

const BEHAVIOR: { flag: Flag; label: string; api: string }[] = [
  { flag: 'withBalance', label: 'Balance in the connect button', api: 'withBalance' },
  { flag: 'withChain', label: 'Network selector', api: 'withChain' },
  { flag: 'popularWallet', label: 'Nebula Wallet in a "Popular" group', api: 'popularConnectors' },
  { flag: 'legalLinks', label: 'Terms and privacy links', api: 'legal' },
  { flag: 'trackingModal', label: 'Tracking modal on submission', api: 'features.trackingTxModal' },
  { flag: 'autoCloseToasts', label: 'Close the toasts after 5 seconds', api: 'autoClose' },
  { flag: 'logButtonClicks', label: 'Log connect button clicks to Events', api: 'handlers.onButtonClick' },
];

function Layer({ title, api, open, children }: { title: string; api: string; open?: boolean; children: ReactNode }) {
  return (
    <details
      open={open}
      className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{title}</span>
        <code className="truncate font-mono text-[11px] text-[var(--tuwa-text-tertiary)]">{api}</code>
      </summary>
      <div className="flex flex-col gap-4 border-t border-[var(--tuwa-border-primary)]/30 p-3 dark:border-white/[0.06]">
        {children}
      </div>
    </details>
  );
}

function Toggles({ items }: { items: { flag: Flag; label: string; api: string }[] }) {
  const { customization, changeCustomization } = usePlayground();

  return (
    <div className="flex flex-col gap-2">
      {items.map(({ flag, label, api }) => (
        <label key={flag} className="flex cursor-pointer items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={customization[flag]}
            onChange={(event) => changeCustomization({ [flag]: event.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--tuwa-text-accent)]"
          />
          <span className="flex min-w-0 flex-col">
            <span className="text-[var(--tuwa-text-primary)]">{label}</span>
            <code className="font-mono text-[11px] text-[var(--tuwa-text-tertiary)]">{api}</code>
          </span>
        </label>
      ))}
    </div>
  );
}

/**
 * The customization of Nova UI Kit in its layers: the theme variables, class names, replaced components, texts and
 * provider options. Changes apply to the stage at once; the Code tab shows them as files for an app.
 */
export function CustomizeTab() {
  const { settings, customization, changeCustomization, resetCustomization } = usePlayground();
  const customized = JSON.stringify(customization) !== JSON.stringify(DEFAULT_CUSTOMIZATION);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">
        Nova UI Kit is customized in layers, from CSS variables to your own components. Each control names the prop it
        sets; the Code tab has the files.
      </p>
      {settings.ui === 'headless' && (
        <p className="rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-pending-bg)] px-3 py-2 text-xs text-[var(--tuwa-pending-text)]">
          The headless stage uses the theme only. Switch the UI to Nova UI Kit to see the other layers.
        </p>
      )}

      <Layer title="Theme" api="--tuwa-* variables" open>
        <ThemeEditor />
      </Layer>

      <Layer title="Style" api="customization.classNames">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(STYLE_KITS) as StyleKit[]).map((kit) => (
            <button
              key={kit}
              type="button"
              aria-pressed={customization.style === kit}
              onClick={() => changeCustomization({ style: kit })}
              className={cn(
                'flex cursor-pointer flex-col gap-1 rounded-[var(--tuwa-rounded-corners)] border p-3 text-left transition-colors',
                customization.style === kit
                  ? 'border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10'
                  : 'border-[var(--tuwa-border-primary)]/50 hover:border-[var(--tuwa-border-primary)] dark:border-white/10',
                kit === 'mono' && 'font-mono',
              )}
            >
              <span className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{STYLE_KITS[kit].label}</span>
              <span className="text-xs text-[var(--tuwa-text-secondary)]">{STYLE_KITS[kit].description}</span>
            </button>
          ))}
        </div>
      </Layer>

      <Layer title="Components" api="customization.components">
        <Toggles items={COMPONENTS} />
      </Layer>

      <Layer title="Texts" api="labels">
        <Group label="Language" compact>
          <Choice
            pressed={customization.language === 'en'}
            onClick={() => changeCustomization({ language: 'en' })}
            compact
          >
            English
          </Choice>
          <Choice
            pressed={customization.language === 'uk'}
            onClick={() => changeCustomization({ language: 'uk' })}
            compact
          >
            Українська
          </Choice>
        </Group>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--tuwa-text-secondary)]">
          <span>
            Connect button text <code className="font-mono text-[11px]">connectWallet</code>
          </span>
          <input
            type="text"
            value={customization.connectLabel}
            maxLength={CONNECT_LABEL_MAX_LENGTH}
            placeholder={customization.language === 'uk' ? 'Підключити Гаманець' : 'Connect Wallet'}
            onChange={(event) => changeCustomization({ connectLabel: event.target.value })}
            className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 bg-transparent px-3 py-2 text-sm text-[var(--tuwa-text-primary)] outline-none focus:border-[var(--tuwa-text-accent)] dark:border-white/10"
          />
        </label>
      </Layer>

      <Layer title="Behavior" api="provider props, handlers">
        <Toggles items={BEHAVIOR} />
        <label className="flex flex-col gap-1.5 text-xs text-[var(--tuwa-text-secondary)]">
          <span>
            Toast position <code className="font-mono text-[11px]">position</code>
          </span>
          <select
            value={customization.toastPosition}
            onChange={(event) => {
              const position = TOAST_POSITIONS.find((value) => value === event.target.value);
              if (position) changeCustomization({ toastPosition: position });
            }}
            className="cursor-pointer rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 bg-[var(--tuwa-bg-primary)] px-3 py-2 text-sm text-[var(--tuwa-text-primary)] dark:border-white/10"
          >
            {TOAST_POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </label>
      </Layer>

      {customized && (
        <button
          type="button"
          onClick={resetCustomization}
          className="self-start text-xs text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
        >
          Reset to Nova as it ships
        </button>
      )}
    </div>
  );
}
