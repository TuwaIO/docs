import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import { ReactNode } from 'react';

import { CopyIconButton } from './CopyIconButton';

interface CodeBlockProps {
  /** The title displayed in the header of the code block. */
  title: string;
  /** An icon or other React node to display next to the title. */
  titleIcons: ReactNode;
  /** The code or content to display within the block. */
  children: ReactNode;
  /** The raw text content that will be copied to the clipboard. */
  textToCopy: string;
}

/**
 * A UI component that wraps content, typically code snippets, in a styled block
 * with a header containing a title, an icon, and a copy button.
 */
export function CodeBlock({ title, titleIcons, children, textToCopy }: CodeBlockProps) {
  const { isCopied, copy } = useCopyToClipboard(1500);

  return (
    <div
      className={cn(
        'tuwadocs:group tuwadocs:overflow-hidden tuwadocs:rounded-lg tuwadocs:border',
        'tuwadocs:border-[var(--tuwa-border-secondary)] tuwadocs:bg-[var(--tuwa-bg-primary)]',
      )}
    >
      <div
        className={cn(
          'tuwadocs:flex tuwadocs:items-center tuwadocs:justify-between tuwadocs:gap-4 tuwadocs:px-4 tuwadocs:py-2',
          'tuwadocs:border-b tuwadocs:border-[var(--tuwa-border-secondary)] tuwadocs:bg-[var(--tuwa-bg-secondary)]',
        )}
      >
        <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-2">
          <div className="tuwadocs:h-[20px] tuwadocs:w-[20px] tuwadocs:text-[var(--tuwa-text-secondary)]">{titleIcons}</div>
          <p className="tuwadocs:text-sm tuwadocs:font-medium tuwadocs:text-[var(--tuwa-text-primary)]">{title}</p>
        </div>
        <div className="tuwadocs:transition tuwadocs:md:opacity-0 tuwadocs:group-hover:opacity-100">
          <CopyIconButton isCopied={isCopied} onCopy={() => copy(textToCopy)} />
        </div>
      </div>
      {children}
    </div>
  );
}
