import './globals.css';

import { PreferenceExpiry } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import { Head } from 'nextra/components';
import type { ReactNode } from 'react';

import { SITE_URL, X_HANDLE } from '../lib/site';
import { Providers } from './providers';

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Defines the Nextra theme variables; without --nextra-bg the mobile menu of the Nextra pages is transparent.
          The background colors are those of the body below. */}
      <Head backgroundColor={{ light: '#ffffff', dark: '#030303' }}>
        {/* Before the theme script of next-themes and the tabs of Nextra: the theme and the guide tab are kept 30 days
            after they are chosen (Cookie Policy) */}
        <PreferenceExpiry keys={['theme', 'tuwa-guide-network']} />
      </Head>
      <body className={`antialiased bg-[var(--tuwa-bg-primary)] dark:bg-[#030303] text-[var(--tuwa-text-primary)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
