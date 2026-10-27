'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

import playgroundSources from '@/generated/playground-sources.json';
import { useI18n } from '@/i18n';
import { generateStack, stackQuery } from '@/lib/configurator/generate';
import { customizationFiles } from '@/lib/playground/customization';
import { stackOptionsFor } from '@/lib/playground/settings';
import { THEME_PRESETS, themeCss } from '@/lib/playground/themes';

import { FileTabs } from '../configurator/FileTabs';
import { Choice } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';

const STACKBLITZ_URL = 'https://stackblitz.com/github/TuwaIO/cosmos-playground/tree/main/examples/vite-tuwa';

const frameClass =
  'overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06]';
const headingClass = 'text-[11px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]';

/**
 * The stage as code for a real app: the setup of its stack, from the Stack Configurator generator, and the Nova
 * customization of the Customize tab. The stage runs the same stores and Nova components; only the adapters are
 * simulated.
 */
export function CodeTab() {
  const { t } = useI18n();
  const { settings, theme, themeEdited, customization } = usePlayground();
  const [framework, setFramework] = useState<'next' | 'vite'>('next');
  const options = stackOptionsFor(settings, framework);
  const stack = generateStack(options);
  const preset = THEME_PRESETS[settings.theme];
  const css = themeCss(theme, themeEdited ? `${preset.label} (edited)` : preset.label);
  // The headless stage takes the theme only
  const customizationSetup = customizationFiles(customization, css, playgroundSources.files).slice(
    0,
    settings.ui === 'nova' ? undefined : 1,
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">
        {t.playground.inspector.code.introPart1} <code className="font-mono text-xs">satelliteEVMAdapter</code>
        {t.playground.inspector.code.introPart2} <code className="font-mono text-xs">pulsarEvmAdapter</code>
        {t.playground.inspector.code.introPart3}
      </p>
      <div className="flex flex-wrap gap-2">
        <Choice pressed={framework === 'next'} onClick={() => setFramework('next')} compact>
          Next.js
        </Choice>
        <Choice pressed={framework === 'vite'} onClick={() => setFramework('vite')} compact>
          Vite + React
        </Choice>
      </div>
      <h4 className={headingClass}>{t.playground.inspector.code.stackSetup}</h4>
      <div className={frameClass}>
        <FileTabs files={stack.files} label={t.playground.inspector.code.setupFilesAria} />
      </div>
      <h4 className={headingClass}>
        {settings.ui === 'nova'
          ? t.playground.inspector.code.novaCustomization
          : t.playground.inspector.code.themeHeading}
      </h4>
      <p className="-mt-2 text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
        {t.playground.inspector.code.importThemeNote}{' '}
        {settings.ui === 'nova' && t.playground.inspector.code.passObjectsNote}
      </p>
      <div className={frameClass}>
        <FileTabs files={customizationSetup} label={t.playground.inspector.code.customizationFilesAria} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
        <Link href={`/configurator?${stackQuery(options)}`} className="text-[var(--tuwa-text-accent)] hover:underline">
          {t.playground.inspector.code.openInConfigurator}
        </Link>
        <a
          href={STACKBLITZ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--tuwa-text-accent)] hover:underline"
        >
          {t.playground.inspector.code.openInStackblitz}
          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
