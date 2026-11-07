import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { EvaluateResult } from 'nextra';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { Link } from 'nextra-theme-docs';
import type { ComponentProps } from 'react';

import { LocalizedPage, type LocalizedPageVariant } from './components/LocalizedPage';
import { languageAlternates, localizedPath, type TuwaLocale } from './locale';

/** A translated language of a page: a function that imports its MDX file (`() => import('./uk/index.mdx')`). */
export type LocalizedPageLoaders = Partial<Record<Exclude<TuwaLocale, 'en'>, () => Promise<EvaluateResult>>>;

/** Props of the `[[...mdxPath]]` page of a documentation site. */
export interface DocsPageProps {
  /** The route segments after the site root. */
  params: Promise<{ mdxPath?: string[] }>;
  /** Query parameters of the request. */
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/** Options of {@link createDocsPage}. */
export interface CreateDocsPageOptions {
  /**
   * The translated pages of the site by route (`/` for the Introduction, `/packages` for the packages overview).
   * Pages that are not listed (package READMEs, the generated reference) stay in English in every language.
   */
  localizedPages?: Readonly<Record<string, LocalizedPageLoaders>>;
  /**
   * The language of the URLs of this route, for the route under `src/app/uk` or `src/app/zh-CN`: it serves only the pages translated
   * into that language. Leave it out in the route of the English pages.
   */
  locale?: Exclude<TuwaLocale, 'en'>;
}

/** Whether a requested path is a static asset or an internal Next.js path rather than a page. */
function isAssetOrInternal(mdxPath?: string[]): boolean {
  if (!mdxPath || mdxPath.length === 0) return false;
  if (mdxPath[0] === '_next') return true;
  return Boolean(mdxPath[mdxPath.length - 1]?.includes('.'));
}

/** The route of a page: `/` for the root, `/packages/satellite-core` for `['packages', 'satellite-core']`. */
const routeOf = (mdxPath?: string[]) => `/${(mdxPath ?? []).join('/')}`;

/** A page variant from an imported MDX module, rendered with the props of the route. */
function variantOf(
  module: EvaluateResult,
  props: DocsPageProps,
  params: { mdxPath?: string[] },
  components?: Parameters<EvaluateResult['default']>[0]['components'],
): LocalizedPageVariant {
  const { default: MDXContent, toc, metadata, sourceCode } = module;
  return { content: <MDXContent {...props} params={params} components={components} />, toc, metadata, sourceCode };
}

/**
 * Creates the `[[...mdxPath]]` route of a TUWA documentation site (the pages of `src/content`): the static params, the
 * metadata of each page and the page component, which renders the English page and its translations into a
 * `LocalizedPage`. Re-export them from `src/app/(default)/[[...mdxPath]]/page.tsx`; the layout must be `DocsLayout`
 * (`@tuwaio/docs-ui/nextra`). With `locale` it is the route of the translated pages at their language URLs, such as
 * `src/app/uk/[[...mdxPath]]/page.tsx`. A translated page names its URLs in every language (`hreflang`); the rest stay English,
 * at one URL. Side effects: imports the MDX files of the requested page and of its translations.
 *
 * @example
 * ```tsx
 * import { createDocsPage } from '@tuwaio/docs-ui/nextra/page';
 *
 * import { localizedPages } from '@/i18n/pages';
 *
 * const { generateStaticParams, generateMetadata, Page } = createDocsPage({ localizedPages });
 *
 * export { generateMetadata, generateStaticParams };
 * export default Page;
 * ```
 *
 * @param options - See {@link CreateDocsPageOptions}.
 * @returns `generateStaticParams`, `generateMetadata` and `Page`.
 */
export function createDocsPage({ localizedPages = {}, locale }: CreateDocsPageOptions = {}) {
  const translatedRoutes = locale ? Object.keys(localizedPages).filter((route) => localizedPages[route]?.[locale]) : [];
  const generateStaticParams = locale
    ? async () => translatedRoutes.map((route) => ({ mdxPath: route === '/' ? [] : route.slice(1).split('/') }))
    : generateStaticParamsFor('mdxPath');

  const inLanguage = (metadata: Metadata, route: string): Metadata => ({
    ...metadata,
    alternates: { canonical: localizedPath(route, locale ?? 'en'), languages: languageAlternates(route) },
  });

  // The pages are written with their English paths: a link of a translated page stays in its language where it can
  const LanguageLink = ({ href, ...rest }: ComponentProps<typeof Link>) => {
    const target = typeof href === 'string' ? (href.split(/[?#]/)[0] ?? '') : '';
    return (
      <Link
        href={locale && typeof href === 'string' && target in localizedPages ? localizedPath(href, locale) : href}
        {...rest}
      />
    );
  };

  async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
    const { mdxPath } = await props.params;
    if (isAssetOrInternal(mdxPath)) return {};
    const route = routeOf(mdxPath);
    try {
      if (locale) {
        const load = localizedPages[route]?.[locale];
        return load ? inLanguage((await load()).metadata, route) : {};
      }
      const { metadata } = await importPage(mdxPath);
      return route in localizedPages ? inLanguage(metadata, route) : metadata;
    } catch {
      return {};
    }
  }

  async function Page(props: DocsPageProps) {
    const params = await props.params;
    if (isAssetOrInternal(params.mdxPath)) notFound();

    if (locale) {
      const load = localizedPages[routeOf(params.mdxPath)]?.[locale];
      if (!load) notFound();
      const variant = variantOf(await load(), props, params, { a: LanguageLink });
      return <LocalizedPage language={locale} variants={{ en: variant, [locale]: variant }} />;
    }

    let english: EvaluateResult;
    try {
      english = await importPage(params.mdxPath);
    } catch {
      notFound();
    }

    const loaders = Object.entries(localizedPages[routeOf(params.mdxPath)] ?? {}) as [
      Exclude<TuwaLocale, 'en'>,
      () => Promise<EvaluateResult>,
    ][];
    const translations = await Promise.all(
      loaders.map(async ([locale, load]) => [locale, variantOf(await load(), props, params)] as const),
    );

    return <LocalizedPage variants={{ ...Object.fromEntries(translations), en: variantOf(english, props, params) }} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}
