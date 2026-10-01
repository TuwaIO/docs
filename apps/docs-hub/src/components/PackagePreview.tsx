'use client';

import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import type { Ref } from 'react';

import type { PackageDetails } from '../lib/packages';

export interface PackagePreviewProps {
  /** The package to preview */
  details: PackageDetails;
  /** Side of the row the preview opens on */
  placement: 'top' | 'bottom';
  /** The panel, measured by the row to choose the placement */
  ref?: Ref<HTMLDivElement>;
}

// Chips shown per list before "+N more"
const MAX_CHIPS = 6;

function ChipList({ title, items }: { title: string; items: { label: string; isTuwa: boolean }[] }) {
  const hidden = items.length - MAX_CHIPS;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wider text-[var(--tuwa-text-secondary)]">
        {title}
      </span>
      <span className="flex flex-wrap gap-1">
        {items.slice(0, MAX_CHIPS).map((item) => (
          <span
            key={item.label}
            className={cn(
              'px-1.5 py-px rounded-full border font-mono text-[10px] 2xl:text-[11px]',
              item.isTuwa
                ? 'border-[var(--tuwa-text-accent)]/40 text-[var(--tuwa-text-primary)]'
                : 'border-[var(--tuwa-border-primary)]/60 dark:border-white/10 text-[var(--tuwa-text-secondary)]',
            )}
          >
            {item.label}
          </span>
        ))}
        {hidden > 0 && (
          <span className="px-1 py-px text-[10px] 2xl:text-[11px] text-[var(--tuwa-text-secondary)]">
            +{hidden} more
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * A summary of a package that floats over the rows around its row of the main page while the row is hovered (after a
 * short delay) or focused with the keyboard: version, description, required peers and the packages that use it, with
 * a hint that a click opens all details. It needs a parent with the `group/row` class and `position: relative`. It
 * ignores the pointer, so the rows under it stay reachable, and is hidden from assistive technology, since the dialog
 * the row opens has the same content. Devices without hover never show it.
 *
 * @param props - See {@link PackagePreviewProps}.
 */
export function PackagePreview({ details, placement, ref }: PackagePreviewProps) {
  const required = details.peers.filter((peer) => !peer.optional);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-0 z-30 w-[28rem] max-w-full',
        placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
        'invisible opacity-0 transition-[opacity,visibility,translate] duration-150',
        placement === 'bottom' ? 'translate-y-1' : '-translate-y-1',
        'group-hover/row:visible group-hover/row:opacity-100 group-hover/row:translate-y-0 group-hover/row:delay-300',
        'group-has-[:focus-visible]/row:visible group-has-[:focus-visible]/row:opacity-100 group-has-[:focus-visible]/row:translate-y-0',
      )}
    >
      <div className="flex flex-col gap-3 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-4 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-1">
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-xs 2xl:text-sm font-semibold text-[var(--tuwa-text-primary)] truncate">
              {details.name}
            </span>
            <span className="shrink-0 text-[11px] text-[var(--tuwa-text-secondary)]">v{details.version}</span>
          </span>
          <span className="line-clamp-2 text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
            {details.deprecated ? `Deprecated: ${details.deprecated}` : details.description}
          </span>
        </div>

        {required.length > 0 && (
          <ChipList
            title="Required peers"
            items={required.map((peer) => ({
              label: `${peer.name} ${peer.range}`,
              isTuwa: peer.name.startsWith('@tuwaio/'),
            }))}
          />
        )}
        {details.usedBy.length > 0 && (
          <ChipList title="Used by" items={details.usedBy.map((user) => ({ label: user, isTuwa: true }))} />
        )}

        <span className="flex items-center gap-1.5 border-t border-[var(--tuwa-border-primary)]/60 pt-2.5 text-[11px] font-medium text-[var(--tuwa-text-accent)]">
          <CursorArrowRaysIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {details.deprecated ? 'Click for the details' : 'Click for the install command with peers, guides and links'}
        </span>
      </div>
    </div>
  );
}
