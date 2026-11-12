import type { BoardEdge } from './ecosystem';

/** The box of a node of the board, in pixels from the top left corner of the board. */
export interface NodeBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** A trace of the board: the points of its orthogonal path, from the node built on to the node that builds on it. */
export interface BoardTrace extends BoardEdge {
  points: [number, number][];
}

/** A coordinate on the middle of a pixel, so a line of 1px stays sharp. */
const crisp = (value: number) => Math.round(value) + 0.5;

/** A point along the width of a node, as a share of it (0 the left edge, 1 the right one). */
const along = (box: NodeBox, share: number) => crisp(box.left + share * (box.right - box.left));

/** The middle of the height of a node. */
const middle = (box: NodeBox) => crisp((box.top + box.bottom) / 2);

type Route = (boxes: Record<string, NodeBox>, laneEdge: (index: number) => number) => [number, number][];

/**
 * The routes of the traces, by `from>to`: where each leaves its node and where it turns, so no two run on top of each
 * other and none crosses a node. They follow the places of `boardPlaces`; an edge without a route here takes
 * {@link defaultRoute}.
 */
const routes: Record<string, Route> = {
  // Across the first row, through the empty middle lane
  'orbit>siwx': ({ orbit, siwx }) => {
    const y = crisp((Math.max(orbit!.top, siwx!.top) + Math.min(orbit!.bottom, siwx!.bottom)) / 2);
    return [
      [orbit!.left, y],
      [siwx!.right, y],
    ];
  },
  'siwx>satellite': ({ siwx, satellite }) => [
    [along(siwx!, 0.5), siwx!.bottom],
    [along(siwx!, 0.5), satellite!.top],
  ],
  'orbit>satellite': ({ orbit, satellite }) => [
    [along(orbit!, 0.2), orbit!.bottom],
    [along(orbit!, 0.2), crisp(satellite!.top - 18)],
    [along(satellite!, 0.82), crisp(satellite!.top - 18)],
    [along(satellite!, 0.82), satellite!.top],
  ],
  'orbit>pulsar': ({ orbit, pulsar }) => [
    [along(orbit!, 0.55), orbit!.bottom],
    [along(orbit!, 0.55), pulsar!.top],
  ],
  'pulsar>quasar': ({ pulsar, quasar }) => [
    [along(pulsar!, 0.55), pulsar!.bottom],
    [along(pulsar!, 0.55), quasar!.top],
  ],
  'satellite>nova': ({ satellite, nova }) => [
    [along(satellite!, 0.5), satellite!.bottom],
    [along(satellite!, 0.5), crisp(nova!.top - 16)],
    [along(nova!, 0.25), crisp(nova!.top - 16)],
    [along(nova!, 0.25), nova!.top],
  ],
  // Round Quasar Community, along the line between the first and the second lane
  'pulsar>nova': ({ pulsar, nova }, laneEdge) => [
    [along(pulsar!, 0.2), pulsar!.bottom],
    [along(pulsar!, 0.2), crisp(pulsar!.bottom + 16)],
    [laneEdge(1), crisp(pulsar!.bottom + 16)],
    [laneEdge(1), crisp(nova!.top - 28)],
    [along(nova!, 0.6), crisp(nova!.top - 28)],
    [along(nova!, 0.6), nova!.top],
  ],
  // Down the margin on the right of the third lane, past Pulsar and Quasar Cloud, into the right side of Nova
  'orbit>nova': ({ orbit, nova }, laneEdge) => {
    const x = crisp((orbit!.right + laneEdge(3)) / 2);
    return [
      [orbit!.right, middle(orbit!)],
      [x, middle(orbit!)],
      [x, middle(nova!)],
      [nova!.right, middle(nova!)],
    ];
  },
  // Down the margin on the left of the first lane, past Satellite Connect, into the left side of Nova
  'siwx>nova': ({ siwx, nova }, laneEdge) => {
    const x = crisp((laneEdge(0) + siwx!.left) / 2);
    return [
      [siwx!.left, middle(siwx!)],
      [x, middle(siwx!)],
      [x, middle(nova!)],
      [nova!.left, middle(nova!)],
    ];
  },
  'nova>sdk': ({ nova, sdk }) => [
    [along(nova!, 0.45), nova!.bottom],
    [along(nova!, 0.45), sdk!.top],
  ],
  'quasar-community>quasar': (boxes) => {
    const community = boxes['quasar-community']!;
    const quasar = boxes.quasar!;
    return [
      [community.right, middle(quasar)],
      [quasar.left, middle(quasar)],
    ];
  },
};

/**
 * The route of an edge the table does not know: down from the middle of the node built on, across halfway between the
 * two nodes when they do not line up, and down into the middle of the node that builds on it; beside each other (an
 * `or` edge), straight across between them.
 *
 * @param from - The node built on.
 * @param to - The node that builds on it.
 * @param kind - The kind of the edge.
 * @returns The points of the route.
 */
export function defaultRoute(from: NodeBox, to: NodeBox, kind?: BoardEdge['kind']): [number, number][] {
  if (kind === 'or') {
    const y = middle(to);
    return from.right <= to.left
      ? [
          [from.right, y],
          [to.left, y],
        ]
      : [
          [from.left, y],
          [to.right, y],
        ];
  }
  const start = along(from, 0.5);
  const end = along(to, 0.5);
  if (start === end)
    return [
      [start, from.bottom],
      [end, to.top],
    ];
  const turn = crisp((from.bottom + to.top) / 2);
  return [
    [start, from.bottom],
    [start, turn],
    [end, turn],
    [end, to.top],
  ];
}

/**
 * The traces of the board from the boxes of its nodes, measured in the browser.
 *
 * @param edges - The edges, by project ids.
 * @param boxes - The box of each node, by project id, from the top left corner of the board.
 * @param lanes - The left edge and the width of the area of the three lanes.
 * @returns A trace for each edge whose two nodes have a box.
 */
export function boardTraces(
  edges: readonly BoardEdge[],
  boxes: Record<string, NodeBox>,
  lanes: { left: number; width: number },
): BoardTrace[] {
  const laneEdge = (index: number) => crisp(lanes.left + (index * lanes.width) / 3);
  return edges.flatMap((edge) => {
    const from = boxes[edge.from];
    const to = boxes[edge.to];
    if (!from || !to) return [];
    const route = routes[`${edge.from}>${edge.to}`];
    return [{ ...edge, points: route ? route(boxes, laneEdge) : defaultRoute(from, to, edge.kind) }];
  });
}

/**
 * The path of a trace for an SVG `d` attribute.
 *
 * @param points - The points of the trace.
 * @returns The path.
 */
export function tracePath(points: [number, number][]): string {
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('');
}

/**
 * The two squares of 4px that end a trace, on its line and outside its nodes: at its start, where it leaves the first
 * node (down, up, left or right), and at its end, where it enters the second.
 *
 * @param points - The points of the trace.
 * @returns The top left corners of the two squares.
 */
export function traceEnds(points: [number, number][]): [number, number][] {
  const square = ([x, y]: [number, number], [toX, toY]: [number, number]): [number, number] =>
    x === toX ? [x - 2, toY > y ? y : y - 4] : [toX > x ? x : x - 4, y - 2];
  const [first, second] = [points[0]!, points[1]!];
  const [last, beforeLast] = [points[points.length - 1]!, points[points.length - 2]!];
  return [square(first, second), square(last, beforeLast)];
}
