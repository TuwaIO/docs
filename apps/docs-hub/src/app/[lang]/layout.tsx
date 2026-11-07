import { URL_LOCALES } from '@tuwaio/docs-ui/locale';
import type { ReactNode } from 'react';

import { RootDocument, rootMetadata } from '../rootDocument';

// Only the languages below: `/de/quasar` is a 404
export const dynamicParams = false;

export const generateStaticParams = () => URL_LOCALES.map((lang) => ({ lang }));

export const metadata = rootMetadata;

/**
 * The root layout of the pages at a language URL (`/uk/...`). Going to or from English loads the page anew, as these are two root
 * layouts: that happens when the reader changes the language, and from a page without language URLs.
 *
 * @param props.children - The page.
 * @param props.params - The language of the URL.
 * @returns The document.
 */
export default async function LanguageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <RootDocument lang={lang}>{children}</RootDocument>;
}
