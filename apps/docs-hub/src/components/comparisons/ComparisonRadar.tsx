'use client';

import { useEffect, useId, useRef, useState } from 'react';

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

import { MarkIcon, SourceRef } from './MarkIcon';
import { SEGMENT_COLORS } from './segmentColors';

// Geometry of the radar, in viewBox units
const WIDTH = 560;
const HEIGHT = 425;
const CX = 280;
const CY = 205;
const RADIUS = 150;
const LABEL_RADIUS = RADIUS + 22;
const RINGS = [25, 50, 75, 100];

const sources = sourceIndex();
const tuwaScores = productScores(TUWA);

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

function ScoreBar({ value, color }: { value: number; color?: string }) {
  return (
    <span className="relative block h-1 w-full rounded-full bg-[var(--tuwa-border-primary)]/30 dark:bg-white/[0.06] overflow-hidden">
      <span
        className={`absolute inset-y-0 left-0 rounded-full ${color ? '' : 'bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]'}`}
        style={{ width: `${value}%`, ...(color && { backgroundColor: color }) }}
      />
    </span>
  );
}

/**
 * The Ecosystem Radar of `/comparisons`: TUWA against one competitor on the six axes of `AXES`, a competitor picker
 * grouped by segment, and the criteria of the selected axis with the fact and source of each product.
 */
export function ComparisonRadar() {
  const [selectedId, setSelectedId] = useState(COMPETITORS[0].id);
  const [activeAxis, setActiveAxis] = useState<AxisId>('custody');
  const gradientId = useId();
  const glowId = useId();

  const selected = COMPETITORS.find((product) => product.id === selectedId) ?? COMPETITORS[0];
  const segment = SEGMENTS.find((item) => item.id === selected.segment);
  const color = SEGMENT_COLORS[selected.segment ?? 'connectors'];
  const selectedScores = productScores(selected);
  const animated = useTweenedScores(selectedScores);
  const axis = AXES.find((item) => item.id === activeAxis) ?? AXES[0];
  const axisCriteria = CRITERIA.filter((criterion) => criterion.axis === activeAxis);

  const summary = AXES.map(
    (item, index) => `${item.label}: TUWA ${tuwaScores[index]}, ${selected.name} ${selectedScores[index]}`,
  ).join('; ');

  return (
    <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm shadow-xl shadow-black/[0.03]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Radar */}
        <div className="p-3 sm:p-6 lg:border-r border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs font-mono">
            <span className="inline-flex items-center gap-2 text-[var(--tuwa-text-primary)] font-semibold">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-br from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]" />
              TUWA
            </span>
            <span className="inline-flex items-center gap-2 text-[var(--tuwa-text-primary)] font-semibold">
              <span
                className="w-3 h-3 rounded-sm border-2 border-dashed"
                style={{ borderColor: color, backgroundColor: `${color}33` }}
              />
              {selected.name}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto max-w-[600px] mx-auto select-none"
            role="img"
            aria-label={`Radar of TUWA and ${selected.name}. ${summary}.`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--tuwa-button-gradient-from)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--tuwa-button-gradient-to)' }} />
              </linearGradient>
              <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            {/* Rings and spokes */}
            {RINGS.map((ring) => (
              <polygon
                key={ring}
                points={polygon(AXES.map(() => ring))}
                fill={ring === 100 ? 'var(--tuwa-text-accent)' : 'none'}
                fillOpacity={ring === 100 ? 0.025 : 0}
                className="stroke-[var(--tuwa-border-primary)] dark:stroke-white/15"
                strokeOpacity={ring === 100 ? 0.9 : 0.55}
                strokeDasharray={ring === 100 ? undefined : '3 5'}
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
                  className="stroke-[var(--tuwa-border-primary)] dark:stroke-white/15"
                  strokeOpacity={item.id === activeAxis ? 1 : 0.5}
                  strokeWidth={item.id === activeAxis ? 1.5 : 1}
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
                  className="fill-[var(--tuwa-text-tertiary)] text-[9px] font-mono"
                >
                  {ring}
                </text>
              );
            })}

            {/* Fills: the competitor under TUWA, TUWA with a soft glow */}
            <polygon points={polygon(animated)} fill={color} fillOpacity={0.16} />
            <polygon
              points={polygon(tuwaScores)}
              fill={`url(#${gradientId})`}
              opacity={0.35}
              filter={`url(#${glowId})`}
            />
            <polygon points={polygon(tuwaScores)} fill={`url(#${gradientId})`} fillOpacity={0.2} />

            {/* Outlines: TUWA solid, the competitor dashed on top, so both stay visible where they overlap */}
            <polygon
              points={polygon(tuwaScores)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <polygon
              points={polygon(animated)}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeDasharray="6 4"
              strokeLinejoin="round"
            />
            {tuwaScores.map((value, index) => {
              const [x, y] = pointAt(index, value);
              return (
                <circle
                  key={AXES[index].id}
                  cx={x}
                  cy={y}
                  r={4.5}
                  fill={`url(#${gradientId})`}
                  className="stroke-[var(--tuwa-bg-primary)]"
                  strokeWidth={2}
                />
              );
            })}
            {animated.map((value, index) => {
              const [x, y] = pointAt(index, value);
              return (
                <circle
                  key={AXES[index].id}
                  cx={x}
                  cy={y}
                  r={3.5}
                  fill={color}
                  className="stroke-[var(--tuwa-bg-primary)]"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Axis labels: a click shows the criteria of the axis */}
            {AXES.map((item, index) => {
              const { x, y, anchor } = labelPlacement(index);
              const isActive = item.id === activeAxis;
              // Only the side labels need two lines: the top and bottom ones have the whole width
              const lines = anchor === 'middle' ? [item.label] : labelLines(item.label);
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
                  className={`cursor-pointer text-[14px] max-sm:text-[21px] font-semibold transition-colors ${isActive ? 'fill-[var(--tuwa-text-accent)]' : 'fill-[var(--tuwa-text-secondary)] hover:fill-[var(--tuwa-text-primary)]'}`}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan key={line} x={x} dy={lineIndex === 0 ? `${-shift * 1.1}em` : '1.1em'}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Competitor picker and profile */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 border-t lg:border-t-0 border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)] mb-3">
              Compare TUWA with
            </p>
            <div className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none]">
              {SEGMENTS.map((group) => (
                <div key={group.id} className="flex lg:flex-col gap-2 lg:gap-1.5 shrink-0">
                  <span className="hidden lg:block text-[10px] uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
                    {group.label}
                  </span>
                  <div className="flex flex-nowrap lg:flex-wrap gap-2">
                    {COMPETITORS.filter((product) => product.segment === group.id).map((product) => {
                      const isSelected = product.id === selectedId;
                      const chipColor = SEGMENT_COLORS[group.id];
                      return (
                        <button
                          key={product.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedId(product.id)}
                          className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected ? 'text-[var(--tuwa-text-primary)] shadow-sm' : 'border-[var(--tuwa-border-primary)]/50 dark:border-white/10 text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-border-primary)]'}`}
                          style={isSelected ? { borderColor: chipColor, backgroundColor: `${chipColor}1f` } : undefined}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chipColor }} />
                          {product.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProductProfile product={selected} counterpart={segment?.counterpart} color={color} />
        </div>
      </div>

      {/* Axis tabs and criteria */}
      <div className="border-t border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]">
        <div
          role="tablist"
          aria-label="Radar axes"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]"
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
                className={`relative text-left px-4 py-3 transition-colors cursor-pointer border-[var(--tuwa-border-primary)]/20 dark:border-white/[0.04] [&:not(:last-child)]:border-r ${isActive ? 'bg-[var(--tuwa-text-accent)]/[0.06]' : 'hover:bg-[var(--tuwa-bg-secondary)]/50 dark:hover:bg-white/[0.02]'}`}
              >
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]" />
                )}
                <span
                  className={`block text-xs font-semibold font-geist-mono uppercase tracking-wide ${isActive ? 'text-[var(--tuwa-text-primary)]' : 'text-[var(--tuwa-text-secondary)]'}`}
                >
                  {item.label}
                </span>
                <span className="mt-2 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 text-[10px] font-mono text-[var(--tuwa-text-tertiary)]">
                  <span>TUWA</span>
                  <ScoreBar value={tuwaScores[index]} />
                  <span className="truncate">{selected.name.split(' ').at(-1)}</span>
                  <ScoreBar value={selectedScores[index]} color={color} />
                </span>
              </button>
            );
          })}
        </div>

        <div id="axis-panel" role="tabpanel" aria-labelledby={`axis-tab-${activeAxis}`} className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
            <p className="text-sm text-[var(--tuwa-text-primary)] font-medium">{axis.question}</p>
            <p className="text-xs font-mono text-[var(--tuwa-text-tertiary)]">
              TUWA {tuwaScores[AXES.indexOf(axis)]} · {selected.name} {selectedScores[AXES.indexOf(axis)]}
            </p>
          </div>
          {axis.favorsHosted && (
            <p className="mb-4 text-xs leading-relaxed text-[var(--tuwa-text-secondary)] rounded-[var(--tuwa-rounded-corners)] border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2">
              {axis.id === 'onboarding'
                ? 'Hosted platforms lead here by design: TUWA connects the wallets users already have and never creates or holds wallets for them.'
                : 'Embedded-wallet services reach more chain families today. TUWA covers EVM and Solana; Starknet, Tron, Bitcoin and TON are next on the roadmap.'}
            </p>
          )}

          <div className="divide-y divide-[var(--tuwa-border-primary)]/25 dark:divide-white/[0.05]">
            {axisCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="py-3 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-6 gap-y-2"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--tuwa-text-primary)]">{criterion.label}</p>
                  <p className="text-xs text-[var(--tuwa-text-secondary)] mt-0.5 leading-relaxed">
                    {criterion.description}
                  </p>
                </div>
                {[TUWA, selected].map((product) => {
                  const item = product.facts[criterion.id];
                  return (
                    <div key={product.id} className="flex items-start gap-2.5">
                      <MarkIcon mark={item.mark} className="w-[18px] h-[18px] mt-px" />
                      <p className="text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
                        <span className="font-semibold text-[var(--tuwa-text-primary)]">{product.name}: </span>
                        {item.note}
                        <SourceRef index={sources.get(item.sourceUrl) ?? 0} url={item.sourceUrl} />
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductProfile({ product, counterpart, color }: { product: Product; counterpart?: string; color: string }) {
  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="flex flex-col items-start">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap text-base font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)] hover:text-[var(--tuwa-text-accent)] transition-colors"
        >
          {product.name} ↗
        </a>
        <span
          className="mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-mono"
          style={{ borderColor: `${color}66`, color }}
        >
          {product.license}
        </span>
        <p className="mt-1.5 leading-relaxed text-[var(--tuwa-text-secondary)]">{product.summary}</p>
      </div>
      <dl className="grid gap-2.5">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">Pricing</dt>
          <dd className="mt-0.5 leading-relaxed text-[var(--tuwa-text-primary)]">
            {product.pricing.text}
            <SourceRef index={sources.get(product.pricing.sourceUrl) ?? 0} url={product.pricing.sourceUrl} />
          </dd>
        </div>
        {counterpart && (
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">TUWA counterpart</dt>
            <dd className="mt-0.5 font-semibold text-[var(--tuwa-text-accent)]">{counterpart}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
