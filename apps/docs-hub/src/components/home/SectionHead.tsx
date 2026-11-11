import type { ReactNode } from 'react';

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
 * The head of a section of the main page: its kicker, its title in large sans and its lead, in which a package name
 * (such as `@tuwaio/sdk`) is set as code.
 *
 * @param props.id - The id of the title, which names the section (`aria-labelledby`).
 * @param props.kicker - The line above the title.
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
  kicker: ReactNode;
  title: ReactNode;
  lead: string;
  code?: string;
}) {
  const parts = code ? lead.split(code) : [lead];
  return (
    <>
      <Kicker>{kicker}</Kicker>
      <h2
        id={id}
        className="mt-5 font-sans text-[clamp(36px,5.2vw,60px)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--tuwa-text-primary)]"
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
