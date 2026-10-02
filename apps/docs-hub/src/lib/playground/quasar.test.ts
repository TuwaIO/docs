import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus, TransactionTracker } from '@tuwaio/sdk/pulsar';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetChain, submitTransaction } from './chain';
import { clearEvents, eventLog } from './eventLog';
import { createQuasarHistory, quasarCloud, quasarPreflight, resetQuasar, syncToQuasar } from './quasar';
import { DEFAULT_SCENARIO, scenarioStore } from './scenario';
import type { PlaygroundTransaction } from './types';

const from = '0x5749709c988f81d815681592ab2d8a851f04392e';

function tx(txKey: string, localTimestamp = 1): PlaygroundTransaction {
  return {
    adapter: OrbitAdapter.EVM,
    txKey,
    type: 'SWAP',
    chainId: 8453,
    from,
    connectorType: 'evm:orbitwallet',
    tracker: TransactionTracker.Ethereum,
    localTimestamp,
    pending: true,
    payload: { amount: 1 },
  };
}

describe('simulated Quasar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scenarioStore.setState({ ...DEFAULT_SCENARIO });
    resetQuasar();
    clearEvents();
  });

  afterEach(() => {
    resetChain();
    vi.useRealTimers();
  });

  it('syncs a transaction, settles it when the chain does and sends the webhook', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    const syncing = syncToQuasar(tx(hash));
    await vi.advanceTimersByTimeAsync(600);
    await syncing;
    expect(quasarCloud.getState().transactions[hash]?.pending).toBe(true);

    await vi.advanceTimersByTimeAsync(3400);
    expect(quasarCloud.getState().transactions[hash]).toEqual(
      expect.objectContaining({ pending: false, status: TransactionStatus.Success }),
    );
    const webhook = eventLog.getState().events.find((event) => event.source === 'Webhook');
    expect(webhook?.label).toBe('POST /api/webhooks/quasar · x-quasar-event: Success');
    expect(webhook?.detail).toEqual(
      expect.objectContaining({
        txKey: hash,
        status: 'Success',
        txType: 'SWAP',
        chainId: '8453',
        metadata: { amount: 1 },
      }),
    );
  });

  it('notifies at once about a transaction synced after it ended, as after an offline period', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'revert');
    await vi.advanceTimersByTimeAsync(4000);
    const syncing = syncToQuasar({
      ...tx(hash),
      pending: false,
      status: TransactionStatus.Failed,
      finishedTimestamp: 42,
    });
    await vi.advanceTimersByTimeAsync(600);
    await syncing;

    expect(quasarCloud.getState().transactions[hash]).toEqual(
      expect.objectContaining({ pending: false, status: TransactionStatus.Failed }),
    );
    const webhooks = eventLog.getState().events.filter((event) => event.source === 'Webhook');
    expect(webhooks).toHaveLength(1);
    expect(webhooks[0].label).toBe('POST /api/webhooks/quasar · x-quasar-event: Failed');
    expect(webhooks[0].detail).toEqual(expect.objectContaining({ txKey: hash, status: 'Failed', timestamp: 42 }));
  });

  it('stops a transaction before the wallet signs when there is no SIWX session, as preFlightTxCheck does', async () => {
    await expect(quasarPreflight(() => false)).rejects.toThrow(
      '[QuasarSDK] No SIWX Session found. User must be signed in.',
    );
    expect(eventLog.getState().events[0]?.source).toBe('Quasar');
    await expect(quasarPreflight(() => true)).resolves.toBeUndefined();
  });

  it('drops a sync that was in flight when the Playground was reset', async () => {
    const sync = syncToQuasar(tx('0x0c'));
    resetQuasar();
    clearEvents();
    await vi.advanceTimersByTimeAsync(600);
    await sync;
    expect(quasarCloud.getState().transactions).toEqual({});
    expect(eventLog.getState().events).toEqual([]);
  });

  it('fails while offline, so Pulsar keeps the transaction unsynced', async () => {
    scenarioStore.setState({ quasarOnline: false });
    const syncing = expect(syncToQuasar(tx('0x01'))).rejects.toThrow('Quasar is offline');
    await vi.advanceTimersByTimeAsync(600);
    await syncing;
    expect(quasarCloud.getState().transactions).toEqual({});
  });

  it('returns the history of a signed-in wallet only, newest first, in pages of 10', async () => {
    quasarCloud.setState({
      transactions: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [`0x${i}`, { ...tx(`0x${i}`, i), pending: false }]),
      ),
    });

    const signedOut = createQuasarHistory(() => false)({ walletAddress: from });
    await vi.advanceTimersByTimeAsync(500);
    expect(await signedOut).toBeNull();

    const firstPage = createQuasarHistory(() => true)({ walletAddress: from.toUpperCase() });
    await vi.advanceTimersByTimeAsync(500);
    const page = await firstPage;
    expect(page?.docs.map((doc) => doc.txKey).slice(0, 2)).toEqual(['0x11', '0x10']);
    expect(page).toEqual(expect.objectContaining({ totalDocs: 12, totalPages: 2, hasNextPage: true }));
  });
});
