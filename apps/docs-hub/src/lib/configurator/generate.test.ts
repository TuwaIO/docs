import { describe, expect, it } from 'vitest';

import { allStackOptions, generateStack, stackKey } from './generate';

describe('the stacks of the Stack Configurator', () => {
  // Pulsar keeps no RPC URL on a transaction, the rpcUrls of the adapter are the one source, so this key fails the type
  // check of the app a reader builds. tools/configurator-check compiles every stack, but it is not part of CI.
  it('pass no rpcUrl along with a transaction', () => {
    const withRpcUrl = allStackOptions()
      .filter((options) =>
        generateStack(options).files.some(({ code }) => /^\s*rpcUrl\s*[,:]|\brpcUrl: string\b/m.test(code)),
      )
      .map(stackKey);

    expect(withRpcUrl).toEqual([]);
  });
});
