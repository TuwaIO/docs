import { cn } from '@tuwaio/sdk/nova-core';
import type { TransactionsHistoryPlaceholderProps } from '@tuwaio/sdk/nova-transactions';

/**
 * The history without transactions or without a wallet, with an illustration (`components.Placeholder` of
 * `TransactionsHistory`). Nova passes the texts of its labels.
 */
export function EmptyHistory({ title, message, className }: TransactionsHistoryPlaceholderProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 p-8 text-center', className)}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
        className="mb-2 h-12 w-12 text-[var(--tuwa-text-accent)]"
      >
        <rect x="8" y="10" width="32" height="28" rx="4" strokeDasharray="4 4" />
        <path d="M16 20h16M16 26h10" />
      </svg>
      <p className="font-semibold text-[var(--tuwa-text-primary)]">{title}</p>
      <p className="max-w-xs text-sm text-[var(--tuwa-text-secondary)]">{message}</p>
    </div>
  );
}
