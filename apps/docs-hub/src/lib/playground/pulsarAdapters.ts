import { normalizeError, OrbitAdapter } from '@tuwaio/sdk/orbit';
import {
  TransactionStatus,
  TransactionTracker,
  type TxAdapter,
  type UpdatableTransactionFields,
} from '@tuwaio/sdk/pulsar';

import { type FinalUpdate, replaceTransaction, watchTransaction } from './chain';
import { shortId } from './encoding';
import { logEvent } from './eventLog';
import { wait } from './scenario';
import type { PlaygroundTransaction, SimulatedFamily } from './types';
import { connectorTypeOf, currentSession } from './wallets';

type TrackerParams = Parameters<TxAdapter<PlaygroundTransaction>['checkAndInitializeTrackerInStore']>[0];

function finalFields(tx: PlaygroundTransaction, update: FinalUpdate): UpdatableTransactionFields {
  return {
    pending: false,
    status: update.status,
    finishedTimestamp: update.finishedTimestamp,
    ...(update.status === TransactionStatus.Failed && {
      isError: true,
      error: normalizeError(new Error(update.error)),
    }),
    ...(update.replacedTxHash && { replacedTxHash: update.replacedTxHash }),
    ...(tx.adapter === OrbitAdapter.SOLANA && update.status === TransactionStatus.Success && { confirmations: 'MAX' }),
  };
}

function settle({ tx, updateTxParams, onSuccess, onError, onReplaced }: TrackerParams, update: FinalUpdate) {
  const fields = finalFields(tx, update);
  updateTxParams(tx.txKey, fields);
  logEvent('Pulsar', `updateTxParams ${shortId(tx.txKey)} → ${update.status}`, fields);
  const settled: PlaygroundTransaction = { ...tx, ...fields };
  if (update.status === TransactionStatus.Success) void onSuccess?.(settled);
  if (update.status === TransactionStatus.Failed) void onError?.(new Error(update.error), settled);
  if (update.status === TransactionStatus.Replaced) void onReplaced?.(settled, tx);
}

function track(params: TrackerParams, onSettled: () => void): () => void {
  const { tx, updateTxParams } = params;
  logEvent('Pulsar', `tracking ${shortId(tx.txKey)}`, { tracker: tx.tracker });

  const stop = watchTransaction(tx.txKey, (update) => {
    if (update.type === 'pending') {
      updateTxParams(tx.txKey, {
        nonce: update.nonce,
        to: update.to,
        value: update.value,
        maxFeePerGas: update.maxFeePerGas,
        maxPriorityFeePerGas: update.maxPriorityFeePerGas,
      });
    } else if (update.type === 'confirmations') {
      updateTxParams(tx.txKey, { confirmations: update.confirmations, slot: update.slot });
    } else {
      settle(params, update);
      onSettled();
    }
  });
  if (stop) return stop;

  // The simulated chain lives in memory: after a page reload it no longer knows the transactions that Pulsar restored
  // from localStorage, so they are reported as mined while the page was closed
  let stopped = false;
  logEvent('Pulsar', `${shortId(tx.txKey)} restored after a reload`);
  void wait(1500).then(() => {
    if (!stopped) {
      settle(params, {
        type: 'final',
        status: TransactionStatus.Success,
        finishedTimestamp: Math.floor(Date.now() / 1000),
      });
      onSettled();
    }
  });
  return () => {
    stopped = true;
  };
}

/**
 * A Pulsar adapter for one chain family of the simulated chain. It implements the same contract as `pulsarEvmAdapter`
 * and `pulsarSolanaAdapter`: the trackers follow the simulated chain, EVM transactions can be sped up and cancelled,
 * and failed ones can be retried.
 * @param family - The chain family.
 * @param trackers - Holds the stop function of every running tracker, so a simulated device can stop them; a tracker
 * leaves the set when its transaction is final.
 * @returns The adapter.
 */
export function createSimulatedPulsarAdapter(
  family: SimulatedFamily,
  trackers: Set<() => void>,
): TxAdapter<PlaygroundTransaction> {
  return {
    key: family,
    getExplorerUrl: () => undefined,
    getExplorerTxUrl: () => '',

    getConnectorInfo: () => {
      const session = currentSession(family);
      if (!session) throw new Error('Connect a wallet first.');
      return { walletAddress: session.wallet.address, connectorType: connectorTypeOf(session.wallet) };
    },

    checkChainForTx: async (chainId) => {
      const session = currentSession(family);
      if (String(session?.chainId) !== String(chainId).replace(/^solana:/, '')) {
        throw new Error(`Switch the wallet to ${chainId} first.`);
      }
    },

    checkTransactionsTracker: ({ actionTxKey }) => ({
      txKey: actionTxKey,
      tracker: family === OrbitAdapter.EVM ? TransactionTracker.Ethereum : TransactionTracker.Solana,
    }),

    checkAndInitializeTrackerInStore: (params) => {
      const stop = track(params, () => trackers.delete(stop));
      trackers.add(stop);
    },

    ...(family === OrbitAdapter.EVM && {
      speedUpTxAction: async (tx: PlaygroundTransaction) => replaceTransaction(tx.txKey, 'speed-up'),
      cancelTxAction: async (tx: PlaygroundTransaction) => replaceTransaction(tx.txKey, 'cancel'),
    }),

    retryTxAction: async ({ txKey, tx, onClose, executeTxAction }) => {
      onClose(txKey);
      if (!executeTxAction) return;
      const { actionFunction, ...params } = tx;
      await executeTxAction({ actionFunction: () => actionFunction(), params });
    },
  };
}
