import type { Metadata } from 'next';

/** Production origin of the hub: the base of canonical URLs, Open Graph, the sitemap and llms.txt */
export const SITE_URL = 'https://docs.tuwa.io';

export const SITE_NAME = 'TUWA Docs Hub';

/** The X account of TUWA, for the `twitter:site` card tag */
export const X_HANDLE = '@tuwa_io';

/** One-paragraph summary of TUWA, shared by the structured data and llms.txt */
export const TUWA_SUMMARY =
  'TUWA is an open-source (Apache-2.0), headless TypeScript toolkit for self-custodial Web3 apps on EVM and Solana: multi-chain sign-in (SIWX, CAIP-122), wallet connection state (Satellite Connect), transaction tracking (Pulsar), React components (Nova UI Kit) and server-side transaction tracking with history and webhooks (Quasar, managed or self-hosted).';

/** The guide for AI coding agents, as plain Markdown */
export const TUWA_AGENTS_URL = 'https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md';

export const OG_IMAGE = {
  url: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
  width: 1200,
  height: 630,
};

/** The TUWA organization in the structured data: the publisher of the hub and the author of its pages */
export const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://tuwa.io/#organization',
  name: 'TUWA',
  url: 'https://tuwa.io',
  logo: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/web-app-manifest-512x512.png',
  sameAs: [
    'https://github.com/TuwaIO',
    'https://x.com/tuwa_io',
    'https://www.reddit.com/user/tuwa_io/',
    'https://www.npmjs.com/org/tuwaio',
  ],
};

/** `@id` of the hub website in the structured data */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Adds the canonical URL, Open Graph and Twitter card of a page to the metadata of its MDX file. Without them, every
 * page would share the Open Graph title of the root layout.
 *
 * @param metadata - Metadata of the page (title and description from its front matter).
 * @param route - Path of the page, for example `/guides/full-stack-react`.
 * @returns The metadata with `alternates.canonical`, `openGraph` and `twitter`.
 */
export function withPageMetadata(metadata: Metadata, route: string): Metadata {
  const title = typeof metadata.title === 'string' ? metadata.title : undefined;
  const description = metadata.description ?? undefined;
  return {
    ...metadata,
    alternates: { canonical: route },
    openGraph: {
      type: 'article',
      url: route,
      siteName: SITE_NAME,
      locale: 'en_US',
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', site: X_HANDLE, title, description, images: [OG_IMAGE.url] },
  };
}
