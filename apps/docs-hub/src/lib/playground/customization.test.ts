import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  allCustomizations,
  connectLabelOf,
  connectProviderOptions,
  CUSTOMIZATION_SOURCES,
  customizationCode,
  customizationFiles,
  DEFAULT_CUSTOMIZATION,
  type NovaCustomization,
  transactionsProviderOptions,
} from './customization';

const NOVA_FILES = new URL('../../components/playground/nova/', import.meta.url);

const everything: NovaCustomization = {
  style: 'mono',
  language: 'uk',
  connectLabel: 'Launch app',
  historyIcons: true,
  confirmationsBar: true,
  emptyHistory: true,
  withBalance: false,
  withChain: false,
  popularWallet: true,
  legalLinks: true,
  toastPosition: 'top-center',
  autoCloseToasts: true,
  trackingModal: false,
  logButtonClicks: true,
};

describe('Nova customization', () => {
  it('starts as Nova ships', () => {
    expect(connectProviderOptions(DEFAULT_CUSTOMIZATION)).toEqual({ withBalance: true, withChain: true });
    expect(transactionsProviderOptions(DEFAULT_CUSTOMIZATION)).toEqual({});
    expect(connectLabelOf(DEFAULT_CUSTOMIZATION)).toBeUndefined();
  });

  it('maps the behavior settings to provider options', () => {
    expect(connectProviderOptions(everything)).toEqual({
      withBalance: false,
      withChain: false,
      popularConnectors: ['Nebula Wallet'],
      legal: { termsUrl: 'https://example.com/terms', privacyUrl: 'https://example.com/privacy' },
    });
    expect(transactionsProviderOptions(everything)).toEqual({
      position: 'top-center',
      autoClose: 5000,
      features: { trackingTxModal: false },
    });
  });

  it('trims and limits the text of the connect button', () => {
    expect(connectLabelOf({ ...DEFAULT_CUSTOMIZATION, connectLabel: '  Launch  ' })).toBe('Launch');
    expect(connectLabelOf({ ...DEFAULT_CUSTOMIZATION, connectLabel: '   ' })).toBeUndefined();
    expect(connectLabelOf({ ...DEFAULT_CUSTOMIZATION, connectLabel: 'x'.repeat(50) })).toHaveLength(32);
  });

  it('writes plain objects without customization', () => {
    const code = customizationCode(DEFAULT_CUSTOMIZATION);
    expect(code).not.toContain('deepMerge');
    expect(code).not.toContain("from './");
    expect(code).toContain('export const historyCustomization: TransactionsHistoryCustomization<Transaction> = {};');
    expect(code).toContain('export const novaConnectProps = {\n  withBalance: true,\n  withChain: true,\n}');
    expect(code).toContain('export const novaTransactionsProps = {} satisfies');
  });

  it('merges the parts into the style kit', () => {
    const code = customizationCode(everything);
    expect(code).toContain("import { deepMerge } from '@tuwaio/sdk/nova-core';");
    expect(code).toContain(
      "import { monoConnect, monoConnectButton, monoHistory, monoTransactions } from './monoKit';",
    );
    expect(code).toContain(
      'deepMerge(monoHistory, {\n  components: { HistoryItem: TxTypeHistoryItem, Placeholder: EmptyHistory },\n})',
    );
    expect(code).toContain("labels: { ...ukrainianLabels, connectWallet: 'Launch app' },");
    expect(code).toContain('toast: { components: { ConfirmationsBadge: ConfirmationsBar } },');
    expect(code).toContain('onButtonClick: (buttonData, openModal) => {');
    // TransactionsHistory and the history of the connected modal sit outside NovaTransactionsProvider
    expect(code).toContain('// <NovaTransactionsLabelsProvider labels={ukrainianTransactionsLabels}> around the app');
    expect(customizationCode(DEFAULT_CUSTOMIZATION)).not.toContain('NovaTransactionsLabelsProvider');
  });

  it('keeps any text of the connect button a valid string literal', () => {
    expect(customizationCode({ ...DEFAULT_CUSTOMIZATION, connectLabel: "Let's go" })).toContain(
      `labels: { connectWallet: "Let's go" },`,
    );
    expect(customizationCode({ ...DEFAULT_CUSTOMIZATION, connectLabel: `a'b"c\\d` })).toContain(
      `labels: { connectWallet: 'a\\'b"c\\\\d' },`,
    );
  });

  it('lists the theme, the customization and the files it imports', () => {
    const files = customizationFiles({ ...DEFAULT_CUSTOMIZATION, style: 'mono', emptyHistory: true }, ':root {}', {
      'monoKit.ts': '// kit',
    });
    expect(files.map((file) => file.path)).toEqual([
      'src/styles/nova-theme.css',
      'src/nova/customization.tsx',
      'src/nova/monoKit.ts',
      'src/nova/EmptyHistory.tsx',
    ]);
    expect(files[2].code).toBe('// kit');
    expect(files[3]).toEqual(expect.objectContaining({ language: 'tsx', code: expect.stringContaining('is missing') }));
  });

  it('gives every variant of the configurator check its own code', () => {
    const variants = allCustomizations();
    expect(variants).toHaveLength(2048);
    expect(new Set(variants.map(customizationCode)).size).toBe(2048);
  });

  it('ships every copyable file, importing only published packages', () => {
    expect(readdirSync(NOVA_FILES).sort()).toEqual([...CUSTOMIZATION_SOURCES].sort());
    for (const file of CUSTOMIZATION_SOURCES) {
      const code = readFileSync(new URL(file, NOVA_FILES), 'utf8');
      for (const [, specifier] of code.matchAll(/from '([^']+)'/g)) {
        expect(specifier, file).toMatch(/^(@tuwaio\/sdk\/|react$)/);
      }
    }
  });
});
