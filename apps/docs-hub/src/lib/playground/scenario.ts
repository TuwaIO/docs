import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createStore } from 'zustand/vanilla';

import type { SimulatedFamily } from './types';

/** How the next transaction ends. `replaced` is an expired blockhash on Solana, which has no replacements. */
export type TxOutcome = 'success' | 'revert' | 'replaced' | 'rejected';

/** `fast` divides every simulated delay by 4. */
export type SimulationSpeed = 'fast' | 'realistic';

/** The knobs of the simulation, set in the Scenario panel. */
export interface ScenarioState {
  /** How the next transaction ends: mined, reverted, replaced (EVM) or expired (Solana), or rejected in the wallet. */
  outcome: TxOutcome;
  /** How long the wallet and the chain take. */
  speed: SimulationSpeed;
  /** Whether the wallet rejects the next message signature, such as the SIWX sign-in. */
  rejectSignature: boolean;
  /** Whether the simulated Quasar accepts requests. */
  quasarOnline: boolean;
}

export const DEFAULT_SCENARIO: ScenarioState = {
  outcome: 'success',
  speed: 'realistic',
  rejectSignature: false,
  quasarOnline: true,
};

/** The scenario of the simulation, read by the simulated wallet, chain and Quasar when they act. */
export const scenarioStore = createStore<ScenarioState>()(() => ({ ...DEFAULT_SCENARIO }));

/** Waits `ms` milliseconds, or a quarter of it at the `fast` speed. */
export function wait(ms: number): Promise<void> {
  const duration = scenarioStore.getState().speed === 'fast' ? ms / 4 : ms;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * The chain family of the next transaction: that of the active wallet, as the stage sends from it, or the only family of
 * the stage.
 * @param activeFamily - The family of the active wallet, if one is connected.
 * @param families - The families of the stage.
 * @returns The family, or `undefined` while no wallet is connected and the stage has both.
 */
export function nextTxFamily(
  activeFamily: SimulatedFamily | undefined,
  families: SimulatedFamily[],
): SimulatedFamily | undefined {
  return activeFamily ?? (families.length === 1 ? families[0] : undefined);
}

/**
 * The label of an outcome in the controls. Solana has no replacements, so there the `replaced` choice is an expired blockhash,
 * which ends as Failed: a control saying Replaced read as a simulation whose replaced transactions all fail.
 * @param outcome - The outcome chosen.
 * @param family - The family of the next transaction, from {@link nextTxFamily}.
 * @returns The key of the label.
 */
export function outcomeLabelOf(outcome: TxOutcome, family: SimulatedFamily | undefined): TxOutcome | 'expired' {
  return outcome === 'replaced' && family === OrbitAdapter.SOLANA ? 'expired' : outcome;
}

/**
 * The hint of an outcome in the controls, which tells only the chain the next transaction goes to once that is known.
 * @param outcome - The outcome chosen.
 * @param family - The family of the next transaction, from {@link nextTxFamily}.
 * @returns The key of the hint.
 */
export function outcomeHintOf(
  outcome: TxOutcome,
  family: SimulatedFamily | undefined,
): TxOutcome | 'expired' | 'replacedOrExpired' {
  if (outcome !== 'replaced' || family === OrbitAdapter.EVM) return outcome;
  return family === OrbitAdapter.SOLANA ? 'expired' : 'replacedOrExpired';
}
