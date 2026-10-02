/** The CSS variables of Nova UI Kit (`@tuwaio/nova-core`), in the order of the editor groups. */
export const THEME_VARIABLES = [
  '--tuwa-bg-primary',
  '--tuwa-bg-secondary',
  '--tuwa-bg-muted',
  '--tuwa-border-primary',
  '--tuwa-border-secondary',
  '--tuwa-text-primary',
  '--tuwa-text-secondary',
  '--tuwa-text-tertiary',
  '--tuwa-text-accent',
  '--tuwa-text-on-accent',
  '--tuwa-button-gradient-from',
  '--tuwa-button-gradient-to',
  '--tuwa-button-gradient-from-hover',
  '--tuwa-button-gradient-to-hover',
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
  '--tuwa-rounded-corners',
  '--tuwa-ring-width',
] as const;

/** A CSS variable of Nova UI Kit. */
export type ThemeVariable = (typeof THEME_VARIABLES)[number];

/** A value for every Nova variable: `#rrggbb` colors, pixel lengths for the corners and the ring. */
export type ThemeValues = Record<ThemeVariable, string>;

/** The variables that hold lengths; every other variable is a color. */
export const LENGTH_VARIABLES: readonly ThemeVariable[] = ['--tuwa-rounded-corners', '--tuwa-ring-width'];

/** The groups of the theme editor. */
export const THEME_GROUPS: { label: string; variables: ThemeVariable[] }[] = [
  { label: 'Surfaces', variables: THEME_VARIABLES.slice(0, 5) },
  { label: 'Text', variables: THEME_VARIABLES.slice(5, 10) },
  { label: 'Buttons', variables: THEME_VARIABLES.slice(10, 16) },
  { label: 'Statuses', variables: THEME_VARIABLES.slice(16, 28) },
  { label: 'Shape', variables: ['--tuwa-testnet-icons', '--tuwa-rounded-corners', '--tuwa-ring-width'] },
];

/** The theme presets of the Playground. */
export type ThemeId = 'default-dark' | 'clean-light' | 'cyberpunk' | 'minimalist';

/** A theme preset. */
export interface ThemePreset {
  id: ThemeId;
  label: string;
  /** One line for the preset picker. */
  description: string;
  values: ThemeValues;
}

/** The presets: Nova's own dark and light themes, and two that show how far the variables go. */
export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  'default-dark': {
    id: 'default-dark',
    label: 'Default Dark',
    description: 'The dark theme Nova UI Kit ships with.',
    values: {
      '--tuwa-bg-primary': '#101828',
      '--tuwa-bg-secondary': '#1e2939',
      '--tuwa-bg-muted': '#364153',
      '--tuwa-border-primary': '#364153',
      '--tuwa-border-secondary': '#1e2939',
      '--tuwa-text-primary': '#f9fafb',
      '--tuwa-text-secondary': '#99a1af',
      '--tuwa-text-tertiary': '#6a7282',
      '--tuwa-text-accent': '#51a2ff',
      '--tuwa-text-on-accent': '#ffffff',
      '--tuwa-button-gradient-from': '#2b7fff',
      '--tuwa-button-gradient-to': '#ad46ff',
      '--tuwa-button-gradient-from-hover': '#155dfc',
      '--tuwa-button-gradient-to-hover': '#9810fa',
      '--tuwa-standart-button-bg': '#364153',
      '--tuwa-standart-button-hover': '#1e2939',
      '--tuwa-success-bg': '#0d542b',
      '--tuwa-success-text': '#7bf1a8',
      '--tuwa-success-icon': '#05df72',
      '--tuwa-error-bg': '#82181a',
      '--tuwa-error-text': '#ffa2a2',
      '--tuwa-error-icon': '#ff6467',
      '--tuwa-pending-bg': '#733e0a',
      '--tuwa-pending-text': '#ffdf20',
      '--tuwa-pending-icon': '#fdc700',
      '--tuwa-info-bg': '#364153',
      '--tuwa-info-text': '#d1d5dc',
      '--tuwa-info-icon': '#99a1af',
      '--tuwa-testnet-icons': '#c4bfb8',
      '--tuwa-rounded-corners': '4px',
      '--tuwa-ring-width': '2px',
    },
  },
  'clean-light': {
    id: 'clean-light',
    label: 'Clean Light',
    description: 'The light theme Nova UI Kit ships with.',
    values: {
      '--tuwa-bg-primary': '#ffffff',
      '--tuwa-bg-secondary': '#f9fafb',
      '--tuwa-bg-muted': '#f3f4f6',
      '--tuwa-border-primary': '#e5e7eb',
      '--tuwa-border-secondary': '#f3f4f6',
      '--tuwa-text-primary': '#101828',
      '--tuwa-text-secondary': '#6a7282',
      '--tuwa-text-tertiary': '#99a1af',
      '--tuwa-text-accent': '#155dfc',
      '--tuwa-text-on-accent': '#ffffff',
      '--tuwa-button-gradient-from': '#155dfc',
      '--tuwa-button-gradient-to': '#9810fa',
      '--tuwa-button-gradient-from-hover': '#1447e6',
      '--tuwa-button-gradient-to-hover': '#8200db',
      '--tuwa-standart-button-bg': '#f3f4f6',
      '--tuwa-standart-button-hover': '#e5e7eb',
      '--tuwa-success-bg': '#dcfce7',
      '--tuwa-success-text': '#008236',
      '--tuwa-success-icon': '#00c950',
      '--tuwa-error-bg': '#ffe2e2',
      '--tuwa-error-text': '#c10007',
      '--tuwa-error-icon': '#fb2c36',
      '--tuwa-pending-bg': '#fef9c2',
      '--tuwa-pending-text': '#894b00',
      '--tuwa-pending-icon': '#d08700',
      '--tuwa-info-bg': '#f3f4f6',
      '--tuwa-info-text': '#4a5565',
      '--tuwa-info-icon': '#6a7282',
      '--tuwa-testnet-icons': '#c4bfb8',
      '--tuwa-rounded-corners': '4px',
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
      '--tuwa-text-primary': '#f5f3ff',
      '--tuwa-text-secondary': '#c4b5fd',
      '--tuwa-text-tertiary': '#8b7fb8',
      '--tuwa-text-accent': '#00f0ff',
      '--tuwa-text-on-accent': '#0a0014',
      '--tuwa-button-gradient-from': '#ff2bd6',
      '--tuwa-button-gradient-to': '#00f0ff',
      '--tuwa-button-gradient-from-hover': '#ff5ce1',
      '--tuwa-button-gradient-to-hover': '#4df6ff',
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
      '--tuwa-rounded-corners': '0px',
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
      '--tuwa-text-primary': '#18181b',
      '--tuwa-text-secondary': '#52525b',
      '--tuwa-text-tertiary': '#a1a1aa',
      '--tuwa-text-accent': '#18181b',
      '--tuwa-text-on-accent': '#fafafa',
      '--tuwa-button-gradient-from': '#18181b',
      '--tuwa-button-gradient-to': '#3f3f46',
      '--tuwa-button-gradient-from-hover': '#27272a',
      '--tuwa-button-gradient-to-hover': '#52525b',
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
      '--tuwa-rounded-corners': '2px',
      '--tuwa-ring-width': '1px',
    },
  },
};

/** Whether a value is a theme preset id, for example from the query string. */
export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value !== null && value !== undefined && Object.hasOwn(THEME_PRESETS, value);
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
