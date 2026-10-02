'use client';

import { formatConnectorName, OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus } from '@tuwaio/sdk/pulsar';
import { useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import { getSatelliteSiwxFields, isSessionMatchingConnection, useSiwx, useSiwxSession } from '@tuwaio/sdk/siwx';

import { shortId } from '@/lib/playground/encoding';
import { isSignInPending } from '@/lib/playground/siwx';
import type { PlaygroundTransaction, SimulatedFamily } from '@/lib/playground/types';
import { familyOf } from '@/lib/playground/wallets';

import { ActionButtons } from './ActionButtons';
import { usePlayground } from './PlaygroundContext';

// The chain each family connects to first, and the chains the switcher offers
const CHAINS: Record<SimulatedFamily, { id: number | string; label: string }[]> = {
  [OrbitAdapter.EVM]: [
    { id: 1, label: 'Ethereum' },
    { id: 8453, label: 'Base' },
    { id: 42161, label: 'Arbitrum' },
  ],
  [OrbitAdapter.SOLANA]: [
    { id: 'devnet', label: 'Devnet' },
    { id: 'mainnet', label: 'Mainnet' },
  ],
};

const buttonClass =
  'rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-standart-button-bg)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--tuwa-standart-button-hover)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';

function Wallets() {
  const { families } = usePlayground();
  const getConnectors = useSatelliteConnectStore((state) => state.getConnectors);
  const connect = useSatelliteConnectStore((state) => state.connect);
  const connecting = useSatelliteConnectStore((state) => state.connecting);
  const connectors = getConnectors();

  return (
    <div className="flex flex-wrap gap-2">
      {families.flatMap((family) =>
        (connectors[family] ?? []).map((connector) => (
          <button
            key={`${family}:${connector.name}`}
            type="button"
            disabled={connecting}
            onClick={() =>
              void connect({
                connectorType: `${family}:${formatConnectorName(connector.name)}`,
                chainId: CHAINS[family][0].id,
              })
            }
            className={`${buttonClass} inline-flex items-center gap-2`}
          >
            {connector.icon && <img src={connector.icon} alt="" className="h-5 w-5 rounded" />}
            {connector.name}
          </button>
        )),
      )}
    </div>
  );
}

function Account({ family }: { family: SimulatedFamily }) {
  const { siwx, settings } = usePlayground();
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);
  const switchNetwork = useSatelliteConnectStore((state) => state.switchNetwork);
  const { signIn, signOut } = useSiwx();
  const { session, status } = useSiwxSession();
  if (!activeConnection) return null;

  // The SIWX helpers read the account and the chain of the connection
  const account = { address: activeConnection.address, chainId: activeConnection.chainId };
  const signedIn = isSessionMatchingConnection(session, account);
  const signMessage = activeConnection.signMessage;

  return (
    <div className="flex flex-col gap-3 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm">{shortId(activeConnection.address)}</p>
          <p className="text-xs text-[var(--tuwa-text-secondary)]">{activeConnection.connectorType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Network"
            value={String(activeConnection.chainId)}
            onChange={(event) => {
              const chain = CHAINS[family].find(({ id }) => String(id) === event.target.value);
              if (chain) void switchNetwork(chain.id);
            }}
            className={buttonClass}
          >
            {CHAINS[family].map(({ id, label }) => (
              <option key={id} value={String(id)}>
                {label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => void disconnect()} className={buttonClass}>
            Disconnect
          </button>
        </div>
      </div>
      {settings.siwx && (
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--tuwa-border-secondary)] pt-3 text-sm">
          {signedIn ? (
            <>
              <span className="text-[var(--tuwa-success-text)]">Signed in with SIWX</span>
              <button
                type="button"
                onClick={async () => {
                  await siwx.destroyer();
                  signOut();
                }}
                className={buttonClass}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!signMessage || isSignInPending(status)}
              onClick={() =>
                signMessage &&
                void signIn({
                  signer: signMessage,
                  getNonce: siwx.getNonce,
                  verifier: siwx.verifier,
                  fields: getSatelliteSiwxFields(account, { statement: 'Sign in to the TUWA Playground.' }),
                })
              }
              className={buttonClass}
            >
              {isSignInPending(status) ? `${status}…` : 'Sign in with SIWX'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function titleOf(tx: PlaygroundTransaction): string {
  if (!Array.isArray(tx.title)) return tx.title ?? tx.type;
  if (tx.pending) return tx.title[0];
  if (tx.status === TransactionStatus.Success) return tx.title[1];
  if (tx.status === TransactionStatus.Failed) return tx.title[2];
  return tx.title[3];
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-[var(--tuwa-pending-bg)] text-[var(--tuwa-pending-text)]',
  [TransactionStatus.Success]: 'bg-[var(--tuwa-success-bg)] text-[var(--tuwa-success-text)]',
  [TransactionStatus.Failed]: 'bg-[var(--tuwa-error-bg)] text-[var(--tuwa-error-text)]',
  [TransactionStatus.Replaced]: 'bg-[var(--tuwa-info-bg)] text-[var(--tuwa-info-text)]',
};

function Transactions() {
  const { device } = usePlayground();
  const pool = device.useStagePool();
  const error = device.usePulsarStore((state) => state.initialTx?.error);
  const transactions = Object.values(pool).sort((a, b) => b.localTimestamp - a.localTimestamp);

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-sm text-[var(--tuwa-error-text)]">{error.message}</p>}
      {transactions.length === 0 && <p className="text-sm text-[var(--tuwa-text-tertiary)]">No transactions yet.</p>}
      <ul className="flex flex-col gap-2">
        {transactions.map((tx) => {
          const status = tx.pending ? 'pending' : (tx.status ?? 'pending');
          return (
            <li
              key={tx.txKey}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)] px-3 py-2 text-sm"
            >
              <span className="min-w-0">
                <span className="font-medium">{titleOf(tx)}</span>{' '}
                <span className="font-mono text-xs text-[var(--tuwa-text-tertiary)]">{shortId(tx.txKey)}</span>
              </span>
              <span className="flex items-center gap-2 text-xs">
                {tx.syncStatus && (
                  <span className="text-[var(--tuwa-text-tertiary)]">
                    {tx.syncStatus === 'synced' ? 'synced to Quasar' : 'sync pending'}
                  </span>
                )}
                {tx.pending && tx.confirmations ? (
                  <span className="text-[var(--tuwa-text-secondary)]">{tx.confirmations} conf.</span>
                ) : null}
                <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_CLASS[status]}`}>{status}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The same dApp without Nova UI Kit: plain components on `useSatelliteConnectStore`, `useSiwx` and the Pulsar stores.
 * It shows that the TUWA stores do not need Nova: the UI is the app's own.
 */
export function HeadlessStage() {
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const family = activeConnection && familyOf(activeConnection.connectorType);

  return (
    <div className="flex flex-col gap-6 font-mono">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-bold uppercase tracking-widest">Orbit dApp, headless</p>
        <p className="text-xs text-[var(--tuwa-text-secondary)]">
          No Nova UI Kit: this UI is the app&apos;s own, on the Satellite, SIWX and Pulsar stores.
        </p>
      </header>
      {activeConnection && family ? <Account family={family} /> : <Wallets />}
      <ActionButtons withTrackedModal={false} />
      <Transactions />
    </div>
  );
}
