import type { Metadata } from 'next';

import { HubShell } from '../components/HubShell';
import { NotFoundContent } from '../components/NotFoundContent';
import { PageBackground } from '../components/PageBackground';
import { RootDocument } from './rootDocument';

export const metadata: Metadata = {
  title: 'Page Not Found — TUWA Docs Hub',
  description: 'This page of the TUWA Docs Hub does not exist or has moved.',
};

/**
 * The 404 of a URL outside the two root layouts of the site, such as `/de/quasar`.
 *
 * @returns The page.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <PageBackground />
      <HubShell framed>
        <NotFoundContent />
      </HubShell>
    </RootDocument>
  );
}
