import { Footer, Navbar, RemoteLogo } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { getPageMap } from 'nextra/page-map';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { Layout } from 'nextra-theme-docs';
import type { ReactNode } from 'react';

import { JsonLd } from '../components/JsonLd';
import { useMDXComponents as getMDXComponents } from '../mdx-components';
import { ORGANIZATION, SITE_URL, WEBSITE_ID, withPageMetadata } from './site';

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
 * static params, the metadata (with the canonical URL, Open Graph and Twitter card of the page) and the page component,
 * which adds `TechArticle` and `BreadcrumbList` structured data. Re-export them from the `page.tsx` of the section.
 *
 * @param section - Name of the content folder, which is also the first URL segment.
 * @param sectionTitle - Title of the section in the breadcrumbs, as in the navbar.
 * @returns `generateStaticParams`, `generateMetadata` and `Page`.
 */
export function createSectionPage(section: string, sectionTitle: string) {
  const Wrapper = getMDXComponents().wrapper;
  const routeOf = (mdxPath?: string[]) => `/${[section, ...(mdxPath ?? [])].join('/')}`;

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
      return withPageMetadata(metadata, routeOf(mdxPath));
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
    const route = routeOf(params.mdxPath);
    const breadcrumbs = [
      { name: 'Docs Hub', url: SITE_URL },
      { name: sectionTitle, url: `${SITE_URL}/${section}` },
      ...(params.mdxPath?.length ? [{ name: metadata.title, url: `${SITE_URL}${route}` }] : []),
    ];
    return (
      <>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TechArticle',
                headline: metadata.title,
                description: metadata.description,
                url: `${SITE_URL}${route}`,
                inLanguage: 'en',
                isPartOf: { '@id': WEBSITE_ID },
                author: ORGANIZATION,
                publisher: ORGANIZATION,
                ...(typeof metadata.timestamp === 'number' && {
                  dateModified: new Date(metadata.timestamp).toISOString(),
                }),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs.map((crumb, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: crumb.name,
                  item: crumb.url,
                })),
              },
            ],
          }}
        />
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </>
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
