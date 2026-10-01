'use client';

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useCopyToClipboard } from '@tuwaio/nova-core';
import { useEffect, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

import type { FileLanguage } from '@/lib/configurator/generate';

// Shiki with only the grammars and themes the configurator needs, loaded on the first code block
let highlighter: Promise<HighlighterCore> | null = null;

function loadHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/tsx.mjs'),
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/css.mjs'),
          import('shiki/langs/dotenv.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      }),
  );
  return highlighter;
}

const SHIKI_LANGUAGES: Record<FileLanguage, string> = { ts: 'typescript', tsx: 'tsx', css: 'css', dotenv: 'dotenv' };

/**
 * A code file with a copy button. The code is highlighted in the browser with the GitHub light and dark themes (the
 * `--shiki-light` and `--shiki-dark` colors, switched by `.tuwa-code` in `globals.css`); until Shiki loads, it shows
 * as plain text.
 * @param props.code - The code.
 * @param props.language - Its language.
 * @param props.label - Accessible name of the code, for example the file path.
 */
export function CodeBlock({ code, language, label }: { code: string; language: FileLanguage; label: string }) {
  const { isCopied, copy } = useCopyToClipboard(2000);
  const [highlighted, setHighlighted] = useState<{ code: string; html: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadHighlighter().then((shiki) => {
      if (cancelled) return;
      const html = shiki.codeToHtml(code, {
        lang: SHIKI_LANGUAGES[language],
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      });
      setHighlighted({ code, html });
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return (
    <div className="relative group/code">
      <button
        type="button"
        onClick={() => copy(code)}
        disabled={isCopied}
        title="Copy the code"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/90 dark:bg-[#0d1117]/90 px-2 py-1 text-xs text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer disabled:cursor-default transition-colors"
      >
        {isCopied ? (
          <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <ClipboardDocumentIcon className="w-3.5 h-3.5" />
        )}
        {isCopied ? 'Copied' : 'Copy'}
      </button>
      {highlighted?.code === code ? (
        <div
          role="region"
          aria-label={label}
          className="tuwa-code"
          // Shiki escapes the code; the HTML holds only its spans and colors
          dangerouslySetInnerHTML={{ __html: highlighted.html }}
        />
      ) : (
        <div role="region" aria-label={label} className="tuwa-code">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
