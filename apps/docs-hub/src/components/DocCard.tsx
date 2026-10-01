'use client';

import { ArrowTopRightOnSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Orb, PackageType } from '@tuwaio/docs-ui';
import React, { type FocusEvent, type MouseEvent, type ReactNode, useRef, useState } from 'react';

import type { DocEntry } from '../lib/ecosystem';
import type { PackageDetails } from '../lib/packages';
import { PackagePreview } from './PackagePreview';

export interface DocCardProps extends DocEntry {
  /** Details of the npm packages; a package with details opens them on click and previews them on hover */
  packageDetails?: Record<string, PackageDetails>;
  /** Opens the details of an npm package in the dialog */
  onOpenPackage?: (name: string) => void;
}

// Height of the fixed site header: a preview opened above a row must not slide under it
const HEADER_HEIGHT = 80;

/**
 * A package row that opens the package dialog, with the floating {@link PackagePreview} of the package. The preview
 * opens below the row, or above it when it does not fit below.
 */
function PackageRow({
  details,
  className,
  onOpen,
  children,
}: {
  details: PackageDetails;
  className: string;
  onOpen: () => void;
  children: ReactNode;
}) {
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const previewRef = useRef<HTMLDivElement>(null);

  const place = (event: MouseEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) => {
    const row = event.currentTarget.getBoundingClientRect();
    const height = (previewRef.current?.offsetHeight ?? 0) + 8;
    const fitsBelow = row.bottom + height <= window.innerHeight;
    setPlacement(!fitsBelow && row.top - height >= HEADER_HEIGHT ? 'top' : 'bottom');
  };

  return (
    <div className="group/row relative" onMouseEnter={place} onFocus={place}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        className={`${className} w-full text-left cursor-pointer`}
      >
        {children}
      </button>
      <PackagePreview ref={previewRef} details={details} placement={placement} />
    </div>
  );
}

/**
 * Minimalist card linking to docs and GitHub for a single TUWA module.
 */
export function DocCard({
  name,
  tagline,
  id,
  orb,
  icon,
  gradientFrom,
  gradientTo,
  docsUrl,
  githubUrl,
  packages,
  packageDetails,
  onOpenPackage,
}: DocCardProps) {
  return (
    // No `overflow-hidden`: the package previews float out of the card. A hovered card is raised over the next ones.
    <div className="group relative hover:z-20 focus-within:z-20 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/40 dark:bg-white/[0.02] sm:bg-[var(--tuwa-bg-primary)]/30 dark:sm:bg-white/[0.015] sm:backdrop-blur-sm transition-all duration-300 hover:border-[var(--tuwa-text-accent)]/20 hover:bg-[var(--tuwa-bg-primary)]/50 dark:hover:bg-white/[0.03]">
      {/* Top accent line, clipped to the rounded corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
        />
      </div>

      <div className="flex items-center gap-4 p-4 sm:p-5 2xl:p-6">
        {/* Mobile fallback badge */}
        <div
          className={`shrink-0 w-10 h-10 2xl:w-12 2xl:h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex sm:hidden items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {icon && React.createElement(icon, { className: 'w-5 h-5 2xl:w-6 2xl:h-6 text-white' })}
        </div>

        {/* Desktop Orb badge */}
        <div className="shrink-0 hidden sm:flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <Orb packageType={orb ?? (id as PackageType)} size={48} className="2xl:scale-125 origin-left" icon={icon} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm 2xl:text-base font-semibold text-[var(--tuwa-text-primary)] font-geist-mono uppercase tracking-wide truncate">
            {name}
          </h3>
          <p className="text-xs 2xl:text-sm text-[var(--tuwa-text-secondary)] mt-0.5 truncate">{tagline}</p>
        </div>

        {/* Action icons */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href={docsUrl}
            // The hub's own pages (such as `/quasar`) open in the same tab
            target={docsUrl.startsWith('/') ? undefined : '_blank'}
            rel={docsUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
            title="Documentation"
            className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-accent)] hover:bg-[var(--tuwa-text-accent)]/10 transition-all duration-200"
          >
            <BookOpenIcon className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-[var(--tuwa-rounded-corners)] flex items-center justify-center text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-text-primary)]/10 transition-all duration-200"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </a>
        </div>
      </div>

      {/* Packages section */}
      {packages && packages.length > 0 && (
        <div className="rounded-b-[inherit] border-t border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-muted)]/10 dark:bg-black/10 px-4 py-3 sm:px-5 2xl:px-6 2xl:py-4 flex flex-col gap-2 2xl:gap-2.5">
          {packages.map((pkg) => {
            const isNpmPkg = pkg.name.startsWith('@tuwaio/');
            const rowClass =
              'group/badge flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)]/50 dark:bg-white/[0.015] px-3 py-2 2xl:px-4 2xl:py-2.5 text-xs border border-[var(--tuwa-border-primary)]/40 transition-all duration-200 hover:border-[var(--tuwa-text-accent)]/40 hover:bg-[var(--tuwa-bg-primary)]/80';
            const content = (
              <>
                {/* Left: Layer badge & Package name */}
                <div className="flex items-center gap-2 min-w-0">
                  {pkg.layer && (
                    <span
                      className={`shrink-0 font-mono text-[9px] 2xl:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[var(--tuwa-bg-primary)] dark:bg-white/5 border border-[var(--tuwa-border-primary)]/50 bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}
                    >
                      {pkg.layer}
                    </span>
                  )}
                  <span
                    className={`font-mono text-[11px] sm:text-xs 2xl:text-sm font-semibold text-[var(--tuwa-text-primary)] group-hover/badge:text-[var(--tuwa-text-accent)] transition-colors truncate ${pkg.isDeprecated ? 'line-through opacity-60' : ''}`}
                  >
                    {pkg.name}
                  </span>
                  {pkg.isDeprecated && (
                    <span className="shrink-0 text-[9px] 2xl:text-[10px] uppercase font-bold text-red-500/90 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                      Deprecated
                    </span>
                  )}
                </div>

                {/* Right: Clean, aligned badges (Socket, Downloads, Size) */}
                {isNpmPkg && (
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <img
                      src={`https://socket.dev/api/badge/npm/package/${pkg.name}`}
                      alt={`${pkg.name} Socket security score`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                    <img
                      src={`https://img.shields.io/npm/dm/${pkg.name}.svg?style=flat-square&colorB=5e6ad2`}
                      alt={`${pkg.name} monthly downloads`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                    <img
                      src={`https://img.shields.io/npm/unpacked-size/${pkg.name}?style=flat-square&colorB=3b82f6&label=size`}
                      alt={`${pkg.name} size`}
                      className="h-4 2xl:h-4.5 opacity-80 group-hover/badge:opacity-100 transition-opacity rounded-[2px]"
                    />
                  </div>
                )}
              </>
            );

            // An npm package with details opens them in a dialog; the other rows are links
            const details = isNpmPkg ? packageDetails?.[pkg.name] : undefined;
            return details && onOpenPackage ? (
              <PackageRow key={pkg.name} details={details} className={rowClass} onOpen={() => onOpenPackage(pkg.name)}>
                {content}
              </PackageRow>
            ) : (
              <a
                key={pkg.name}
                href={pkg.url || `https://www.npmjs.com/package/${pkg.name}`}
                target={pkg.url?.startsWith('/') ? undefined : '_blank'}
                rel={pkg.url?.startsWith('/') ? undefined : 'noopener noreferrer'}
                className={rowClass}
              >
                {content}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
