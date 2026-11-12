/**
 * The column of the main page and its footer: 1120px wide (1232px from 1600px), with side margins of 16px on phones,
 * 32px from 768px, 48px from 1280px and 56px from 1600px.
 */
export const homeContentClassName =
  'mx-auto w-full max-w-[1120px] px-4 md:px-8 xl:px-12 min-[1600px]:max-w-[1232px] min-[1600px]:px-14';

/**
 * The frame of the column of the main page from 1280px, where the page has room around it: a line of 1px down each of
 * its sides, which the rules of the sections meet with a cross. Narrower, the rules run from edge to edge of the screen.
 */
export const homeFrameClassName = 'relative xl:border-x xl:border-[var(--tuwa-border-primary)]';

/**
 * How the sections of the main page lie over one another, by the number of the section: an earlier section lies over a
 * later one. What floats below a row of a section (the preview of a package) reaches into the next section, and without
 * this the bar of that section, drawn later, would lie over it. Inside its own section such a part stays under the bar
 * of that section, which sticks above it.
 */
export const homeSectionLayer: Readonly<Record<1 | 2 | 3, string>> = {
  1: 'relative z-[3]',
  2: 'relative z-[2]',
  3: 'relative z-[1]',
};

/**
 * A part that runs across the whole column, over its side margins (from line to line of the frame from 1280px), with
 * its content on the margins of the column.
 */
export const homeBleedClassName =
  '-mx-4 px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12 min-[1600px]:-mx-14 min-[1600px]:px-14';
