'use client';

import { cn } from '@tuwaio/nova-core/utils';
import { InformationCircleIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { type ReactNode, useId } from 'react';

import { formatLabel, useI18n } from '@/i18n';
import { type Framework, normalizeStackOptions, type StackOptions } from '@/lib/configurator/generate';

const FRAMEWORKS: { id: Framework; label: string }[] = [
  { id: 'next', label: 'Next.js' },
  { id: 'vite', label: 'Vite + React' },
  { id: 'vanilla', label: 'Vanilla TS' },
];

/**
 * A toggle button of an option, in paper and ink: square, mono caps, a frame of 1px it shares with the buttons beside
 * it, filled with ink when the option is on. Shared with the Playground controls.
 *
 * @param props.pressed - Whether the option is on.
 * @param props.disabled - Whether it cannot be changed now.
 * @param props.onClick - Toggles or selects the option.
 * @param props.children - The name of the option.
 * @param props.compact - The small variant.
 * @returns The button.
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
        // The buttons of a group share their frames: each covers the right and bottom lines of the one before it
        '-mr-px -mb-px cursor-pointer whitespace-nowrap border font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] transition-colors disabled:cursor-not-allowed',
        // A selected option that another one requires stays readable; an unavailable one fades
        pressed ? 'disabled:opacity-70' : 'disabled:opacity-40',
        compact ? 'h-[34px] px-3' : 'h-10 px-3.5',
        pressed
          ? // Two chosen options side by side keep a line of paper between them, or they read as one block of ink
            'relative z-[1] border-[var(--tuwa-text-primary)] bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)] [[aria-pressed=true]+&]:border-l-[var(--tuwa-docs-paper)]'
          : 'border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] enabled:hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]',
      )}
    >
      {children}
    </button>
  );
}

/**
 * A labelled group of {@link Choice} buttons, its legend in mono caps. Shared with the Playground controls.
 *
 * @param props.label - The legend.
 * @param props.hint - A line under the buttons, hidden in the compact variant.
 * @param props.info - What the group does, behind a square "i" next to the legend: shown on hover, focus or tap, in a
 *   square frame of 1px.
 * @param props.children - The buttons.
 * @param props.compact - The small variant.
 * @returns The group.
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
  const { t } = useI18n();
  const infoId = useId();
  return (
    <fieldset className="relative flex min-w-0 flex-col gap-2">
      <legend
        className={cn(
          'flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em] text-[var(--tuwa-text-secondary)]',
          compact ? 'mb-2.5' : 'mb-3',
        )}
      >
        {label}
        {info && (
          <span className="group/info inline-flex">
            <button
              type="button"
              aria-label={formatLabel(t.common.aboutLabel, { label })}
              aria-describedby={infoId}
              // Safari does not focus a tapped button, and hover is off on touch screens: the focus opens the tip there
              onClick={(event) => event.currentTarget.focus()}
              className="-m-1 grid h-6 w-6 cursor-help place-items-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] focus-visible:text-[var(--tuwa-text-primary)]"
            >
              <InformationCircleIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            {/* Placed against the group, so it opens under the legend, inside the panel */}
            <span
              role="tooltip"
              id={infoId}
              className="pointer-events-none absolute top-6 left-0 z-30 hidden w-64 max-w-[80vw] border border-[var(--tuwa-border-strong)] bg-[var(--tuwa-docs-raised)] px-3 py-2 font-sans text-xs font-normal normal-case leading-relaxed tracking-normal text-[var(--tuwa-text-secondary)] tuwa-docs-scan group-hover/info:block group-focus-within/info:block"
            >
              {info}
            </span>
          </span>
        )}
      </legend>
      <div className="flex flex-wrap pr-px pb-px">{children}</div>
      {hint && !compact && <p className="text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">{hint}</p>}
    </fieldset>
  );
}

/**
 * The options of the Stack Configurator: framework, chains, UI and features. Changes go through
 * `normalizeStackOptions`, so the form never shows a combination the generator does not support. The compact variant
 * sets the four groups in cells on shared lines of 1px, two by two from 768px.
 *
 * @param props.options - The current options.
 * @param props.onChange - Called with the new options.
 * @param props.compact - The small variant of the hub main page, without hints.
 * @returns The form.
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
    <div
      className={cn(
        'grid grid-cols-1',
        compact
          ? 'md:grid-cols-2 [&>*]:min-w-0 [&>*]:border-b [&>*]:border-[var(--tuwa-border-primary)] [&>*]:p-4 md:[&>*:nth-child(odd)]:border-r'
          : 'gap-6',
      )}
    >
      <div>
        <Group
          label={t.configurator.form.framework}
          hint={t.ui.configuratorExtra.frameworkHints[options.framework]}
          compact={compact}
        >
          {FRAMEWORKS.map(({ id, label }) => (
            <Choice
              key={id}
              pressed={options.framework === id}
              onClick={() => set({ framework: id })}
              compact={compact}
            >
              {label}
            </Choice>
          ))}
        </Group>
      </div>

      <div>
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
      </div>

      <div>
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
      </div>

      <div>
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
    </div>
  );
}
