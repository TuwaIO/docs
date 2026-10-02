import type { AllConnectors } from '@tuwaio/satellite-react';
import type { OrbitAdapter } from '@tuwaio/sdk/orbit';
import type { Transaction } from '@tuwaio/sdk/pulsar';

/** The chain families the Playground simulates. */
export type SimulatedFamily = OrbitAdapter.EVM | OrbitAdapter.SOLANA;

/**
 * A wallet of the simulated wallet extension. Satellite lists it as a connector; Nova Connect reads its `name` and
 * `icon`, and Satellite builds the connector type from the name (`evm:orbitwallet`).
 */
export interface SimulatedWallet {
  /** Display name of the wallet. */
  name: string;
  /** `data:` URI of the wallet icon. */
  icon: string;
  /** The chain family of the wallet. */
  family: SimulatedFamily;
  /** The one account of the wallet: a lowercase `0x` address for EVM, a base58 address for Solana. */
  address: string;
  /** The name the simulated ENS or SNS resolves the address to. */
  displayName: string;
}

/**
 * The transactions of the Playground's Pulsar store: the `Transaction` union of Pulsar, which Nova's props expect.
 * The simulated adapters create only EVM and Solana transactions.
 */
export type PlaygroundTransaction = Transaction;

// Satellite types its connectors with `AllConnectors`: the simulated wallets join the wagmi connectors and Wallet
// Standard wallets that `@tuwaio/evm-sdk/nova-connect` and `@tuwaio/solana-sdk/nova-connect` declare. The SDK
// re-exports Satellite, but an augmentation must name the declaring package, so the hub depends on it directly.
declare module '@tuwaio/satellite-react' {
  interface AllConnectors {
    simulated: SimulatedWallet;
  }
}

/** Every connector type the Satellite store of the Playground can hold. */
export type PlaygroundConnector = AllConnectors[keyof AllConnectors];
