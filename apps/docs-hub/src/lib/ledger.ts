/** A part of a note: plain text, or the name of a TUWA package to set as code. */
export interface NotePart {
  text: string;
  code: boolean;
}

/**
 * Splits a note into its text and the names of TUWA packages in it, so a deprecation note sets each name as code
 * ("Use `@tuwaio/siwx-react` and `@tuwaio/siwx-server` instead.").
 *
 * @param note - The note.
 * @returns Its parts in order; the empty ones left out.
 */
export function splitPackageNames(note: string): NotePart[] {
  return note
    .split(/(@tuwaio\/[a-z0-9-]+)/)
    .filter(Boolean)
    .map((text) => ({ text, code: /^@tuwaio\//.test(text) }));
}

/**
 * The date of the measurement of the sizes: the same for every package of a build, so the first one found.
 *
 * @param packages - The details of the packages, with the date of their size.
 * @returns The date (YYYY-MM-DD), or `undefined` when no size was measured.
 */
export function sizeMeasuredAt(packages: Record<string, { sizeMeasuredAt?: string }>): string | undefined {
  return Object.values(packages).find((details) => details.sizeMeasuredAt)?.sizeMeasuredAt;
}
