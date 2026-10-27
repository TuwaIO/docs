import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { extractMdxCodeBlocks } from './mdxCodeBlocks';

const SRC_DIR = path.resolve(__dirname, '..');

const PAGE_PAIRS: Array<{ mdx: string; component: string }> = [
  {
    mdx: 'content/guides/why-web3-transaction-state-is-broken.mdx',
    component: 'components/localized/guides/WhyWeb3StateBrokenLocalized.tsx',
  },
  {
    mdx: 'content/guides/erc-4337-sovereign-account-abstraction.mdx',
    component: 'components/localized/guides/Erc4337Localized.tsx',
  },
  {
    mdx: 'content/guides/multi-chain-auth-siwx-caip122.mdx',
    component: 'components/localized/guides/MultiChainAuthLocalized.tsx',
  },
  {
    mdx: 'content/guides/full-stack-react.mdx',
    component: 'components/localized/guides/FullStackReactLocalized.tsx',
  },
  {
    mdx: 'content/guides/quasar-transaction-sync.mdx',
    component: 'components/localized/guides/QuasarTxSyncLocalized.tsx',
  },
  {
    mdx: 'content/guides/react-transaction-tracking.mdx',
    component: 'components/localized/guides/ReactTxTrackingLocalized.tsx',
  },
  {
    mdx: 'content/guides/siwx-jwt-external-auth.mdx',
    component: 'components/localized/guides/SiwxJwtLocalized.tsx',
  },
  {
    mdx: 'content/guides/siwx-supabase.mdx',
    component: 'components/localized/guides/SiwxSupabaseLocalized.tsx',
  },
  {
    mdx: 'content/guides/starter-templates.mdx',
    component: 'components/localized/guides/StarterTemplatesLocalized.tsx',
  },
  {
    mdx: 'content/quasar/index.mdx',
    component: 'components/NextraLocalizedShell.tsx',
  },
  {
    mdx: 'content/quasar/apps-and-keys.mdx',
    component: 'components/localized/quasar/AppsKeysLocalized.tsx',
  },
  {
    mdx: 'content/quasar/self-hosting.mdx',
    component: 'components/localized/quasar/SelfHostingLocalized.tsx',
  },
  {
    mdx: 'content/quasar/webhooks.mdx',
    component: 'components/localized/quasar/WebhooksLocalized.tsx',
  },
];

describe('extractMdxCodeBlocks & localized guide code snippet parity', () => {
  it.each(PAGE_PAIRS)(
    'reuses every canonical MDX code block by index without hardcoded duplication ($mdx)',
    ({ mdx, component }) => {
      const mdxSource = fs.readFileSync(path.join(SRC_DIR, mdx), 'utf8');
      const componentSource = fs.readFileSync(path.join(SRC_DIR, component), 'utf8');

      const blocks = extractMdxCodeBlocks(mdxSource);
      expect(blocks.length).toBeGreaterThan(0);

      // Ensure no inline hardcoded `code=` props exist in the localized component
      expect(componentSource).not.toMatch(/<CodeSnippet[^>]*\bcode=/);

      // Extract all `<CodeSnippet index={N} />` references
      const indexMatches = [...componentSource.matchAll(/<CodeSnippet\s+index=\{(\d+)\}\s*\/>/g)].map((m) =>
        Number(m[1]),
      );
      const uniqueIndices = [...new Set(indexMatches)].sort((a, b) => a - b);

      // Every MDX code block (0 .. blocks.length - 1) must be referenced in both uk and zh
      const expectedIndices = Array.from({ length: blocks.length }, (_, i) => i);
      expect(uniqueIndices).toEqual(expectedIndices);

      // Each index must appear in the localized component (twice for separate uk/zh trees, once for shared tree)
      const minOccurrences = component.endsWith('NextraLocalizedShell.tsx') ? 1 : 2;
      for (const idx of expectedIndices) {
        const count = indexMatches.filter((x) => x === idx).length;
        expect(count).toBeGreaterThanOrEqual(minOccurrences);
        expect(blocks[idx]?.code.trim().length).toBeGreaterThan(0);
      }
    },
  );
});
