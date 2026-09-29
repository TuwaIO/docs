/**
 * The latest release tag of a repository, returned by {@link fetchLatestTag}.
 */
export interface RepoRelease {
  /** The tag, for example `v1.2.3` */
  tag: string;
  /** Link to the tree of the tag on GitHub */
  url: string;
}

const SEMVER_TAG = /^v(\d+)\.(\d+)\.(\d+)$/;

function compareSemver(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/**
 * Latest `vX.Y.Z` git tag of a public GitHub repository, refreshed at most once per hour.
 * Tags are compared numerically, since the API's lexical order puts `v0.0.10` before `v0.0.9`.
 * Set `GITHUB_TOKEN` to lift the unauthenticated limit of 60 requests per hour per IP.
 * @param repo - Repository slug, e.g. `TuwaIO/quasar-community`.
 * @returns The newest tag and a link to its tree, or `null` when the API is unavailable.
 */
export async function fetchLatestTag(repo: string): Promise<RepoRelease | null> {
  try {
    const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${repo}/tags?per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const tags = (await res.json()) as { name: string }[];
    let latest: { tag: string; version: number[] } | null = null;

    for (const { name } of tags) {
      const match = SEMVER_TAG.exec(name);
      if (!match) continue;
      const version = match.slice(1).map(Number);
      if (!latest || compareSemver(version, latest.version) > 0) {
        latest = { tag: name, version };
      }
    }

    return latest ? { tag: latest.tag, url: `https://github.com/${repo}/tree/${latest.tag}` } : null;
  } catch {
    return null;
  }
}
