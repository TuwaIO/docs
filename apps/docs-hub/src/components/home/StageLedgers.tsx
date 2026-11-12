'use client';

import { useState } from 'react';

import { formatLabel, useI18n } from '@/i18n';
import { formatCheckDate } from '@/lib/comparisons';
import { ecosystemCounts, layers, stagedEntries } from '@/lib/ecosystem';
import type { RepoRelease } from '@/lib/github';
import { sizeMeasuredAt } from '@/lib/ledger';
import type { PackageDetails } from '@/lib/packages';
import { formatPlural } from '@/lib/plural';

import { PackageDialog } from '../PackageDialog';
import { DeprecatedPackageRow, LinkRow, NpmPackageRow } from './PackageRow';
import { ProductRow } from './ProductRow';
import { SectionBar } from './SectionHead';
import { StageLedger } from './StageLedger';

/**
 * The packages of the main page (`#packages`): the bar of the section (`02 / Packages`, with the numbers of packages and
 * products and the licence), then a ledger per stage with its projects and their rows — the npm packages (a click opens
 * the dialog of the package, the pointer its preview), the deprecated one, and the links of a project (guides, the
 * dashboard, the latest release of its repository) — and, under the last stage, the note on how the sizes are measured.
 *
 * Side effects: none; the data comes from the build (`scripts/build-data.mjs`).
 *
 * @param props.releases - The latest release tag of a repository by project id, saved at build time (`getReleases`).
 * @param props.packages - The npm details of the packages by name (`getPackageDetails`).
 * @returns The section.
 */
export function StageLedgers({
  releases = {},
  packages = {},
}: {
  releases?: Record<string, RepoRelease | null>;
  packages?: Record<string, PackageDetails>;
}) {
  const { locale, t } = useI18n();
  const counts = ecosystemCounts();
  const entries = stagedEntries();
  const measuredAt = sizeMeasuredAt(packages);
  // `name` stays set while the dialog closes, so its content does not vanish before the animation ends
  const [dialog, setDialog] = useState<{ name: string | null; open: boolean }>({ name: null, open: false });
  const openPackage = (name: string) => setDialog({ name, open: true });

  return (
    <section id="packages" aria-label={t.home.ledger.section} className="mt-[104px] scroll-mt-[56px]">
      <SectionBar
        number={2}
        name={t.home.ledger.section}
        meta={[
          formatPlural(t.home.board.packages, counts.packages, locale),
          formatPlural(t.home.plate.products, counts.products, locale),
          'Apache-2.0',
        ]}
      />

      {layers.map((layer, index) => (
        <StageLedger key={layer.label} stage={index + 1}>
          {entries
            .filter((entry) => entry.stage === index + 1)
            .map((entry) => {
              const release = releases[entry.id];
              const links = [
                ...(entry.packages ?? []).filter((pkg) => !packages[pkg.name]),
                ...(release ? [{ name: `${t.ui.latestReleasePrefix} ${release.tag}`, url: release.url }] : []),
              ];
              return (
                <ProductRow key={entry.id} entry={entry} tagline={t.home.entries[entry.id]?.tagline ?? entry.tagline}>
                  {(entry.packages ?? []).map((pkg) => {
                    const details = packages[pkg.name];
                    if (!details) return null;
                    return details.deprecated ? (
                      <DeprecatedPackageRow key={pkg.name} details={details} onOpen={() => openPackage(pkg.name)} />
                    ) : (
                      <NpmPackageRow key={pkg.name} details={details} onOpen={() => openPackage(pkg.name)} />
                    );
                  })}
                  {links.map((link) => (
                    <LinkRow
                      key={link.name}
                      name={link.name}
                      url={link.url ?? `https://www.npmjs.com/package/${link.name}`}
                    />
                  ))}
                </ProductRow>
              );
            })}
        </StageLedger>
      ))}

      {measuredAt && (
        <p className="mt-8 flex flex-col gap-2 text-[13px] leading-normal text-[var(--tuwa-text-secondary)] md:flex-row md:gap-5">
          <span className="shrink-0 font-mono text-[11px] font-bold uppercase leading-[1.6] tracking-[0.12em] text-[var(--tuwa-text-primary)]">
            {t.home.sizeNote.title}
          </span>
          <span>{formatLabel(t.ui.packageBadges.size, { date: formatCheckDate(measuredAt, locale) })}</span>
        </p>
      )}

      <PackageDialog
        open={dialog.open}
        name={dialog.name}
        packages={packages}
        onSelect={openPackage}
        onClose={() => setDialog((current) => ({ ...current, open: false }))}
      />
    </section>
  );
}
