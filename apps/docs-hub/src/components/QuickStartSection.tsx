'use client';

import { CheckIcon, ClipboardDocumentIcon, CommandLineIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useCopyToClipboard } from '@tuwaio/nova-core';

export function QuickStartSection() {
  const { isCopied, copy } = useCopyToClipboard(2000);
  const command = 'npx @tuwaio/create-cosmos-playground';

  const handleCopyCommand = async () => {
    await copy(command);
  };

  return (
    <section className="relative w-full mt-16 pt-12 pb-16 border-t border-dashed border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg opacity-90">
            <RocketLaunchIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-geist-mono uppercase tracking-wide text-[var(--tuwa-text-primary)]">
            Quick Start{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cosmos Playground
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--tuwa-text-secondary)] mt-2 max-w-lg">
            Run the command below in your terminal to bootstrap a ready-to-use Web3 project template pre-configured with
            the TUWA stack.
          </p>
        </div>

        {/* Terminal Command Box */}
        <div className="relative group max-w-2xl mx-auto mb-10">
          <div className="bg-[var(--tuwa-bg-primary)]/80 dark:bg-white/[0.02] border border-[var(--tuwa-border-primary)]/50 rounded-[var(--tuwa-rounded-corners)] p-4 sm:p-5 flex items-center justify-between gap-4 font-mono text-xs sm:text-sm text-[var(--tuwa-text-primary)] backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <CommandLineIcon className="w-4 h-4 text-[var(--tuwa-text-accent)] shrink-0" aria-hidden="true" />
              <span className="text-[var(--tuwa-text-accent)] font-bold">$</span>
              <span className="select-all truncate">{command}</span>
            </div>
            <button
              type="button"
              disabled={isCopied}
              onClick={handleCopyCommand}
              title="Copy terminal command"
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)] dark:bg-white/5 border border-[var(--tuwa-border-primary)]/60 text-xs font-sans text-[var(--tuwa-text-secondary)] transition-all duration-200 ${
                isCopied
                  ? 'cursor-not-allowed opacity-90'
                  : 'cursor-pointer hover:text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-accent)]/50'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Numbered Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/20 dark:bg-white/[0.01] p-4 flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[var(--tuwa-text-primary)] font-geist-mono">
                Run command
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--tuwa-text-secondary)] mt-1 leading-relaxed">
                Execute the interactive CLI command in your project directory.
              </p>
            </div>
          </div>

          <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/20 dark:bg-white/[0.01] p-4 flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[var(--tuwa-text-primary)] font-geist-mono">
                Select template
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--tuwa-text-secondary)] mt-1 leading-relaxed">
                Choose React or Next.js templates for EVM, Solana, or Multi-chain.
              </p>
            </div>
          </div>

          <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/20 dark:bg-white/[0.01] p-4 flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[var(--tuwa-text-primary)] font-geist-mono">
                Start building
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--tuwa-text-secondary)] mt-1 leading-relaxed">
                Run local dev server and start creating self-custodial Web3 dApps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
