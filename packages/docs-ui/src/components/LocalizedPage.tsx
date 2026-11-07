'use client';

import type { $NextraMetadata, Heading } from 'nextra';
import { Callout } from 'nextra/components';
import { useMDXComponents } from 'nextra-theme-docs';
import type { ComponentType, ReactNode } from 'react';

import { useDocsI18n } from '../docsI18n';
import type { TuwaLocale } from '../locale';

/** One language of a page: the rendered MDX and what the Nextra page wrapper needs. */
export interface LocalizedPageVariant {
  /** The rendered MDX content. */
  content: ReactNode;
  /** The table of contents of the MDX file (its `toc` export). */
  toc: Heading[];
  /** The metadata of the MDX file (its `metadata` export): the title, the file of the edit link, the last change. */
  metadata: $NextraMetadata;
  /** The source of the MDX file (its `sourceCode` export), for the copy-page button. */
  sourceCode?: string;
}

/** Props of {@link LocalizedPage}. */
export interface LocalizedPageProps {
  /** The page in English (the server renders it) and in the languages it is translated into. */
  variants: Partial<Record<TuwaLocale, LocalizedPageVariant>> & { en: LocalizedPageVariant };
  /** The language of the URL of this page: it shows that variant whatever the reader picks, until the switch has moved on. */
  language?: TuwaLocale;
}

type WrapperProps = { toc: Heading[]; metadata: $NextraMetadata; sourceCode?: string; children: ReactNode };

/**
 * A page of a TUWA documentation site in the language of the reader, inside the Nextra page wrapper (sidebar, table of
 * contents, breadcrumbs, pagination). At an English URL all variants come prerendered from the server and the HTML holds English;
 * at the URL of a language, `language` names the one it shows. A page without a translation
 * in the active language (package READMEs and the generated API reference) shows English with a short note in that
 * language. Must be rendered inside {@link DocsLayout}; `createDocsPage` (`@tuwaio/docs-ui/nextra/page`) renders it.
 *
 * @param props - See {@link LocalizedPageProps}.
 * @returns The page.
 */
export function LocalizedPage({ variants, language }: LocalizedPageProps) {
  const { locale, t } = useDocsI18n();
  const Wrapper = useMDXComponents().wrapper as ComponentType<WrapperProps>;
  const translated = variants[language ?? locale];
  const page = translated ?? variants.en;

  return (
    <Wrapper toc={page.toc} metadata={page.metadata} sourceCode={page.sourceCode}>
      {/* Below the floating copy-page button, so the note keeps the full width on phones */}
      {!translated && (
        <div className="tuwadocs:clear-both">
          <Callout type="info">{t.englishOnly}</Callout>
        </div>
      )}
      {page.content}
    </Wrapper>
  );
}
