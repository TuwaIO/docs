import { describe, expect, it } from 'vitest';

import { getPackageDetails } from './packages';

describe('package install commands', () => {
  it('installs the peers the main entry of @tuwaio/pulsar-evm needs, optional only for its /safe entry', () => {
    const details = getPackageDetails()['@tuwaio/pulsar-evm'];

    expect(details.install.packages).toEqual(expect.arrayContaining(['@tuwaio/orbit-evm', '@wagmi/core@3']));
    expect(details.peers.filter((peer) => peer.optional)).toEqual([]);
    expect(details.lighterEntries).toEqual([
      {
        entry: '@tuwaio/pulsar-evm/safe',
        description: 'the Safe tracker alone',
        withoutPeers: ['@tuwaio/orbit-evm', '@wagmi/core'],
      },
    ]);
  });

  it('leaves out the optional peers of other packages, which depend on the chains of the app', () => {
    const details = getPackageDetails()['@tuwaio/nova-connect'];

    expect(details.install.packages).not.toContain('@tuwaio/satellite-evm');
    expect(details.peers.find((peer) => peer.name === '@tuwaio/satellite-evm')?.optional).toBe(true);
    expect(details.lighterEntries).toEqual([]);
  });
});
