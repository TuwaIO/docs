'use client';

import type { CSSProperties } from 'react';

import {
  EARTH,
  EARTH_SMALL,
  FLIGHT_CELL,
  RAIL_SHIP,
  SHIP_EXHAUST,
  SHIP_EXHAUST_LENGTH,
  SHIP_FLAME_CELLS,
  STRIP_CELL,
  STRIP_SHIP,
} from '../flightArt';
import { spreadLabels } from '../flightPlan';
import { type FlightHeading, type FlightMeasure, useFlight } from '../useFlight';
import { CornerMarks } from './ProjectSquare';

/** A part of a page the craft of its flight plan passes. */
export interface FlightWaypoint {
  /** The id of the part: the target of the link of the waypoint */
  id: string;
  /**
   * `section`: a part of the first rank (the overview, the sections with a bar, the last part of the page); `stage`: a
   * part inside a section (a stage ledger of the main page), with a smaller mark and its name under those of the
   * sections
   */
  kind: 'section' | 'stage';
  /** The number of the part, as its bar shows it (`01`); a stage has none on the rail, nor has a part without a bar */
  number?: string;
  /** The name of the part */
  name: string;
}

/** Props of {@link FlightPlan}. */
export interface FlightPlanProps {
  /** The parts of the page, from the top: the first is where the craft starts, the last is the Earth */
  waypoints: readonly FlightWaypoint[];
  /** The names of the flight plan for assistive technology, in the language of the page (`docsLabels[locale].flight`) */
  labels: {
    /** The name of the navigation of the rail */
    ariaLabel: string;
    /** The name of the progress of the flight */
    progressLabel: string;
  };
  /**
   * Classes that make a part as wide as the column of the page (its `max-width`), in the styles of the page: the rail
   * stands in the margin on the right of the column and shows what that margin has room for. Default: the column of
   * the docs hub, 1120px wide and 1232px from 1600px.
   */
  columnClassName?: string;
  /** The height of the fixed header of the page in pixels: the strip lies on its line (default: `56`) */
  headerHeight?: number;
}

/** The column of the docs hub, the default of {@link FlightPlanProps.columnClassName}. */
const HUB_COLUMN = 'tuwadocs:max-w-[1120px] tuwadocs:min-[1600px]:max-w-[1232px]';
/** The space between the header and the top of the rail. */
const RAIL_BELOW_HEADER = 24;

// ── The rail, in pixels from its right edge (the right edge of the screen) and its top ──
/**
 * The line of the rail: a ruler by the right edge of the screen, beside the scrollbar, which tells the same story.
 * Far enough from the edge for the scrollbar that lies over the page while it scrolls.
 */
const LINE = 24;
/** The side of the hull of the craft, and how far its middle pixel is from its edge. */
const SHIP = (RAIL_SHIP.ahead.length - SHIP_FLAME_CELLS) * FLIGHT_CELL;
const SHIP_HALF = (SHIP - 1) / 2;
const FLAMES = SHIP_FLAME_CELLS * FLIGHT_CELL;
const EARTH_SIZE = EARTH.length * FLIGHT_CELL;
const EARTH_HALF = (EARTH_SIZE - 1) / 2;
/** The space between the craft and the corner marks of the bay it docks in, and between the Earth and its own. */
const BAY = 6;
const EARTH_BAY = 4;
/** From the top of the craft at the end of its flight to the top of the Earth: its hull, a gap and the marks. */
const EARTH_AFTER = SHIP + 3 + EARTH_BAY;
/** What of the height of the rail is not the way of the craft. */
const RAIL_FIXED = EARTH_AFTER + EARTH_SIZE + EARTH_BAY;
const SECTION_MARK = 9;
const STAGE_MARK = 5;
/** How many divisions the ruler has: a short tick every 5% of the flight, a long one every 25%. */
const TICKS = 20;
/** The height of the row of a label, and the least distance between two rows. */
const LABEL_ROW = 18;
/** Where the tag of the craft starts and how wide it is: the lane between the line and the labels is kept for it. */
const TAG_AT = LINE + SHIP_HALF + 1 + 5;
const TAG_WIDTH = 35;
/** Where the labels start, past the lane of the tag: the numbers of the sections, then, farther from the line, the names. */
const LABELS_AT = 84;
const NUMBER = 14;
const NAMES_AT = LABELS_AT + NUMBER + 8;
/** The space kept between the rail and the frame of the page, and from the edge of the screen to the links. */
const CLEAR = 8;

// ── The strip, in pixels ──
const STRIP_FLAMES = SHIP_FLAME_CELLS * STRIP_CELL;
const STRIP_SHIP_LENGTH = (STRIP_SHIP.ahead[0]?.length ?? 0) * STRIP_CELL - STRIP_FLAMES;
const STRIP_SHIP_HEIGHT = STRIP_SHIP.ahead.length * STRIP_CELL;
const STRIP_EARTH = EARTH_SMALL.length * STRIP_CELL;
/** What of the width of the strip is not the way of the craft: its hull, a gap, the Earth and the edge. */
const STRIP_FIXED = STRIP_SHIP_LENGTH + 3 + STRIP_EARTH + 4;

/** The colours of the pixels of the craft: the hull in ink, the cockpit and the flames lit. */
const shipPixels = {
  '#': 'tuwadocs:fill-[var(--tuwa-text-primary)]',
  o: 'tuwadocs:fill-[var(--tuwa-docs-lit)]',
  A: 'tuwadocs:fill-[var(--tuwa-docs-lit)] tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-200 tuwadocs:group-data-[moving]/flight:opacity-100 tuwadocs:motion-reduce:transition-none',
  b: 'tuwadocs:fill-[var(--tuwa-docs-lit)] tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-200 tuwadocs:group-data-[moving]/flight:animate-[tuwa-flight-flicker_180ms_steps(1)_infinite] tuwadocs:group-data-[moving]/flight:opacity-100 tuwadocs:motion-reduce:animate-none tuwadocs:motion-reduce:transition-none',
};

/** The Earth in grey until the craft arrives; then its outline is ink and its continents are lit. */
const earthPixels = {
  '#': 'tuwadocs:fill-[var(--tuwa-text-secondary)] tuwadocs:transition-[fill] tuwadocs:duration-300 tuwadocs:group-data-[arrived]/flight:fill-[var(--tuwa-text-primary)] tuwadocs:motion-reduce:transition-none',
  o: 'tuwadocs:fill-[var(--tuwa-border-strong)] tuwadocs:transition-[fill] tuwadocs:duration-300 tuwadocs:group-data-[arrived]/flight:fill-[var(--tuwa-docs-lit)] tuwadocs:motion-reduce:transition-none',
};

/**
 * Where a pixel starts when its picture is drawn anew: up to 5 cells off its place on one axis. Integer arithmetic,
 * so the server and every browser render the same markup.
 */
const offsetOf = (index: number, axis: number) => {
  const seed = (Math.imul(index + 1, 2654435761) ^ Math.imul(axis + 1, 40503)) >>> 0;
  return ((seed % 101) - 50) / 10;
};

/**
 * A pixel picture of the flight plan, in square cells on whole pixels (`flightArt.ts`). With `assemble` its pixels of
 * ink and its lit pixels fly in to their places once, one after another, when it renders (`tuwa-flight-assemble` in
 * `site.css`; nothing for reduced motion): a craft that turns around is drawn anew this way. Its flames never fly.
 *
 * @param props.art - The picture, row by row.
 * @param props.pixels - The classes of each kind of pixel, by its letter.
 * @param props.cell - The side of a cell in pixels (default: 3).
 * @param props.assemble - Whether its pixels fly in when it renders (default: `false`).
 * @param props.className - Classes of the `svg`.
 * @param props.style - Styles of the `svg`: its place.
 * @returns The `svg`, hidden from assistive technology.
 */
function Pixels({
  art,
  pixels,
  cell = FLIGHT_CELL,
  assemble = false,
  className = '',
  style,
}: {
  art: readonly string[];
  pixels: Readonly<Record<string, string>>;
  cell?: number;
  assemble?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const columns = art[0]?.length ?? 0;
  let flying = 0;
  return (
    <svg
      viewBox={`0 0 ${columns} ${art.length}`}
      width={columns * cell}
      height={art.length * cell}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={`tuwadocs:absolute tuwadocs:max-w-none tuwadocs:overflow-visible ${assemble ? 'tuwa-flight-assemble' : ''} ${className}`}
      style={style}
    >
      {art.flatMap((row, y) =>
        [...row].map((pixel, x) => {
          if (pixel === '.') return null;
          const flies = assemble && (pixel === '#' || pixel === 'o');
          const index = flies ? flying++ : 0;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              className={pixels[pixel]}
              data-fly={flies ? '' : undefined}
              style={
                flies
                  ? ({
                      '--i': index,
                      '--dx': `${offsetOf(index, 0)}px`,
                      '--dy': `${offsetOf(index, 1)}px`,
                    } as CSSProperties)
                  : undefined
              }
            />
          );
        }),
      )}
    </svg>
  );
}

/**
 * Whether a waypoint has no mark of its own: a stage whose mark would lie on the mark of the section before it, because
 * the stage starts where the section does. Its label points at the mark of the section.
 *
 * @param waypoints - The parts of the page, from the top.
 * @param places - The place of the mark of each waypoint along its track, in pixels.
 * @param index - The index of the waypoint.
 * @returns `true` for such a stage.
 */
function sharesMark(waypoints: readonly FlightWaypoint[], places: readonly number[], index: number): boolean {
  return (
    waypoints[index]?.kind === 'stage' &&
    waypoints[index - 1]?.kind === 'section' &&
    Math.abs((places[index] as number) - (places[index - 1] as number)) < SECTION_MARK
  );
}

/** The colours of a label by the state of its waypoint: ahead, passed or the one the craft has locked on. */
const labelColour = (state: 'ahead' | 'passed' | 'here') =>
  state === 'here'
    ? 'tuwadocs:text-[var(--tuwa-text-accent)]'
    : state === 'passed'
      ? 'tuwadocs:text-[var(--tuwa-text-primary)]'
      : 'tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:hover:text-[var(--tuwa-text-primary)]';

/** The square of a waypoint on the line: paper in a grey outline ahead of the craft, lit once it is reached. */
const markColour = (reached: boolean) =>
  reached
    ? 'tuwadocs:border-[var(--tuwa-docs-lit)] tuwadocs:bg-[var(--tuwa-docs-lit)]'
    : 'tuwadocs:border-[var(--tuwa-text-secondary)] tuwadocs:bg-[var(--tuwa-docs-paper)]';

const sectionNameClassName = 'tuwadocs:text-[11px] tuwadocs:font-bold tuwadocs:tracking-[0.12em]';
const stageNameClassName = 'tuwadocs:text-[10px] tuwadocs:font-medium tuwadocs:tracking-[0.06em]';

/**
 * The line of the rail with the ticks of its ruler: a tick every 5% of the flight, a longer one every 25%, on the side
 * of the edge of the screen, the right. The line runs from the first waypoint to the Earth.
 *
 * @param props.travel - The length of the way of the craft, in pixels.
 * @param props.colour - The class of the colour of the line and the ticks.
 * @returns The line and the ticks.
 */
function Ruler({ travel, colour }: { travel: number; colour: string }) {
  return (
    <>
      <span
        className={`tuwadocs:absolute tuwadocs:w-px ${colour}`}
        style={{ right: LINE, top: SHIP_HALF, bottom: EARTH_SIZE + EARTH_BAY }}
      />
      {Array.from({ length: TICKS + 1 }, (_, tick) => {
        const length = tick % 5 === 0 ? 8 : 4;
        return (
          <span
            key={tick}
            className={`tuwadocs:absolute tuwadocs:h-px ${colour}`}
            style={{ right: LINE - length, width: length, top: SHIP_HALF + Math.round((tick * travel) / TICKS) }}
          />
        );
      })}
    </>
  );
}

/**
 * The rail of the flight plan, from 1280px: a ruler down the right margin of the page, its line 24px from the edge of
 * the screen, beside the scrollbar (the two show the same way down the page), from the top of the page to the Earth at
 * its foot, where the flight ends. The craft, a spacecraft, flies
 * down the line as the reader goes down the page and leaves the ruler behind it lit; when the reader turns back it
 * turns around on the spot, drawn anew pixel by pixel, and flies up. The tag beside it reads the flight in percent. The
 * parts of the page are squares on the line (the sections larger, the stages smaller) and the last of them, the quick
 * start, is the Earth. As the reader comes to a part the craft locks on it: corner marks the size of a bay for the
 * craft close in on its square once and its label takes the accent; the square is lit once the craft has docked there.
 * The labels are links on the left of the line, past the lane of the tag: the numbers of the sections next to the
 * line, their names before them and, under their names, the names of the stages, each shown from the margin that has room for it (the widths of the
 * names are measured, so every language shows what fits). A name that does not show appears beside the line while the
 * reader points at its mark or reaches it by the keyboard. Only the labels that show take rows, so a hidden name never
 * moves a number off its mark.
 *
 * @param props.waypoints - The parts of the page, from the top; the last one is the Earth.
 * @param props.measure - The measure of the page, or `null` before it.
 * @param props.here - The index of the waypoint the craft has locked on: the part the reader reads.
 * @param props.reached - The index of the last waypoint the craft has reached.
 * @param props.heading - Where the craft heads.
 * @param props.ariaLabel - The name of the navigation.
 * @param props.progressLabel - The name of the tag of the craft, a progress bar, for assistive technology.
 * @param props.top - Where the rail starts, in pixels from the top of the window: under the header.
 * @returns The rail.
 */
function FlightRail({
  waypoints,
  measure,
  here,
  reached,
  heading,
  ariaLabel,
  progressLabel,
  top,
}: {
  waypoints: readonly FlightWaypoint[];
  measure: FlightMeasure | null;
  here: number;
  reached: number;
  heading: FlightHeading;
  ariaLabel: string;
  progressLabel: string;
  top: number;
}) {
  const travel = measure?.railTravel ?? 0;
  const margin = measure?.margin ?? 0;
  const lastIndex = waypoints.length - 1;
  const tagShown = margin >= TAG_AT + TAG_WIDTH + 2;
  const numbersShown = margin >= LABELS_AT + NUMBER + CLEAR;
  const fits = (width: number | undefined) => !!width && margin >= NAMES_AT + width + CLEAR;
  const namesShown = numbersShown && fits(measure?.sectionNames);
  const stagesShown = namesShown && fits(measure?.stageNames);
  // Whether the label of a waypoint shows in the margin: its number or its name
  const labelled = (waypoint: FlightWaypoint) => (waypoint.kind === 'stage' ? stagesShown : numbersShown);

  // The middle of each mark, on whole pixels: where the middle of the craft is when it has reached the waypoint. The
  // last waypoint is the Earth, under the craft at the end of its flight
  const places = waypoints.map((_, index) =>
    index === lastIndex
      ? travel + EARTH_AFTER + EARTH_HALF
      : SHIP_HALF + Math.round((measure?.stops[index] ?? 0) * travel),
  );
  const middles = places.map((place, index) =>
    sharesMark(waypoints, places, index) ? (places[index - 1] as number) : place,
  );
  // The rows of the labels: beside their marks, unless two rows would overlap
  const spread = waypoints.flatMap((waypoint, index) => (labelled(waypoint) ? [index] : []));
  const spreadRows = spreadLabels(
    spread.map((index) => middles[index] as number),
    LABEL_ROW,
    LABEL_ROW / 2,
    travel + RAIL_FIXED - LABEL_ROW / 2,
  );
  const rows = middles.map((middle, index) => {
    const place = spread.indexOf(index);
    return place < 0 ? middle : Math.round(spreadRows[place] as number);
  });

  return (
    <nav
      data-flight-rail=""
      aria-label={ariaLabel}
      className="tuwadocs:pointer-events-none tuwadocs:fixed tuwadocs:right-0 tuwadocs:bottom-6 tuwadocs:z-20 tuwadocs:hidden tuwadocs:w-0 tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-300 tuwadocs:group-data-[ready]/flight:opacity-100 tuwadocs:motion-reduce:transition-none tuwadocs:xl:block tuwadocs:print:!hidden tuwadocs:[@media(max-height:599px)]:!hidden"
      style={{ top }}
    >
      {/* The names as the labels set them, out of sight: `useFlight` reads how wide the longest of each kind is */}
      <div
        aria-hidden="true"
        className="tuwadocs:invisible tuwadocs:absolute tuwadocs:top-0 tuwadocs:left-0 tuwadocs:font-mono tuwadocs:whitespace-nowrap tuwadocs:uppercase"
      >
        {waypoints.map((waypoint) => (
          <span
            key={waypoint.id}
            data-flight-name={waypoint.kind}
            className={`tuwadocs:absolute tuwadocs:top-0 tuwadocs:left-0 ${waypoint.kind === 'stage' ? stageNameClassName : sectionNameClassName}`}
          >
            {waypoint.name}
          </span>
        ))}
      </div>

      {/* The ruler, and over it the same ruler lit, as far as the craft has flown: all of it once it has arrived */}
      <div
        aria-hidden="true"
        className="tuwadocs:absolute tuwadocs:inset-y-0 tuwadocs:right-0"
        style={{ width: LINE + 1 }}
      >
        <Ruler travel={travel} colour="tuwadocs:bg-[var(--tuwa-border-strong)]" />
      </div>
      <div
        aria-hidden="true"
        className="tuwadocs:absolute tuwadocs:inset-y-0 tuwadocs:right-0 tuwadocs:group-data-[arrived]/flight:![clip-path:none]"
        style={{ width: LINE + 1, clipPath: `inset(0 0 calc(100% - var(--flight-y, 0px) - ${SHIP_HALF + 1}px) 0)` }}
      >
        <Ruler travel={travel} colour="tuwadocs:bg-[var(--tuwa-docs-lit)]" />
      </div>

      <Pixels art={EARTH} pixels={earthPixels} style={{ right: LINE - EARTH_HALF, bottom: EARTH_BAY }} />

      <ol className="tuwadocs:m-0 tuwadocs:list-none tuwadocs:p-0">
        {waypoints.map((waypoint, index) => {
          // Locked on: its part is being read. Reached: the craft has docked at its mark
          const isHere = index === here;
          const isReached = index <= reached;
          const state = isHere ? 'here' : isReached || index < here ? 'passed' : 'ahead';
          const isStage = waypoint.kind === 'stage';
          const isEarth = index === lastIndex;
          // A stage that starts where its section does (the first ledger of Packages) shares the mark of the section
          const shared = sharesMark(waypoints, places, index);
          const size = isStage && !shared ? STAGE_MARK : SECTION_MARK;
          const middle = middles[index] as number;
          const row = rows[index] as number;
          const shift = middle - row;
          // The name shows in the margin where it has room; elsewhere beside the line, while the mark is pointed at
          const nameShown = isStage ? stagesShown : namesShown;
          const leaderShown = labelled(waypoint);
          // What the leader starts after: the mark, or the corner marks of the Earth
          const markEnd = isEarth ? LINE + EARTH_HALF + 1 + EARTH_BAY : LINE + (size + 1) / 2;
          // The bay the craft docks in: its own size around a mark, the size of the Earth around the Earth
          const bay = isEarth ? EARTH_HALF + EARTH_BAY : SHIP_HALF + BAY;
          const text = waypoint.number ? `${waypoint.number} ${waypoint.name}` : waypoint.name;

          return (
            <li
              key={waypoint.id}
              className="tuwadocs:absolute tuwadocs:h-[18px] tuwadocs:w-0"
              style={{ right: CLEAR, top: row - LABEL_ROW / 2 }}
            >
              <a
                href={`#${waypoint.id}`}
                aria-label={text}
                aria-current={isHere ? 'location' : undefined}
                className={`tuwadocs:group/waypoint tuwadocs:pointer-events-auto tuwadocs:absolute tuwadocs:inset-y-0 tuwadocs:right-0 tuwadocs:flex tuwadocs:items-center tuwadocs:justify-end tuwadocs:font-mono tuwadocs:leading-none tuwadocs:whitespace-nowrap tuwadocs:uppercase tuwadocs:transition-colors ${labelColour(state)}`}
                style={{ minWidth: LABELS_AT - CLEAR, paddingRight: (isStage ? NAMES_AT : LABELS_AT) - CLEAR }}
              >
                {nameShown && (
                  <span className={isStage ? stageNameClassName : sectionNameClassName}>{waypoint.name}</span>
                )}
                {/* The number stands next to the line. A part without one keeps its place: its name ends where the
                    names above it end */}
                {!isStage && numbersShown && (
                  <span
                    className="tuwadocs:text-right tuwadocs:text-[11px] tuwadocs:font-medium tuwadocs:tracking-[0.04em]"
                    style={{ width: NUMBER + 8 }}
                  >
                    {waypoint.number}
                  </span>
                )}

                {/* The leader from the mark to its label, across the lane of the tag */}
                {leaderShown && (
                  <span
                    aria-hidden="true"
                    className="tuwadocs:absolute tuwadocs:h-px tuwadocs:bg-[var(--tuwa-border-primary)]"
                    style={{
                      right: markEnd + 2 - CLEAR,
                      width: LABELS_AT - 4 - markEnd - 2,
                      top: LABEL_ROW / 2 + shift,
                    }}
                  />
                )}
                {leaderShown && shift !== 0 && (
                  <span
                    aria-hidden="true"
                    className="tuwadocs:absolute tuwadocs:w-px tuwadocs:bg-[var(--tuwa-border-primary)]"
                    style={{
                      right: LABELS_AT - 5 - CLEAR,
                      top: LABEL_ROW / 2 + Math.min(0, shift),
                      height: Math.abs(shift) + 1,
                    }}
                  />
                )}

                {!isEarth && !shared && (
                  <span
                    aria-hidden="true"
                    className={`tuwadocs:absolute tuwadocs:border tuwadocs:transition-colors tuwadocs:duration-200 tuwadocs:motion-reduce:transition-none ${markColour(isReached)}`}
                    style={{
                      right: LINE - (size - 1) / 2 - CLEAR,
                      top: LABEL_ROW / 2 + shift - (size - 1) / 2,
                      width: size,
                      height: size,
                    }}
                  />
                )}
                {/* The bay around the mark the craft has locked on: its corner marks close in once */}
                {isHere && (
                  <CornerMarks
                    width={2 * bay + 1}
                    height={2 * bay + 1}
                    arm={6}
                    className="tuwa-flight-lock tuwadocs:absolute tuwadocs:text-[var(--tuwa-docs-lit)]"
                    style={{ right: LINE - bay - CLEAR, top: LABEL_ROW / 2 + shift - bay }}
                  />
                )}

                {/* The name beside the line, where the margin has no room for it */}
                {!nameShown && (
                  <span
                    aria-hidden="true"
                    className="tuwadocs:pointer-events-none tuwadocs:absolute tuwadocs:-translate-y-1/2 tuwadocs:border tuwadocs:border-[var(--tuwa-border-strong)] tuwadocs:bg-[var(--tuwa-docs-raised)] tuwadocs:px-2 tuwadocs:py-1.5 tuwadocs:text-[11px] tuwadocs:font-bold tuwadocs:tracking-[0.12em] tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-150 tuwadocs:group-hover/waypoint:opacity-100 tuwadocs:group-focus-visible/waypoint:opacity-100 tuwadocs:motion-reduce:transition-none"
                    style={{ right: (numbersShown ? NAMES_AT : LABELS_AT) - CLEAR, top: LABEL_ROW / 2 }}
                  >
                    {numbersShown && !isStage ? waypoint.name : text}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ol>

      {/* The craft: its hull moves down the line; its flames and its exhaust are behind it, whichever way it heads */}
      <div
        className="tuwadocs:absolute tuwadocs:top-0"
        style={{ right: LINE - SHIP_HALF, width: SHIP, height: SHIP, transform: 'translateY(var(--flight-y, 0px))' }}
      >
        <svg
          viewBox={`0 0 ${SHIP} ${SHIP_EXHAUST_LENGTH}`}
          width={SHIP}
          height={SHIP_EXHAUST_LENGTH}
          aria-hidden="true"
          focusable="false"
          shapeRendering="crispEdges"
          className="tuwadocs:absolute tuwadocs:left-0 tuwadocs:max-w-none tuwadocs:fill-[var(--tuwa-docs-lit)] tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-[420ms] tuwadocs:group-data-[moving]/flight:opacity-100 tuwadocs:motion-reduce:transition-none"
          style={{ top: heading === 'ahead' ? -FLAMES - SHIP_EXHAUST_LENGTH : SHIP + FLAMES }}
        >
          {SHIP_EXHAUST.map(([x, distance, side, opacity]) => (
            <rect
              key={`${x}-${distance}`}
              x={x}
              y={heading === 'ahead' ? SHIP_EXHAUST_LENGTH - distance - side : distance}
              width={side}
              height={side}
              fillOpacity={opacity}
            />
          ))}
        </svg>
        {/* A new picture for each heading: its pixels fly in, so the craft turns around pixel by pixel. Its flames are
            above its hull when it heads down the page, under it when it heads up */}
        <Pixels
          key={heading}
          art={RAIL_SHIP[heading]}
          pixels={shipPixels}
          assemble
          style={{ left: 0, top: heading === 'ahead' ? -FLAMES : 0 }}
        />
        {tagShown && (
          <>
            <span
              aria-hidden="true"
              className="tuwadocs:absolute tuwadocs:h-px tuwadocs:w-[5px] tuwadocs:bg-[var(--tuwa-docs-lit)]"
              style={{ right: SHIP, top: SHIP_HALF }}
            />
            <span
              role="progressbar"
              aria-label={progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              className="tuwadocs:absolute tuwadocs:flex tuwadocs:h-[18px] tuwadocs:items-center tuwadocs:gap-px tuwadocs:border tuwadocs:border-[var(--tuwa-docs-lit)] tuwadocs:bg-[var(--tuwa-docs-paper)] tuwadocs:px-1 tuwadocs:font-mono tuwadocs:text-[10px] tuwadocs:leading-none tuwadocs:font-bold tuwadocs:tracking-[0.02em] tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:tabular-nums"
              style={{ right: SHIP + 5, top: SHIP_HALF - 8 }}
            >
              <span data-flight-percent="">000</span>
              <span className="tuwadocs:font-medium tuwadocs:text-[var(--tuwa-text-secondary)]">%</span>
            </span>
          </>
        )}
      </div>
    </nav>
  );
}

/**
 * The strip of the flight plan, below 1280px, where the page has no margin for the rail: the line under the header is
 * its track and it takes no room of its own. The craft flies along the line from the left edge of the screen to the
 * Earth at the right one, nose first, and leaves the line behind it lit; when the reader turns back it turns around,
 * drawn anew pixel by pixel. The sections are squares on the line and the stages dots, lit once reached. The bar of the
 * section under the header names where the reader is, so the strip has no labels.
 *
 * @param props.waypoints - The parts of the page, from the top; the last one is the Earth.
 * @param props.measure - The measure of the page, or `null` before it.
 * @param props.reached - The index of the last waypoint the craft has reached.
 * @param props.heading - Where the craft heads.
 * @param props.progressLabel - The name of the strip, a progress bar, for assistive technology.
 * @param props.top - Where the line of the header is, in pixels from the top of the window.
 * @returns The strip.
 */
function FlightStrip({
  waypoints,
  measure,
  reached,
  heading,
  progressLabel,
  top,
}: {
  waypoints: readonly FlightWaypoint[];
  measure: FlightMeasure | null;
  reached: number;
  heading: FlightHeading;
  progressLabel: string;
  top: number;
}) {
  const travel = measure?.stripTravel ?? 0;
  const middle = STRIP_SHIP_LENGTH / 2;
  const places = waypoints.map((_, index) => middle + Math.round((measure?.stops[index] ?? 0) * travel));

  return (
    <div
      data-flight-strip=""
      role="progressbar"
      aria-label={progressLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="tuwadocs:pointer-events-none tuwadocs:fixed tuwadocs:inset-x-0 tuwadocs:z-[55] tuwadocs:h-0 tuwadocs:opacity-0 tuwadocs:transition-opacity tuwadocs:duration-300 tuwadocs:group-data-[ready]/flight:opacity-100 tuwadocs:motion-reduce:transition-none tuwadocs:xl:hidden tuwadocs:print:hidden"
      style={{ top }}
    >
      <span
        aria-hidden="true"
        className="tuwadocs:absolute tuwadocs:-top-px tuwadocs:left-0 tuwadocs:h-px tuwadocs:w-full tuwadocs:bg-[var(--tuwa-docs-lit)] tuwadocs:group-data-[arrived]/flight:![clip-path:none]"
        style={{ clipPath: `inset(0 calc(100% - var(--flight-x, 0px) - ${middle}px) 0 0)` }}
      />
      {waypoints.map((waypoint, index) => {
        // The craft starts at the first waypoint, and the last one is the Earth
        if (index === 0 || index === waypoints.length - 1 || sharesMark(waypoints, places, index)) return null;
        const size = waypoint.kind === 'stage' ? 3 : 5;
        return (
          <span
            key={waypoint.id}
            aria-hidden="true"
            className={`tuwadocs:absolute tuwadocs:border tuwadocs:transition-colors tuwadocs:duration-200 tuwadocs:motion-reduce:transition-none ${markColour(index <= reached)}`}
            style={{
              left: (places[index] as number) - (size + 1) / 2,
              top: -(size + 1) / 2,
              width: size,
              height: size,
            }}
          />
        );
      })}
      <Pixels
        art={EARTH_SMALL}
        pixels={earthPixels}
        cell={STRIP_CELL}
        className="tuwadocs:right-1"
        style={{ top: -STRIP_EARTH / 2 }}
      />
      <span
        className="tuwadocs:absolute tuwadocs:left-0"
        style={{
          top: -STRIP_SHIP_HEIGHT / 2,
          width: STRIP_SHIP_LENGTH,
          height: STRIP_SHIP_HEIGHT,
          transform: 'translateX(var(--flight-x, 0px))',
        }}
      >
        {/* Its flames are behind it: on its left when it heads to the Earth, on its right when it heads back */}
        <Pixels
          key={heading}
          art={STRIP_SHIP[heading]}
          pixels={shipPixels}
          cell={STRIP_CELL}
          assemble
          style={{ top: 0, left: heading === 'ahead' ? -STRIP_FLAMES : 0 }}
        />
      </span>
    </div>
  );
}

/**
 * The flight plan of a page: the page as one flight, from its top to its last waypoint, the Earth, where the reader
 * starts building. The reader who goes down the page flies a pixel spacecraft down a ruler in the right margin of the
 * page (from 1280px, where a page has a margin beside its column) or along the line under the header (narrower); going
 * back up the page turns the craft around. The waypoints are the parts of the page, each an element with its `id`; the
 * part the reader reads takes `data-flight="here"`. The craft follows the scroll eased, its flames burning only while it
 * moves; for reduced motion it is where the scroll is at once, with no flames and no pixels in flight.
 *
 * Place it outside the content of the page, which lies under the header: so its strip lies over the line of the
 * header. The page needs the paper and ink of `site.css` and a fixed header of `headerHeight`.
 *
 * Side effects: scroll and resize listeners on the window, a `ResizeObserver` on the body and on its tracks, a listener
 * on the reduced-motion media query; it writes custom properties and attributes on its own root and
 * `data-flight="here"` on the part of the page the reader reads, outside React.
 *
 * @param props - See {@link FlightPlanProps}.
 * @returns The rail and the strip; CSS shows the one the width of the screen has room for.
 */
export function FlightPlan({ waypoints, labels, columnClassName = HUB_COLUMN, headerHeight = 56 }: FlightPlanProps) {
  const { rootRef, measure, here, reached, heading } = useFlight(
    waypoints.map((waypoint) => waypoint.id),
    { rail: RAIL_FIXED, strip: STRIP_FIXED },
  );

  return (
    <div ref={rootRef} className="tuwadocs:group/flight">
      {/* As wide as the column of the page and in its place: from its right edge to that of the screen is the margin
          the rail has */}
      <div
        data-flight-column=""
        aria-hidden="true"
        className={`tuwadocs:pointer-events-none tuwadocs:invisible tuwadocs:fixed tuwadocs:inset-x-0 tuwadocs:top-0 tuwadocs:mx-auto tuwadocs:h-0 tuwadocs:w-full ${columnClassName}`}
      />
      <FlightRail
        waypoints={waypoints}
        measure={measure}
        here={here}
        reached={reached}
        heading={heading}
        ariaLabel={labels.ariaLabel}
        progressLabel={labels.progressLabel}
        top={headerHeight + RAIL_BELOW_HEADER}
      />
      <FlightStrip
        waypoints={waypoints}
        measure={measure}
        reached={reached}
        heading={heading}
        progressLabel={labels.progressLabel}
        top={headerHeight}
      />
    </div>
  );
}
