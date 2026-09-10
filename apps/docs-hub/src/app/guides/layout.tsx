import { Footer, Navbar, RemoteLogo } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import type { ReactNode } from 'react';

const LOGO_URL = 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg';

const logo = (
  <RemoteLogo url={LOGO_URL} width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />
);

export const metadata: Metadata = {
  title: {
    default: 'TUWA Guides & Tutorials',
    template: '%s – TUWA Guides',
  },
  description:
    'Comprehensive developer guides, integration blueprints, and architectural tutorials for the TUWA Web3 ecosystem.',
};

/**
 * Nextra Docs Layout shell for Guides.
 */
export default async function GuidesLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <div className="min-h-screen">
      <Layout
        navbar={<Navbar logo={logo} />}
        footer={<Footer logo={logo} />}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/TuwaIO/docs/tree/main/apps/docs-hub"
        navigation={{ prev: true, next: true }}
        sidebar={{ defaultMenuCollapseLevel: 1 }}
      >
        <NextTopLoader color="#6366f1" showSpinner={false} />
        {children}
      </Layout>
    </div>
  );
}
