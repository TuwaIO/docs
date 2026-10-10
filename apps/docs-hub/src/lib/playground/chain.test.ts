import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus } from '@tuwaio/sdk/pulsar';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type ChainUpdate, replaceTransaction, resetChain, submitTransaction, watchTransaction } from './chain';
import { clearEvents, eventLog } from './eventLog';
import { DEFAULT_SCENARIO, scenarioStore } from './scenario';

function follow(key: string) {
  const updates: ChainUpdate[] = [];
  const stop = watchTransaction(key, (update) => updates.push(update));
  return { updates, stop };
}

describe('simulated chain', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scenarioStore.setState({ ...DEFAULT_SCENARIO });
  });

  afterEach(() => {
    resetChain();
    vi.useRealTimers();
  });

  it('mines an EVM transaction after the mempool details', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    const { updates } = follow(hash);

    await vi.advanceTimersByTimeAsync(800);
    expect(updates).toEqual([expect.objectContaining({ type: 'pending', nonce: expect.any(Number) })]);

    await vi.advanceTimersByTimeAsync(3200);
    expect(updates.at(-1)).toEqual(expect.objectContaining({ type: 'final', status: TransactionStatus.Success }));
  });

  it('reverts an EVM transaction with a reason', async () => {
    const { updates } = follow(submitTransaction(OrbitAdapter.EVM, 'revert'));
    await vi.advanceTimersByTimeAsync(4000);
    expect(updates.at(-1)).toEqual(
      expect.objectContaining({ status: TransactionStatus.Failed, error: expect.stringContaining('reverted') }),
    );
  });

  it('replaces a pending EVM transaction on speed-up, sooner than it would be mined', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    const { updates } = follow(hash);
    await vi.advanceTimersByTimeAsync(1000);

    const replacement = replaceTransaction(hash, 'speed-up');
    await vi.advanceTimersByTimeAsync(1000);

    expect(updates.at(-1)).toEqual(
      expect.objectContaining({ status: TransactionStatus.Replaced, replacedTxHash: replacement }),
    );
    expect(() => replaceTransaction(hash, 'cancel')).toThrow('no longer pending');
  });

  it('replaces a transaction sped up before it reached the mempool', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    const { updates } = follow(hash);
    replaceTransaction(hash, 'cancel');
    await vi.advanceTimersByTimeAsync(1800);
    expect(updates.at(-1)).toEqual(expect.objectContaining({ status: TransactionStatus.Replaced }));
  });

  it('confirms a Solana transaction step by step until it is finalized', async () => {
    const { updates } = follow(submitTransaction(OrbitAdapter.SOLANA, 'success'));
    await vi.advanceTimersByTimeAsync(4000);
    const confirmations = updates.filter((update) => update.type === 'confirmations');
    expect(confirmations.map((update) => update.type === 'confirmations' && update.confirmations)).toEqual([
      8, 16, 24, 32,
    ]);
    expect(updates.at(-1)).toEqual(expect.objectContaining({ status: TransactionStatus.Success }));
  });

  it('reports a Solana transaction as confirmed while it waits for finality', async () => {
    const { updates } = follow(submitTransaction(OrbitAdapter.SOLANA, 'success'));
    await vi.advanceTimersByTimeAsync(800);
    expect(updates).toEqual([expect.objectContaining({ type: 'confirmations', confirmationStatus: 'confirmed' })]);
  });

  it('fails a Solana transaction as soon as it lands with a program error, without waiting for finality', async () => {
    const { updates } = follow(submitTransaction(OrbitAdapter.SOLANA, 'revert'));
    await vi.advanceTimersByTimeAsync(800);
    expect(updates).toEqual([
      expect.objectContaining({ status: TransactionStatus.Failed, error: expect.stringContaining('Program failed') }),
    ]);
  });

  it('expires a Solana transaction for the replaced outcome, without confirmations', async () => {
    const { updates } = follow(submitTransaction(OrbitAdapter.SOLANA, 'replaced'));
    await vi.advanceTimersByTimeAsync(3200);
    expect(updates).toEqual([
      expect.objectContaining({
        status: TransactionStatus.Failed,
        error: expect.stringContaining('Blockhash expired'),
      }),
    ]);
  });

  it('refuses to replace Solana transactions', () => {
    const signature = submitTransaction(OrbitAdapter.SOLANA, 'success');
    expect(() => replaceTransaction(signature, 'speed-up')).toThrow('Only pending EVM transactions');
  });

  it('explains that it cannot replace a transaction it does not know, as one restored after a reload', () => {
    expect(() => replaceTransaction(`0x${'ab'.repeat(32)}`, 'cancel')).toThrow('does not know this transaction');
  });

  it('reports a final transaction once to a late watcher', async () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    await vi.advanceTimersByTimeAsync(4000);
    const { updates } = follow(hash);
    await vi.advanceTimersByTimeAsync(0);
    expect(updates).toEqual([expect.objectContaining({ type: 'final', status: TransactionStatus.Success })]);
  });

  it('does not know transactions after a reset, like after a page reload', () => {
    const hash = submitTransaction(OrbitAdapter.EVM, 'success');
    resetChain();
    expect(watchTransaction(hash, () => {})).toBeUndefined();
  });

  it('stops the transactions it forgot, so a reset log stays empty', async () => {
    submitTransaction(OrbitAdapter.EVM, 'success');
    submitTransaction(OrbitAdapter.SOLANA, 'success');
    resetChain();
    clearEvents();
    await vi.advanceTimersByTimeAsync(5000);
    expect(eventLog.getState().events).toEqual([]);
  });

  it('runs four times faster at the fast speed', async () => {
    scenarioStore.setState({ speed: 'fast' });
    const { updates } = follow(submitTransaction(OrbitAdapter.EVM, 'success'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(updates.at(-1)).toEqual(expect.objectContaining({ status: TransactionStatus.Success }));
  });
});
