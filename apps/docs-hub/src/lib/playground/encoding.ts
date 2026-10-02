// Random identifiers and short labels for the simulated chain. They look like real hashes and signatures, but they
// are random bytes: nothing is signed or sent.

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** Encodes bytes in base58, the alphabet of Solana addresses and signatures. */
export function toBase58(bytes: Uint8Array): string {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;

  const digits: number[] = [];
  for (const byte of bytes.subarray(zeros)) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] * 256;
      digits[i] = carry % 58;
      carry = Math.floor(carry / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }

  return (
    '1'.repeat(zeros) +
    digits
      .reverse()
      .map((digit) => BASE58_ALPHABET[digit])
      .join('')
  );
}

/** Returns `length` random bytes from the Web Crypto API. */
export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

/** A random `0x` hex string of `byteLength` bytes, for example a 32-byte transaction hash. */
export function randomHex(byteLength: number): `0x${string}` {
  return `0x${Array.from(randomBytes(byteLength), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

/** A random Solana transaction signature: 64 bytes in base58. */
export function randomSolanaSignature(): string {
  return toBase58(randomBytes(64));
}

/** Shortens a hash or an address for labels, for example `0x5749…392e`. */
export function shortId(value: string, head = 6, tail = 4): string {
  return value.length <= head + tail + 1 ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;
}

/**
 * Shortens a long `data:` URI, such as a wallet icon, to its media type and length for the State and Events tabs.
 * Other strings stay whole.
 */
export function shortenDataUri(value: string): string {
  if (!value.startsWith('data:') || value.length <= 64) return value;
  return `${value.slice(0, value.indexOf(',') + 1)}… (${value.length} characters)`;
}
