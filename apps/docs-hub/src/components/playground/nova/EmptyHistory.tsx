import { cn } from '@tuwaio/sdk/nova-core/utils';
import { DocumentTextIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import type { TransactionsHistoryPlaceholderProps } from '@tuwaio/sdk/nova-transactions';

/**
 * The history without transactions or without a wallet, with a pixel icon of `@tuwaio/sdk/nova-icons` in the accent
 * (`components.Placeholder` of `TransactionsHistory`). Nova passes the texts of its labels.
 */
export function EmptyHistory({ title, message, className }: TransactionsHistoryPlaceholderProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 p-8 text-center', className)}>
      <DocumentTextIcon aria-hidden="true" className="mb-2 h-8 w-8 text-[var(--tuwa-text-accent)]" />
      <p className="font-semibold text-[var(--tuwa-text-primary)]">{title}</p>
      <p className="max-w-xs text-sm text-[var(--tuwa-text-secondary)]">{message}</p>
    </div>
  );
}
