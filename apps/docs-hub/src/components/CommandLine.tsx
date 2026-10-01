'use client';

import { CheckIcon, ClipboardDocumentIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';

import { PACKAGE_MANAGERS, type PackageManager } from '../lib/packageManager';

/**
 * Buttons to pick the package manager of the install commands.
 * @param props.value - The chosen package manager.
 * @param props.onChange - Called with the package manager the reader picks.
 */
export function PackageManagerSwitch({
  value,
  onChange,
}: {
  value: PackageManager;
  onChange: (id: PackageManager) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Package manager"
      className="flex rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 p-0.5"
    >
      {PACKAGE_MANAGERS.map(({ id }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={cn(
            'cursor-pointer rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-0.5 font-mono text-[11px] transition-colors',
            value === id
              ? 'bg-[var(--tuwa-text-accent)]/15 text-[var(--tuwa-text-primary)]'
              : 'text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
          )}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

/**
 * A terminal command on one line with a copy button. A long command scrolls sideways; the faded right edge shows that
 * it goes on, and the padding lets its end scroll out of the fade.
 * @param props.command - The command.
 * @param props.copyTitle - Title of the copy button.
 */
export function CommandLine({ command, copyTitle = 'Copy the command' }: { command: string; copyTitle?: string }) {
  const { isCopied, copy } = useCopyToClipboard(2000);
  return (
    <div className="flex items-center gap-3 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-secondary)]/50 dark:bg-white/[0.02] pl-3 pr-2 font-mono text-xs sm:text-sm text-[var(--tuwa-text-primary)]">
      <CommandLineIcon className="w-4 h-4 shrink-0 text-[var(--tuwa-text-accent)]" aria-hidden="true" />
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2.5 pr-8 select-all [scrollbar-width:thin] [mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)]">
        {command}
      </code>
      <button
        type="button"
        onClick={() => copy(command)}
        disabled={isCopied}
        title={copyTitle}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-sans cursor-pointer text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] disabled:cursor-default"
      >
        {isCopied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
