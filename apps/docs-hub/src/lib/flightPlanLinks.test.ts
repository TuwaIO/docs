import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type { FlightWaypoint } from '../../../../packages/docs-ui/src/components/FlightPlan';
import type { FlightMeasure } from '../../../../packages/docs-ui/src/useFlight';

// The links of the rail of the flight plan (`FlightPlan` of docs-ui) with the page measured: what the margin has room
// for decides what a link shows (nothing, its number, its name), and the measure of a page is known only in a browser.
// Here the measure is given, so every state of a link is rendered

const flight = vi.hoisted(() => ({ measure: null as FlightMeasure | null }));

vi.mock('../../../../packages/docs-ui/src/useFlight', () => ({
  useFlight: () => ({ rootRef: { current: null }, measure: flight.measure, here: 1, reached: 0, heading: 'ahead' }),
}));

const { FlightPlan } = await import('../../../../packages/docs-ui/src/components/FlightPlan');

const waypoints: FlightWaypoint[] = [
  { id: 'overview', kind: 'section', number: '00', name: 'Overview' },
  { id: 'ecosystem', kind: 'section', number: '01', name: 'Ecosystem' },
  { id: 'packages', kind: 'section', number: '02', name: 'Packages' },
  { id: 'stage-1', kind: 'stage', name: 'Core Auth & Primitives' },
  { id: 'stage-2', kind: 'stage', name: 'State & Connection' },
  { id: 'faq', kind: 'section', name: 'FAQ' },
  { id: 'quick-start', kind: 'section', number: '03', name: 'Quick start' },
];

/** The stops of a page whose parts are far apart, and of one whose first six parts start within a few pixels. */
const APART = [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1];
const CROWDED = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 1];

/** A section whose first stage starts 19px below it on the rail (the alternatives of the comparisons page). */
const PAIR = [0, 0.2, 0.4, 0.43, 0.6, 0.8, 1];

/** The margins that have room for nothing, for the numbers, for the names of the sections and for every name. */
const MARGINS = { marks: 60, numbers: 120, names: 250, all: 400 } as const;

const render = (margin: number, stops: number[] = APART) => {
  flight.measure = { stops, railTravel: 600, stripTravel: 0, margin, sectionNames: 100, stageNames: 180 };
  return renderToStaticMarkup(
    createElement(FlightPlan, { waypoints, labels: { ariaLabel: 'Flight plan', progressLabel: 'Flight' } }),
  );
};

/** What is left of markup without the parts hidden from assistive technology, as text. */
const text = (markup: string) =>
  markup
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<span[^>]*aria-hidden="true"[^>]*>[^<]*<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** The links of the rail: the id each leads to, its attributes, its name and the text it shows in the margin. */
const links = (markup: string) =>
  [...markup.matchAll(/<li[^>]*style="([^"]*)"><a href="#([\w-]+)"([^>]*)>(.*?)<\/a><\/li>/g)].map((match) => {
    const inner = match[4] ?? '';
    return {
      id: match[2] as string,
      attributes: match[3] ?? '',
      name: text(inner),
      // The name beside the line shows only while its mark is pointed at: it is not what the link shows at rest
      shown: text(inner.replace(/<span[^>]*tuwadocs:opacity-0[^>]*>[^<]*<\/span>/g, '')),
      // React writes a zero without its unit
      top: Number(/top:(-?[\d.]+)(?:px)?/.exec(match[1] ?? '')?.[1]),
      height: Number(/height:(-?[\d.]+)(?:px)?/.exec(match[1] ?? '')?.[1]),
    };
  });

// WCAG 2.5.3 (axe `label-content-name-mismatch`): the name of a link holds the text the link shows, in the order it
// shows it. The links had a name of their own, `aria-label`, with the number before the name, while they show the name
// before the number: a reader who speaks to the page says what they see and the link did not answer to it
describe('the names of the links of the rail', () => {
  it('are what the links hold, never a name of their own', () => {
    for (const margin of Object.values(MARGINS)) {
      const found = links(render(margin));
      expect(found.map((link) => link.id)).toEqual(waypoints.map((waypoint) => waypoint.id));
      for (const link of found) expect(link.attributes).not.toContain('aria-label');
    }
  });

  it('name every part by its number and its name, whatever the margin shows', () => {
    // No room for a label: the name beside the line holds both, the number first, as the bar of the section does
    expect(links(render(MARGINS.marks)).map((link) => link.name)).toEqual([
      '00 Overview',
      '01 Ecosystem',
      '02 Packages',
      'Core Auth & Primitives',
      'State & Connection',
      'FAQ',
      '03 Quick start',
    ]);
    // From the margin that shows the numbers: the name, then the number next to the line, as the link shows them
    for (const margin of [MARGINS.numbers, MARGINS.names, MARGINS.all])
      expect(links(render(margin)).map((link) => link.name)).toEqual([
        'Overview 00',
        'Ecosystem 01',
        'Packages 02',
        'Core Auth & Primitives',
        'State & Connection',
        'FAQ',
        'Quick start 03',
      ]);
  });

  it('hold the text the links show, in its order', () => {
    const shown = (margin: number) => links(render(margin)).map((link) => link.shown);
    expect(shown(MARGINS.marks)).toEqual(['', '', '', '', '', '', '']);
    expect(shown(MARGINS.numbers)).toEqual(['00', '01', '02', '', '', '', '03']);
    expect(shown(MARGINS.names)).toEqual([
      'Overview 00',
      'Ecosystem 01',
      'Packages 02',
      '',
      '',
      'FAQ',
      'Quick start 03',
    ]);
    expect(shown(MARGINS.all)).toEqual([
      'Overview 00',
      'Ecosystem 01',
      'Packages 02',
      'Core Auth & Primitives',
      'State & Connection',
      'FAQ',
      'Quick start 03',
    ]);
    for (const margin of Object.values(MARGINS))
      for (const link of links(render(margin))) expect(link.name).toContain(link.shown);
  });

  it('keep the part the reader reads marked for assistive technology', () => {
    const found = links(render(MARGINS.all));
    expect(found.filter((link) => link.attributes.includes('aria-current="location"')).map((link) => link.id)).toEqual([
      'ecosystem',
    ]);
  });
});

// WCAG 2.5.8 (axe `target-size`): a pointer target is 24px by 24px, or far enough from the next one. The rows of the
// labels were 18px tall and 18px apart, so the links of a page with many parts failed it
describe('the sizes of the links of the rail', () => {
  /** Whether no link reaches into the one after it. */
  const apart = (found: ReturnType<typeof links>) =>
    found.every(
      (link, index) => index === 0 || link.top >= (found[index - 1]?.top ?? 0) + (found[index - 1]?.height ?? 0),
    );

  it('are 24px tall beside marks that are apart, their rows on the marks', () => {
    for (const margin of Object.values(MARGINS)) {
      const found = links(render(margin));
      expect(found.map((link) => link.height)).toEqual([24, 24, 24, 24, 24, 24, 24]);
      // The middle of a row is the middle of its mark: 13px (the middle of the craft) and the way to the part
      expect(found.map((link) => link.top + 12)).toEqual([13, 133, 253, 313, 373, 493, 650]);
    }
  });

  it('are 24px tall and 24px apart where the labels of close marks move apart', () => {
    const found = links(render(MARGINS.all, CROWDED));
    expect(found.map((link) => link.height)).toEqual([24, 24, 24, 24, 24, 24, 24]);
    expect(found.map((link) => link.top + 12)).toEqual([12, 36, 60, 84, 108, 132, 650]);
    expect(apart(found)).toBe(true);
  });

  // Marks without labels stay where their parts are: each link keeps to its mark, a row tall where the marks next to
  // it leave the room, and the links of marks a few pixels apart share what lies between them
  it('never lie over each other beside close marks without labels', () => {
    const found = links(render(MARGINS.marks, CROWDED));
    expect(apart(found.filter((link) => link.id !== 'stage-1'))).toBe(true);
    // The first stage starts where its section does and shares its mark: the two links are one place
    const [section, stage] = [found[2], found[3]];
    expect(stage?.top).toBe(section?.top);
    expect(stage?.height).toBe(section?.height);
    // The marks are at 13, 19, 25, 37 and 43px: the first and the last of them reach away from the others
    expect(found.map((link) => [link.top, link.height])).toEqual([
      [-8, 24],
      [16, 6],
      [22, 9],
      [22, 9],
      [31, 9],
      [40, 24],
      [638, 24],
    ]);
  });

  // The mark of a stage 18px under the mark of its section: at 18px rows both links failed the size of a target, and
  // around their marks they cannot both be 24px tall. The link of the stage starts where the link of the section ends
  it('give a section and a stage close under it a row each', () => {
    // Without labels the two links meet half way between the marks (253 and 271px)
    const marks = links(render(MARGINS.marks, PAIR));
    expect([marks[2], marks[3]].map((link) => [link?.top, link?.height])).toEqual([
      [238, 24],
      [262, 24],
    ]);
    // With the label of the section, its link is the row around it
    for (const margin of [MARGINS.numbers, MARGINS.names]) {
      const found = links(render(margin, PAIR));
      expect([found[2], found[3]].map((link) => [link?.top, link?.height])).toEqual([
        [241, 24],
        [265, 24],
      ]);
      expect(found.map((link) => link.height)).toEqual([24, 24, 24, 24, 24, 24, 24]);
    }
  });

  // Four labels moved apart fill the rail from its top, and the marks of the two stages lie under them: no link has
  // room there, so each of the two is a line on its mark (a part of its link, drawn over the links of the labels)
  it('never lie over each other where only the sections have labels', () => {
    for (const margin of [MARGINS.numbers, MARGINS.names]) {
      const found = links(render(margin, CROWDED));
      // The links of the labels are a row each, whatever the marks of the stages beside them
      for (const link of found.filter((item) => !item.id.startsWith('stage-'))) expect(link.height).toBe(24);
      expect(found.filter((link) => link.height === 1).map((link) => link.id)).toEqual(['stage-1', 'stage-2']);
      expect(apart(found.filter((link) => link.height > 1))).toBe(true);
    }
  });
});
