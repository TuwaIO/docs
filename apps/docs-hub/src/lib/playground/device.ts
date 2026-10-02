import { createBoundedUseStore, createPulsarStore, createTxInMemoryStore } from '@tuwaio/sdk/pulsar';
import { isSessionMatchingTarget, useSiwxSessionStore } from '@tuwaio/sdk/siwx';

import { createSimulatedPulsarAdapter } from './pulsarAdapters';
import { createQuasarHistory, quasarPreflight, syncToQuasar } from './quasar';
import type { PlaygroundTransaction, SimulatedFamily } from './types';

/** `localStorage` key of the Pulsar store of the Playground. */
export const TRANSACTIONS_STORAGE_KEY = 'tuwa-playground:transactions';

function isSignedIn(walletAddress: string): boolean {
  const { session } = useSiwxSessionStore.getState();
  return Boolean(session && isSessionMatchingTarget(session, walletAddress));
}

/**
 * Creates the stores of one simulated device (one browser), wired as in the Quasar guide: the Pulsar store, persisted
 * to `localStorage`, and the history store that shows its pool merged with the cloud history. Without Quasar the
 * history store has no `getHistory` and shows the local pool only.
 * @param params - What the stage uses.
 * @param params.families - The chain families of the stage.
 * @param params.quasar - Whether transactions are synced to the simulated Quasar.
 * @returns The stores and their React hooks; `getStagePool` and `useStagePool`, the pool the stage shows (the
 * history store's with Quasar, the Pulsar store's without); `start`, which keeps the history store in sync with the
 * Pulsar store and returns the function that stops the sync and the trackers (call it in an effect: creating a device
 * has no side effects, so React may create one twice); and `halt`, which stops the trackers and the saving to
 * `localStorage` before another device replaces this one, so work still in flight cannot write over it.
 */
export function createDevice({ families, quasar }: { families: SimulatedFamily[]; quasar: boolean }) {
  const trackers = new Set<() => void>();
  const stopTrackers = () => {
    for (const stop of trackers) stop();
    trackers.clear();
  };

  const pulsarStore = createPulsarStore<PlaygroundTransaction>({
    name: TRANSACTIONS_STORAGE_KEY,
    adapter: families.map((family) => createSimulatedPulsarAdapter(family, trackers)),
    ...(quasar && {
      // As `preFlightTxCheck` in the Quasar stack of the Code tab: no transaction without a SIWX session
      beforeTxProcess: () => quasarPreflight(() => Boolean(useSiwxSessionStore.getState().session)),
      onRemoteCreate: syncToQuasar,
    }),
  });

  const historyStore = createTxInMemoryStore<PlaygroundTransaction>({
    localTransactionsPool: pulsarStore.getState().transactionsPool,
    ...(quasar && {
      reconcileUnsyncedTransactions: pulsarStore.getState().reconcileUnsyncedTransactions,
      getHistory: createQuasarHistory(isSignedIn),
      // Pending transactions sent from another device continue to be tracked here
      onHistoryFetched: (remoteTxs: PlaygroundTransaction[]) =>
        void pulsarStore.getState().injectExternalPendingTxs(remoteTxs),
    }),
  });

  const halt = () => {
    stopTrackers();
    pulsarStore.persist.setOptions({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } });
  };

  const usePulsarStore = createBoundedUseStore(pulsarStore);
  const useHistoryStore = createBoundedUseStore(historyStore);
  // The pool the stage shows: with Quasar the history store (local pool and cloud history), otherwise the Pulsar pool,
  // as in the stack of the Code tab
  const useLocalPool = () => usePulsarStore((state) => state.transactionsPool);
  const useHistoryPool = () => useHistoryStore((state) => state.transactionsPool);

  return {
    pulsarStore,
    usePulsarStore,
    historyStore,
    useHistoryStore,
    getStagePool: () => (quasar ? historyStore : pulsarStore).getState().transactionsPool,
    useStagePool: quasar ? useHistoryPool : useLocalPool,
    start: () => {
      const stopHistorySync = pulsarStore.subscribe((state) =>
        historyStore.getState().syncWithLocalPool(state.transactionsPool),
      );
      return () => {
        stopHistorySync();
        stopTrackers();
      };
    },
    halt,
  };
}

/** The stores of a simulated device. */
export type PlaygroundDevice = ReturnType<typeof createDevice>;

/** Removes the transactions of the Playground from `localStorage`, as a new browser would have none. */
export function clearStoredTransactions(): void {
  try {
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  } catch {
    // Storage is blocked: Pulsar keeps the pool in memory only, and the new device starts empty anyway
  }
}
