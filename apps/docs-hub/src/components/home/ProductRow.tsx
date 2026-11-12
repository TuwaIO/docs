'use client';

import { PixelArt, ProjectSquare, startPixelMotion, stopPixelMotion } from '@tuwaio/docs-ui';
import { ExternalLinkIcon } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

import Link from '@/components/LocaleNextLink';
import { useI18n } from '@/i18n';
import type { StagedEntry } from '@/lib/ecosystem';

import { ledgerCaps, ledgerProductGrid } from './ledgerLayout';
import { ARROW_RIGHT } from './pixelArrows';

/** A button of the pair under a project: square, a frame of 1px, mono caps */
const linkClassName = `group/link inline-flex h-8 items-center gap-2 border border-[var(--tuwa-border-strong)] px-3 text-[var(--tuwa-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] hover:text-[var(--tuwa-text-accent)] ${ledgerCaps}`;

/** A link of the pair: a page of the hub through the router with an arrow, another site in a new tab with its mark */
function ProjectLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith('/'))
    return (
      <Link href={href} className={linkClassName}>
        {children}
        <PixelArt
          art={ARROW_RIGHT}
          className="h-2.5 w-2.5 [--tuwa-pixel-ink:currentColor] transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
      {children}
      <ExternalLinkIcon aria-hidden="true" className="h-3 w-3" />
    </a>
  );
}

/**
 * A project of a stage ledger (`#p-<id>`, the target of the plate of the hero and of the board): the cell of the
 * project — its square, its name in mono, its tagline, and the pair of buttons to its documentation and to GitHub — and
 * its rows. On phones the rows go under the cell, at 768px the buttons stand beside the name, and from 1024px the cell
 * takes a column of its own, 260px (300px from 1440px), beside the rows. Under the pointer or the keyboard the corner
 * marks of the square turn to the accent and its icon moves in the way of its project.
 *
 * @param props.entry - The project.
 * @param props.tagline - Its tagline in the language of the page.
 * @param props.children - Its rows (`<li>`).
 * @returns The product.
 */
export function ProductRow({ entry, tagline, children }: { entry: StagedEntry; tagline: string; children: ReactNode }) {
  const { t } = useI18n();
  const titleId = `p-${entry.id}-name`;

  return (
    <article
      id={`p-${entry.id}`}
      aria-labelledby={titleId}
      onMouseEnter={(event) => startPixelMotion(event.currentTarget)}
      onMouseLeave={(event) => stopPixelMotion(event.currentTarget)}
      className={`group scroll-mt-[120px] border-b border-[var(--tuwa-border-primary)] ${ledgerProductGrid}`}
    >
      <div className="grid grid-cols-[44px_minmax(0,1fr)] content-start gap-x-4 gap-y-3.5 py-[18px] md:grid-cols-[44px_minmax(0,1fr)_auto] md:items-center lg:grid-cols-[44px_minmax(0,1fr)] lg:items-start lg:border-r lg:border-[var(--tuwa-border-primary)] lg:py-5 lg:pr-5">
        <ProjectSquare icon={entry.icon} />
        <div className="min-w-0">
          <h3
            id={titleId}
            className="m-0 font-mono text-[17px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--tuwa-text-primary)]"
          >
            {entry.name}
          </h3>
          <p className="mt-1 text-sm leading-[1.4] text-[var(--tuwa-text-secondary)]">{tagline}</p>
        </div>
        {/* The two buttons share the line between them; from 1024px they take the width of the cell, from its left edge:
            under the name they did not fit the column in Ukrainian ("Довідник") */}
        <div className="col-span-full flex md:col-span-1 lg:col-span-full [&>*+*]:border-l-0">
          <ProjectLink href={entry.docsUrl}>{t.home.ledger.docs}</ProjectLink>
          <ProjectLink href={entry.githubUrl}>GitHub</ProjectLink>
        </div>
      </div>
      <ul role="list" className="m-0 list-none border-t border-[var(--tuwa-border-secondary)] p-0 lg:border-t-0">
        {children}
      </ul>
    </article>
  );
}
