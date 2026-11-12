'use client';

import { PixelArt } from '@tuwaio/docs-ui';
import type { ReactNode } from 'react';

import Link from '@/components/LocaleNextLink';
import bundleSizes from '@/generated/bundle-sizes.json';
import { formatLabel, useI18n } from '@/i18n';
import { COMPETITORS, CRITERIA, formatCheckDate, SEGMENTS, verifiedAsOf } from '@/lib/comparisons';

import {
  buttonArrowClassName,
  largeButtonClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from '../buttonStyles';
import { homeContentClassName, homeFrameClassName } from '../home/homeLayout';
import { ARROW_RIGHT } from '../home/pixelArrows';
import { CrossMark, Kicker, SectionBar, SectionHead } from '../home/SectionHead';
import { BundleSizes } from './BundleSizes';
import { ChooseInstead } from './ChooseInstead';
import { ComparisonRadar } from './ComparisonRadar';
import { capsClassName } from './comparisonStyles';
import { CriteriaMatrix } from './CriteriaMatrix';
import { Methodology } from './Methodology';

const lineClassName = 'border-[var(--tuwa-border-primary)]';

/**
 * A section of the comparisons page, as a section of the main page: its bar, which sticks under the header (`01 /
 * Radar`), its title in large mono with its lead, then its content.
 *
 * @param props.id - The id of the section, the target of the links to it.
 * @param props.number - The number of the section, from 1.
 * @param props.name - The short name of the section, for its bar.
 * @param props.meta - What the section holds, on the right of its bar.
 * @param props.title - The title of the section.
 * @param props.lead - The lead under the title.
 * @param props.children - The content of the section.
 * @returns The section.
 */
function Section({
  id,
  number,
  name,
  meta,
  title,
  lead,
  children,
}: {
  id: string;
  number: number;
  name: string;
  meta: ReactNode[];
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-[104px] scroll-mt-[56px]">
      <SectionBar number={number} name={name} meta={meta} />
      <div className="pt-12">
        <SectionHead id={`${id}-title`} title={title} lead={lead} />
      </div>
      <div className="mt-11">{children}</div>
    </section>
  );
}

/**
 * The content of `/comparisons`, in paper and ink, on the frame of the main page: the kicker (when the facts were
 * verified, how many products and criteria), the title in large mono and the lead; then five sections, each under its
 * bar: the radar (with the TUWA projects that do the job of each segment, on shared lines), every criterion with its
 * sources, when to choose another tool, the bundle sizes and the methodology; and two buttons to start with.
 *
 * @returns The page.
 */
export function ComparisonsContent() {
  const { locale, t } = useI18n();
  const extra = t.ui.comparisonsExtra;
  const sections = t.comparisons.sections;
  const verified = formatLabel(extra.verifiedBadge, { date: formatCheckDate(verifiedAsOf(), locale) });
  const products = formatLabel(extra.productsCount, { count: COMPETITORS.length });
  const criteria = formatLabel(extra.criteriaCount, { count: CRITERIA.length });
  const measuredAt = (bundleSizes as { measuredAt?: string }).measuredAt;

  return (
    <div className="relative z-10">
      <div className={`${homeContentClassName} ${homeFrameClassName}`}>
        <CrossMark x="left" y="top" />
        <CrossMark x="right" y="top" />

        <header className="pt-12 md:pt-16 xl:pt-20">
          <Kicker>
            {verified} · {products} · {criteria}
          </Kicker>
          <h1
            className={`mt-5 max-w-[960px] font-mono text-[clamp(36px,6.2vw,76px)] leading-[0.98] font-medium text-[var(--tuwa-text-primary)] ${locale === 'uk' ? 'tracking-normal' : 'tracking-[-0.04em]'}`}
          >
            {t.comparisons.titlePrefix} {t.comparisons.titleHighlight}
          </h1>
          <p className="mt-7 max-w-[680px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)]">
            {t.comparisons.description}
          </p>
        </header>

        <Section
          id="radar"
          number={1}
          name={sections.radar}
          meta={[products, criteria]}
          title={t.comparisons.radar.sectionTitle}
          lead={extra.radarIntro}
        >
          {/* The TUWA projects that do the job of each segment */}
          <dl className={`m-0 grid grid-cols-1 border-t border-l md:grid-cols-2 ${lineClassName}`}>
            {SEGMENTS.map((segment) => (
              <div
                key={segment.id}
                className={`flex flex-col gap-1.5 border-r border-b bg-[var(--tuwa-docs-raised)] px-4 py-3.5 ${lineClassName}`}
              >
                <dt className={`text-[var(--tuwa-text-secondary)] ${capsClassName}`}>
                  {t.comparisons.segments[segment.id]?.label ?? segment.label}
                </dt>
                <dd className="m-0 font-mono text-sm leading-[1.35] font-bold text-[var(--tuwa-text-primary)]">
                  {segment.counterpart}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <ComparisonRadar />
          </div>
        </Section>

        <Section
          id="criteria"
          number={2}
          name={sections.criteria}
          meta={[criteria, verified]}
          title={t.comparisons.matrix.sectionTitle}
          lead={formatLabel(extra.criteriaIntro, { count: CRITERIA.length })}
        >
          <CriteriaMatrix />
        </Section>

        <Section
          id="choose-instead"
          number={3}
          name={sections.alternatives}
          meta={[products]}
          title={t.comparisons.chooseInstead.sectionTitle}
          lead={extra.chooseInsteadIntro}
        >
          <ChooseInstead />
        </Section>

        <Section
          id="bundle-size"
          number={4}
          name={sections.bundle}
          meta={['gzip', ...(measuredAt ? [formatCheckDate(measuredAt, locale)] : [])]}
          title={extra.bundleTitle}
          lead={extra.bundleIntro}
        >
          <BundleSizes />
        </Section>

        <Section
          id="methodology"
          number={5}
          name={sections.method}
          meta={[verified]}
          title={t.comparisons.methodology.sectionTitle}
          lead={extra.methodologyIntro}
        >
          <Methodology />
        </Section>

        {/* Next steps */}
        <section
          aria-labelledby="comparisons-next"
          className={`mt-[104px] flex flex-col gap-6 border-t pt-10 md:flex-row md:items-center md:justify-between ${lineClassName}`}
        >
          <h2
            id="comparisons-next"
            className="m-0 font-mono text-[clamp(24px,3vw,34px)] leading-[1.1] font-medium tracking-[-0.03em] text-[var(--tuwa-text-primary)]"
          >
            {extra.readyHeading}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/guides/starter-templates" className={`${largeButtonClassName} ${primaryButtonClassName}`}>
              {extra.startFromTemplate}
              <PixelArt
                art={ARROW_RIGHT}
                className={`${buttonArrowClassName} group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]`}
              />
            </Link>
            <Link href="/guides/full-stack-react" className={`${largeButtonClassName} ${secondaryButtonClassName}`}>
              {extra.fullStackGuide}
              <PixelArt
                art={ARROW_RIGHT}
                className={`${buttonArrowClassName} group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]`}
              />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
