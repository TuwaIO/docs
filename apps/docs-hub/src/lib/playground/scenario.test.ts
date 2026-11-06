import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { describe, expect, it } from 'vitest';

import { nextTxFamily, outcomeHintOf, outcomeLabelOf, type TxOutcome } from './scenario';
import type { SimulatedFamily } from './types';

const EVM = OrbitAdapter.EVM;
const SOLANA = OrbitAdapter.SOLANA;
const EVERY_FAMILY: (SimulatedFamily | undefined)[] = [EVM, SOLANA, undefined];
const OTHERS: TxOutcome[] = ['success', 'revert', 'rejected'];

describe('the outcome controls', () => {
  // Solana has no replacements: the choice ends as Failed there, and a control saying Replaced read as a broken simulation,
  // with Comet, the Solana wallet, first in the list of wallets
  it('does not offer Replaced for a Solana transaction', () => {
    expect(outcomeLabelOf('replaced', SOLANA)).toBe('expired');
    expect(outcomeHintOf('replaced', SOLANA)).toBe('expired');
  });

  it('says Replaced for an EVM transaction', () => {
    expect(outcomeLabelOf('replaced', EVM)).toBe('replaced');
    expect(outcomeHintOf('replaced', EVM)).toBe('replaced');
  });

  it('tells both while the next transaction can still be on either', () => {
    expect(outcomeLabelOf('replaced', undefined)).toBe('replaced');
    expect(outcomeHintOf('replaced', undefined)).toBe('replacedOrExpired');
  });

  it.each(OTHERS)('keeps the text of %s on every family', (outcome) => {
    for (const family of EVERY_FAMILY) {
      expect(outcomeLabelOf(outcome, family)).toBe(outcome);
      expect(outcomeHintOf(outcome, family)).toBe(outcome);
    }
  });
});

describe('nextTxFamily', () => {
  it('follows the active wallet, as the stage sends from it', () => {
    expect(nextTxFamily(SOLANA, [EVM, SOLANA])).toBe(SOLANA);
    expect(nextTxFamily(EVM, [EVM, SOLANA])).toBe(EVM);
  });

  it('knows the family before a wallet connects when the stage has one', () => {
    expect(nextTxFamily(undefined, [SOLANA])).toBe(SOLANA);
    expect(nextTxFamily(undefined, [EVM])).toBe(EVM);
  });

  it('does not guess while no wallet is connected and the stage has both', () => {
    expect(nextTxFamily(undefined, [EVM, SOLANA])).toBeUndefined();
  });
});
