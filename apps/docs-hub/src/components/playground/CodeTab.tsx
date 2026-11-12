'use client';

import { ExternalLinkIcon } from '@tuwaio/nova-core';
import { useState } from 'react';

import Link from '@/components/LocaleNextLink';
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

const frameClass = 'overflow-hidden border border-[var(--tuwa-border-primary)]';
const headingClass =
  'm-0 font-mono text-[11px] leading-[1.35] font-bold tracking-[0.12em] text-[var(--tuwa-text-secondary)] uppercase';

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
      <h2 className={headingClass}>{t.playground.inspector.code.stackSetup}</h2>
      <div className={frameClass}>
        <FileTabs files={stack.files} label={t.playground.inspector.code.setupFilesAria} />
      </div>
      <h2 className={headingClass}>
        {settings.ui === 'nova'
          ? t.playground.inspector.code.novaCustomization
          : t.playground.inspector.code.themeHeading}
      </h2>
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
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
