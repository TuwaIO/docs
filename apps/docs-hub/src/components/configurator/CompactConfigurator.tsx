'use client';

import { PixelArt, ProjectSquare, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';
import { useState } from 'react';

import Link from '@/components/LocaleNextLink';
import { formatLabel, useI18n } from '@/i18n';
import { DEFAULT_STACK_OPTIONS, generateStack, stackQuery } from '@/lib/configurator/generate';
import { installCommand, usePackageManager } from '@/lib/packageManager';

import { CommandLine, PackageManagerSwitch } from '../CommandLine';
import { ARROW_RIGHT } from '../home/pixelArrows';
import { StackOptionsForm } from './StackOptionsForm';

/**
 * The Stack Configurator on the hub main page, in paper and ink: a frame of 1px with, on shared lines, its head (the
 * square of a gear, whose icon moves under the pointer, the title in mono caps and what it does), the options in four
 * cells (two by two from 768px), and the install command for the chosen package manager with a link to `/configurator`,
 * which opens with the same options and all the setup files.
 *
 * Side effects: the package manager the reader picks is saved to `localStorage` (`usePackageManager`).
 *
 * @returns The configurator.
 */
export function CompactConfigurator() {
  const { t } = useI18n();
  const [options, setOptions] = useState(DEFAULT_STACK_OPTIONS);
  const [packageManager, choosePackageManager] = usePackageManager();
  const stack = generateStack(options);
  const texts = t.home.compactConfigurator;

  return (
    <div className="border border-[var(--tuwa-border-primary)]">
      <div
        onMouseEnter={(event) => startPixelMotion(event.currentTarget)}
        onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}
        className="group grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-b border-[var(--tuwa-border-primary)] px-4 py-5"
      >
        <ProjectSquare icon="gear" />
        <div className="min-w-0">
          <h3 className="m-0 mt-0.5 font-mono text-sm font-bold uppercase leading-[1.3] tracking-[0.12em] text-[var(--tuwa-text-primary)]">
            {texts.title}
          </h3>
          <p className="m-0 mt-1.5 text-sm leading-normal text-[var(--tuwa-text-secondary)]">{texts.description}</p>
        </div>
      </div>

      <StackOptionsForm options={options} onChange={setOptions} compact />

      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em] text-[var(--tuwa-text-secondary)]">
            {texts.install}
          </span>
          <PackageManagerSwitch value={packageManager} onChange={choosePackageManager} />
        </div>
        <div className="mt-2.5">
          <CommandLine
            compact
            command={installCommand(packageManager, stack.packages)}
            copyTitle={t.home.packageDialog.copyInstallTitle}
          />
        </div>
        <Link
          href={`/configurator?${stackQuery(stack.options)}`}
          className="group/link mt-4 inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase leading-[1.3] tracking-[0.12em] text-[var(--tuwa-text-accent)] underline-offset-4 hover:underline"
        >
          {formatLabel(texts.openWithFiles, { count: stack.files.length })}
          <PixelArt
            art={ARROW_RIGHT}
            className="h-3.5 w-3.5 shrink-0 [--tuwa-pixel-ink:currentColor] transition-transform duration-200 ease-out group-hover/link:translate-x-[3px] group-focus-visible/link:translate-x-[3px] motion-reduce:transition-none motion-reduce:!translate-none"
          />
        </Link>
      </div>
    </div>
  );
}
