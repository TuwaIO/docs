'use client';

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import type { ReplacementReason } from '@/lib/playground/chain';
import { STYLE_KITS, type StyleKit } from '@/lib/playground/customization';
import { logEvent } from '@/lib/playground/eventLog';
import { scenarioStore, type TxOutcome } from '@/lib/playground/scenario';
import { THEME_PRESETS, type ThemePreset } from '@/lib/playground/themes';

import { Choice, Group } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';

const OUTCOMES: { id: TxOutcome; label: string }[] = [
  { id: 'success', label: 'Success' },
  { id: 'revert', label: 'Revert' },
  { id: 'replaced', label: 'Replaced' },
  { id: 'rejected', label: 'Rejected' },
];

const OUTCOME_HINTS: Record<TxOutcome, string> = {
  success: 'Mined on EVM. On Solana, confirmed in a second, then finalized.',
  revert: 'The contract (EVM) or the program (Solana) fails the transaction.',
  replaced: 'EVM: another transaction with the same nonce is mined. Solana: the blockhash expires.',
  rejected: 'The user rejects the transaction in the wallet.',
};

// What each group does, behind the "i" next to its name
const INFO = {
  chains: 'The chain families of the simulated dApp, each with its simulated wallets and networks. One stays on.',
  ui: 'Nova UI Kit: the ready-made connect modal, button and toasts. Headless: hand-written components on the same stores, as an app without Nova builds them.',
  features:
    'SIWX sign-in: after connecting, the wallet signs a message and the app gets a session. Quasar sync: the transactions sync to a simulated Quasar and follow the user to another device; it needs SIWX.',
  theme: 'The --tuwa-* variables of Nova on the stage. Customize › Theme edits each one and gives the CSS to paste.',
  style:
    'Class names for every Nova part (customization.classNames): Nova as it ships, TUWA Mono, or Isometric, drawn for its own themes.',
  connectButton:
    'Full: the balance and the network selector next to the button. Minimal: the button alone (withBalance and withChain off).',
  outcome: 'How the next transaction you send from the stage ends.',
  speed: 'How long the simulated wallet and chain take. Fast divides every delay by 4.',
  signatures: 'Whether the simulated wallet approves or rejects the next message to sign, such as the SIWX sign-in.',
  quasar:
    "Offline: the sync fails, Pulsar keeps the transaction unsynced and resends it when Quasar is back. A real app's preFlightTxCheck also stops new transactions while Quasar is unreachable.",
  pendingEvm:
    'Replaces the latest pending EVM transaction with one of the same nonce, as a wallet does: Speed up resends it, Cancel sends an empty one. The original ends as Replaced.',
};

const ANOTHER_DEVICE_HINT =
  'Simulates the same user on a new device: the local transactions are gone, and signing in with the same wallet loads the history from Quasar';

// A button or a select in the look of an unpressed `Choice`
const fieldClass =
  'rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-border-primary)] transition-colors cursor-pointer';

const divider = 'border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]';

// A theme in one dot: its background and the color of its buttons
function Swatch({ preset }: { preset: ThemePreset }) {
  return (
    <span
      className="h-3 w-3 shrink-0 rounded-full border border-black/15 dark:border-white/25"
      style={{
        background: `linear-gradient(135deg, ${preset.values['--tuwa-bg-primary']} 50%, ${preset.values['--tuwa-button-gradient-from']} 50%)`,
      }}
      aria-hidden="true"
    />
  );
}

/** The theme presets as a menu button: it closes on a pick, a click outside or Escape. */
function ThemeMenu() {
  const { settings, changeSettings } = usePlayground();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const preset = THEME_PRESETS[settings.theme];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => !menu.current?.contains(event.target as Node) && setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(fieldClass, 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs')}
      >
        <Swatch preset={preset} />
        {preset.label}
        <ChevronDownIcon className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className="absolute top-full left-0 z-30 mt-1 flex w-52 flex-col gap-0.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-1 shadow-xl"
        >
          {Object.values(THEME_PRESETS).map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={settings.theme === option.id}
              onClick={() => {
                changeSettings({ theme: option.id });
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-1.5 text-left text-xs font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] aria-selected:bg-[var(--tuwa-text-accent)]/10 aria-selected:text-[var(--tuwa-text-primary)] cursor-pointer"
            >
              <Swatch preset={option} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** The stack of the stage: chains, UI and features. */
function StackGroups({ compact }: { compact: boolean }) {
  const { settings, changeSettings } = usePlayground();
  return (
    <>
      <Group label="Chains" info={INFO.chains} compact={compact}>
        <Choice
          pressed={settings.evm}
          disabled={settings.evm && !settings.solana}
          onClick={() => changeSettings({ evm: !settings.evm })}
          compact={compact}
        >
          EVM
        </Choice>
        <Choice
          pressed={settings.solana}
          disabled={settings.solana && !settings.evm}
          onClick={() => changeSettings({ solana: !settings.solana })}
          compact={compact}
        >
          Solana
        </Choice>
      </Group>
      <Group label="UI" info={INFO.ui} compact={compact}>
        <Choice pressed={settings.ui === 'nova'} onClick={() => changeSettings({ ui: 'nova' })} compact={compact}>
          Nova UI Kit
        </Choice>
        <Choice
          pressed={settings.ui === 'headless'}
          onClick={() => changeSettings({ ui: 'headless' })}
          compact={compact}
        >
          Headless
        </Choice>
      </Group>
      <Group label="Features" info={INFO.features} compact={compact}>
        <Choice
          pressed={settings.siwx}
          disabled={settings.quasar}
          onClick={() => changeSettings({ siwx: !settings.siwx })}
          compact={compact}
        >
          SIWX sign-in
        </Choice>
        <Choice
          pressed={settings.quasar}
          onClick={() => changeSettings({ quasar: !settings.quasar })}
          compact={compact}
        >
          Quasar sync
        </Choice>
      </Group>
    </>
  );
}

/** The look of the stage: the theme (a menu in the panel, buttons in the sheet), the style kit, the connect button. */
function LookGroups({ compact }: { compact: boolean }) {
  const { settings, customization, changeSettings, changeCustomization } = usePlayground();
  return (
    <>
      <Group label="Theme" info={INFO.theme} compact={compact}>
        {compact ? (
          <ThemeMenu />
        ) : (
          Object.values(THEME_PRESETS).map((preset) => (
            <Choice
              key={preset.id}
              pressed={settings.theme === preset.id}
              onClick={() => changeSettings({ theme: preset.id })}
            >
              <span className="inline-flex items-center gap-1.5">
                <Swatch preset={preset} />
                {preset.label}
              </span>
            </Choice>
          ))
        )}
      </Group>
      {settings.ui === 'nova' && (
        <>
          <Group label="Style" info={INFO.style} compact={compact}>
            {(Object.keys(STYLE_KITS) as StyleKit[]).map((kit) => (
              <Choice
                key={kit}
                pressed={customization.style === kit}
                onClick={() => changeCustomization({ style: kit })}
                compact={compact}
              >
                {STYLE_KITS[kit].label}
              </Choice>
            ))}
          </Group>
          {/* Minimal: the connect button alone, without the balance and the network selector */}
          <Group label="Connect button" info={INFO.connectButton} compact={compact}>
            {[false, true].map((minimal) => (
              <Choice
                key={String(minimal)}
                pressed={customization.withBalance === !minimal && customization.withChain === !minimal}
                onClick={() => changeCustomization({ withBalance: !minimal, withChain: !minimal })}
                compact={compact}
              >
                {minimal ? 'Minimal' : 'Full'}
              </Choice>
            ))}
          </Group>
        </>
      )}
    </>
  );
}

function useLatestPendingEvmTx() {
  const { device } = usePlayground();
  const pool = device.usePulsarStore((state) => state.transactionsPool);
  return Object.values(pool)
    .filter((tx) => tx.pending && tx.adapter === OrbitAdapter.EVM)
    .sort((a, b) => b.localTimestamp - a.localTimestamp)[0];
}

/** The simulation: the next transaction (in the panel; the phone bar has its own), speed, signatures, Quasar, EVM. */
function SimulationGroups({ compact }: { compact: boolean }) {
  const { settings, families, device } = usePlayground();
  const scenario = useStore(scenarioStore);
  const pendingEvmTx = useLatestPendingEvmTx();

  const replace = async (reason: ReplacementReason) => {
    if (!pendingEvmTx) return;
    const adapter = [device.pulsarStore.getState().getAdapter()].flat().find(({ key }) => key === OrbitAdapter.EVM);
    try {
      await (reason === 'speed-up'
        ? adapter?.speedUpTxAction?.(pendingEvmTx)
        : adapter?.cancelTxAction?.(pendingEvmTx));
    } catch (error) {
      logEvent('Wallet', error instanceof Error ? error.message : String(error));
    }
  };

  const setQuasarOnline = (online: boolean) => {
    scenarioStore.setState({ quasarOnline: online });
    logEvent('Quasar', online ? 'Quasar is back online' : 'Quasar is offline');
    // Pulsar retries the unsynced transactions; an app does it on the next transaction or history load
    if (online) void device.pulsarStore.getState().reconcileUnsyncedTransactions();
  };

  return (
    <>
      {compact && (
        <Group label="Next transaction" info={INFO.outcome} compact>
          {OUTCOMES.map(({ id, label }) => (
            <Choice
              key={id}
              pressed={scenario.outcome === id}
              onClick={() => scenarioStore.setState({ outcome: id })}
              compact
            >
              {label}
            </Choice>
          ))}
        </Group>
      )}
      <Group label="Speed" info={INFO.speed} compact={compact}>
        <Choice
          pressed={scenario.speed === 'realistic'}
          onClick={() => scenarioStore.setState({ speed: 'realistic' })}
          compact={compact}
        >
          Realistic
        </Choice>
        <Choice
          pressed={scenario.speed === 'fast'}
          onClick={() => scenarioStore.setState({ speed: 'fast' })}
          compact={compact}
        >
          Fast
        </Choice>
      </Group>
      {settings.siwx && (
        <Group label="Wallet signatures" info={INFO.signatures} compact={compact}>
          <Choice
            pressed={!scenario.rejectSignature}
            onClick={() => scenarioStore.setState({ rejectSignature: false })}
            compact={compact}
          >
            Approve
          </Choice>
          <Choice
            pressed={scenario.rejectSignature}
            onClick={() => scenarioStore.setState({ rejectSignature: true })}
            compact={compact}
          >
            Reject
          </Choice>
        </Group>
      )}
      {settings.quasar && (
        <Group label="Quasar" info={INFO.quasar} compact={compact}>
          <Choice pressed={scenario.quasarOnline} onClick={() => setQuasarOnline(true)} compact={compact}>
            Online
          </Choice>
          <Choice pressed={!scenario.quasarOnline} onClick={() => setQuasarOnline(false)} compact={compact}>
            Offline
          </Choice>
        </Group>
      )}
      {families.includes(OrbitAdapter.EVM) && (
        <Group label="Pending EVM transaction" info={INFO.pendingEvm} compact={compact}>
          <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('speed-up')} compact={compact}>
            Speed up
          </Choice>
          <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('cancel')} compact={compact}>
            Cancel
          </Choice>
        </Group>
      )}
    </>
  );
}

/** The session actions: a new device (with Quasar) and a full reset. */
function SessionActions({ className, short }: { className?: string; short?: boolean }) {
  const { settings, openOnAnotherDevice, resetPlayground } = usePlayground();
  return (
    <div className={cn('flex gap-2', className)}>
      {settings.quasar && (
        <button
          type="button"
          onClick={openOnAnotherDevice}
          title={ANOTHER_DEVICE_HINT}
          className={cn(fieldClass, 'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs')}
        >
          <DevicePhoneMobileIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {short ? 'Other device' : 'Open on another device'}
        </button>
      )}
      <button
        type="button"
        onClick={resetPlayground}
        title="Reset the Playground: a new session with the default settings"
        aria-label={short ? 'Reset the Playground' : undefined}
        className={cn(fieldClass, 'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs')}
      >
        <ArrowPathIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {!short && 'Reset'}
      </button>
    </div>
  );
}

function OutcomeHint() {
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  return <p className="text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">{OUTCOME_HINTS[outcome]}</p>;
}

/**
 * The controls above the stage: the stack, the look and the simulation. From 640px they are a panel in two rows; on a
 * phone a bar keeps the next transaction and the session actions, and the rest opens in a sheet from the bottom.
 */
export function ControlsPanel() {
  const { settings } = usePlayground();
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  const sheet = useRef<HTMLDialogElement>(null);
  const chains = [settings.evm && 'EVM', settings.solana && 'Solana'].filter(Boolean).join(', ');

  return (
    <section
      aria-label="Playground controls"
      className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm p-2.5 sm:p-4"
    >
      <div className="hidden flex-col gap-3.5 sm:flex">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3.5">
          <StackGroups compact />
          <LookGroups compact />
        </div>
        <div className={cn('flex flex-wrap items-end gap-x-6 gap-y-3.5 border-t pt-3.5', divider)}>
          <SimulationGroups compact />
          <SessionActions className="ml-auto" />
        </div>
        <OutcomeHint />
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => sheet.current?.showModal()}
          className="flex min-h-11 items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10 px-3 text-sm font-semibold cursor-pointer"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          Setup
          <span className="ml-auto truncate text-xs font-medium text-[var(--tuwa-text-secondary)]">
            {chains} · {THEME_PRESETS[settings.theme].label}
          </span>
        </button>
        <div className="flex gap-2">
          <label className={cn(fieldClass, 'relative flex min-h-11 flex-1 items-center gap-2 pl-2.5')}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
              Next tx
            </span>
            <select
              value={outcome}
              onChange={(event) => scenarioStore.setState({ outcome: event.target.value as TxOutcome })}
              className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-sm text-[var(--tuwa-text-primary)] outline-none cursor-pointer [&_option]:bg-[var(--tuwa-bg-secondary)]"
            >
              {OUTCOMES.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-4 w-4" aria-hidden="true" />
          </label>
          <SessionActions short className="[&>button]:min-h-11 [&>button]:min-w-11" />
        </div>
        <OutcomeHint />
      </div>

      {/* A modal sheet: the backdrop closes it, as does Escape */}
      <dialog
        ref={sheet}
        aria-label="Playground setup"
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="mt-auto mb-0 max-h-[85dvh] w-full max-w-none open:flex open:flex-col rounded-t-[var(--tuwa-rounded-corners)] border-t border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-0 text-[var(--tuwa-text-primary)] backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:hidden"
      >
        <div className={cn('flex items-center justify-between border-b px-4 py-2', divider)}>
          <span className="font-semibold">Setup</span>
          <button
            type="button"
            onClick={() => sheet.current?.close()}
            aria-label="Close the setup"
            className="flex h-11 w-11 items-center justify-center rounded-[var(--tuwa-rounded-corners)] text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-4 pb-8">
          <StackGroups compact={false} />
          <LookGroups compact={false} />
          <SimulationGroups compact={false} />
        </div>
      </dialog>
    </section>
  );
}
