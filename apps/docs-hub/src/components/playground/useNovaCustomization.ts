'use client';

import type { NovaConnectProviderCustomization } from '@tuwaio/sdk/nova-connect';
import type { ConnectButtonCustomization, WalletIconCustomization } from '@tuwaio/sdk/nova-connect/components';
import { ukrainianLabels } from '@tuwaio/sdk/nova-connect/i18n';
import { deepMerge } from '@tuwaio/sdk/nova-core';
import {
  defaultLabels as englishTransactionsLabels,
  type TransactionsHistoryCustomization,
} from '@tuwaio/sdk/nova-transactions';
import type { Transaction } from '@tuwaio/sdk/pulsar';
import { useMemo } from 'react';

import {
  connectLabelOf,
  connectProviderOptions,
  type NovaCustomization,
  transactionsProviderOptions,
} from '@/lib/playground/customization';
import { logEvent } from '@/lib/playground/eventLog';

import { ConfirmationsBar } from './nova/ConfirmationsBar';
import { EmptyHistory } from './nova/EmptyHistory';
import {
  monoConnect,
  monoConnectButton,
  monoHistory,
  monoTransactions,
  type NovaTransactionsCustomization,
} from './nova/monoKit';
import { TxTypeHistoryItem } from './nova/TxTypeHistoryItem';
import { ukrainianTransactionsLabels } from './nova/ukrainianTransactionsLabels';
import { usePlayground } from './PlaygroundContext';
import { SimulatedWalletIcon } from './SimulatedWalletIcon';

// Stage only, not in the Code tab: Nova draws the `icon` of the simulated connectors; if one ever fails, its default
// fallback would look the name up on GitHub, which knows no simulated wallet
const walletIcon: WalletIconCustomization = { components: { FallbackIcon: SimulatedWalletIcon } };
const STAGE_WALLET_ICONS: NovaConnectProviderCustomization = {
  modals: {
    connectModal: {
      childComponents: {
        connectorsSelections: { connectorsBlock: { installed: { walletIcon }, popular: { walletIcon } } },
        connecting: { walletIcon },
      },
    },
  },
};

/**
 * The Nova objects of the customization, built as in `customization.tsx` of the Code tab (`customizationCode`), with
 * two differences: the click handler logs to the Events tab, and the stage adds its wallet icon fallback.
 * @param customization - The customization of the Customize tab.
 * @returns The props of `NovaConnectProvider` and `NovaTransactionsProvider`, the `customization` of `ConnectButton`
 * and `TransactionsHistory`, and the labels of `NovaTransactionsLabelsProvider` for the histories outside
 * `NovaTransactionsProvider`.
 */
function buildNovaCustomization(customization: NovaCustomization) {
  const mono = customization.style === 'mono';
  const uk = customization.language === 'uk';
  const label = connectLabelOf(customization);

  const historyCustomization = deepMerge<TransactionsHistoryCustomization<Transaction>>(mono ? monoHistory : {}, {
    components: {
      ...(customization.historyIcons && { HistoryItem: TxTypeHistoryItem }),
      ...(customization.emptyHistory && { Placeholder: EmptyHistory }),
    },
  });

  const connectButtonCustomization = deepMerge<ConnectButtonCustomization>(mono ? monoConnectButton : {}, {
    ...(customization.logButtonClicks && {
      handlers: {
        onButtonClick: (buttonData, openModal) => {
          logEvent('Nova', 'Connect button clicked', { connected: buttonData.isConnected });
          openModal();
        },
      },
    }),
  });

  const connectCustomization = deepMerge(
    deepMerge<NovaConnectProviderCustomization>(mono ? monoConnect : {}, {
      modals: { connectedModal: { childCustomizations: { txHistory: { transactionsHistory: historyCustomization } } } },
    }),
    STAGE_WALLET_ICONS,
  );

  const transactionsCustomization = deepMerge<NovaTransactionsCustomization>(mono ? monoTransactions : {}, {
    toast: { components: { ...(customization.confirmationsBar && { ConfirmationsBadge: ConfirmationsBar }) } },
    transactionsInfoModal: { historyCustomization },
  });

  return {
    connectProps: {
      ...connectProviderOptions(customization),
      labels: uk
        ? { ...ukrainianLabels, ...(label && { connectWallet: label }) }
        : label
          ? { connectWallet: label }
          : undefined,
      customization: connectCustomization,
    },
    transactionsProps: {
      ...transactionsProviderOptions(customization),
      labels: uk ? ukrainianTransactionsLabels : undefined,
      customization: transactionsCustomization,
    },
    connectButtonCustomization,
    historyCustomization,
    // TransactionsHistory and the history of the connected modal sit outside NovaTransactionsProvider
    transactionsLabels: uk ? ukrainianTransactionsLabels : englishTransactionsLabels,
  };
}

/** The Nova objects of the Customize tab for the stage, rebuilt when the customization changes. */
export function useNovaCustomization() {
  const { customization } = usePlayground();
  return useMemo(() => buildNovaCustomization(customization), [customization]);
}
