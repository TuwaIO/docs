import { SiteLogo } from '@tuwaio/docs-ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

const navbarLogo = (
  <Link href="/" className="hover:opacity-80 transition-opacity duration-200" aria-label="TUWA Docs">
    <SiteLogo width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />
  </Link>
);

/**
 * The frame of the React pages of the Docs Hub (the main page, comparisons, configurator, playground, policies and the
 * 404 page): the fixed header with the logo, the content and the footer.
 * @param props.children - The page.
 */
export function HubShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header logo={navbarLogo} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
