import { StarryBackground } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ChooseInstead } from '../../../components/comparisons/ChooseInstead';
import { ComparisonRadar } from '../../../components/comparisons/ComparisonRadar';
import { CriteriaMatrix } from '../../../components/comparisons/CriteriaMatrix';
import { Methodology } from '../../../components/comparisons/Methodology';
import { SEGMENT_COLORS } from '../../../components/comparisons/segmentColors';
import { JsonLd } from '../../../components/JsonLd';
import { COMPETITORS, CRITERIA, formatCheckDate, SEGMENTS, verifiedAsOf } from '../../../lib/comparisons';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from '../../../lib/site';

const ROUTE = '/comparisons';
const TITLE = 'TUWA vs RainbowKit, Privy, Dynamic, thirdweb & More';
const DESCRIPTION =
  'How TUWA compares with RainbowKit, ConnectKit, AppKit, Privy, Dynamic, thirdweb, Alchemy and The Graph on custody, openness and cost, with sources.';

export const metadata: Metadata = withPageMetadata({ title: TITLE, description: DESCRIPTION }, ROUTE);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${ROUTE}`,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      author: ORGANIZATION,
      publisher: ORGANIZATION,
      dateModified: verifiedAsOf(),
      about: COMPETITORS.map((product) => ({ '@type': 'SoftwareApplication', name: product.name, url: product.url })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Docs Hub', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Comparisons', item: `${SITE_URL}${ROUTE}` },
      ],
    },
  ],
};

function SectionHeading({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="mb-6 sm:mb-8 max-w-3xl">
      <h2
        id={id}
        className="scroll-mt-24 text-xl sm:text-2xl 2xl:text-3xl font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm sm:text-base text-[var(--tuwa-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * `/comparisons`: TUWA against eight products on six axes, with the radar, every criterion with its source, when to
 * choose each product instead, and the methodology. The data is `src/lib/comparisons.ts`.
 */
export default function ComparisonsPage() {
  const verified = formatCheckDate(verifiedAsOf());

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="hidden md:block">
        <StarryBackground />
      </div>
      <div aria-hidden className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-[var(--tuwa-button-gradient-from)]/15 to-[var(--tuwa-button-gradient-to)]/8 blur-2xl" />
        <div className="absolute top-1/3 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/12 to-fuchsia-500/6 blur-2xl" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-16 sm:gap-20">
          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto">
            <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.03] px-4 py-1.5 text-[11px] font-mono text-[var(--tuwa-text-secondary)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified {verified}
              <span className="text-[var(--tuwa-text-tertiary)]">·</span>
              {COMPETITORS.length} products
              <span className="text-[var(--tuwa-text-tertiary)]">·</span>
              {CRITERIA.length} criteria
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--tuwa-text-primary)] leading-tight font-geist-mono uppercase tracking-tight">
              <span className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] bg-clip-text text-transparent">
                Why TUWA
              </span>
              <span className="block mt-2 text-xl sm:text-3xl lg:text-4xl text-[var(--tuwa-text-primary)]">
                Comparisons & Ecosystem Radar
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
              A verified technical breakdown of how TUWA compares with connect modals, embedded-wallet services and
              transaction platforms, including where they are the better choice. Every fact links to its source.
            </p>
          </header>

          {/* Radar */}
          <section aria-labelledby="radar">
            <SectionHeading id="radar" title="Ecosystem Radar">
              Pick a product to lay it over TUWA. Click an axis to see the criteria behind its score. TUWA is a set of
              packages, not a wallet provider, so each product faces the TUWA projects that do the same job:
            </SectionHeading>
            <ul className="flex flex-wrap gap-2 mb-6 -mt-2">
              {SEGMENTS.map((segment) => (
                <li
                  key={segment.id}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] px-3 py-1 text-xs text-[var(--tuwa-text-secondary)]"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[segment.id] }} />
                  {segment.label}
                  <span className="text-[var(--tuwa-text-tertiary)]">→</span>
                  <span className="font-semibold text-[var(--tuwa-text-primary)]">{segment.counterpart}</span>
                </li>
              ))}
            </ul>
            <ComparisonRadar />
          </section>

          {/* Every criterion */}
          <section aria-labelledby="criteria">
            <SectionHeading id="criteria" title="Every Criterion">
              The {CRITERIA.length} criteria behind the radar for all products at once. Hover a mark for the note; the
              number links to its source.
            </SectionHeading>
            <CriteriaMatrix />
          </section>

          {/* When to choose them */}
          <section aria-labelledby="choose-instead">
            <SectionHeading id="choose-instead" title="When to Choose Them Instead">
              No toolkit fits every app. Here is where each product is the better pick, and what TUWA does differently
              in the same job.
            </SectionHeading>
            <ChooseInstead />
          </section>

          {/* Methodology */}
          <section aria-labelledby="methodology">
            <SectionHeading id="methodology" title="Methodology">
              How the scores are computed, what the marks mean and where every fact comes from.
            </SectionHeading>
            <Methodology />
          </section>

          {/* Next steps */}
          <section className="text-center">
            <p className="text-lg sm:text-xl font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]">
              Ready to try it?
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/guides/starter-templates"
                className="inline-flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] px-5 py-2.5 text-sm font-semibold font-geist-mono text-white shadow-md shadow-black/10 hover:opacity-95 transition-opacity"
              >
                Start From a Template →
              </Link>
              <Link
                href="/guides/full-stack-react"
                className="inline-flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.03] px-5 py-2.5 text-sm font-semibold font-geist-mono text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/40 transition-colors"
              >
                Full-Stack Guide
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
