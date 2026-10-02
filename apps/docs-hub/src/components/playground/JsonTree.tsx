'use client';

import { shortenDataUri } from '@/lib/playground/encoding';

function Value({ value }: { value: unknown }) {
  if (typeof value === 'string')
    return <span className="text-emerald-700 dark:text-emerald-400">&quot;{shortenDataUri(value)}&quot;</span>;
  if (typeof value === 'number' || typeof value === 'bigint') {
    return <span className="text-amber-700 dark:text-amber-400">{String(value)}</span>;
  }
  if (typeof value === 'boolean' || value === null) {
    return <span className="text-violet-700 dark:text-violet-400">{String(value)}</span>;
  }
  if (typeof value === 'function') return <span className="italic text-sky-700 dark:text-sky-400">ƒ()</span>;
  return <span className="text-[var(--tuwa-text-tertiary)]">undefined</span>;
}

function Key({ name }: { name?: string }) {
  return name === undefined ? null : <span className="text-[var(--tuwa-text-secondary)]">{name}: </span>;
}

/**
 * A collapsible view of a value: objects and arrays fold (the first two levels start open), functions show as `ƒ()`
 * and long `data:` URIs as their media type and length.
 * It uses `<details>`, so a re-render keeps what the user opened.
 * @param props.value - The value.
 * @param props.name - Its key in the parent.
 * @param props.depth - The nesting level.
 */
export function JsonTree({ value, name, depth = 0 }: { value: unknown; name?: string; depth?: number }) {
  if (typeof value !== 'object' || value === null) {
    return (
      <div className="pl-4 [overflow-wrap:anywhere]">
        <Key name={name} />
        <Value value={value} />
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  return (
    <details open={depth < 2} className="pl-4">
      <summary className="-ml-4 cursor-pointer select-none [overflow-wrap:anywhere]">
        <Key name={name} />
        <span className="text-[var(--tuwa-text-tertiary)]">
          {Array.isArray(value) ? `Array(${entries.length})` : `{${entries.length}}`}
        </span>
      </summary>
      {entries.map(([key, child]) => (
        <JsonTree key={key} name={key} value={child} depth={depth + 1} />
      ))}
    </details>
  );
}
