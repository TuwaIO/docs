import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus } from '@tuwaio/sdk/pulsar';

import { randomHex, randomSolanaSignature, shortId } from './encoding';
import { logEvent } from './eventLog';
import { type TxOutcome, wait } from './scenario';
import type { SimulatedFamily } from './types';

/** The final state of a simulated transaction. */
export interface FinalUpdate {
  type: 'final';
  /** How the transaction ended. */
  status: TransactionStatus;
  /** Unix time in seconds. */
  finishedTimestamp: number;
  /** For `Replaced`: the transaction mined instead. */
  replacedTxHash?: `0x${string}`;
  /** For `Failed`: why the transaction failed. */
  error?: string;
}

/** What the simulated chain reports about a transaction. */
export type ChainUpdate =
  | {
      /** EVM: the transaction is in the mempool, with its details. */
      type: 'pending';
      nonce: number;
      to: `0x${string}`;
      value: string;
      maxFeePerGas: string;
      maxPriorityFeePerGas: string;
    }
  | {
      /** Solana: the transaction got more confirmations. */
      type: 'confirmations';
      confirmations: number;
      slot: number;
    }
  | FinalUpdate;

/** Why a pending EVM transaction is replaced by one with the same nonce. */
export type ReplacementReason = 'speed-up' | 'cancel';

type Listener = (update: ChainUpdate) => void;

interface ChainTransaction {
  family: SimulatedFamily;
  outcome: Exclude<TxOutcome, 'rejected'>;
  listeners: Set<Listener>;
  final?: FinalUpdate;
  replacement?: { hash: `0x${string}`; reason: ReplacementReason };
  onReplaced?: () => void;
}

const SIMULATED_CONTRACT = '0x7a11d0000000000000000000000000000000c0de';

const transactions = new Map<string, ChainTransaction>();
let nextNonce = 42;
let currentSlot = 312_000_000;

const unixNow = () => Math.floor(Date.now() / 1000);

// After a reset the chain no longer knows a transaction: its run stops at the next step
const isForgotten = (key: string, tx: ChainTransaction) => transactions.get(key) !== tx;

function emit(tx: ChainTransaction, update: ChainUpdate) {
  for (const listener of tx.listeners) listener(update);
}

function describe(final: FinalUpdate, family: SimulatedFamily): string {
  if (final.status === TransactionStatus.Success) return family === OrbitAdapter.EVM ? 'mined' : 'finalized';
  if (final.status === TransactionStatus.Replaced) return `replaced by ${shortId(final.replacedTxHash ?? '')}`;
  return `failed: ${final.error}`;
}

function finish(key: string, tx: ChainTransaction, update: Omit<FinalUpdate, 'type' | 'finishedTimestamp'>) {
  if (isForgotten(key, tx)) return;
  tx.final = { type: 'final', finishedTimestamp: unixNow(), ...update };
  logEvent('Chain', `${shortId(key)} ${describe(tx.final, tx.family)}`, tx.final);
  emit(tx, tx.final);
  tx.listeners.clear();
}

async function runEvm(hash: `0x${string}`, tx: ChainTransaction) {
  const nonce = nextNonce++;
  await wait(800);
  if (isForgotten(hash, tx)) return;
  emit(tx, {
    type: 'pending',
    nonce,
    to: SIMULATED_CONTRACT,
    value: '0',
    maxFeePerGas: '24000000000',
    maxPriorityFeePerGas: '1500000000',
  });
  logEvent('Chain', `${shortId(hash)} is in the mempool`, { nonce });

  // Mined after 3.2 s, or 1 s after a speed-up or a cancel
  if (!tx.replacement) {
    await new Promise<void>((resolve) => {
      tx.onReplaced = resolve;
      void wait(3200).then(resolve);
    });
  }
  if (tx.replacement) {
    await wait(1000);
    finish(hash, tx, { status: TransactionStatus.Replaced, replacedTxHash: tx.replacement.hash });
  } else if (tx.outcome === 'revert') {
    finish(hash, tx, {
      status: TransactionStatus.Failed,
      error: 'Execution reverted: the simulated contract rejected the call.',
    });
  } else if (tx.outcome === 'replaced') {
    finish(hash, tx, { status: TransactionStatus.Replaced, replacedTxHash: randomHex(32) });
  } else {
    finish(hash, tx, { status: TransactionStatus.Success });
  }
}

async function runSolana(signature: string, tx: ChainTransaction) {
  if (tx.outcome === 'replaced') {
    // Solana has no replacements: a transaction whose blockhash expires never lands
    await wait(3200);
    finish(signature, tx, {
      status: TransactionStatus.Failed,
      error: 'Blockhash expired: the transaction did not land in time.',
    });
    return;
  }
  for (let step = 1; step <= 4; step++) {
    await wait(800);
    if (isForgotten(signature, tx)) return;
    currentSlot += 2;
    emit(tx, { type: 'confirmations', confirmations: step * 8, slot: currentSlot });
  }
  await wait(800);
  if (tx.outcome === 'revert') {
    finish(signature, tx, { status: TransactionStatus.Failed, error: 'Program failed: custom program error 0x1.' });
  } else {
    finish(signature, tx, { status: TransactionStatus.Success });
  }
}

/**
 * Submits a transaction to the simulated chain, which ends it after a few seconds according to `outcome`.
 * @param family - The chain family.
 * @param outcome - How the transaction ends.
 * @returns The transaction hash (EVM) or signature (Solana).
 */
export function submitTransaction(family: SimulatedFamily, outcome: Exclude<TxOutcome, 'rejected'>): string {
  const tx: ChainTransaction = { family, outcome, listeners: new Set() };
  if (family === OrbitAdapter.EVM) {
    const hash = randomHex(32);
    transactions.set(hash, tx);
    void runEvm(hash, tx);
    return hash;
  }
  const signature = randomSolanaSignature();
  transactions.set(signature, tx);
  void runSolana(signature, tx);
  return signature;
}

/**
 * Follows a transaction of the simulated chain. A transaction that is already final is reported once, in a
 * microtask.
 * @param key - The hash or signature returned by {@link submitTransaction}.
 * @param listener - Called with every update; the last one has `type: 'final'`.
 * @returns A function that stops the updates, or `undefined` when the chain does not know the transaction (the
 * chain lives in memory, so a page reload forgets every transaction).
 */
export function watchTransaction(key: string, listener: Listener): (() => void) | undefined {
  const tx = transactions.get(key);
  if (!tx) return undefined;
  if (tx.final) {
    const final = tx.final;
    queueMicrotask(() => listener(final));
    return () => {};
  }
  tx.listeners.add(listener);
  return () => {
    tx.listeners.delete(listener);
  };
}

/**
 * Sends a replacement of a pending EVM transaction with the same nonce, as a wallet does for a speed-up or a cancel.
 * The original transaction then ends as `Replaced`.
 * @param hash - The pending transaction.
 * @param reason - Speed-up or cancel.
 * @returns The hash of the replacement.
 * @throws {Error} When the transaction is unknown, not EVM, or no longer pending.
 */
export function replaceTransaction(hash: string, reason: ReplacementReason): `0x${string}` {
  const tx = transactions.get(hash);
  if (!tx) throw new Error('The simulated chain does not know this transaction (sent before a reload or a reset).');
  if (tx.family !== OrbitAdapter.EVM) throw new Error('Only pending EVM transactions can be replaced.');
  if (tx.final || tx.replacement) throw new Error('The transaction is no longer pending.');
  tx.replacement = { hash: randomHex(32), reason };
  logEvent('Chain', `${reason} of ${shortId(hash)} sent as ${shortId(tx.replacement.hash)}`, tx.replacement);
  tx.onReplaced?.();
  return tx.replacement.hash;
}

/** Forgets every transaction: they stop at their next step, without updates or events. */
export function resetChain(): void {
  for (const tx of transactions.values()) tx.listeners.clear();
  transactions.clear();
}
