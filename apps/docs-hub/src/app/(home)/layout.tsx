import { RemoteLogo } from '@tuwaio/docs-ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

const navbarLogo = (
  <Link href="/" className="hover:opacity-80 transition-opacity duration-200" aria-label="TUWA Docs">
    <RemoteLogo width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />
  </Link>
);

/**
 * Layout for the main Docs Hub landing portal.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header logo={navbarLogo} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
