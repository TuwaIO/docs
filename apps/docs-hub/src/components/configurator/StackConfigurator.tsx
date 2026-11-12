'use client';

import { ProjectSquare, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';
import { DrawnCheck, ExternalLinkIcon, MorphIcon, useCopyToClipboard } from '@tuwaio/nova-core';
import { CpuChipIcon, LinkIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { type ReactNode, useMemo } from 'react';

import Link from '@/components/LocaleNextLink';
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
import { formatPlural } from '@/lib/plural';
import { replaceQuery, useQueryString } from '@/lib/queryState';

import { secondaryButtonClassName, smallButtonClassName } from '../buttonStyles';
import { CommandLine, PackageManagerSwitch } from '../CommandLine';
import { homeEdgeToEdgeClassName, homeMarginLeftClassName, homeMarginRightClassName } from '../home/homeLayout';
import { CrossMark, Kicker } from '../home/SectionHead';
import { FileTabs } from './FileTabs';
import { StackOptionsForm } from './StackOptionsForm';

// The options live in the query string of the page, so a configured stack can be shared as a link
const writeQuery = (options: StackOptions) => replaceQuery(stackQuery(options));

const lineClassName = 'border-[var(--tuwa-border-primary)]';
const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';
const frameClassName = `border bg-[var(--tuwa-docs-raised)] ${lineClassName}`;
const linkClassName = 'text-[var(--tuwa-text-accent)] underline decoration-1 underline-offset-[3px]';

/**
 * The head of `/configurator`, in paper and ink: the kicker (how many stacks the configurator generates), the title in
 * large mono and the lead.
 *
 * @returns The head.
 */
export function ConfiguratorHeader() {
  const { locale, t } = useI18n();
  const count = allStackOptions().length;
  return (
    <header className="pt-12 pb-14 md:pt-16 md:pb-16 xl:pt-20">
      <Kicker>
        {t.configurator.badge} · {formatPlural(t.configurator.stacks, count, locale)}
      </Kicker>
      <h1
        className={`mt-5 font-mono text-[clamp(36px,6.2vw,76px)] leading-[0.98] font-medium text-[var(--tuwa-text-primary)] ${locale === 'uk' ? 'tracking-normal' : 'tracking-[-0.04em]'}`}
      >
        {t.configurator.titleHighlight}
      </h1>
      <p className="mt-7 max-w-[680px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)]">
        {formatLabel(t.ui.configuratorExtra.subtitle, { count })}
      </p>
    </header>
  );
}

/**
 * A step of the result: its number in a square of 1px, its title in mono caps with what stands beside it (the switch
 * of the package manager), then its content, under the title from 768px. A line of 1px above.
 *
 * @param props.index - The number of the step, from 1.
 * @param props.title - The title.
 * @param props.aside - What stands on the right of the title.
 * @param props.children - The content.
 * @returns The step.
 */
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
    <li className={`border-t py-7 ${lineClassName}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="grid h-[34px] w-[34px] shrink-0 place-items-center border border-[var(--tuwa-text-primary)] font-mono text-[13px] leading-none font-bold text-[var(--tuwa-text-primary)]"
          >
            {String(index).padStart(2, '0')}
          </span>
          <h2 className="m-0 font-mono text-[15px] leading-[1.25] font-bold tracking-[0.12em] text-[var(--tuwa-text-primary)] uppercase">
            {title}
          </h2>
        </div>
        {aside}
      </div>
      <div className="mt-5 md:pl-[50px]">{children}</div>
    </li>
  );
}

/**
 * A small secondary button that copies a text and shows Nova's drawn check for two seconds.
 *
 * @param props.text - Gives the text to copy, read when the button is pressed.
 * @param props.label - The label of the button.
 * @param props.copiedLabel - The label after the text is copied.
 * @param props.icon - The icon of the button, 16px.
 * @returns The button.
 */
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
      className={`w-full justify-center disabled:cursor-default ${smallButtonClassName} ${secondaryButtonClassName}`}
    >
      {/* The icon of the button gives way to Nova's check mark, drawn in the success colour of its copy icon */}
      <MorphIcon iconKey={isCopied ? 'copied' : 'idle'} className="h-4 w-4">
        {isCopied ? <DrawnCheck className="h-4 w-4 text-[var(--tuwa-success-icon)]" /> : icon}
      </MorphIcon>
      {isCopied ? copiedLabel : label}
    </button>
  );
}

/**
 * The Stack Configurator of `/configurator`, in paper and ink, from line to line of the frame of the page: on the left
 * (above, below 1024px) the options, kept in the query string, with the buttons that copy the whole setup as a prompt
 * for a coding agent or a link to the stack, and they stay in sight while the result scrolls; beside them, on a shared
 * line of 1px, the result: the closest starter template in a frame with the square of a rocket, then the steps with
 * square numbers on lines (create the app, install with the chosen package manager, add every setup file with
 * highlighted code, run), and the guides to read next.
 *
 * Side effects: the options are written to the query string of the page (`replaceQuery`); the package manager the
 * reader picks is saved to `localStorage` (`usePackageManager`); the copy buttons write to the clipboard.
 *
 * @returns The configurator.
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
  const extra = t.ui.configuratorExtra;

  return (
    <div
      className={`relative grid grid-cols-1 border-t lg:grid-cols-[372px_minmax(0,1fr)] ${lineClassName} ${homeEdgeToEdgeClassName}`}
    >
      <CrossMark x="left" y="top" />
      <CrossMark x="right" y="top" />

      {/* Options */}
      <aside
        aria-label={t.configurator.steps.step1Title}
        className={`py-10 pr-4 md:pr-8 lg:border-r ${lineClassName} ${homeMarginLeftClassName}`}
      >
        <div className="lg:sticky lg:top-[88px]">
          <StackOptionsForm options={options} onChange={writeQuery} />
          <div className={`mt-7 flex flex-col gap-2.5 border-t pt-6 ${lineClassName}`}>
            <CopyButton
              text={() => agentPrompt(stack, fullInstall)}
              label={t.configurator.steps.copyPromptForAi}
              copiedLabel={t.configurator.steps.promptCopied}
              icon={<CpuChipIcon className="h-4 w-4 text-[var(--tuwa-text-accent)]" />}
            />
            <CopyButton
              text={() => window.location.href}
              label={t.configurator.steps.copyShareLink}
              copiedLabel={t.configurator.steps.linkCopied}
              icon={<LinkIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      </aside>

      {/* Result */}
      <div
        className={`min-w-0 border-t py-10 pl-4 md:pl-8 lg:border-t-0 lg:pl-10 ${lineClassName} ${homeMarginRightClassName}`}
      >
        <div
          onMouseEnter={(event) => startPixelMotion(event.currentTarget)}
          onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}
          className={`group grid grid-cols-1 gap-4 p-5 md:grid-cols-[44px_minmax(0,1fr)] ${frameClassName}`}
        >
          <ProjectSquare icon="rocket" className="max-md:hidden" />
          <div className="min-w-0">
            <p className={`m-0 text-[var(--tuwa-text-primary)] ${capsClassName}`}>
              {stack.template.name ? extra.fastestStart : extra.starterTemplate}
            </p>
            <p className="m-0 mt-2 text-sm leading-normal text-[var(--tuwa-text-secondary)]">
              {stack.template.name && (
                <>
                  {extra.runCommandAndPick}{' '}
                  <code className="font-mono text-[13px] text-[var(--tuwa-text-primary)]">{stack.template.name}</code>
                  .{' '}
                </>
              )}
              {templateNote}{' '}
              <Link href="/guides/starter-templates" className={linkClassName}>
                {t.ui.quickStartSteps.compareTemplates}
              </Link>
            </p>
            {stack.template.name && (
              <div className="mt-4">
                <CommandLine compact command="npx @tuwaio/create-cosmos-playground" />
              </div>
            )}
          </div>
        </div>

        <p className="m-0 mt-10 mb-7 text-[15px] leading-normal text-[var(--tuwa-text-secondary)]">
          {formatLabel(extra.orAddToExisting, { framework: FRAMEWORK_LABELS[stack.options.framework] })}
        </p>

        <ol role="list" className="m-0 list-none p-0">
          <Step index={1} title={t.configurator.commandLabels[createCommand.label] ?? createCommand.label}>
            <CommandLine command={createCommand.command} />
          </Step>

          <Step
            index={2}
            title={t.home.compactConfigurator.install}
            aside={<PackageManagerSwitch value={packageManager} onChange={choosePackageManager} />}
          >
            <div className="flex flex-col gap-2.5">
              <CommandLine command={install} copyTitle={t.home.packageDialog.copyInstallTitle} />
              {installDev && <CommandLine command={installDev} copyTitle={t.configurator.steps.copyDevPackages} />}
              <p className="m-0 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
                {extra.peersIncluded}
                {stack.options.framework !== 'vanilla' && extra.sdkBringsProjects}.
              </p>
            </div>
          </Step>

          <Step index={3} title={formatLabel(extra.addFilesTitle, { count: stack.files.length })}>
            <div className={frameClassName}>
              <FileTabs files={stack.files} label={t.configurator.steps.setupFilesAria} />
            </div>
          </Step>

          {otherCommands.length > 0 && (
            <Step index={4} title={extra.runStepTitle}>
              <div className="flex flex-col gap-4">
                {otherCommands.map((command) => (
                  <div key={command.command} className="flex flex-col gap-2">
                    <p className="m-0 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
                      {t.configurator.commandLabels[command.label] ?? command.label}
                    </p>
                    <CommandLine command={command.command} />
                  </div>
                ))}
              </div>
            </Step>
          )}
        </ol>

        <div className={`border-t pt-7 ${lineClassName}`}>
          <p className={`m-0 text-[var(--tuwa-text-secondary)] ${capsClassName}`}>{extra.readNext}</p>
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2.5 p-0">
            {stack.guides.map((guide) => {
              const external = guide.href.startsWith('http');
              return (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className={`${smallButtonClassName} ${secondaryButtonClassName}`}
                  >
                    {t.configurator.guideTitles[guide.href] ?? guide.title}
                    {external && <ExternalLinkIcon className="h-2.5 w-2.5 shrink-0" />}
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
