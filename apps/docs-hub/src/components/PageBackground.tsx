import { StarryBackground } from '@tuwaio/docs-ui';

/**
 * The background of the hub pages, in paper and ink: the paper of the theme with Nova's scanlines (a line of 1px every
 * 4px), still and under the content, at every width, and over them, from 768px, the pixel star field of the TUWA
 * documentation (`StarryBackground`), as faint everywhere on the page.
 *
 * @returns The background layer.
 */
export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[var(--tuwa-docs-paper)] tuwa-docs-scan">
      <StarryBackground />
    </div>
  );
}
