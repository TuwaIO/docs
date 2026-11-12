/**
 * The paper and ink of the hub for the API reference of Scalar (its `customCss`): Scalar draws itself from its own
 * custom properties, and here each of them takes a token of the hub, so the reference follows the light and the dark
 * theme with the rest of the page.
 *
 * - The surfaces are the paper of the page (raised for cards, sunken for wells), the text is ink, the lines are the
 *   lines of 1px of the hub, the links and the focus ring are the accent.
 * - Every corner is square and nothing casts a shadow.
 * - The fonts are those of the hub (Geist and Geist Mono, served by the site itself).
 * - The open item of the sidebar is a block of ink, like the open tab of the configurator (by Scalar's class of that
 *   item; were the class renamed, the item would keep ink text on a breath of ink).
 * - Scalar draws the example of a request as a dark card in the light theme (a part with its own `dark-mode`): here
 *   every such part takes the same tokens, so the card is code on the raised paper, like the code blocks of the guides.
 * - A method that reads (`GET`) is ink; `POST` and `DELETE` keep the success and error colours of Nova; what is left of
 *   Scalar's colours (the tokens of the code) is ink or the accent.
 * - The links of the sidebar take their own colours back from the rule of the docs theme that paints every link of an
 *   article in the accent.
 * - The headings inside the client (the window that sends a request) keep the size of a form, not of a page.
 * - What Scalar keeps in sight while the page scrolls stands under the header of the site.
 * - The method of the open item of the sidebar is paper on its block of ink.
 */
export const SCALAR_PAPER_INK_CSS = `
/* The header of the site stays over the page: what Scalar keeps in sight while the page scrolls (its sidebar with the
   search, its bar on phones) stands under that header, not under the top of the window, and a link to a section
   lands below it */
.scalar-app {
  --scalar-custom-header-height: var(--nextra-navbar-height, 64px);
}

.scalar-app,
.scalar-app .light-mode,
.scalar-app .dark-mode {
  --scalar-font: var(--tuwa-font-sans);
  --scalar-font-code: var(--tuwa-font-mono);

  --scalar-radius: 0;
  --scalar-radius-md: 0;
  --scalar-radius-lg: 0;
  --scalar-radius-xl: 0;
  --scalar-radius-2xl: 0;
  --scalar-radius-3xl: 0;
  --scalar-radius-full: 0;
  --scalar-radius-max: 0;
  --scalar-shadow-1: none;
  --scalar-shadow-2: none;

  --scalar-background-1: var(--tuwa-docs-paper);
  --scalar-background-2: var(--tuwa-docs-raised);
  --scalar-background-3: var(--tuwa-docs-sunken);
  --scalar-background-4: var(--tuwa-docs-sunken);
  --scalar-background-accent: color-mix(in srgb, var(--tuwa-text-accent) 10%, transparent);

  --scalar-color-1: var(--tuwa-text-primary);
  --scalar-color-2: var(--tuwa-text-secondary);
  --scalar-color-3: var(--tuwa-text-tertiary);
  --scalar-color-accent: var(--tuwa-text-accent);
  --scalar-border-color: var(--tuwa-border-primary);

  --scalar-link-color: var(--tuwa-text-accent);
  --scalar-link-color-hover: var(--tuwa-text-accent);
  --scalar-link-color-visited: var(--tuwa-text-accent);
  --scalar-focus-color: var(--tuwa-text-accent);

  --scalar-button-1: var(--tuwa-button-primary-bg);
  --scalar-button-1-color: var(--tuwa-text-on-accent);
  --scalar-button-1-hover: var(--tuwa-button-primary-bg-hover);

  --scalar-tooltip-background: var(--tuwa-text-primary);
  --scalar-tooltip-color: var(--tuwa-docs-paper);
  --scalar-scrollbar-color: var(--tuwa-border-strong);
  --scalar-scrollbar-color-active: var(--tuwa-text-secondary);

  --scalar-sidebar-background-1: var(--tuwa-docs-paper);
  --scalar-sidebar-color-1: var(--tuwa-text-primary);
  --scalar-sidebar-color-2: var(--tuwa-text-secondary);
  --scalar-sidebar-color-active: var(--tuwa-text-primary);
  --scalar-sidebar-border-color: var(--tuwa-border-primary);
  --scalar-sidebar-item-hover-background: color-mix(in srgb, var(--tuwa-text-primary) 3.5%, transparent);
  --scalar-sidebar-item-hover-color: var(--tuwa-text-primary);
  --scalar-sidebar-item-active-background: color-mix(in srgb, var(--tuwa-text-primary) 6%, transparent);
  --scalar-sidebar-indent-border: var(--tuwa-border-primary);
  --scalar-sidebar-indent-border-hover: var(--tuwa-border-strong);
  --scalar-sidebar-indent-border-active: var(--tuwa-text-primary);
  --scalar-sidebar-search-background: var(--tuwa-docs-raised);
  --scalar-sidebar-search-border-color: var(--tuwa-border-primary);
  --scalar-sidebar-search-color: var(--tuwa-text-secondary);

  --scalar-color-blue: var(--tuwa-text-primary);
  --scalar-color-green: var(--tuwa-success-text);
  --scalar-color-red: var(--tuwa-error-text);
  --scalar-color-danger: var(--tuwa-error-text);
  --scalar-color-orange: var(--tuwa-text-accent);
  --scalar-color-yellow: var(--tuwa-text-accent);
  --scalar-color-purple: var(--tuwa-text-secondary);
  --scalar-color-query: var(--tuwa-text-secondary);
}

/* Square everywhere: Scalar rounds some parts (pills, switches, dots) with fixed radii, not its radius properties */
.scalar-app *,
.scalar-app *::before,
.scalar-app *::after {
  border-radius: 0 !important;
}

/* The docs theme paints every link of an article in the accent: the items of the sidebar are ink, the open one a
   block of ink with paper text */
.scalar-app .t-doc__sidebar a {
  color: var(--scalar-sidebar-color-2) !important;
}
.scalar-app .t-doc__sidebar a:hover,
.scalar-app .t-doc__sidebar a.text-sidebar-c-active {
  color: var(--scalar-sidebar-color-1) !important;
}
.scalar-app .t-doc__sidebar a.bg-sidebar-b-active {
  background-color: var(--tuwa-text-primary) !important;
  color: var(--tuwa-docs-paper) !important;
  /* The method of the open item, on its block of ink: a method in ink (GET) could not be seen there, and the green of
     POST was faint on it */
  --scalar-color-blue: var(--tuwa-docs-paper);
  --scalar-color-green: var(--tuwa-docs-paper);
  --scalar-color-red: var(--tuwa-docs-paper);
  --scalar-color-orange: var(--tuwa-docs-paper);
  --scalar-color-yellow: var(--tuwa-docs-paper);
  --scalar-color-purple: var(--tuwa-docs-paper);
}

/* The docs theme sizes the headings of an article as the headings of a page: inside the client of Scalar (the window
   that sends a request) the headings name the parts of a form, and keep the size of the text around them */
.scalar-app .scalar-client :is(h1, h2, h3, h4, h5, h6) {
  font-size: inherit !important;
  letter-spacing: normal !important;
}
`;
