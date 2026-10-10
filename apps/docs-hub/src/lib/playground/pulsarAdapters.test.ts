import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus, TransactionTracker, type UpdatableTransactionFields } from '@tuwaio/sdk/pulsar';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetChain, submitTransaction } from './chain';
import { createSimulatedPulsarAdapter } from './pulsarAdapters';
import { DEFAULT_SCENARIO, scenarioStore } from './scenario';
import type { PlaygroundTransaction } from './types';
import { connectWallet, resetWalletSessions, SIMULATED_WALLETS } from './wallets';

const orbit = SIMULATED_WALLETS[0];

function evmTx(txKey: string): PlaygroundTransaction {
  return {
    adapter: OrbitAdapter.EVM,
    txKey,
    type: 'MINT',
    chainId: 1,
    from: orbit.address,
    connectorType: 'evm:orbitwallet',
    tracker: TransactionTracker.Ethereum,
    localTimestamp: 1,
    pending: true,
  };
}

function solanaTx(txKey: string): PlaygroundTransaction {
  return {
    adapter: OrbitAdapter.SOLANA,
    txKey,
    type: 'MINT',
    chainId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    from: orbit.address,
    connectorType: 'solana:orbitwallet',
    tracker: TransactionTracker.Solana,
    localTimestamp: 1,
    pending: true,
  };
}

function startTracking(tx: PlaygroundTransaction) {
  const trackers = new Set<() => void>();
  const adapter = createSimulatedPulsarAdapter(
    tx.adapter === OrbitAdapter.SOLANA ? OrbitAdapter.SOLANA : OrbitAdapter.EVM,
    trackers,
  );
  const updates: UpdatableTransactionFields[] = [];
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const onReplaced = vi.fn();
  void adapter.checkAndInitializeTrackerInStore({
    tx,
    updateTxParams: (_txKey, fields) => updates.push(fields),
    removeTxFromPool: () => {},
    transactionsPool: { [tx.txKey]: tx },
    onSuccess,
    onError,
    onReplaced,
  });
  return { adapter, trackers, updates, onSuccess, onError, onReplaced };
}

describe('simulated Pulsar adapter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scenarioStore.setState({ ...DEFAULT_SCENARIO });
    resetWalletSessions();
    connectWallet(orbit, 1);
  });

  afterEach(() => {
    resetChain();
    vi.useRealTimers();
  });

  it('reports the connected wallet and picks the tracker of its family', () => {
    const adapter = createSimulatedPulsarAdapter(OrbitAdapter.EVM, new Set());
    expect(adapter.getConnectorInfo()).toEqual({ walletAddress: orbit.address, connectorType: 'evm:orbitwallet' });
    expect(adapter.checkTransactionsTracker({ actionTxKey: '0xabc', connectorType: 'evm:orbitwallet' })).toEqual({
      txKey: '0xabc',
      tracker: TransactionTracker.Ethereum,
    });
  });

  it('accepts only the chain the wallet is on', async () => {
    const adapter = createSimulatedPulsarAdapter(OrbitAdapter.EVM, new Set());
    await expect(adapter.checkChainForTx(1)).resolves.toBeUndefined();
    await expect(adapter.checkChainForTx(8453)).rejects.toThrow('Switch the wallet to 8453 first.');
  });

  it('accepts every form of the Solana cluster the wallet is on', async () => {
    connectWallet(
      SIMULATED_WALLETS.find((wallet) => wallet.family === OrbitAdapter.SOLANA)!,
      'devnet',
    );
    const adapter = createSimulatedPulsarAdapter(OrbitAdapter.SOLANA, new Set());
    await expect(adapter.checkChainForTx('devnet')).resolves.toBeUndefined();
    await expect(adapter.checkChainForTx('solana:devnet')).resolves.toBeUndefined();
    await expect(adapter.checkChainForTx('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')).resolves.toBeUndefined();
    await expect(adapter.checkChainForTx('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')).rejects.toThrow(
      'Switch the wallet to',
    );
  });

  it('fills the mempool details, then marks the transaction successful', async () => {
    const { updates, onSuccess } = startTracking(evmTx(submitTransaction(OrbitAdapter.EVM, 'success')));
    await vi.advanceTimersByTimeAsync(4000);

    expect(updates[0]).toEqual(expect.objectContaining({ nonce: expect.any(Number), to: expect.any(String) }));
    expect(updates.at(-1)).toEqual(
      expect.objectContaining({
        pending: false,
        status: TransactionStatus.Success,
        finishedTimestamp: expect.any(Number),
      }),
    );
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('marks a Solana transaction confirmed while it is pending, then finalized', async () => {
    const { updates, onSuccess } = startTracking(solanaTx(submitTransaction(OrbitAdapter.SOLANA, 'success')));
    await vi.advanceTimersByTimeAsync(800);
    expect(updates).toEqual([{ confirmations: 8, slot: expect.any(Number), confirmationStatus: 'confirmed' }]);

    await vi.advanceTimersByTimeAsync(3200);
    expect(updates.at(-1)).toEqual(
      expect.objectContaining({
        pending: false,
        status: TransactionStatus.Success,
        confirmations: 'MAX',
        confirmationStatus: 'finalized',
      }),
    );
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('marks a reverted transaction as an error', async () => {
    const { updates, onError } = startTracking(evmTx(submitTransaction(OrbitAdapter.EVM, 'revert')));
    await vi.advanceTimersByTimeAsync(4000);
    expect(updates.at(-1)).toEqual(
      expect.objectContaining({ status: TransactionStatus.Failed, isError: true, error: expect.any(Object) }),
    );
    expect(onError).toHaveBeenCalledOnce();
  });

  it('speeds up a pending transaction: the original ends as Replaced with the new hash', async () => {
    const tx = evmTx(submitTransaction(OrbitAdapter.EVM, 'success'));
    const { adapter, updates, onReplaced } = startTracking(tx);
    await vi.advanceTimersByTimeAsync(1000);

    const newHash = await adapter.speedUpTxAction!(tx);
    await vi.advanceTimersByTimeAsync(1000);

    expect(updates.at(-1)).toEqual(
      expect.objectContaining({ status: TransactionStatus.Replaced, replacedTxHash: newHash }),
    );
    expect(onReplaced).toHaveBeenCalledOnce();
  });

  it('settles a transaction the chain no longer knows (restored after a reload) as mined', async () => {
    const { updates } = startTracking(evmTx('0x' + 'ab'.repeat(32)));
    await vi.advanceTimersByTimeAsync(1500);
    expect(updates.at(-1)).toEqual(expect.objectContaining({ status: TransactionStatus.Success }));
  });

  it('stops its trackers when the device is disposed', async () => {
    const { trackers, updates } = startTracking(evmTx(submitTransaction(OrbitAdapter.EVM, 'success')));
    for (const stop of trackers) stop();
    await vi.advanceTimersByTimeAsync(4000);
    expect(updates).toEqual([]);
  });

  it('drops a tracker once its transaction settles', async () => {
    const { trackers } = startTracking(evmTx(submitTransaction(OrbitAdapter.EVM, 'success')));
    expect(trackers.size).toBe(1);
    await vi.advanceTimersByTimeAsync(4000);
    expect(trackers.size).toBe(0);
  });

  it('offers speed-up and cancel only for EVM', () => {
    const solana = createSimulatedPulsarAdapter(OrbitAdapter.SOLANA, new Set());
    expect(solana.speedUpTxAction).toBeUndefined();
    expect(solana.cancelTxAction).toBeUndefined();
  });
});
