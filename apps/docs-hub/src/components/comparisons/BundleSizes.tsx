'use client';

import bundleSizes from '@/generated/bundle-sizes.json';
import { formatLabel, useI18n } from '@/i18n';
import { BUNDLE_SETS, type BundleSizes as BundleSizesData, formatKb, setSize } from '@/lib/bundleSize';
import { formatCheckDate } from '@/lib/comparisons';

import { capsClassName, frameClassName } from './comparisonStyles';

const lineClassName = 'border-[var(--tuwa-border-primary)]';

/**
 * Typical TUWA installs and what they add to a page, from the sizes `scripts/build-data.mjs` measured at build time, in
 * paper and ink: a table on shared lines of 1px in a frame, the packages of a set in mono under its name, the sizes in
 * mono on the right, and the note on the measurement under a line.
 *
 * @returns The table, or nothing when no size was measured.
 */
export function BundleSizes() {
  const { locale, t } = useI18n();
  const labels = t.ui.comparisonsExtra;
  const data = bundleSizes as BundleSizesData;
  if (Object.keys(data.packages).length === 0) return null;
  const head = `border-b px-3 py-3.5 text-[var(--tuwa-text-secondary)] md:px-4 ${lineClassName} ${capsClassName}`;

  return (
    <div className={frameClassName}>
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{labels.bundleTitle}</caption>
          <thead>
            <tr>
              <th scope="col" className={`text-left ${head}`}>
                {labels.bundleSetColumn}
              </th>
              <th scope="col" className={`border-l text-right whitespace-nowrap ${head}`}>
                {labels.bundlePackagesColumn}
              </th>
              <th scope="col" className={`border-l text-right whitespace-nowrap ${head}`}>
                {labels.bundleSizeColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {BUNDLE_SETS.map((set) => {
              const { gzip, complete } = setSize(set.packages, data.packages);
              return (
                <tr key={set.id} className="last:[&>*]:border-b-0">
                  <th
                    scope="row"
                    className={`border-b px-3 py-3.5 text-left text-[15px] leading-[1.35] font-medium text-[var(--tuwa-text-primary)] md:px-4 ${lineClassName}`}
                  >
                    {labels.bundleSets[set.id] ?? set.id}
                    <span className="mt-1.5 block font-mono text-[11px] leading-[1.5] font-normal break-words text-[var(--tuwa-text-secondary)]">
                      {set.packages.map((name) => name.replace('@tuwaio/', '')).join(' · ')}
                    </span>
                  </th>
                  <td
                    className={`border-b border-l px-3 py-3.5 text-right align-top font-mono text-[var(--tuwa-text-secondary)] md:px-4 ${lineClassName}`}
                  >
                    {set.packages.length}
                  </td>
                  <td
                    className={`border-b border-l px-3 py-3.5 text-right align-top font-mono font-bold whitespace-nowrap text-[var(--tuwa-text-primary)] md:px-4 ${lineClassName}`}
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
        <p
          className={`m-0 border-t px-3 py-3.5 text-[13px] leading-normal text-[var(--tuwa-text-secondary)] md:px-4 ${lineClassName}`}
        >
          {formatLabel(labels.bundleMeasured, { date: formatCheckDate(data.measuredAt, locale) })}
        </p>
      )}
    </div>
  );
}
