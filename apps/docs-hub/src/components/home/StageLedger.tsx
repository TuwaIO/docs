'use client';

import type { ReactNode } from 'react';

import { useI18n } from '@/i18n';

import { ledgerCaps, ledgerProductGrid, ledgerRowGrid, ledgerRowPadding } from './ledgerLayout';

/**
 * The ledger of a stage of the main page (`#stage-<n>`, the target of the stage numbers of the plate and the board):
 * its head — a line of 1px, the number of the stage in a square of ink, its title in mono caps and, on the right from
 * 768px, its subtitle — then, from 768px, the heads of the columns (Project from 1024px, Layer, Package, Version,
 * Licence, Gzip) on the grids of the rows, and the products of the stage. The heads are hidden from assistive
 * technology: every row reads its values out with the names of their columns.
 *
 * @param props.stage - The number of the stage, from 1.
 * @param props.children - The products of the stage (`ProductRow`).
 * @returns The ledger.
 */
export function StageLedger({ stage, children }: { stage: number; children: ReactNode }) {
  const { t } = useI18n();
  const stageText = t.home.timeline.stages[stage];
  const ledger = t.home.ledger;
  const titleId = `stage-${stage}-title`;
  const head = `${ledgerCaps} text-[var(--tuwa-text-secondary)]`;

  return (
    <section id={`stage-${stage}`} aria-labelledby={titleId} className="scroll-mt-[120px] pt-12 md:pt-[72px]">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2 border-t border-[var(--tuwa-border-strong)] pt-4 pb-[18px] md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <span
          aria-hidden="true"
          className="grid h-[34px] w-[34px] place-items-center bg-[var(--tuwa-text-primary)] font-mono text-[13px] font-bold leading-none tracking-[0.04em] text-[var(--tuwa-docs-paper)]"
        >
          {String(stage).padStart(2, '0')}
        </span>
        <h2
          id={titleId}
          className="m-0 font-mono text-[15px] font-bold uppercase leading-[1.25] tracking-[0.12em] text-[var(--tuwa-text-primary)]"
        >
          {stageText?.label ? <span className="sr-only">{stageText.label.replace(stageText.title, '')}</span> : null}
          {stageText?.title}
        </h2>
        <p className="col-span-full m-0 text-[15px] leading-[1.4] text-[var(--tuwa-text-secondary)] md:col-span-1 md:text-right">
          {stageText?.subtitle}
        </p>
      </header>

      <div className="border-t border-[var(--tuwa-border-primary)]">
        <div
          aria-hidden="true"
          className={`hidden border-b border-[var(--tuwa-border-primary)] py-2.5 md:block ${ledgerProductGrid}`}
        >
          <span className={`hidden lg:block ${head}`}>{ledger.project}</span>
          <span className={`${ledgerRowGrid} ${ledgerRowPadding} items-center`}>
            <span className={head}>{ledger.layer}</span>
            <span className={head}>{ledger.package}</span>
            <span className={head}>{ledger.version}</span>
            <span className={head}>{t.ui.packageBadges.license}</span>
            <span className={`text-right ${head}`}>{ledger.gzip}</span>
            <span />
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}
