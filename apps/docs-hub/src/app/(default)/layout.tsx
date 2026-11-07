import type { ReactNode } from 'react';

import { RootDocument, rootMetadata } from '../rootDocument';

export const metadata = rootMetadata;

/**
 * The root layout of the pages in English, whose URLs have no language.
 *
 * @param props.children - The page.
 * @returns The document.
 */
export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
