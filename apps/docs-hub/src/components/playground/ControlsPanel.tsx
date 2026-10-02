'use client';

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { useState } from 'react';
import { useStore } from 'zustand';

import type { ReplacementReason } from '@/lib/playground/chain';
import { STYLE_KITS, type StyleKit } from '@/lib/playground/customization';
import { logEvent } from '@/lib/playground/eventLog';
import { scenarioStore, type TxOutcome } from '@/lib/playground/scenario';
import { THEME_PRESETS } from '@/lib/playground/themes';

import { Choice, Group } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';

const OUTCOMES: { id: TxOutcome; label: string }[] = [
  { id: 'success', label: 'Success' },
  { id: 'revert', label: 'Revert' },
  { id: 'replaced', label: 'Replaced' },
  { id: 'rejected', label: 'Rejected' },
];

const OUTCOME_HINTS: Record<TxOutcome, string> = {
  success: 'Mined on EVM, finalized on Solana.',
  revert: 'The contract (EVM) or the program (Solana) fails the transaction.',
  replaced: 'EVM: another transaction with the same nonce is mined. Solana: the blockhash expires.',
  rejected: 'The user rejects the transaction in the wallet.',
};

function useLatestPendingEvmTx() {
  const { device } = usePlayground();
  const pool = device.usePulsarStore((state) => state.transactionsPool);
  return Object.values(pool)
    .filter((tx) => tx.pending && tx.adapter === OrbitAdapter.EVM)
    .sort((a, b) => b.localTimestamp - a.localTimestamp)[0];
}

/**
 * The left column: the stack of the stage (chains, UI, features), the theme preset and style kit, the scenario of the
 * simulation and the session actions. On small screens it folds into one button.
 */
export function ControlsPanel() {
  const {
    settings,
    families,
    device,
    customization,
    changeSettings,
    changeCustomization,
    openOnAnotherDevice,
    resetPlayground,
  } = usePlayground();
  const scenario = useStore(scenarioStore);
  const pendingEvmTx = useLatestPendingEvmTx();
  const [open, setOpen] = useState(false);

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
    <aside
      aria-label="Playground controls"
      className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm p-4 lg:row-span-2 xl:row-span-1 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:[scrollbar-width:thin]"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="playground-controls"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 text-sm font-bold font-geist-mono uppercase tracking-wider lg:hidden cursor-pointer"
      >
        <span className="inline-flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-[var(--tuwa-text-accent)]" aria-hidden="true" />
          Controls
        </span>
        <ChevronDownIcon className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      <div id="playground-controls" className={cn('flex-col gap-5 pt-4 lg:flex lg:pt-0', open ? 'flex' : 'hidden')}>
        <Group label="Chains" compact>
          <Choice
            pressed={settings.evm}
            disabled={settings.evm && !settings.solana}
            onClick={() => changeSettings({ evm: !settings.evm })}
            compact
          >
            EVM
          </Choice>
          <Choice
            pressed={settings.solana}
            disabled={settings.solana && !settings.evm}
            onClick={() => changeSettings({ solana: !settings.solana })}
            compact
          >
            Solana
          </Choice>
        </Group>

        <Group label="UI" compact>
          <Choice pressed={settings.ui === 'nova'} onClick={() => changeSettings({ ui: 'nova' })} compact>
            Nova UI Kit
          </Choice>
          <Choice pressed={settings.ui === 'headless'} onClick={() => changeSettings({ ui: 'headless' })} compact>
            Headless
          </Choice>
        </Group>

        <Group label="Features" compact>
          <Choice
            pressed={settings.siwx}
            disabled={settings.quasar}
            onClick={() => changeSettings({ siwx: !settings.siwx })}
            compact
          >
            SIWX sign-in
          </Choice>
          <Choice pressed={settings.quasar} onClick={() => changeSettings({ quasar: !settings.quasar })} compact>
            Quasar sync
          </Choice>
        </Group>

        <Group label="Theme" compact>
          {Object.values(THEME_PRESETS).map((preset) => (
            <Choice
              key={preset.id}
              pressed={settings.theme === preset.id}
              onClick={() => changeSettings({ theme: preset.id })}
              compact
            >
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{
                    background: `linear-gradient(135deg, ${preset.values['--tuwa-button-gradient-from']}, ${preset.values['--tuwa-button-gradient-to']})`,
                  }}
                  aria-hidden="true"
                />
                {preset.label}
              </span>
            </Choice>
          ))}
        </Group>

        {settings.ui === 'nova' && (
          <Group label="Style" compact>
            {(Object.keys(STYLE_KITS) as StyleKit[]).map((kit) => (
              <Choice
                key={kit}
                pressed={customization.style === kit}
                onClick={() => changeCustomization({ style: kit })}
                compact
              >
                {STYLE_KITS[kit].label}
              </Choice>
            ))}
          </Group>
        )}

        <div className="flex flex-col gap-4 border-t border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] pt-4">
          <Group label="Next transaction" compact>
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
          <p className="-mt-2 text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
            {OUTCOME_HINTS[scenario.outcome]}
          </p>

          <Group label="Speed" compact>
            <Choice
              pressed={scenario.speed === 'realistic'}
              onClick={() => scenarioStore.setState({ speed: 'realistic' })}
              compact
            >
              Realistic
            </Choice>
            <Choice
              pressed={scenario.speed === 'fast'}
              onClick={() => scenarioStore.setState({ speed: 'fast' })}
              compact
            >
              Fast
            </Choice>
          </Group>

          {settings.siwx && (
            <Group label="Wallet signatures" compact>
              <Choice
                pressed={!scenario.rejectSignature}
                onClick={() => scenarioStore.setState({ rejectSignature: false })}
                compact
              >
                Approve
              </Choice>
              <Choice
                pressed={scenario.rejectSignature}
                onClick={() => scenarioStore.setState({ rejectSignature: true })}
                compact
              >
                Reject
              </Choice>
            </Group>
          )}

          {settings.quasar && (
            <Group label="Quasar" compact>
              <Choice pressed={scenario.quasarOnline} onClick={() => setQuasarOnline(true)} compact>
                Online
              </Choice>
              <Choice pressed={!scenario.quasarOnline} onClick={() => setQuasarOnline(false)} compact>
                Offline
              </Choice>
            </Group>
          )}
          {settings.quasar && (
            <p className="-mt-2 text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
              Offline: the sync fails, Pulsar keeps the transaction unsynced and resends it when Quasar is back. A real
              app&apos;s <code className="font-mono">preFlightTxCheck</code> also stops new transactions while Quasar is
              unreachable.
            </p>
          )}

          {families.includes(OrbitAdapter.EVM) && (
            <Group label="Pending EVM transaction" compact>
              <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('speed-up')} compact>
                Speed up
              </Choice>
              <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('cancel')} compact>
                Cancel
              </Choice>
            </Group>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] pt-4">
          {settings.quasar && (
            <button
              type="button"
              onClick={openOnAnotherDevice}
              className="inline-flex items-center gap-2 text-left text-sm font-semibold text-[var(--tuwa-text-accent)] hover:underline cursor-pointer"
            >
              <DevicePhoneMobileIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              Open on another device
            </button>
          )}
          <button
            type="button"
            onClick={resetPlayground}
            className="inline-flex items-center gap-2 text-left text-sm text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
          >
            <ArrowPathIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Reset the Playground
          </button>
        </div>
      </div>
    </aside>
  );
}
