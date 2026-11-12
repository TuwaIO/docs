/**
 * @file The pixel pictures of the flight plan of a page (`FlightPlan`), row by row: `.` is empty, `#` a pixel of ink, `o` a lit
 * pixel (the accent), `A` a pixel of a flame and `b` a pixel of a flame that flickers. Every picture is an odd number of
 * cells across the line it sits on, so its middle cell lies on that line.
 */

/** The side of a cell of the pictures of the rail, in pixels. */
export const FLIGHT_CELL = 3;

/**
 * The side of a cell of the pictures of the strip, in pixels: the middle row of a picture covers the line of the header
 * and the line of the bar that sticks under it, and the picture clears the buttons of the header above the line.
 */
export const STRIP_CELL = 2;

/** How many rows (on the rail) or columns (on the strip) of a picture of the craft are its flames. */
export const SHIP_FLAME_CELLS = 2;

/**
 * The craft, a spacecraft seen from above, nose up: its hull (9 rows: the nose, the lit cockpit, two wings with their
 * tips ahead, two engines) over the flames of the engines (2 rows). Unlike a rocket it flies any way it is pointed.
 */
// prettier-ignore
const SHIP_NOSE_UP: readonly string[] = [
  '....#....',
  '....#....',
  '...###...',
  '...#o#...',
  '#..###..#',
  '#.#####.#',
  '#########',
  '##.###.##',
  '#..#.#..#',
  '...A.A...',
  '...b.b...',
];

/** The same craft, nose to the right, for the strip: the flames (2 columns) behind the hull (9 columns), 7 rows. */
// prettier-ignore
const SHIP_NOSE_RIGHT: readonly string[] = [
  '...##......',
  '....##.....',
  'bA#######..',
  '...####o###',
  'bA#######..',
  '....##.....',
  '...##......',
];

/**
 * The craft of the rail by where it heads: `ahead`, down the page, nose down with its flames above it; `back`, up the
 * page, nose up with its flames under it. The two are one picture turned over, so the craft turns on the spot.
 */
export const RAIL_SHIP: Readonly<Record<'ahead' | 'back', readonly string[]>> = {
  ahead: [...SHIP_NOSE_UP].reverse(),
  back: SHIP_NOSE_UP,
};

/**
 * The craft of the strip by where it heads: `ahead`, nose to the right with its flames on its left; `back`, nose to the
 * left with its flames on its right.
 */
export const STRIP_SHIP: Readonly<Record<'ahead' | 'back', readonly string[]>> = {
  ahead: SHIP_NOSE_RIGHT,
  back: SHIP_NOSE_RIGHT.map((row) => [...row].reverse().join('')),
};

/**
 * The exhaust of the craft of the rail while it moves: separate pixels that shrink and fade away behind its flames, in
 * two streams from its two engines either side of the line, as `[x, distance, side, opacity]`: `x` in pixels from the
 * left of the craft, `distance` in pixels behind the end of the flames.
 */
export const SHIP_EXHAUST: readonly (readonly [number, number, number, number])[] = [
  [9, 2, 3, 0.75],
  [15, 3, 3, 0.75],
  [7, 10, 2, 0.5],
  [18, 12, 2, 0.5],
  [10, 18, 2, 0.34],
  [15, 21, 2, 0.32],
  [8, 28, 2, 0.2],
  [17, 31, 2, 0.18],
  [11, 38, 2, 0.1],
];

/** How far behind the flames the exhaust reaches, in pixels. */
export const SHIP_EXHAUST_LENGTH = 40;

/**
 * The Earth at the foot of the rail, where the flight ends (the quick start: the reader starts building): a globe in an
 * outline with its continents (`o`), grey until the craft arrives, then lit.
 */
// prettier-ignore
export const EARTH: readonly string[] = [
  '...#####...',
  '.##oo...##.',
  '.#ooo....#.',
  '#.ooo..o..#',
  '#..oo.ooo.#',
  '#..o..ooo.#',
  '#.....oo..#',
  '#..o...o..#',
  '.#.oo....#.',
  '.##.o...##.',
  '...#####...',
];

/** The Earth at the end of the strip: the same globe, smaller. */
// prettier-ignore
export const EARTH_SMALL: readonly string[] = [
  '..###..',
  '.#oo.#.',
  '#oo.oo#',
  '#.o.oo#',
  '#...o.#',
  '.#o..#.',
  '..###..',
];
