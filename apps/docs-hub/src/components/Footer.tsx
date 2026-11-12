'use client';

import { footerPolicies, getPolicyPageUrl, SiteLogo } from '@tuwaio/docs-ui';

import Link from '@/components/LocaleNextLink';
import { policyLanguageOf, useI18n } from '@/i18n';

import { homeContentClassName } from './home/homeLayout';

const policyClassName = 'font-mono text-[11px] leading-[1.3] uppercase tracking-[0.12em] transition-colors';

/**
 * The footer of the hub pages, in paper and ink: a line of 1px above, in the grey of every rule of the page (a line of
 * ink drew too much attention); the logo, at the size of the logo of tuwa.io, and the description of TUWA on the left;
 * the policies in force on tuwa.io and the list of all policies (`/policies`, in ink) on the right, in mono caps; the
 * copyright and the address of the hub in mono below a line of 1px. On phones the parts stack and the links wrap.
 *
 * @returns The footer.
 */
export function Footer() {
  const { locale, t } = useI18n();
  const policyLanguage = policyLanguageOf(locale);

  return (
    <footer className="relative z-10 mt-[120px] border-t border-[var(--tuwa-border-primary)]">
      <div className={`${homeContentClassName} pt-7 pb-9 md:pt-8 md:pb-10 xl:pb-11`}>
        <div className="grid gap-[22px] md:grid-cols-2 md:items-start">
          <div className="grid justify-items-start gap-3.5">
            <SiteLogo />
            <p className="m-0 max-w-[460px] text-sm text-[var(--tuwa-text-secondary)]">{t.footer.description}</p>
          </div>
          <nav
            aria-label={t.footer.policiesAriaLabel}
            className="flex flex-wrap content-start gap-x-5 gap-y-2.5 md:justify-end"
          >
            {footerPolicies.map((policy) => (
              <a
                key={policy.slug}
                href={getPolicyPageUrl(policy.slug, undefined, policyLanguage)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${policyClassName} font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]`}
              >
                {t.footer.policyTitles[policy.slug] ?? policy.title}
              </a>
            ))}
            <Link href="/policies" className={`${policyClassName} font-bold text-[var(--tuwa-text-primary)]`}>
              {t.footer.allPolicies}
            </Link>
          </nav>
        </div>
        <p className="mt-7 flex flex-wrap justify-between gap-3 border-t border-[var(--tuwa-border-primary)] pt-4 font-mono text-xs leading-[1.4] text-[var(--tuwa-text-secondary)]">
          <span>
            © 2025–{new Date().getFullYear()} TUWA. {t.footer.copyright}
          </span>
          <span>docs.tuwa.io</span>
        </p>
      </div>
    </footer>
  );
}
