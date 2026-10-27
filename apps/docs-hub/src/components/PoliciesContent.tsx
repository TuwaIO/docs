'use client';

import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { formatPolicyDate, getPolicyFileUrl, getPolicyPageUrl, publishedPolicies } from '@tuwaio/docs-ui';

import { formatLabel, policyLanguageOf, useI18n } from '@/i18n';

const linkClassName =
  'inline-flex h-9 items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] dark:border-white/10 bg-[var(--tuwa-bg-primary)] dark:bg-white/[0.03] px-3 text-sm font-semibold text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-bg-muted)] dark:hover:bg-white/[0.06]';

/**
 * Localized content of `/policies`.
 * @param props.dates - Version dates read at build time for each published policy.
 */
export function PoliciesContent({ dates }: { dates: (string | undefined)[] }) {
  const { locale, t } = useI18n();
  const policyLanguage = policyLanguageOf(locale);

  return (
    <div className="relative z-10 pt-28 sm:pt-32 pb-16">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-12 sm:gap-16">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--tuwa-text-primary)] leading-tight font-geist-mono uppercase tracking-tight">
            <span className="bg-gradient-to-r from-[var(--tuwa-hero-gradient-from)] via-[var(--tuwa-hero-gradient-via)] to-[var(--tuwa-hero-gradient-to)] bg-clip-text text-transparent">
              {t.policies.title}
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
            {t.policies.description}
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {publishedPolicies.map((policy, index) => {
            const item = t.policies.items[policy.slug];
            return (
              <li
                key={policy.slug}
                className="flex flex-col gap-4 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-geist-mono tracking-tight text-[var(--tuwa-text-primary)]">
                    {item?.title ?? policy.title}
                  </h2>
                  <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
                    {item?.description ?? policy.description}
                  </p>
                  {dates[index] && (
                    <p className="text-xs text-[var(--tuwa-text-tertiary)]">
                      {formatLabel(t.ui.policiesExtra.lastUpdated, {
                        date: formatPolicyDate(dates[index]!, locale),
                      })}
                    </p>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <a
                    href={getPolicyPageUrl(policy.slug, undefined, policyLanguage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {t.policies.read}
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={getPolicyFileUrl(policy.slug, 'pdf', undefined, policyLanguage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
                    {t.policies.pdf}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <section
          aria-labelledby="contacts"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-t border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] pt-10"
        >
          <h2 id="contacts" className="sr-only">
            {t.policies.securityContactTitle}
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{t.ui.policiesExtra.vulnTitle}</p>
            <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
              {t.ui.policiesExtra.vulnBeforeLink}{' '}
              <a href="mailto:security@tuwa.io" className="font-mono text-[var(--tuwa-text-accent)] hover:underline">
                security@tuwa.io
              </a>{' '}
              {t.ui.policiesExtra.vulnAfterLink}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{t.ui.policiesExtra.legalTitle}</p>
            <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
              {t.ui.policiesExtra.legalBeforeLink}{' '}
              <a href="mailto:admin@tuwa.io" className="font-mono text-[var(--tuwa-text-accent)] hover:underline">
                admin@tuwa.io
              </a>
              {t.ui.policiesExtra.legalAfterLink}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
