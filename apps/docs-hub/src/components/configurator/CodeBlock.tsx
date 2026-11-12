'use client';

import { CopyIcon, useCopyToClipboard } from '@tuwaio/nova-core';
import { useEffect, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

import { useI18n } from '@/i18n';
import { CODE_COLOR_REPLACEMENTS } from '@/lib/codeColors';
import type { FileLanguage } from '@/lib/configurator/generate';

import { secondaryButtonClassName, smallButtonClassName } from '../buttonStyles';

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
 * A code file with a copy button, in paper and ink: the code in Geist Mono on the paper of its frame, the small
 * secondary button over its top right corner. The code is highlighted in the browser with the GitHub light and dark
 * themes (the `--shiki-light` and `--shiki-dark` colors, switched by `.tuwa-code` in `globals.css`), with the colors
 * that are too faint on the paper of the hub replaced (`CODE_COLOR_REPLACEMENTS`); until Shiki loads, it shows as plain
 * text.
 *
 * Side effects: loads Shiki on the first code block; the button writes the code to the clipboard.
 *
 * @param props.code - The code.
 * @param props.language - Its language.
 * @param props.label - Accessible name of the code, for example the file path.
 * @returns The code with its button.
 */
export function CodeBlock({ code, language, label }: { code: string; language: FileLanguage; label: string }) {
  const { t } = useI18n();
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
        colorReplacements: CODE_COLOR_REPLACEMENTS,
      });
      setHighlighted({ code, html });
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => copy(code)}
        disabled={isCopied}
        title={t.common.copyCode}
        className={`absolute top-3 right-3 z-10 bg-[var(--tuwa-docs-raised)] disabled:cursor-default ${smallButtonClassName} ${secondaryButtonClassName}`}
      >
        <CopyIcon copied={isCopied} className="h-4 w-4" />
        {isCopied ? t.common.copied : t.common.copy}
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
