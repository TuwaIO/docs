'use client';

import { LockClosedIcon } from '@heroicons/react/24/outline';
import type { CSSProperties } from 'react';

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
 * headless version of the app. The window frame keeps the corners and border of the hub; `--playground-frame-radius`
 * carries the hub's radius into the themed window. No ancestor of the stage has a `backdrop-filter` or `transform`, so
 * the fixed Nova toasts stay fixed to the viewport.
 */
export function Stage() {
  const { settings, theme } = usePlayground();
  const style = Object.fromEntries(THEME_VARIABLES.map((variable) => [variable, theme[variable]])) as CSSProperties;

  return (
    <section aria-label="Simulated dApp" className="min-w-0">
      <style>{`${themeCss(theme, 'Playground stage', PORTALS)}\n${TOP_TOASTS}`}</style>
      <div className="overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.08] shadow-xl shadow-black/10 [--playground-frame-radius:var(--tuwa-rounded-corners)]">
        <div className="tuwa-playground-stage" style={style}>
          <div className="flex items-center gap-3 border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-[var(--playground-frame-radius)] bg-[var(--tuwa-bg-muted)] px-3 py-1 font-mono text-xs text-[var(--tuwa-text-secondary)]">
              <LockClosedIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">your-dapp.app</span>
            </div>
            <span className="shrink-0 rounded-[var(--playground-frame-radius)] border border-[var(--tuwa-pending-icon)]/40 bg-[var(--tuwa-pending-bg)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--tuwa-pending-text)]">
              Simulated
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
