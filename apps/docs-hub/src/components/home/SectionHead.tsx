import type { ReactNode } from 'react';

import { homeBleedClassName } from './homeLayout';

/**
 * The kicker of a part of the main page: a lit square and a line in mono caps.
 *
 * @param props.children - The line.
 * @returns The kicker.
 */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase leading-[1.2] tracking-[0.12em] text-[var(--tuwa-text-secondary)]">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-[var(--tuwa-docs-lit)]" />
      {children}
    </p>
  );
}

/**
 * A cross of two lines of 11px where a rule of the main page meets a side of its frame, from 1280px (the frame has no
 * sides on narrower screens). Placed in a part whose top or bottom line is the rule and whose side is on the inside of
 * the side of the frame.
 *
 * @param props.x - The side of the frame.
 * @param props.y - The line of the part the rule is.
 * @returns The cross.
 */
export function CrossMark({ x, y }: { x: 'left' | 'right'; y: 'top' | 'bottom' }) {
  const across = `${x === 'left' ? '-left-[6px]' : '-right-[6px]'} ${y === 'top' ? '-top-px' : '-bottom-px'}`;
  const down = `${x === 'left' ? '-left-px' : '-right-px'} ${y === 'top' ? '-top-[6px]' : '-bottom-[6px]'}`;
  return (
    // `contents`: the cross takes no place in the layout of its part (in the flex row of a bar it pushed the name to the
    // middle); its two lines are placed absolutely
    <span aria-hidden="true" className="hidden xl:contents">
      <span className={`absolute z-[1] h-px w-[11px] bg-[var(--tuwa-border-strong)] ${across}`} />
      <span className={`absolute z-[1] h-[11px] w-px bg-[var(--tuwa-border-strong)] ${down}`} />
    </span>
  );
}

/**
 * The bar that opens a section of the main page, across the whole column between two rules of 1px: its number and its
 * name on the left (`01 / Ecosystem`), what it holds on the right (`8 products · 5 stages`), in mono caps; crosses where
 * the rules meet the frame, from 1280px. On phones the right part goes under the left one. It sticks under the header,
 * on the glass of the header (the paper, a little clear over a light blur), while its section scrolls, and the bar of
 * the next section takes its place.
 *
 * @param props.number - The number of the section, from 1.
 * @param props.name - The name of the section.
 * @param props.meta - The parts of what the section holds, set apart by dots.
 * @returns The bar.
 */
export function SectionBar({ number, name, meta }: { number: number; name: ReactNode; meta: ReactNode[] }) {
  return (
    <div
      className={`sticky top-[56px] z-30 flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-y border-[var(--tuwa-border-primary)] tuwa-docs-glass tuwa-docs-scan py-3 font-mono text-xs uppercase leading-[1.3] tracking-[0.12em] ${homeBleedClassName}`}
    >
      <CrossMark x="left" y="top" />
      <CrossMark x="right" y="top" />
      <p className="m-0 font-medium text-[var(--tuwa-text-primary)]">
        <span className="text-[var(--tuwa-text-secondary)]">{String(number).padStart(2, '0')} /</span> {name}
      </p>
      <p className="m-0 text-[var(--tuwa-text-secondary)]">
        {meta.map((part, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> · </span>}
            {part}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * The head of a section of the main page: its kicker (when it has no {@link SectionBar}), its title in large mono and its
 * lead, in which a package name (such as `@tuwaio/sdk`) is set as code.
 *
 * @param props.id - The id of the title, which names the section (`aria-labelledby`).
 * @param props.kicker - The line above the title, if any.
 * @param props.title - The title.
 * @param props.lead - The lead under the title.
 * @param props.code - A package name to set as code wherever it appears in the lead.
 * @returns The head.
 */
export function SectionHead({
  id,
  kicker,
  title,
  lead,
  code,
}: {
  id: string;
  kicker?: ReactNode;
  title: ReactNode;
  lead: string;
  code?: string;
}) {
  const parts = code ? lead.split(code) : [lead];
  return (
    <>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2
        id={id}
        className={`${kicker ? 'mt-5' : ''} font-mono text-[clamp(30px,4.4vw,52px)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--tuwa-text-primary)]`}
      >
        {title}
      </h2>
      <p className="mt-[18px] max-w-[640px] text-[17px] leading-normal text-[var(--tuwa-text-secondary)]">
        {parts.map((part, index) => (
          <span key={index}>
            {index > 0 && <code className="font-mono text-[0.9em] text-[var(--tuwa-text-primary)]">{code}</code>}
            {part}
          </span>
        ))}
      </p>
    </>
  );
}
