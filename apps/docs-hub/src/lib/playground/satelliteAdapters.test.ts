import { formatConnectorName, OrbitAdapter } from '@tuwaio/sdk/orbit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { eventLog } from './eventLog';
import { createSimulatedSatelliteAdapter, SIMULATED_RPC_URL } from './satelliteAdapters';
import { DEFAULT_SCENARIO, scenarioStore } from './scenario';
import {
  connectorTypeOf,
  connectWallet,
  currentSession,
  requestTransaction,
  resetWalletSessions,
  SIMULATED_WALLETS,
  walletIconOf,
} from './wallets';

const orbit = SIMULATED_WALLETS[0];
const nebula = SIMULATED_WALLETS[1];
const comet = SIMULATED_WALLETS[2];

describe('simulated Satellite adapter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scenarioStore.setState({ ...DEFAULT_SCENARIO });
    resetWalletSessions();
  });

  afterEach(() => vi.useRealTimers());

  it('lists the wallets of its chain family', () => {
    const { connectors } = createSimulatedSatelliteAdapter(OrbitAdapter.EVM).getConnectors();
    expect(connectors.map((wallet) => wallet.name)).toEqual(['Orbit Wallet', 'Nebula Wallet']);
  });

  it('gives Nova an icon for every wallet, in the connector and in the connection', async () => {
    for (const wallet of SIMULATED_WALLETS) {
      expect(wallet.icon).toMatch(/^data:image\/svg\+xml,/);
      expect(decodeURIComponent(wallet.icon)).toContain('<svg');
      expect(walletIconOf(formatConnectorName(wallet.name))).toBe(wallet.icon);
    }
    expect(walletIconOf('metamask')).toBeUndefined();

    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    expect(adapter.getConnectors().connectors.map((wallet) => wallet.icon)).toEqual([
      SIMULATED_WALLETS[0].icon,
      SIMULATED_WALLETS[1].icon,
    ]);
    const connecting = adapter.connect({ connectorType: connectorTypeOf(orbit), chainId: 1 });
    await vi.advanceTimersByTimeAsync(700);
    expect((await connecting).icon).toBe(orbit.icon);
  });

  it('connects a wallet after the approval delay and records the wallet session', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    const connecting = adapter.connect({ connectorType: connectorTypeOf(orbit), chainId: 8453 });
    await vi.advanceTimersByTimeAsync(700);
    const connection = await connecting;

    expect(connection).toEqual(
      expect.objectContaining({
        connectorType: 'evm:orbitwallet',
        address: orbit.address,
        chainId: 8453,
        rpcURL: SIMULATED_RPC_URL,
        isConnected: true,
      }),
    );
    expect(currentSession(OrbitAdapter.EVM)).toEqual({ wallet: orbit, chainId: 8453 });
  });

  it('keeps Solana clusters as monikers', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.SOLANA);
    const connecting = adapter.connect({ connectorType: connectorTypeOf(comet), chainId: 'solana:devnet' });
    await vi.advanceTimersByTimeAsync(700);
    expect((await connecting).chainId).toBe('devnet');
  });

  it('keeps the cluster moniker when Nova passes the genesis-hash chain ID', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.SOLANA);
    const connecting = adapter.connect({
      connectorType: connectorTypeOf(comet),
      chainId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    });
    await vi.advanceTimersByTimeAsync(700);
    expect((await connecting).chainId).toBe('devnet');

    const updateActiveConnector = vi.fn();
    // The cluster the wallet is on already: nothing to switch
    await adapter.checkAndSwitchNetwork('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', 'devnet', updateActiveConnector);
    expect(updateActiveConnector).not.toHaveBeenCalled();

    const switching = adapter.checkAndSwitchNetwork(
      'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      'devnet',
      updateActiveConnector,
    );
    await vi.advanceTimersByTimeAsync(500);
    await switching;
    expect(updateActiveConnector).toHaveBeenCalledWith({ chainId: 'mainnet' });
    expect(currentSession(OrbitAdapter.SOLANA)?.chainId).toBe('mainnet');
  });

  it('rejects a wallet of another chain family', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.SOLANA);
    await expect(adapter.connect({ connectorType: connectorTypeOf(orbit), chainId: 1 })).rejects.toThrow(
      'No simulated wallet matches evm:orbitwallet',
    );
  });

  it('signs messages, and rejects them when the scenario says so', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    const connecting = adapter.connect({ connectorType: connectorTypeOf(orbit), chainId: 1 });
    await vi.advanceTimersByTimeAsync(700);
    const { signMessage } = await connecting;

    const signing = signMessage!('hello');
    await vi.advanceTimersByTimeAsync(900);
    expect(await signing).toMatch(/^0x[0-9a-f]{130}$/);

    scenarioStore.setState({ rejectSignature: true });
    const rejected = expect(signMessage!('hello')).rejects.toThrow('User rejected the request.');
    await vi.advanceTimersByTimeAsync(900);
    await rejected;
  });

  it('switches the network of the wallet and of the connection', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    connectWallet(orbit, 1);
    const updateActiveConnector = vi.fn();

    const switching = adapter.checkAndSwitchNetwork(42161, 1, updateActiveConnector);
    await vi.advanceTimersByTimeAsync(500);
    await switching;

    expect(currentSession(OrbitAdapter.EVM)?.chainId).toBe(42161);
    expect(updateActiveConnector).toHaveBeenCalledWith({ chainId: 42161 });
  });

  it('resolves the simulated names and forgets the wallet on disconnect', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    expect(await adapter.getName?.(orbit.address.toUpperCase())).toBe('orbit-demo.eth');
    connectWallet(orbit, 1);
    connectWallet(nebula, 8453);
    await adapter.disconnect();
    expect(currentSession(OrbitAdapter.EVM)).toBeUndefined();
  });

  it('keeps every connected wallet of a family with its chain, and follows the active one', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    const connectingOrbit = adapter.connect({ connectorType: connectorTypeOf(orbit), chainId: 1 });
    await vi.advanceTimersByTimeAsync(700);
    const orbitConnection = await connectingOrbit;
    const connectingNebula = adapter.connect({ connectorType: connectorTypeOf(nebula), chainId: 8453 });
    await vi.advanceTimersByTimeAsync(700);
    const nebulaConnection = await connectingNebula;
    expect(currentSession(OrbitAdapter.EVM)).toEqual({ wallet: nebula, chainId: 8453 });

    await adapter.switchConnection?.(connectorTypeOf(orbit));
    expect(currentSession(OrbitAdapter.EVM)).toEqual({ wallet: orbit, chainId: 1 });
    const confirming = requestTransaction(OrbitAdapter.EVM, 'Mint').catch(() => undefined);
    expect(eventLog.getState().events[0]?.label).toBe('Orbit Wallet: confirm "Mint"');
    await vi.advanceTimersByTimeAsync(1000);
    await confirming;

    // Disconnecting another wallet keeps the active one usable
    await adapter.disconnect(nebulaConnection);
    expect(currentSession(OrbitAdapter.EVM)).toEqual({ wallet: orbit, chainId: 1 });

    await adapter.disconnect(orbitConnection);
    expect(currentSession(OrbitAdapter.EVM)).toBeUndefined();
  });

  it('makes another connected wallet of the family current when the current one disconnects', async () => {
    const adapter = createSimulatedSatelliteAdapter(OrbitAdapter.EVM);
    connectWallet(orbit, 1);
    const connectingNebula = adapter.connect({ connectorType: connectorTypeOf(nebula), chainId: 8453 });
    await vi.advanceTimersByTimeAsync(700);
    await adapter.disconnect(await connectingNebula);
    expect(currentSession(OrbitAdapter.EVM)).toEqual({ wallet: orbit, chainId: 1 });
  });

  it('drops a transaction it was still confirming when the Playground was reset', async () => {
    connectWallet(orbit, 1);
    const confirming = expect(requestTransaction(OrbitAdapter.EVM, 'Mint')).rejects.toThrow('session ended');
    resetWalletSessions();
    await vi.advanceTimersByTimeAsync(1000);
    await confirming;
  });
});
