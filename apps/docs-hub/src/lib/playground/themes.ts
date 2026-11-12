import type { StyleKit } from './customization';

/** The CSS variables of Nova UI Kit (`@tuwaio/nova-core`), in the order of the editor groups. */
export const THEME_VARIABLES = [
  '--tuwa-bg-primary',
  '--tuwa-bg-secondary',
  '--tuwa-bg-muted',
  '--tuwa-border-primary',
  '--tuwa-border-secondary',
  '--tuwa-border-strong',
  '--tuwa-text-primary',
  '--tuwa-text-secondary',
  '--tuwa-text-tertiary',
  '--tuwa-text-accent',
  '--tuwa-text-on-accent',
  '--tuwa-button-gradient-from',
  '--tuwa-button-gradient-to',
  '--tuwa-button-gradient-from-hover',
  '--tuwa-button-gradient-to-hover',
  '--tuwa-button-primary-bg',
  '--tuwa-button-primary-bg-hover',
  '--tuwa-standart-button-bg',
  '--tuwa-standart-button-hover',
  '--tuwa-success-bg',
  '--tuwa-success-text',
  '--tuwa-success-icon',
  '--tuwa-error-bg',
  '--tuwa-error-text',
  '--tuwa-error-icon',
  '--tuwa-pending-bg',
  '--tuwa-pending-text',
  '--tuwa-pending-icon',
  '--tuwa-info-bg',
  '--tuwa-info-text',
  '--tuwa-info-icon',
  '--tuwa-testnet-icons',
  '--tuwa-scanline',
  '--tuwa-rounded-corners',
  '--tuwa-rounded-full',
  '--tuwa-ring-width',
] as const;

/** A CSS variable of Nova UI Kit. */
export type ThemeVariable = (typeof THEME_VARIABLES)[number];

/**
 * A value for every Nova variable: `#rrggbb` colors, pixel lengths for the corners and the ring. Two colors may be
 * `transparent` ({@link OPTIONAL_COLOR_VARIABLES}), and the scanline, where a theme has one, is a color with an alpha
 * (`rgb(16 16 20 / 0.015)`): lines of an opaque color across every surface would hide it.
 */
export type ThemeValues = Record<ThemeVariable, string>;

/** The variables that hold lengths; every other variable is a color. */
export const LENGTH_VARIABLES: readonly ThemeVariable[] = [
  '--tuwa-rounded-corners',
  '--tuwa-rounded-full',
  '--tuwa-ring-width',
];

/**
 * The colors a theme may leave out (`transparent`): the fill of a standard button, which in paper and ink is a frame
 * with no fill, and the scanlines.
 */
export const OPTIONAL_COLOR_VARIABLES: readonly ThemeVariable[] = ['--tuwa-standart-button-bg', '--tuwa-scanline'];

/** The corners of badges, avatars and dots (`--tuwa-rounded-full`): square, or round. */
export const BADGE_CORNERS = { square: '0px', round: '9999px' } as const;

/** The groups of the theme editor. */
export const THEME_GROUPS: { label: string; variables: ThemeVariable[] }[] = [
  { label: 'Surfaces', variables: THEME_VARIABLES.slice(0, 6) },
  { label: 'Text', variables: THEME_VARIABLES.slice(6, 11) },
  { label: 'Buttons', variables: THEME_VARIABLES.slice(11, 19) },
  { label: 'Statuses', variables: THEME_VARIABLES.slice(19, 31) },
  {
    label: 'Shape',
    variables: [
      '--tuwa-testnet-icons',
      '--tuwa-scanline',
      '--tuwa-rounded-corners',
      '--tuwa-rounded-full',
      '--tuwa-ring-width',
    ],
  },
];

/** The theme presets of the Playground. */
export type ThemeId = 'paper-dark' | 'paper-light' | 'cyberpunk' | 'minimalist' | 'isometric-light' | 'isometric-dark';

/** A theme preset. */
export interface ThemePreset {
  id: ThemeId;
  label: string;
  /** One line for the preset picker. */
  description: string;
  values: ThemeValues;
  /** The style kit picked together with the theme, for a theme drawn for one kit. */
  pairedStyle?: StyleKit;
}

/**
 * The presets: Nova's own dark and light themes (paper and ink), two that show how far the variables go, and the
 * Isometric pair, a line drawing in one ink that the Isometric style kit gives depth.
 */
export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  // The values of `variables.css` of `@tuwaio/nova-core` 0.15 (`.dark`), its status colors written as `#rrggbb`
  'paper-dark': {
    id: 'paper-dark',
    label: 'Paper Dark',
    description: 'The dark theme Nova UI Kit ships with: ink paper, square corners, the cyan of the TUWA logo.',
    values: {
      '--tuwa-bg-primary': '#101014',
      '--tuwa-bg-secondary': '#17181b',
      '--tuwa-bg-muted': '#222327',
      '--tuwa-border-primary': '#2b2c30',
      '--tuwa-border-secondary': '#1d1e22',
      '--tuwa-border-strong': '#55565a',
      '--tuwa-text-primary': '#f2f1ee',
      '--tuwa-text-secondary': '#9d9c9a',
      '--tuwa-text-tertiary': '#77767a',
      '--tuwa-text-accent': '#3ed2ec',
      '--tuwa-text-on-accent': '#101014',
      '--tuwa-button-gradient-from': '#22c3e6',
      '--tuwa-button-gradient-to': '#8ef5ff',
      '--tuwa-button-gradient-from-hover': '#3ed2ec',
      '--tuwa-button-gradient-to-hover': '#9af6ff',
      '--tuwa-button-primary-bg': '#22c3e6',
      '--tuwa-button-primary-bg-hover': '#3ed2ec',
      '--tuwa-standart-button-bg': 'transparent',
      '--tuwa-standart-button-hover': '#222327',
      '--tuwa-success-bg': '#0d542b',
      '--tuwa-success-text': '#7bf1a8',
      '--tuwa-success-icon': '#05df72',
      '--tuwa-error-bg': '#82181a',
      '--tuwa-error-text': '#ffa2a2',
      '--tuwa-error-icon': '#ff6467',
      '--tuwa-pending-bg': '#733e0a',
      '--tuwa-pending-text': '#ffdf20',
      '--tuwa-pending-icon': '#fdc700',
      '--tuwa-info-bg': '#222327',
      '--tuwa-info-text': '#b9b8b5',
      '--tuwa-info-icon': '#77767a',
      '--tuwa-testnet-icons': '#6b655e',
      '--tuwa-scanline': 'rgb(242 241 238 / 0.012)',
      '--tuwa-rounded-corners': '0px',
      '--tuwa-rounded-full': '0px',
      '--tuwa-ring-width': '2px',
    },
  },
  // The values of `variables.css` of `@tuwaio/nova-core` 0.15 (`:root`), its status colors written as `#rrggbb`
  'paper-light': {
    id: 'paper-light',
    label: 'Paper Light',
    description: 'The light theme Nova UI Kit ships with: warm paper, ink, square corners, the TUWA orange.',
    values: {
      '--tuwa-bg-primary': '#faf9f7',
      '--tuwa-bg-secondary': '#f2f1ee',
      '--tuwa-bg-muted': '#e9e8e4',
      '--tuwa-border-primary': '#d6d5d1',
      '--tuwa-border-secondary': '#e4e3df',
      '--tuwa-border-strong': '#a9a8a6',
      '--tuwa-text-primary': '#101014',
      '--tuwa-text-secondary': '#636366',
      '--tuwa-text-tertiary': '#8e8e90',
      '--tuwa-text-accent': '#b93b0a',
      '--tuwa-text-on-accent': '#101014',
      '--tuwa-button-gradient-from': '#f05a14',
      '--tuwa-button-gradient-to': '#ff8a5c',
      '--tuwa-button-gradient-from-hover': '#e34f0d',
      '--tuwa-button-gradient-to-hover': '#f05a14',
      '--tuwa-button-primary-bg': '#f05a14',
      '--tuwa-button-primary-bg-hover': '#e34f0d',
      '--tuwa-standart-button-bg': 'transparent',
      '--tuwa-standart-button-hover': '#e9e8e4',
      '--tuwa-success-bg': '#dcfce7',
      '--tuwa-success-text': '#008236',
      '--tuwa-success-icon': '#00c950',
      '--tuwa-error-bg': '#ffe2e2',
      '--tuwa-error-text': '#c10007',
      '--tuwa-error-icon': '#fb2c36',
      '--tuwa-pending-bg': '#fef9c2',
      '--tuwa-pending-text': '#894b00',
      '--tuwa-pending-icon': '#d08700',
      '--tuwa-info-bg': '#e9e8e4',
      '--tuwa-info-text': '#55545a',
      '--tuwa-info-icon': '#8e8e90',
      '--tuwa-testnet-icons': '#6b655e',
      '--tuwa-scanline': 'rgb(16 16 20 / 0.015)',
      '--tuwa-rounded-corners': '0px',
      '--tuwa-rounded-full': '0px',
      '--tuwa-ring-width': '2px',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon magenta and cyan on deep violet, with square corners.',
    values: {
      '--tuwa-bg-primary': '#0a0014',
      '--tuwa-bg-secondary': '#140428',
      '--tuwa-bg-muted': '#22083d',
      '--tuwa-border-primary': '#3b0f6b',
      '--tuwa-border-secondary': '#22083d',
      '--tuwa-border-strong': '#7a2bd6',
      '--tuwa-text-primary': '#f5f3ff',
      '--tuwa-text-secondary': '#c4b5fd',
      '--tuwa-text-tertiary': '#8b7fb8',
      '--tuwa-text-accent': '#00f0ff',
      '--tuwa-text-on-accent': '#0a0014',
      '--tuwa-button-gradient-from': '#ff2bd6',
      '--tuwa-button-gradient-to': '#00f0ff',
      '--tuwa-button-gradient-from-hover': '#ff5ce1',
      '--tuwa-button-gradient-to-hover': '#4df6ff',
      '--tuwa-button-primary-bg': '#ff2bd6',
      '--tuwa-button-primary-bg-hover': '#ff5ce1',
      '--tuwa-standart-button-bg': '#22083d',
      '--tuwa-standart-button-hover': '#2f0c52',
      '--tuwa-success-bg': '#003b2f',
      '--tuwa-success-text': '#00ffa3',
      '--tuwa-success-icon': '#00ffa3',
      '--tuwa-error-bg': '#3d0021',
      '--tuwa-error-text': '#ff4d8d',
      '--tuwa-error-icon': '#ff2b6e',
      '--tuwa-pending-bg': '#3a2a00',
      '--tuwa-pending-text': '#ffe600',
      '--tuwa-pending-icon': '#ffd000',
      '--tuwa-info-bg': '#22083d',
      '--tuwa-info-text': '#c4b5fd',
      '--tuwa-info-icon': '#a78bfa',
      '--tuwa-testnet-icons': '#8b7fb8',
      '--tuwa-scanline': 'transparent',
      '--tuwa-rounded-corners': '0px',
      '--tuwa-rounded-full': '0px',
      '--tuwa-ring-width': '2px',
    },
  },
  minimalist: {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Monochrome zinc, color only for statuses, thin rings.',
    values: {
      '--tuwa-bg-primary': '#fafafa',
      '--tuwa-bg-secondary': '#f4f4f5',
      '--tuwa-bg-muted': '#e4e4e7',
      '--tuwa-border-primary': '#e4e4e7',
      '--tuwa-border-secondary': '#f4f4f5',
      '--tuwa-border-strong': '#a1a1aa',
      '--tuwa-text-primary': '#18181b',
      '--tuwa-text-secondary': '#52525b',
      '--tuwa-text-tertiary': '#a1a1aa',
      '--tuwa-text-accent': '#18181b',
      '--tuwa-text-on-accent': '#fafafa',
      '--tuwa-button-gradient-from': '#18181b',
      '--tuwa-button-gradient-to': '#3f3f46',
      '--tuwa-button-gradient-from-hover': '#27272a',
      '--tuwa-button-gradient-to-hover': '#52525b',
      '--tuwa-button-primary-bg': '#18181b',
      '--tuwa-button-primary-bg-hover': '#27272a',
      '--tuwa-standart-button-bg': '#f4f4f5',
      '--tuwa-standart-button-hover': '#e4e4e7',
      '--tuwa-success-bg': '#f4f4f5',
      '--tuwa-success-text': '#15803d',
      '--tuwa-success-icon': '#16a34a',
      '--tuwa-error-bg': '#f4f4f5',
      '--tuwa-error-text': '#b91c1c',
      '--tuwa-error-icon': '#dc2626',
      '--tuwa-pending-bg': '#f4f4f5',
      '--tuwa-pending-text': '#a16207',
      '--tuwa-pending-icon': '#ca8a04',
      '--tuwa-info-bg': '#f4f4f5',
      '--tuwa-info-text': '#52525b',
      '--tuwa-info-icon': '#71717a',
      '--tuwa-testnet-icons': '#a1a1aa',
      '--tuwa-scanline': 'transparent',
      '--tuwa-rounded-corners': '2px',
      '--tuwa-rounded-full': '9999px',
      '--tuwa-ring-width': '1px',
    },
  },
  'isometric-light': {
    id: 'isometric-light',
    label: 'Isometric Light',
    description: 'One dark ink on white with square corners, a line drawing. Picks the Isometric style.',
    pairedStyle: 'iso',
    values: {
      '--tuwa-bg-primary': '#ffffff',
      '--tuwa-bg-secondary': '#ffffff',
      '--tuwa-bg-muted': '#eef0f5',
      '--tuwa-border-primary': '#101423',
      '--tuwa-border-secondary': '#d5d8e0',
      '--tuwa-border-strong': '#101423',
      '--tuwa-text-primary': '#101423',
      '--tuwa-text-secondary': '#4b5163',
      '--tuwa-text-tertiary': '#8a90a2',
      '--tuwa-text-accent': '#101423',
      '--tuwa-text-on-accent': '#ffffff',
      '--tuwa-button-gradient-from': '#101423',
      '--tuwa-button-gradient-to': '#101423',
      '--tuwa-button-gradient-from-hover': '#2a3043',
      '--tuwa-button-gradient-to-hover': '#2a3043',
      '--tuwa-button-primary-bg': '#101423',
      '--tuwa-button-primary-bg-hover': '#2a3043',
      '--tuwa-standart-button-bg': '#eef0f5',
      '--tuwa-standart-button-hover': '#e2e5ec',
      '--tuwa-success-bg': '#e7f6ec',
      '--tuwa-success-text': '#0b6e35',
      '--tuwa-success-icon': '#15803d',
      '--tuwa-error-bg': '#fdecec',
      '--tuwa-error-text': '#b42318',
      '--tuwa-error-icon': '#e5484d',
      '--tuwa-pending-bg': '#fff6dc',
      '--tuwa-pending-text': '#8a5300',
      '--tuwa-pending-icon': '#a16207',
      '--tuwa-info-bg': '#eef0f5',
      '--tuwa-info-text': '#4b5163',
      '--tuwa-info-icon': '#6b7184',
      '--tuwa-testnet-icons': '#8a90a2',
      '--tuwa-scanline': 'transparent',
      '--tuwa-rounded-corners': '0px',
      '--tuwa-rounded-full': '0px',
      '--tuwa-ring-width': '1px',
    },
  },
  'isometric-dark': {
    id: 'isometric-dark',
    label: 'Isometric Dark',
    description: 'The Isometric drawing on deep navy, in dimmed gray lines. Picks the Isometric style.',
    pairedStyle: 'iso',
    values: {
      '--tuwa-bg-primary': '#141829',
      '--tuwa-bg-secondary': '#141829',
      '--tuwa-bg-muted': '#1f2438',
      '--tuwa-border-primary': '#363c52',
      '--tuwa-border-secondary': '#242a3c',
      '--tuwa-border-strong': '#6e7489',
      '--tuwa-text-primary': '#e8eaf2',
      '--tuwa-text-secondary': '#a5abbd',
      '--tuwa-text-tertiary': '#6e7489',
      '--tuwa-text-accent': '#c8cddb',
      '--tuwa-text-on-accent': '#e8eaf2',
      '--tuwa-button-gradient-from': '#454c66',
      '--tuwa-button-gradient-to': '#454c66',
      '--tuwa-button-gradient-from-hover': '#525a77',
      '--tuwa-button-gradient-to-hover': '#525a77',
      '--tuwa-button-primary-bg': '#454c66',
      '--tuwa-button-primary-bg-hover': '#525a77',
      '--tuwa-standart-button-bg': '#1f2438',
      '--tuwa-standart-button-hover': '#2a3043',
      '--tuwa-success-bg': '#0f2e1d',
      '--tuwa-success-text': '#7be3a2',
      '--tuwa-success-icon': '#3ccb7f',
      '--tuwa-error-bg': '#3a1216',
      '--tuwa-error-text': '#ff9b9b',
      '--tuwa-error-icon': '#ff6b6b',
      '--tuwa-pending-bg': '#3a2c07',
      '--tuwa-pending-text': '#ffd866',
      '--tuwa-pending-icon': '#f5c242',
      '--tuwa-info-bg': '#1f2438',
      '--tuwa-info-text': '#c8cddb',
      '--tuwa-info-icon': '#a5abbd',
      '--tuwa-testnet-icons': '#6e7489',
      '--tuwa-scanline': 'transparent',
      '--tuwa-rounded-corners': '0px',
      '--tuwa-rounded-full': '0px',
      '--tuwa-ring-width': '1px',
    },
  },
};

/** Whether a value is a theme preset id, for example from the query string. */
export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value !== null && value !== undefined && Object.hasOwn(THEME_PRESETS, value);
}

/**
 * Nova's own theme for a light or a dark page: the theme of the stage while the reader has picked none, so the stage
 * follows the theme of the hub.
 * @param dark - Whether the page is dark.
 * @returns The preset id.
 */
export function novaThemeFor(dark: boolean): ThemeId {
  return dark ? 'paper-dark' : 'paper-light';
}

/**
 * The scanline of Nova for a theme of that brightness: what "scanlines on" means for a theme that has none.
 * @param values - The theme.
 * @returns The color of the lines, with its alpha.
 */
export function scanlineFor(values: ThemeValues): string {
  return THEME_PRESETS[novaThemeFor(isDark(values['--tuwa-bg-primary']))].values['--tuwa-scanline'];
}

/** Whether a `#rrggbb` color is dark, by its brightness. */
function isDark(hex: string): boolean {
  const [red, green, blue] = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
  return 0.299 * (red ?? 0) + 0.587 * (green ?? 0) + 0.114 * (blue ?? 0) < 128;
}

/** Whether a preset draws on a dark background, by the brightness of `--tuwa-bg-primary`. */
function isDarkTheme(id: ThemeId): boolean {
  return isDark(THEME_PRESETS[id].values['--tuwa-bg-primary']);
}

/** The presets drawn for a style kit; empty for a kit that fits every theme. */
function themesOf(style: StyleKit): ThemeId[] {
  return Object.values(THEME_PRESETS)
    .filter((preset) => preset.pairedStyle === style)
    .map((preset) => preset.id);
}

/**
 * The theme and the style kit after a theme is picked. A theme drawn for one kit (Isometric) picks that kit, and a kit
 * drawn for its own themes gives way to Nova on any other theme.
 * @param theme - The picked theme.
 * @param style - The current style kit.
 * @returns The theme and the style kit to show.
 */
export function pickTheme(theme: ThemeId, style: StyleKit): { theme: ThemeId; style: StyleKit } {
  const paired = THEME_PRESETS[theme].pairedStyle;
  if (paired) return { theme, style: paired };
  return { theme, style: themesOf(style).length > 0 ? 'nova' : style };
}

/**
 * The theme and the style kit after a style kit is picked. A kit drawn for its own themes picks one of them, dark after
 * a dark theme, and any other kit leaves such a theme for Nova's own theme of the same brightness.
 * @param style - The picked style kit.
 * @param theme - The current theme.
 * @returns The theme and the style kit to show.
 */
export function pickStyle(style: StyleKit, theme: ThemeId): { theme: ThemeId; style: StyleKit } {
  const own = themesOf(style);
  if (own.length > 0) {
    if (own.includes(theme)) return { theme, style };
    return { theme: own.find((id) => isDarkTheme(id) === isDarkTheme(theme)) ?? own[0], style };
  }
  if (THEME_PRESETS[theme].pairedStyle) return { theme: isDarkTheme(theme) ? 'paper-dark' : 'paper-light', style };
  return { theme, style };
}

/**
 * The CSS of a theme, ready to paste after the Nova styles of an app.
 * @param values - The theme.
 * @param name - A label for the comment line.
 * @param selector - Where the variables apply; `:root` for the whole app.
 * @returns The CSS rule.
 */
export function themeCss(values: ThemeValues, name: string, selector = ':root'): string {
  const declarations = THEME_VARIABLES.map((variable) => `  ${variable}: ${values[variable]};`);
  return [`/* Nova UI Kit theme: ${name} */`, `${selector} {`, ...declarations, '}', ''].join('\n');
}
