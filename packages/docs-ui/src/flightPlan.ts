/**
 * @file The flight plan of a page (`FlightPlan`), as numbers: how far the reader has scrolled on the way to the last waypoint,
 * where on that way each part of the page starts, which part the craft has reached, how the craft eases after the
 * scroll, when it turns around and where the labels of the parts stand so that none covers another. Pure functions: the
 * browser is read and written in `useFlight`.
 */

/** How close to a waypoint the craft counts as there: a quarter of a percent of the flight (a pixel or two of it). */
export const WAYPOINT_REACH = 0.0025;

/** Within this much of its target the craft is there: less than a tenth of a pixel on the longest flight. */
const SETTLED = 0.0001;

/** The time, in milliseconds, in which the craft covers about two thirds of what is left to its target. */
const EASE_MS = 90;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The least way, in pixels of its track, that turns the craft around. */
const TURN_AFTER = 2;

/**
 * The scroll position at which the flight is over: where a link to the last waypoint leaves the page. The last
 * waypoint is the finish, so the craft is there when its part is at its place under the header, and stays there while
 * the reader goes on to the end of the page.
 *
 * @param parts - The parts of the page that are waypoints, in the order of the page.
 * @param parts[].top - The top of the part from the top of the page, in pixels.
 * @param parts[].margin - Its `scroll-margin-top`, in pixels.
 * @param maxScroll - The largest scroll position of the page (its height less the height of the window).
 * @returns The scroll position, from 0 to `maxScroll`; `maxScroll` for a page without waypoints.
 */
export function flightEnd(parts: readonly { top: number; margin: number }[], maxScroll: number): number {
  const limit = Math.max(0, maxScroll);
  const last = parts[parts.length - 1];
  return last ? clamp(last.top - last.margin, 0, limit) : limit;
}

/**
 * The flight so far: the scroll position as a share of the way to the end of the flight.
 *
 * @param scrollTop - The scroll position of the page, in pixels.
 * @param end - The scroll position at which the flight is over ({@link flightEnd}).
 * @returns From 0 (the top of the page) to 1 (the end of the flight and beyond); 0 for a page that does not scroll.
 */
export function flightProgress(scrollTop: number, end: number): number {
  return end > 0 ? clamp(scrollTop / end, 0, 1) : 0;
}

/**
 * Whether the craft heads back, up the page, after a move of the scroll. It turns to where the scroll has gone once
 * that is a way it can show, 2px of its track or more; a smaller move, or none, keeps its heading, so a scroll that
 * trembles does not spin it.
 *
 * @param back - Whether the craft heads back now.
 * @param shown - Where the craft is, from 0 to 1.
 * @param target - Where the scroll is, from 0 to 1.
 * @param travel - The length of the track of the craft, in pixels.
 * @returns `true` when the craft heads back, `false` when it heads ahead.
 */
export function turnsBack(back: boolean, shown: number, target: number, travel: number): boolean {
  const way = (target - shown) * travel;
  if (way >= TURN_AFTER) return false;
  if (way <= -TURN_AFTER) return true;
  return back;
}

/**
 * Where on the flight each part of the page starts: the flight at which a link to the part leaves the page, so the
 * craft stands at a waypoint exactly when the reader has jumped to its part. The last part stands at 1, the end of the
 * flight, and no part stands before the part above it.
 *
 * @param parts - The parts in the order of the page.
 * @param parts[].top - The top of the part from the top of the page, in pixels.
 * @param parts[].margin - Its `scroll-margin-top`, in pixels.
 * @param end - The scroll position at which the flight is over ({@link flightEnd}).
 * @returns The flight of each part, from 0 to 1, never falling.
 */
export function waypointStops(parts: readonly { top: number; margin: number }[], end: number): number[] {
  let before = 0;
  return parts.map(({ top, margin }) => {
    before = Math.max(before, flightProgress(top - margin, end));
    return before;
  });
}

/** Where on the window the reader reads: a part that has come up to 40% of its height is the part being read. */
export const READING_LINE = 0.4;

/**
 * Where on the flight the reader starts to read each part of the page: the flight at which the top of the part comes
 * up to the reading line of the window, {@link READING_LINE} of its height from the top. It is the stop of the part
 * ({@link waypointStops}) or earlier, never later: the craft locks on a waypoint as it comes near, and reaches it when
 * the part is at its place under the header.
 *
 * @param parts - The parts in the order of the page, as for {@link waypointStops}.
 * @param parts[].top - The top of the part from the top of the page, in pixels.
 * @param parts[].margin - Its `scroll-margin-top`, in pixels.
 * @param end - The scroll position at which the flight is over ({@link flightEnd}).
 * @param windowHeight - The height of the window, in pixels.
 * @returns The flight of each part, from 0 to 1, never falling.
 */
export function readingStops(
  parts: readonly { top: number; margin: number }[],
  end: number,
  windowHeight: number,
): number[] {
  return waypointStops(
    parts.map(({ top, margin }) => ({ top, margin: Math.max(margin, windowHeight * READING_LINE) })),
    end,
  );
}

/**
 * The waypoint the craft is at or has last passed.
 *
 * @param stops - The progress of each waypoint, never falling ({@link waypointStops} or {@link readingStops}).
 * @param progress - The flight so far.
 * @returns The index of the waypoint, or -1 before the first one.
 */
export function activeWaypoint(stops: readonly number[], progress: number): number {
  let active = -1;
  for (let index = 0; index < stops.length; index++)
    if ((stops[index] as number) <= progress + WAYPOINT_REACH) active = index;
  return active;
}

/**
 * The next place of the craft on its way to where the scroll is: it covers a share of what is left that grows with the
 * time since its last place, so it starts fast and settles softly, at the same pace on any screen.
 *
 * @param shown - Where the craft is, from 0 to 1.
 * @param target - Where the scroll is, from 0 to 1.
 * @param elapsed - The time since the last place, in milliseconds.
 * @returns The new place; the target itself once the craft is within a hair of it.
 */
export function approach(shown: number, target: number, elapsed: number): number {
  const next = shown + (target - shown) * (1 - Math.exp(-Math.max(0, elapsed) / EASE_MS));
  return Math.abs(target - next) < SETTLED ? target : next;
}

/**
 * The flight in whole percent, for the tag of the craft and assistive technology.
 *
 * @param progress - The flight so far, from 0 to 1.
 * @returns From 0 to 100.
 */
export function flightPercent(progress: number): number {
  return Math.round(clamp(progress, 0, 1) * 100);
}

/**
 * The places of the labels of the waypoints along the track: each as near to its waypoint as it can be while every
 * two neighbours keep `gap` apart and all stay on the track. Labels that would overlap move apart around the middle of
 * their waypoints, in the order of the waypoints. When the track is too short for the gap, the labels share it evenly.
 *
 * @param places - The places of the waypoints along the track, rising, in pixels.
 * @param gap - The least distance between two neighbouring labels, in pixels.
 * @param from - The start of the track.
 * @param to - The end of the track.
 * @returns The place of each label, rising.
 */
export function spreadLabels(places: readonly number[], gap: number, from: number, to: number): number[] {
  const count = places.length;
  if (count === 0) return [];
  const room = Math.max(0, to - from);
  const step = count > 1 ? Math.min(gap, room / (count - 1)) : 0;

  // Groups of labels that touch: each holds its first place and how many labels it has, a step apart
  const groups: { start: number; size: number; wanted: number }[] = [];
  const settle = (group: { start: number; size: number; wanted: number }) => {
    // The group around the middle of its waypoints, on the track
    group.start = clamp(group.wanted / group.size - ((group.size - 1) * step) / 2, from, to - (group.size - 1) * step);
  };
  for (const place of places) {
    const group = { start: 0, size: 1, wanted: place };
    settle(group);
    groups.push(group);
    // A group that reaches into the one before it joins it
    while (groups.length > 1) {
      const last = groups[groups.length - 1] as (typeof groups)[number];
      const previous = groups[groups.length - 2] as (typeof groups)[number];
      if (previous.start + previous.size * step <= last.start + 1e-9) break;
      previous.wanted += last.wanted;
      previous.size += last.size;
      settle(previous);
      groups.pop();
    }
  }
  return groups.flatMap((group) => Array.from({ length: group.size }, (_, index) => group.start + index * step));
}

/** The place of the link of a waypoint along the track: where it starts and how tall it is, in whole pixels. */
export interface FlightLinkBox {
  /** The top of the link */
  top: number;
  /** Its height */
  height: number;
}

/**
 * The places of the links of the waypoints along the track, so that every link is a pointer target of its own: a row
 * tall wherever the links next to it leave the room, and never over the link of another waypoint.
 *
 * A link with a label stands around the middle of its row, a row tall; only labels whose rows are nearer than a row (a
 * track too short for them) get what lies between their rows. A link without a label keeps to its mark: it takes the
 * row around the mark, ends at the link of a label and half way to the next mark without a label, and where one side
 * is cut short it reaches as far to the other side, so two marks a few pixels apart still get a row each. Waypoints on
 * one row (a stage that shares the mark of its section) are one place and get one link box.
 *
 * @param rows - The middle of the row of each waypoint, in whole pixels.
 * @param labelled - Whether the label of each waypoint shows in the margin.
 * @param row - The height of a row, in pixels: the most a link takes.
 * @returns The place of the link of each waypoint; its height is from 1 to `row`.
 */
export function linkBoxes(rows: readonly number[], labelled: readonly boolean[], row: number): FlightLinkBox[] {
  const half = Math.floor(row / 2);
  const ascending = (a: number, b: number) => a - b;

  // The links with labels: their text stands in the middle of the link, so the link stays around its row
  const labelRows = [...new Set(rows.filter((_, index) => labelled[index]))].sort(ascending);
  const fixed = new Map<number, FlightLinkBox>();
  labelRows.forEach((place, index) => {
    const nearest = Math.min(
      row,
      place - (labelRows[index - 1] ?? -Infinity),
      (labelRows[index + 1] ?? Infinity) - place,
    );
    const height = Math.max(1, Math.floor(nearest));
    fixed.set(place, { top: place - Math.floor(height / 2), height });
  });

  // The links without labels: between the links with labels and the middles to the marks next to them
  const freeRows = [...new Set(rows.filter((place) => !fixed.has(place)))].sort(ascending);
  const free = new Map<number, FlightLinkBox>();
  freeRows.forEach((place, index) => {
    const before = freeRows[index - 1];
    const after = freeRows[index + 1];
    let from = before === undefined ? -Infinity : Math.ceil((before + place) / 2);
    let to = after === undefined ? Infinity : Math.ceil((place + after) / 2);
    for (const [labelRow, box] of fixed) {
      if (labelRow < place) from = Math.max(from, box.top + box.height);
      else to = Math.min(to, box.top);
    }
    // The row around the mark; cut short on one side, it reaches as far to the other
    const start = Math.max(from, place - half);
    const end = Math.min(to, start + row);
    const top = Math.max(from, end - row);
    // No room at all between the links around it: a line on its mark, which is a part of the link itself
    free.set(place, end - top >= 1 ? { top, height: end - top } : { top: place, height: 1 });
  });

  return rows.map((place) => (fixed.get(place) ?? free.get(place)) as FlightLinkBox);
}
