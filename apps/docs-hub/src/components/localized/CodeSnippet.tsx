'use client';

import { Pre, withIcons } from 'nextra/components';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

import { extractMdxCodeBlocks, type MdxCodeBlock } from '@/lib/mdxCodeBlocks';

const NextraPre = withIcons(Pre);

const MdxCodeBlocksContext = createContext<MdxCodeBlock[]>([]);

export function MdxCodeBlocksProvider({ sourceCode, children }: { sourceCode: string; children: ReactNode }) {
  const blocks = useMemo(() => extractMdxCodeBlocks(sourceCode), [sourceCode]);
  return <MdxCodeBlocksContext.Provider value={blocks}>{children}</MdxCodeBlocksContext.Provider>;
}

let highlighterPromise: Promise<HighlighterCore> | null = null;
const htmlCache = new Map<string, string>();

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/tsx.mjs'),
          import('shiki/langs/bash.mjs'),
          import('shiki/langs/json.mjs'),
          import('shiki/langs/http.mjs'),
          import('shiki/langs/solidity.mjs'),
          import('shiki/langs/css.mjs'),
          import('shiki/langs/dotenv.mjs'),
          import('shiki/langs/sql.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      }),
  );
  return highlighterPromise;
}

const NORM_LANG: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  jsx: 'tsx',
  js: 'typescript',
  javascript: 'typescript',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  json: 'json',
  http: 'http',
  solidity: 'solidity',
  sol: 'solidity',
  css: 'css',
  env: 'dotenv',
  dotenv: 'dotenv',
  sql: 'sql',
};

export interface CodeSnippetProps {
  /** 0-based index of the fenced code block in the canonical English `.mdx` file */
  index?: number;
  /** Explicit code string fallback when not referencing an MDX block by index */
  code?: string;
  filename?: string;
  language?: string;
}

/**
 * Native Nextra code block with Shiki dual-theme syntax highlighting (GitHub light & dark),
 * preserving all comments, tokens, and `nextra-code` line padding (`x:px-4`) 1:1 with English Nextra MDX code blocks.
 * When `index` is provided, reads the canonical code, filename, and language directly from the English MDX `sourceCode`.
 */
export function CodeSnippet({
  index,
  code: explicitCode,
  filename: explicitFilename,
  language: explicitLanguage,
}: CodeSnippetProps) {
  const mdxBlocks = useContext(MdxCodeBlocksContext);
  const block = index !== undefined ? mdxBlocks[index] : undefined;

  const code = explicitCode ?? block?.code ?? '';
  const filename = explicitFilename ?? block?.filename;
  const language = explicitLanguage ?? block?.language;

  const normLang = language ? NORM_LANG[language.toLowerCase()] : undefined;
  const cacheKey = normLang ? `${normLang}:${code}` : '';

  const [asyncHtml, setAsyncHtml] = useState<{ key: string; html: string } | null>(null);
  const highlightedHtml = cacheKey
    ? (htmlCache.get(cacheKey) ?? (asyncHtml?.key === cacheKey ? asyncHtml.html : null))
    : null;

  useEffect(() => {
    if (!normLang || !code || htmlCache.has(cacheKey)) return;

    let cancelled = false;
    void getHighlighter().then((shiki) => {
      if (cancelled) return;
      try {
        const fullHtml = shiki.codeToHtml(code, {
          lang: normLang,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        });
        const match = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const inner = (match ? match[1] : code).replace(/<\/span>\n<span class="line">/g, '</span><span class="line">');
        htmlCache.set(cacheKey, inner);
        setAsyncHtml({ key: cacheKey, html: inner });
      } catch {
        // Fallback to unhighlighted code on grammar error
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, normLang, cacheKey]);

  const lines = code.split('\n');

  return (
    <NextraPre data-filename={filename} data-copy="" data-language={language} data-word-wrap="">
      {highlightedHtml ? (
        <code className="nextra-code" dir="ltr" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      ) : (
        <code className="nextra-code" dir="ltr">
          {lines.map((line, idx) => (
            <span key={idx} className="line">
              {line || ' '}
            </span>
          ))}
        </code>
      )}
    </NextraPre>
  );
}
