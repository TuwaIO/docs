'use client';

import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { useI18n } from '@/i18n';
import { layers } from '@/lib/ecosystem';

const destinationHrefs = ['/guides', '/quasar', '/configurator', '/playground', '/comparisons', '/policies'] as const;

// The reference sites of the projects (absolute URLs only; Quasar lives in this hub)
const projectSites = layers
  .flatMap((layer) => layer.entries)
  .filter((entry) => entry.docsUrl.startsWith('https://'))
  .map((entry) => ({ name: entry.name, url: entry.docsUrl }));

const cardClassName =
  'group flex flex-col gap-1 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] backdrop-blur-sm p-4 transition-colors hover:border-[var(--tuwa-text-accent)]/50';

/**
 * Localized content of the 404 page (`not-found.tsx`).
 */
export function NotFoundContent() {
  const { t } = useI18n();

  return (
    <div className="relative z-10 pt-28 sm:pt-32 pb-16">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-12">
        <header className="text-center max-w-2xl mx-auto">
          <p className="font-geist-mono text-6xl sm:text-8xl font-bold tracking-tight text-[var(--tuwa-text-tertiary)]/60">
            404
          </p>
          <h1 className="mt-4 text-2xl sm:text-4xl font-bold font-geist-mono uppercase tracking-tight text-[var(--tuwa-text-primary)]">
            {t.notFound.heading}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
            {t.notFound.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-button-gradient-from)] px-5 text-sm font-semibold text-[var(--tuwa-text-on-accent)] transition-colors hover:bg-[var(--tuwa-button-gradient-from-hover)]"
            >
              <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
              {t.notFound.backToMain}
            </Link>
            <a
              href="https://github.com/TuwaIO/docs/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] dark:border-white/10 bg-[var(--tuwa-bg-primary)] dark:bg-white/[0.03] px-5 text-sm font-semibold text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-bg-muted)] dark:hover:bg-white/[0.06]"
            >
              {t.ui.notFoundExtra.reportBrokenLink}
              <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </header>

        <nav aria-labelledby="hub-sections">
          <h2
            id="hub-sections"
            className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]"
          >
            {t.ui.notFoundExtra.hubSectionsHeading}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {destinationHrefs.map((href) => {
              const destination =
                href === '/policies'
                  ? { title: t.ui.notFoundExtra.policiesTitle, description: t.ui.notFoundExtra.policiesDescription }
                  : t.notFound.destinations[href];
              return (
                <li key={href}>
                  <Link href={href} className={cardClassName}>
                    <span className="font-geist-mono text-base font-bold text-[var(--tuwa-text-primary)] group-hover:text-[var(--tuwa-text-accent)] transition-colors">
                      {destination?.title ?? href}
                    </span>
                    <span className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
                      {destination?.description ?? ''}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-labelledby="project-sites">
          <h2
            id="project-sites"
            className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]"
          >
            {t.notFound.packageRefHeading}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {projectSites.map((site) => (
              <li key={site.url}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] px-3 py-1.5 text-sm text-[var(--tuwa-text-secondary)] transition-colors hover:text-[var(--tuwa-text-primary)]"
                >
                  {site.name}
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
