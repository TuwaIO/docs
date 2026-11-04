import { describe, expect, it } from 'vitest';

import { getPackageDetails } from './packages';

describe('package links', () => {
  it('sends the Quasar client to its own site and repository, and the rest of Nova to the Nova Storybook', () => {
    const details = getPackageDetails();

    expect(details['@tuwaio/quasar-sdk'].docsUrl).toBe(
      'https://payments.docs.tuwa.io/?path=/docs/packages-quasar-sdk-overview--docs',
    );
    expect(details['@tuwaio/quasar-sdk'].sourceUrl).toBe(
      'https://github.com/TuwaIO/quasar-client/tree/main/packages/quasar-sdk',
    );
    expect(details['@tuwaio/nova-core'].docsUrl).toBe(
      'https://stories.tuwa.io/?path=/docs/packages-nova-core-overview--docs',
    );
  });
});

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
