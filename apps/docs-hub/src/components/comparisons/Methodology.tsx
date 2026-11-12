'use client';

import { formatLabel, useI18n } from '@/i18n';
import { AXES, CRITERIA, formatCheckDate, sourceIndex, verifiedAsOf } from '@/lib/comparisons';

import { capsClassName, frameClassName, noteClassName } from './comparisonStyles';
import { MarkIcon } from './MarkIcon';

const DATA_URL = 'https://github.com/TuwaIO/docs/blob/main/apps/docs-hub/src/lib/comparisons.ts';
const ISSUE_URL = 'https://github.com/TuwaIO/docs/issues/new?title=Comparisons%3A%20correction';

const lineClassName = 'border-[var(--tuwa-border-primary)]';
const linkClassName = 'text-[var(--tuwa-text-accent)] underline decoration-1 underline-offset-[3px]';

/**
 * How the radar is computed, what the marks mean, the transparency note and the numbered list of sources that the
 * footnotes of the page point to, in paper and ink: two cells in one frame, on a shared line of 1px from 1024px; the
 * note in a frame with a strip of the accent, with no tint.
 *
 * @returns The two cells.
 */
export function Methodology() {
  const { locale, t } = useI18n();
  const sources = [...sourceIndex()];
  const perAxis = CRITERIA.length / AXES.length;
  const ex = t.ui.comparisonsExtra;
  const heading = `m-0 text-[var(--tuwa-text-primary)] ${capsClassName}`;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 ${frameClassName}`}>
      <div className="flex flex-col gap-6 p-5 text-sm leading-normal text-[var(--tuwa-text-secondary)] md:p-6">
        <div>
          <h3 className={heading}>{ex.scoringHeading}</h3>
          <p className="m-0 mt-2.5">
            {formatLabel(ex.scoringBodyPart1, { count: perAxis })}
            <code className="font-mono text-[13px] text-[var(--tuwa-text-primary)]">
              (met + ½ · partial) ÷ {perAxis} × 100
            </code>
            {ex.scoringBodyPart2}
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex">
              <MarkIcon mark="yes" />
            </span>
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markMetLead}</strong>
              {ex.markMetBody}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex">
              <MarkIcon mark="partial" />
            </span>
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markPartialLead}</strong>
              {ex.markPartialBody}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex">
              <MarkIcon mark="no" />
            </span>
            <span>
              <strong className="text-[var(--tuwa-text-primary)]">{ex.markNoLead}</strong>
              {ex.markNoBody}
            </span>
          </li>
        </ul>
        <div>
          <h3 className={heading}>{ex.whatWeCompareHeading}</h3>
          <p className="m-0 mt-2.5">{ex.whatWeCompareBody}</p>
        </div>
        <div className={`text-[13px] ${noteClassName}`}>
          <p className={heading}>{t.comparisons.methodology.transparencyTitle}</p>
          <p className="m-0 mt-2">
            {formatLabel(ex.transparencyPart1, { date: formatCheckDate(verifiedAsOf(), locale) })}
            <a href={DATA_URL} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {ex.transparencyFileLink}
            </a>
            {ex.transparencyPart2}
            <a href={ISSUE_URL} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {ex.transparencyIssueLink}
            </a>
            {ex.transparencyPart3}
          </p>
        </div>
      </div>

      <div className={`border-t p-5 md:p-6 lg:border-t-0 lg:border-l ${lineClassName}`}>
        <h3 id="sources" className={heading}>
          {ex.sourcesHeading}
        </h3>
        <ol className="m-0 mt-4 flex list-none flex-col gap-2 p-0 text-[13px] leading-[1.4] lg:max-h-[620px] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin]">
          {sources.map(([url, index]) => {
            const { hostname, pathname } = new URL(url);
            return (
              <li
                key={url}
                id={`source-${index}`}
                className="flex scroll-mt-[120px] gap-2.5 target:text-[var(--tuwa-text-accent)]"
              >
                <span className="w-8 shrink-0 text-right font-mono text-xs text-[var(--tuwa-text-secondary)]">
                  [{index}]
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 text-[var(--tuwa-text-secondary)] transition-colors [overflow-wrap:anywhere] hover:text-[var(--tuwa-text-accent)]"
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
