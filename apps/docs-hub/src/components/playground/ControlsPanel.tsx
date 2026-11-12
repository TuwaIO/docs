'use client';

import { cn } from '@tuwaio/nova-core/utils';
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
} from '@tuwaio/sdk/nova-icons/24/outline';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import { useI18n } from '@/i18n';
import type { ReplacementReason } from '@/lib/playground/chain';
import { type NovaLanguage, STYLE_KITS, type StyleKit } from '@/lib/playground/customization';
import { logEvent } from '@/lib/playground/eventLog';
import { nextTxFamily, outcomeHintOf, outcomeLabelOf, scenarioStore, type TxOutcome } from '@/lib/playground/scenario';
import { THEME_PRESETS, type ThemePreset } from '@/lib/playground/themes';
import { familyOf } from '@/lib/playground/wallets';

import { Choice, Group } from '../configurator/StackOptionsForm';
import { homeEdgeToEdgeClassName, homeMarginLeftClassName, homeMarginRightClassName } from '../home/homeLayout';
import { CrossMark } from '../home/SectionHead';
import { usePlayground } from './PlaygroundContext';
import {
  capsClassName,
  fieldClassName,
  iconClassName,
  lineClassName,
  menuClassName,
  menuOptionClassName,
} from './playgroundStyles';

const OUTCOMES: TxOutcome[] = ['success', 'revert', 'replaced', 'rejected'];

// The margins of the column of the page, for a row that runs from line to line of its frame
const marginsClassName = `${homeMarginLeftClassName} ${homeMarginRightClassName}`;

// A theme in one square: its background on the left half, the colour of its buttons on the right
function Swatch({ preset }: { preset: ThemePreset }) {
  return (
    <span className="grid h-3 w-3 shrink-0 grid-cols-2 border border-current" aria-hidden="true">
      <span style={{ background: preset.values['--tuwa-bg-primary'] }} />
      <span style={{ background: preset.values['--tuwa-button-gradient-from'] }} />
    </span>
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
        className={fieldClassName}
      >
        <Swatch preset={preset} />
        {presetLabel}
        <ChevronDownIcon className={cn(iconClassName, open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t.playground.inspector.customize.themeLayer}
          className={`${menuClassName} w-56`}
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
              className={menuOptionClassName}
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
        className={fieldClassName}
      >
        <span>{current.short}</span>
        <span className="text-[var(--tuwa-text-secondary)]">·</span>
        <span>{current.label}</span>
        <ChevronDownIcon className={cn(iconClassName, open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t.playground.inspector.customize.languageLabel}
          className={`${menuClassName} w-48`}
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
              className={`${menuOptionClassName} justify-between`}
            >
              <span>{option.label}</span>
              <span className="font-medium">{option.short}</span>
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
                  <span className="ml-1 font-medium">({option.short})</span>
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

/** The chain family the next transaction goes to, which decides what the `replaced` outcome is called. */
function useNextTxFamily() {
  const { families } = usePlayground();
  const connectorType = useSatelliteConnectStore((state) => state.activeConnection?.connectorType);
  return nextTxFamily(connectorType ? familyOf(connectorType) : undefined, families);
}

/** The simulation: the next transaction (in the panel; the phone bar has its own), speed, signatures, Quasar, EVM. */
function SimulationGroups({ compact }: { compact: boolean }) {
  const { t } = useI18n();
  const { settings, families, device } = usePlayground();
  const scenario = useStore(scenarioStore);
  const pendingEvmTx = useLatestPendingEvmTx();
  const nextFamily = useNextTxFamily();

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
              {t.ui.playgroundExtra.outcomeLabels[outcomeLabelOf(id, nextFamily)]}
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
          className={cn(fieldClassName, 'justify-center')}
        >
          <DevicePhoneMobileIcon className={iconClassName} aria-hidden="true" />
          {short ? t.ui.playgroundExtra.otherDeviceShort : t.playground.controls.openAnotherDevice}
        </button>
      )}
      <button
        type="button"
        onClick={resetPlayground}
        title={t.ui.playgroundExtra.resetTitle}
        aria-label={short ? t.playground.controls.resetPlayground : undefined}
        className={cn(fieldClassName, 'justify-center')}
      >
        <ArrowPathIcon className={iconClassName} aria-hidden="true" />
        {!short && t.ui.playgroundExtra.resetShort}
      </button>
    </div>
  );
}

function OutcomeHint() {
  const { t } = useI18n();
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  const nextFamily = useNextTxFamily();
  return (
    <p className="m-0 text-[13px] leading-normal text-[var(--tuwa-text-secondary)]">
      {t.ui.playgroundExtra.outcomeHints[outcomeHintOf(outcome, nextFamily)]}
    </p>
  );
}

/**
 * The controls above the stage, from line to line of the frame of the page, on lines of 1px: the stack and the look in
 * one row, the simulation and the session actions in the next, and what the next transaction will do under them. From
 * 640px they are these rows; on a phone a bar keeps the next transaction and the session actions, and the rest opens
 * in a sheet from the bottom.
 */
export function ControlsPanel() {
  const { t } = useI18n();
  const { settings } = usePlayground();
  const outcome = useStore(scenarioStore, (state) => state.outcome);
  const nextFamily = useNextTxFamily();
  const sheet = useRef<HTMLDialogElement>(null);
  const chains = [settings.evm && 'EVM', settings.solana && 'Solana'].filter(Boolean).join(', ');
  const presetLabel =
    t.playground.inspector.customize.themePresets[settings.theme]?.label ?? THEME_PRESETS[settings.theme].label;

  return (
    <section
      aria-label={t.playground.controls.stackHeading}
      className={`relative border-y ${lineClassName} ${homeEdgeToEdgeClassName}`}
    >
      <CrossMark x="left" y="top" />
      <CrossMark x="right" y="top" />
      <CrossMark x="left" y="bottom" />
      <CrossMark x="right" y="bottom" />

      <div className="hidden flex-col sm:flex">
        <div className={`flex flex-wrap items-start gap-x-7 gap-y-4 py-5 ${marginsClassName}`}>
          <StackGroups compact />
          <LookGroups compact />
        </div>
        <div className={`flex flex-wrap items-end gap-x-7 gap-y-4 border-t py-5 ${lineClassName} ${marginsClassName}`}>
          <SimulationGroups compact />
          <SessionActions className="ml-auto" />
        </div>
        <div className={`border-t py-3.5 ${lineClassName} ${marginsClassName}`}>
          <OutcomeHint />
        </div>
      </div>

      <div className={`flex flex-col gap-2.5 py-4 sm:hidden ${marginsClassName}`}>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => sheet.current?.showModal()}
          className={`flex min-h-11 cursor-pointer items-center gap-2.5 border border-[var(--tuwa-text-primary)] px-3 text-[var(--tuwa-text-primary)] ${capsClassName}`}
        >
          <AdjustmentsHorizontalIcon className={iconClassName} aria-hidden="true" />
          {t.ui.playgroundExtra.setupButton}
          <span className="ml-auto truncate font-medium text-[var(--tuwa-text-secondary)]">
            {chains} · {presetLabel}
          </span>
        </button>
        {/* The session actions go under the next transaction when the two do not fit one line of a phone */}
        <div className="flex flex-wrap gap-2.5">
          <label className="relative flex min-h-11 min-w-0 flex-1 basis-48 cursor-pointer items-center gap-2.5 border border-[var(--tuwa-border-strong)] pl-3">
            <span className={`text-[var(--tuwa-text-secondary)] ${capsClassName}`}>
              {t.ui.playgroundExtra.nextTxShort}
            </span>
            <select
              value={outcome}
              onChange={(event) => scenarioStore.setState({ outcome: event.target.value as TxOutcome })}
              className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-8 text-sm text-[var(--tuwa-text-primary)] outline-none [&_option]:bg-[var(--tuwa-docs-raised)]"
            >
              {OUTCOMES.map((id) => (
                <option key={id} value={id}>
                  {t.ui.playgroundExtra.outcomeLabels[outcomeLabelOf(id, nextFamily)]}
                </option>
              ))}
            </select>
            <ChevronDownIcon className={`pointer-events-none absolute right-2.5 ${iconClassName}`} aria-hidden="true" />
          </label>
          <SessionActions
            short
            className="[&:has(>button:nth-child(2))]:grow [&>button]:min-h-11 [&>button]:min-w-11 [&>button:first-child:not(:last-child)]:grow"
          />
        </div>
        <OutcomeHint />
      </div>

      {/* A modal sheet: the backdrop closes it, as does Escape */}
      <dialog
        ref={sheet}
        aria-label={t.ui.playgroundExtra.setupButton}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="mt-auto mb-0 max-h-[85dvh] w-full max-w-none border-t border-[var(--tuwa-text-primary)] bg-[var(--tuwa-docs-paper)] p-0 text-[var(--tuwa-text-primary)] backdrop:bg-black/60 open:flex open:flex-col sm:hidden"
      >
        <div className={cn('flex items-center justify-between border-b py-1 pr-1 pl-4', lineClassName)}>
          <span className={capsClassName}>{t.ui.playgroundExtra.setupButton}</span>
          <button
            type="button"
            onClick={() => sheet.current?.close()}
            aria-label={t.ui.playgroundExtra.closeSetup}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]"
          >
            <XMarkIcon className={iconClassName} aria-hidden="true" />
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
