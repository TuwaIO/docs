import './globals.css';

import { RemoteLogo } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const navbarLogo = <RemoteLogo width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />;

export const metadata: Metadata = {
  title: 'TUWA Docs Hub — Modular Headless Web3 Infrastructure',
  description:
    'Central documentation gateway for the TUWA Web3 ecosystem. Explore Orbit, Satellite, Pulsar, Nova, Quasar, and the TUWA SDK.',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/icon0.svg',
    shortcut: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/web-app-manifest-512x512.png',
    apple: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/web-app-manifest-512x512.png',
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
        url: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TUWA Docs Hub',
    description: 'Central documentation gateway for the TUWA Web3 ecosystem.',
    images: ['https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[var(--tuwa-bg-primary)] dark:bg-[#030303] text-[var(--tuwa-text-primary)]`}
      >
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Header logo={navbarLogo} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
