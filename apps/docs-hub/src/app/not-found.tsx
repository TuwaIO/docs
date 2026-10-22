import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';

import { HubShell } from '../components/HubShell';
import { PageBackground } from '../components/PageBackground';
import { layers } from '../lib/ecosystem';

export const metadata: Metadata = {
  // Absolute: inside /guides and /quasar the section layouts would append their title template
  title: { absolute: 'Page Not Found — TUWA Docs Hub' },
  description: 'This page of the TUWA Docs Hub does not exist or has moved.',
};

const destinations = [
  { href: '/guides', title: 'Guides', description: 'Step-by-step setups and deep dives that combine TUWA projects.' },
  { href: '/quasar', title: 'Quasar', description: 'Quasar Cloud and Community Edition, with the API reference.' },
  { href: '/configurator', title: 'Configurator', description: 'The install command and setup files for your stack.' },
  { href: '/playground', title: 'Playground', description: 'The TUWA stores and Nova UI on a simulated chain.' },
  { href: '/comparisons', title: 'Comparisons', description: 'How TUWA compares with other Web3 toolkits.' },
  { href: '/policies', title: 'Policies', description: 'Terms, privacy and the other TUWA policies.' },
];

// The reference sites of the projects (absolute URLs only; Quasar lives in this hub)
const projectSites = layers
  .flatMap((layer) => layer.entries)
  .filter((entry) => entry.docsUrl.startsWith('https://'))
  .map((entry) => ({ name: entry.name, url: entry.docsUrl }));

const cardClassName =
  'group flex flex-col gap-1 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] backdrop-blur-sm p-4 transition-colors hover:border-[var(--tuwa-text-accent)]/50';

/**
 * The 404 page of the Docs Hub, for unknown routes and for MDX pages that do not exist: where to go instead (the
 * sections of the hub and the reference sites of the projects) and where to report a broken link. Moved pages are
 * deleted, not redirected, so an old link lands here.
 */
export default function NotFound() {
  return (
    <HubShell>
      <PageBackground />

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-12">
          <header className="text-center max-w-2xl mx-auto">
            <p className="font-geist-mono text-6xl sm:text-8xl font-bold tracking-tight text-[var(--tuwa-text-tertiary)]/60">
              404
            </p>
            <h1 className="mt-4 text-2xl sm:text-4xl font-bold font-geist-mono uppercase tracking-tight text-[var(--tuwa-text-primary)]">
              Page not found
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
              This page does not exist or has moved. Pick a section below, or open the reference site of a project.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-button-gradient-from)] px-5 text-sm font-semibold text-[var(--tuwa-text-on-accent)] transition-colors hover:bg-[var(--tuwa-button-gradient-from-hover)]"
              >
                <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
                Back to the Docs Hub
              </Link>
              <a
                href="https://github.com/TuwaIO/docs/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] dark:border-white/10 bg-[var(--tuwa-bg-primary)] dark:bg-white/[0.03] px-5 text-sm font-semibold text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-bg-muted)] dark:hover:bg-white/[0.06]"
              >
                Report a broken link
                <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </header>

          <nav aria-labelledby="hub-sections">
            <h2
              id="hub-sections"
              className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]"
            >
              Docs Hub
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {destinations.map((destination) => (
                <li key={destination.href}>
                  <Link href={destination.href} className={cardClassName}>
                    <span className="font-geist-mono text-base font-bold text-[var(--tuwa-text-primary)] group-hover:text-[var(--tuwa-text-accent)] transition-colors">
                      {destination.title}
                    </span>
                    <span className="text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
                      {destination.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="project-sites">
            <h2
              id="project-sites"
              className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]"
            >
              Package reference
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
    </HubShell>
  );
}
