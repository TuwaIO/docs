import { StarryBackground } from '@tuwaio/docs-ui';

/**
 * The background of the hub pages, as on tuwa.io: the starry sky from 768px; on a phone, instead of the canvas, the
 * page color of the theme with the soft brand-colored orbs of the site (sizes, colors and blur as tuwa.io renders them
 * on a phone).
 */
export function PageBackground() {
  return (
    <>
      <div className="hidden md:block">
        <StarryBackground />
      </div>
      <div
        aria-hidden
        className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--tuwa-bg-primary)]"
      >
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-[var(--tuwa-button-gradient-from)]/20 to-[var(--tuwa-button-gradient-to)]/10 blur-[8px] opacity-20" />
        <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-600/15 to-cyan-500/10 blur-[8px] opacity-20" />
        <div className="absolute bottom-16 -right-16 h-80 w-80 rounded-full bg-gradient-to-tl from-cyan-500/15 to-emerald-500/10 blur-[8px] opacity-20" />
      </div>
    </>
  );
}
