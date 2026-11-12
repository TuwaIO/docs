'use client';

import { ARROW_RIGHT, PixelArt } from '@tuwaio/docs-ui';
import { ExternalLinkIcon } from '@tuwaio/nova-core';

import Link from '@/components/LocaleNextLink';
import { formatLabel, useI18n } from '@/i18n';
import { formatKb } from '@/lib/bundleSize';
import { formatCheckDate } from '@/lib/comparisons';
import { linkHost } from '@/lib/ecosystem';
import { splitPackageNames } from '@/lib/ledger';
import type { PackageDetails } from '@/lib/packages';

import { PackagePreview } from '../PackagePreview';
import { ledgerCaps, ledgerHover, ledgerRowGrid, ledgerRowPadding } from './ledgerLayout';

/** A row of the list of a product: a line of 1px below it, but the last one */
const itemClassName = 'border-b border-[var(--tuwa-border-secondary)] last:border-b-0';

/** The arrow of a row: it steps to the right under the pointer, in the accent */
function RowArrow() {
  return (
    <PixelArt
      art={ARROW_RIGHT}
      className="h-3.5 w-3.5 justify-self-end [grid-area:go] [--tuwa-pixel-ink:var(--tuwa-text-secondary)] transition-transform duration-200 group-hover/row:translate-x-[3px] group-hover/row:[--tuwa-pixel-ink:var(--tuwa-text-accent)] motion-reduce:transition-none"
    />
  );
}

/** The layer of a package in a square box, its name read out before it */
function LayerBox({ layer, label }: { layer?: string; label: string }) {
  return (
    <span className="inline-grid h-[22px] min-w-[30px] place-items-center justify-self-start border border-[var(--tuwa-border-strong)] px-[5px] font-mono text-[11px] font-bold leading-none tracking-[0.06em] text-[var(--tuwa-text-primary)] [grid-area:layer]">
      <span className="sr-only">{label} </span>
      {layer}
    </span>
  );
}

/**
 * An npm package of a stage ledger: a button that opens its dialog, with its layer, its name and, from 768px in columns
 * (on phones under the name), its version, licence and size; the arrow on the right. Under the pointer the row takes a
 * breath of ink, the name and the arrow the accent, and from 1024px the preview of the package opens below it after a
 * short delay. The preview is a sibling of the button, not inside it: a button may hold no block of content. Every
 * value is read out with the name of its column.
 *
 * @param props.details - The details of the package.
 * @param props.onOpen - Opens the dialog of the package.
 * @returns The row.
 */
export function NpmPackageRow({ details, onOpen }: { details: PackageDetails; onOpen: () => void }) {
  const { locale, t } = useI18n();
  const labels = t.ui.packageBadges;
  const { size } = details;
  const sizeTitle =
    size && details.sizeMeasuredAt
      ? [
          formatLabel(labels.size, { date: formatCheckDate(details.sizeMeasuredAt, locale) }),
          size.lazyGzip ? formatLabel(labels.sizeLazy, { size: formatKb(size.lazyGzip) }) : '',
        ]
          .filter(Boolean)
          .join(' ')
      : undefined;

  return (
    <li className={`group/row relative hover:z-10 focus-within:z-10 ${itemClassName}`}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        className={`${ledgerRowGrid} ${ledgerRowPadding} ${ledgerHover} w-full cursor-pointer items-center py-[11px] text-left transition-colors [grid-template-areas:'layer_name_go'_'layer_meta_go'] md:min-h-12 md:py-0 md:[grid-template-areas:'layer_name_v_lic_sz_go']`}
      >
        <LayerBox layer={details.layer} label={t.home.ledger.layer} />
        <span className="min-w-0 font-mono text-sm font-medium leading-[1.3] text-[var(--tuwa-text-primary)] [grid-area:name] [overflow-wrap:anywhere] group-hover/row:text-[var(--tuwa-text-accent)]">
          {details.name}
        </span>
        <span className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-xs leading-[1.4] text-[var(--tuwa-text-secondary)] [grid-area:meta] md:contents">
          <span className="whitespace-nowrap md:[grid-area:v]" title={labels.version}>
            <span className="sr-only">{t.home.ledger.version} </span>v{details.version}
          </span>
          {details.license && (
            <span className="whitespace-nowrap md:[grid-area:lic]" title={labels.license}>
              <span className="sr-only">{labels.license} </span>
              {details.license}
            </span>
          )}
          {size && (
            <span className="whitespace-nowrap md:text-right md:[grid-area:sz]" title={sizeTitle}>
              {formatKb(size.gzip)}
              <span className="md:sr-only"> gzip</span>
            </span>
          )}
        </span>
        <RowArrow />
      </button>
      <PackagePreview details={details} />
    </li>
  );
}

/**
 * A deprecated npm package of a stage ledger: its name struck through with a DEPRECATED marker in the colour of an
 * error, and, below it, the note of what to use instead, the package names in it set as code. A click opens its dialog.
 *
 * @param props.details - The details of the package.
 * @param props.onOpen - Opens the dialog of the package.
 * @returns The row.
 */
export function DeprecatedPackageRow({ details, onOpen }: { details: PackageDetails; onOpen: () => void }) {
  const { t } = useI18n();
  const note = t.home.packageDialog.packageDeprecations?.[details.name] ?? details.deprecated ?? '';

  return (
    <li className={`group/row relative ${itemClassName}`}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        className={`${ledgerRowGrid} ${ledgerRowPadding} ${ledgerHover} w-full cursor-pointer items-center gap-y-1 py-2.5 text-left transition-colors [grid-template-areas:'layer_name_go'_'layer_note_go'] md:[grid-template-areas:'layer_name_name_name_name_go'_'layer_note_note_note_note_go']`}
      >
        <LayerBox layer={details.layer} label={t.home.ledger.layer} />
        <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 [grid-area:name]">
          <s className="font-mono text-sm font-medium leading-[1.3] text-[var(--tuwa-text-secondary)] decoration-1 [overflow-wrap:anywhere]">
            {details.name}
          </s>
          <span
            className={`inline-flex h-5 items-center border border-current px-1.5 text-[var(--tuwa-error-text)] ${ledgerCaps}`}
          >
            {t.home.ledger.deprecated}
          </span>
        </span>
        <span className="text-[13px] leading-[1.4] text-[var(--tuwa-text-secondary)] [grid-area:note]">
          {splitPackageNames(note).map((part, index) =>
            part.code ? (
              <code key={index} className="font-mono text-xs text-[var(--tuwa-text-primary)]">
                {part.text}
              </code>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </span>
        <RowArrow />
      </button>
    </li>
  );
}

/**
 * A link of a project in its ledger (a guide, a dashboard, the latest release): a dash in the column of the layer, its
 * name, what it leads to on the right (a path of the hub or a host and path) and an arrow to a page of the hub or the
 * external mark to another site, which opens in a new tab.
 *
 * @param props.name - The name of the link.
 * @param props.url - Its target: a path of the hub or an address.
 * @returns The row.
 */
export function LinkRow({ name, url }: { name: string; url: string }) {
  const internal = url.startsWith('/');
  const className = `group/row ${ledgerRowGrid} ${ledgerRowPadding} ${ledgerHover} items-center py-[11px] transition-colors [grid-template-areas:'layer_name_go'_'layer_meta_go'] md:min-h-12 md:py-0 md:[grid-template-areas:'layer_name_host_host_host_go']`;
  const content = (
    <>
      <span aria-hidden="true" className="font-mono text-xs text-[var(--tuwa-text-secondary)] [grid-area:layer]">
        —
      </span>
      <span className="min-w-0 text-[15px] font-medium leading-[1.3] text-[var(--tuwa-text-primary)] [grid-area:name] group-hover/row:text-[var(--tuwa-text-accent)]">
        {name}
      </span>
      <span className="min-w-0 truncate font-mono text-xs text-[var(--tuwa-text-secondary)] [grid-area:meta] md:text-right md:[grid-area:host]">
        {linkHost(url)}
      </span>
      {internal ? (
        <RowArrow />
      ) : (
        <ExternalLinkIcon
          aria-hidden="true"
          className="h-3.5 w-3.5 justify-self-end text-[var(--tuwa-text-secondary)] [grid-area:go] group-hover/row:text-[var(--tuwa-text-accent)]"
        />
      )}
    </>
  );

  return (
    <li className={itemClassName}>
      {internal ? (
        <Link href={url} className={className}>
          {content}
        </Link>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      )}
    </li>
  );
}
