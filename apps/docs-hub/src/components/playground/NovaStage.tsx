'use client';

import { NovaConnectProvider } from '@tuwaio/sdk/nova-connect';
import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';
import { TransactionsHistory } from '@tuwaio/sdk/nova-transactions';
import { NovaTransactionsLabelsProvider, NovaTransactionsProvider } from '@tuwaio/sdk/nova-transactions/providers';
import { getAdapterFromConnectorType } from '@tuwaio/sdk/orbit';
import type { TxInMemoryPagination } from '@tuwaio/sdk/pulsar';
import { useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import { arbitrum, base, mainnet } from 'viem/chains';

import { SIMULATED_RPC_URL } from '@/lib/playground/satelliteAdapters';

import { ActionButtons } from './ActionButtons';
import { usePlayground } from './PlaygroundContext';
import { useNovaCustomization } from './useNovaCustomization';

const APP_CHAINS = [mainnet, base, arbitrum] as const;
const SOLANA_RPC_URLS = { mainnet: SIMULATED_RPC_URL, devnet: SIMULATED_RPC_URL };

function useHistoryPagination(): TxInMemoryPagination {
  const { device } = usePlayground();
  const isLoading = device.useHistoryStore((state) => state.isLoading);
  const isError = device.useHistoryStore((state) => state.isError);
  const currentPage = device.useHistoryStore((state) => state.currentPage);
  const hasMore = device.useHistoryStore((state) => state.hasMore);
  const fetchNextPage = device.useHistoryStore((state) => state.fetchNextPage);
  return { isLoading, isError, currentPage, hasMore, fetchNextPage };
}

/**
 * The dApp with Nova UI Kit, wired as in the Quasar guide: Nova Connect for the wallets and SIWX, Nova Transactions
 * for the toasts, the tracking modal and the history, all fed by the pool of the device (`useStagePool`). The props
 * and `customization` objects come from the Customize tab; `NovaTransactionsLabelsProvider` gives its texts to the
 * histories outside `NovaTransactionsProvider` (on the stage and in the connected modal).
 */
export function NovaStage() {
  const { settings, device, novaSiwx } = usePlayground();
  const nova = useNovaCustomization();
  const transactionsPool = device.useStagePool();
  // Pages of the cloud history exist only with Quasar
  const historyPagination = useHistoryPagination();
  const pagination = settings.quasar ? historyPagination : undefined;
  const initialTx = device.usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = device.usePulsarStore((state) => state.closeTxTrackedModal);
  const executeTxAction = device.usePulsarStore((state) => state.executeTxAction);
  const getAdapter = device.usePulsarStore((state) => state.getAdapter);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const connectedWalletAddress = activeConnection?.isConnected ? activeConnection.address : undefined;
  const connectedAdapterType = activeConnection
    ? getAdapterFromConnectorType(activeConnection.connectorType)
    : undefined;

  return (
    <>
      <NovaTransactionsProvider
        {...nova.transactionsProps}
        transactionsPool={transactionsPool}
        pagination={pagination}
        initialTx={initialTx}
        closeTxTrackedModal={closeTxTrackedModal}
        executeTxAction={executeTxAction}
        connectedWalletAddress={connectedWalletAddress}
        connectedAdapterType={connectedAdapterType}
        adapter={getAdapter()}
      />
      <NovaTransactionsLabelsProvider labels={nova.transactionsLabels}>
        <NovaConnectProvider
          {...nova.connectProps}
          appChains={APP_CHAINS}
          solanaRPCUrls={SOLANA_RPC_URLS}
          transactionPool={transactionsPool}
          pagination={pagination}
          pulsarAdapter={getAdapter()}
          siwx={novaSiwx}
        >
          <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm font-bold uppercase tracking-widest">Orbit dApp</p>
              <ConnectButton customization={nova.connectButtonCustomization} />
            </header>
            <div>
              <h3 className="text-lg font-bold">Mint, swap and stake on a simulated chain</h3>
              <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)]">
                {connectedWalletAddress
                  ? 'Send a transaction and watch Pulsar track it in the toasts, the tracking modal and the history.'
                  : `Connect a wallet${settings.siwx ? ' and sign in' : ''} to send transactions.`}
              </p>
            </div>
            <ActionButtons withTrackedModal />
            {connectedWalletAddress && (
              <section aria-label="Transaction history">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
                  History
                </h4>
                <TransactionsHistory
                  customization={nova.historyCustomization}
                  transactionsPool={transactionsPool}
                  pagination={pagination}
                  adapter={getAdapter()}
                  connectedWalletAddress={connectedWalletAddress}
                />
              </section>
            )}
          </div>
        </NovaConnectProvider>
      </NovaTransactionsLabelsProvider>
    </>
  );
}
