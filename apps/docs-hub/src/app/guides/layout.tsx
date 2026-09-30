import type { Metadata } from 'next';

import { SectionLayout } from '@/lib/nextraSection';

export const metadata: Metadata = {
  title: {
    default: 'TUWA Guides & Tutorials',
    template: '%s – TUWA Guides',
  },
  description:
    'Comprehensive developer guides, integration blueprints, and architectural tutorials for the TUWA Web3 ecosystem.',
};

export default SectionLayout;
