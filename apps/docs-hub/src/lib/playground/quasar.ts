import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { type ITxInMemoryStoreParameters, TransactionStatus } from '@tuwaio/sdk/pulsar';
import { createStore } from 'zustand/vanilla';

import { type FinalUpdate, watchTransaction } from './chain';
import { shortId } from './encoding';
import { logEvent } from './eventLog';
import { scenarioStore, wait } from './scenario';
import type { PlaygroundTransaction } from './types';

const HISTORY_PAGE_SIZE = 10;

/** The transactions of the simulated Quasar, by `txKey`: the cloud history shared by every device of a wallet. */
export const quasarCloud = createStore<{ transactions: Record<string, PlaygroundTransaction> }>()(() => ({
  transactions: {},
}));

// The webhook Quasar sends to the app for a final transaction, in the format of the Quasar docs
function sendWebhook(tx: PlaygroundTransaction) {
  const status = tx.status ?? TransactionStatus.Success;
  logEvent('Webhook', `POST /api/webhooks/quasar · x-quasar-event: ${status}`, {
    txKey: tx.txKey,
    hash: tx.adapter === OrbitAdapter.EVM ? (tx.hash ?? tx.txKey) : tx.txKey,
    status,
    action: status,
    txType: tx.type,
    chainId: String(tx.chainId),
    timestamp: tx.finishedTimestamp,
    metadata: tx.payload ?? {},
  });
}

// Quasar tracks a synced transaction on its server until it is final, then notifies the webhooks of the app
function settleInCloud(txKey: string, update: FinalUpdate) {
  const tx = quasarCloud.getState().transactions[txKey];
  if (!tx?.pending) return;
  const settled: PlaygroundTransaction = {
    ...tx,
    pending: false,
    status: update.status,
    finishedTimestamp: update.finishedTimestamp,
    ...(update.replacedTxHash && { replacedTxHash: update.replacedTxHash }),
  };
  quasarCloud.setState(({ transactions }) => ({ transactions: { ...transactions, [txKey]: settled } }));
  sendWebhook(settled);
}

// Counts the resets, so a request that was in flight during one is dropped
let resets = 0;

/**
 * `onRemoteCreate` of the Pulsar store: saves the transaction to the simulated Quasar, which then follows it on the
 * simulated chain and sends a webhook when it is final. A request still in flight when the Playground is reset is
 * dropped.
 * @param tx - The transaction Pulsar just added to the pool.
 * @throws {Error} `Quasar is offline` when the scenario turns Quasar off; Pulsar keeps the transaction in
 * `unsyncedTxKeys` and retries it in `reconcileUnsyncedTransactions`.
 */
export async function syncToQuasar(tx: PlaygroundTransaction): Promise<void> {
  const started = resets;
  await wait(600);
  if (resets !== started) return;
  if (!scenarioStore.getState().quasarOnline) {
    logEvent('Quasar', `POST /api/transactions/sync ${shortId(tx.txKey)} → network error`);
    throw new Error('Quasar is offline');
  }
  quasarCloud.setState(({ transactions }) => ({ transactions: { ...transactions, [tx.txKey]: tx } }));
  logEvent('Quasar', `POST /api/transactions/sync ${shortId(tx.txKey)} → 201`, tx);
  if (!tx.pending) {
    // Synced after it ended, for example after Quasar was offline: Quasar confirms the final status at once
    sendWebhook(tx);
    return;
  }

  const stop = watchTransaction(tx.txKey, (update) => {
    if (update.type === 'final') settleInCloud(tx.txKey, update);
  });
  if (!stop) {
    // Unknown to the in-memory chain (synced after a reload): Quasar finds it mined
    void wait(1500).then(() =>
      settleInCloud(tx.txKey, {
        type: 'final',
        status: TransactionStatus.Success,
        finishedTimestamp: Math.floor(Date.now() / 1000),
      }),
    );
  }
}

/**
 * `beforeTxProcess` of the Pulsar store: the session check of `preFlightTxCheck` from `@tuwaio/quasar-sdk/react`,
 * which stops a transaction before the wallet signs it. The real check also asks Quasar for its health; the simulated
 * one lets transactions through while Quasar is offline, so the scenario can show a failed sync and its resend.
 * @param hasSession - Whether the page has a SIWX session.
 * @throws {Error} `[QuasarSDK] No SIWX Session found. User must be signed in.` without a session.
 */
export async function quasarPreflight(hasSession: () => boolean): Promise<void> {
  if (hasSession()) return;
  logEvent('Quasar', 'Preflight: no SIWX session, the transaction stops before the wallet signs');
  throw new Error('[QuasarSDK] No SIWX Session found. User must be signed in.');
}

/**
 * `getHistory` of the history store: one page of the cloud history of a wallet, newest first. Like Quasar, it answers
 * only for a wallet with a SIWX session.
 * @param isSignedIn - Whether the page has a SIWX session of the wallet.
 * @returns The `getHistory` function.
 */
export function createQuasarHistory(
  isSignedIn: (walletAddress: string) => boolean,
): NonNullable<ITxInMemoryStoreParameters<PlaygroundTransaction>['getHistory']> {
  return async ({ page = 1, walletAddress }) => {
    await wait(500);
    if (!isSignedIn(walletAddress)) {
      logEvent('Quasar', 'GET /api/transactions → 401, no SIWX session');
      return null;
    }
    const all = Object.values(quasarCloud.getState().transactions)
      .filter((tx) => tx.from.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => b.localTimestamp - a.localTimestamp);
    const totalPages = Math.max(1, Math.ceil(all.length / HISTORY_PAGE_SIZE));
    const docs = all.slice((page - 1) * HISTORY_PAGE_SIZE, page * HISTORY_PAGE_SIZE);
    logEvent('Quasar', `GET /api/transactions?page=${page} → ${docs.length} of ${all.length}`);
    return { docs, totalDocs: all.length, totalPages, page, hasNextPage: page < totalPages, hasPrevPage: page > 1 };
  };
}

/** Empties the simulated Quasar. */
export function resetQuasar(): void {
  resets += 1;
  quasarCloud.setState({ transactions: {} });
}
