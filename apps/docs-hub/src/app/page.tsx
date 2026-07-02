import { StarryBackground } from '@tuwaio/docs-ui';

import { HeroSection } from '../components/HeroSection';
import { LayerTimeline } from '../components/LayerTimeline';

/**
 * Docs Hub main page — StarryBackground on desktop, decorative orbs on mobile.
 */
export default function DocsHubPage() {
  return (
    <>
      <div className="hidden md:block">
        <StarryBackground />
      </div>

      {/* Mobile-only decorative background — soft brand-colored orbs */}
      <div aria-hidden className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-[var(--tuwa-button-gradient-from)]/25 to-[var(--tuwa-button-gradient-to)]/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-500/20 to-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-5xl px-2 sm:px-6">
          <HeroSection />
          <LayerTimeline />
        </div>
      </div>
    </>
  );
}
