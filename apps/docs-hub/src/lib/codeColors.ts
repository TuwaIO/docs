/**
 * The token colours of the GitHub themes of Shiki that are too light or too dark for the paper of the hub, each with
 * the colour the hub shows in its place. Pass it to `codeToHtml` as `colorReplacements`, next to
 * `themes: { light: 'github-light', dark: 'github-dark' }`.
 *
 * The code of the hub has no fill of its own: it stands on the paper, raised or sunken surface of its frame. The
 * themes are made for the white and the black of GitHub, and on these surfaces four colours of the light theme
 * (comments, tags, keywords and variables) and one of the dark theme (comments) fall under 4.5:1, the contrast a text
 * needs. Each is replaced by the same colour mixed with black (light theme) or white (dark theme) only as far as it
 * takes to reach 4.6:1 on the most demanding of the three surfaces. The keys are the colours of the themes in lower
 * case, as Shiki matches them.
 */
export const CODE_COLOR_REPLACEMENTS: Record<'github-light' | 'github-dark', Record<string, string>> = {
  'github-light': {
    // Comments
    '#6a737d': '#606871',
    // Tags and the names of CSS properties
    '#22863a': '#1e7633',
    // Keywords
    '#d73a49': '#bd3340',
    // Variables
    '#e36209': '#ab4a07',
  },
  'github-dark': {
    // Comments
    '#6a737d': '#848c94',
  },
};
