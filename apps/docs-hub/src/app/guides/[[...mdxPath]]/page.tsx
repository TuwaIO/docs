import { notFound } from 'next/navigation';
import { generateStaticParamsFor, importPage } from 'nextra/pages';

import { useMDXComponents as getMDXComponents } from '../../../mdx-components';

export async function generateStaticParams() {
  const getStaticParams = generateStaticParamsFor('mdxPath');
  const params = await getStaticParams();
  return params
    .filter((p) => p.mdxPath?.[0] === 'guides')
    .map((p) => ({
      mdxPath: p.mdxPath.slice(1),
    }));
}

function isAssetOrInternal(mdxPath?: string[]): boolean {
  if (!mdxPath || mdxPath.length === 0) return false;
  if (mdxPath[0] === '_next') return true;
  const lastSegment = mdxPath[mdxPath.length - 1];
  if (lastSegment && lastSegment.includes('.')) return true;
  return false;
}

type PageProps = {
  params: Promise<{
    mdxPath?: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const mdxPath = params.mdxPath;

  if (isAssetOrInternal(mdxPath)) {
    return {};
  }

  const fullPath = ['guides', ...(mdxPath || [])];

  try {
    const { metadata } = await importPage(fullPath);
    return metadata;
  } catch {
    return {};
  }
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: PageProps) {
  const params = await props.params;
  const mdxPath = params.mdxPath;

  if (isAssetOrInternal(mdxPath)) {
    notFound();
  }

  const fullPath = ['guides', ...(mdxPath || [])];

  let result;
  try {
    result = await importPage(fullPath);
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
