'use client';

import { LockClosedIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import type { CSSProperties } from 'react';

import { useI18n } from '@/i18n';
import { THEME_VARIABLES, themeCss } from '@/lib/playground/themes';

import { HeadlessStage } from './HeadlessStage';
import { NovaStage } from './NovaStage';
import { usePlayground } from './PlaygroundContext';

// Nova renders its modals and selects in document.body, outside the stage: they get the theme of the stage while it
// is on the page. The hub header and Nextra have no dialogs on this page.
const PORTALS = "body:has(.tuwa-playground-stage) :is([role='dialog'], [data-radix-popper-content-wrapper])";

// The toasts render inside the page, below the fixed hub header (`h-14`): in a top position they start under it
const TOP_TOASTS = `body:has(.tuwa-playground-stage) :is(.Toastify__toast-container--top-left, .Toastify__toast-container--top-center, .Toastify__toast-container--top-right) {
  top: calc(3.5rem + var(--toastify-toast-offset, 16px));
}`;

/**
 * The simulated dApp: a browser window themed with the Nova variables of the Playground, with the Nova UI Kit or the
 * headless version of the app. The window is drawn in paper and ink whatever its theme: a frame of 1px in the ink of
 * the hub with no shadow, three square marks for its buttons, the address in mono after a pixel lock, a square chip
 * that says the wallets and the chain are simulated (from 640px: on a phone it left the address no room, and the
 * kicker of the page says it). `--playground-frame-radius` carries the hub's radius (square) into
 * the themed window. No ancestor of the stage has a `backdrop-filter` or `transform`, so the fixed Nova toasts stay
 * fixed to the viewport.
 */
export function Stage() {
  const { t } = useI18n();
  const { settings, theme } = usePlayground();
  const style = Object.fromEntries(THEME_VARIABLES.map((variable) => [variable, theme[variable]])) as CSSProperties;

  return (
    <section aria-label={t.playground.stage.stageBadge} className="min-w-0">
      <style>{`${themeCss(theme, 'Playground stage', PORTALS)}\n${TOP_TOASTS}`}</style>
      <div className="overflow-hidden border border-[var(--tuwa-border-strong)] [--playground-frame-radius:var(--tuwa-rounded-corners)]">
        <div className="tuwa-playground-stage" style={style}>
          <div className="flex items-center gap-3 border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((mark) => (
                <span key={mark} className="h-2.5 w-2.5 border border-[var(--tuwa-text-secondary)]" />
              ))}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 border border-[var(--tuwa-border-primary)] px-3 py-1 font-mono text-xs text-[var(--tuwa-text-secondary)]">
              <LockClosedIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">your-dapp.app</span>
            </div>
            <span className="shrink-0 border border-[var(--tuwa-pending-icon)] bg-[var(--tuwa-pending-bg)] px-2 py-1 font-mono text-[10px] leading-none font-bold tracking-[0.12em] text-[var(--tuwa-pending-text)] uppercase max-sm:hidden">
              {t.playground.stage.simulatedLabel}
            </span>
          </div>
          <div className="min-h-[560px] bg-[var(--tuwa-bg-primary)] p-4 text-[var(--tuwa-text-primary)] sm:p-6">
            {settings.ui === 'nova' ? <NovaStage /> : <HeadlessStage />}
          </div>
        </div>
      </div>
    </section>
  );
}
