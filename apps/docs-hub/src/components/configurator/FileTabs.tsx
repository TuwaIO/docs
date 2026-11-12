'use client';

import { DocumentTextIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { useState } from 'react';

import type { GeneratedFile } from '@/lib/configurator/generate';

import { ScrollArrow } from '../ScrollArrow';
import { useScrollArrows } from '../useScrollArrows';
import { CodeBlock } from './CodeBlock';

/**
 * Generated files as tabs, one highlighted file at a time, in paper and ink: the tabs are cells on shared lines of 1px
 * with a pixel icon of a document, the open one a block of ink. The row of tabs scrolls sideways when the files do not
 * fit: an arrow on a cell of glass stands over the end that has more (`ScrollArrow`), and a tab the reader opens comes
 * wholly into sight. Used by the Stack Configurator and the Code tab of the Playground, each in its own frame. When the
 * files change and the open one is gone, the first file opens.
 *
 * @param props.files - The files.
 * @param props.label - Accessible name of the tab list.
 * @returns The tabs and the open file.
 */
export function FileTabs({ files, label }: { files: GeneratedFile[]; label: string }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const file = files.find(({ path }) => path === openPath) ?? files[0];
  const { ref, before, after, scroll } = useScrollArrows<HTMLDivElement>(files.map(({ path }) => path).join('\n'));

  return (
    <div>
      <div className="relative border-b border-[var(--tuwa-border-primary)]">
        <div
          ref={ref}
          role="tablist"
          aria-label={label}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {files.map(({ path }) => {
            const isOpen = path === file.path;
            return (
              <button
                key={path}
                type="button"
                role="tab"
                aria-selected={isOpen}
                onClick={(event) => {
                  setOpenPath(path);
                  // A tab half out of sight comes wholly into it; the page itself does not move
                  event.currentTarget.scrollIntoView({
                    inline: 'nearest',
                    block: 'nearest',
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                  });
                }}
                className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 border-r border-[var(--tuwa-border-primary)] px-3.5 font-mono text-xs whitespace-nowrap transition-colors ${isOpen ? 'bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]' : 'text-[var(--tuwa-text-secondary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] hover:text-[var(--tuwa-text-primary)]'}`}
              >
                <DocumentTextIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {path}
              </button>
            );
          })}
        </div>
        <ScrollArrow side="left" shown={before} onClick={() => scroll('left')} />
        <ScrollArrow side="right" shown={after} onClick={() => scroll('right')} />
      </div>
      <div role="tabpanel" aria-label={file.path}>
        <CodeBlock code={file.code} language={file.language} label={file.path} />
      </div>
    </div>
  );
}
