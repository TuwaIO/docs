import releases from '../generated/releases.json';

/**
 * The latest release tag of a repository, returned by {@link getReleases}.
 */
export interface RepoRelease {
  /** The tag, for example `v1.2.3` */
  tag: string;
  /** Link to the tree of the tag on GitHub */
  url: string;
}

/**
 * The latest `vX.Y.Z` tag of each repository in `RELEASES` of `scripts/build-data.mjs`, which saves them to
 * `src/generated/releases.json` before `next dev` and `next build`. The page makes no requests: the tags are as fresh
 * as the last build.
 * @returns The tag and a link to its tree by entry id of `src/lib/ecosystem.ts`; `null` (or no key) when the tags
 * could not be listed.
 */
export function getReleases(): Record<string, RepoRelease | null> {
  return (releases as { releases: Record<string, RepoRelease | null> }).releases;
}
