'use client';

import { ProjectSquare, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';
import {
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ExternalLinkIcon,
} from '@tuwaio/nova-core';
import { BookOpenIcon, InformationCircleIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { Fragment, type ReactNode } from 'react';

import { formatLabel, useI18n } from '../i18n';
import { formatKb } from '../lib/bundleSize';
import { projectOfPackage } from '../lib/ecosystem';
import { hrefInLanguage } from '../lib/languageUrls';
import { splitPackageNames } from '../lib/ledger';
import { installCommand, usePackageManager } from '../lib/packageManager';
import type { PackageDependency, PackageDetails } from '../lib/packages';
import { primaryButtonClassName, secondaryButtonClassName, smallButtonClassName } from './buttonStyles';
import { CommandLine, PackageManagerSwitch } from './CommandLine';

export interface PackageDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** The package to show; it stays set while the dialog closes, so the content does not vanish before the animation */
  name: string | null;
  /** Details of every package, for the package and the TUWA packages it links to */
  packages: Record<string, PackageDetails>;
  /** Shows another TUWA package in the dialog */
  onSelect: (name: string) => void;
  /** Called when the dialog closes (close button, Escape or a click outside) */
  onClose: () => void;
}

/** A label of the dialog: mono caps of 11px in the secondary ink */
const capsClassName =
  'm-0 font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em] text-[var(--tuwa-text-secondary)]';

/** A package in a list: a square chip in mono, 24px high, so a finger finds it */
const chipClassName =
  'inline-flex h-6 items-center whitespace-nowrap border px-1.5 font-mono text-[11px] leading-none transition-colors';

/** A small text under a part of the dialog */
const noteClassName = 'm-0 text-[13px] leading-[1.45] text-[var(--tuwa-text-secondary)]';

/** A package named in a sentence, which opens in the dialog */
const inlinePackageClassName =
  'cursor-pointer font-mono text-[0.92em] text-[var(--tuwa-text-primary)] underline decoration-[var(--tuwa-text-accent)] decoration-1 underline-offset-[3px] hover:text-[var(--tuwa-text-accent)]';

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h3 className={capsClassName}>{title}</h3>
        {aside}
      </div>
      {children}
    </div>
  );
}

/**
 * The dialog of a TUWA package (the `Dialog` of `@tuwaio/nova-core`), in paper and ink. Its head has the square of the
 * project of the package, whose icon moves while the pointer is on the head, the name in mono, the facts (version,
 * layer and project, licence, size) and a square close button. Its body has the description, the SDK packages that
 * include the package, the install command with its required peers (for pnpm, npm, yarn or bun; the choice is saved to
 * `localStorage` under `tuwa-docs-hub:package-manager`) and the entries that need fewer peers, then the peers (required,
 * and optional in dashed frames), the TUWA packages it includes and the ones that use it as square chips, and the hub
 * guides that use it. Its foot has the buttons to npm, the reference and the source. A TUWA package in a list or a
 * sentence opens in the same dialog; any other package opens on npm. A deprecated package shows what replaces it and
 * no install command.
 *
 * @param props - See {@link PackageDialogProps}.
 * @returns The dialog.
 */
export function PackageDialog({ open, name, packages, onSelect, onClose }: PackageDialogProps) {
  const { locale, t } = useI18n();
  const [packageManager, choosePackageManager] = usePackageManager();
  const details = name ? packages[name] : undefined;
  const project = details && projectOfPackage(details.name);

  const packageChip = (packageName: string, label: string = packageName, optional = false) => (
    <button
      key={packageName}
      type="button"
      onClick={() => onSelect(packageName)}
      className={cn(
        chipClassName,
        'cursor-pointer border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:border-[var(--tuwa-text-primary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]',
        optional && 'border-dashed',
      )}
    >
      {label}
    </button>
  );

  const dependencyChip = (dependency: PackageDependency) => {
    const label = `${dependency.name} ${dependency.range}`;
    if (packages[dependency.name]) return packageChip(dependency.name, label, dependency.optional);
    return (
      <a
        key={dependency.name}
        href={`https://www.npmjs.com/package/${dependency.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          chipClassName,
          'border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)] hover:border-[var(--tuwa-border-strong)] hover:text-[var(--tuwa-text-primary)]',
          dependency.optional && 'border-dashed',
        )}
      >
        {label}
      </a>
    );
  };

  const chips = (items: ReactNode) => <div className="flex flex-wrap gap-1.5">{items}</div>;

  /** A package name of a sentence: one of the hub opens in the dialog, any other stays as code */
  const inlinePackage = (packageName: string, key: string | number) =>
    packages[packageName] ? (
      <button key={key} type="button" onClick={() => onSelect(packageName)} className={inlinePackageClassName}>
        {packageName}
      </button>
    ) : (
      <code key={key} className="font-mono text-[0.92em] text-[var(--tuwa-text-primary)]">
        {packageName}
      </code>
    );

  const links = details
    ? [
        details.docsUrl && {
          label: details.name.includes('/nova-') ? 'Storybook' : t.ui.referenceLink,
          href: details.docsUrl,
        },
        details.sourceUrl && { label: t.ui.sourceLink, href: details.sourceUrl },
      ].filter((link): link is { label: string; href: string } => Boolean(link))
    : [];
  const required = details?.peers.filter((peer) => !peer.optional) ?? [];
  const optional = details?.peers.filter((peer) => peer.optional) ?? [];
  const install = details?.install;
  const command = install ? installCommand(packageManager, install.packages) : '';
  const peerCount = install ? install.packages.length - 1 : 0;
  const localizedDescription = details
    ? (t.home.packageDialog.packageDescriptions[details.name] ?? details.description)
    : '';
  const localizedDeprecation = details
    ? (t.home.packageDialog.packageDeprecations?.[details.name] ?? details.deprecated ?? '')
    : '';
  const facts = details
    ? [
        `v${details.version}`,
        [details.layer, project?.name].filter(Boolean).join(' · '),
        details.license,
        details.size && `${formatKb(details.size.gzip)} gzip`,
      ].filter((fact): fact is string => Boolean(fact))
    : [];

  return (
    <Dialog open={open && Boolean(details)} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full sm:max-w-[672px]">
        {details && install && (
          <>
            <DialogHeader
              onMouseEnter={(event) => startPixelMotion(event.currentTarget)}
              onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}
              className="group gap-3.5 px-[18px] pt-[18px] pb-4"
            >
              {project && <ProjectSquare icon={project.icon} className="shrink-0" />}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base leading-[1.3] tracking-normal [overflow-wrap:anywhere]">
                  {details.name}
                </DialogTitle>
                <p className="m-0 mt-[5px] flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs leading-[1.3] text-[var(--tuwa-text-secondary)]">
                  {facts.map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </p>
              </div>
              <DialogClose
                aria-label={t.common.close}
                className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center self-start border border-[var(--tuwa-border-strong)] transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]"
              >
                <CloseIcon aria-hidden="true" className="h-3.5 w-3.5" />
              </DialogClose>
            </DialogHeader>

            <div className="flex flex-col gap-4 p-[18px]">
              {details.deprecated && (
                <p className="m-0 text-sm leading-[1.55] text-[var(--tuwa-text-secondary)]">
                  <span className="mr-2.5 inline-flex h-5 items-center border border-current px-1.5 align-middle font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-[var(--tuwa-error-text)]">
                    {t.home.ledger.deprecated}
                  </span>
                  {splitPackageNames(localizedDeprecation).map((part, index) =>
                    part.code ? inlinePackage(part.text, index) : <Fragment key={index}>{part.text}</Fragment>,
                  )}
                </p>
              )}
              <DialogDescription className="m-0 text-sm leading-[1.55]">{localizedDescription}</DialogDescription>

              {details.includedIn.length > 0 && !details.deprecated && (
                <p
                  className={`${noteClassName} flex items-start gap-2.5 border border-[var(--tuwa-border-primary)] p-3`}
                >
                  <InformationCircleIcon
                    className="mt-px h-4 w-4 shrink-0 text-[var(--tuwa-text-accent)]"
                    aria-hidden="true"
                  />
                  <span>
                    {t.ui.includedInPrefix}{' '}
                    {details.includedIn.map((sdk, index) => (
                      <Fragment key={sdk}>
                        {index > 0 && t.ui.includedInAnd}
                        {inlinePackage(sdk, sdk)}
                      </Fragment>
                    ))}
                    {t.ui.includedInSuffix}
                  </span>
                </p>
              )}

              {!details.deprecated && (
                <Section
                  title={t.home.packageDialog.install}
                  aside={<PackageManagerSwitch value={packageManager} onChange={choosePackageManager} />}
                >
                  <CommandLine command={command} copyTitle={t.home.packageDialog.copyInstallTitle} />
                  {(peerCount > 0 || install.frameworkPeers.length > 0) && (
                    <p className={noteClassName}>
                      {peerCount > 0 &&
                        formatLabel(t.ui.installsWithPeers, {
                          count: peerCount,
                          peerWord: peerCount === 1 ? t.ui.peerSingular : t.ui.peerPlural,
                        })}
                      {install.frameworkPeers.length > 0 &&
                        formatLabel(t.ui.alsoNeedsFrameworkPeers, {
                          peers: install.frameworkPeers
                            .map((peer) => `${peer.name} ${peer.range}`)
                            .join(t.ui.includedInAnd),
                        })}
                    </p>
                  )}
                </Section>
              )}

              {!details.deprecated && details.lighterEntries.length > 0 && (
                <Section title={t.home.packageDialog.lighterEntryHeading}>
                  {details.lighterEntries.map((lighter) => (
                    <p key={lighter.entry} className={noteClassName}>
                      <code className="font-mono text-[0.92em] text-[var(--tuwa-text-primary)]">{lighter.entry}</code> (
                      {t.ui.lighterEntryDescriptions[lighter.entry] ?? lighter.description}){' '}
                      {formatLabel(t.ui.lighterDoesNotImport, {
                        peers: lighter.withoutPeers.join(t.ui.includedInAnd),
                      })}
                    </p>
                  ))}
                </Section>
              )}

              {required.length > 0 && (
                <Section title={t.ui.requiredPeers}>{chips(required.map(dependencyChip))}</Section>
              )}
              {optional.length > 0 && (
                <Section title={t.ui.optionalPeersHeading}>{chips(optional.map(dependencyChip))}</Section>
              )}
              {details.includes.length > 0 && (
                <Section title={t.ui.includesHeading}>{chips(details.includes.map(dependencyChip))}</Section>
              )}
              {details.usedBy.length > 0 && (
                <Section title={t.ui.usedBy}>{chips(details.usedBy.map((user) => packageChip(user)))}</Section>
              )}
              {details.guides.length > 0 && (
                <Section title={t.home.packageDialog.guidesHeading}>
                  {chips(
                    details.guides.map((guide) => {
                      const slug = guide.route.split('/').pop() ?? '';
                      const localizedGuideTitle =
                        t.nextra.sidebar[slug] ?? t.configurator.guideTitles[guide.title] ?? guide.title;
                      return (
                        <a
                          key={guide.route}
                          href={hrefInLanguage(guide.route, locale)}
                          className="inline-flex min-h-8 items-center gap-2 border border-[var(--tuwa-border-primary)] px-2.5 py-1.5 text-[13px] leading-[1.3] text-[var(--tuwa-text-primary)] transition-colors hover:border-[var(--tuwa-border-strong)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]"
                        >
                          <BookOpenIcon
                            className="h-3.5 w-3.5 shrink-0 text-[var(--tuwa-text-accent)]"
                            aria-hidden="true"
                          />
                          {localizedGuideTitle}
                        </a>
                      );
                    }),
                  )}
                </Section>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[var(--tuwa-border-primary)] px-[18px] pt-4 pb-[18px]">
              <a
                href={`https://www.npmjs.com/package/${details.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${smallButtonClassName} ${primaryButtonClassName}`}
              >
                {t.home.packageDialog.viewOnNpm}
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${smallButtonClassName} ${secondaryButtonClassName}`}
                >
                  {link.label}
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
