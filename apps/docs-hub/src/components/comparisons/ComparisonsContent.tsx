'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { formatLabel, useI18n } from '@/i18n';
import { COMPETITORS, CRITERIA, formatCheckDate, SEGMENTS, verifiedAsOf } from '@/lib/comparisons';

import { BundleSizes } from './BundleSizes';
import { ChooseInstead } from './ChooseInstead';
import { ComparisonRadar } from './ComparisonRadar';
import { CriteriaMatrix } from './CriteriaMatrix';
import { Methodology } from './Methodology';
import { SEGMENT_COLORS } from './segmentColors';

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
 * Localized content of `/comparisons`.
 */
export function ComparisonsContent() {
  const { locale, t } = useI18n();
  const verified = formatCheckDate(verifiedAsOf(), locale);

  return (
    <div className="relative z-10 pt-28 sm:pt-32 pb-16">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 flex flex-col gap-16 sm:gap-20">
        {/* Hero */}
        <header className="text-center max-w-3xl mx-auto">
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.03] px-4 py-1.5 text-[11px] font-mono text-[var(--tuwa-text-secondary)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {formatLabel(t.ui.comparisonsExtra.verifiedBadge, { date: verified })}
            <span className="text-[var(--tuwa-text-tertiary)]">·</span>
            {formatLabel(t.ui.comparisonsExtra.productsCount, { count: COMPETITORS.length })}
            <span className="text-[var(--tuwa-text-tertiary)]">·</span>
            {formatLabel(t.ui.comparisonsExtra.criteriaCount, { count: CRITERIA.length })}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--tuwa-text-primary)] leading-tight font-geist-mono uppercase tracking-tight">
            <span className="bg-gradient-to-r from-[var(--tuwa-hero-gradient-from)] via-[var(--tuwa-hero-gradient-via)] to-[var(--tuwa-hero-gradient-to)] bg-clip-text text-transparent">
              {t.comparisons.titlePrefix}
            </span>
            <span className="block mt-2 text-xl sm:text-3xl lg:text-4xl text-[var(--tuwa-text-primary)]">
              {t.comparisons.titleHighlight}
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
            {t.comparisons.description}
          </p>
        </header>

        {/* Radar */}
        <section aria-labelledby="radar">
          <SectionHeading id="radar" title={t.comparisons.radar.sectionTitle}>
            {t.ui.comparisonsExtra.radarIntro}
          </SectionHeading>
          <ul className="flex flex-wrap gap-2 mb-6 -mt-2">
            {SEGMENTS.map((segment) => (
              <li
                key={segment.id}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.08] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] px-3 py-1 text-xs text-[var(--tuwa-text-secondary)]"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[segment.id] }} />
                {t.comparisons.segments[segment.id]?.label ?? segment.label}
                <span className="text-[var(--tuwa-text-tertiary)]">→</span>
                <span className="font-semibold text-[var(--tuwa-text-primary)]">{segment.counterpart}</span>
              </li>
            ))}
          </ul>
          <ComparisonRadar />
        </section>

        {/* Every criterion */}
        <section aria-labelledby="criteria">
          <SectionHeading id="criteria" title={t.comparisons.matrix.sectionTitle}>
            {formatLabel(t.ui.comparisonsExtra.criteriaIntro, { count: CRITERIA.length })}
          </SectionHeading>
          <CriteriaMatrix />
        </section>

        {/* When to choose them */}
        <section aria-labelledby="choose-instead">
          <SectionHeading id="choose-instead" title={t.comparisons.chooseInstead.sectionTitle}>
            {t.ui.comparisonsExtra.chooseInsteadIntro}
          </SectionHeading>
          <ChooseInstead />
        </section>

        {/* Bundle size */}
        <section aria-labelledby="bundle-size">
          <SectionHeading id="bundle-size" title={t.ui.comparisonsExtra.bundleTitle}>
            {t.ui.comparisonsExtra.bundleIntro}
          </SectionHeading>
          <BundleSizes />
        </section>

        {/* Methodology */}
        <section aria-labelledby="methodology">
          <SectionHeading id="methodology" title={t.comparisons.methodology.sectionTitle}>
            {t.ui.comparisonsExtra.methodologyIntro}
          </SectionHeading>
          <Methodology />
        </section>

        {/* Next steps */}
        <section className="text-center">
          <p className="text-lg sm:text-xl font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]">
            {t.ui.comparisonsExtra.readyHeading}
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/guides/starter-templates"
              className="inline-flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] bg-gradient-to-r from-[var(--tuwa-hero-gradient-from)] via-[var(--tuwa-hero-gradient-via)] to-[var(--tuwa-hero-gradient-to)] px-5 py-2.5 text-sm font-semibold font-geist-mono text-white shadow-md shadow-black/10 hover:opacity-95 transition-opacity"
            >
              {t.ui.comparisonsExtra.startFromTemplate}
            </Link>
            <Link
              href="/guides/full-stack-react"
              className="inline-flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.03] px-5 py-2.5 text-sm font-semibold font-geist-mono text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/40 transition-colors"
            >
              {t.ui.comparisonsExtra.fullStackGuide}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
