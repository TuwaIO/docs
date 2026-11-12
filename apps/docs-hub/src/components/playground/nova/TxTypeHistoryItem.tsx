import { cn } from '@tuwaio/sdk/nova-core/utils';
import { ArrowsRightLeftIcon, LockClosedIcon, SparklesIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import {
  TransactionHistoryItem,
  type TransactionHistoryItemIconProps,
  type TransactionHistoryItemProps,
} from '@tuwaio/sdk/nova-transactions';
import type { Transaction } from '@tuwaio/sdk/pulsar';
import type { ComponentType, SVGProps } from 'react';

// An icon of the type in the accent, 32px: the pixel icons of Nova are drawn on a grid, so they keep a size of 16 or 32
const typeIcon = (Icon: ComponentType<SVGProps<SVGSVGElement>>) =>
  function TypeIcon({ className }: TransactionHistoryItemIconProps) {
    return <Icon aria-hidden="true" className={cn('h-8 w-8 text-[var(--tuwa-text-accent)]', className)} />;
  };

// The `type` of the app's transactions (the `type` passed to `executeTxAction`) → their icon
const TYPE_ICONS: Partial<Record<string, ComponentType<TransactionHistoryItemIconProps>>> = {
  MINT: typeIcon(SparklesIcon),
  SWAP: typeIcon(ArrowsRightLeftIcon),
  STAKE: typeIcon(LockClosedIcon),
};

/**
 * A history item with an icon for the type of the transaction instead of its network (`components.HistoryItem` of
 * `TransactionsHistory`): a pixel icon of `@tuwaio/sdk/nova-icons`. Other types keep Nova's network icon.
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
