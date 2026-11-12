'use client';

import { formatLabel, useI18n } from '@/i18n';
import { COMPETITORS, SEGMENTS } from '@/lib/comparisons';

import { capsClassName } from './comparisonStyles';

const lineClassName = 'border-[var(--tuwa-border-primary)]';

/**
 * "When to choose them instead", in paper and ink: for each segment a head on a line of ink (its name in mono caps, the
 * TUWA projects that do the same job on the right) and its products as cells on shared lines of 1px, two in a row from
 * 768px: what the product is, when it is the better choice and how TUWA differs.
 *
 * Each segment is a waypoint of the flight plan of the page (`#segment-<id>`).
 *
 * @returns The segments.
 */
export function ChooseInstead() {
  const { t } = useI18n();
  const label = `m-0 text-[var(--tuwa-text-secondary)] ${capsClassName}`;

  return (
    <div className="flex flex-col gap-14">
      {SEGMENTS.map((segment) => (
        <div key={segment.id} id={`segment-${segment.id}`} className="scroll-mt-[120px]">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t border-[var(--tuwa-border-strong)] pt-4 pb-[18px]">
            <h3 className="m-0 font-mono text-[15px] font-bold uppercase leading-[1.25] tracking-[0.12em] text-[var(--tuwa-text-primary)]">
              {t.comparisons.segments[segment.id]?.label ?? segment.label}
            </h3>
            <p className="m-0 text-sm leading-[1.4] text-[var(--tuwa-text-secondary)]">
              {t.ui.comparisonsExtra.tuwaCounterpartLabel}:{' '}
              <span className="font-mono text-[13px] font-bold text-[var(--tuwa-text-accent)]">
                {segment.counterpart}
              </span>
            </p>
          </div>
          <div className={`grid grid-cols-1 border-t border-l md:grid-cols-2 ${lineClassName}`}>
            {COMPETITORS.filter((product) => product.segment === segment.id).map((product) => {
              const productTrans = t.comparisons.products[product.id];
              return (
                <div
                  key={product.id}
                  className={`flex flex-col gap-4 border-r border-b bg-[var(--tuwa-docs-raised)] p-5 ${lineClassName}`}
                >
                  <div>
                    <p className="m-0 font-mono text-base font-bold leading-[1.25] text-[var(--tuwa-text-primary)]">
                      {product.name}
                    </p>
                    <p className="m-0 mt-1.5 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
                      {productTrans?.summary ?? product.summary}
                    </p>
                  </div>
                  <div>
                    <p className={label}>{formatLabel(t.comparisons.chooseInstead.pickWhen, { name: product.name })}</p>
                    <p className="m-0 mt-1.5 text-sm leading-normal text-[var(--tuwa-text-primary)]">
                      {productTrans?.chooseWhen ?? product.chooseWhen}
                    </p>
                  </div>
                  <div>
                    <p className={label}>{t.comparisons.chooseInstead.howTuwaDiffers}</p>
                    <p className="m-0 mt-1.5 text-sm leading-normal text-[var(--tuwa-text-secondary)]">
                      {productTrans?.tuwaDifference ?? product.tuwaDifference}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
