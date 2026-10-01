'use client';

import { useState } from 'react';

import { type DocEntry, layers } from '../lib/ecosystem';
import type { RepoRelease } from '../lib/github';
import type { PackageDetails } from '../lib/packages';
import { DocCard } from './DocCard';
import { PackageDialog } from './PackageDialog';

/**
 * Appends a "Latest Release" badge when the entry's current tag is known.
 */
function withRelease(entry: DocEntry, release?: RepoRelease | null): DocEntry {
  if (!release) return entry;
  return {
    ...entry,
    packages: [...(entry.packages ?? []), { name: `Latest Release ${release.tag}`, url: release.url }],
  };
}

/**
 * Vertical timeline of TUWA ecosystem layers (`layers` of `src/lib/ecosystem.ts`) with doc cards. Hovering an npm
 * package previews it, a click opens its details.
 * @param props.releases - Latest git tags saved at build time, keyed by entry id (`getReleases`).
 * @param props.packages - npm details of the packages, from `getPackageDetails`.
 */
export function LayerTimeline({
  releases = {},
  packages = {},
}: {
  releases?: Record<string, RepoRelease | null>;
  packages?: Record<string, PackageDetails>;
}) {
  // `name` stays set while the dialog closes, so its content does not vanish before the animation ends
  const [dialog, setDialog] = useState<{ name: string | null; open: boolean }>({ name: null, open: false });
  const openPackage = (name: string) => setDialog({ name, open: true });

  return (
    <div className="relative pl-4 sm:pl-8 border-l border-dashed border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] flex flex-col gap-10 sm:gap-12">
      {layers.map((layer) => (
        <div key={layer.label} className="relative">
          {/* Left dot */}
          <div
            className={`absolute -left-[22px] sm:-left-[39px] top-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-r ${layer.dotGradient} ring-[3px] ring-[var(--tuwa-bg-primary)] dark:ring-gray-950`}
          />

          {/* Layer label */}
          <div className="mb-3 sm:mb-4">
            <span
              className={`text-[11px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-widest ${layer.accentClass}`}
            >
              {layer.label}
            </span>
            <span className="hidden sm:inline text-[11px] 2xl:text-xs text-[var(--tuwa-text-secondary)] ml-2">
              — {layer.subtitle}
            </span>
          </div>

          {/* Cards stack */}
          <div className="flex flex-col gap-2.5">
            {layer.entries.map((entry) => (
              <DocCard
                key={entry.id}
                {...withRelease(entry, releases[entry.id])}
                packageDetails={packages}
                onOpenPackage={openPackage}
              />
            ))}
          </div>
        </div>
      ))}

      <PackageDialog
        open={dialog.open}
        name={dialog.name}
        packages={packages}
        onSelect={openPackage}
        onClose={() => setDialog((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}
