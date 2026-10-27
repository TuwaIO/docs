'use client';

import { formatLabel, useI18n } from '@/i18n';
import { AXES, CRITERIA, formatCheckDate, sourceIndex, verifiedAsOf } from '@/lib/comparisons';

import { MarkIcon } from './MarkIcon';

const DATA_URL = 'https://github.com/TuwaIO/docs/blob/main/apps/docs-hub/src/lib/comparisons.ts';
const ISSUE_URL = 'https://github.com/TuwaIO/docs/issues/new?title=Comparisons%3A%20correction';

/**
 * How the radar is computed, what the marks mean, the transparency note and the numbered list of sources that the
 * footnotes of the page point to.
 */
export function Methodology() {
  const { locale, t } = useI18n();
  const sources = [...sourceIndex()];
  const perAxis = CRITERIA.length / AXES.length;
  const ex = t.ui.comparisonsExtra;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
      <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-5 sm:p-6 flex flex-col gap-5 text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">
        <div>
          <h3 className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-2">
            {ex.scoringHeading}
          </h3>
          <p>
            {formatLabel(ex.scoringBodyPart1, { count: perAxis })}
            <code className="text-xs font-mono text-[var(--tuwa-text-primary)]">
              (met + ½ · partial) ÷ {perAxis} × 100
            </code>
            {ex.scoringBodyPart2}
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-xs">
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="yes" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markMetLead}</strong>
              {ex.markMetBody}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="partial" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markPartialLead}</strong>
              {ex.markPartialBody}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <MarkIcon mark="no" />
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markNoLead}</strong>
              {ex.markNoBody}
            </span>
          </li>
        </ul>
        <div>
          <h3 className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-2">
            {ex.whatWeCompareHeading}
          </h3>
          <p>{ex.whatWeCompareBody}</p>
        </div>
        <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-text-accent)]/20 bg-[var(--tuwa-text-accent)]/[0.05] p-4 text-xs">
          <p className="font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-1.5">
            {t.comparisons.methodology.transparencyTitle}
          </p>
          <p>
            {formatLabel(ex.transparencyPart1, { date: formatCheckDate(verifiedAsOf(), locale) })}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--tuwa-text-accent)] hover:underline"
            >
              {ex.transparencyFileLink}
            </a>
            {ex.transparencyPart2}
            <a
              href={ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--tuwa-text-accent)] hover:underline"
            >
              {ex.transparencyIssueLink}
            </a>
            {ex.transparencyPart3}
          </p>
        </div>
      </div>

      <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-5 sm:p-6">
        <h3
          id="sources"
          className="text-xs font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)] mb-3"
        >
          {ex.sourcesHeading}
        </h3>
        <ol className="flex flex-col gap-1.5 text-xs lg:max-h-[560px] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin]">
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
                  className="min-w-0 [overflow-wrap:anywhere] text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-accent)] transition-colors"
                >
                  <span className="text-[var(--tuwa-text-primary)]">{hostname.replace(/^www\./, '')}</span>
                  {/* A break opportunity after each slash, so long paths wrap between segments */}
                  {pathname === '/'
                    ? ''
                    : pathname
                        .split('/')
                        .slice(1)
                        .map((segment, segmentIndex) => (
                          <span key={segmentIndex}>
                            /<wbr />
                            {segment}
                          </span>
                        ))}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
