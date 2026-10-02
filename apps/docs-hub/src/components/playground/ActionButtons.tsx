'use client';

import { ArrowsRightLeftIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { InitialTransactionParams } from '@tuwaio/sdk/pulsar';
import { useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import type { ComponentType, SVGProps } from 'react';

import { familyOf, requestTransaction } from '@/lib/playground/wallets';

import { usePlayground } from './PlaygroundContext';

interface PlaygroundAction {
  type: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: [string, string, string, string];
  description: [string, string, string, string];
  payload: InitialTransactionParams['payload'];
}

const ACTIONS: PlaygroundAction[] = [
  {
    type: 'MINT',
    label: 'Mint NFT',
    icon: SparklesIcon,
    title: ['Minting Orbit #42', 'Orbit #42 minted', 'Mint failed', 'Mint replaced'],
    description: [
      'Minting an NFT of the TUWA Orbits collection',
      'Orbit #42 is in your wallet',
      'The mint did not go through',
      'Another transaction took its place',
    ],
    payload: { collection: 'TUWA Orbits', tokenId: 42 },
  },
  {
    type: 'SWAP',
    label: 'Swap',
    icon: ArrowsRightLeftIcon,
    title: ['Swapping 100 USDC', 'Swap complete', 'Swap failed', 'Swap replaced'],
    description: [
      'Swapping 100 USDC for the native token',
      '100 USDC swapped',
      'The swap did not go through',
      'Another transaction took its place',
    ],
    payload: { tokenIn: 'USDC', amount: 100 },
  },
  {
    type: 'STAKE',
    label: 'Stake',
    icon: LockClosedIcon,
    title: ['Staking 1.5 tokens', 'Staked', 'Staking failed', 'Stake replaced'],
    description: [
      'Locking 1.5 tokens in the staking pool',
      '1.5 tokens are staked',
      'The stake did not go through',
      'Another transaction took its place',
    ],
    payload: { pool: 'Orbit Staking', amount: 1.5 },
  },
];

/**
 * The transactions of the simulated dApp. Each button calls `executeTxAction` of the Pulsar store: the simulated
 * wallet asks for a confirmation and the simulated chain ends the transaction according to the Scenario panel.
 * @param props.withTrackedModal - Whether Nova's tracking modal opens for the transaction.
 */
export function ActionButtons({ withTrackedModal }: { withTrackedModal: boolean }) {
  const { device } = usePlayground();
  const executeTxAction = device.usePulsarStore((state) => state.executeTxAction);
  const isInitializing = device.usePulsarStore((state) => state.initialTx?.isInitializing ?? false);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const family = activeConnection && familyOf(activeConnection.connectorType);

  const run = (action: PlaygroundAction) => {
    if (!activeConnection || !family) return;
    executeTxAction({
      actionFunction: () => requestTransaction(family, action.title[0]),
      params: {
        type: action.type,
        adapter: family,
        desiredChainID: activeConnection.chainId,
        title: action.title,
        description: action.description,
        payload: action.payload,
        withTrackedModal,
      },
    }).catch(() => {
      // Pulsar keeps the error in `initialTx`: Nova shows it in the tracking modal, the headless stage under the buttons
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ACTIONS.map((action) => (
        <button
          key={action.type}
          type="button"
          onClick={() => run(action)}
          disabled={!family || isInitializing}
          className="group flex flex-col items-start gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] p-4 text-left transition-colors hover:border-[var(--tuwa-text-accent)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <action.icon className="h-5 w-5 text-[var(--tuwa-text-accent)]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{action.label}</span>
          <span className="text-xs text-[var(--tuwa-text-secondary)]">{action.description[0]}</span>
        </button>
      ))}
    </div>
  );
}
