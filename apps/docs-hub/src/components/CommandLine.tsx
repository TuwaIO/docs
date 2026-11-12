'use client';

import { cn, CopyIcon, useCopyToClipboard } from '@tuwaio/nova-core';

import { useI18n } from '../i18n';
import { PACKAGE_MANAGERS, type PackageManager } from '../lib/packageManager';
import { secondaryButtonClassName, smallButtonClassName } from './buttonStyles';

/**
 * The switch of the package manager of the install commands: four square buttons in mono that share their frames, the
 * chosen one in ink.
 *
 * @param props.value - The chosen package manager.
 * @param props.onChange - Called with the package manager the reader picks.
 * @returns The switch.
 */
export function PackageManagerSwitch({
  value,
  onChange,
}: {
  value: PackageManager;
  onChange: (id: PackageManager) => void;
}) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t.common.packageManager} className="flex pl-px">
      {PACKAGE_MANAGERS.map(({ id }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={cn(
            '-ml-px h-7 cursor-pointer border px-2.5 font-mono text-[11px] font-bold leading-none tracking-[0.06em] transition-colors',
            value === id
              ? 'relative border-[var(--tuwa-text-primary)] bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]'
              : 'border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]',
          )}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

/**
 * A terminal command in a frame of ink: the `$` of a prompt in the accent, the command in mono and a small button that
 * copies it, whose two sheets fold into a check mark. A long command wraps onto the next lines, so all of it is in
 * sight; on a narrow screen the button goes under it. The prompt is not part of the copied or selected text.
 *
 * Side effects: the button writes the command to the clipboard.
 *
 * @param props.command - The command.
 * @param props.copyTitle - The title of the copy button (default: "Copy the command").
 * @returns The command line.
 */
export function CommandLine({ command, copyTitle }: { command: string; copyTitle?: string }) {
  const { t } = useI18n();
  const { isCopied, copy } = useCopyToClipboard(2000);
  return (
    <div className="flex flex-wrap items-center gap-3 border border-[var(--tuwa-text-primary)] p-4">
      <code className="flex min-w-0 flex-[1_1_260px] gap-2.5 font-mono text-[15px] font-medium leading-[1.5] text-[var(--tuwa-text-primary)]">
        <span aria-hidden="true" className="shrink-0 select-none font-bold text-[var(--tuwa-text-accent)]">
          $
        </span>
        <span className="min-w-0 select-all [overflow-wrap:anywhere]">{command}</span>
      </code>
      <button
        type="button"
        onClick={() => copy(command)}
        disabled={isCopied}
        title={copyTitle ?? t.common.copyCommand}
        className={`${smallButtonClassName} ${secondaryButtonClassName} disabled:cursor-default`}
      >
        <CopyIcon copied={isCopied} className="h-3.5 w-3.5" />
        {isCopied ? t.common.copied : t.common.copy}
      </button>
    </div>
  );
}
