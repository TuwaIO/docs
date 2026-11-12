/**
 * A TUWA project: it selects the icon of a `ProjectSquare`.
 */
export type PackageType = 'orbit' | 'pulsar' | 'satellite' | 'nova' | 'quasar' | 'siwx' | 'sdk';

/**
 * A pixel icon of a TUWA project, drawn on a 9 × 9 grid: `sign-in` (an arrow into a door: SIWX), `orbit` (a star in
 * its orbit: Orbit Utils), `satellite` (Satellite Connect), `pulsar` (a neutron star with its two beams), `cloud`
 * (Quasar Cloud), `server` (two racks: Quasar Community), `card` (a payment card with its chip: Quasar Client),
 * `supernova` (Nova UI Kit), `terminal` (a prompt: the TUWA SDK), `rocket` and `gear` (a stack to configure).
 */
export type ProjectIcon =
  | 'sign-in'
  | 'orbit'
  | 'satellite'
  | 'pulsar'
  | 'cloud'
  | 'server'
  | 'card'
  | 'supernova'
  | 'terminal'
  | 'rocket'
  | 'gear';

/**
 * The pictures of the {@link ProjectIcon}s, row by row, for `PixelArt`: `.` is empty, `#` or a small letter a
 * pixel of ink, `o` or a capital letter a lit pixel (the accent). The letters name the parts that moved in the round
 * badges before (`Orb`); they draw as `#` and `o`.
 */
// prettier-ignore
export const projectIconArt: Readonly<Record<ProjectIcon, readonly string[]>> = {
  'sign-in': [
    '.....####',
    '........#',
    '....a...#',
    '.....a..#',
    'aaaaaaA.#',
    '.....a..#',
    '....a...#',
    '........#',
    '.....####',
  ],
  orbit: [
    '...###...',
    '.##...##.',
    '.#.....#.',
    '#..ooo..#',
    '#..ooo..#',
    '#..ooo..#',
    '.#.....#.',
    '.##...##.',
    '...###...',
  ],
  satellite: [
    '...b.b...',
    '....A....',
    '....#....',
    '...###...',
    '##.###.##',
    '#########',
    '##.###.##',
    '...###...',
    '.........',
  ],
  pulsar: [
    '........C',
    '.......B.',
    '....#.A..',
    '...ooo...',
    '..#ooo#..',
    '...ooo...',
    '..A.#....',
    '.B.......',
    'C........',
  ],
  cloud: [
    '.........',
    '....ooo..',
    '..##...#.',
    '.#......#',
    '#.......#',
    '#.......#',
    '.#######.',
    '..A.B.C..',
    '.........',
  ],
  server: [
    '.........',
    '.#######.',
    '.#A.####.',
    '.#######.',
    '.........',
    '.#######.',
    '.#B.####.',
    '.#######.',
    '.........',
  ],
  card: [
    '.........',
    '#########',
    '#.......#',
    '#########',
    '#.......#',
    '#.BB....#',
    '#.BB.c.c#',
    '#########',
    '.........',
  ],
  supernova: [
    'A...b...A',
    '....#....',
    '..#.#.#..',
    '...CCC...',
    'b##CCC##b',
    '...CCC...',
    '..#.#.#..',
    '....#....',
    'A...b...A',
  ],
  terminal: [
    '#########',
    '#########',
    '#.......#',
    '#.#.....#',
    '#..#....#',
    '#.#.ABC.#',
    '#.......#',
    '#.......#',
    '#########',
  ],
  rocket: [
    '....#....',
    '...###...',
    '...#o#...',
    '...###...',
    '...###...',
    '..#####..',
    '.#.###.#.',
    '...bAb...',
    '....b....',
  ],
  gear: [
    '...#.#...',
    '.#.###.#.',
    '..#...#..',
    '##.ooo.##',
    '.#.ooo.#.',
    '##.ooo.##',
    '..#...#..',
    '.#.###.#.',
    '...#.#...',
  ],
};

/**
 * The icon of each project, which a `ProjectSquare` shows when it is given only the project.
 */
export const projectIcons: Readonly<Record<PackageType, ProjectIcon>> = {
  siwx: 'sign-in',
  orbit: 'orbit',
  satellite: 'satellite',
  pulsar: 'pulsar',
  quasar: 'cloud',
  nova: 'supernova',
  sdk: 'terminal',
};
