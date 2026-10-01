import { AXES, CRITERIA, formatCheckDate, sourceIndex, verifiedAsOf } from '@/lib/comparisons';

import { MarkIcon } from './MarkIcon';

const DATA_URL = 'https://github.com/TuwaIO/docs/blob/main/apps/docs-hub/src/lib/comparisons.ts';
const ISSUE_URL = 'https://github.com/TuwaIO/docs/issues/new?title=Comparisons%3A%20correction';

/**
 * How the radar is computed, what the marks mean, the transparency note and the numbered list of sources that the
 * footnotes of the page point to.
 */
export function Methodology() {
  const sources = [...sourceIndex()];
  const perAxis = CRITERIA.length / AXES.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
      <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-5 sm:p-6 flex flex-col gap-5 text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">
        <div>
          <h3 className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-2">
            Scoring
          </h3>
          <p>
            Each axis has {perAxis} yes-or-no criteria, listed in the table above. A product scores{' '}
            <code className="text-xs font-mono text-[var(--tuwa-text-primary)]">
              (met + ½ · partial) ÷ {perAxis} × 100
            </code>{' '}
            on the axis. Nothing is weighted or adjusted by hand: the page computes every score from the facts.
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-xs">
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="yes" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">Met:</strong> the vendor documents it for the product
              as a whole.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="partial" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">Partial:</strong> only for some of its wallets,
              transactions or plans, or only with an optional feature turned off.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="no" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">Not met:</strong> missing, outside the product&apos;s
              job, or not documented (we found no mention in the vendor&apos;s documentation on the check date).
            </span>
          </li>
        </ul>
        <div>
          <h3 className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-2">
            What we compare
          </h3>
          <p>
            A product is scored as its vendor offers it by default, optional features included. TUWA is a set of
            packages, so each competitor faces the TUWA projects that do the same job; the radar shows the whole stack.
            Two axes, Onboarding and Chain Coverage, favor hosted platforms by design, and we keep them so the picture
            stays honest.
          </p>
        </div>
        <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-text-accent)]/20 bg-[var(--tuwa-text-accent)]/[0.05] p-4 text-xs">
          <p className="font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-1.5">
            Transparency note
          </p>
          <p>
            TUWA wrote this page. Every fact was verified on {formatCheckDate(verifiedAsOf())} against primary sources:
            vendor documentation, licenses on GitHub and npm, and pricing pages. We recheck it every quarter. The data
            lives in{' '}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--tuwa-text-accent)] hover:underline"
            >
              one typed file
            </a>
            ; if something is outdated or wrong,{' '}
            <a
              href={ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--tuwa-text-accent)] hover:underline"
            >
              open an issue
            </a>{' '}
            and we will fix it.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-5 sm:p-6">
        <h3
          id="sources"
          className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-3"
        >
          Sources
        </h3>
        <ol className="flex flex-col gap-1.5 text-xs max-h-[560px] overflow-y-auto pr-2 [scrollbar-width:thin]">
          {sources.map(([url, index]) => {
            const { hostname, pathname } = new URL(url);
            return (
              <li
                key={url}
                id={`source-${index}`}
                className="flex gap-2 scroll-mt-24 target:text-[var(--tuwa-text-accent)]"
              >
                <span className="w-7 shrink-0 text-right font-mono text-[var(--tuwa-text-tertiary)]">[{index}]</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 break-all text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-accent)] transition-colors"
                >
                  <span className="text-[var(--tuwa-text-primary)]">{hostname.replace(/^www\./, '')}</span>
                  {pathname === '/' ? '' : pathname}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
