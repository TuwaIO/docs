import { COMPETITORS, SEGMENTS } from '@/lib/comparisons';

import { SEGMENT_COLORS } from './segmentColors';

/**
 * "When to choose them instead": for each segment, the TUWA counterpart, and for each competitor when it is the better
 * choice and how TUWA differs.
 */
export function ChooseInstead() {
  return (
    <div className="flex flex-col gap-10">
      {SEGMENTS.map((segment) => (
        <div key={segment.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
            <h3 className="flex items-center gap-2.5 text-sm font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[segment.id] }} />
              {segment.label}
            </h3>
            <p className="text-xs text-[var(--tuwa-text-secondary)]">
              TUWA counterpart:{' '}
              <span className="font-semibold text-[var(--tuwa-text-accent)]">{segment.counterpart}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPETITORS.filter((product) => product.segment === segment.id).map((product) => (
              <div
                key={product.id}
                className="relative rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-5 flex flex-col gap-4"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-5 bottom-5 w-0.5 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[segment.id] }}
                />
                <div>
                  <p className="text-base font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--tuwa-text-secondary)] mt-1 leading-relaxed">{product.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
                    Choose {product.name} when
                  </p>
                  <p className="text-sm text-[var(--tuwa-text-primary)] mt-1 leading-relaxed">{product.chooseWhen}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
                    How TUWA differs
                  </p>
                  <p className="text-sm text-[var(--tuwa-text-secondary)] mt-1 leading-relaxed">
                    {product.tuwaDifference}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
