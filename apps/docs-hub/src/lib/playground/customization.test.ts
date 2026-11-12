import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  allCustomizations,
  CARD_GAP_CLASSES,
  CARD_GAPS,
  cardGapClassOf,
  cardGapOf,
  connectLabelOf,
  connectProviderOptions,
  CUSTOMIZATION_SOURCES,
  customizationCode,
  customizationFiles,
  DEFAULT_CUSTOMIZATION,
  defaultCustomizationFor,
  KIT_CARD_GAP,
  type NovaCustomization,
  transactionsProviderOptions,
} from './customization';

const NOVA_FILES = new URL('../../components/playground/nova/', import.meta.url);

const everything: NovaCustomization = {
  style: 'mono',
  icons: 'pixel',
  cardGap: null,
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
    expect(code).toContain("import { deepMerge } from '@tuwaio/sdk/nova-core/utils';");
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

  it('generates Chinese labels when language is zh', () => {
    const code = customizationCode({ ...DEFAULT_CUSTOMIZATION, language: 'zh' });
    expect(code).toContain("import { chineseLabels } from '@tuwaio/sdk/nova-connect/i18n';");
    expect(code).toContain(
      "import { chineseLabels as chineseTransactionsLabels } from '@tuwaio/sdk/nova-transactions';",
    );
    expect(code).toContain('labels: chineseLabels');
    expect(code).toContain('labels: chineseTransactionsLabels');
    expect(code).toContain('// <NovaTransactionsLabelsProvider labels={chineseTransactionsLabels}> around the app');
  });

  it('uses the Isometric kit for the iso style', () => {
    const code = customizationCode({ ...DEFAULT_CUSTOMIZATION, style: 'iso' });
    expect(code).toContain("import { isoConnect, isoConnectButton, isoHistory, isoTransactions } from './isoKit';");
    expect(code).toContain('export const connectButtonCustomization: ConnectButtonCustomization = isoConnectButton;');
    expect(code).not.toContain('monoKit');
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
    expect(customizationFiles({ ...DEFAULT_CUSTOMIZATION, style: 'iso' }, ':root {}', {}).map((f) => f.path)).toEqual([
      'src/styles/nova-theme.css',
      'src/nova/customization.tsx',
      'src/nova/isoKit.ts',
    ]);
  });

  // 4608 with the pixel icons, and Heroicons for every style kit and language, with no switch and with every switch on
  it('gives every variant of the configurator check its own code', () => {
    const variants = allCustomizations();
    expect(variants).toHaveLength(4608 + 18 + 24);
    expect(new Set(variants.map(customizationCode)).size).toBe(4608 + 18 + 24);
    expect(variants.filter((variant) => variant.icons === 'classic')).toHaveLength(18);
    expect(variants.filter((variant) => variant.cardGap !== null)).toHaveLength(24);
  });

  // The Isometric kit draws its wallet cards 8 px apart (`mouseGap`), and nothing in the Customize tab said so or let
  // the reader change it: a slider sets the gap between the cards of the connect modal, for every style kit
  it('sets a gap of the reader between the cards of the connect modal, and leaves the gap of the kit alone', () => {
    expect(cardGapOf(DEFAULT_CUSTOMIZATION)).toBe(0);
    expect(cardGapOf({ ...DEFAULT_CUSTOMIZATION, style: 'iso' })).toBe(8);
    expect(cardGapOf({ ...DEFAULT_CUSTOMIZATION, style: 'iso', cardGap: 16 })).toBe(16);
    // The gap of the kit is in the kit: the code adds nothing for it
    expect(cardGapClassOf({ ...DEFAULT_CUSTOMIZATION, style: 'iso', cardGap: 8 })).toBeNull();
    expect(cardGapClassOf({ ...DEFAULT_CUSTOMIZATION, cardGap: 0 })).toBeNull();
    expect(customizationCode({ ...DEFAULT_CUSTOMIZATION, style: 'iso', cardGap: 8 })).toBe(
      customizationCode({ ...DEFAULT_CUSTOMIZATION, style: 'iso' }),
    );

    const code = customizationCode({ ...DEFAULT_CUSTOMIZATION, style: 'iso', cardGap: 16 });
    expect(code).toContain("installed: { config: { layout: { mouseGap: 'gap-4' } } },");
    expect(code).toContain("popular: { config: { layout: { mouseGap: 'gap-4' } } },");
    expect(code).toContain("networkSelections: { config: { scroll: { gap: { mouse: 'gap-4' } } } },");
    expect(code).toContain('customization: deepMerge(isoConnect, {');
    // Without a gap the cards share their lines of 1 px, as Nova draws them
    expect(customizationCode({ ...DEFAULT_CUSTOMIZATION, style: 'mono', cardGap: 0 })).toContain(
      "mouseGap: 'gap-0 [&>*+*]:-mt-px'",
    );
    // Next to the history of the connected modal the two share one `modals`
    const both = customizationCode({ ...DEFAULT_CUSTOMIZATION, cardGap: 12, historyIcons: true });
    expect(both.match(/\bmodals: \{/g)).toHaveLength(1);
    expect(both).toMatch(/modals: \{\n\s+connectedModal: \{[^\n]+\},\n\s+connectModal: \{/);
  });

  it('offers the gaps of the slider in steps of 4 px, each with a class Tailwind CSS can generate', () => {
    expect(CARD_GAPS).toEqual([0, 4, 8, 12, 16]);
    expect(Object.keys(CARD_GAP_CLASSES).map(Number)).toEqual([...CARD_GAPS]);
    for (const className of Object.values(CARD_GAP_CLASSES))
      expect(className).toMatch(/^gap-\d( \[&>\*\+\*\]:-mt-px)?$/);
    for (const kit of Object.values(KIT_CARD_GAP)) expect(CARD_GAPS).toContain(kit);
  });

  // Nova draws its own pixel icons unless a provider is given another set: Heroicons come from a separate entry of
  // the SDK, so only an app that picks them loads them
  it('gives Heroicons to both providers when they are picked, and nothing for the pixel icons', () => {
    const pixel = customizationCode(DEFAULT_CUSTOMIZATION);
    expect(pixel).not.toContain('heroicons');
    const classic = customizationCode({ ...DEFAULT_CUSTOMIZATION, icons: 'classic' });
    expect(classic).toContain("import { heroicons } from '@tuwaio/sdk/nova-core/heroicons';");
    expect(classic.match(/^ {2}icons: heroicons,$/gm)).toHaveLength(2);
    expect(classic).toContain('@heroicons/react (2.x), an optional peer dependency of the SDK');
    // The props of the two providers, each with the set
    const [, connect = '', transactions = ''] = classic.split(/export const nova(?:Connect|Transactions)Props = /);
    expect(connect).toContain('icons: heroicons');
    expect(transactions).toContain('icons: heroicons');
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

describe('defaultCustomizationFor', () => {
  // A reset went to DEFAULT_CUSTOMIZATION, in English: on a Ukrainian page Nova then said "Connect Wallet" and "Failed" next to
  // the page's own Ukrainian titles
  it('keeps Nova in the language of the site', () => {
    expect(defaultCustomizationFor('en')).toEqual(DEFAULT_CUSTOMIZATION);
    expect(defaultCustomizationFor('uk')).toEqual({ ...DEFAULT_CUSTOMIZATION, language: 'uk' });
    expect(defaultCustomizationFor('zh-CN')).toEqual({ ...DEFAULT_CUSTOMIZATION, language: 'zh' });
  });
});
