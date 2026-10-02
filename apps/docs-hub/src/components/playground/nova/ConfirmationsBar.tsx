import { cn } from '@tuwaio/sdk/nova-core';

// Solana finalizes a transaction after 32 confirmations: the bar fills up to it when Nova passes no requirement
const FINALIZED = 32;

/**
 * The confirmations of a transaction as a bar along the top of its toast, instead of Nova's counter badge
 * (`components.ConfirmationsBadge` of the toast). Nova also passes `required`, the confirmations the transaction needs.
 */
export function ConfirmationsBar({
  count,
  required,
  className,
}: {
  count: number | string;
  required?: number;
  className?: string;
}) {
  const total = Number(required) || FINALIZED;
  const progress = Math.min(Number(count) / total, 1);

  return (
    <div
      role="progressbar"
      aria-label="Confirmations"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Number(count)}
      className={cn('absolute inset-x-0 top-0 h-1 overflow-hidden bg-[var(--tuwa-border-primary)]', className)}
    >
      <div
        className="h-full bg-[var(--tuwa-text-accent)] transition-[width] duration-500"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
