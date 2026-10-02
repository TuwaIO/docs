import { type ConnectorType, formatConnectorName, OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createStore } from 'zustand/vanilla';

import { submitTransaction } from './chain';
import { randomBytes, randomHex, toBase58 } from './encoding';
import { logEvent } from './eventLog';
import { scenarioStore, wait } from './scenario';
import type { SimulatedFamily, SimulatedWallet } from './types';

function walletIcon(from: string, to: string, letter: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="43" font-family="system-ui,sans-serif" ` +
    `font-size="30" font-weight="700" text-anchor="middle" fill="#fff">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** The wallets of the simulated wallet extension: fictional, one account each. */
export const SIMULATED_WALLETS: readonly SimulatedWallet[] = [
  {
    name: 'Orbit Wallet',
    family: OrbitAdapter.EVM,
    address: '0x5749709c988f81d815681592ab2d8a851f04392e',
    displayName: 'orbit-demo.eth',
    icon: walletIcon('#6366f1', '#22d3ee', 'O'),
  },
  {
    name: 'Nebula Wallet',
    family: OrbitAdapter.EVM,
    address: '0xe5cc7053dc2367668c9acf7e6305b005cfd03f69',
    displayName: 'nebula-demo.eth',
    icon: walletIcon('#ec4899', '#f59e0b', 'N'),
  },
  {
    name: 'Comet Wallet',
    family: OrbitAdapter.SOLANA,
    address: '2pFzb4FwBwpucK9rtweHLvEFPpP38Po5chPhJwEGLEVz',
    displayName: 'comet-demo.sol',
    icon: walletIcon('#14b8a6', '#a855f7', 'C'),
  },
];

/** A wallet connected to the page, and the chain it is on (EVM chain ID or Solana cluster moniker). */
export interface WalletSession {
  wallet: SimulatedWallet;
  chainId: number | string;
}

/**
 * The state of the simulated wallet extension: every connected wallet with its chain, by connector type, and the
 * wallet each chain family uses now (the one the app made active).
 */
export interface WalletExtensionState {
  connected: Partial<Record<string, WalletSession>>;
  current: Partial<Record<SimulatedFamily, string>>;
}

/** The simulated wallet extension. Change it through the functions below, as the Satellite adapters do. */
export const walletSessions = createStore<WalletExtensionState>()(() => ({ connected: {}, current: {} }));

/** The Satellite connector type of a wallet, for example `evm:orbitwallet`. */
export function connectorTypeOf(wallet: SimulatedWallet): ConnectorType {
  return `${wallet.family}:${formatConnectorName(wallet.name)}`;
}

/** The wallet a chain family uses now, with its chain, or `undefined` when none of its wallets is connected. */
export function currentSession(family: SimulatedFamily): WalletSession | undefined {
  const { connected, current } = walletSessions.getState();
  const connectorType = current[family];
  return connectorType ? connected[connectorType] : undefined;
}

/** Connects a wallet on a chain and makes it the current wallet of its family. */
export function connectWallet(wallet: SimulatedWallet, chainId: number | string): void {
  const connectorType = connectorTypeOf(wallet);
  walletSessions.setState(({ connected, current }) => ({
    connected: { ...connected, [connectorType]: { wallet, chainId } },
    current: { ...current, [wallet.family]: connectorType },
  }));
}

/**
 * Disconnects one wallet. When it was the current wallet of its family, another connected wallet of the family (the
 * last one connected) becomes current.
 */
export function disconnectWallet(connectorType: string): void {
  walletSessions.setState(({ connected, current }) => {
    const { [connectorType]: removed, ...rest } = connected;
    if (!removed) return { connected, current };
    const family = removed.wallet.family;
    if (current[family] !== connectorType) return { connected: rest, current };
    const next = Object.keys(rest)
      .filter((key) => rest[key]?.wallet.family === family)
      .at(-1);
    return { connected: rest, current: { ...current, [family]: next } };
  });
}

/** Disconnects every wallet of a chain family. */
export function disconnectFamily(family: SimulatedFamily): void {
  walletSessions.setState(({ connected, current }) => ({
    connected: Object.fromEntries(Object.entries(connected).filter(([, session]) => session?.wallet.family !== family)),
    current: { ...current, [family]: undefined },
  }));
}

/** Makes a connected wallet the current wallet of its family. Does nothing for a wallet that is not connected. */
export function switchWallet(connectorType: string): void {
  const session = walletSessions.getState().connected[connectorType];
  if (!session) return;
  walletSessions.setState(({ current }) => ({ current: { ...current, [session.wallet.family]: connectorType } }));
}

/** Moves a connected wallet to another chain. */
export function setWalletChain(connectorType: string, chainId: number | string): void {
  walletSessions.setState(({ connected }) => {
    const session = connected[connectorType];
    return session ? { connected: { ...connected, [connectorType]: { ...session, chainId } } } : { connected };
  });
}

// Counts the resets, so a prompt that was open during one knows its session ended
let resets = 0;

/** Disconnects every wallet, as a new browser has none. A transaction prompt still open fails. */
export function resetWalletSessions(): void {
  resets += 1;
  walletSessions.setState({ connected: {}, current: {} }, true);
}

/** Finds the simulated wallet of a connector type. */
export function findWallet(connectorType: string): SimulatedWallet | undefined {
  return SIMULATED_WALLETS.find((wallet) => connectorTypeOf(wallet) === connectorType);
}

/**
 * The icon of a simulated wallet by name, as Nova passes it to a custom wallet icon: the wallet name or its
 * `formatConnectorName` form (`Orbit Wallet` or `orbitwallet`).
 * @param name - The wallet name.
 * @returns The `data:` URI of the icon, or `undefined` for another wallet.
 */
export function walletIconOf(name: string): string | undefined {
  const formatted = formatConnectorName(name);
  return SIMULATED_WALLETS.find((wallet) => formatConnectorName(wallet.name) === formatted)?.icon;
}

/** The chain family of a connector type of the simulated wallets, or `undefined` for another connector. */
export function familyOf(connectorType: string): SimulatedFamily | undefined {
  return findWallet(connectorType)?.family;
}

/**
 * The wallet's message signature prompt. Resolves after the user "approves" with a random signature: a 65-byte hex
 * string for EVM, 64 bytes in base58 for Solana.
 * @param wallet - The wallet that signs.
 * @param message - The message, for example a SIWX message.
 * @returns The signature.
 * @throws {Error} `User rejected the request.` when the scenario rejects signatures.
 */
export async function requestSignature(wallet: SimulatedWallet, message: string): Promise<string> {
  logEvent('Wallet', `${wallet.name}: sign a message`, { message });
  await wait(900);
  if (scenarioStore.getState().rejectSignature) {
    logEvent('Wallet', `${wallet.name}: signature rejected`);
    throw new Error('User rejected the request.');
  }
  return wallet.family === OrbitAdapter.EVM ? randomHex(65) : toBase58(randomBytes(64));
}

/**
 * The prompt of the current wallet of the family. After the user "confirms", the transaction goes to the simulated
 * chain, which ends it according to the scenario.
 * @param family - The chain family of the transaction.
 * @param title - What the prompt shows.
 * @returns The transaction hash (EVM) or signature (Solana).
 * @throws {Error} When no wallet of the family is connected, when the wallets were reset while the prompt was open,
 * or `User rejected the request.` for the `rejected` outcome.
 */
export async function requestTransaction(family: SimulatedFamily, title: string): Promise<string> {
  const session = currentSession(family);
  if (!session) throw new Error('Connect a wallet first.');
  const started = resets;
  logEvent('Wallet', `${session.wallet.name}: confirm "${title}"`);
  await wait(1000);
  if (resets !== started) throw new Error('The wallet session ended before the confirmation.');
  const { outcome } = scenarioStore.getState();
  if (outcome === 'rejected') {
    logEvent('Wallet', `${session.wallet.name}: transaction rejected`);
    throw new Error('User rejected the request.');
  }
  return submitTransaction(family, outcome);
}
