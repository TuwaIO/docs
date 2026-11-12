'use client';

import { useI18n } from '@/i18n';
import type { Mark } from '@/lib/comparisons';

/**
 * A comparison mark, in paper and ink: a square that is as full as the criterion is met. `yes` is a square of ink with
 * a check, `partial` a square half of ink, `no` an empty square with a dash; the mark is read out as text.
 *
 * @param props.mark - The mark.
 * @param props.className - Size classes (default: 16px, on whole pixels).
 * @returns The mark.
 */
export function MarkIcon({ mark, className = 'h-4 w-4' }: { mark: Mark; className?: string }) {
  const { t } = useI18n();
  const labels: Record<Mark, string> = {
    yes: t.common.yes,
    partial: t.common.partial,
    no: t.common.no,
  };
  return (
    <span className="inline-flex shrink-0 align-middle">
      <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
        {mark === 'yes' && (
          <>
            <rect x="1" y="1" width="14" height="14" className="fill-[var(--tuwa-text-primary)]" />
            <path
              d="M4.5 8.4l2.4 2.4 4.6-5.4"
              fill="none"
              className="stroke-[var(--tuwa-docs-raised)]"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </>
        )}
        {mark === 'partial' && (
          <>
            <rect
              x="1.5"
              y="1.5"
              width="13"
              height="13"
              fill="none"
              className="stroke-[var(--tuwa-text-primary)]"
              shapeRendering="crispEdges"
            />
            <rect x="1" y="1" width="7" height="14" className="fill-[var(--tuwa-text-primary)]" />
          </>
        )}
        {mark === 'no' && (
          <>
            <rect
              x="1.5"
              y="1.5"
              width="13"
              height="13"
              fill="none"
              className="stroke-[var(--tuwa-border-strong)]"
              shapeRendering="crispEdges"
            />
            <rect x="5" y="7" width="6" height="2" className="fill-[var(--tuwa-text-secondary)]" />
          </>
        )}
      </svg>
      <span className="sr-only">{labels[mark]}</span>
    </span>
  );
}

/**
 * A footnote link to a numbered source in the Sources list of the page.
 *
 * @param props.index - Number of the source.
 * @param props.url - Source URL, shown as the link title.
 * @returns The link.
 */
export function SourceRef({ index, url }: { index: number; url: string }) {
  return (
    <a
      href={`#source-${index}`}
      title={url}
      className="ml-0.5 align-super font-mono text-[10px] text-[var(--tuwa-text-secondary)] no-underline hover:text-[var(--tuwa-text-accent)]"
    >
      [{index}]
    </a>
  );
}
