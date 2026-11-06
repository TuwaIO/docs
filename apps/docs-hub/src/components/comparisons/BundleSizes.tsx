'use client';

import bundleSizes from '@/generated/bundle-sizes.json';
import { formatLabel, useI18n } from '@/i18n';
import { BUNDLE_SETS, type BundleSizes as BundleSizesData, formatKb, setSize } from '@/lib/bundleSize';
import { formatCheckDate } from '@/lib/comparisons';

/**
 * Typical TUWA installs and what they add to a page, from the sizes `scripts/build-data.mjs` measured at build time.
 */
export function BundleSizes() {
  const { locale, t } = useI18n();
  const labels = t.ui.comparisonsExtra;
  const data = bundleSizes as BundleSizesData;
  if (Object.keys(data.packages).length === 0) return null;

  return (
    <div className="relative rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <caption className="sr-only">{labels.bundleTitle}</caption>
          <thead>
            <tr className="border-b border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.08] text-left text-[10px] uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
              <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">
                {labels.bundleSetColumn}
              </th>
              <th scope="col" className="px-3 sm:px-4 py-3 font-semibold text-right whitespace-nowrap">
                {labels.bundlePackagesColumn}
              </th>
              <th scope="col" className="px-3 sm:px-4 py-3 font-semibold text-right whitespace-nowrap">
                {labels.bundleSizeColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {BUNDLE_SETS.map((set) => {
              const { gzip, complete } = setSize(set.packages, data.packages);
              return (
                <tr
                  key={set.id}
                  className="border-b last:border-b-0 border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.05]"
                >
                  <th scope="row" className="px-3 sm:px-4 py-3 text-left font-medium text-[var(--tuwa-text-primary)]">
                    {labels.bundleSets[set.id] ?? set.id}
                    <span className="block mt-1 font-mono text-[10px] font-normal text-[var(--tuwa-text-tertiary)] break-words">
                      {set.packages.map((name) => name.replace('@tuwaio/', '')).join(' · ')}
                    </span>
                  </th>
                  <td className="px-3 sm:px-4 py-3 text-right font-mono text-[var(--tuwa-text-secondary)]">
                    {set.packages.length}
                  </td>
                  <td
                    className="px-3 sm:px-4 py-3 text-right font-mono font-semibold text-[var(--tuwa-text-primary)] whitespace-nowrap"
                    title={complete ? undefined : labels.bundleIncomplete}
                  >
                    {formatKb(gzip)}
                    {complete ? '' : '*'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.measuredAt && (
        <p className="border-t border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.05] px-3 sm:px-4 py-3 text-xs text-[var(--tuwa-text-tertiary)] leading-relaxed">
          {formatLabel(labels.bundleMeasured, { date: formatCheckDate(data.measuredAt, locale) })}
        </p>
      )}
    </div>
  );
}
