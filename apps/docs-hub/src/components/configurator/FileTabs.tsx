'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { useState } from 'react';

import type { GeneratedFile } from '@/lib/configurator/generate';

import { CodeBlock } from './CodeBlock';

/**
 * Generated files as tabs, one highlighted file at a time. Used by the Stack Configurator and the Code tab of the
 * Playground. When the files change and the open one is gone, the first file opens.
 * @param props.files - The files.
 * @param props.label - Accessible name of the tab list.
 */
export function FileTabs({ files, label }: { files: GeneratedFile[]; label: string }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const file = files.find(({ path }) => path === openPath) ?? files[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 overflow-x-auto border-b border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] p-2 [scrollbar-width:thin]"
      >
        {files.map(({ path }) => (
          <button
            key={path}
            type="button"
            role="tab"
            aria-selected={path === file.path}
            onClick={() => setOpenPath(path)}
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2.5 py-1.5 font-mono text-xs whitespace-nowrap transition-colors cursor-pointer',
              path === file.path
                ? 'bg-[var(--tuwa-text-accent)]/10 text-[var(--tuwa-text-primary)]'
                : 'text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-secondary)]/60',
            )}
          >
            <DocumentTextIcon className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
            {path}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={file.path}>
        <CodeBlock code={file.code} language={file.language} label={file.path} />
      </div>
    </div>
  );
}
