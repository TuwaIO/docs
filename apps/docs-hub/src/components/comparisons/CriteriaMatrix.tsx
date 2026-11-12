'use client';

import { useI18n } from '@/i18n';
import { AXES, axisScore, CRITERIA, PRODUCTS, sourceIndex } from '@/lib/comparisons';

import { capsClassName, frameClassName } from './comparisonStyles';
import { MarkIcon, SourceRef } from './MarkIcon';

const lineClassName = 'border-[var(--tuwa-border-primary)]';
/** The column of TUWA: a breath of ink over the paper of the table. */
const tuwaClassName = 'bg-[color-mix(in_srgb,var(--tuwa-text-primary)_4%,transparent)]';

/**
 * Every criterion against every product, in paper and ink: a table on shared lines of 1px in a frame. The rows of the
 * axes show the scores on sunken paper, the rows of the criteria the marks with the note as a tooltip and a footnote to
 * the source; the column of TUWA has a breath of ink and its head the accent. It scrolls sideways on narrow screens,
 * with the column of the criteria pinned.
 *
 * @returns The table.
 */
export function CriteriaMatrix() {
  const { t } = useI18n();
  const sources = sourceIndex();

  return (
    <div className={frameClassName}>
      {/* `relative`: the marks carry their meaning as text set out of sight (`sr-only`, placed absolutely). Without a
          positioned box here that text is placed from the page, outside this scroller, and the page scrolls sideways
          as far as the last column */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-xs md:min-w-[860px]">
          <caption className="sr-only">
            Comparison criteria of TUWA and eight other products, grouped by radar axis
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className={`sticky left-0 z-10 w-[150px] border-b bg-[var(--tuwa-docs-raised)] px-3 py-3.5 text-left text-[var(--tuwa-text-secondary)] md:w-[220px] md:px-4 ${lineClassName} ${capsClassName}`}
              >
                {t.comparisons.matrix.criterionColumn}
              </th>
              {PRODUCTS.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className={`border-b border-l px-2 py-3.5 text-center whitespace-nowrap ${lineClassName} ${capsClassName} ${product.id === 'tuwa' ? `text-[var(--tuwa-text-accent)] ${tuwaClassName}` : 'text-[var(--tuwa-text-secondary)]'}`}
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          {AXES.map((axis) => (
            <tbody key={axis.id}>
              <tr>
                <th
                  scope="rowgroup"
                  className={`sticky left-0 z-10 border-b bg-[var(--tuwa-docs-sunken)] px-3 py-2.5 text-left text-[var(--tuwa-text-primary)] md:px-4 ${lineClassName} ${capsClassName}`}
                >
                  {t.comparisons.axes[axis.id]?.label ?? axis.label}
                </th>
                {PRODUCTS.map((product) => (
                  <td
                    key={product.id}
                    className={`border-b border-l bg-[var(--tuwa-docs-sunken)] px-2 py-2.5 text-center font-mono font-bold ${lineClassName} ${product.id === 'tuwa' ? 'text-[var(--tuwa-text-accent)]' : 'text-[var(--tuwa-text-primary)]'}`}
                  >
                    {axisScore(product, axis.id)}
                  </td>
                ))}
              </tr>
              {CRITERIA.filter((criterion) => criterion.axis === axis.id).map((criterion) => {
                const criterionTranslation = t.comparisons.criteria[criterion.id];
                return (
                  <tr key={criterion.id} className="[tbody:last-child>&:last-child>*]:border-b-0">
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 border-b bg-[var(--tuwa-docs-raised)] px-3 py-3 text-left text-[13px] leading-[1.35] font-normal text-[var(--tuwa-text-secondary)] md:px-4 ${lineClassName}`}
                    >
                      {criterionTranslation?.label ?? criterion.label}
                    </th>
                    {PRODUCTS.map((product) => {
                      const item = product.facts[criterion.id];
                      const localizedNote = t.comparisons.products[product.id]?.facts[criterion.id] ?? item.note;
                      return (
                        <td
                          key={product.id}
                          title={`${product.name}: ${localizedNote}`}
                          className={`border-b border-l px-2 py-3 text-center whitespace-nowrap ${lineClassName} ${product.id === 'tuwa' ? tuwaClassName : ''}`}
                        >
                          <MarkIcon mark={item.mark} />
                          <SourceRef index={sources.get(item.sourceUrl) ?? 0} url={item.sourceUrl} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
