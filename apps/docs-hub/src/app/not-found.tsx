import type { Metadata } from 'next';

import { HubShell } from '../components/HubShell';
import { NotFoundContent } from '../components/NotFoundContent';
import { PageBackground } from '../components/PageBackground';

export const metadata: Metadata = {
  // Absolute: inside /guides and /quasar the section layouts would append their title template
  title: { absolute: 'Page Not Found — TUWA Docs Hub' },
  description: 'This page of the TUWA Docs Hub does not exist or has moved.',
};

/**
 * The 404 page of the Docs Hub, for unknown routes and for MDX pages that do not exist: where to go instead (the
 * sections of the hub and the reference sites of the projects) and where to report a broken link. Moved pages are
 * deleted, not redirected, so an old link lands here.
 */
export default function NotFound() {
  return (
    <HubShell>
      <PageBackground />
      <NotFoundContent />
    </HubShell>
  );
}
