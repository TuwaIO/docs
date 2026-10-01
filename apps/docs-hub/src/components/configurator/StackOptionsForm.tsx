'use client';

import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

import { type Framework, normalizeStackOptions, type StackOptions } from '@/lib/configurator/generate';

const FRAMEWORKS: { id: Framework; label: string; hint: string }[] = [
  { id: 'next', label: 'Next.js', hint: 'App Router, with route handlers for the server' },
  { id: 'vite', label: 'Vite + React', hint: 'A client app; the server parts run on any Fetch API runtime' },
  { id: 'vanilla', label: 'Vanilla TS', hint: 'No React: the TUWA stores and your own DOM code' },
];

function Choice({
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

function Group({
  label,
  hint,
  children,
  compact,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <fieldset className={cn('flex flex-col', compact ? 'gap-1.5' : 'gap-2')}>
      <legend
        className={cn(
          'font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]',
          compact ? 'text-[10px] mb-1.5' : 'text-[11px] mb-2',
        )}
      >
        {label}
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
  const set = (patch: Partial<StackOptions>) => onChange(normalizeStackOptions({ ...options, ...patch }));
  const framework = FRAMEWORKS.find(({ id }) => id === options.framework)!;
  const vanilla = options.framework === 'vanilla';

  return (
    <div className={cn('grid', compact ? 'grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4' : 'grid-cols-1 gap-6')}>
      <Group label="Framework" hint={framework.hint} compact={compact}>
        {FRAMEWORKS.map(({ id, label }) => (
          <Choice key={id} pressed={options.framework === id} onClick={() => set({ framework: id })} compact={compact}>
            {label}
          </Choice>
        ))}
      </Group>

      <Group
        label="Chains"
        hint="Each chain family adds its own add-on; an app never bundles the other."
        compact={compact}
      >
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
        label="UI"
        hint={
          vanilla
            ? 'Nova UI Kit is made of React components; with Vanilla TS the UI is yours.'
            : options.ui === 'nova'
              ? 'Nova Connect modals and Nova Transactions toasts, themed with CSS variables.'
              : 'Your own components on the Satellite and Pulsar stores.'
        }
        compact={compact}
      >
        <Choice
          pressed={options.ui === 'nova'}
          disabled={vanilla}
          onClick={() => set({ ui: 'nova' })}
          compact={compact}
        >
          Nova UI Kit
        </Choice>
        <Choice pressed={options.ui === 'headless'} onClick={() => set({ ui: 'headless' })} compact={compact}>
          Headless
        </Choice>
      </Group>

      <Group
        label="Features"
        hint={
          options.quasar
            ? 'Quasar syncs the transactions of a signed-in wallet, so it turns on SIWX.'
            : 'SIWX signs users in with their wallet (CAIP-122); Quasar adds history across devices and webhooks.'
        }
        compact={compact}
      >
        <Choice
          pressed={options.siwx}
          disabled={options.quasar}
          onClick={() => set({ siwx: !options.siwx })}
          compact={compact}
        >
          SIWX sign-in
        </Choice>
        <Choice pressed={options.quasar} onClick={() => set({ quasar: !options.quasar })} compact={compact}>
          Quasar sync
        </Choice>
      </Group>
    </div>
  );
}
