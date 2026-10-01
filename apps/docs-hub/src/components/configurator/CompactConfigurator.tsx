'use client';

import { AdjustmentsHorizontalIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

import { DEFAULT_STACK_OPTIONS, generateStack, stackQuery } from '@/lib/configurator/generate';
import { installCommand, usePackageManager } from '@/lib/packageManager';

import { CommandLine, PackageManagerSwitch } from '../CommandLine';
import { StackOptionsForm } from './StackOptionsForm';

/**
 * The Stack Configurator on the hub main page: the options, the install command for the chosen package manager, and a
 * link to `/configurator` with the same options for the setup files.
 */
export function CompactConfigurator() {
  const [options, setOptions] = useState(DEFAULT_STACK_OPTIONS);
  const [packageManager, choosePackageManager] = usePackageManager();
  const stack = generateStack(options);

  return (
    <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/50 dark:bg-white/[0.02] sm:backdrop-blur-sm p-4 sm:p-6 text-left">
      <div className="flex items-start gap-3 mb-5">
        <AdjustmentsHorizontalIcon
          className="w-5 h-5 mt-0.5 shrink-0 text-[var(--tuwa-text-accent)]"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-sm sm:text-base font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]">
            Already have an app? Configure your stack
          </h3>
          <p className="text-xs sm:text-sm text-[var(--tuwa-text-secondary)] mt-1">
            Pick the pieces you need and get the install command; the setup files are one click away.
          </p>
        </div>
      </div>

      <StackOptionsForm options={options} onChange={setOptions} compact />

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
            Install
          </span>
          <PackageManagerSwitch value={packageManager} onChange={choosePackageManager} />
        </div>
        <CommandLine command={installCommand(packageManager, stack.packages)} copyTitle="Copy the install command" />
      </div>

      <Link
        href={`/configurator?${stackQuery(stack.options)}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tuwa-text-accent)] hover:underline"
      >
        See the {stack.files.length} setup files
        <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
