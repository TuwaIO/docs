import type { Metadata } from 'next';

import { SectionLayout } from '@/lib/nextraSection';

export const metadata: Metadata = {
  title: {
    default: 'Quasar',
    template: '%s – Quasar',
  },
  description:
    'Quasar, the TUWA backend that tracks the transactions of your app on the server, keeps their history and sends webhooks: Quasar Cloud and the self-hosted Community Edition.',
};

export default SectionLayout;
