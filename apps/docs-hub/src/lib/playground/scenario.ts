import { createStore } from 'zustand/vanilla';

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
