import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  EARTH,
  EARTH_SMALL,
  RAIL_SHIP,
  SHIP_EXHAUST,
  SHIP_EXHAUST_LENGTH,
  SHIP_FLAME_CELLS,
  STRIP_SHIP,
} from '../components/flight/flightArt';
import { HomeFlightPlan } from '../components/home/HomeFlightPlan';
import { en, I18nProvider, uk, zhCN } from '../i18n';
import {
  activeWaypoint,
  approach,
  flightEnd,
  flightPercent,
  flightProgress,
  READING_LINE,
  readingStops,
  spreadLabels,
  turnsBack,
  WAYPOINT_REACH,
  waypointStops,
} from './flightPlan';

// The flight plan of the main page: a pixel spacecraft that flies with the scroll, down a ruler in the left margin of
// the page from 1280px and along the line under the header on narrower screens, past the parts of the page to the Earth

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const plan = read('components/flight/FlightPlan.tsx');
const homePlan = read('components/home/HomeFlightPlan.tsx');
const hook = read('components/flight/useFlight.ts');
const page = read('app/(default)/(home)/page.tsx');
const footer = read('components/Footer.tsx');
const shell = read('components/HubShell.tsx');
const globals = read('app/globals.css');
const render = (locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(createElement(I18nProvider, { initialLocale: locale, children: createElement(HomeFlightPlan) }));

describe('the end of the flight', () => {
  const parts = [
    { top: 56, margin: 96 },
    { top: 900, margin: 56 },
    { top: 5200, margin: 56 },
  ];

  // The quick start is the finish: the craft is at the Earth when that section is at its place, not at the end of the
  // footer under it
  it('is where a link to the last waypoint leaves the page', () => {
    expect(flightEnd(parts, 6000)).toBe(5200 - 56);
    const end = flightEnd(parts, 6000);
    expect(waypointStops(parts, end).at(-1)).toBe(1);
    expect(flightProgress(end, end)).toBe(1);
    // The reader goes on to the end of the page: the craft stays at the Earth
    expect(flightProgress(6000, end)).toBe(1);
  });

  it('is within the scroll of the page', () => {
    expect(flightEnd(parts, 4000)).toBe(4000);
    expect(flightEnd([{ top: 20, margin: 96 }], 4000)).toBe(0);
    expect(flightEnd(parts, -10)).toBe(0);
    expect(flightEnd([], 4000)).toBe(4000);
  });
});

describe('the flight so far', () => {
  it('is the scroll as a share of the way to the end of the flight', () => {
    expect(flightProgress(0, 4000)).toBe(0);
    expect(flightProgress(1000, 4000)).toBe(0.25);
    expect(flightProgress(4000, 4000)).toBe(1);
  });

  // The rubber band of a touch scroll goes past both ends, and a short page does not scroll at all
  it('stays between 0 and 1, and is 0 for a page that does not scroll', () => {
    expect(flightProgress(-80, 4000)).toBe(0);
    expect(flightProgress(4200, 4000)).toBe(1);
    expect(flightProgress(0, 0)).toBe(0);
    expect(flightProgress(10, -5)).toBe(0);
  });

  it('reads in whole percent', () => {
    expect(flightPercent(0)).toBe(0);
    expect(flightPercent(0.424)).toBe(42);
    expect(flightPercent(0.996)).toBe(100);
    expect(flightPercent(1.2)).toBe(100);
  });
});

describe('the stops of the waypoints', () => {
  const maxScroll = 6000;
  const parts = [
    { top: 56, margin: 96 }, // the overview: under the header
    { top: 900, margin: 56 }, // a section
    { top: 2400, margin: 56 }, // the section of the packages
    { top: 2448, margin: 120 }, // its first stage: it starts where the section does
    { top: 3600, margin: 120 },
    { top: 5200, margin: 56 },
  ];
  const stops = waypointStops(parts, maxScroll);

  // The craft stands at a waypoint exactly when a link to its part has scrolled the page there
  it('are where a link to the part leaves the page', () => {
    expect(stops[0]).toBe(0);
    expect(stops[1]).toBeCloseTo((900 - 56) / maxScroll, 10);
    expect(stops[4]).toBeCloseTo((3600 - 120) / maxScroll, 10);
  });

  // The first stage starts a few pixels before its section is at its place: it must not stand under the section
  it('never fall: a part stands at or after the part above it', () => {
    for (let index = 1; index < stops.length; index++)
      expect(stops[index]).toBeGreaterThanOrEqual(stops[index - 1] as number);
    expect(stops[3]).toBe(stops[2]);
  });

  it('end at 1 for a part the end of the page keeps from its place', () => {
    const short = waypointStops([...parts, { top: 6400, margin: 56 }], maxScroll);
    expect(short.at(-1)).toBe(1);
    expect(Math.max(...short)).toBe(1);
  });

  it('are all 0 on a page that does not scroll', () => {
    expect(waypointStops(parts, 0)).toEqual(parts.map(() => 0));
  });

  it('name the waypoint the craft is at or has last passed', () => {
    expect(activeWaypoint(stops, 0)).toBe(0);
    expect(activeWaypoint(stops, (stops[1] as number) - 0.01)).toBe(0);
    expect(activeWaypoint(stops, stops[1] as number)).toBe(1);
    // A pixel short of the stop is there: the eased craft and a rounded scroll position stop a hair before it
    expect(activeWaypoint(stops, (stops[1] as number) - WAYPOINT_REACH / 2)).toBe(1);
    // The section of the packages and its first stage share a stop: the stage, the later of the two, is the one
    expect(activeWaypoint(stops, stops[2] as number)).toBe(3);
    expect(activeWaypoint(stops, 1)).toBe(stops.length - 1);
    expect(activeWaypoint([0.2, 0.5], 0.1)).toBe(-1);
  });
});

describe('the reading stops of the waypoints', () => {
  const maxScroll = 6000;
  const windowHeight = 1000;
  const parts = [
    { top: 56, margin: 96 },
    { top: 900, margin: 56 },
    { top: 2400, margin: 56 },
    { top: 2448, margin: 120 },
    { top: 5900, margin: 56 },
  ];
  const stops = waypointStops(parts, maxScroll);
  const reads = readingStops(parts, maxScroll, windowHeight);

  // The number of a stage took the accent only when its heading was at the top of the window, about to leave it: the
  // craft locks on a part when the reader comes to it, and reaches it when the part is at its place
  it('are where the part comes up to the reading line of the window', () => {
    expect(READING_LINE).toBeGreaterThan(0.25);
    expect(READING_LINE).toBeLessThan(0.5);
    expect(reads[0]).toBe(0);
    expect(reads[1]).toBeCloseTo((900 - windowHeight * READING_LINE) / maxScroll, 10);
    expect(reads[3]).toBeCloseTo((2448 - windowHeight * READING_LINE) / maxScroll, 10);
  });

  it('are never after the stops: the craft locks on a waypoint before it reaches it', () => {
    reads.forEach((read, index) => expect(read).toBeLessThanOrEqual(stops[index] as number));
    for (let index = 1; index < reads.length; index++)
      expect(reads[index]).toBeGreaterThanOrEqual(reads[index - 1] as number);
    // On the way to a part the craft has locked on it and not yet reached it
    const between = ((reads[1] as number) + (stops[1] as number)) / 2;
    expect(activeWaypoint(reads, between)).toBe(1);
    expect(activeWaypoint(stops, between)).toBe(0);
  });

  // In a low window the margin of a part is below the reading line: the part is read where a link brings it
  it('are the stops themselves where the reading line is above the place of the part', () => {
    expect(readingStops(parts, maxScroll, 100)).toEqual(stops);
  });

  it('end at 1 with the page', () => {
    expect(readingStops([...parts, { top: 7600, margin: 56 }], maxScroll, windowHeight).at(-1)).toBe(1);
  });
});

describe('the ease of the craft', () => {
  it('goes toward the scroll and never past it', () => {
    let shown = 0;
    for (let step = 0; step < 20; step++) {
      const next = approach(shown, 0.8, 16);
      expect(next).toBeGreaterThan(shown);
      expect(next).toBeLessThanOrEqual(0.8);
      shown = next;
      if (shown === 0.8) break;
    }
  });

  it('arrives: it is exactly at the scroll in the end', () => {
    let shown = 0.1;
    let steps = 0;
    while (shown !== 0.9 && steps < 200) {
      shown = approach(shown, 0.9, 16);
      steps++;
    }
    expect(shown).toBe(0.9);
    expect(steps).toBeLessThan(120);
    expect(approach(0.5, 0.5, 16)).toBe(0.5);
  });

  // The same flight on a screen of 60Hz and of 120Hz
  it('keeps its pace whatever the frame rate', () => {
    const once = approach(0, 1, 16);
    const twice = approach(approach(0, 1, 8), 1, 8);
    expect(twice).toBeCloseTo(once, 10);
    expect(approach(0.3, 0.7, 0)).toBe(0.3);
    expect(approach(0.3, 0.7, -5)).toBe(0.3);
  });

  it('flies down as it flies up', () => {
    expect(approach(0.8, 0.2, 16)).toBeLessThan(0.8);
    expect(approach(0.8, 0.2, 16)).toBeGreaterThan(0.2);
  });
});

describe('the turn of the craft', () => {
  const travel = 600;

  it('heads where the scroll has gone', () => {
    expect(turnsBack(false, 0.5, 0.4, travel)).toBe(true);
    expect(turnsBack(true, 0.4, 0.5, travel)).toBe(false);
    expect(turnsBack(false, 0.4, 0.5, travel)).toBe(false);
    expect(turnsBack(true, 0.5, 0.4, travel)).toBe(true);
  });

  // A scroll that trembles by a pixel, or a craft at rest, must not spin the craft: every turn draws it anew
  it('keeps its heading for a way too short to show, or none', () => {
    const hair = 1 / travel;
    expect(turnsBack(false, 0.5, 0.5 - hair, travel)).toBe(false);
    expect(turnsBack(true, 0.5, 0.5 + hair, travel)).toBe(true);
    expect(turnsBack(true, 0.5, 0.5, travel)).toBe(true);
    expect(turnsBack(false, 0.5, 0.5, travel)).toBe(false);
    // Before the tracks are measured there is no way to show
    expect(turnsBack(false, 0.9, 0.1, 0)).toBe(false);
  });

  // At the Earth the flight stays at 1 while the reader reads on: the craft keeps heading to it
  it('does not turn at the end of the flight while the reader goes on down the page', () => {
    expect(turnsBack(false, 1, 1, travel)).toBe(false);
    expect(turnsBack(false, 1, 0.95, travel)).toBe(true);
  });
});

describe('the rows of the labels', () => {
  const apart = (rows: number[], gap: number) => {
    for (let index = 1; index < rows.length; index++)
      expect((rows[index] as number) - (rows[index - 1] as number)).toBeGreaterThanOrEqual(gap - 1e-6);
  };

  it('stand beside their waypoints when these are apart', () => {
    expect(spreadLabels([40, 120, 300], 18, 0, 600)).toEqual([40, 120, 300]);
  });

  it('move apart around the middle of waypoints that are too close, in their order', () => {
    const rows = spreadLabels([100, 104, 300], 18, 0, 600);
    apart(rows, 18);
    expect((rows[0] as number) + (rows[1] as number)).toBeCloseTo(204, 6);
    expect(rows[2]).toBe(300);
  });

  it('never overlap, whatever the waypoints', () => {
    for (const places of [
      [10, 12, 14, 16, 18, 400],
      [0, 0, 0, 0],
      [590, 595, 598, 600],
      [5, 200, 205, 210, 215, 220, 598],
      [300, 300, 300, 300, 300, 300, 300, 300],
    ]) {
      const rows = spreadLabels(places, 18, 20, 580);
      expect(rows).toHaveLength(places.length);
      apart(rows, 18);
      expect(rows[0]).toBeGreaterThanOrEqual(20 - 1e-6);
      expect(rows.at(-1)).toBeLessThanOrEqual(580 + 1e-6);
    }
  });

  // A window too short for every label: they share what there is, in order, on the track
  it('share a track that is too short', () => {
    const rows = spreadLabels([10, 20, 30, 40, 50], 18, 0, 40);
    expect(rows).toEqual([0, 10, 20, 30, 40]);
    expect(spreadLabels([], 18, 0, 100)).toEqual([]);
    expect(spreadLabels([700], 18, 0, 100)).toEqual([100]);
  });
});

describe('the pixel pictures', () => {
  const pictures = {
    'the craft of the rail, ahead': RAIL_SHIP.ahead,
    'the craft of the rail, back': RAIL_SHIP.back,
    'the craft of the strip, ahead': STRIP_SHIP.ahead,
    'the craft of the strip, back': STRIP_SHIP.back,
    'the Earth': EARTH,
    'the small Earth': EARTH_SMALL,
  };

  it.each(Object.entries(pictures))('%s is a rectangle of known pixels', (_, art) => {
    for (const row of art) {
      expect(row).toHaveLength((art[0] as string).length);
      expect(row).toMatch(/^[.#oAb]+$/);
    }
  });

  // A picture with an even number of cells has no middle cell: it would sit half a cell off its line
  it('have a middle cell to sit on their line', () => {
    expect((RAIL_SHIP.ahead[0] as string).length % 2).toBe(1);
    expect((EARTH[0] as string).length % 2).toBe(1);
    expect(STRIP_SHIP.ahead.length % 2).toBe(1);
    expect(EARTH_SMALL.length % 2).toBe(1);
    // The hull of the craft of the rail is a square of an odd side: it turns around on its middle pixel
    expect((RAIL_SHIP.ahead.length - SHIP_FLAME_CELLS) % 2).toBe(1);
    expect(RAIL_SHIP.ahead.length - SHIP_FLAME_CELLS).toBe((RAIL_SHIP.ahead[0] as string).length);
  });

  // The craft is a spacecraft, not a rocket, so it flies down the page: heading ahead its nose, one pixel on the line,
  // is at its foot and its flames are above its hull
  it('draw the craft of the rail nose down when it heads ahead, its flames above it', () => {
    const { ahead } = RAIL_SHIP;
    const middle = ((ahead[0] as string).length - 1) / 2;
    expect(ahead.at(-1)).toBe(`${'.'.repeat(middle)}#${'.'.repeat(middle)}`);
    for (const row of ahead.slice(0, SHIP_FLAME_CELLS)) expect(row).toMatch(/^[.Ab]+$/);
    for (const row of ahead.slice(SHIP_FLAME_CELLS)) expect(row).not.toMatch(/[Ab]/);
    for (const row of ahead) expect([...row].reverse().join('')).toBe(row);
  });

  // Going back up the page turns the craft around: the same picture turned over, nose up, flames under the hull
  it('turn the craft of the rail over when it heads back', () => {
    expect(RAIL_SHIP.back).toEqual([...RAIL_SHIP.ahead].reverse());
    expect(RAIL_SHIP.back[0]).toBe(RAIL_SHIP.ahead.at(-1));
    for (const row of RAIL_SHIP.back.slice(-SHIP_FLAME_CELLS)) expect(row).toMatch(/^[.Ab]+$/);
  });

  it('draw the craft of the strip nose to the right when it heads ahead, and turn it over when it heads back', () => {
    const { ahead, back } = STRIP_SHIP;
    const middle = ahead[(ahead.length - 1) / 2] as string;
    expect(middle.at(-1)).toBe('#');
    expect(middle.slice(0, SHIP_FLAME_CELLS)).toMatch(/^\.*$/);
    for (const row of ahead) expect(row.slice(SHIP_FLAME_CELLS)).not.toMatch(/[Ab]/);
    expect(ahead.some((row) => /[Ab]/.test(row.slice(0, SHIP_FLAME_CELLS)))).toBe(true);
    expect(back).toEqual(ahead.map((row) => [...row].reverse().join('')));
    // Above and below the line alike
    expect([...ahead].reverse()).toEqual([...ahead]);
  });

  it('keep the exhaust behind the flames, within its length', () => {
    for (const [x, distance, side, opacity] of SHIP_EXHAUST) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(distance + side).toBeLessThanOrEqual(SHIP_EXHAUST_LENGTH);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThanOrEqual(1);
    }
  });

  it('draw the Earth as a globe with continents', () => {
    for (const globe of [EARTH, EARTH_SMALL]) {
      expect(globe).toHaveLength((globe[0] as string).length);
      expect(globe.join('')).toMatch(/o/);
      // Round: its corners are empty
      expect(globe[0]?.[0]).toBe('.');
      expect(globe.at(-1)?.at(-1)).toBe('.');
    }
  });
});

describe('the flight plan on the page', () => {
  const markup = render();

  // The craft flew up the left side of the frame, its labels on its left; then down a ruler by the left edge of the
  // screen. It is a spacecraft and flies down the page as the reader does, along a ruler by the right edge of the screen,
  // beside the scrollbar, which tells the same story; its labels stand on its left
  it('flies the craft of the rail down a ruler by the right edge of the screen, beside the scrollbar', () => {
    expect(plan).toContain('const LINE = 24;');
    expect(plan).toContain("transform: 'translateY(var(--flight-y, 0px))'");
    expect(plan).not.toContain('* -1');
    const rail = markup.match(/<nav data-flight-rail=""[^>]*class="([^"]*)"/)?.[1] ?? '';
    expect(rail.split(' ')).toEqual(expect.arrayContaining(['fixed', 'right-0', 'top-[80px]', 'bottom-6']));
    expect(rail.split(' ')).not.toContain('left-0');
    // The line, the craft and the Earth are placed from the right edge of the screen
    expect(plan).toContain('style={{ right: LINE, top: SHIP_HALF, bottom: EARTH_SIZE + EARTH_BAY }}');
    expect(plan).toMatch(/style=\{\{ right: LINE - SHIP_HALF, width: SHIP, height: SHIP, transform:/);
    // The labels start on the left of the line, past the lane of the tag of the craft; the number stands next to the
    // line and the name before it
    expect(plan).toContain('const LABELS_AT = 84;');
    expect(plan).toMatch(/paddingRight: \(isStage \? NAMES_AT : LABELS_AT\) - CLEAR/);
    expect(plan).toMatch(/justify-end font-mono/);
    // The ticks of the ruler are on the side of the edge of the screen
    expect(plan).toContain(
      'style={{ right: LINE - length, width: length, top: SHIP_HALF + Math.round((tick * travel) / TICKS) }}',
    );
  });

  // A ruler: a tick every 5% of the flight, a longer one every 25%, and the same ruler lit as far as the craft has flown
  it('draws the rail as a ruler, lit behind the craft', () => {
    expect(plan).toContain('const TICKS = 20;');
    expect(plan).toContain('const length = tick % 5 === 0 ? 8 : 4;');
    expect(plan).toContain('<Ruler travel={travel} colour="bg-[var(--tuwa-border-strong)]" />');
    expect(plan).toContain('<Ruler travel={travel} colour="bg-[var(--tuwa-docs-lit)]" />');
    expect(plan).toContain('clipPath: `inset(0 0 calc(100% - var(--flight-y, 0px) - ${SHIP_HALF + 1}px) 0)`');
    expect(plan).toContain('group-data-[arrived]/flight:![clip-path:none]');
  });

  // The quick start is the finish and it is at the foot of the rail: the Earth, where the reader starts building
  it('ends the rail at the Earth, the last waypoint', () => {
    expect(plan).toContain(
      '<Pixels art={EARTH} pixels={earthPixels} style={{ right: LINE - EARTH_HALF, bottom: EARTH_BAY }} />',
    );
    expect(plan).toContain('const isEarth = index === lastIndex;');
    expect(plan).toMatch(/index === lastIndex\s*\? travel \+ EARTH_AFTER \+ EARTH_HALF/);
    expect(homePlan).toMatch(
      /\{ id: 'quick-start', kind: 'section', number: '03', name: t\.home\.quickStart\.section \},\s*\];/,
    );
    expect(plan).toContain('group-data-[arrived]/flight:fill-[var(--tuwa-docs-lit)]');
    expect(hook).toContain('end = flightEnd(parts, maxScroll);');
    expect(hook).toContain('target = flightProgress(window.scrollY, end);');
    expect(hook).toContain("root.toggleAttribute('data-arrived', shown >= 1 - WAYPOINT_REACH);");
  });

  // When the reader turns back the craft turns too, drawn anew pixel by pixel: a new picture for each heading, whose
  // pixels fly in to their places
  it('turns the craft around with the reader, drawn anew pixel by pixel', () => {
    expect(plan.match(/<Pixels\s+key=\{heading\}/g)).toHaveLength(2);
    expect(plan).toContain('art={RAIL_SHIP[heading]}');
    expect(plan).toContain('art={STRIP_SHIP[heading]}');
    expect(plan).toContain(
      "className={`absolute max-w-none overflow-visible ${assemble ? 'tuwa-flight-assemble' : ''} ${className}`}",
    );
    expect(hook).toContain('const nextBack = turnsBack(back, shown, target, Math.max(railTravel, stripTravel));');
    expect(hook).toContain("setHeading(back ? 'back' : 'ahead');");
    expect(globals).toMatch(/\.tuwa-flight-assemble \[data-fly\] \{\s*animation: tuwa-flight-assemble 380ms/);
    // The flames of the craft do not fly: they burn or they do not
    expect(plan).toContain("const flies = assemble && (pixel === '#' || pixel === 'o');");
    // The craft of the server render heads ahead, its pixels marked to fly
    expect(markup).toMatch(/class="[^"]*tuwa-flight-assemble[^"]*"/);
    expect(markup).toMatch(/data-fly="" style="--i:0;--dx:[-\d.]+px;--dy:[-\d.]+px"/);
  });

  // The caption above the rail ("Flight plan · 9 waypoints") said nothing the rail does not show
  it('has no caption', () => {
    for (const dictionary of [en, uk, zhCN]) {
      expect(dictionary.common.flight).not.toHaveProperty('title');
      expect(dictionary.common.flight).not.toHaveProperty('waypoints');
    }
    expect(markup).not.toMatch(/waypoints/i);
    expect(plan).not.toContain('formatPlural');
  });

  it('flies the craft of the strip along the line under the header, to the Earth on the right', () => {
    expect(plan).toContain("transform: 'translateX(var(--flight-x, 0px))'");
    expect(markup).toMatch(
      /data-flight-strip="" role="progressbar"[^>]*class="[^"]*fixed inset-x-0 top-\[56px\][^"]* h-0 /,
    );
    expect(plan).toMatch(/<Pixels\s+art=\{EARTH_SMALL\}[\s\S]{0,120}className="right-1"/);
    expect(plan).toContain('clipPath: `inset(0 calc(100% - var(--flight-x, 0px) - ${middle}px) 0 0)`');
  });

  // The rail needs the margin beside the column, which the page has from 1280px; narrower, the strip takes no room at all
  it('shows the rail from 1280px and the strip below, never both', () => {
    const rail = markup.match(/<nav data-flight-rail=""[^>]*class="([^"]*)"/)?.[1] ?? '';
    const strip = markup.match(/data-flight-strip=""[^>]*class="([^"]*)"/)?.[1] ?? '';
    expect(rail.split(' ')).toEqual(expect.arrayContaining(['hidden', 'xl:block', 'pointer-events-none']));
    expect(strip.split(' ')).toEqual(expect.arrayContaining(['xl:hidden', 'pointer-events-none']));
    expect(strip.split(' ')).not.toContain('hidden');
  });

  // What the rail shows depends on the margin beside the column of the page, measured from a part as wide as the column
  it('measures the margin of the page from a part as wide as its column', () => {
    const column = markup.match(/data-flight-column="" aria-hidden="true" class="([^"]*)"/)?.[1] ?? '';
    const home = read('components/home/homeLayout.ts');
    for (const width of ['max-w-[1120px]', 'min-[1600px]:max-w-[1232px]', 'mx-auto', 'w-full']) {
      expect(column.split(' ')).toContain(width);
      expect(home).toContain(width);
    }
    // The margin on the right of the column, without the scrollbar
    expect(hook).toContain('document.documentElement.clientWidth - column.getBoundingClientRect().right');
  });

  // A name shows when the margin has room for it, in every language: the widths are read from the page, not guessed
  it('shows the names that fit the margin, by their measured widths', () => {
    expect(markup.match(/data-flight-name="section"/g)).toHaveLength(4);
    expect(markup.match(/data-flight-name="stage"/g)).toHaveLength(5);
    expect(hook).toContain(`sectionNames: widest(root.querySelectorAll('[data-flight-name="section"]')),`);
    expect(hook).toContain(`stageNames: widest(root.querySelectorAll('[data-flight-name="stage"]')),`);
    expect(plan).toContain(
      'const fits = (width: number | undefined) => !!width && margin >= NAMES_AT + width + CLEAR;',
    );
    expect(plan).toContain('const namesShown = numbersShown && fits(measure?.sectionNames);');
    expect(plan).toContain('const stagesShown = namesShown && fits(measure?.stageNames);');
  });

  // Two states: the craft locks on a waypoint as the reader comes to its part (the corner marks of a bay for the craft,
  // the label in the accent), and its square is lit when the craft has docked there
  it('locks on a waypoint before it lights its square', () => {
    expect(plan).toContain('const isHere = index === here;');
    expect(plan).toContain('const isReached = index <= reached;');
    expect(plan).toContain('${markColour(isReached)}');
    expect(plan).toMatch(/\{isHere && \(\s*<CornerMarks/);
    expect(plan).toContain('const bay = isEarth ? EARTH_HALF + EARTH_BAY : SHIP_HALF + BAY;');
    expect(plan).toContain("aria-current={isHere ? 'location' : undefined}");
  });

  it('links the parts of the page in their order, each with its name', () => {
    const links = [...markup.matchAll(/<a href="#([\w-]+)" aria-label="([^"]+)"/g)].map((match) => [
      match[1],
      match[2]?.replace(/&amp;/g, '&'),
    ]);
    expect(links).toEqual([
      ['overview', '00 Overview'],
      ['ecosystem', '01 Ecosystem'],
      ['packages', '02 Packages'],
      ['stage-1', 'Core Auth & Primitives'],
      ['stage-2', 'State & Connection'],
      ['stage-3', 'Backend & Sync'],
      ['stage-4', 'User Interface'],
      ['stage-5', 'SDK Integration Layer'],
      ['quick-start', '03 Quick start'],
    ]);
    // The ids are those of the parts of the page
    for (const [id] of links)
      expect(
        [
          read('components/HeroSection.tsx'),
          read('components/home/EcosystemBoard.tsx'),
          read('components/home/StageLedgers.tsx'),
          read('components/home/StageLedger.tsx'),
          read('components/QuickStartSection.tsx'),
        ].some(
          (source) =>
            source.includes(`id="${id}"`) || (id?.startsWith('stage-') && source.includes('id={`stage-${stage}`}')),
        ),
        id,
      ).toBe(true);
  });

  it('names itself and its progress in every language', () => {
    for (const [locale, dictionary] of [
      ['en', en],
      ['uk', uk],
      ['zh-CN', zhCN],
    ] as const) {
      const flight = dictionary.common.flight;
      const html = render(locale);
      expect(html).toContain(`<nav data-flight-rail="" aria-label="${flight.ariaLabel}"`);
      expect(html).toContain(`role="progressbar" aria-label="${flight.progressLabel}"`);
      expect(html).toContain(`aria-label="00 ${flight.overview}"`);
    }
    // The tag of the craft of the rail shows once the margin is measured; the strip is a progress bar from the start
    expect(markup.match(/aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"/g)).toHaveLength(1);
    expect(plan.match(/role="progressbar"/g)).toHaveLength(2);
  });

  // The strip lies over the line of the header: inside the page, which is under the header, it could not
  it('stands outside the page, so its strip lies over the line of the header', () => {
    expect(page).toMatch(
      /<PageBackground \/>\s*\{\/\*[^*]*\*\/\}\s*<HomeFlightPlan \/>\s*<div className="relative z-10">/,
    );
    expect(markup).toMatch(/data-flight-strip=""[^>]*class="[^"]*z-\[55\]/);
    expect(read('components/Header.tsx')).toMatch(/<header className="fixed top-0 left-0 right-0 z-50 /);
  });

  // Motions play once on a page that is read. The flame is the one that repeats, and only while the scroll moves the craft
  it('lets nothing move for ever but the flame of a craft under way', () => {
    const endless = [...plan.matchAll(/\S*infinite\S*/g)].map((match) => match[0]);
    expect(endless).toHaveLength(1);
    expect(endless[0]).toMatch(/^group-data-\[moving\]\/flight:animate-\[tuwa-flight-flicker_/);
    expect(plan).toContain('motion-reduce:animate-none');
    expect(globals).not.toMatch(/\binfinite\b/);
    expect(globals).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.tuwa-flight-lock,\s*\.tuwa-flight-assemble \[data-fly\] \{\s*animation: none;/,
    );
  });

  // The scroll handler reads one number; the layout is measured when the page or the window changes its size
  it('measures the page outside the scroll handler, and follows the scroll passively', () => {
    const onScroll = hook.match(/const onScroll = \(\) => \{([\s\S]*?)\n {4}\};/)?.[1] ?? '';
    expect(onScroll).toContain('window.scrollY');
    expect(onScroll).not.toMatch(/getBoundingClientRect|getComputedStyle|clientHeight|clientWidth|scrollHeight/);
    expect(hook).toContain("window.addEventListener('scroll', onScroll, { passive: true })");
    expect(hook).toContain('new ResizeObserver(remeasure)');
    expect(hook).toContain('document.fonts?.ready');
  });

  // For reduced motion the craft is where the scroll is at once, and no flame burns
  it('does not ease or burn for reduced motion', () => {
    expect(hook).toContain('shown = reduced.matches ? target : approach(shown, target, now - last);');
    expect(hook).toContain("if (!reduced.matches && shown !== target) root.setAttribute('data-moving', '');");
  });

  // The part the reader reads, by the reading line: by the stops, the number took the accent as its heading left the window
  it('turns the number of the stage the reader reads to the accent', () => {
    expect(hook).toContain('const nextHere = activeWaypoint(reads, shown);');
    expect(hook).toContain('const nextReached = activeWaypoint(stops, shown);');
    expect(hook).toContain("if (index === nextHere) part?.setAttribute('data-flight', 'here');");
    expect(hook).toContain('reads = readingStops(parts, end, window.innerHeight);');
    const ledger = read('components/home/StageLedger.tsx');
    expect(ledger).toContain('className="group/stage scroll-mt-[120px]');
    expect(ledger).toContain('group-data-[flight=here]/stage:bg-[var(--tuwa-button-primary-bg)]');
    expect(ledger).toContain('group-data-[flight=here]/stage:text-[var(--tuwa-text-on-accent)]');
  });
});

describe('the frame of the main page and the footer', () => {
  // The frame closed above the footer with a line of its own, and the footer stood apart under it: its sides now run
  // on into the footer, to the end of the page
  it('runs the sides of the frame into the footer instead of closing above it', () => {
    expect(page).not.toMatch(/xl:border-b/);
    expect(page).not.toMatch(/y="bottom"/);
    expect(page).toContain('<div className={`${homeContentClassName} ${homeFrameClassName}`}>');
    expect(shell).toMatch(/const FRAMED_PAGES = \['\/'[^\]]*\];/);
    // The address decides, or the page itself where every address is its own (the 404)
    expect(shell).toContain('const isFramed = framed || FRAMED_PAGES.includes(pathWithoutLocale(pathname));');
    expect(shell).toContain('<Footer framed={isFramed} />');
  });

  it('carries the sides through the space above the footer and through the footer', () => {
    // A margin above the footer would cut the sides off: the space is a part with the sides of the frame
    expect(footer).toContain("<footer className={`relative z-10 ${framed ? '' : 'mt-[120px]'}`}>");
    expect(footer).toContain(
      '{framed && <div aria-hidden="true" className={`${homeContentClassName} ${homeFrameClassName} h-[120px]`} />}',
    );
    expect(footer).toContain("${framed ? homeFrameClassName : ''}");
    expect(footer).toMatch(/\{framed && \(\s*<>\s*<CrossMark x="left" y="top" \/>\s*<CrossMark x="right" y="top" \/>/);
  });
});
