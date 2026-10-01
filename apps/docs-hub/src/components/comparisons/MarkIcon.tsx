import type { Mark } from '@/lib/comparisons';

const LABELS: Record<Mark, string> = { yes: 'Yes', partial: 'Partial', no: 'No' };

/**
 * A comparison mark: a check for `yes`, a half-filled circle for `partial`, a dash for `no`, with the mark as text for
 * screen readers.
 * @param props.mark - The mark.
 * @param props.className - Size classes.
 */
export function MarkIcon({ mark, className = 'w-4 h-4' }: { mark: Mark; className?: string }) {
  return (
    <span className="inline-flex shrink-0 align-middle">
      <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
        {mark === 'yes' && (
          <>
            <circle cx="10" cy="10" r="9" className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="1.5" />
            <path
              d="M6.2 10.4l2.4 2.4 5.2-5.6"
              fill="none"
              className="stroke-emerald-500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {mark === 'partial' && (
          <>
            <circle cx="10" cy="10" r="9" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
            <path d="M10 3.5a6.5 6.5 0 0 1 0 13z" className="fill-amber-500" />
          </>
        )}
        {mark === 'no' && (
          <>
            <circle
              cx="10"
              cy="10"
              r="9"
              className="fill-transparent stroke-[var(--tuwa-text-tertiary)]/50"
              strokeWidth="1.5"
            />
            <path d="M6.5 10h7" className="stroke-[var(--tuwa-text-tertiary)]" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span className="sr-only">{LABELS[mark]}</span>
    </span>
  );
}

/**
 * A footnote link to a numbered source in the Sources list of the page.
 * @param props.index - Number of the source.
 * @param props.url - Source URL, shown as the link title.
 */
export function SourceRef({ index, url }: { index: number; url: string }) {
  return (
    <a
      href={`#source-${index}`}
      title={url}
      className="ml-0.5 align-super text-[10px] font-mono text-[var(--tuwa-text-tertiary)] hover:text-[var(--tuwa-text-accent)] no-underline"
    >
      [{index}]
    </a>
  );
}
