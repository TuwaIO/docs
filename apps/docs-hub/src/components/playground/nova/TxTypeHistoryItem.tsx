import { cn } from '@tuwaio/sdk/nova-core';
import {
  TransactionHistoryItem,
  type TransactionHistoryItemIconProps,
  type TransactionHistoryItemProps,
} from '@tuwaio/sdk/nova-transactions';
import type { Transaction } from '@tuwaio/sdk/pulsar';
import type { ComponentType } from 'react';

function TypeIcon({ paths, className }: { paths: string[]; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-8 w-8 p-1.5 text-[var(--tuwa-text-accent)]', className)}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const MintIcon = ({ className }: TransactionHistoryItemIconProps) => (
  <TypeIcon className={className} paths={['M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z', 'M12 8.5v7M8.5 12h7']} />
);
const SwapIcon = ({ className }: TransactionHistoryItemIconProps) => (
  <TypeIcon className={className} paths={['M5 8h13l-3.5-3.5', 'M19 16H6l3.5 3.5']} />
);
const StakeIcon = ({ className }: TransactionHistoryItemIconProps) => (
  <TypeIcon className={className} paths={['M12 3l9 5-9 5-9-5z', 'M3 12.5l9 5 9-5', 'M3 17l9 5 9-5']} />
);

// The `type` of the app's transactions (the `type` passed to `executeTxAction`) → their icon
const TYPE_ICONS: Partial<Record<string, ComponentType<TransactionHistoryItemIconProps>>> = {
  MINT: MintIcon,
  SWAP: SwapIcon,
  STAKE: StakeIcon,
};

/**
 * A history item with an icon for the type of the transaction instead of its network (`components.HistoryItem` of
 * `TransactionsHistory`). Other types keep Nova's network icon.
 */
export function TxTypeHistoryItem(props: TransactionHistoryItemProps<Transaction>) {
  const Icon = TYPE_ICONS[props.tx.type];
  if (!Icon) return <TransactionHistoryItem {...props} />;
  return (
    <TransactionHistoryItem
      {...props}
      customization={{ ...props.customization, components: { ...props.customization?.components, Icon } }}
    />
  );
}
