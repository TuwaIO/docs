import './globals.css';

import { PreferenceExpiry } from '@tuwaio/docs-ui';
import { localeOfPath } from '@tuwaio/docs-ui/locale';
import type { Metadata } from 'next';
import { Head } from 'nextra/components';
import type { ReactNode } from 'react';

import { SITE_URL, X_HANDLE } from '../lib/site';
import { Providers } from './providers';

/** The metadata of the whole site. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TUWA Docs Hub — Modular Headless Web3 Infrastructure',
  description:
    'Central documentation gateway for the TUWA Web3 ecosystem. Explore SIWX, Orbit, Satellite, Pulsar, Nova, Quasar (managed cloud or self-hosted Community Edition), and the TUWA SDK.',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://tuwa.io/brand/icon0.svg',
    shortcut: 'https://tuwa.io/brand/web-app-manifest-512x512.png',
    apple: 'https://tuwa.io/brand/web-app-manifest-512x512.png',
  },
  appleWebApp: {
    title: 'TUWA Docs Hub',
  },
  keywords: [
    'tuwa',
    'web3',
    'documentation',
    'headless',
    'state management',
    'transaction tracking',
    'orbit',
    'satellite',
    'pulsar',
    'nova',
    'quasar',
    'quasar community edition',
    'self-hosted transaction indexer',
    'siwx',
    'zustand',
    'wagmi',
    'viem',
    'solana',
    'typescript',
  ],
  authors: [{ name: 'TUWA', url: 'https://github.com/TuwaIO' }],
  openGraph: {
    title: 'TUWA Docs Hub',
    description: 'Central documentation gateway for the TUWA Web3 ecosystem.',
    url: 'https://docs.tuwa.io/',
    siteName: 'TUWA Docs Hub',
    images: [
      {
        url: 'https://tuwa.io/brand/preview-logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: X_HANDLE,
    title: 'TUWA Docs Hub',
    description: 'Central documentation gateway for the TUWA Web3 ecosystem.',
    images: ['https://tuwa.io/brand/preview-logo.png'],
  },
};

/**
 * The document of every page: a root layout of the site renders it with the language of its URLs, so that the prerendered HTML
 * names its language for search engines and for the search index, before any script runs.
 *
 * @param props.lang - The language of the page.
 * @param props.children - The page.
 * @returns The document.
 */
export function RootDocument({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      {/* Defines the Nextra theme variables; without --nextra-bg the mobile menu of the Nextra pages is transparent.
          The background colors are those of the body below. Dark mode uses the TUWA cosmic midnight blue (#0a0e27). */}
      <Head backgroundColor={{ light: '#ffffff', dark: '#0a0e27' }}>
        {/* Before the theme script of next-themes and the tabs of Nextra: the theme, guide tab and locale are kept 30 days
            after they are chosen (Cookie Policy) */}
        <PreferenceExpiry keys={['theme', 'tuwa-guide-network', 'tuwa-locale']} />
      </Head>
      <body className={`antialiased bg-[var(--tuwa-bg-primary)] dark:bg-[#0a0e27] text-[var(--tuwa-text-primary)]`}>
        <Providers urlLocale={localeOfPath(`/${lang}`) ?? undefined}>{children}</Providers>
      </body>
    </html>
  );
}
