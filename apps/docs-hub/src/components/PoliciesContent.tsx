'use client';

import { formatPolicyDate, getPolicyFileUrl, getPolicyPageUrl, publishedPolicies } from '@tuwaio/docs-ui';
import { ExternalLinkIcon } from '@tuwaio/nova-core';
import { ArrowDownTrayIcon } from '@tuwaio/sdk/nova-icons/24/outline';

import { formatLabel, policyLanguageOf, useI18n } from '@/i18n';

import { secondaryButtonClassName, smallButtonClassName } from './buttonStyles';
import { homeBleedClassName, homeContentClassName, homeFrameClassName } from './home/homeLayout';
import { CrossMark, Kicker } from './home/SectionHead';

const lineClassName = 'border-[var(--tuwa-border-primary)]';
const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';
const mailClassName =
  'font-mono text-[13px] text-[var(--tuwa-text-accent)] underline decoration-1 underline-offset-[3px]';

/**
 * The content of `/policies`, in paper and ink, on the frame of the main page: the kicker (what the documents are, and
 * when the latest of them was updated), the title in large mono and the lead; then the published policies as a ledger
 * from line to line of the frame, a row each: its number, its title in mono with what it covers, the date of its
 * version, and two small buttons, to its page on tuwa.io and to its PDF; and, on a shared line of 1px, where to report
 * a vulnerability and where to ask legal questions.
 *
 * @param props.dates - Version dates read at build time for each published policy, in their order.
 * @returns The page.
 */
export function PoliciesContent({ dates }: { dates: (string | undefined)[] }) {
  const { locale, t } = useI18n();
  const policyLanguage = policyLanguageOf(locale);
  const extra = t.ui.policiesExtra;
  // ISO dates sort as text: the latest version of all
  const latest = dates
    .filter((date): date is string => !!date)
    .sort()
    .at(-1);

  return (
    <div className="relative z-10">
      <div className={`${homeContentClassName} ${homeFrameClassName}`}>
        <CrossMark x="left" y="top" />
        <CrossMark x="right" y="top" />

        <header className="pt-12 pb-14 md:pt-16 md:pb-16 xl:pt-20">
          <Kicker>
            {t.policies.badge}
            {latest && <> · {formatLabel(extra.lastUpdated, { date: formatPolicyDate(latest, locale) })}</>}
          </Kicker>
          <h1
            className={`mt-5 font-mono text-[clamp(36px,6.2vw,76px)] leading-[0.98] font-medium text-[var(--tuwa-text-primary)] ${locale === 'uk' ? 'tracking-normal' : 'tracking-[-0.04em]'}`}
          >
            {t.policies.title}
          </h1>
          <p className="mt-7 max-w-[680px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)]">
            {t.policies.description}
          </p>
        </header>

        <ul
          aria-label={t.policies.listAria}
          className={`relative m-0 list-none border-t py-0 ${lineClassName} ${homeBleedClassName}`}
        >
          <CrossMark x="left" y="top" />
          <CrossMark x="right" y="top" />
          {publishedPolicies.map((policy, index) => {
            const item = t.policies.items[policy.slug];
            const date = dates[index];
            return (
              <li
                key={policy.slug}
                className={`grid grid-cols-[34px_minmax(0,1fr)] gap-x-4 gap-y-4 border-b py-6 md:grid-cols-[34px_minmax(0,1fr)_auto] md:items-center md:gap-x-6 ${lineClassName}`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-[34px] w-[34px] place-items-center border border-[var(--tuwa-text-primary)] font-mono text-[13px] leading-none font-bold text-[var(--tuwa-text-primary)] md:self-start"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h2 className="m-0 font-mono text-lg leading-[1.25] font-bold text-[var(--tuwa-text-primary)]">
                    {item?.title ?? policy.title}
                  </h2>
                  <p className="m-0 mt-1.5 max-w-[640px] text-sm leading-normal text-[var(--tuwa-text-secondary)]">
                    {item?.description ?? policy.description}
                  </p>
                  {date && (
                    <p className={`m-0 mt-3 text-[var(--tuwa-text-secondary)] ${capsClassName}`}>
                      {formatLabel(extra.lastUpdated, { date: formatPolicyDate(date, locale) })}
                    </p>
                  )}
                </div>
                <div className="col-start-2 flex flex-wrap gap-2.5 md:col-start-3">
                  <a
                    href={getPolicyPageUrl(policy.slug, undefined, policyLanguage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${smallButtonClassName} ${secondaryButtonClassName}`}
                  >
                    {t.policies.read}
                    <ExternalLinkIcon className="h-2.5 w-2.5 shrink-0" />
                  </a>
                  <a
                    href={getPolicyFileUrl(policy.slug, 'pdf', undefined, policyLanguage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${smallButtonClassName} ${secondaryButtonClassName}`}
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t.policies.pdf}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <section aria-labelledby="contacts" className={`grid grid-cols-1 md:grid-cols-2 ${homeBleedClassName} !px-0`}>
          <h2 id="contacts" className="sr-only">
            {t.policies.securityContactTitle}
          </h2>
          <div className={`px-4 py-8 md:px-8 md:py-10 md:pr-8 xl:pl-12 min-[1600px]:pl-14`}>
            <p className={`m-0 text-[var(--tuwa-text-primary)] ${capsClassName}`}>{extra.vulnTitle}</p>
            <p className="m-0 mt-2.5 max-w-[480px] text-sm leading-normal text-[var(--tuwa-text-secondary)]">
              {extra.vulnBeforeLink}{' '}
              <a href="mailto:security@tuwa.io" className={mailClassName}>
                security@tuwa.io
              </a>{' '}
              {extra.vulnAfterLink}
            </p>
          </div>
          <div
            className={`border-t px-4 py-8 md:border-t-0 md:border-l md:px-8 md:py-10 xl:pr-12 min-[1600px]:pr-14 ${lineClassName}`}
          >
            <p className={`m-0 text-[var(--tuwa-text-primary)] ${capsClassName}`}>{extra.legalTitle}</p>
            <p className="m-0 mt-2.5 max-w-[480px] text-sm leading-normal text-[var(--tuwa-text-secondary)]">
              {extra.legalBeforeLink}{' '}
              <a href="mailto:admin@tuwa.io" className={mailClassName}>
                admin@tuwa.io
              </a>
              {extra.legalAfterLink}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
