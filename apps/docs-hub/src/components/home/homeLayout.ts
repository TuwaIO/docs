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
 * A part that runs across the whole column, over its side margins (from line to line of the frame from 1280px), with
 * its content on the margins of the column.
 */
export const homeBleedClassName =
  '-mx-4 px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12 min-[1600px]:-mx-14 min-[1600px]:px-14';
