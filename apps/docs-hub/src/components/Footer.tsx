'use client';

import { footerPolicies, getPolicyPageUrl } from '@tuwaio/docs-ui';
import Link from 'next/link';

import { policyLanguageOf, useI18n } from '@/i18n';

const linkClassName = 'hover:text-[var(--tuwa-text-primary)] transition-colors';

/**
 * Standalone footer for the Docs Hub, visually separated from main content: the tagline on the left, links to the
 * policies in force on tuwa.io and to the list of all policies (`/policies`) on the right, and the copyright line
 * centered below. On narrow screens everything is centered and the links wrap.
 */
export function Footer() {
  const { locale, t } = useI18n();
  const policyLanguage = policyLanguageOf(locale);

  return (
    <footer className="relative z-10 border-t border-[var(--tuwa-border-primary)]/10 dark:border-white/[0.04] bg-[var(--tuwa-bg-primary)]/30 dark:bg-[#030303]/20 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--tuwa-text-tertiary)] text-center sm:text-left">{t.footer.description}</p>
          <nav
            aria-label={t.footer.policiesAriaLabel}
            className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-xs text-[var(--tuwa-text-tertiary)]"
          >
            {footerPolicies.map((policy) => (
              <a
                key={policy.slug}
                href={getPolicyPageUrl(policy.slug, undefined, policyLanguage)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {t.footer.policyTitles[policy.slug] ?? policy.title}
              </a>
            ))}
            <Link href="/policies" className={`${linkClassName} font-semibold`}>
              {t.footer.allPolicies}
            </Link>
          </nav>
        </div>
        <p className="border-t border-[var(--tuwa-border-primary)]/20 dark:border-white/[0.06] pt-6 text-center text-xs text-[var(--tuwa-text-tertiary)]">
          © 2025–{new Date().getFullYear()} TUWA. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
