'use client';

import { formatLabel, useI18n } from '../i18n';
import { formatKb } from '../lib/bundleSize';
import { formatCheckDate } from '../lib/comparisons';
import type { PackageDetails } from '../lib/packages';

const BADGE =
  'shrink-0 font-mono text-[10px] 2xl:text-[11px] leading-none px-1.5 py-1 rounded-[2px] border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 bg-[var(--tuwa-bg-primary)] dark:bg-white/[0.03] text-[var(--tuwa-text-secondary)] opacity-80 group-hover/badge:opacity-100 transition-opacity';

/**
 * Version, licence and size of a package row on the main page, from the data `scripts/build-data.mjs` saved at build
 * time; the page makes no requests to badge services.
 * @param props.details - The details of the package.
 */
export function PackageBadges({ details }: { details: PackageDetails }) {
  const { locale, t } = useI18n();
  const labels = t.ui.packageBadges;
  const { size } = details;
  const sizeTitle =
    size && details.sizeMeasuredAt
      ? [
          formatLabel(labels.size, { date: formatCheckDate(details.sizeMeasuredAt, locale) }),
          size.lazyGzip ? formatLabel(labels.sizeLazy, { size: formatKb(size.lazyGzip) }) : '',
        ]
          .filter(Boolean)
          .join(' ')
      : undefined;

  return (
    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
      <span className={BADGE} title={labels.version}>
        v{details.version}
      </span>
      {details.license && (
        <span className={BADGE} title={labels.license}>
          {details.license}
        </span>
      )}
      {size && (
        <span className={BADGE} title={sizeTitle}>
          {formatKb(size.gzip)} gzip
        </span>
      )}
    </div>
  );
}
