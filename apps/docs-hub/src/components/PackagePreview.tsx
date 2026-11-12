'use client';

import { CursorArrowRaysIcon } from '@tuwaio/sdk/nova-icons/24/outline';

import { formatLabel, useI18n } from '../i18n';
import type { PackageDetails } from '../lib/packages';

export interface PackagePreviewProps {
  /** The package to preview */
  details: PackageDetails;
}

// Chips shown per list before "+N more"
const MAX_CHIPS = 6;

const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em]';

function ChipList({
  title,
  items,
  moreText,
}: {
  title: string;
  items: { label: string; isTuwa: boolean }[];
  moreText: (count: number) => string;
}) {
  const hidden = items.length - MAX_CHIPS;
  return (
    <div className="flex flex-col gap-2">
      <span className={`${capsClassName} text-[var(--tuwa-text-secondary)]`}>{title}</span>
      <span className="flex flex-wrap gap-1">
        {items.slice(0, MAX_CHIPS).map((item) => (
          <span
            key={item.label}
            className={`inline-flex h-[22px] items-center border px-1.5 font-mono text-[11px] leading-none ${
              item.isTuwa
                ? 'border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)]'
                : 'border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)]'
            }`}
          >
            {item.label}
          </span>
        ))}
        {hidden > 0 && (
          <span className="inline-flex h-[22px] items-center px-1 font-mono text-[11px] leading-none text-[var(--tuwa-text-secondary)]">
            {moreText(hidden)}
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * A summary of a package that floats below its row of a stage ledger while the row is hovered (after a short delay) or
 * focused with the keyboard: the name and version, the description, the required peers and the packages that use it,
 * and the pixel cursor of the hint that a click opens all details. In paper and ink: raised paper with scanlines in a
 * frame of 1px, square chips, no shadow. It opens below the row only, over the rows beneath, from 1024px on devices
 * with a pointer that hovers (a touch screen has the dialog). It needs a parent with the `group/row` class and
 * `position: relative`, ignores the pointer, so the rows under it stay reachable, and is hidden from assistive
 * technology, since the dialog the row opens has the same content.
 *
 * @param props - See {@link PackagePreviewProps}.
 * @returns The preview.
 */
export function PackagePreview({ details }: PackagePreviewProps) {
  const { t } = useI18n();
  const required = details.peers.filter((peer) => !peer.optional);
  const localizedDescription = t.home.packageDialog.packageDescriptions[details.name] ?? details.description;
  const localizedDeprecation = t.home.packageDialog.packageDeprecations?.[details.name] ?? details.deprecated;
  const moreText = (count: number) => formatLabel(t.ui.moreCount, { count });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none invisible absolute top-[calc(100%+6px)] left-[52px] z-30 hidden w-[min(460px,calc(100vw-48px))] translate-y-1 opacity-0 transition-[opacity,visibility,translate] duration-150 group-hover/row:visible group-hover/row:translate-y-0 group-hover/row:opacity-100 group-hover/row:delay-300 group-has-[:focus-visible]/row:visible group-has-[:focus-visible]/row:translate-y-0 group-has-[:focus-visible]/row:opacity-100 motion-reduce:transition-none lg:[@media(hover:hover)]:block"
    >
      <div className="flex flex-col gap-3.5 border border-[var(--tuwa-border-strong)] bg-[var(--tuwa-docs-raised)] p-4 tuwa-docs-scan">
        <div className="flex flex-col gap-2">
          <span className="flex items-baseline gap-2.5">
            <span className="min-w-0 truncate font-mono text-[13px] font-bold text-[var(--tuwa-text-primary)]">
              {details.name}
            </span>
            <span className="shrink-0 font-mono text-xs text-[var(--tuwa-text-secondary)]">v{details.version}</span>
          </span>
          {details.deprecated && (
            <span className="text-[13px] font-medium leading-normal text-[var(--tuwa-error-text)]">
              {t.home.packageDialog.deprecatedPrefix} {localizedDeprecation}
            </span>
          )}
          <span className="text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">{localizedDescription}</span>
        </div>

        {required.length > 0 && (
          <ChipList
            title={t.ui.requiredPeers}
            moreText={moreText}
            items={required.map((peer) => ({
              label: `${peer.name} ${peer.range}`,
              isTuwa: peer.name.startsWith('@tuwaio/'),
            }))}
          />
        )}
        {details.usedBy.length > 0 && (
          <ChipList
            title={t.ui.usedBy}
            moreText={moreText}
            items={details.usedBy.map((user) => ({ label: user, isTuwa: true }))}
          />
        )}

        <span
          className={`flex items-center gap-2 border-t border-[var(--tuwa-border-primary)] pt-3 ${capsClassName} text-[var(--tuwa-text-accent)]`}
        >
          <CursorArrowRaysIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {details.deprecated ? t.ui.clickForDetails : t.ui.clickForInstall}
        </span>
      </div>
    </div>
  );
}
