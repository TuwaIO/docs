'use client';

import { useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import { useSiwxSession } from '@tuwaio/sdk/siwx';
import type { ReactNode } from 'react';
import { useStore } from 'zustand';

import { quasarCloud } from '@/lib/playground/quasar';
import { walletSessions } from '@/lib/playground/wallets';

import { JsonTree } from './JsonTree';
import { usePlayground } from './PlaygroundContext';

function Section({ title, source, children }: { title: string; source: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="flex flex-wrap items-baseline gap-2 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-primary)]">
        {title}
        <code className="font-mono text-[10px] font-normal normal-case tracking-normal text-[var(--tuwa-text-tertiary)]">
          {source}
        </code>
      </h3>
      <div className="font-mono text-xs leading-relaxed">{children}</div>
    </section>
  );
}

/** The live state of the stores the stage uses: Satellite, Pulsar, SIWX, the simulated Quasar and wallet extension. */
export function StateTab() {
  const { settings, device } = usePlayground();
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const connections = useSatelliteConnectStore((state) => state.connections);
  const transactionsPool = device.usePulsarStore((state) => state.transactionsPool);
  const initialTx = device.usePulsarStore((state) => state.initialTx);
  const unsyncedTxKeys = device.usePulsarStore((state) => state.unsyncedTxKeys);
  const { status, session } = useSiwxSession();
  const cloud = useStore(quasarCloud, (state) => state.transactions);
  const wallets = useStore(walletSessions);

  return (
    <div className="flex flex-col gap-5">
      <Section title="Satellite" source="useSatelliteConnectStore">
        <JsonTree value={{ activeConnection, connections }} />
      </Section>
      <Section title="Pulsar" source="usePulsarStore">
        <JsonTree value={{ transactionsPool, initialTx, unsyncedTxKeys }} />
      </Section>
      {settings.siwx && (
        <Section title="SIWX" source="useSiwxSession">
          <JsonTree value={{ status, session }} />
        </Section>
      )}
      {settings.quasar && (
        <Section title="Quasar" source="cloud history (simulated)">
          <JsonTree value={cloud} />
        </Section>
      )}
      <Section title="Wallet extension" source="simulated">
        <JsonTree value={wallets} />
      </Section>
    </div>
  );
}
