/**
 * Standalone footer for the Docs Hub, visually separated from main content.
 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--tuwa-border-primary)]/10 dark:border-white/[0.04] bg-[var(--tuwa-bg-primary)]/30 dark:bg-[#030303]/20 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl 2xl:max-w-6xl px-2 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--tuwa-text-tertiary)]">
          © 2025–{new Date().getFullYear()} TUWA. All rights reserved.
        </p>
        <p className="text-xs text-[var(--tuwa-text-tertiary)]">Modular Headless Web3 Infrastructure</p>
      </div>
    </footer>
  );
}
