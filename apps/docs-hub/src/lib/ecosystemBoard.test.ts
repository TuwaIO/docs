import { describe, expect, it } from 'vitest';

import { boardEdges, boardPlaces } from './ecosystem';
import { boardTraces, defaultRoute, type NodeBox, traceEnds, tracePath } from './ecosystemBoard';

// A board as the browser lays it out from 1024px: a stage column of 220px, three lanes, rows of 104px, nodes of 72px
// with margins of 18px in their lanes
const LANES = { left: 220, width: 900 };
function layout(): Record<string, NodeBox> {
  const lane = LANES.width / 3;
  return Object.fromEntries(
    Object.entries(boardPlaces).map(([id, place]) => {
      const top = 40 + (place.row - 1) * 104 + 16;
      const left = LANES.left + (place.lane - 1) * lane + 18;
      return [id, { left, right: left + (place.span ?? 1) * lane - 36, top, bottom: top + 72 }];
    }),
  );
}

const isOrthogonal = (points: [number, number][]) =>
  points.every(
    (point, index) => index === 0 || point[0] === points[index - 1]![0] || point[1] === points[index - 1]![1],
  );

describe('the traces of the board', () => {
  const boxes = layout();
  const traces = boardTraces(boardEdges, boxes, LANES);

  it('draws one trace for every edge', () => {
    expect(traces.map((trace) => `${trace.from}>${trace.to}`)).toEqual(
      boardEdges.map((edge) => `${edge.from}>${edge.to}`),
    );
  });

  it('runs every trace on lines across and down, from the edge of one node to the edge of the other', () => {
    for (const trace of traces) {
      const [from, to] = [boxes[trace.from]!, boxes[trace.to]!];
      const [first, last] = [trace.points[0]!, trace.points[trace.points.length - 1]!];
      expect(isOrthogonal(trace.points), trace.from).toBe(true);
      if (trace.kind === 'or') {
        expect(first[0]).toBe(from.right);
        expect(last[0]).toBe(to.left);
      } else {
        expect(first[1]).toBe(from.bottom);
        expect(last[1]).toBe(to.top);
        expect(first[0]).toBeGreaterThan(from.left);
        expect(first[0]).toBeLessThan(from.right);
        expect(last[0]).toBeGreaterThan(to.left);
        expect(last[0]).toBeLessThan(to.right);
      }
    }
  });

  // A trace that crossed a node would read as an edge to it
  it('passes through no node on its way', () => {
    for (const trace of traces) {
      for (const [id, box] of Object.entries(boxes)) {
        if (id === trace.from || id === trace.to) continue;
        for (let index = 1; index < trace.points.length; index++) {
          const [[x1, y1], [x2, y2]] = [trace.points[index - 1]!, trace.points[index]!];
          const crosses =
            Math.max(x1, x2) > box.left &&
            Math.min(x1, x2) < box.right &&
            Math.max(y1, y2) > box.top &&
            Math.min(y1, y2) < box.bottom;
          expect(crosses, `${trace.from}>${trace.to} through ${id}`).toBe(false);
        }
      }
    }
  });

  it('keeps lines of 1px on the middle of a pixel', () => {
    for (const trace of traces)
      for (const [x, y] of trace.points) {
        expect(Number.isInteger(x) || Number.isInteger(x - 0.5)).toBe(true);
        expect(Number.isInteger(y) || Number.isInteger(y - 0.5)).toBe(true);
      }
  });

  it('routes an edge it does not know straight down, or with one step across', () => {
    const a = { left: 0, right: 100, top: 0, bottom: 50 };
    expect(defaultRoute(a, { left: 0, right: 100, top: 100, bottom: 150 })).toEqual([
      [50.5, 50],
      [50.5, 100],
    ]);
    expect(defaultRoute(a, { left: 200, right: 300, top: 100, bottom: 150 })).toEqual([
      [50.5, 50],
      [50.5, 75.5],
      [250.5, 75.5],
      [250.5, 100],
    ]);
  });

  it('writes the path and the two end squares of a trace', () => {
    expect(
      tracePath([
        [1, 2],
        [1, 9],
      ]),
    ).toBe('M1 2L1 9');
    expect(
      traceEnds([
        [10.5, 20],
        [10.5, 60],
      ]),
    ).toEqual([
      [8.5, 20],
      [8.5, 56],
    ]);
    expect(
      traceEnds([
        [10, 30.5],
        [50, 30.5],
      ]),
    ).toEqual([
      [10, 28.5],
      [46, 28.5],
    ]);
  });
});
