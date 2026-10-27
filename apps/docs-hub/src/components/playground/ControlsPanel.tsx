'use client';

import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import { useI18n } from '@/i18n';
import type { ReplacementReason } from '@/lib/playground/chain';
import { type NovaLanguage, STYLE_KITS, type StyleKit } from '@/lib/playground/customization';
import { logEvent } from '@/lib/playground/eventLog';
import { scenarioStore, type TxOutcome } from '@/lib/playground/scenario';
import { THEME_PRESETS, type ThemePreset } from '@/lib/playground/themes';

import { Choice, Group } from '../configurator/StackOptionsForm';
import { usePlayground } from './PlaygroundContext';

const OUTCOMES: TxOutcome[] = ['success', 'revert', 'replaced', 'rejected'];

// A button or a select in the look of an unpressed `Choice`
const fieldClass =
  'rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/50 dark:border-white/10 font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-border-primary)] transition-colors cursor-pointer';

const divider = 'border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]';

// A theme in one dot: its background and the color of its buttons
function Swatch({ preset }: { preset: ThemePreset }) {
  return (
    <span
      className="h-3 w-3 shrink-0 rounded-full border border-black/15 dark:border-white/25"
      style={{
        background: `linear-gradient(135deg, ${preset.values['--tuwa-bg-primary']} 50%, ${preset.values['--tuwa-button-gradient-from']} 50%)`,
      }}
      aria-hidden="true"
    />
  );
}

/** The theme presets as a menu button: it closes on a pick, a click outside or Escape. */
function ThemeMenu() {
  const { t } = useI18n();
  const { settings, changeSettings } = usePlayground();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const preset = THEME_PRESETS[settings.theme];
  const presetLabel = t.playground.inspector.customize.themePresets[preset.id]?.label ?? preset.label;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => !menu.current?.contains(event.target as Node) && setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(fieldClass, 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs')}
      >
        <Swatch preset={preset} />
        {presetLabel}
        <ChevronDownIcon className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t.playground.inspector.customize.themeLayer}
          className="absolute top-full left-0 z-30 mt-1 flex w-52 flex-col gap-0.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-1 shadow-xl"
        >
          {Object.values(THEME_PRESETS).map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={settings.theme === option.id}
              onClick={() => {
                changeSettings({ theme: option.id });
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-1.5 text-left text-xs font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] aria-selected:bg-[var(--tuwa-text-accent)]/10 aria-selected:text-[var(--tuwa-text-primary)] cursor-pointer"
            >
              <Swatch preset={option} />
              {t.playground.inspector.customize.themePresets[option.id]?.label ?? option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const LANGUAGE_OPTIONS: { id: NovaLanguage; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'zh', label: '简体中文', short: 'CN' },
  { id: 'uk', label: 'Українська', short: 'UA' },
];

/** The language selection as a dropdown menu in the same style as ThemeMenu. */
function LanguageMenu() {
  const { t } = useI18n();
  const { customization, changeCustomization } = usePlayground();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((opt) => opt.id === customization.language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => !menu.current?.contains(event.target as Node) && setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(fieldClass, 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs')}
      >
        <span>{current.short}</span>
        <span className="text-[var(--tuwa-text-tertiary)]">·</span>
        <span>{current.label}</span>
        <ChevronDownIcon className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t.playground.inspector.customize.languageLabel}
          className="absolute top-full left-0 z-30 mt-1 flex w-44 flex-col gap-0.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-1 shadow-xl"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={customization.language === option.id}
              onClick={() => {
                changeCustomization({ language: option.id });
                setOpen(false);
              }}
              className="flex items-center justify-between rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-1.5 text-left text-xs font-medium text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] aria-selected:bg-[var(--tuwa-text-accent)]/10 aria-selected:text-[var(--tuwa-text-primary)] cursor-pointer"
            >
              <span>{option.label}</span>
              <span className="font-mono text-[11px] text-[var(--tuwa-text-tertiary)]">{option.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** The stack of the stage: chains, UI and features. */
function StackGroups({ compact }: { compact: boolean }) {
  const { t } = useI18n();
  const { settings, changeSettings } = usePlayground();
  return (
    <>
      <Group label={t.playground.controls.chains} info={t.ui.playgroundExtra.info.chains} compact={compact}>
        <Choice
          pressed={settings.evm}
          disabled={settings.evm && !settings.solana}
          onClick={() => changeSettings({ evm: !settings.evm })}
          compact={compact}
        >
          EVM
        </Choice>
        <Choice
          pressed={settings.solana}
          disabled={settings.solana && !settings.evm}
          onClick={() => changeSettings({ solana: !settings.solana })}
          compact={compact}
        >
          Solana
        </Choice>
      </Group>
      <Group label={t.playground.controls.ui} info={t.ui.playgroundExtra.info.ui} compact={compact}>
        <Choice pressed={settings.ui === 'nova'} onClick={() => changeSettings({ ui: 'nova' })} compact={compact}>
          {t.playground.controls.uiNova}
        </Choice>
        <Choice
          pressed={settings.ui === 'headless'}
          onClick={() => changeSettings({ ui: 'headless' })}
          compact={compact}
        >
          {t.playground.controls.uiHeadless}
        </Choice>
      </Group>
      <Group label={t.ui.configuratorExtra.featuresLabel} info={t.ui.playgroundExtra.info.features} compact={compact}>
        <Choice
          pressed={settings.siwx}
          disabled={settings.quasar}
          onClick={() => changeSettings({ siwx: !settings.siwx })}
          compact={compact}
        >
          {t.ui.configuratorExtra.siwxChoice}
        </Choice>
        <Choice
          pressed={settings.quasar}
          onClick={() => changeSettings({ quasar: !settings.quasar })}
          compact={compact}
        >
          {t.ui.configuratorExtra.quasarChoice}
        </Choice>
      </Group>
    </>
  );
}

/** The look of the stage: the theme (a menu in the panel, buttons in the sheet), the style kit, the connect button. */
function LookGroups({ compact }: { compact: boolean }) {
  const { t } = useI18n();
  const { settings, customization, changeSettings, changeCustomization } = usePlayground();
  return (
    <>
      <Group
        label={t.playground.inspector.customize.themeLayer}
        info={t.ui.playgroundExtra.info.theme}
        compact={compact}
      >
        {compact ? (
          <ThemeMenu />
        ) : (
          Object.values(THEME_PRESETS).map((preset) => (
            <Choice
              key={preset.id}
              pressed={settings.theme === preset.id}
              onClick={() => changeSettings({ theme: preset.id })}
            >
              <span className="inline-flex items-center gap-1.5">
                <Swatch preset={preset} />
                {t.playground.inspector.customize.themePresets[preset.id]?.label ?? preset.label}
              </span>
            </Choice>
          ))
        )}
      </Group>
      {settings.ui === 'nova' && (
        <>
          <Group
            label={t.playground.inspector.customize.styleLayer}
            info={t.ui.playgroundExtra.info.style}
            compact={compact}
          >
            {(Object.keys(STYLE_KITS) as StyleKit[]).map((kit) => (
              <Choice
                key={kit}
                pressed={customization.style === kit}
                onClick={() => changeCustomization({ style: kit })}
                compact={compact}
              >
                {t.playground.inspector.customize.styleKits[kit]?.label ?? STYLE_KITS[kit].label}
              </Choice>
            ))}
          </Group>
          {/* Minimal: the connect button alone, without the balance and the network selector */}
          <Group
            label={t.ui.playgroundExtra.connectButtonGroup}
            info={t.ui.playgroundExtra.info.connectButton}
            compact={compact}
          >
            {[false, true].map((minimal) => (
              <Choice
                key={String(minimal)}
                pressed={customization.withBalance === !minimal && customization.withChain === !minimal}
                onClick={() => changeCustomization({ withBalance: !minimal, withChain: !minimal })}
                compact={compact}
              >
                {minimal ? t.ui.playgroundExtra.minimal : t.ui.playgroundExtra.full}
              </Choice>
            ))}
          </Group>
          <Group
            label={t.playground.inspector.customize.languageLabel}
            info={t.ui.playgroundExtra.info.language}
            compact={compact}
          >
            {compact ? (
              <LanguageMenu />
            ) : (
              LANGUAGE_OPTIONS.map((option) => (
                <Choice
                  key={option.id}
                  pressed={customization.language === option.id}
                  onClick={() => changeCustomization({ language: option.id })}
                >
                  <span>{option.label}</span>
                  <span className="ml-1 text-[var(--tuwa-text-tertiary)]">({option.short})</span>
                </Choice>
              ))
            )}
          </Group>
        </>
      )}
    </>
  );
}

function useLatestPendingEvmTx() {
  const { device } = usePlayground();
  const pool = device.usePulsarStore((state) => state.transactionsPool);
  return Object.values(pool)
    .filter((tx) => tx.pending && tx.adapter === OrbitAdapter.EVM)
    .sort((a, b) => b.localTimestamp - a.localTimestamp)[0];
}

/** The simulation: the next transaction (in the panel; the phone bar has its own), speed, signatures, Quasar, EVM. */
function SimulationGroups({ compact }: { compact: boolean }) {
  const { t } = useI18n();
  const { settings, families, device } = usePlayground();
  const scenario = useStore(scenarioStore);
  const pendingEvmTx = useLatestPendingEvmTx();

  const replace = async (reason: ReplacementReason) => {
    if (!pendingEvmTx) return;
    const adapter = [device.pulsarStore.getState().getAdapter()].flat().find(({ key }) => key === OrbitAdapter.EVM);
    try {
      await (reason === 'speed-up'
        ? adapter?.speedUpTxAction?.(pendingEvmTx)
        : adapter?.cancelTxAction?.(pendingEvmTx));
    } catch (error) {
      logEvent('Wallet', error instanceof Error ? error.message : String(error));
    }
  };

  const setQuasarOnline = (online: boolean) => {
    scenarioStore.setState({ quasarOnline: online });
    logEvent('Quasar', online ? 'Quasar is back online' : 'Quasar is offline');
    // Pulsar retries the unsynced transactions; an app does it on the next transaction or history load
    if (online) void device.pulsarStore.getState().reconcileUnsyncedTransactions();
  };

  return (
    <>
      {compact && (
        <Group label={t.ui.playgroundExtra.nextTxGroup} info={t.ui.playgroundExtra.info.outcome} compact>
          {OUTCOMES.map((id) => (
            <Choice
              key={id}
              pressed={scenario.outcome === id}
              onClick={() => scenarioStore.setState({ outcome: id })}
              compact
            >
              {t.ui.playgroundExtra.outcomeLabels[id]}
            </Choice>
          ))}
        </Group>
      )}
      <Group label={t.ui.playgroundExtra.speedGroup} info={t.ui.playgroundExtra.info.speed} compact={compact}>
        <Choice
          pressed={scenario.speed === 'realistic'}
          onClick={() => scenarioStore.setState({ speed: 'realistic' })}
          compact={compact}
        >
          {t.playground.controls.realistic}
        </Choice>
        <Choice
          pressed={scenario.speed === 'fast'}
          onClick={() => scenarioStore.setState({ speed: 'fast' })}
          compact={compact}
        >
          {t.playground.controls.fast}
        </Choice>
      </Group>
      {settings.siwx && (
        <Group
          label={t.ui.playgroundExtra.signaturesGroup}
          info={t.ui.playgroundExtra.info.signatures}
          compact={compact}
        >
          <Choice
            pressed={!scenario.rejectSignature}
            onClick={() => scenarioStore.setState({ rejectSignature: false })}
            compact={compact}
          >
            {t.ui.playgroundExtra.approve}
          </Choice>
          <Choice
            pressed={scenario.rejectSignature}
            onClick={() => scenarioStore.setState({ rejectSignature: true })}
            compact={compact}
          >
            {t.ui.playgroundExtra.reject}
          </Choice>
        </Group>
      )}
      {settings.quasar && (
        <Group label={t.ui.playgroundExtra.quasarGroup} info={t.ui.playgroundExtra.info.quasar} compact={compact}>
          <Choice pressed={scenario.quasarOnline} onClick={() => setQuasarOnline(true)} compact={compact}>
            {t.ui.playgroundExtra.online}
          </Choice>
          <Choice pressed={!scenario.quasarOnline} onClick={() => setQuasarOnline(false)} compact={compact}>
            {t.ui.playgroundExtra.offline}
          </Choice>
        </Group>
      )}
      {families.includes(OrbitAdapter.EVM) && (
        <Group
          label={t.ui.playgroundExtra.pendingEvmGroup}
          info={t.ui.playgroundExtra.info.pendingEvm}
          compact={compact}
        >
          <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('speed-up')} compact={compact}>
            {t.ui.playgroundExtra.speedUp}
          </Choice>
          <Choice pressed={false} disabled={!pendingEvmTx} onClick={() => void replace('cancel')} compact={compact}>
            {t.ui.playgroundExtra.cancel}
          </Choice>
        </Group>
      )}
    </>
  );
}

/** The session actions: a new device (with Quasar) and a full reset. */
function SessionActions({ className, short }: { className?: string; short?: boolean }) {
  const { t } = useI18n();
  const { settings, openOnAnotherDevice, resetPlayground } = usePlayground();
  return (
    <div className={cn('flex gap-2', className)}>
      {settings.quasar && (
        <button
          type="button"
          onClick={openOnAnotherDevice}
          title={t.playground.controls.openAnotherDeviceHint}
          className={cn(fieldClass, 'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs')}
        >
          <DevicePhoneMobileIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {short ? t.ui.playgroundExtra.otherDeviceShort : t.playground.controls.openAnotherDevice}
        </button>
      )}
      <button
        type="button"
        onClick={resetPlayground}
        title={t.ui.playgroundExtra.resetTitle}
        aria-label={short ? t.playground.controls.resetPlayground : undefined}
        className={cn(fieldClass, 'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs')}
      >
        <ArrowPathIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {!short && t.ui.playgroundExtra.resetShort}
      </button>
    </div>
  );
}

function OutcomeHint() {
  const { t } = useI18n();
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  return (
    <p className="text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
      {t.ui.playgroundExtra.outcomeHints[outcome]}
    </p>
  );
}

/**
 * The controls above the stage: the stack, the look and the simulation. From 640px they are a panel in two rows; on a
 * phone a bar keeps the next transaction and the session actions, and the rest opens in a sheet from the bottom.
 */
export function ControlsPanel() {
  const { t } = useI18n();
  const { settings } = usePlayground();
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  const sheet = useRef<HTMLDialogElement>(null);
  const chains = [settings.evm && 'EVM', settings.solana && 'Solana'].filter(Boolean).join(', ');
  const presetLabel =
    t.playground.inspector.customize.themePresets[settings.theme]?.label ?? THEME_PRESETS[settings.theme].label;

  return (
    <section
      aria-label={t.playground.controls.stackHeading}
      className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm p-2.5 sm:p-4"
    >
      <div className="hidden flex-col gap-3.5 sm:flex">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3.5">
          <StackGroups compact />
          <LookGroups compact />
        </div>
        <div className={cn('flex flex-wrap items-end gap-x-6 gap-y-3.5 border-t pt-3.5', divider)}>
          <SimulationGroups compact />
          <SessionActions className="ml-auto" />
        </div>
        <OutcomeHint />
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => sheet.current?.showModal()}
          className="flex min-h-11 items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10 px-3 text-sm font-semibold cursor-pointer"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t.ui.playgroundExtra.setupButton}
          <span className="ml-auto truncate text-xs font-medium text-[var(--tuwa-text-secondary)]">
            {chains} · {presetLabel}
          </span>
        </button>
        <div className="flex gap-2">
          <label className={cn(fieldClass, 'relative flex min-h-11 flex-1 items-center gap-2 pl-2.5')}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--tuwa-text-tertiary)]">
              {t.ui.playgroundExtra.nextTxShort}
            </span>
            <select
              value={outcome}
              onChange={(event) => scenarioStore.setState({ outcome: event.target.value as TxOutcome })}
              className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-sm text-[var(--tuwa-text-primary)] outline-none cursor-pointer [&_option]:bg-[var(--tuwa-bg-secondary)]"
            >
              {OUTCOMES.map((id) => (
                <option key={id} value={id}>
                  {t.ui.playgroundExtra.outcomeLabels[id]}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-4 w-4" aria-hidden="true" />
          </label>
          <SessionActions short className="[&>button]:min-h-11 [&>button]:min-w-11" />
        </div>
        <OutcomeHint />
      </div>

      {/* A modal sheet: the backdrop closes it, as does Escape */}
      <dialog
        ref={sheet}
        aria-label={t.ui.playgroundExtra.setupButton}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="mt-auto mb-0 max-h-[85dvh] w-full max-w-none open:flex open:flex-col rounded-t-[var(--tuwa-rounded-corners)] border-t border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-0 text-[var(--tuwa-text-primary)] backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:hidden"
      >
        <div className={cn('flex items-center justify-between border-b px-4 py-2', divider)}>
          <span className="font-semibold">{t.ui.playgroundExtra.setupButton}</span>
          <button
            type="button"
            onClick={() => sheet.current?.close()}
            aria-label={t.ui.playgroundExtra.closeSetup}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--tuwa-rounded-corners)] text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-4 pb-8">
          <StackGroups compact={false} />
          <LookGroups compact={false} />
          <SimulationGroups compact={false} />
        </div>
      </dialog>
    </section>
  );
}
