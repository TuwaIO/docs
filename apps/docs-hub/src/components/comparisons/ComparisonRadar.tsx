'use client';

import { ExternalLinkIcon } from '@tuwaio/nova-core';
import { useEffect, useRef, useState } from 'react';

import { useI18n } from '@/i18n';
import {
  AXES,
  type AxisId,
  COMPETITORS,
  CRITERIA,
  type Product,
  productScores,
  SEGMENTS,
  sourceIndex,
  TUWA,
} from '@/lib/comparisons';

import { capsClassName, chipClassName, frameClassName, noteClassName } from './comparisonStyles';
import { MarkIcon, SourceRef } from './MarkIcon';

// Geometry of the radar, in viewBox units
const WIDTH = 560;
const HEIGHT = 425;
const CX = 280;
const CY = 205;
const RADIUS = 150;
const LABEL_RADIUS = RADIUS + 22;
const RINGS = [25, 50, 75, 100];
/** The side of the square that marks a score of TUWA, and of the smaller one of the other product. */
const TUWA_POINT = 8;
const PRODUCT_POINT = 6;

const sources = sourceIndex();
const tuwaScores = productScores(TUWA);

const lineClassName = 'border-[var(--tuwa-border-primary)]';

// The angle of an axis: the first one points up, the others follow clockwise
const angleOf = (index: number) => -Math.PI / 2 + (index * 2 * Math.PI) / AXES.length;

function pointAt(index: number, value: number): [number, number] {
  const r = (Math.max(0, Math.min(100, value)) / 100) * RADIUS;
  return [CX + r * Math.cos(angleOf(index)), CY + r * Math.sin(angleOf(index))];
}

const polygon = (values: number[]) =>
  values
    .map((value, index) =>
      pointAt(index, value)
        .map((n) => n.toFixed(1))
        .join(','),
    )
    .join(' ');

// Moves the competitor's polygon to its new scores (ease-out, 550 ms; instant with reduced motion)
function useTweenedScores(target: number[]): number[] {
  const [values, setValues] = useState(target);
  const current = useRef(target);
  const key = target.join(',');

  useEffect(() => {
    const goal = key.split(',').map(Number);
    const from = current.current;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = goal.map((value, index) => from[index] + (value - from[index]) * eased);
      current.current = next;
      setValues(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [key]);

  return values;
}

// Splits a long axis label into two lines at the space closest to its middle
function labelLines(label: string): string[] {
  const spaces = [...label.matchAll(/ /g)].map((match) => match.index ?? 0);
  if (label.length <= 10 || spaces.length === 0) return [label];
  const split = spaces.reduce((best, index) =>
    Math.abs(index - label.length / 2) < Math.abs(best - label.length / 2) ? index : best,
  );
  return [label.slice(0, split), label.slice(split + 1)];
}

/** Placement of an axis label around the radar */
function labelPlacement(index: number): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  const angle = angleOf(index);
  const x = CX + LABEL_RADIUS * Math.cos(angle);
  const y = CY + LABEL_RADIUS * Math.sin(angle);
  const cos = Math.cos(angle);
  const anchor = Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'start' : 'end';
  const dy = Math.sin(angle) < -0.9 ? -4 : Math.sin(angle) > 0.9 ? 14 : 5;
  return { x, y: y + dy, anchor };
}

/**
 * A score as a bar of 3px: a track of 1px lines' grey with a solid fill, TUWA's lit, the other product's in the colour
 * of the text around it.
 *
 * @param props.value - The score, from 0 to 100.
 * @param props.lit - Whether the fill is the accent (TUWA) rather than the colour of the text.
 * @returns The bar.
 */
function ScoreBar({ value, lit = false }: { value: number; lit?: boolean }) {
  return (
    <span className="relative block h-[3px] w-full bg-[color-mix(in_srgb,currentColor_22%,transparent)]">
      <span
        className={`absolute inset-y-0 left-0 ${lit ? 'bg-[var(--tuwa-docs-lit)]' : 'bg-current'}`}
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

/**
 * The Ecosystem Radar of `/comparisons`, in paper and ink: TUWA against one product on the six axes of `AXES`, drawn
 * with lines of 1px and square points, TUWA lit and solid, the other product in ink and dashed, with no gradient and no
 * glow; a product picker grouped by segment, square buttons whose chosen one is a block of ink; and, on shared lines
 * under them, the axes as tabs (the chosen one a block of ink) with the criteria of the chosen axis, the fact and the
 * source of each product.
 *
 * @returns The radar.
 */
export function ComparisonRadar() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState(COMPETITORS[0].id);
  const [activeAxis, setActiveAxis] = useState<AxisId>('custody');

  const selected = COMPETITORS.find((product) => product.id === selectedId) ?? COMPETITORS[0];
  const segment = SEGMENTS.find((item) => item.id === selected.segment);
  const selectedScores = productScores(selected);
  const animated = useTweenedScores(selectedScores);
  const axis = AXES.find((item) => item.id === activeAxis) ?? AXES[0];
  const axisCriteria = CRITERIA.filter((criterion) => criterion.axis === activeAxis);

  const summary = AXES.map(
    (item, index) =>
      `${t.comparisons.axes[item.id]?.label ?? item.label}: TUWA ${tuwaScores[index]}, ${selected.name} ${selectedScores[index]}`,
  ).join('; ');

  return (
    <div className={frameClassName}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Radar */}
        <div className={`p-4 md:p-6 lg:border-r ${lineClassName}`}>
          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[var(--tuwa-text-primary)] ${capsClassName}`}
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 bg-[var(--tuwa-docs-lit)]" />
              TUWA
            </span>
            <span className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 border border-dashed border-[var(--tuwa-text-primary)]" />
              {selected.name}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="mx-auto mt-2 h-auto w-full max-w-[620px] select-none overflow-visible"
            role="img"
            aria-label={`${t.comparisons.radar.chartLabel}: TUWA & ${selected.name}. ${summary}.`}
          >
            {/* Rings and spokes: lines of 1px, the outer ring the strongest */}
            {RINGS.map((ring) => (
              <polygon
                key={ring}
                points={polygon(AXES.map(() => ring))}
                fill="none"
                className={ring === 100 ? 'stroke-[var(--tuwa-border-strong)]' : 'stroke-[var(--tuwa-border-primary)]'}
                strokeWidth={1}
              />
            ))}
            {AXES.map((item, index) => {
              const [x, y] = pointAt(index, 100);
              return (
                <line
                  key={item.id}
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  className={
                    item.id === activeAxis ? 'stroke-[var(--tuwa-text-primary)]' : 'stroke-[var(--tuwa-border-primary)]'
                  }
                  strokeWidth={1}
                />
              );
            })}
            {RINGS.map((ring) => {
              const [, y] = pointAt(0, ring);
              return (
                <text
                  key={ring}
                  x={CX + 5}
                  y={y + 11}
                  className="fill-[var(--tuwa-text-secondary)] font-mono text-[9px]"
                >
                  {ring}
                </text>
              );
            })}

            {/* Fills: flat, the other product under TUWA */}
            <polygon points={polygon(animated)} className="fill-[var(--tuwa-text-primary)]" fillOpacity={0.07} />
            <polygon points={polygon(tuwaScores)} className="fill-[var(--tuwa-docs-lit)]" fillOpacity={0.16} />

            {/* Outlines: TUWA solid, the other product dashed on top, so both stay visible where they overlap */}
            <polygon
              points={polygon(tuwaScores)}
              fill="none"
              className="stroke-[var(--tuwa-docs-lit)]"
              strokeWidth={2}
              strokeLinejoin="miter"
            />
            <polygon
              points={polygon(animated)}
              fill="none"
              className="stroke-[var(--tuwa-text-primary)]"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeLinejoin="miter"
            />
            {tuwaScores.map((value, index) => {
              const [x, y] = pointAt(index, value);
              return (
                <rect
                  key={AXES[index].id}
                  x={x - TUWA_POINT / 2}
                  y={y - TUWA_POINT / 2}
                  width={TUWA_POINT}
                  height={TUWA_POINT}
                  className="fill-[var(--tuwa-docs-lit)] stroke-[var(--tuwa-docs-raised)]"
                  strokeWidth={1.5}
                />
              );
            })}
            {animated.map((value, index) => {
              const [x, y] = pointAt(index, value);
              return (
                <rect
                  key={AXES[index].id}
                  x={x - PRODUCT_POINT / 2}
                  y={y - PRODUCT_POINT / 2}
                  width={PRODUCT_POINT}
                  height={PRODUCT_POINT}
                  className="fill-[var(--tuwa-text-primary)] stroke-[var(--tuwa-docs-raised)]"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Axis labels: a click shows the criteria of the axis */}
            {AXES.map((item, index) => {
              const { x, y, anchor } = labelPlacement(index);
              const isActive = item.id === activeAxis;
              const axisLabel = t.comparisons.axes[item.id]?.label ?? item.label;
              // Only the side labels need two lines: the top and bottom ones have the whole width
              const lines = anchor === 'middle' ? [axisLabel] : labelLines(axisLabel);
              const sin = Math.sin(angleOf(index));
              // Bottom labels grow down, the top one up, side ones around their anchor point
              const shift = sin > 0.9 ? 0 : sin < -0.9 ? lines.length - 1 : (lines.length - 1) / 2;
              return (
                <text
                  key={item.id}
                  x={x}
                  y={y}
                  textAnchor={anchor}
                  onClick={() => setActiveAxis(item.id)}
                  className={`cursor-pointer font-mono text-[12px] font-bold uppercase tracking-[0.06em] transition-colors max-sm:text-[17px] max-sm:tracking-normal ${isActive ? 'fill-[var(--tuwa-text-accent)]' : 'fill-[var(--tuwa-text-secondary)] hover:fill-[var(--tuwa-text-primary)]'}`}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan key={line} x={x} dy={lineIndex === 0 ? `${-shift * 1.15}em` : '1.15em'}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Product picker and profile */}
        <div className={`flex flex-col gap-6 border-t p-4 md:p-6 lg:border-t-0 ${lineClassName}`}>
          <div>
            <p className={`m-0 text-[var(--tuwa-text-secondary)] ${capsClassName}`}>
              {t.ui.comparisonsExtra.compareTuwaWith}
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {SEGMENTS.map((group) => (
                <div key={group.id} role="group" aria-labelledby={`radar-segment-${group.id}`}>
                  <p
                    id={`radar-segment-${group.id}`}
                    className="m-0 font-mono text-[11px] leading-[1.35] text-[var(--tuwa-text-secondary)]"
                  >
                    {t.comparisons.segments[group.id]?.label ?? group.label}
                  </p>
                  <div className="mt-2 flex flex-wrap pr-px pb-px">
                    {COMPETITORS.filter((product) => product.segment === group.id).map((product) => {
                      const isSelected = product.id === selectedId;
                      return (
                        <button
                          key={product.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedId(product.id)}
                          className={`-mr-px -mb-px h-[34px] cursor-pointer border px-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] whitespace-nowrap transition-colors ${isSelected ? 'relative z-[1] border-[var(--tuwa-text-primary)] bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]' : 'border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]'}`}
                        >
                          {product.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProductProfile product={selected} counterpart={segment?.counterpart} />
        </div>
      </div>

      {/* Axis tabs and criteria */}
      <div className={`border-t ${lineClassName}`}>
        <div
          role="tablist"
          aria-label={t.ui.comparisonsExtra.radarAxesAria}
          className={`grid grid-cols-2 gap-px border-b bg-[var(--tuwa-border-primary)] md:grid-cols-3 lg:grid-cols-6 ${lineClassName}`}
        >
          {AXES.map((item, index) => {
            const isActive = item.id === activeAxis;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`axis-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="axis-panel"
                onClick={() => setActiveAxis(item.id)}
                className={`cursor-pointer px-4 py-3.5 text-left transition-colors ${isActive ? 'bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]' : 'bg-[var(--tuwa-docs-raised)] text-[var(--tuwa-text-secondary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,var(--tuwa-docs-raised))]'}`}
              >
                <span
                  className={`block ${capsClassName} ${isActive ? 'text-[var(--tuwa-docs-paper)]' : 'text-[var(--tuwa-text-primary)]'}`}
                >
                  {t.comparisons.axes[item.id]?.label ?? item.label}
                </span>
                <span className="mt-2.5 grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-1.5 font-mono text-[10px] leading-none">
                  <span>TUWA</span>
                  <ScoreBar value={tuwaScores[index]} lit />
                  <span className="truncate">{selected.name.split(' ').at(-1)}</span>
                  <ScoreBar value={selectedScores[index]} />
                </span>
              </button>
            );
          })}
        </div>

        <div id="axis-panel" role="tabpanel" aria-labelledby={`axis-tab-${activeAxis}`} className="p-4 md:p-6">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-baseline md:justify-between">
            <p className="m-0 text-[15px] font-medium leading-[1.4] text-[var(--tuwa-text-primary)]">
              {t.comparisons.axes[axis.id]?.question ?? axis.question}
            </p>
            <p className="m-0 font-mono text-xs whitespace-nowrap text-[var(--tuwa-text-secondary)]">
              TUWA {tuwaScores[AXES.indexOf(axis)]} · {selected.name} {selectedScores[AXES.indexOf(axis)]}
            </p>
          </div>
          {axis.favorsHosted && (
            <p className={`m-0 mt-4 text-[13px] leading-normal text-[var(--tuwa-text-secondary)] ${noteClassName}`}>
              {axis.id === 'onboarding'
                ? t.ui.comparisonsExtra.favorsHostedOnboarding
                : t.ui.comparisonsExtra.favorsHostedChains}
            </p>
          )}

          <div className={`mt-4 border-t ${lineClassName}`}>
            {axisCriteria.map((criterion) => {
              const criterionTranslation = t.comparisons.criteria[criterion.id];
              return (
                <div
                  key={criterion.id}
                  className={`grid grid-cols-1 gap-x-6 gap-y-2.5 border-b py-3.5 last:border-b-0 last:pb-0 md:grid-cols-3 ${lineClassName}`}
                >
                  <div>
                    <p className="m-0 text-sm font-semibold leading-[1.35] text-[var(--tuwa-text-primary)]">
                      {criterionTranslation?.label ?? criterion.label}
                    </p>
                    <p className="m-0 mt-1 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
                      {criterionTranslation?.description ?? criterion.description}
                    </p>
                  </div>
                  {[TUWA, selected].map((product) => {
                    const item = product.facts[criterion.id];
                    const localizedNote = t.comparisons.products[product.id]?.facts[criterion.id] ?? item.note;
                    return (
                      <div key={product.id} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex">
                          <MarkIcon mark={item.mark} />
                        </span>
                        <p className="m-0 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
                          <span className="font-semibold text-[var(--tuwa-text-primary)]">{product.name}: </span>
                          {localizedNote}
                          <SourceRef index={sources.get(item.sourceUrl) ?? 0} url={item.sourceUrl} />
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The profile of the chosen product beside the radar: its name as a link to its site, its licence in a square chip, a
 * line on what it is, its pricing with the source and the TUWA projects that do the same job.
 *
 * @param props.product - The product.
 * @param props.counterpart - The TUWA projects that do the same job, if the product has a segment.
 * @returns The profile.
 */
function ProductProfile({ product, counterpart }: { product: Product; counterpart?: string }) {
  const { t } = useI18n();
  const productTranslation = t.comparisons.products[product.id];
  const label = `m-0 text-[var(--tuwa-text-secondary)] ${capsClassName}`;
  return (
    <div className={`flex flex-col gap-4 border-t pt-5 ${lineClassName}`}>
      <div className="flex flex-col items-start gap-2.5">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-base font-bold leading-[1.25] text-[var(--tuwa-text-primary)] transition-colors hover:text-[var(--tuwa-text-accent)]"
        >
          {product.name}
          <ExternalLinkIcon className="h-3 w-3 shrink-0" />
        </a>
        <span className={chipClassName}>{productTranslation?.license ?? product.license}</span>
        <p className="m-0 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
          {productTranslation?.summary ?? product.summary}
        </p>
      </div>
      <dl className="m-0 grid gap-3.5">
        <div>
          <dt className={label}>{t.comparisons.matrix.pricingRow}</dt>
          <dd className="m-0 mt-1.5 text-[13px] leading-normal text-[var(--tuwa-text-primary)]">
            {productTranslation?.pricingText ?? product.pricing.text}
            <SourceRef index={sources.get(product.pricing.sourceUrl) ?? 0} url={product.pricing.sourceUrl} />
          </dd>
        </div>
        {counterpart && (
          <div>
            <dt className={label}>{t.ui.comparisonsExtra.tuwaCounterpartLabel}</dt>
            <dd className="m-0 mt-1.5 font-mono text-[13px] font-bold leading-[1.35] text-[var(--tuwa-text-accent)]">
              {counterpart}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
