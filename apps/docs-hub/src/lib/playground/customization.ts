// The Nova UI Kit customization of the Playground beyond the theme variables, and its code for a real app. The stage
// builds the same objects in `useNovaCustomization`. No runtime imports: the configurator check runs this file in Node.
import type { GeneratedFile } from '../configurator/generate';

/** A set of class names for every part of Nova UI Kit (`customization.classNames` of the components). */
export type StyleKit = 'nova' | 'mono';

/** The language of the Nova texts (`labels`). */
export type NovaLanguage = 'en' | 'uk';

/** Where the transaction toasts appear (the `position` of `NovaTransactionsProvider`). */
export const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

/** A position of the transaction toasts. */
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

/** The customization of Nova UI Kit on the stage. Every field maps to a prop of a Nova provider or component. */
export interface NovaCustomization {
  /** Class names of every part (`customization.classNames`). */
  style: StyleKit;
  /** Texts (`labels`): English, or Ukrainian. */
  language: NovaLanguage;
  /** Text of the connect button (`labels.connectWallet`); empty keeps the text of the language. */
  connectLabel: string;
  /** History items with an icon for each transaction type (`components.HistoryItem` of the history). */
  historyIcons: boolean;
  /** Confirmations as a bar in the toast (`components.ConfirmationsBadge` of the toast). */
  confirmationsBar: boolean;
  /** An illustrated empty history (`components.Placeholder` of the history). */
  emptyHistory: boolean;
  /** Balance in the connect button (`withBalance`). */
  withBalance: boolean;
  /** Network selector next to the connect button (`withChain`). */
  withChain: boolean;
  /** A "Popular" wallet group in the connect modal (`popularConnectors`). */
  popularWallet: boolean;
  /** Terms and privacy links in the connect modal (`legal`). */
  legalLinks: boolean;
  /** Where the transaction toasts appear (`position`). */
  toastPosition: ToastPosition;
  /** Close the transaction toasts after 5 seconds (`autoClose`). */
  autoCloseToasts: boolean;
  /** The tracking modal that opens on submission (`features.trackingTxModal`). */
  trackingModal: boolean;
  /** Logs the clicks on the connect button (`customization.handlers.onButtonClick`). */
  logButtonClicks: boolean;
}

/** Nova as it ships: its class names, English texts and default options. */
export const DEFAULT_CUSTOMIZATION: NovaCustomization = {
  style: 'nova',
  language: 'en',
  connectLabel: '',
  historyIcons: false,
  confirmationsBar: false,
  emptyHistory: false,
  withBalance: true,
  withChain: true,
  popularWallet: false,
  legalLinks: false,
  toastPosition: 'bottom-right',
  autoCloseToasts: false,
  trackingModal: true,
  logButtonClicks: false,
};

/** The style kits of the Customize tab. */
export const STYLE_KITS: Record<StyleKit, { label: string; description: string }> = {
  nova: { label: 'Nova', description: 'The class names Nova UI Kit ships with.' },
  mono: { label: 'TUWA Mono', description: 'Monospace type, outlined surfaces and accent rings on every part.' },
};

/** The wallets of the "Popular" group: a simulated wallet here, the names of your wallets in an app. */
export const POPULAR_WALLETS = ['Nebula Wallet'];

/** The legal links of the connect modal. `example.com` stands for the pages of your app. */
export const LEGAL_LINKS = { termsUrl: 'https://example.com/terms', privacyUrl: 'https://example.com/privacy' };

/** The longest text of the connect button the Customize tab accepts. */
export const CONNECT_LABEL_MAX_LENGTH = 32;

/** The options of `NovaConnectProvider` set by the customization (without `labels` and `customization`). */
export function connectProviderOptions(customization: NovaCustomization) {
  return {
    withBalance: customization.withBalance,
    withChain: customization.withChain,
    ...(customization.popularWallet && { popularConnectors: POPULAR_WALLETS }),
    ...(customization.legalLinks && { legal: LEGAL_LINKS }),
  };
}

/** The options of `NovaTransactionsProvider` set by the customization (without `labels` and `customization`). */
export function transactionsProviderOptions(customization: NovaCustomization) {
  return {
    ...(customization.toastPosition !== 'bottom-right' && { position: customization.toastPosition }),
    ...(customization.autoCloseToasts && { autoClose: 5000 }),
    ...(!customization.trackingModal && { features: { trackingTxModal: false } }),
  };
}

/** The text of the connect button, trimmed, or `undefined` to keep the text of the language. */
export function connectLabelOf(customization: NovaCustomization): string | undefined {
  return customization.connectLabel.trim().slice(0, CONNECT_LABEL_MAX_LENGTH) || undefined;
}

// The switches that change `customization.tsx`, for `allCustomizations`
const CODE_FLAGS = [
  'historyIcons',
  'confirmationsBar',
  'emptyHistory',
  'popularWallet',
  'legalLinks',
  'autoCloseToasts',
  'logButtonClicks',
] as const;

/**
 * Every customization that gives a different `customization.tsx`: both style kits and languages, with and without a
 * text of the connect button, every combination of the switches, with the default and with changed options. The
 * configurator check compiles the code of each one (2048 variants).
 */
export function allCustomizations(): NovaCustomization[] {
  return (['nova', 'mono'] as const).flatMap((style) =>
    (['en', 'uk'] as const).flatMap((language) =>
      ['', "Let's go"].flatMap((connectLabel) =>
        [false, true].flatMap((changedOptions) =>
          Array.from({ length: 1 << CODE_FLAGS.length }, (_, mask): NovaCustomization => ({
            ...DEFAULT_CUSTOMIZATION,
            style,
            language,
            connectLabel,
            ...(changedOptions && {
              withBalance: false,
              withChain: false,
              trackingModal: false,
              toastPosition: 'top-center',
            }),
            ...Object.fromEntries(CODE_FLAGS.map((flag, index) => [flag, (mask & (1 << index)) !== 0])),
          })),
        ),
      ),
    ),
  );
}

/** The copyable files of the customization, in `src/components/playground/nova/` of the hub. */
export const CUSTOMIZATION_SOURCES = [
  'monoKit.ts',
  'ukrainianTransactionsLabels.ts',
  'TxTypeHistoryItem.tsx',
  'ConfirmationsBar.tsx',
  'EmptyHistory.tsx',
] as const;

/** A copyable file of the customization. */
export type CustomizationSource = (typeof CUSTOMIZATION_SOURCES)[number];

// A string literal as Prettier writes it: single quotes, unless the text has more of them than double quotes
function quote(value: string): string {
  const singles = value.split("'").length - 1;
  const doubles = value.split('"').length - 1;
  if (singles > doubles) return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

// `kit` with `extra` merged into it, as an expression
function merged(kit: string | null, extra: string | null): string {
  if (kit && extra) return `deepMerge(${kit}, ${extra})`;
  return kit ?? extra ?? '{}';
}

// An object literal with one entry per line, as Prettier keeps it, or `null` without entries
function objectOf(entries: (string | false | null | undefined)[]): string | null {
  const kept = entries.filter((entry): entry is string => Boolean(entry));
  if (kept.length === 0) return null;
  return ['{', ...kept.map((entry) => `  ${entry.replace(/\n/g, '\n  ')},`), '}'].join('\n');
}

/** The code of `customization.tsx`: the four objects the app passes to Nova, built as on the stage. */
export function customizationCode(customization: NovaCustomization): string {
  const mono = customization.style === 'mono';
  const uk = customization.language === 'uk';
  const label = connectLabelOf(customization);
  const { historyIcons, confirmationsBar, emptyHistory, logButtonClicks, toastPosition } = customization;

  const historyExtra = objectOf([
    (historyIcons || emptyHistory) &&
      `components: { ${[historyIcons && 'HistoryItem: TxTypeHistoryItem', emptyHistory && 'Placeholder: EmptyHistory']
        .filter(Boolean)
        .join(', ')} }`,
  ]);
  const hasHistory = mono || historyExtra !== null;
  const history = merged(mono ? 'monoHistory' : null, historyExtra);

  const buttonExtra = objectOf([
    logButtonClicks &&
      [
        'handlers: {',
        '  onButtonClick: (buttonData, openModal) => {',
        "    console.info('Connect button clicked', { connected: buttonData.isConnected });",
        '    openModal();',
        '  },',
        '}',
      ].join('\n'),
  ]);
  const button = merged(mono ? 'monoConnectButton' : null, buttonExtra);

  const connectExtra = objectOf([
    hasHistory &&
      'modals: { connectedModal: { childCustomizations: { txHistory: { transactionsHistory: historyCustomization } } } }',
  ]);
  const connect = mono || connectExtra ? merged(mono ? 'monoConnect' : null, connectExtra) : null;

  const transactionsExtra = objectOf([
    confirmationsBar && 'toast: { components: { ConfirmationsBadge: ConfirmationsBar } }',
    hasHistory && 'transactionsInfoModal: { historyCustomization }',
  ]);
  const transactions = mono || transactionsExtra ? merged(mono ? 'monoTransactions' : null, transactionsExtra) : null;

  const connectLabels =
    uk && label
      ? `{ ...ukrainianLabels, connectWallet: ${quote(label)} }`
      : uk
        ? 'ukrainianLabels'
        : label && `{ connectWallet: ${quote(label)} }`;
  const usesDeepMerge = [history, button, connect, transactions].some((code) => code?.startsWith('deepMerge('));

  const imports = [
    "import type { NovaConnectProviderPropsWithCustomization } from '@tuwaio/sdk/nova-connect';",
    "import type { ConnectButtonCustomization } from '@tuwaio/sdk/nova-connect/components';",
    uk && "import { ukrainianLabels } from '@tuwaio/sdk/nova-connect/i18n';",
    usesDeepMerge && "import { deepMerge } from '@tuwaio/sdk/nova-core';",
    "import type { TransactionsHistoryCustomization } from '@tuwaio/sdk/nova-transactions';",
    "import type { NovaTransactionsProviderProps } from '@tuwaio/sdk/nova-transactions/providers';",
    "import type { Transaction } from '@tuwaio/sdk/pulsar';",
  ].filter(Boolean);
  const localImports = [
    confirmationsBar && "import { ConfirmationsBar } from './ConfirmationsBar';",
    emptyHistory && "import { EmptyHistory } from './EmptyHistory';",
    mono && "import { monoConnect, monoConnectButton, monoHistory, monoTransactions } from './monoKit';",
    historyIcons && "import { TxTypeHistoryItem } from './TxTypeHistoryItem';",
    uk && "import { ukrainianTransactionsLabels } from './ukrainianTransactionsLabels';",
  ].filter(Boolean);

  const connectProps = objectOf([
    `withBalance: ${customization.withBalance}`,
    `withChain: ${customization.withChain}`,
    customization.popularWallet && `popularConnectors: [${POPULAR_WALLETS.map(quote).join(', ')}]`,
    customization.legalLinks &&
      `legal: { termsUrl: ${quote(LEGAL_LINKS.termsUrl)}, privacyUrl: ${quote(LEGAL_LINKS.privacyUrl)} }`,
    connectLabels && `labels: ${connectLabels}`,
    connect && `customization: ${connect}`,
  ]);
  const transactionsProps = objectOf([
    toastPosition !== 'bottom-right' && `position: ${quote(toastPosition)}`,
    customization.autoCloseToasts && 'autoClose: 5000',
    !customization.trackingModal && 'features: { trackingTxModal: false }',
    uk && 'labels: ukrainianTransactionsLabels',
    transactions && `customization: ${transactions}`,
  ]);

  return [
    '// Nova UI Kit customization from the TUWA Playground (https://docs.tuwa.io/playground). Pass the objects to Nova:',
    '// <NovaConnectProvider {...novaConnectProps} appChains={appChains}>',
    '// <NovaTransactionsProvider {...novaTransactionsProps} {...pulsarStoreProps} />',
    '// <ConnectButton customization={connectButtonCustomization} />',
    '// <TransactionsHistory customization={historyCustomization} {...historyProps} />',
    ...(uk
      ? [
          '// <NovaTransactionsLabelsProvider labels={ukrainianTransactionsLabels}> around the app, for TransactionsHistory',
        ]
      : []),
    ...imports,
    ...(localImports.length > 0 ? ['', ...localImports] : []),
    '',
    `export const historyCustomization: TransactionsHistoryCustomization<Transaction> = ${history};`,
    '',
    `export const connectButtonCustomization: ConnectButtonCustomization = ${button};`,
    '',
    `export const novaConnectProps = ${connectProps ?? '{}'} satisfies Partial<NovaConnectProviderPropsWithCustomization>;`,
    '',
    `export const novaTransactionsProps = ${transactionsProps ?? '{}'} satisfies Partial<NovaTransactionsProviderProps<Transaction>>;`,
    '',
  ].join('\n');
}

/** The copyable files the customization uses, in the order of the Code tab. */
export function customizationSourcesOf(customization: NovaCustomization): CustomizationSource[] {
  return CUSTOMIZATION_SOURCES.filter(
    (file) =>
      (file === 'monoKit.ts' && customization.style === 'mono') ||
      (file === 'ukrainianTransactionsLabels.ts' && customization.language === 'uk') ||
      (file === 'TxTypeHistoryItem.tsx' && customization.historyIcons) ||
      (file === 'ConfirmationsBar.tsx' && customization.confirmationsBar) ||
      (file === 'EmptyHistory.tsx' && customization.emptyHistory),
  );
}

/**
 * The files of the customization for the Code tab: the theme CSS, `customization.tsx` and the copyable files it
 * imports.
 * @param customization - The customization.
 * @param themeCss - The CSS of the theme (`themeCss` of `themes.ts`).
 * @param sources - The code of the copyable files by file name (`src/generated/playground-sources.json`).
 * @returns The files, with paths of an app.
 */
export function customizationFiles(
  customization: NovaCustomization,
  themeCss: string,
  sources: Partial<Record<CustomizationSource, string>>,
): GeneratedFile[] {
  return [
    { path: 'src/styles/nova-theme.css', language: 'css', code: themeCss },
    { path: 'src/nova/customization.tsx', language: 'tsx', code: customizationCode(customization) },
    ...customizationSourcesOf(customization).map((file): GeneratedFile => ({
      path: `src/nova/${file}`,
      language: file.endsWith('.tsx') ? 'tsx' : 'ts',
      code: sources[file] ?? `// ${file} is missing: run \`node scripts/build-data.mjs\` in apps/docs-hub.\n`,
    })),
  ];
}
