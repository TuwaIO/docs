import { CheckCircleIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';

interface CopyIconButtonProps {
  isCopied: boolean;
  onCopy: () => void;
}

export function CopyIconButton({ isCopied, onCopy }: CopyIconButtonProps) {
  return (
    <button
      onClick={onCopy}
      type="button"
      className={cn(
        'tuwadocs:h-6 tuwadocs:w-6 tuwadocs:cursor-pointer tuwadocs:transition-colors',
        isCopied
          ? 'tuwadocs:text-[var(--tuwa-success-icon)]'
          : 'tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:hover:text-[var(--tuwa-text-primary)]',
      )}
    >
      {isCopied ? <CheckCircleIcon /> : <Square2StackIcon />}
    </button>
  );
}
