import { buildMessage } from '@tuwaio/sdk/siwx/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SCENARIO, scenarioStore } from './scenario';
import { createSimulatedSiwx, isSignInPending } from './siwx';

const address = 'eip155:1:0x5749709c988f81d815681592ab2d8a851f04392e';

function message(domain: string, nonce: string) {
  return buildMessage({
    domain,
    address,
    uri: `https://${domain}/playground`,
    version: '1',
    chainId: 'eip155:1',
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 60_000).toISOString(),
  });
}

async function settle<T>(promise: Promise<T>): Promise<T> {
  await vi.advanceTimersByTimeAsync(500);
  return promise;
}

describe('simulated SIWX backend', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scenarioStore.setState({ ...DEFAULT_SCENARIO });
  });

  afterEach(() => vi.useRealTimers());

  it('issues a nonce and returns the session of a valid message once', async () => {
    const siwx = createSimulatedSiwx('docs.tuwa.io');
    const nonce = await settle(siwx.getNonce());
    const signed = { message: message('docs.tuwa.io', nonce), signature: '0x00' };

    expect(await settle(siwx.verifier(signed))).toEqual(
      expect.objectContaining({ address, chainId: 'eip155:1', domain: 'docs.tuwa.io' }),
    );
    // The nonce is single-use
    expect(await settle(siwx.verifier(signed))).toBeNull();
  });

  it('rejects a message signed for another domain', async () => {
    const siwx = createSimulatedSiwx('docs.tuwa.io');
    const nonce = await settle(siwx.getNonce());
    expect(await settle(siwx.verifier({ message: message('evil.example', nonce), signature: '0x00' }))).toBeNull();
  });

  it('rejects a nonce it did not issue', async () => {
    const siwx = createSimulatedSiwx('docs.tuwa.io');
    const signed = { message: message('docs.tuwa.io', '0123456789abcdef0123456789abcdef'), signature: '0x00' };
    expect(await settle(siwx.verifier(signed))).toBeNull();
  });

  it('rejects text that is not a CAIP-122 message', async () => {
    const siwx = createSimulatedSiwx('docs.tuwa.io');
    expect(await settle(siwx.verifier({ message: 'hello', signature: '0x00' }))).toBeNull();
  });
});

describe('isSignInPending', () => {
  it('is true only while a sign-in runs, so a restored session of another wallet does not block signing in', () => {
    expect((['building', 'signing', 'verifying'] as const).every(isSignInPending)).toBe(true);
    expect(isSignInPending('idle')).toBe(false);
    expect(isSignInPending('error')).toBe(false);
    expect(isSignInPending('authenticated')).toBe(false);
  });
});
