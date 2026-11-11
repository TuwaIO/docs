/**
 * The background of the hub pages, in paper and ink: the paper of the theme with Nova's scanlines (a line of 1px every
 * 4px), still and under the content, at every width.
 *
 * @returns The background layer.
 */
export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[var(--tuwa-docs-paper)] tuwa-docs-scan" />
  );
}
