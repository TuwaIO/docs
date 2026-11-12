'use client';

import { PixelArt, projectIconArt, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';
import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { formatLabel, useI18n } from '@/i18n';
import {
  boardEdges,
  boardPlaces,
  ecosystemCounts,
  entryLayerRange,
  layers,
  sdkReExports,
  stagedEntries,
  type StagedEntry,
  stageLayerRange,
} from '@/lib/ecosystem';
import { type BoardTrace, boardTraces, type NodeBox, traceEnds, tracePath } from '@/lib/ecosystemBoard';
import { formatPlural } from '@/lib/plural';

import { homeSectionLayer } from './homeLayout';
import { SectionBar, SectionHead } from './SectionHead';

/** The width from which the board lays the projects on three lanes and draws its traces (Tailwind's `lg`) */
const DESKTOP = '(min-width: 64rem)';

const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em]';
const orTagClassName = `h-5 items-center border border-[var(--tuwa-border-strong)] bg-[var(--tuwa-docs-raised)] px-1.5 text-[var(--tuwa-text-secondary)] ${capsClassName}`;

/**
 * A sample of a trace for the legend: a line of 1px between two squares, solid for a project another cannot work
 * without, dotted for a link that is optional.
 */
function TraceSample({ dotted }: { dotted?: boolean }) {
  return (
    <svg width="34" height="6" className="shrink-0" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="1" width="4" height="4" fill="currentColor" />
      <path d="M5 3.5h24" stroke="currentColor" strokeDasharray={dotted ? '1 3' : undefined} />
      <rect x="30" y="1" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

/**
 * The traces of the board, measured from its nodes from 1024px: again when the board changes size, when the window
 * crosses 1024px and when the fonts have loaded (a node of another width moves its traces). Below 1024px there are none.
 */
function useBoardTraces(boardRef: RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<{ traces: BoardTrace[]; width: number; height: number }>({
    traces: [],
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const desktop = window.matchMedia(DESKTOP);
    let frame = 0;
    let alive = true;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!alive) return;
        if (!desktop.matches) {
          setState((current) => (current.traces.length ? { traces: [], width: 0, height: 0 } : current));
          return;
        }
        const origin = board.getBoundingClientRect();
        const boxes: Record<string, NodeBox> = {};
        for (const node of board.querySelectorAll<HTMLElement>('[data-node]')) {
          const box = node.getBoundingClientRect();
          boxes[node.dataset.node as string] = {
            left: box.left - origin.left,
            right: box.right - origin.left,
            top: box.top - origin.top,
            bottom: box.bottom - origin.top,
          };
        }
        const lanes = board.querySelector<HTMLElement>('[data-lanes]')?.getBoundingClientRect();
        if (!lanes) return;
        setState({
          traces: boardTraces(boardEdges, boxes, { left: lanes.left - origin.left, width: lanes.width }),
          width: origin.width,
          height: origin.height,
        });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    desktop.addEventListener('change', measure);
    void document.fonts?.ready.then(measure);
    measure();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      desktop.removeEventListener('change', measure);
    };
  }, [boardRef]);

  return state;
}

/** The count of the npm packages of a project that are not deprecated. */
const packageCount = (entry: StagedEntry) =>
  (entry.packages ?? []).filter((pkg) => pkg.name.startsWith('@tuwaio/') && !pkg.isDeprecated).length;

/**
 * The board of the architecture of the main page, in paper and ink: what builds on what. It opens with the bar of the
 * section (`01 / Ecosystem`, with the numbers of products, stages and packages), then the title, the lead and a board
 * of raised paper on lines of 1px with a row per stage (its number, the layers of its packages and its title in mono, a
 * link to its ledger) and the projects as nodes (a pixel tile, the name in mono, the packages and their layers; the SDK
 * with the projects it re-exports), each a link to its row. From 1024px the projects sit on three lanes and traces with
 * square ends run from each project to the projects that build on it, measured in the browser: solid where a project
 * cannot work without the other, dotted where the link is optional. Under the pointer or the keyboard a project lights
 * its traces and its neighbours. From 600px a stage lists its projects two by two, on phones one under another on a
 * dotted line. The traces are hidden from assistive technology, which reads a list of what builds on what instead.
 *
 * Side effects: a `ResizeObserver` on the board and a listener of the 1024px media query while it is mounted.
 *
 * @returns The section.
 */
export function EcosystemBoard() {
  const { locale, t } = useI18n();
  const board = t.home.board;
  const boardRef = useRef<HTMLDivElement>(null);
  const { traces, width, height } = useBoardTraces(boardRef);
  const [active, setActive] = useState<string | null>(null);

  const entries = stagedEntries();
  const counts = ecosystemCounts();
  const nameOf = (id: string) => entries.find((entry) => entry.id === id)?.name ?? id;
  const lit = new Set(
    active
      ? boardEdges.filter((edge) => edge.from === active || edge.to === active).flatMap((edge) => [edge.from, edge.to])
      : [],
  );
  // A project under the pointer or the keyboard lights its traces and its neighbours, and its icon assembles again and
  // moves in the way of its project until the pointer or the focus leaves
  const point = (id: string) => {
    const enter = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      setActive(id);
      startPixelMotion(event.currentTarget);
    };
    const leave = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      setActive((current) => (current === id ? null : current));
      stopPixelMotion(event.currentTarget);
    };
    return { onMouseEnter: enter, onMouseLeave: leave, onFocus: enter, onBlur: leave };
  };

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className={`mt-[104px] scroll-mt-[56px] ${homeSectionLayer[1]}`}
    >
      <SectionBar
        number={1}
        name={board.section}
        meta={[
          formatPlural(t.home.plate.products, counts.products, locale),
          formatPlural(t.home.plate.stages, counts.stages, locale),
          formatPlural(board.packages, counts.packages, locale),
        ]}
      />
      <div className="pt-12">
        <SectionHead
          id="ecosystem-title"
          title={`${t.home.timeline.titlePrefix} ${t.home.timeline.titleHighlight}`}
          lead={t.home.timeline.subtitle}
          code="@tuwaio/sdk"
        />
      </div>

      <div
        ref={boardRef}
        className="relative mt-11 border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-docs-raised)]"
      >
        {/* The head of the columns and the legend of the traces, from 1024px: the rows below say it all on their own */}
        <div
          aria-hidden="true"
          className="hidden h-10 grid-cols-[220px_minmax(0,1fr)_auto] items-center border-b border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)] lg:grid"
        >
          <span
            className={`flex h-full items-center border-r border-[var(--tuwa-border-primary)] px-4 ${capsClassName}`}
          >
            {board.stage}
          </span>
          <span className={`px-4 ${capsClassName}`}>{board.projectsHeading}</span>
          <span className={`flex items-center gap-[18px] px-4 ${capsClassName}`}>
            <span className="inline-flex items-center gap-2">
              <TraceSample />
              {board.buildsOn}
            </span>
            <span className="inline-flex items-center gap-2">
              <TraceSample dotted />
              {board.optional}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className={`inline-flex ${orTagClassName}`}>{board.or}</span>
              {board.cloudOrSelfHosted}
            </span>
          </span>
        </div>

        {layers.map((layer, index) => {
          const stage = index + 1;
          const stageEntries = entries
            .filter((entry) => entry.stage === stage)
            .sort((a, b) => (boardPlaces[a.id]?.lane ?? 0) - (boardPlaces[b.id]?.lane ?? 0));
          const isFirst = index === 0;
          const isLast = index === layers.length - 1;
          return (
            <div
              key={layer.label}
              className={`relative grid grid-cols-1 lg:min-h-[104px] lg:grid-cols-[220px_minmax(0,1fr)] ${isFirst ? '' : 'border-t border-[var(--tuwa-border-primary)] lg:border-[var(--tuwa-border-secondary)]'}`}
            >
              {/* The dotted line that strings the stages together on phones and tablets */}
              <span
                aria-hidden="true"
                className={`tuwa-hub-dots-y absolute left-[22px] z-[1] w-px lg:hidden ${isFirst ? 'top-[26px]' : 'top-0'} ${isLast ? 'h-[26px]' : 'bottom-0'}`}
              />
              <a
                href={`#stage-${stage}`}
                className="relative z-[2] flex items-center gap-2.5 py-4 pr-3.5 pb-2.5 pl-11 transition-colors lg:flex-col lg:items-start lg:justify-center lg:gap-2 lg:border-r lg:border-[var(--tuwa-border-primary)] lg:px-4 lg:py-3.5 lg:hover:bg-[var(--tuwa-docs-sunken)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[21px] left-[19px] h-[7px] w-[7px] bg-[var(--tuwa-text-accent)] lg:hidden"
                />
                <span className="flex items-center gap-2.5 lg:w-full lg:justify-between lg:gap-2">
                  <span className="font-mono text-xs font-bold leading-none tracking-[0.12em] text-[var(--tuwa-text-accent)]">
                    {String(stage).padStart(2, '0')}
                  </span>
                  <span className="inline-flex h-[22px] items-center whitespace-nowrap border border-[var(--tuwa-border-strong)] px-1.5 font-mono text-[11px] font-bold leading-none tracking-[0.06em] text-[var(--tuwa-text-primary)]">
                    {stageLayerRange(stage)}
                  </span>
                </span>
                <span className="flex-1 font-mono text-[13px] font-semibold leading-[1.3] tracking-[-0.02em] text-[var(--tuwa-text-primary)]">
                  {t.home.timeline.stages[stage]?.title}
                </span>
              </a>

              <div
                data-lanes
                className="relative flex flex-col gap-2 pr-3.5 pb-4 pl-11 min-[600px]:grid min-[600px]:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-0 lg:p-0"
              >
                {stageEntries.map((entry, position) => {
                  const place = boardPlaces[entry.id];
                  const isSdk = (place?.span ?? 1) > 1;
                  const count = packageCount(entry);
                  // The range of layers never breaks inside ("L1–" and "L2" on two lines read as two things)
                  const meta = count ? (
                    <>
                      {formatPlural(board.packages, count, locale)} ·{' '}
                      <span className="whitespace-nowrap">{entryLayerRange(entry.id)}</span>
                    </>
                  ) : entry.hosting === 'managed' ? (
                    board.managed
                  ) : (
                    board.selfHosted
                  );
                  return (
                    <a
                      key={entry.id}
                      href={`#p-${entry.id}`}
                      data-node={entry.id}
                      {...point(entry.id)}
                      style={{ '--lane': `${place?.lane ?? 1} / span ${place?.span ?? 1}` } as CSSProperties}
                      className={`relative z-[2] flex items-center gap-3 border bg-[var(--tuwa-docs-raised)] py-[9px] pr-3 pl-[9px] transition-colors lg:mx-3 lg:[grid-column:var(--lane)] xl:mx-[18px] lg:[grid-row:1] ${lit.has(entry.id) ? 'border-[var(--tuwa-text-accent)]' : 'border-[var(--tuwa-border-strong)] hover:border-[var(--tuwa-text-accent)]'} ${isSdk ? 'flex-wrap min-[600px]:col-span-2 min-[600px]:flex-nowrap' : ''}`}
                    >
                      {/* The short line from the dotted line of the stage, on phones and tablets */}
                      <span
                        aria-hidden="true"
                        className={`absolute top-[28px] -left-[22px] h-px w-[21px] bg-[var(--tuwa-text-secondary)] opacity-60 lg:hidden ${position === 1 ? 'min-[600px]:hidden' : ''}`}
                      />
                      <span className="grid h-[38px] w-[38px] flex-none place-items-center border border-[var(--tuwa-border-primary)]">
                        <PixelArt
                          art={projectIconArt[entry.icon]}
                          assemble
                          motion={entry.icon}
                          data-handoff-to={entry.id}
                          className="h-[27px] w-[27px]"
                        />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="font-mono text-sm font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--tuwa-text-primary)]">
                          {entry.name}
                        </span>
                        <span className="font-mono text-[11px] font-bold uppercase leading-[1.2] tracking-[0.1em] text-[var(--tuwa-text-secondary)]">
                          {meta}
                        </span>
                      </span>
                      {isSdk && (
                        <span className="flex w-full flex-wrap items-center gap-2 pt-1 min-[600px]:ml-auto min-[600px]:w-auto min-[600px]:flex-nowrap min-[600px]:border-l min-[600px]:border-[var(--tuwa-border-secondary)] min-[600px]:pt-0 min-[600px]:pl-3.5">
                          <span
                            className={`text-[var(--tuwa-text-secondary)] min-[600px]:whitespace-nowrap ${capsClassName}`}
                          >
                            {board.reExports}
                          </span>
                          <span className="flex gap-1.5">
                            {sdkReExports.map((id) => (
                              <span
                                key={id}
                                title={nameOf(id)}
                                className="grid h-[26px] w-[26px] place-items-center border border-[var(--tuwa-border-primary)]"
                              >
                                <PixelArt
                                  art={projectIconArt[entries.find((candidate) => candidate.id === id)?.icon ?? 'gear']}
                                  className="h-[18px] w-[18px]"
                                />
                              </span>
                            ))}
                          </span>
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}

        <svg
          aria-hidden="true"
          width={width}
          height={height}
          shapeRendering="crispEdges"
          className="pointer-events-none absolute inset-0 z-[1] hidden overflow-visible lg:block"
        >
          {traces.map((trace) => {
            const isLit = active !== null && (trace.from === active || trace.to === active);
            // Solid where a project cannot work without the other, dotted where the link is optional, lit or not; a
            // solid line rests in the grey of the strong lines, a dotted one in the grey of the text (its dots are
            // sparse)
            const isOptional = trace.kind === 'optional';
            const rest = isOptional ? 'text-[var(--tuwa-text-secondary)]' : 'text-[var(--tuwa-border-strong)]';
            return (
              <g
                key={`${trace.from}>${trace.to}`}
                data-kind={trace.kind ?? 'required'}
                className={`transition-colors duration-150 ${isLit ? 'text-[var(--tuwa-text-accent)]' : rest}`}
              >
                <path
                  d={tracePath(trace.points)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeDasharray={isOptional ? '1 3' : undefined}
                />
                {traceEnds(trace.points).map(([x, y]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width={4} height={4} fill="currentColor" />
                ))}
              </g>
            );
          })}
        </svg>
        {traces
          .filter((trace) => trace.kind === 'or')
          .map((trace) => {
            const [first, last] = [trace.points[0]!, trace.points[trace.points.length - 1]!];
            return (
              <span
                key={`${trace.from}>${trace.to}`}
                aria-hidden="true"
                style={{ left: (first[0] + last[0]) / 2, top: first[1] }}
                className={`absolute z-[3] hidden -translate-x-1/2 -translate-y-1/2 lg:flex ${orTagClassName}`}
              >
                {board.or}
              </span>
            );
          })}
      </div>

      <h3 className="sr-only">{board.relationsLabel}</h3>
      <ul className="sr-only">
        {boardEdges.map((edge) => (
          <li key={`${edge.from}>${edge.to}`}>
            {edge.kind === 'or'
              ? formatLabel(board.relationOr, { first: nameOf(edge.from), second: nameOf(edge.to) })
              : formatLabel(edge.kind === 'optional' ? board.relationOptional : board.relation, {
                  project: nameOf(edge.to),
                  base: nameOf(edge.from),
                })}
          </li>
        ))}
      </ul>
    </section>
  );
}
