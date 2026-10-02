import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus, TransactionTracker } from '@tuwaio/sdk/pulsar';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDevice, TRANSACTIONS_STORAGE_KEY } from './device';
import type { PlaygroundTransaction } from './types';

const pending: PlaygroundTransaction = {
  adapter: OrbitAdapter.EVM,
  txKey: '0x01',
  type: 'MINT',
  chainId: 1,
  from: '0x5749709c988f81d815681592ab2d8a851f04392e',
  connectorType: 'evm:orbitwallet',
  tracker: TransactionTracker.Ethereum,
  localTimestamp: 1,
  pending: true,
};

describe('device stores', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows the Pulsar pool without Quasar, as the configurator stack does, so a failure is not stuck as pending', () => {
    const device = createDevice({ families: [OrbitAdapter.EVM], quasar: false });
    const stop = device.start();
    device.pulsarStore.setState({ transactionsPool: { '0x01': pending } });
    device.pulsarStore.setState({
      transactionsPool: { '0x01': { ...pending, pending: false, status: TransactionStatus.Failed, isError: true } },
    });

    expect(device.getStagePool()['0x01']?.status).toBe(TransactionStatus.Failed);
    stop();
  });

  it('shows the history pool with Quasar, which adds the cloud history to the local pool', () => {
    const device = createDevice({ families: [OrbitAdapter.EVM], quasar: true });
    const stop = device.start();
    device.pulsarStore.setState({ transactionsPool: { '0x01': pending } });

    expect(device.getStagePool()).toBe(device.historyStore.getState().transactionsPool);
    expect(device.getStagePool()['0x01']?.pending).toBe(true);
    stop();
  });

  it('stops saving to localStorage once halted, so a replaced device does not write over the new one', () => {
    const saved = new Map<string, string>();
    // zustand's persist middleware reads window.localStorage
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => saved.get(key) ?? null,
        setItem: (key: string, value: string) => void saved.set(key, value),
        removeItem: (key: string) => void saved.delete(key),
      },
    });
    const device = createDevice({ families: [OrbitAdapter.EVM], quasar: false });
    device.pulsarStore.setState({ transactionsPool: { '0x01': pending } });
    expect(saved.has(TRANSACTIONS_STORAGE_KEY)).toBe(true);

    saved.clear();
    device.halt();
    device.pulsarStore.setState({ transactionsPool: { '0x01': { ...pending, pending: false } } });
    expect(saved.has(TRANSACTIONS_STORAGE_KEY)).toBe(false);
  });
});
