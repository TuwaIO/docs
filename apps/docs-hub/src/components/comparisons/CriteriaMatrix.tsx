import { AXES, axisScore, CRITERIA, PRODUCTS, sourceIndex } from '@/lib/comparisons';

import { MarkIcon, SourceRef } from './MarkIcon';

/**
 * Every criterion against every product: the axis rows show the scores, the criterion rows the marks with the note as
 * a tooltip and a footnote to the source. Scrolls sideways on narrow screens, with the criterion column pinned.
 */
export function CriteriaMatrix() {
  const sources = sourceIndex();

  return (
    <div className="relative rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] sm:min-w-[860px] border-collapse text-xs">
          <caption className="sr-only">
            Comparison criteria of TUWA and eight other products, grouped by radar axis
          </caption>
          <thead>
            <tr className="border-b border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.08]">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-[var(--tuwa-bg-primary)] dark:bg-[#080808] md:dark:bg-[#11152f] text-left font-semibold text-[var(--tuwa-text-tertiary)] uppercase tracking-wider text-[10px] px-3 sm:px-4 py-3 w-[150px] sm:w-[220px]"
              >
                Criterion
              </th>
              {PRODUCTS.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className={`px-2 py-3 text-center font-semibold font-geist-mono uppercase tracking-wide text-[10px] whitespace-nowrap ${product.id === 'tuwa' ? 'text-[var(--tuwa-text-accent)] bg-[var(--tuwa-text-accent)]/[0.05]' : 'text-[var(--tuwa-text-secondary)]'}`}
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          {AXES.map((axis) => (
            <tbody key={axis.id}>
              <tr className="bg-[var(--tuwa-bg-secondary)]/60 dark:bg-white/[0.03]">
                <th
                  scope="rowgroup"
                  className="sticky left-0 z-10 bg-[var(--tuwa-bg-secondary)] dark:bg-[#0f0f12] md:dark:bg-[#181c3a] text-left px-3 sm:px-4 py-2"
                >
                  <span className="text-[11px] font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)]">
                    {axis.label}
                  </span>
                </th>
                {PRODUCTS.map((product) => (
                  <td
                    key={product.id}
                    className={`px-2 py-2 text-center font-mono font-bold ${product.id === 'tuwa' ? 'text-[var(--tuwa-text-accent)] bg-[var(--tuwa-text-accent)]/[0.05]' : 'text-[var(--tuwa-text-primary)]'}`}
                  >
                    {axisScore(product, axis.id)}
                  </td>
                ))}
              </tr>
              {CRITERIA.filter((criterion) => criterion.axis === axis.id).map((criterion) => (
                <tr
                  key={criterion.id}
                  className="border-b border-[var(--tuwa-border-primary)]/20 dark:border-white/[0.04] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[var(--tuwa-bg-primary)] dark:bg-[#080808] md:dark:bg-[#11152f] text-left font-normal text-[11px] sm:text-xs text-[var(--tuwa-text-secondary)] px-3 sm:px-4 py-2.5 leading-snug"
                  >
                    {criterion.label}
                  </th>
                  {PRODUCTS.map((product) => {
                    const item = product.facts[criterion.id];
                    return (
                      <td
                        key={product.id}
                        title={`${product.name}: ${item.note}`}
                        className={`px-2 py-2.5 text-center whitespace-nowrap ${product.id === 'tuwa' ? 'bg-[var(--tuwa-text-accent)]/[0.05]' : ''}`}
                      >
                        <MarkIcon mark={item.mark} />
                        <SourceRef index={sources.get(item.sourceUrl) ?? 0} url={item.sourceUrl} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
