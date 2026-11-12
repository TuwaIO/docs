'use client';

import { ExternalLinkIcon } from '@tuwaio/nova-core';

import Link from '@/components/LocaleNextLink';
import { formatPlural } from '@/lib/plural';

import { useI18n } from '../i18n';
import { CommandLine } from './CommandLine';
import { CompactConfigurator } from './configurator/CompactConfigurator';
import { SectionBar, SectionHead } from './home/SectionHead';

/** The command that creates an app from a template of Cosmos Playground */
const command = 'npx @tuwaio/create-cosmos-playground';

const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';

/**
 * The quick start of the main page (`#quick-start`), in paper and ink: the bar of the section (`03 / Quick start`),
 * its title and lead, the command of Cosmos Playground in a frame of ink with a copy button, three links on shared
 * lines under it (the package on npm, the repository, the guide for AI coding agents), the three steps on lines of 1px
 * with square numbers, and, for an app that exists already, the compact Stack Configurator. On phones the links and
 * the steps stand one under another; from 768px they stand three in a row.
 *
 * @returns The section.
 */
export function QuickStartSection() {
  const { locale, t } = useI18n();
  const texts = t.home.quickStart;
  const steps = t.ui.quickStartSteps;

  const links = [
    {
      label: 'npm',
      text: '@tuwaio/create-cosmos-playground',
      href: 'https://www.npmjs.com/package/@tuwaio/create-cosmos-playground',
    },
    { label: 'GitHub', text: 'TuwaIO/cosmos-playground', href: 'https://github.com/TuwaIO/cosmos-playground' },
    {
      label: steps.aiAgentsBadge,
      text: 'TUWA_AGENTS.md',
      href: 'https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md',
      title: steps.aiAgentsTitle,
    },
  ];
  const stepList = [
    { title: steps.step1Title, text: steps.step1Desc },
    {
      title: steps.step2Title,
      text: steps.step2Desc,
      link: { href: '/guides/starter-templates', label: steps.compareTemplates },
    },
    { title: steps.step3Title, text: steps.step3Desc },
  ];

  return (
    <section id="quick-start" aria-labelledby="quick-start-title" className="mt-[104px] scroll-mt-[56px]">
      <SectionBar
        number={3}
        name={texts.section}
        meta={['Cosmos Playground', formatPlural(texts.steps, stepList.length, locale)]}
      />
      <div className="pt-12">
        <SectionHead id="quick-start-title" title={texts.title} lead={texts.subtitle} />
      </div>

      <div className="mt-11">
        <CommandLine command={command} />
        <div className="grid grid-cols-1 border border-t-0 border-[var(--tuwa-border-primary)] md:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              className="flex min-h-12 min-w-0 items-center gap-3 border-t border-[var(--tuwa-border-primary)] px-4 py-2.5 font-mono text-[13px] leading-[1.3] text-[var(--tuwa-text-primary)] transition-colors first:border-t-0 hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] hover:text-[var(--tuwa-text-accent)] md:flex-wrap md:content-center md:gap-x-2.5 md:gap-y-1.5 md:border-t-0 md:border-l md:py-3 md:first:border-l-0"
            >
              <span className={`min-w-[84px] shrink-0 text-[var(--tuwa-text-secondary)] md:w-full ${capsClassName}`}>
                {link.label}
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{link.text}</span>
              <ExternalLinkIcon className="h-2.5 w-2.5 shrink-0 text-[var(--tuwa-text-secondary)]" />
            </a>
          ))}
        </div>

        <ol
          role="list"
          className="m-0 mt-10 grid list-none grid-cols-1 border-t border-[var(--tuwa-text-primary)] p-0 md:grid-cols-3"
        >
          {stepList.map((step, index) => (
            // `content-start`: the steps of a row are as tall as the tallest, and a shorter one would spread its rows
            // and drop its title below the titles beside it
            <li
              key={step.title}
              className="grid grid-cols-[34px_minmax(0,1fr)] content-start gap-4 border-b border-[var(--tuwa-border-primary)] py-[22px] md:grid-cols-1 md:gap-3.5 md:border-b-0 md:border-l md:px-5 md:pb-[26px] md:first:border-l-0 md:first:pl-0"
            >
              <span
                aria-hidden="true"
                className="grid h-[34px] w-[34px] place-items-center border border-[var(--tuwa-text-primary)] font-mono text-[13px] font-bold leading-none text-[var(--tuwa-text-primary)]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="m-0 mt-1.5 font-mono text-base font-semibold leading-[1.3] text-[var(--tuwa-text-primary)] md:mt-0">
                  {step.title}
                </h3>
                <p className="m-0 mt-1.5 text-sm leading-normal text-[var(--tuwa-text-secondary)]">
                  {step.text}
                  {step.link && (
                    <>
                      {' '}
                      <Link
                        href={step.link.href}
                        className="text-[var(--tuwa-text-accent)] underline decoration-1 underline-offset-[3px]"
                      >
                        {step.link.label}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* For an existing app: the install command and the setup files of the picked stack */}
        <div className="mt-10">
          <CompactConfigurator />
        </div>
      </div>
    </section>
  );
}
