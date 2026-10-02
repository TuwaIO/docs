import { describe, expect, it } from 'vitest';

import { randomHex, randomSolanaSignature, shortenDataUri, shortId, toBase58 } from './encoding';

describe('toBase58', () => {
  it('encodes the Bitcoin alphabet test vector', () => {
    expect(toBase58(new TextEncoder().encode('Hello World!'))).toBe('2NEpo7TZRRrLZSi2U');
  });

  it('keeps leading zero bytes as 1s', () => {
    expect(toBase58(new Uint8Array([0, 0, 1]))).toBe('112');
    expect(toBase58(new Uint8Array([0, 0]))).toBe('11');
  });
});

describe('random identifiers', () => {
  it('returns 32-byte hashes as 66 hex characters', () => {
    expect(randomHex(32)).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it('returns Solana signatures in base58', () => {
    expect(randomSolanaSignature()).toMatch(/^[1-9A-HJ-NP-Za-km-z]{86,88}$/);
  });
});

describe('shortId', () => {
  it('keeps the head and the tail', () => {
    expect(shortId('0x5749709c988f81d815681592ab2d8a851f04392e')).toBe('0x5749…392e');
  });

  it('leaves short values unchanged', () => {
    expect(shortId('devnet')).toBe('devnet');
  });
});

describe('shortenDataUri', () => {
  it('replaces the data of a long data URI with its length, so a wallet icon stays one line in the State tab', () => {
    const icon = `data:image/svg+xml,${'%3Csvg'.repeat(100)}`;
    expect(shortenDataUri(icon)).toBe(`data:image/svg+xml,… (${icon.length} characters)`);
  });

  it('keeps other strings, including long ones', () => {
    const message = 'localhost wants you to sign in with your Ethereum account: '.repeat(10);
    expect(shortenDataUri(message)).toBe(message);
    expect(shortenDataUri('data:,hi')).toBe('data:,hi');
  });
});
