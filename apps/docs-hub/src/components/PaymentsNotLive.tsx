import { Callout } from 'nextra/components';

/**
 * Says that Quasar Payments is documented ahead of its launch: these pages are public to be read and indexed, and must not read
 * as a product a reader can use. Remove it, and its uses, when Payments reach production.
 *
 * @returns The notice.
 */
export function PaymentsNotLive() {
  return (
    <Callout type="warning">
      <strong>Docs only, not live in production.</strong> Quasar Payments is still being built: what these pages
      describe is not available yet and may change.
    </Callout>
  );
}
