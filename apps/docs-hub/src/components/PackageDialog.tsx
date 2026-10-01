'use client';

import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CommandLineIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useCopyToClipboard,
} from '@tuwaio/nova-core';
import { Fragment, type ReactNode, useState } from 'react';

import type { PackageDependency, PackageDetails } from '../lib/packages';

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

// The install command of each package manager
const PACKAGE_MANAGERS = [
  { id: 'pnpm', command: 'pnpm add' },
  { id: 'npm', command: 'npm install' },
  { id: 'yarn', command: 'yarn add' },
  { id: 'bun', command: 'bun add' },
] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number]['id'];

// Remembers the chosen package manager in this browser
const PACKAGE_MANAGER_KEY = 'tuwa-docs-hub:package-manager';

function readPackageManager(): PackageManager {
  try {
    const saved = typeof window === 'undefined' ? null : window.localStorage.getItem(PACKAGE_MANAGER_KEY);
    return PACKAGE_MANAGERS.find(({ id }) => id === saved)?.id ?? 'pnpm';
  } catch {
    return 'pnpm';
  }
}

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider text-[var(--tuwa-text-secondary)]">
          {title}
        </h3>
        {aside}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

const chipClass =
  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-[11px] 2xl:text-xs transition-colors';

/**
 * Dialog (the `Dialog` of `@tuwaio/nova-core`) with the details of a TUWA package from npm: version, description,
 * the SDK packages that include it, the install command with its required peers (for pnpm, npm, yarn or bun; the
 * choice is saved to `localStorage` under `tuwa-docs-hub:package-manager`), peer dependencies (required and
 * optional), the TUWA packages it includes and the ones that use it, the hub guides that use it, and links to its
 * reference, npm and source. TUWA packages in the lists open in the same dialog.
 *
 * @param props - See {@link PackageDialogProps}.
 */
export function PackageDialog({ open, name, packages, onSelect, onClose }: PackageDialogProps) {
  const { isCopied, copy } = useCopyToClipboard(2000);
  const [packageManager, setPackageManager] = useState<PackageManager>(readPackageManager);
  const details = name ? packages[name] : undefined;

  const choosePackageManager = (id: PackageManager) => {
    setPackageManager(id);
    try {
      window.localStorage.setItem(PACKAGE_MANAGER_KEY, id);
    } catch {
      // Storage is blocked: the choice lasts until the page is closed
    }
  };

  const packageChip = (packageName: string, label: string = packageName, optional = false) => (
    <button
      key={packageName}
      type="button"
      onClick={() => onSelect(packageName)}
      className={cn(
        chipClass,
        'cursor-pointer border-[var(--tuwa-text-accent)]/40 text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-text-accent)]/10',
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
          chipClass,
          'border-[var(--tuwa-border-primary)]/60 dark:border-white/10 text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
          dependency.optional && 'border-dashed',
        )}
      >
        {label}
      </a>
    );
  };

  const links = details
    ? [
        details.docsUrl && {
          label: details.name.includes('/nova-') ? 'Storybook' : 'Reference',
          href: details.docsUrl,
        },
        { label: 'npm', href: `https://www.npmjs.com/package/${details.name}` },
        details.sourceUrl && { label: 'Source', href: details.sourceUrl },
      ].filter((link): link is { label: string; href: string } => Boolean(link))
    : [];
  const required = details?.peers.filter((peer) => !peer.optional) ?? [];
  const optional = details?.peers.filter((peer) => peer.optional) ?? [];
  const install = details?.install;
  const command = install
    ? `${PACKAGE_MANAGERS.find(({ id }) => id === packageManager)!.command} ${install.packages.join(' ')}`
    : '';
  const peerCount = install ? install.packages.length - 1 : 0;

  return (
    <Dialog open={open && Boolean(details)} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl">
        {details && install && (
          <>
            <DialogHeader className="gap-4">
              <DialogTitle className="flex flex-wrap items-center gap-2 leading-normal">
                {details.layer && (
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--tuwa-bg-secondary)] dark:bg-white/5 border border-[var(--tuwa-border-primary)]/50 text-[var(--tuwa-text-secondary)]">
                    {details.layer}
                  </span>
                )}
                <span className="text-base sm:text-lg break-all">{details.name}</span>
                <span className="text-xs font-normal text-[var(--tuwa-text-secondary)]">v{details.version}</span>
              </DialogTitle>
              <DialogClose
                aria-label="Close"
                className="shrink-0 cursor-pointer rounded-[var(--tuwa-rounded-corners)] p-1 text-[var(--tuwa-text-tertiary)] transition-colors hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
              >
                <CloseIcon aria-hidden="true" />
              </DialogClose>
            </DialogHeader>

            <div className="flex flex-col gap-5 p-4 sm:p-5">
              {details.deprecated && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">Deprecated: {details.deprecated}</p>
              )}
              <DialogDescription className="leading-relaxed 2xl:text-base">{details.description}</DialogDescription>

              {details.includedIn.length > 0 && !details.deprecated && (
                <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
                  <InformationCircleIcon
                    className="w-4 h-4 shrink-0 text-[var(--tuwa-text-accent)]"
                    aria-hidden="true"
                  />
                  <span>
                    Included in{' '}
                    {details.includedIn.map((sdk, index) => (
                      <Fragment key={sdk}>
                        {index > 0 && ' and '}
                        <button
                          type="button"
                          onClick={() => onSelect(sdk)}
                          className="cursor-pointer font-mono text-[var(--tuwa-text-primary)] underline decoration-[var(--tuwa-text-accent)]/50 underline-offset-2 hover:decoration-[var(--tuwa-text-accent)]"
                        >
                          {sdk}
                        </button>
                      </Fragment>
                    ))}
                    : in an app on the TUWA SDK, import it from there instead of installing it.
                  </span>
                </p>
              )}

              {/* Install */}
              {!details.deprecated && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider text-[var(--tuwa-text-secondary)]">
                      Install
                    </h3>
                    <div
                      role="group"
                      aria-label="Package manager"
                      className="flex rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 p-0.5"
                    >
                      {PACKAGE_MANAGERS.map(({ id }) => (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={packageManager === id}
                          onClick={() => choosePackageManager(id)}
                          className={cn(
                            'cursor-pointer rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-0.5 font-mono text-[11px] transition-colors',
                            packageManager === id
                              ? 'bg-[var(--tuwa-text-accent)]/15 text-[var(--tuwa-text-primary)]'
                              : 'text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
                          )}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 bg-[var(--tuwa-bg-secondary)]/50 dark:bg-white/[0.02] pl-3 pr-2 font-mono text-xs sm:text-sm text-[var(--tuwa-text-primary)]">
                    <CommandLineIcon className="w-4 h-4 shrink-0 text-[var(--tuwa-text-accent)]" aria-hidden="true" />
                    {/* One line that scrolls sideways, so a long list of peers keeps the dialog compact; the faded
                    right edge shows that it goes on, and the padding lets its end scroll out of the fade */}
                    <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2.5 pr-8 select-all [scrollbar-width:thin] [mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)]">
                      {command}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(command)}
                      disabled={isCopied}
                      title="Copy the install command"
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-sans cursor-pointer text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] disabled:cursor-default"
                    >
                      {isCopied ? (
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      )}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  {(peerCount > 0 || install.frameworkPeers.length > 0) && (
                    <p className="text-[11px] 2xl:text-xs leading-relaxed text-[var(--tuwa-text-secondary)]">
                      {peerCount > 0 &&
                        `Installs the package with its ${peerCount} required ${peerCount === 1 ? 'peer' : 'peers'}, the peers of TUWA peers included. `}
                      {install.frameworkPeers.length > 0 &&
                        `Also needs ${install.frameworkPeers.map((peer) => `${peer.name} ${peer.range}`).join(' and ')} in the app.`}
                    </p>
                  )}
                </div>
              )}

              {required.length > 0 && <Section title="Required peers">{required.map(dependencyChip)}</Section>}
              {optional.length > 0 && (
                <Section title="Optional peers (install the ones your app uses)">
                  {optional.map(dependencyChip)}
                </Section>
              )}
              {details.includes.length > 0 && (
                <Section title="Includes (re-exported)">{details.includes.map(dependencyChip)}</Section>
              )}
              {details.usedBy.length > 0 && (
                <Section title="Used by">{details.usedBy.map((user) => packageChip(user))}</Section>
              )}
              {details.guides.length > 0 && (
                <Section title="Guides">
                  {details.guides.map((guide) => (
                    <a
                      key={guide.route}
                      href={guide.route}
                      className="inline-flex items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/60 dark:border-white/10 px-2.5 py-1 text-xs text-[var(--tuwa-text-primary)] transition-colors hover:border-[var(--tuwa-text-accent)]/40 hover:bg-[var(--tuwa-text-accent)]/10"
                    >
                      <BookOpenIcon className="w-3.5 h-3.5 text-[var(--tuwa-text-accent)]" aria-hidden="true" />
                      {guide.title}
                    </a>
                  ))}
                </Section>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 border-t border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06]">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--tuwa-text-accent)] hover:underline underline-offset-2"
                  >
                    {link.label}
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
