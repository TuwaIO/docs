import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  getPolicyFileUrl,
  getPolicyPageUrl,
  loadPolicy,
  type Policy,
  publishedPolicies,
  StarryBackground,
} from '@tuwaio/docs-ui';
import type { Metadata } from 'next';

import { JsonLd } from '../../../components/JsonLd';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/policies';
const TITLE = 'TUWA Policies: Terms, Privacy and More';
const DESCRIPTION =
  'The terms and policies of the TUWA ecosystem — the websites and documentation, Quasar Cloud, Quasar Community Edition and the open-source packages — with the official PDFs.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${ROUTE}`,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: ORGANIZATION,
      hasPart: publishedPolicies.map((policy) => ({
        '@type': 'WebPage',
        name: policy.title,
        url: getPolicyPageUrl(policy.slug),
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Docs Hub', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Policies', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

// The date of the version, read at build time. Without it the card shows no date: a warning, not an error, because
// the dev overlay of Next.js reports every console.error
async function versionDate(policy: Policy): Promise<string | undefined> {
  try {
    return (await loadPolicy(policy.slug, { revalidate: false })).updated;
  } catch (error) {
    console.warn(`/policies: no date for ${policy.slug} (${error instanceof Error ? error.message : String(error)})`);
    return undefined;
  }
}

const linkClassName =
  'inline-flex h-9 items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] dark:border-white/10 bg-[var(--tuwa-bg-primary)] dark:bg-white/[0.03] px-3 text-sm font-semibold text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-bg-muted)] dark:hover:bg-white/[0.06]';

/**
 * `/policies`: every published TUWA policy (`publishedPolicies` of `@tuwaio/docs-ui`), each with what it covers, the
 * date of its version and links to its page on tuwa.io and its PDF. A policy that is not in force, such as the Refund
 * Policy while Quota purchases are paused, is not listed. Then where to report a vulnerability and ask legal
 * questions. The dates are read at build time.
 */
export default async function PoliciesPage() {
  const dates = await Promise.all(publishedPolicies.map(versionDate));

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="hidden md:block">
        <StarryBackground />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-12 sm:gap-16">
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--tuwa-text-primary)] leading-tight font-geist-mono uppercase tracking-tight">
              Policies
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
              The terms and policies of the TUWA ecosystem: the websites and documentation, Quasar Cloud, Quasar
              Community Edition and the open-source packages. Each one is on tuwa.io, with the official PDF.
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {publishedPolicies.map((policy, index) => (
              <li
                key={policy.slug}
                className="flex flex-col gap-4 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-geist-mono tracking-tight text-[var(--tuwa-text-primary)]">
                    {policy.title}
                  </h2>
                  <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">{policy.description}</p>
                  {dates[index] && (
                    <p className="text-xs text-[var(--tuwa-text-tertiary)]">Last updated {dates[index]}</p>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <a
                    href={getPolicyPageUrl(policy.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    Read
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={getPolicyFileUrl(policy.slug, 'pdf')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
                    PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <section
            aria-labelledby="contacts"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-t border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] pt-10"
          >
            <h2 id="contacts" className="sr-only">
              Contacts
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--tuwa-text-primary)]">Found a vulnerability?</p>
              <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
                Email{' '}
                <a href="mailto:security@tuwa.io" className="font-mono text-[var(--tuwa-text-accent)] hover:underline">
                  security@tuwa.io
                </a>{' '}
                with the affected package or service, the steps to reproduce and the impact. Please do not disclose it
                publicly until it is fixed.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--tuwa-text-primary)]">Legal and privacy questions</p>
              <p className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
                Email{' '}
                <a href="mailto:admin@tuwa.io" className="font-mono text-[var(--tuwa-text-accent)] hover:underline">
                  admin@tuwa.io
                </a>
                , including requests to access or delete your personal data.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
