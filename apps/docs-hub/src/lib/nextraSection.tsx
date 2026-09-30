import { Footer, Navbar, RemoteLogo } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { getPageMap } from 'nextra/page-map';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { Layout } from 'nextra-theme-docs';
import type { ReactNode } from 'react';

import { useMDXComponents as getMDXComponents } from '../mdx-components';

const LOGO_URL = 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg';

const logo = (
  <RemoteLogo url={LOGO_URL} width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />
);

/** Route params of the `[[...mdxPath]]` page of a section. */
export type SectionPageProps = {
  params: Promise<{
    mdxPath?: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Checks whether a path requested from a section route is a static asset or a Next.js internal path.
 *
 * @param mdxPath - Path segments after the section.
 * @returns `true` for `_next/...` and for paths whose last segment has a file extension.
 */
function isAssetOrInternal(mdxPath?: string[]): boolean {
  if (!mdxPath || mdxPath.length === 0) return false;
  if (mdxPath[0] === '_next') return true;
  const lastSegment = mdxPath[mdxPath.length - 1];
  return Boolean(lastSegment && lastSegment.includes('.'));
}

/**
 * Creates the `[[...mdxPath]]` route of a section of MDX pages in `src/content/<section>` (`guides`, `quasar`): the
 * static params, the metadata and the page component. Re-export them from the `page.tsx` of the section.
 *
 * @param section - Name of the content folder, which is also the first URL segment.
 * @returns `generateStaticParams`, `generateMetadata` and `Page`.
 */
export function createSectionPage(section: string) {
  const Wrapper = getMDXComponents().wrapper;

  async function generateStaticParams() {
    const getStaticParams = generateStaticParamsFor('mdxPath');
    const params = await getStaticParams();
    return params.filter((p) => p.mdxPath?.[0] === section).map((p) => ({ mdxPath: p.mdxPath.slice(1) }));
  }

  async function generateMetadata(props: SectionPageProps): Promise<Metadata> {
    const { mdxPath } = await props.params;
    if (isAssetOrInternal(mdxPath)) return {};
    try {
      const { metadata } = await importPage([section, ...(mdxPath || [])]);
      return metadata;
    } catch {
      return {};
    }
  }

  async function Page(props: SectionPageProps) {
    const params = await props.params;
    if (isAssetOrInternal(params.mdxPath)) notFound();

    let result;
    try {
      result = await importPage([section, ...(params.mdxPath || [])]);
    } catch {
      notFound();
    }

    const { default: MDXContent, toc, metadata, sourceCode } = result;
    return (
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}

/**
 * The Nextra docs layout of a section: the TUWA navbar and footer, the sidebar built from the page map of
 * `src/content` and the top loading bar. Side effect: `RemoteLogo` fetches the TUWA logo from jsDelivr (cached by
 * Next.js for 24 hours).
 *
 * @param props - Layout props.
 * @param props.children - The page.
 * @returns The layout.
 */
export async function SectionLayout({ children }: { children: ReactNode }) {
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
