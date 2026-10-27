'use client';

import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  CpuChipIcon,
  LinkIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import Link from 'next/link';
import { type ReactNode, useMemo } from 'react';

import { formatLabel, useI18n } from '@/i18n';
import {
  agentPrompt,
  allStackOptions,
  FRAMEWORK_LABELS,
  generateStack,
  parseStackOptions,
  type StackOptions,
  stackQuery,
} from '@/lib/configurator/generate';
import { installCommand, usePackageManager } from '@/lib/packageManager';
import { replaceQuery, useQueryString } from '@/lib/queryState';

import { CommandLine, PackageManagerSwitch } from '../CommandLine';
import { FileTabs } from './FileTabs';
import { StackOptionsForm } from './StackOptionsForm';

// The options live in the query string of the page, so a configured stack can be shared as a link
const writeQuery = (options: StackOptions) => replaceQuery(stackQuery(options));

/**
 * Localized header for `/configurator`.
 */
export function ConfiguratorHeader() {
  const { t } = useI18n();
  return (
    <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight font-geist-mono uppercase tracking-tight">
        <span className="bg-gradient-to-r from-[var(--tuwa-hero-gradient-from)] via-[var(--tuwa-hero-gradient-via)] to-[var(--tuwa-hero-gradient-to)] bg-clip-text text-transparent">
          {t.configurator.titleHighlight}
        </span>
      </h1>
      <p className="mt-6 text-base sm:text-lg text-[var(--tuwa-text-secondary)] leading-relaxed">
        {formatLabel(t.ui.configuratorExtra.subtitle, { count: allStackOptions().length })}
      </p>
    </header>
  );
}

function Step({
  index,
  title,
  aside,
  children,
}: {
  index: number;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative pl-10">
      <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--tuwa-hero-gradient-from)] to-[var(--tuwa-hero-gradient-via)] font-mono text-xs font-bold text-white shadow-md shadow-black/10">
        {index}
      </span>
      <div className="mb-3 flex min-h-7 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-sm font-bold font-geist-mono uppercase tracking-wider text-[var(--tuwa-text-primary)]">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function CopyButton({
  text,
  label,
  copiedLabel,
  icon,
}: {
  text: () => string;
  label: string;
  copiedLabel: string;
  icon: ReactNode;
}) {
  const { isCopied, copy } = useCopyToClipboard(2000);
  return (
    <button
      type="button"
      onClick={() => copy(text())}
      disabled={isCopied}
      className="inline-flex items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/50 cursor-pointer disabled:cursor-default transition-colors"
    >
      {isCopied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : icon}
      {isCopied ? copiedLabel : label}
    </button>
  );
}

const cardClass =
  'rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm';

/**
 * The Stack Configurator of `/configurator`: the options (kept in the query string), the closest starter template,
 * the commands with the install command for the chosen package manager, every setup file with highlighted code, the
 * guides to read next, and buttons to copy a link to the stack or the whole setup as a prompt for a coding agent.
 */
export function StackConfigurator() {
  const { t } = useI18n();
  // '' while server rendering: the page is static, the query is applied in the browser
  const query = useQueryString();
  const options = useMemo(() => parseStackOptions(new URLSearchParams(query)), [query]);
  const stack = useMemo(() => generateStack(options), [options]);
  const [packageManager, choosePackageManager] = usePackageManager();

  const install = installCommand(packageManager, stack.packages);
  const installDev = installCommand(packageManager, stack.devPackages, true);
  const fullInstall = [install, installDev].filter(Boolean).join(' && ');
  const [createCommand, ...otherCommands] = stack.commands;
  const templateNote = t.configurator.templateNotes[stack.template.note] ?? stack.template.note;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
      {/* Options */}
      <aside className={cn(cardClass, 'p-5 lg:sticky lg:top-20')} aria-label={t.configurator.steps.step1Title}>
        <StackOptionsForm options={options} onChange={writeQuery} />
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] pt-5">
          <CopyButton
            text={() => agentPrompt(stack, fullInstall)}
            label={t.configurator.steps.copyPromptForAi}
            copiedLabel={t.configurator.steps.promptCopied}
            icon={<CpuChipIcon className="w-4 h-4 text-[var(--tuwa-text-accent)]" />}
          />
          <CopyButton
            text={() => window.location.href}
            label={t.configurator.steps.copyShareLink}
            copiedLabel={t.configurator.steps.linkCopied}
            icon={<LinkIcon className="w-4 h-4" />}
          />
        </div>
      </aside>

      {/* Result */}
      <div className="flex min-w-0 flex-col gap-10">
        <div className={cn(cardClass, 'p-5 flex flex-col sm:flex-row sm:items-center gap-4')}>
          <RocketLaunchIcon
            className="hidden sm:block w-8 h-8 shrink-0 text-[var(--tuwa-text-accent)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
              {stack.template.name ? t.ui.configuratorExtra.fastestStart : t.ui.configuratorExtra.starterTemplate}
            </p>
            <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)] leading-relaxed">
              {stack.template.name && (
                <>
                  {t.ui.configuratorExtra.runCommandAndPick}{' '}
                  <code className="font-mono text-[var(--tuwa-text-primary)]">{stack.template.name}</code>.{' '}
                </>
              )}
              {templateNote}{' '}
              <Link href="/guides/starter-templates" className="text-[var(--tuwa-text-accent)] hover:underline">
                {t.ui.quickStartSteps.compareTemplates}
              </Link>
            </p>
            {stack.template.name && (
              <div className="mt-3">
                <CommandLine command="npx @tuwaio/create-cosmos-playground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-sm text-[var(--tuwa-text-secondary)]">
            {formatLabel(t.ui.configuratorExtra.orAddToExisting, {
              framework: FRAMEWORK_LABELS[stack.options.framework],
            })}
          </p>

          <Step index={1} title={t.configurator.commandLabels[createCommand.label] ?? createCommand.label}>
            <CommandLine command={createCommand.command} />
          </Step>

          <Step
            index={2}
            title={t.home.compactConfigurator.install}
            aside={<PackageManagerSwitch value={packageManager} onChange={choosePackageManager} />}
          >
            <div className="flex flex-col gap-2">
              <CommandLine command={install} copyTitle={t.home.packageDialog.copyInstallTitle} />
              {installDev && <CommandLine command={installDev} copyTitle={t.configurator.steps.copyDevPackages} />}
              <p className="text-xs text-[var(--tuwa-text-secondary)]">
                {t.ui.configuratorExtra.peersIncluded}
                {stack.options.framework !== 'vanilla' && t.ui.configuratorExtra.sdkBringsProjects}.
              </p>
            </div>
          </Step>

          <Step index={3} title={formatLabel(t.ui.configuratorExtra.addFilesTitle, { count: stack.files.length })}>
            <div className={cn(cardClass, 'overflow-hidden')}>
              <FileTabs files={stack.files} label={t.configurator.steps.setupFilesAria} />
            </div>
          </Step>

          {otherCommands.length > 0 && (
            <Step index={4} title={t.ui.configuratorExtra.runStepTitle}>
              <div className="flex flex-col gap-3">
                {otherCommands.map((command) => (
                  <div key={command.command} className="flex flex-col gap-1.5">
                    <p className="text-xs text-[var(--tuwa-text-secondary)]">
                      {t.configurator.commandLabels[command.label] ?? command.label}
                    </p>
                    <CommandLine command={command.command} />
                  </div>
                ))}
              </div>
            </Step>
          )}
        </div>

        <div className={cn(cardClass, 'p-5')}>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)] mb-3">
            {t.ui.configuratorExtra.readNext}
          </p>
          <ul className="flex flex-wrap gap-2">
            {stack.guides.map((guide) => {
              const external = guide.href.startsWith('http');
              return (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="inline-flex items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/40 transition-colors"
                  >
                    {t.configurator.guideTitles[guide.href] ?? guide.title}
                    {external && <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-70" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
