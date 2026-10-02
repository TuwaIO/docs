import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import type { SatelliteAdapter } from '@tuwaio/sdk/satellite';

import { logEvent } from './eventLog';
import { wait } from './scenario';
import type { SimulatedFamily, SimulatedWallet } from './types';
import {
  connectorTypeOf,
  connectWallet,
  currentSession,
  disconnectFamily,
  disconnectWallet,
  findWallet,
  requestSignature,
  setWalletChain,
  SIMULATED_WALLETS,
  switchWallet,
} from './wallets';

/** RPC URL of the simulated connections. The `.invalid` domain never resolves, so a stray request fails at once. */
export const SIMULATED_RPC_URL = 'https://rpc.simulated.invalid';

const BALANCES: Record<SimulatedFamily, { value: string; symbol: string }> = {
  [OrbitAdapter.EVM]: { value: '2.4815', symbol: 'ETH' },
  [OrbitAdapter.SOLANA]: { value: '12.75', symbol: 'SOL' },
};

// EVM chains are numbers; Solana clusters are monikers, sometimes with the `solana:` prefix
function toWalletChain(family: SimulatedFamily, chainId: number | string): number | string {
  return family === OrbitAdapter.EVM ? Number(chainId) : String(chainId).replace(/^solana:/, '');
}

/**
 * A Satellite adapter for one chain family of the simulated wallet extension. It implements the same contract as
 * `satelliteEVMAdapter` and `satelliteSolanaAdapter`, without wallets, RPC or name services: the connections sign
 * with {@link requestSignature}, balances and names are fixed, and there is no explorer.
 * @param family - The chain family.
 * @returns The adapter.
 */
export function createSimulatedSatelliteAdapter(family: SimulatedFamily): SatelliteAdapter<SimulatedWallet> {
  const wallets = SIMULATED_WALLETS.filter((wallet) => wallet.family === family);

  return {
    key: family,
    getConnectors: () => ({ adapter: family, connectors: [...wallets] }),

    connect: async ({ connectorType, chainId }) => {
      const wallet = findWallet(connectorType);
      if (!wallet || wallet.family !== family) throw new Error(`No simulated wallet matches ${connectorType}.`);
      logEvent('Satellite', `connect ${connectorType}`, { chainId });
      // The user approves the connection in the wallet
      await wait(700);
      const walletChain = toWalletChain(family, chainId);
      connectWallet(wallet, walletChain);
      logEvent('Wallet', `${wallet.name} connected`, { address: wallet.address, chainId: walletChain });
      return {
        connectorType,
        address: wallet.address,
        chainId: walletChain,
        rpcURL: SIMULATED_RPC_URL,
        isContractAddress: false,
        isConnected: true,
        icon: wallet.icon,
        signMessage: (message: string) => requestSignature(wallet, message),
      };
    },

    disconnect: async (connection) => {
      if (connection) {
        disconnectWallet(connection.connectorType);
        logEvent('Satellite', `disconnect ${connection.connectorType}`);
      } else {
        // Satellite also calls this before every auto-connect: log it only when a wallet was connected
        if (currentSession(family)) logEvent('Satellite', `disconnect every ${family} wallet`);
        disconnectFamily(family);
      }
    },

    switchConnection: async (connectorType) => {
      switchWallet(connectorType);
      logEvent('Satellite', `switch connection to ${connectorType}`);
    },

    checkAndSwitchNetwork: async (chainId, currentChainId, updateActiveConnector) => {
      if (String(chainId) === String(currentChainId)) return;
      const session = currentSession(family);
      if (!session) throw new Error('Connect a wallet first.');
      logEvent('Satellite', `switch network to ${chainId}`);
      await wait(500);
      const walletChain = toWalletChain(family, chainId);
      setWalletChain(connectorTypeOf(session.wallet), walletChain);
      updateActiveConnector?.({ chainId: walletChain });
    },

    getBalance: async () => BALANCES[family],
    getExplorerUrl: () => undefined,
    getName: async (address) =>
      SIMULATED_WALLETS.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase())?.displayName ?? null,
    getAvatar: async () => null,
    checkIsContractAddress: async () => false,
  };
}
