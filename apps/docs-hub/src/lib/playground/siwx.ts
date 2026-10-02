import type { NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import type { SiwxStatus } from '@tuwaio/sdk/siwx';
import { generateNonce, parseMessage, validateMessage } from '@tuwaio/sdk/siwx/core';

import { logEvent } from './eventLog';
import { wait } from './scenario';

type NovaSiwx = NonNullable<NovaConnectProviderProps['siwx']>;

/** The backend calls of a SIWX sign-in: the same shape as `getNonce`, `verifier` and `destroyer` of Nova Connect. */
export type SimulatedSiwx = Required<Pick<NovaSiwx, 'getNonce' | 'verifier' | 'destroyer'>>;

/**
 * The SIWX backend of the Playground, running in the browser instead of the routes of `@tuwaio/siwx-server`. It issues
 * nonces with `generateNonce`, parses and validates the signed message with `parseMessage` and `validateMessage`
 * (domain, timing, single-use nonce) and returns the session. Only the signature check is skipped: the simulated
 * wallets return random signatures.
 * @param domain - The domain messages must be signed for, usually `window.location.host`.
 * @returns The calls to pass to Nova Connect's `siwx` or to `useSiwx().signIn`.
 */
export function createSimulatedSiwx(domain: string): SimulatedSiwx {
  const issuedNonces = new Set<string>();

  return {
    getNonce: async () => {
      await wait(300);
      const nonce = generateNonce();
      issuedNonces.add(nonce);
      logEvent('SIWX', 'GET /api/siwx/nonce → 200', { nonce });
      return nonce;
    },

    verifier: async ({ message, signature }) => {
      logEvent('SIWX', 'POST /api/siwx/verify', { message, signature });
      await wait(500);
      let errors: string[];
      try {
        const fields = parseMessage(message);
        const result = validateMessage(fields, { policy: { expectedDomain: domain } });
        const freshNonce = issuedNonces.delete(fields.nonce);
        errors = freshNonce ? result.errors : [...result.errors, 'The nonce was not issued here or was already used.'];
        if (errors.length === 0) {
          const session = {
            address: fields.address,
            chainId: fields.chainId,
            domain: fields.domain,
            issuedAt: fields.issuedAt,
            expirationTime: fields.expirationTime,
          };
          logEvent('SIWX', 'POST /api/siwx/verify → 200, session cookie set (signature check simulated)', session);
          return session;
        }
      } catch (error) {
        errors = [error instanceof Error ? error.message : String(error)];
      }
      logEvent('SIWX', 'POST /api/siwx/verify → 401', { errors });
      return null;
    },

    destroyer: async () => {
      logEvent('SIWX', 'POST /api/siwx/logout → 200, session cookie cleared');
    },
  };
}

/**
 * Whether a sign-in is running (`building`, `signing` or `verifying`). The other statuses allow a new sign-in: the
 * session restored after a reload (`authenticated`) may belong to another wallet than the connected one.
 */
export function isSignInPending(status: SiwxStatus): boolean {
  return status === 'building' || status === 'signing' || status === 'verifying';
}
