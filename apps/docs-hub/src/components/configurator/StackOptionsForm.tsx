'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import { type ReactNode, useId } from 'react';

import { useI18n } from '@/i18n';
import { type Framework, normalizeStackOptions, type StackOptions } from '@/lib/configurator/generate';

const FRAMEWORKS: { id: Framework; label: string }[] = [
  { id: 'next', label: 'Next.js' },
  { id: 'vite', label: 'Vite + React' },
  { id: 'vanilla', label: 'Vanilla TS' },
];

/**
 * A toggle button of an option. Shared with the Playground controls.
 * @param props.pressed - Whether the option is on.
 * @param props.disabled - Whether it cannot be changed now.
 * @param props.onClick - Toggles or selects the option.
 * @param props.compact - The small variant.
 */
export function Choice({
  pressed,
  disabled,
  onClick,
  children,
  compact,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-[var(--tuwa-rounded-corners)] border font-medium transition-colors cursor-pointer disabled:cursor-not-allowed',
        // A selected option that another one requires stays readable; an unavailable one fades
        pressed ? 'disabled:opacity-70' : 'disabled:opacity-40',
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-sm',
        pressed
          ? 'border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10 text-[var(--tuwa-text-primary)]'
          : 'border-[var(--tuwa-border-primary)]/50 dark:border-white/10 text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-border-primary)]',
      )}
    >
      {children}
    </button>
  );
}

/**
 * A labelled group of {@link Choice} buttons. Shared with the Playground controls.
 * @param props.label - The legend.
 * @param props.hint - A line under the buttons, hidden in the compact variant.
 * @param props.info - What the group does, behind an "i" next to the legend: shown on hover, focus or tap.
 * @param props.compact - The small variant.
 */
export function Group({
  label,
  hint,
  info,
  children,
  compact,
}: {
  label: string;
  hint?: string;
  info?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const infoId = useId();
  return (
    <fieldset className={cn('relative flex flex-col', compact ? 'gap-1.5' : 'gap-2')}>
      <legend
        className={cn(
          'flex items-center gap-1 font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]',
          compact ? 'text-[10px] mb-1.5' : 'text-[11px] mb-2',
        )}
      >
        {label}
        {info && (
          <span className="group/info inline-flex">
            <button
              type="button"
              aria-label={`About ${label}`}
              aria-describedby={infoId}
              // Safari does not focus a tapped button, and hover is off on touch screens: the focus opens the tip there
              onClick={(event) => event.currentTarget.focus()}
              className="-m-1 rounded-full p-1 text-[var(--tuwa-text-tertiary)] hover:text-[var(--tuwa-text-primary)] focus-visible:text-[var(--tuwa-text-primary)] cursor-help"
            >
              <InformationCircleIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
            </button>
            {/* Placed against the group, so it opens under the legend, inside the panel */}
            <span
              role="tooltip"
              id={infoId}
              className="pointer-events-none absolute top-5 left-0 z-30 hidden w-64 max-w-[80vw] rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] px-3 py-2 text-xs font-normal leading-relaxed tracking-normal normal-case text-[var(--tuwa-text-secondary)] shadow-xl group-hover/info:block group-focus-within/info:block"
            >
              {info}
            </span>
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {hint && !compact && <p className="text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">{hint}</p>}
    </fieldset>
  );
}

/**
 * The options of the Stack Configurator: framework, chains, UI and features. Changes go through
 * `normalizeStackOptions`, so the form never shows a combination the generator does not support.
 * @param props.options - The current options.
 * @param props.onChange - Called with the new options.
 * @param props.compact - The small variant of the hub main page, without hints.
 */
export function StackOptionsForm({
  options,
  onChange,
  compact = false,
}: {
  options: StackOptions;
  onChange: (options: StackOptions) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const set = (patch: Partial<StackOptions>) => onChange(normalizeStackOptions({ ...options, ...patch }));
  const vanilla = options.framework === 'vanilla';

  return (
    <div className={cn('grid', compact ? 'grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4' : 'grid-cols-1 gap-6')}>
      <Group
        label={t.configurator.form.framework}
        hint={t.ui.configuratorExtra.frameworkHints[options.framework]}
        compact={compact}
      >
        {FRAMEWORKS.map(({ id, label }) => (
          <Choice key={id} pressed={options.framework === id} onClick={() => set({ framework: id })} compact={compact}>
            {label}
          </Choice>
        ))}
      </Group>

      <Group label={t.configurator.form.chains} hint={t.ui.configuratorExtra.chainsHintFull} compact={compact}>
        <Choice
          pressed={options.evm}
          // At least one family stays selected
          disabled={options.evm && !options.solana}
          onClick={() => set({ evm: !options.evm })}
          compact={compact}
        >
          EVM
        </Choice>
        <Choice
          pressed={options.solana}
          disabled={options.solana && !options.evm}
          onClick={() => set({ solana: !options.solana })}
          compact={compact}
        >
          Solana
        </Choice>
      </Group>

      <Group
        label={t.configurator.form.ui}
        hint={
          vanilla
            ? t.ui.configuratorExtra.uiHintVanilla
            : options.ui === 'nova'
              ? t.ui.configuratorExtra.uiHintNova
              : t.ui.configuratorExtra.uiHintHeadless
        }
        compact={compact}
      >
        <Choice
          pressed={options.ui === 'nova'}
          disabled={vanilla}
          onClick={() => set({ ui: 'nova' })}
          compact={compact}
        >
          {t.configurator.form.uiNova}
        </Choice>
        <Choice pressed={options.ui === 'headless'} onClick={() => set({ ui: 'headless' })} compact={compact}>
          {t.configurator.form.uiHeadless}
        </Choice>
      </Group>

      <Group
        label={t.ui.configuratorExtra.featuresLabel}
        hint={options.quasar ? t.ui.configuratorExtra.featuresHintQuasar : t.ui.configuratorExtra.featuresHintDefault}
        compact={compact}
      >
        <Choice
          pressed={options.siwx}
          disabled={options.quasar}
          onClick={() => set({ siwx: !options.siwx })}
          compact={compact}
        >
          {t.ui.configuratorExtra.siwxChoice}
        </Choice>
        <Choice pressed={options.quasar} onClick={() => set({ quasar: !options.quasar })} compact={compact}>
          {t.ui.configuratorExtra.quasarChoice}
        </Choice>
      </Group>
    </div>
  );
}
