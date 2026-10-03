// The Stack Configurator: the setup files, install command and starter template of a TUWA app for the options a
// developer picks. Pure functions without runtime imports, so `tools/configurator-check` runs this file with Node's
// type stripping and type-checks every stack against the published packages. Keep the TypeScript erasable (no enums,
// namespaces or parameter properties) and keep the generated code in line with TUWA_AGENTS.md.

/** The framework of the app */
export type Framework = 'next' | 'vite' | 'vanilla';

/** Nova UI Kit components, or your own UI on the headless stores */
export type UiKit = 'nova' | 'headless';

export interface StackOptions {
  framework: Framework;
  evm: boolean;
  solana: boolean;
  ui: UiKit;
  /** Sign-in with the wallet (SIWX, CAIP-122) and server sessions */
  siwx: boolean;
  /** Transaction sync, history and webhooks through Quasar; needs `siwx` */
  quasar: boolean;
}

export type FileLanguage = 'ts' | 'tsx' | 'css' | 'dotenv';

export interface GeneratedFile {
  path: string;
  language: FileLanguage;
  code: string;
}

export interface StackTemplate {
  /** Folder of the template in TuwaIO/cosmos-playground, or `null` when no template is close */
  name: string | null;
  /** How the template relates to the picked stack */
  note: string;
}

export interface GeneratedStack {
  options: StackOptions;
  /** Packages to install, required peers included */
  packages: string[];
  devPackages: string[];
  files: GeneratedFile[];
  template: StackTemplate;
  guides: { title: string; href: string }[];
  /** Commands to run after the install, for example the API server */
  commands: { label: string; command: string }[];
}

export const DEFAULT_STACK_OPTIONS: StackOptions = {
  framework: 'next',
  evm: true,
  solana: false,
  ui: 'nova',
  siwx: false,
  quasar: false,
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  next: 'Next.js (App Router)',
  vite: 'Vite + React',
  vanilla: 'Vanilla TypeScript',
};

/**
 * Applies the rules between options: at least one chain family, no Nova without React, and Quasar sync only for a
 * signed-in wallet.
 */
export function normalizeStackOptions(options: StackOptions): StackOptions {
  return {
    framework: options.framework,
    evm: options.evm || !options.solana,
    solana: options.solana,
    ui: options.framework === 'vanilla' ? 'headless' : options.ui,
    siwx: options.siwx || options.quasar,
    quasar: options.quasar,
  };
}

/** A short unique id of a stack, for example `next-evm-solana-nova-siwx-quasar` */
export function stackKey(options: StackOptions): string {
  const o = normalizeStackOptions(options);
  return [o.framework, o.evm && 'evm', o.solana && 'solana', o.ui, o.siwx && 'siwx', o.quasar && 'quasar']
    .filter(Boolean)
    .join('-');
}

/** Every distinct stack the configurator can generate */
export function allStackOptions(): StackOptions[] {
  const stacks = new Map<string, StackOptions>();
  for (const framework of ['next', 'vite', 'vanilla'] as const) {
    for (const [evm, solana] of [
      [true, false],
      [false, true],
      [true, true],
    ] as const) {
      for (const ui of ['nova', 'headless'] as const) {
        for (const siwx of [false, true]) {
          for (const quasar of [false, true]) {
            const options = normalizeStackOptions({ framework, evm, solana, ui, siwx, quasar });
            stacks.set(stackKey(options), options);
          }
        }
      }
    }
  }
  return [...stacks.values()];
}

type QueryInput = URLSearchParams | Record<string, string | string[] | undefined>;

const readParam = (query: QueryInput, name: string): string | undefined => {
  const value = query instanceof URLSearchParams ? query.get(name) : query[name];
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
};

/** Reads the options from the query string of `/configurator` (`?fw=vite&chains=evm,solana&ui=headless&auth=siwx`) */
export function parseStackOptions(query: QueryInput): StackOptions {
  const fw = readParam(query, 'fw');
  const chains = readParam(query, 'chains')?.split(',');
  return normalizeStackOptions({
    framework: fw === 'vite' || fw === 'vanilla' ? fw : 'next',
    evm: chains ? chains.includes('evm') : DEFAULT_STACK_OPTIONS.evm,
    solana: chains ? chains.includes('solana') : DEFAULT_STACK_OPTIONS.solana,
    ui: readParam(query, 'ui') === 'headless' ? 'headless' : 'nova',
    siwx: readParam(query, 'auth') === 'siwx',
    quasar: readParam(query, 'quasar') === '1',
  });
}

/** The query string of the options, the inverse of {@link parseStackOptions} */
export function stackQuery(options: StackOptions): string {
  const o = normalizeStackOptions(options);
  const params = new URLSearchParams();
  params.set('fw', o.framework);
  params.set('chains', [o.evm && 'evm', o.solana && 'solana'].filter(Boolean).join(','));
  params.set('ui', o.ui);
  if (o.siwx) params.set('auth', 'siwx');
  if (o.quasar) params.set('quasar', '1');
  return params.toString();
}

// ---------------------------------------------------------------------------------------------------------------------
// Helpers

/** Joins the lines that are not `false`, `null` or `undefined` */
const lines = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter((part): part is string => typeof part === 'string').join('\n');

/**
 * A named import, `import { a, b } from 'x';`, or nothing when no name is needed. Longer than 120 characters, it puts
 * one name per line, as Prettier does.
 */
function named(names: (string | false | null | undefined)[], from: string, typeOnly = false): string | false {
  const list = names.filter((name): name is string => typeof name === 'string');
  if (list.length === 0) return false;
  const keyword = `import ${typeOnly ? 'type ' : ''}`;
  const single = `${keyword}{ ${list.join(', ')} } from '${from}';`;
  return single.length <= 120
    ? single
    : `${keyword}{\n${list.map((name) => `  ${name},`).join('\n')}\n} from '${from}';`;
}

/** The path of the module `to` (from `src/` or `server/`, without extension) as imported from the file `from` */
function modulePath(o: StackOptions, from: string, to: string): string {
  if (o.framework === 'next' && to.startsWith('src/')) return `@/${to.slice(4)}`;
  const fromDir = from.split('/').slice(0, -1);
  const target = to.split('/');
  let common = 0;
  while (common < fromDir.length && common < target.length - 1 && fromDir[common] === target[common]) common++;
  const up = fromDir.length - common;
  const rest = target.slice(common).join('/');
  return up === 0 ? `./${rest}` : `${'../'.repeat(up)}${rest}`;
}

/** Where each TUWA project is imported from: the SDK for React apps, the packages one by one for Vanilla */
function sources(o: StackOptions) {
  const sdk = o.framework !== 'vanilla';
  return {
    pulsar: sdk ? '@tuwaio/sdk/pulsar' : '@tuwaio/pulsar-core',
    orbit: sdk ? '@tuwaio/sdk/orbit' : '@tuwaio/orbit-core',
    evmSatellite: sdk ? '@tuwaio/evm-sdk/satellite' : '@tuwaio/satellite-evm',
    evmPulsar: sdk ? '@tuwaio/evm-sdk/pulsar' : '@tuwaio/pulsar-evm',
    evmSiwx: sdk ? '@tuwaio/evm-sdk/siwx' : '@tuwaio/siwx-evm',
    solanaSatellite: sdk ? '@tuwaio/solana-sdk/satellite' : '@tuwaio/satellite-solana',
    solanaPulsar: sdk ? '@tuwaio/solana-sdk/pulsar' : '@tuwaio/pulsar-solana',
    siwxServer: sdk ? '@tuwaio/sdk/siwx/server' : '@tuwaio/siwx-server',
    siwxHandler: sdk ? '@tuwaio/sdk/siwx/server-next' : '@tuwaio/siwx-server/next',
  };
}

/** An environment variable read in the browser */
const clientEnv = (o: StackOptions, name: string) =>
  o.framework === 'next' ? `process.env.NEXT_PUBLIC_${name}` : `import.meta.env.VITE_${name}`;

const isReact = (o: StackOptions) => o.framework !== 'vanilla';

/** The `'use client'` line of client modules in Next.js */
const clientDirective = (o: StackOptions) => o.framework === 'next' && "'use client';\n";

const PATHS = {
  appConfig: 'src/configs/appConfig',
  transactions: 'src/transactions',
  pulsarStore: 'src/hooks/pulsarStore',
  vanillaPulsarStore: 'src/stores/pulsarStore',
  vanillaSatellite: 'src/stores/satellite',
  vanillaAuth: 'src/auth/siwx',
  providers: 'src/providers/Providers',
  historyLoader: 'src/providers/HistoryLoader',
  quasarActions: 'src/app/quasarActions',
  quasarApi: 'src/api/quasar',
  authStores: 'src/lib/authStores',
  connectWallets: 'src/components/ConnectWallets',
  signInButton: 'src/components/SignInButton',
  incrementButton: 'src/components/IncrementButton',
  solanaTxButton: 'src/components/SolanaTxButton',
  actions: 'src/actions',
} as const;

/** Indents every non-empty line of `text` by `prefix` */
const indent = (text: string, prefix: string): string =>
  text
    .split('\n')
    .map((line) => (line ? prefix + line : line))
    .join('\n');

// The nonce and verify requests of SIWX, as properties of an object literal
const SIWX_FETCHERS = `getNonce: async () => {
  const res = await fetch('/api/siwx/nonce');
  return ((await res.json()) as { nonce: string }).nonce;
},
verifier: async (payload) => {
  const res = await fetch('/api/siwx/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok ? res.json() : null;
},`;

const COUNTER = `const COUNTER_ADDRESS = '0xAe7f46914De82028eCB7E2bF97Feb3D3dDCc2BAB'; // a counter contract on Sepolia
const counterAbi = [
  { type: 'function', name: 'increment', inputs: [], outputs: [], stateMutability: 'nonpayable' },
] as const;`;

// ---------------------------------------------------------------------------------------------------------------------
// Files shared by every framework

function appConfigFile(o: StackOptions): GeneratedFile {
  const s = sources(o);
  const hydratedBy =
    o.framework === 'vanilla' ? 'initializeSatellite in src/stores/satellite.ts' : 'EVMConnectorsWatcher';
  return {
    path: `${PATHS.appConfig}.ts`,
    language: 'ts',
    code: lines(
      o.evm && named(['createDefaultTransports'], s.evmSatellite),
      o.evm && named(['createConfig', 'injected'], '@wagmi/core'),
      o.evm && named(['mainnet', 'sepolia'], 'viem/chains'),
      o.evm && '',
      o.evm && 'export const appChains = [sepolia, mainnet] as const;',
      o.evm && '',
      o.evm &&
        '// Created once, outside components. createDefaultTransports uses the public RPC URLs of the viem chains.',
      o.evm && `// With ssr: true the state is restored in the browser by ${hydratedBy}.`,
      o.evm && 'export const wagmiConfig = createConfig({',
      o.evm && '  chains: appChains,',
      o.evm && '  connectors: [injected()],',
      o.evm && '  transports: createDefaultTransports(appChains),',
      o.evm && '  ssr: true,',
      o.evm && '});',
      o.evm && o.solana && '',
      o.solana && '// An RPC URL for each Solana cluster the app uses, by cluster name: mainnet, devnet, testnet',
      o.solana && 'export const solanaRPCUrls = {',
      o.solana && "  devnet: 'https://api.devnet.solana.com',",
      o.solana && '};',
      '',
    ),
  };
}

function transactionsFile(o: StackOptions): GeneratedFile {
  return {
    path: `${PATHS.transactions}.ts`,
    language: 'ts',
    code: lines(
      named(['Transaction'], sources(o).pulsar, true),
      '',
      'export enum TxType {',
      "  increment = 'increment',",
      '}',
      '',
      '// One member per transaction type: `type` and `payload` are typed everywhere the transaction is read',
      'export type IncrementTx = Transaction & { type: TxType.increment; payload: { value: number } };',
      '',
      'export type AppTransaction = IncrementTx;',
      '',
    ),
  };
}

const configNames = (o: StackOptions, want: { chains?: boolean; rpc?: boolean; wagmi?: boolean }) => [
  o.evm && want.chains && 'appChains',
  o.solana && want.rpc && 'solanaRPCUrls',
  o.evm && want.wagmi && 'wagmiConfig',
];

/** The Pulsar adapters for the picked chains, as the `adapter` value */
function pulsarAdapters(o: StackOptions): string {
  const adapters = [
    o.evm && 'pulsarEvmAdapter(wagmiConfig, appChains)',
    o.solana && 'pulsarSolanaAdapter({ rpcUrls: solanaRPCUrls })',
  ].filter(Boolean);
  return adapters.length === 1 ? (adapters[0] as string) : `[${adapters.join(', ')}]`;
}

/** The Pulsar store of a React app: tracking, and with Quasar the sync and the history store */
function pulsarStoreFile(o: StackOptions): GeneratedFile {
  const s = sources(o);
  const path = `${PATHS.pulsarStore}.ts`;
  const quasarSource = o.framework === 'next' ? PATHS.quasarActions : PATHS.quasarApi;
  return {
    path,
    language: 'ts',
    code: lines(
      o.evm && named(['pulsarEvmAdapter'], s.evmPulsar),
      o.quasar && named(['preFlightTxCheck'], '@tuwaio/quasar-sdk/react'),
      named(
        [
          'createBoundedUseStore',
          'createPulsarStore',
          o.quasar && 'createTxInMemoryStore',
          o.quasar && 'type TxInMemoryPagination',
        ],
        s.pulsar,
      ),
      o.solana && named(['pulsarSolanaAdapter'], s.solanaPulsar),
      '',
      o.quasar && named(['getHistory', 'syncTransaction'], modulePath(o, path, quasarSource)),
      named(configNames(o, { chains: true, rpc: true, wagmi: true }), modulePath(o, path, PATHS.appConfig)),
      named(['AppTransaction'], modulePath(o, path, PATHS.transactions), true),
      '',
      'export const pulsarStore = createPulsarStore<AppTransaction>({',
      "  name: 'my-app-transactions', // the localStorage key",
      `  adapter: ${pulsarAdapters(o)},`,
      o.quasar &&
        lines(
          '  // Stops the transaction when the user is not signed in or Quasar does not respond',
          `  beforeTxProcess: () => preFlightTxCheck(${clientEnv(o, 'QUASAR_BASE_URL')}),`,
          '  // Throw on failure: the transaction stays unsynced and is sent again later (reconcileUnsyncedTransactions)',
          '  onRemoteCreate: async (tx) => {',
          '    const result = await syncTransaction(tx);',
          '    if (!result.success) throw new Error(result.error);',
          '  },',
        ),
      '});',
      '',
      'export const usePulsarStore = createBoundedUseStore(pulsarStore);',
      o.quasar &&
        lines(
          '',
          'export const historyStore = createTxInMemoryStore<AppTransaction>({',
          '  localTransactionsPool: pulsarStore.getState().transactionsPool,',
          '  reconcileUnsyncedTransactions: pulsarStore.getState().reconcileUnsyncedTransactions,',
          '  getHistory: async ({ page, walletAddress }) => {',
          '    const history = await getHistory({ walletAddress, page });',
          '    return history && { ...history, docs: history.docs as AppTransaction[] };',
          '  },',
          '  // Pending transactions sent from another device continue to be tracked here',
          '  onHistoryFetched: (remoteTxs) => pulsarStore.getState().injectExternalPendingTxs(remoteTxs),',
          '});',
          '',
          'pulsarStore.subscribe((state) => historyStore.getState().syncWithLocalPool(state.transactionsPool));',
          '',
          'export const useHistoryStore = createBoundedUseStore(historyStore);',
          '',
          'export function useHistoryPagination(): TxInMemoryPagination {',
          '  const isLoading = useHistoryStore((state) => state.isLoading);',
          '  const isError = useHistoryStore((state) => state.isError);',
          '  const currentPage = useHistoryStore((state) => state.currentPage);',
          '  const hasMore = useHistoryStore((state) => state.hasMore);',
          '  const fetchNextPage = useHistoryStore((state) => state.fetchNextPage);',
          '  return { isLoading, isError, currentPage, hasMore, fetchNextPage };',
          '}',
        ),
      '',
    ),
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Server: SIWX sessions, Quasar sync and history, webhooks

function authStoresFile(o: StackOptions): GeneratedFile {
  return {
    path: o.framework === 'next' ? `${PATHS.authStores}.ts` : 'server/authStores.ts',
    language: 'ts',
    code: lines(
      named(['MemorySiwxNonceStore', 'MemorySiwxSessionStore'], sources(o).siwxServer),
      '',
      '// For one server process; they refuse to run with NODE_ENV=production. Use Redis or a database there.',
      'export const sessionStore = new MemorySiwxSessionStore();',
      'export const nonceStore = new MemorySiwxNonceStore();',
      '',
    ),
  };
}

const SIWX_POLICY = `  policy: {
    expectedDomain: appUrl.host,
    expectedUri: appUrl.origin,
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
  },`;

function siwxRouteFile(o: StackOptions): GeneratedFile {
  const s = sources(o);
  if (o.framework === 'next') {
    const path = 'src/app/api/siwx/[...siwx]/route.ts';
    return {
      path,
      language: 'ts',
      code: lines(
        named(['createSiwxApiHandler'], s.siwxHandler),
        '',
        named(['nonceStore', 'sessionStore'], modulePath(o, path, PATHS.authStores)),
        '',
        "const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');",
        '',
        '// Serves /api/siwx/nonce, /api/siwx/verify, /api/siwx/session and /api/siwx/logout',
        'export const { GET, POST, DELETE } = createSiwxApiHandler({',
        '  sessionStore,',
        '  nonceStore,',
        SIWX_POLICY,
        '});',
        '',
      ),
    };
  }
  return {
    path: 'server/siwx.ts',
    language: 'ts',
    code: lines(
      named(['createSiwxApiHandler'], s.siwxHandler),
      '',
      named(['nonceStore', 'sessionStore'], './authStores'),
      '',
      '// The origin of the app: every sign-in message must carry its host and URI',
      "const appUrl = new URL(process.env.APP_URL ?? 'http://localhost:5173');",
      '',
      '// Serves /api/siwx/nonce, /api/siwx/verify, /api/siwx/session and /api/siwx/logout. The handlers take a Fetch',
      '// Request and return a Response, so they run on any server, not only in Next.js.',
      'export const siwxHandler = createSiwxApiHandler({',
      '  sessionStore,',
      '  nonceStore,',
      SIWX_POLICY,
      '});',
      '',
    ),
  };
}

function quasarActionsFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.quasarActions}.ts`;
  return {
    path,
    language: 'ts',
    code: lines(
      "'use server';",
      '',
      named(['Quasar', 'QuasarSDKError', 'type Transaction'], '@tuwaio/quasar-sdk'),
      named(['getSiwxServerSession', 'isSessionMatchingTarget'], sources(o).siwxServer),
      named(['cookies'], 'next/headers'),
      '',
      named(['sessionStore'], modulePath(o, path, PATHS.authStores)),
      '',
      'const quasar = new Quasar({',
      "  secretKey: process.env.QUASAR_SECRET_KEY ?? '',",
      '  baseUrl: process.env.NEXT_PUBLIC_QUASAR_BASE_URL, // a self-hosted node; Quasar Cloud when unset',
      '});',
      '',
      "const APP_NAME = 'my-app'; // keeps the history of this app apart inside one Quasar app",
      '',
      'async function getSession() {',
      '  return getSiwxServerSession({ cookieSource: await cookies(), sessionStore });',
      '}',
      '',
      'export async function syncTransaction(tx: Transaction): Promise<{ success: boolean; error?: string }> {',
      '  const session = await getSession();',
      '  if (!session || !isSessionMatchingTarget(session, tx.from, tx.chainId)) {',
      "    return { success: false, error: 'The signed-in wallet did not send this transaction.' };",
      '  }',
      '',
      '  try {',
      '    await quasar.pulsar.syncCreate(tx, APP_NAME);',
      '    return { success: true };',
      '  } catch (error) {',
      "    return { success: false, error: error instanceof QuasarSDKError ? error.message : 'Quasar is unavailable.' };",
      '  }',
      '}',
      '',
      'export async function getHistory(params: { walletAddress: string; page?: number }) {',
      '  const session = await getSession();',
      '  if (!session || !isSessionMatchingTarget(session, params.walletAddress)) {',
      '    return null;',
      '  }',
      '',
      '  return quasar.pulsar.getHistory({',
      '    walletAddress: params.walletAddress,',
      '    page: params.page,',
      '    limit: 10,',
      '    appName: APP_NAME,',
      '  });',
      '}',
      '',
    ),
  };
}

function quasarServerFile(o: StackOptions): GeneratedFile {
  return {
    path: 'server/quasar.ts',
    language: 'ts',
    code: lines(
      named(['Quasar', 'QuasarSDKError', 'type Transaction'], '@tuwaio/quasar-sdk'),
      named(['getSiwxServerSession', 'isSessionMatchingTarget'], sources(o).siwxServer),
      '',
      named(['sessionStore'], './authStores'),
      '',
      'const quasar = new Quasar({',
      "  secretKey: process.env.QUASAR_SECRET_KEY ?? '',",
      '  baseUrl: process.env.QUASAR_BASE_URL, // a self-hosted node; Quasar Cloud when unset',
      '});',
      '',
      "const APP_NAME = 'my-app'; // keeps the history of this app apart inside one Quasar app",
      '',
      '// POST /api/quasar/sync: a new transaction of the wallet signed in with the session cookie of the request',
      'export async function handleQuasarSync(request: Request): Promise<Response> {',
      '  const session = await getSiwxServerSession({ cookieSource: request, sessionStore });',
      '  const tx = (await request.json()) as Transaction;',
      '  if (!session || !isSessionMatchingTarget(session, tx.from, tx.chainId)) {',
      "    return Response.json({ error: 'The signed-in wallet did not send this transaction.' }, { status: 401 });",
      '  }',
      '',
      '  try {',
      '    await quasar.pulsar.syncCreate(tx, APP_NAME);',
      '    return Response.json({ success: true });',
      '  } catch (error) {',
      "    const message = error instanceof QuasarSDKError ? error.message : 'Quasar is unavailable.';",
      '    return Response.json({ error: message }, { status: 502 });',
      '  }',
      '}',
      '',
      '// GET /api/quasar/history?walletAddress=…&page=…: the history of the signed-in wallet',
      'export async function handleQuasarHistory(request: Request): Promise<Response> {',
      '  const url = new URL(request.url);',
      "  const walletAddress = url.searchParams.get('walletAddress') ?? '';",
      "  const page = Number(url.searchParams.get('page') ?? '1');",
      '  const session = await getSiwxServerSession({ cookieSource: request, sessionStore });',
      '  if (!session || !isSessionMatchingTarget(session, walletAddress)) {',
      '    return Response.json(null, { status: 401 });',
      '  }',
      '',
      '  return Response.json(await quasar.pulsar.getHistory({ walletAddress, page, limit: 10, appName: APP_NAME }));',
      '}',
      '',
    ),
  };
}

const WEBHOOK_BODY = `  const secret = process.env.QUASAR_WEBHOOK_SECRET;
  const signature = request.headers.get('x-quasar-signature');
  if (!secret || !signature) {
    return Response.json({ error: 'Missing signature' }, { status: 401 });
  }

  const body = await request.text();
  const expected = Buffer.from(createHmac('sha256', secret).update(body).digest('hex'), 'hex');
  const received = Buffer.from(signature, 'hex');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // \`status\` is Success, Failed or Replaced; \`metadata\` is the payload of the Pulsar transaction
  const event = JSON.parse(body) as { txKey: string; status: string; txType: string; metadata: unknown };
  if (event.status === 'Success') {
    // Fulfill the order, credit the balance, notify the user…
  }

  return Response.json({ received: true });`;

function webhookFile(o: StackOptions): GeneratedFile {
  const next = o.framework === 'next';
  return {
    path: next ? 'src/app/api/webhooks/quasar/route.ts' : 'server/webhooks.ts',
    language: 'ts',
    code: lines(
      named(['createHmac', 'timingSafeEqual'], 'node:crypto'),
      '',
      '// Quasar posts the final status of each synced transaction, signed with x-quasar-signature (hex HMAC-SHA256 of',
      '// the raw body). Verify before parsing, answer within 10 seconds, and keep the handler idempotent: a failed',
      '// delivery is retried up to 5 times.',
      next
        ? 'export async function POST(request: Request) {'
        : 'export async function handleQuasarWebhook(request: Request): Promise<Response> {',
      WEBHOOK_BODY,
      '}',
      '',
    ),
  };
}

/** The browser side of the Quasar endpoints of a Vite or Vanilla app */
function quasarApiFile(): GeneratedFile {
  return {
    path: `${PATHS.quasarApi}.ts`,
    language: 'ts',
    code: lines(
      "import type { Quasar, Transaction } from '@tuwaio/quasar-sdk';",
      '',
      "export type HistoryPage = Awaited<ReturnType<Quasar['pulsar']['getHistory']>>;",
      '',
      '// Sends a new transaction to the server, which syncs it to Quasar with the secret key (server/quasar.ts)',
      'export async function syncTransaction(tx: Transaction): Promise<{ success: boolean; error?: string }> {',
      "  const res = await fetch('/api/quasar/sync', {",
      "    method: 'POST',",
      "    headers: { 'Content-Type': 'application/json' },",
      '    body: JSON.stringify(tx),',
      '  });',
      '  if (res.ok) return { success: true };',
      '  const body = (await res.json().catch(() => ({}))) as { error?: string };',
      '  return { success: false, error: body.error ?? `Sync failed with status ${res.status}` };',
      '}',
      '',
      'export async function getHistory(params: { walletAddress: string; page?: number }): Promise<HistoryPage | null> {',
      '  const query = new URLSearchParams({ walletAddress: params.walletAddress, page: String(params.page ?? 1) });',
      '  const res = await fetch(`/api/quasar/history?${query}`);',
      '  return res.ok ? ((await res.json()) as HistoryPage) : null;',
      '}',
      '',
    ),
  };
}

/** The API server of a Vite or Vanilla app, mounted on any Fetch API runtime */
function serverFiles(o: StackOptions): GeneratedFile[] {
  return [
    {
      path: 'server/index.ts',
      language: 'ts',
      code: lines(
        o.quasar && named(['handleQuasarHistory', 'handleQuasarSync'], './quasar'),
        named(['siwxHandler'], './siwx'),
        o.quasar && named(['handleQuasarWebhook'], './webhooks'),
        '',
        '/**',
        ` * The API of the app: SIWX sign-in${o.quasar ? ', Quasar sync and history, and the Quasar webhooks' : ''}. It only uses the`,
        ' * Fetch API, so Bun (`Bun.serve({ port: 8787, fetch: handleApi })`), Deno, Cloudflare Workers or Hono',
        " * (`app.all('/api/*', (c) => handleApi(c.req.raw))`) run it as well as server/serve.ts.",
        ' */',
        'export async function handleApi(request: Request): Promise<Response> {',
        '  const { pathname } = new URL(request.url);',
        '',
        "  if (pathname.startsWith('/api/siwx/')) {",
        "    if (request.method === 'GET') return siwxHandler.GET(request);",
        "    if (request.method === 'DELETE') return siwxHandler.DELETE(request);",
        '    return siwxHandler.POST(request);',
        '  }',
        o.quasar &&
          lines(
            "  if (pathname === '/api/quasar/sync' && request.method === 'POST') return handleQuasarSync(request);",
            "  if (pathname === '/api/quasar/history') return handleQuasarHistory(request);",
            "  if (pathname === '/api/webhooks/quasar' && request.method === 'POST') return handleQuasarWebhook(request);",
          ),
        '',
        "  return new Response('Not found', { status: 404 });",
        '}',
        '',
      ),
    },
    {
      path: 'server/serve.ts',
      language: 'ts',
      code: lines(
        "import { serve } from '@hono/node-server';",
        '',
        "import { handleApi } from './index';",
        '',
        '// The API on Node.js: `npx tsx watch --env-file=.env server/serve.ts`. Vite proxies /api here (vite.config.ts).',
        'serve({ fetch: handleApi, port: 8787 }, ({ port }) => console.log(`API on http://localhost:${port}`));',
        '',
      ),
    },
  ];
}

// ---------------------------------------------------------------------------------------------------------------------
// React: providers, components, entry files

function providersFile(o: StackOptions): GeneratedFile {
  const s = sources(o);
  const path = `${PATHS.providers}.tsx`;
  const nova = o.ui === 'nova';
  const adapters = [
    o.evm && 'satelliteEVMAdapter(wagmiConfig, appChains)',
    o.solana && 'satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })',
  ].filter(Boolean) as string[];
  const adapterValue = adapters.length === 1 ? adapters[0] : `[\n  ${adapters.join(',\n  ')},\n]`;
  const poolSource = o.quasar ? 'useHistoryStore' : 'usePulsarStore';
  const watcherSiwx = !nova && o.siwx ? ' siwx={siwx}' : '';

  const transactionsUI =
    nova &&
    lines(
      '',
      '// The modals and toasts of Nova Transactions, fed by the Pulsar store',
      'function TransactionsUI() {',
      `  const transactionsPool = ${poolSource}((state) => state.transactionsPool);`,
      o.quasar && '  const pagination = useHistoryPagination();',
      '  const initialTx = usePulsarStore((state) => state.initialTx);',
      '  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);',
      '  const executeTxAction = usePulsarStore((state) => state.executeTxAction);',
      '  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);',
      '  const getAdapter = usePulsarStore((state) => state.getAdapter);',
      '  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);',
      '',
      '  // Restarts the trackers of pending transactions after a page reload',
      '  useInitializeTransactionsPool({ initializeTransactionsPool });',
      '',
      '  return (',
      '    <NovaTransactionsProvider',
      '      transactionsPool={transactionsPool}',
      o.quasar && '      pagination={pagination}',
      '      initialTx={initialTx}',
      '      closeTxTrackedModal={closeTxTrackedModal}',
      '      executeTxAction={executeTxAction}',
      '      connectedWalletAddress={activeConnection?.isConnected ? activeConnection.address : undefined}',
      `      connectedAdapterType={getAdapterFromConnectorType(activeConnection?.connectorType ?? '${o.evm ? 'evm' : 'solana'}:')}`,
      '      adapter={getAdapter()}',
      '    />',
      '  );',
      '}',
    );

  const poolInitializer =
    !nova &&
    lines(
      '',
      '// Restarts the trackers of pending transactions after a page reload',
      'function TransactionsPoolInitializer() {',
      '  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);',
      '  useInitializeTransactionsPool({ initializeTransactionsPool });',
      '  return null;',
      '}',
    );

  const siwxConfig =
    nova &&
    o.siwx &&
    lines(
      '',
      '// Nova Connect asks every connected wallet to sign in and disconnects a wallet that refuses',
      "const siwx: NovaConnectProviderProps['siwx'] = {",
      indent(SIWX_FETCHERS, '  '),
      '  destroyer: async () => {',
      "    await fetch('/api/siwx/logout', { method: 'POST' });",
      '  },',
      '};',
    );

  const body = nova
    ? lines(
        '',
        'export function Providers({ children }: { children: ReactNode }) {',
        `  const transactionsPool = ${poolSource}((state) => state.transactionsPool);`,
        o.quasar && '  const pagination = useHistoryPagination();',
        '  const getAdapter = usePulsarStore((state) => state.getAdapter);',
        '',
        '  return (',
        '    <SatelliteConnectProvider adapter={satelliteAdapters} autoConnect>',
        o.evm && '      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />',
        o.solana && '      <SolanaConnectorsWatcher />',
        o.quasar && '      <HistoryLoader />',
        '      <TransactionsUI />',
        '      <NovaConnectProvider',
        o.evm && '        appChains={appChains}',
        o.solana && '        solanaRPCUrls={solanaRPCUrls}',
        '        transactionPool={transactionsPool}',
        o.quasar && '        pagination={pagination}',
        '        // The prop is typed for the base Transaction; the store holds AppTransaction',
        "        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}",
        o.siwx && '        siwx={siwx}',
        '        withBalance',
        '        withChain',
        '      >',
        '        {children}',
        '      </NovaConnectProvider>',
        '    </SatelliteConnectProvider>',
        '  );',
        '}',
        '',
      )
    : lines(
        '',
        'export function Providers({ children }: { children: ReactNode }) {',
        o.siwx &&
          lines(
            '  // The watchers disconnect a wallet whose account or chain no longer matches the signed-in session',
            '  const siwx = useSiwxSession();',
            '',
          ),
        '  return (',
        '    <SatelliteConnectProvider adapter={satelliteAdapters} autoConnect>',
        '      {/* The watchers follow account and network changes made in the wallet. They ship with the Nova Connect',
        '          entry of the SDK but render no UI. */}',
        o.evm && `      <EVMConnectorsWatcher wagmiConfig={wagmiConfig}${watcherSiwx} />`,
        o.solana && `      <SolanaConnectorsWatcher${watcherSiwx} />`,
        '      <TransactionsPoolInitializer />',
        o.quasar && '      <HistoryLoader />',
        '      {children}',
        '    </SatelliteConnectProvider>',
        '  );',
        '}',
        '',
      );

  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      o.evm && named(['EVMConnectorsWatcher'], '@tuwaio/evm-sdk/nova-connect'),
      o.evm && named(['satelliteEVMAdapter'], s.evmSatellite),
      nova && named(['NovaConnectProvider', 'type NovaConnectProviderProps'], '@tuwaio/sdk/nova-connect'),
      nova && named(['NovaTransactionsProvider'], '@tuwaio/sdk/nova-transactions/providers'),
      nova && named(['getAdapterFromConnectorType'], '@tuwaio/sdk/orbit'),
      named(['useInitializeTransactionsPool'], '@tuwaio/sdk/pulsar'),
      named(['SatelliteConnectProvider', nova && 'useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      !nova && o.siwx && named(['useSiwxSession'], '@tuwaio/sdk/siwx'),
      o.solana && named(['SolanaConnectorsWatcher'], '@tuwaio/solana-sdk/nova-connect'),
      o.solana && named(['satelliteSolanaAdapter'], s.solanaSatellite),
      named(['ReactNode'], 'react', true),
      '',
      named(configNames(o, { chains: true, rpc: true, wagmi: true }), modulePath(o, path, PATHS.appConfig)),
      named(
        [o.quasar && nova && 'useHistoryPagination', o.quasar && nova && 'useHistoryStore', 'usePulsarStore'],
        modulePath(o, path, PATHS.pulsarStore),
      ),
      o.quasar && named(['HistoryLoader'], modulePath(o, path, PATHS.historyLoader)),
      '',
      '// Created once: a new adapter array on every render makes SatelliteConnectProvider update its store each time',
      `const satelliteAdapters = ${adapterValue};`,
      siwxConfig,
      transactionsUI,
      poolInitializer,
      body,
    ),
  };
}

function historyLoaderFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.historyLoader}.tsx`;
  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      named(['useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      named(['isSessionMatchingTarget', 'useSiwxSessionStore'], '@tuwaio/sdk/siwx'),
      named(['useEffect'], 'react'),
      '',
      named(['useHistoryStore'], modulePath(o, path, PATHS.pulsarStore)),
      '',
      '// Loads the first page of the Quasar history once the connected wallet is signed in',
      'export function HistoryLoader() {',
      '  const address = useSatelliteConnectStore((state) => state.activeConnection?.address);',
      '  const session = useSiwxSessionStore((state) => state.session);',
      '  const fetchInitial = useHistoryStore((state) => state.fetchInitial);',
      '  const isSignedIn = Boolean(session && address && isSessionMatchingTarget(session, address));',
      '',
      '  useEffect(() => {',
      '    if (isSignedIn && address) void fetchInitial(address);',
      '  }, [isSignedIn, address, fetchInitial]);',
      '',
      '  return null;',
      '}',
      '',
    ),
  };
}

/** Headless: the wallets the adapters can connect to now, as plain buttons */
function connectWalletsFile(o: StackOptions): GeneratedFile {
  return {
    path: `${PATHS.connectWallets}.tsx`,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      named(['type ConnectorType', 'formatConnectorName', 'OrbitAdapter'], '@tuwaio/sdk/orbit'),
      named(['useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      named(['useState'], 'react'),
      o.evm && named(['sepolia'], 'viem/chains'),
      '',
      '// The chain each family connects to first',
      'const FIRST_CHAIN: Partial<Record<OrbitAdapter, number | string>> = {',
      o.evm && '  [OrbitAdapter.EVM]: sepolia.id,',
      o.solana && "  [OrbitAdapter.SOLANA]: 'devnet',",
      '};',
      '',
      'export function ConnectWallets() {',
      '  const getConnectors = useSatelliteConnectStore((state) => state.getConnectors);',
      '  const connect = useSatelliteConnectStore((state) => state.connect);',
      '  const disconnect = useSatelliteConnectStore((state) => state.disconnect);',
      '  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);',
      '  const connectionError = useSatelliteConnectStore((state) => state.connectionError);',
      '  // Read when the list opens: wallets announce themselves after the page loads',
      '  const [connectors, setConnectors] = useState<ReturnType<typeof getConnectors> | null>(null);',
      '',
      '  if (activeConnection?.isConnected) {',
      '    return (',
      '      <div>',
      '        <span>{activeConnection.address}</span>',
      '        <button onClick={() => disconnect(activeConnection.connectorType)}>Disconnect</button>',
      '      </div>',
      '    );',
      '  }',
      '',
      '  return (',
      '    <div>',
      '      <button onClick={() => setConnectors(getConnectors())}>Connect a wallet</button>',
      '      {connectors &&',
      '        (Object.entries(connectors) as [OrbitAdapter, { name: string }[]][]).flatMap(([adapter, list]) =>',
      '          list.map((connector) => {',
      '            // The type Satellite uses: the family, then the wallet name as formatConnectorName normalizes it',
      '            const connectorType = `${adapter}:${formatConnectorName(connector.name)}` as ConnectorType;',
      '            return (',
      '              <button',
      '                key={connectorType}',
      '                onClick={() => connect({ connectorType, chainId: FIRST_CHAIN[adapter] ?? 1 })}',
      '              >',
      '                {connector.name}',
      '              </button>',
      '            );',
      '          }),',
      '        )}',
      '      {connectionError && <p role="alert">{connectionError.message}</p>}',
      '    </div>',
      '  );',
      '}',
      '',
    ),
  };
}

/** Headless sign-in: a CAIP-122 message signed by the active connection and verified by the server */
function signInButtonFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.signInButton}.tsx`;
  const solanaSigner = 'await createSatelliteSiwxSigner(activeConnection as SolanaConnection)';
  const signer =
    o.evm && o.solana
      ? lines(
          "      signer: activeConnection.connectorType.startsWith('evm:')",
          '        ? createEvmSiwxSigner(wagmiConfig)',
          `        : ${solanaSigner},`,
        )
      : `      signer: ${o.evm ? 'createEvmSiwxSigner(wagmiConfig)' : solanaSigner},`;
  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      o.evm && named(['createEvmSiwxSigner'], sources(o).evmSiwx),
      named(['useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      named(
        [
          o.solana && 'createSatelliteSiwxSigner',
          'getSatelliteSiwxFields',
          'isSessionMatchingConnection',
          'useSiwx',
          'useSiwxSession',
        ],
        '@tuwaio/sdk/siwx',
      ),
      o.solana && named(['SolanaConnection'], '@tuwaio/solana-sdk/satellite', true),
      o.evm && '',
      o.evm && named(['wagmiConfig'], modulePath(o, path, PATHS.appConfig)),
      '',
      'export function SignInButton() {',
      '  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);',
      '  const { signIn, signOut } = useSiwx();',
      '  const { session, status } = useSiwxSession();',
      '',
      '  if (!activeConnection?.isConnected) return null;',
      '  // The SIWX helpers read the account and the chain of the connection',
      '  const account = { address: activeConnection.address, chainId: activeConnection.chainId };',
      '',
      '  if (isSessionMatchingConnection(session, account)) {',
      '    return (',
      '      <button',
      '        onClick={async () => {',
      "          await fetch('/api/siwx/logout', { method: 'POST' });",
      '          signOut();',
      '        }}',
      '      >',
      '        Sign out',
      '      </button>',
      '    );',
      '  }',
      '',
      '  const handleSignIn = async () =>',
      '    signIn({',
      o.evm &&
        o.solana &&
        '      // EVM wallets sign through wagmi; a Solana connection carries the signMessage of its Wallet Standard wallet',
      !o.evm && '      // A Solana connection carries the signMessage of its Wallet Standard wallet',
      signer,
      indent(SIWX_FETCHERS, '      '),
      "      fields: getSatelliteSiwxFields(account, { statement: 'Sign in to my-app.' }),",
      '    });',
      '',
      '  return (',
      "    <button onClick={handleSignIn} disabled={status !== 'idle' && status !== 'error'}>",
      '      Sign in',
      '    </button>',
      '  );',
      '}',
      '',
    ),
  };
}

const TX_PARAMS_EVM = `        type: TxType.increment,
        adapter: OrbitAdapter.EVM,
        desiredChainID: sepolia.id,
        title: ['Incrementing', 'Incremented', 'Increment failed', 'Increment replaced'],
        description: 'Increment the counter by 1.',
        payload: { value: 1 },`;

function incrementButtonFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.incrementButton}.tsx`;
  const nova = o.ui === 'nova';
  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      nova && named(['TxActionButton'], '@tuwaio/sdk/nova-transactions'),
      named(['OrbitAdapter'], '@tuwaio/sdk/orbit'),
      nova && named(['useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      named(['writeContract'], '@wagmi/core'),
      named(['sepolia'], 'viem/chains'),
      '',
      named(['wagmiConfig'], modulePath(o, path, PATHS.appConfig)),
      named(['usePulsarStore'], modulePath(o, path, PATHS.pulsarStore)),
      named(['TxType'], modulePath(o, path, PATHS.transactions)),
      '',
      COUNTER,
      '',
      '// actionFunction sends the transaction and returns its hash; Pulsar asks the wallet to switch to desiredChainID,',
      '// adds the transaction to the pool and tracks it to Success, Failed or Replaced',
      'export function IncrementButton() {',
      '  const executeTxAction = usePulsarStore((state) => state.executeTxAction);',
      nova
        ? lines(
            '  const transactionsPool = usePulsarStore((state) => state.transactionsPool);',
            '  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);',
            '  const walletAddress = useSatelliteConnectStore((state) => state.activeConnection?.address);',
          )
        : lines(
            '  const lastTx = usePulsarStore((state) => {',
            '    const key = state.getLastTxKey();',
            '    return key ? state.transactionsPool[key] : undefined;',
            '  });',
          ),
      '',
      '  const increment = () =>',
      '    executeTxAction({',
      '      actionFunction: () =>',
      '        writeContract(wagmiConfig, {',
      '          address: COUNTER_ADDRESS,',
      '          abi: counterAbi,',
      "          functionName: 'increment',",
      '          chainId: sepolia.id,',
      '        }),',
      '      params: {',
      TX_PARAMS_EVM,
      nova && '        withTrackedModal: true, // opens the tracking modal of Nova Transactions',
      '      },',
      '    });',
      '',
      nova
        ? lines(
            '  return (',
            '    <TxActionButton',
            '      action={increment}',
            '      transactionsPool={transactionsPool}',
            '      getLastTxKey={getLastTxKey}',
            '      walletAddress={walletAddress}',
            '    >',
            '      Increment',
            '    </TxActionButton>',
            '  );',
          )
        : lines(
            '  return (',
            '    <div>',
            '      <button onClick={increment}>Increment</button>',
            "      {lastTx && <p>{lastTx.pending ? 'Pending…' : lastTx.status}</p>}",
            '    </div>',
            '  );',
          ),
      '}',
      '',
    ),
  };
}

function solanaTxButtonFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.solanaTxButton}.tsx`;
  const nova = o.ui === 'nova';
  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      named(['Instruction'], '@solana/kit', true),
      named(['useWalletAccountTransactionSendingSigner'], '@solana/react'),
      nova && named(['TxActionButton'], '@tuwaio/sdk/nova-transactions'),
      named(['OrbitAdapter'], '@tuwaio/sdk/orbit'),
      named(['useSatelliteConnectStore'], '@tuwaio/sdk/satellite'),
      named(['createSolanaClientWithCache'], '@tuwaio/solana-sdk/orbit'),
      named(['signAndSendSolanaTx'], '@tuwaio/solana-sdk/pulsar'),
      named(['SolanaConnection'], '@tuwaio/solana-sdk/satellite', true),
      '',
      named(['usePulsarStore'], modulePath(o, path, PATHS.pulsarStore)),
      named(['TxType'], modulePath(o, path, PATHS.transactions)),
      '',
      "type WalletAccount = NonNullable<SolanaConnection['connectedAccount']>;",
      '',
      '// The signer comes from @solana/react for the Wallet Standard account of the connection, so this component is',
      '// rendered only while a Solana wallet is connected. Pulsar checks the cluster (desiredChainID) but cannot switch it.',
      'function SendButton(props: { account: WalletAccount; connection: SolanaConnection; instruction: Instruction }) {',
      '  const { account, connection, instruction } = props;',
      '  const executeTxAction = usePulsarStore((state) => state.executeTxAction);',
      nova
        ? lines(
            '  const transactionsPool = usePulsarStore((state) => state.transactionsPool);',
            '  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);',
          )
        : lines(
            '  const lastTx = usePulsarStore((state) => {',
            '    const key = state.getLastTxKey();',
            '    return key ? state.transactionsPool[key] : undefined;',
            '  });',
          ),
      "  const cluster = String(connection.chainId); // 'devnet', 'mainnet', …",
      '  const signer = useWalletAccountTransactionSendingSigner(account, `solana:${cluster}`);',
      '',
      '  const send = () =>',
      '    executeTxAction({',
      '      actionFunction: () =>',
      '        signAndSendSolanaTx({',
      '          client: createSolanaClientWithCache({ rpcUrlOrMoniker: connection.rpcURL }),',
      '          signer,',
      '          instruction,',
      '        }),',
      '      params: {',
      '        type: TxType.increment,',
      '        adapter: OrbitAdapter.SOLANA,',
      '        desiredChainID: cluster,',
      '        rpcUrl: connection.rpcURL, // saved with the transaction: tracking resumes on the same RPC after a reload',
      "        title: ['Incrementing', 'Incremented', 'Increment failed', 'Increment replaced'],",
      "        description: 'Increment the counter by 1.',",
      '        payload: { value: 1 },',
      nova && '        withTrackedModal: true,',
      '      },',
      '    });',
      '',
      nova
        ? lines(
            '  return (',
            '    <TxActionButton',
            '      action={send}',
            '      transactionsPool={transactionsPool}',
            '      getLastTxKey={getLastTxKey}',
            '      walletAddress={connection.address}',
            '    >',
            '      Send',
            '    </TxActionButton>',
            '  );',
          )
        : lines(
            '  return (',
            '    <div>',
            '      <button onClick={send}>Send</button>',
            "      {lastTx && <p>{lastTx.pending ? 'Pending…' : lastTx.status}</p>}",
            '    </div>',
            '  );',
          ),
      '}',
      '',
      '// `instruction` comes from the Codama client of your program, for example getIncrementInstruction(...)',
      'export function SolanaTxButton({ instruction }: { instruction: Instruction }) {',
      '  const connection = useSatelliteConnectStore((state) => state.activeConnection) as SolanaConnection | undefined;',
      '  if (!connection?.isConnected || !connection.connectedAccount) return null;',
      '  return <SendButton account={connection.connectedAccount} connection={connection} instruction={instruction} />;',
      '}',
      '',
    ),
  };
}

/** The page content: `src/app/page.tsx` in Next.js, `src/App.tsx` in Vite */
function pageFile(o: StackOptions): GeneratedFile {
  const next = o.framework === 'next';
  const path = next ? 'src/app/page.tsx' : 'src/App.tsx';
  const nova = o.ui === 'nova';
  return {
    path,
    language: 'tsx',
    code: lines(
      clientDirective(o),
      nova && named(['ConnectButton'], '@tuwaio/sdk/nova-connect/components'),
      nova && o.evm && '',
      !nova && named(['ConnectWallets'], modulePath(o, path, PATHS.connectWallets)),
      o.evm && named(['IncrementButton'], modulePath(o, path, PATHS.incrementButton)),
      !nova && o.siwx && named(['SignInButton'], modulePath(o, path, PATHS.signInButton)),
      '',
      next ? 'export default function HomePage() {' : 'export function App() {',
      '  return (',
      '    <main>',
      nova ? '      <ConnectButton />' : '      <ConnectWallets />',
      !nova && o.siwx && '      <SignInButton />',
      o.evm && '      <IncrementButton />',
      o.solana && '      {/* <SolanaTxButton instruction={getIncrementInstruction(...)} /> with your Codama client */}',
      '    </main>',
      '  );',
      '}',
      '',
    ),
  };
}

function nextEntryFiles(o: StackOptions): GeneratedFile[] {
  const nova = o.ui === 'nova';
  return [
    ...(nova
      ? [
          {
            path: 'src/app/globals.css',
            language: 'css' as const,
            code: lines("@import '@tuwaio/sdk/styles/all.css';", "@import 'tailwindcss';", ''),
          },
        ]
      : []),
    {
      path: 'src/app/layout.tsx',
      language: 'tsx',
      code: lines(
        nova && "import './globals.css';",
        nova && '',
        named(['ReactNode'], 'react', true),
        '',
        named(['Providers'], '@/providers/Providers'),
        '',
        'export default function RootLayout({ children }: { children: ReactNode }) {',
        '  return (',
        '    <html lang="en">',
        '      <body>',
        '        <Providers>{children}</Providers>',
        '      </body>',
        '    </html>',
        '  );',
        '}',
        '',
      ),
    },
  ];
}

function viteEntryFiles(o: StackOptions): GeneratedFile[] {
  const nova = o.ui === 'nova';
  const files: GeneratedFile[] = [
    {
      path: 'src/main.tsx',
      language: 'tsx',
      code: lines(
        nova && "import './styles/app.css';",
        nova && '',
        named(['StrictMode'], 'react'),
        named(['createRoot'], 'react-dom/client'),
        '',
        named(['App'], './App'),
        named(['Providers'], './providers/Providers'),
        '',
        "createRoot(document.getElementById('root')!).render(",
        '  <StrictMode>',
        '    <Providers>',
        '      <App />',
        '    </Providers>',
        '  </StrictMode>,',
        ');',
        '',
      ),
    },
  ];
  if (nova) {
    files.push({
      path: 'src/styles/app.css',
      language: 'css',
      code: lines("@import '@tuwaio/sdk/styles/all.css';", "@import 'tailwindcss';", ''),
    });
  }
  return files;
}

/** vite.config.ts: React, Tailwind for Nova, and the /api proxy when the app has a server */
function viteConfigFile(o: StackOptions): GeneratedFile {
  const react = isReact(o);
  const tailwind = o.ui === 'nova';
  const proxy = o.siwx;
  const plugins = [react && 'react()', tailwind && 'tailwindcss()'].filter(Boolean);
  return {
    path: 'vite.config.ts',
    language: 'ts',
    code: lines(
      tailwind && "import tailwindcss from '@tailwindcss/vite';",
      react && "import react from '@vitejs/plugin-react';",
      "import { defineConfig } from 'vite';",
      '',
      'export default defineConfig({',
      plugins.length > 0 && `  plugins: [${plugins.join(', ')}],`,
      '  // The wallet SDKs make the main chunk larger than the default limit of 500 kB',
      '  build: { chunkSizeWarningLimit: 1500 },',
      proxy && '  // The API runs as its own server in development (server/serve.ts)',
      proxy && "  server: { proxy: { '/api': 'http://localhost:8787' } },",
      '});',
      '',
    ),
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Vanilla TypeScript: the stores without React

function vanillaSatelliteFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.vanillaSatellite}.ts`;
  const connectors = [o.evm && 'ConnectorEVM', o.solana && 'ConnectorSolana'].filter(Boolean).join(' | ');
  const connections = [o.evm && 'EVMConnection', o.solana && 'SolanaConnection'].filter(Boolean).join(' | ');
  const adapters = [
    o.evm && 'satelliteEVMAdapter(wagmiConfig, appChains)',
    o.solana && 'satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })',
  ].filter(Boolean);
  return {
    path,
    language: 'ts',
    code: lines(
      named(['createSatelliteConnectStore'], '@tuwaio/satellite-core'),
      o.evm &&
        named(
          ['type ConnectorEVM', 'createEVMConnectionsWatcher', 'type EVMConnection', 'satelliteEVMAdapter'],
          '@tuwaio/satellite-evm',
        ),
      o.solana &&
        named(['type ConnectorSolana', 'satelliteSolanaAdapter', 'type SolanaConnection'], '@tuwaio/satellite-solana'),
      o.evm && named(['hydrate'], '@wagmi/core'),
      '',
      named(configNames(o, { chains: true, rpc: true, wagmi: true }), modulePath(o, path, PATHS.appConfig)),
      '',
      o.evm && o.solana
        ? lines(
            'export const satelliteStore = createSatelliteConnectStore<',
            `  ${connectors},`,
            `  ${connections}`,
            '>({',
          )
        : `export const satelliteStore = createSatelliteConnectStore<${connectors}, ${connections}>({`,
      `  adapter: ${adapters.length === 1 ? adapters[0] : `[${adapters.join(', ')}]`},`,
      '});',
      '',
      '/** Once per page load, in the browser: restores the wallets and reconnects the last one */',
      'export async function initializeSatellite(): Promise<void> {',
      o.evm &&
        lines(
          '  // Restores the wagmi state and adds the EIP-6963 wallets to the connectors; Satellite reconnects the wallet',
          '  await hydrate(wagmiConfig, { reconnectOnMount: false }).onMount();',
          '',
          '  // Follows account and network changes made in the EVM wallet; reads the store on every event',
          '  createEVMConnectionsWatcher(',
          '    { wagmiConfig },',
          '    {',
          '      disconnect: (connectorType) => void satelliteStore.getState().disconnect(connectorType),',
          '      updateActiveConnection: (connection) => satelliteStore.getState().updateActiveConnection(connection),',
          '      getState: () => {',
          '        const { activeConnection, connectionError } = satelliteStore.getState();',
          '        return {',
          "          activeConnection: activeConnection?.connectorType.startsWith('evm:')",
          '            ? (activeConnection as EVMConnection)',
          '            : undefined,',
          '          connectionError,',
          '        };',
          '      },',
          '    },',
          '  );',
          '',
        ),
      '  await satelliteStore.getState().initializeAutoConnect(true);',
      '}',
      '',
    ),
  };
}

function vanillaAuthFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.vanillaAuth}.ts`;
  return {
    path,
    language: 'ts',
    code: lines(
      named(['buildMessage', 'normalizeSolanaChainId', 'type SiwxChainId'], '@tuwaio/siwx-core'),
      o.evm && named(['createEvmSiwxSigner'], '@tuwaio/siwx-evm'),
      o.solana && named(['SolanaConnection'], '@tuwaio/satellite-solana', true),
      named(['createStore'], 'zustand/vanilla'),
      '',
      o.evm && named(['wagmiConfig'], modulePath(o, path, PATHS.appConfig)),
      named(['satelliteStore'], modulePath(o, path, PATHS.vanillaSatellite)),
      '',
      '/** The session the server issued, as `/api/siwx/session` and `/api/siwx/verify` return it */',
      'export interface Session {',
      '  address: string;',
      '  chainId: string;',
      '  domain: string;',
      '  issuedAt: string;',
      '  expirationTime?: string;',
      '}',
      '',
      '// UI state only: the server checks the session cookie on every request',
      'export const authStore = createStore<{ session: Session | null }>(() => ({ session: null }));',
      '',
      'export async function restoreSession(): Promise<void> {',
      "  const res = await fetch('/api/siwx/session');",
      '  authStore.setState({ session: res.ok ? ((await res.json()) as Session | null) : null });',
      '}',
      '',
      '/** Signs a CAIP-122 message with the active wallet and sends it to the server, which opens the session */',
      'export async function signIn(): Promise<void> {',
      '  const connection = satelliteStore.getState().activeConnection;',
      "  if (!connection?.isConnected) throw new Error('Connect a wallet first.');",
      '',
      "  const isEvm = connection.connectorType.startsWith('evm:');",
      '  // A Solana cluster gets its CAIP-2 chain ID with the genesis hash (`devnet` → `solana:EtWTRABZ…`), as CAIP-30 requires',
      '  const chainId = (',
      '    isEvm ? `eip155:${connection.chainId}` : normalizeSolanaChainId(`solana:${connection.chainId}`)',
      '  ) as SiwxChainId;',
      "  const { nonce } = (await (await fetch('/api/siwx/nonce')).json()) as { nonce: string };",
      '  const issuedAt = new Date();',
      '  const message = buildMessage({',
      '    domain: window.location.host,',
      '    uri: window.location.origin,',
      '    address: `${chainId}:${connection.address}`,',
      '    chainId,',
      "    statement: 'Sign in to my-app.',",
      "    version: '1',",
      '    nonce,',
      '    issuedAt: issuedAt.toISOString(),',
      '    expirationTime: new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),',
      '  });',
      '',
      o.evm && o.solana
        ? lines(
            '  // EVM signs through wagmi; a Solana connection carries the signMessage of its Wallet Standard wallet',
            '  const sign = isEvm ? createEvmSiwxSigner(wagmiConfig) : (connection as SolanaConnection).signMessage;',
          )
        : o.evm
          ? '  const sign = createEvmSiwxSigner(wagmiConfig);'
          : lines(
              '  // A Solana connection carries the signMessage of its Wallet Standard wallet',
              '  const sign = (connection as SolanaConnection).signMessage;',
            ),
      "  if (!sign) throw new Error('The wallet cannot sign messages.');",
      '  const signature = await sign(message);',
      '',
      "  const res = await fetch('/api/siwx/verify', {",
      "    method: 'POST',",
      "    headers: { 'Content-Type': 'application/json' },",
      '    body: JSON.stringify({ message, signature }),',
      '  });',
      "  if (!res.ok) throw new Error('The server rejected the sign-in.');",
      '  authStore.setState({ session: (await res.json()) as Session });',
      '}',
      '',
      'export async function signOut(): Promise<void> {',
      "  await fetch('/api/siwx/logout', { method: 'POST' });",
      '  authStore.setState({ session: null });',
      '}',
      '',
    ),
  };
}

function vanillaPulsarStoreFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.vanillaPulsarStore}.ts`;
  return {
    path,
    language: 'ts',
    code: lines(
      named(['createPulsarStore', o.quasar && 'createTxInMemoryStore'], '@tuwaio/pulsar-core'),
      o.evm && named(['pulsarEvmAdapter'], '@tuwaio/pulsar-evm'),
      o.solana && named(['pulsarSolanaAdapter'], '@tuwaio/pulsar-solana'),
      '',
      o.quasar && named(['getHistory', 'syncTransaction'], modulePath(o, path, PATHS.quasarApi)),
      o.quasar && named(['authStore'], modulePath(o, path, PATHS.vanillaAuth)),
      named(configNames(o, { chains: true, rpc: true, wagmi: true }), modulePath(o, path, PATHS.appConfig)),
      named(['AppTransaction'], modulePath(o, path, PATHS.transactions), true),
      '',
      '// Creating the store starts no tracker: call initializeTransactionsPool once in the browser (src/main.ts)',
      'export const pulsarStore = createPulsarStore<AppTransaction>({',
      "  name: 'my-app-transactions', // the localStorage key",
      `  adapter: ${pulsarAdapters(o)},`,
      o.quasar &&
        lines(
          '  // Stops the transaction when the user is not signed in',
          '  beforeTxProcess: async () => {',
          "    if (!authStore.getState().session) throw new Error('Sign in first.');",
          '  },',
          '  // Throw on failure: the transaction stays unsynced and is sent again later (reconcileUnsyncedTransactions)',
          '  onRemoteCreate: async (tx) => {',
          '    const result = await syncTransaction(tx);',
          '    if (!result.success) throw new Error(result.error);',
          '  },',
        ),
      '});',
      o.quasar &&
        lines(
          '',
          'export const historyStore = createTxInMemoryStore<AppTransaction>({',
          '  localTransactionsPool: pulsarStore.getState().transactionsPool,',
          '  reconcileUnsyncedTransactions: pulsarStore.getState().reconcileUnsyncedTransactions,',
          '  getHistory: async ({ page, walletAddress }) => {',
          '    const history = await getHistory({ walletAddress, page });',
          '    return history && { ...history, docs: history.docs as AppTransaction[] };',
          '  },',
          '  // Pending transactions sent from another device continue to be tracked here',
          '  onHistoryFetched: (remoteTxs) => pulsarStore.getState().injectExternalPendingTxs(remoteTxs),',
          '});',
          '',
          'pulsarStore.subscribe((state) => historyStore.getState().syncWithLocalPool(state.transactionsPool));',
        ),
      '',
    ),
  };
}

function vanillaActionsFile(o: StackOptions): GeneratedFile {
  const path = `${PATHS.actions}.ts`;
  return {
    path,
    language: 'ts',
    code: lines(
      named(['OrbitAdapter'], '@tuwaio/orbit-core'),
      o.evm && named(['writeContract'], '@wagmi/core'),
      o.evm && named(['sepolia'], 'viem/chains'),
      '',
      o.evm && named(['wagmiConfig'], modulePath(o, path, PATHS.appConfig)),
      named(['pulsarStore'], modulePath(o, path, PATHS.vanillaPulsarStore)),
      named(['TxType'], modulePath(o, path, PATHS.transactions)),
      '',
      o.evm &&
        lines(
          COUNTER,
          '',
          '// Sends the transaction and tracks it to Success, Failed or Replaced',
          'export function incrementCounter() {',
          '  return pulsarStore.getState().executeTxAction({',
          '    actionFunction: () =>',
          '      writeContract(wagmiConfig, {',
          '        address: COUNTER_ADDRESS,',
          '        abi: counterAbi,',
          "        functionName: 'increment',",
          '        chainId: sepolia.id,',
          '      }),',
          '    params: {',
          TX_PARAMS_EVM.replace(/^ {8}/gm, '      '),
          '    },',
          '  });',
          '}',
        ),
      o.evm && o.solana && '',
      o.solana &&
        lines(
          '// `send` signs and sends the transaction with your wallet code and returns its signature; Pulsar tracks it',
          'export function trackSolanaTransaction(send: () => Promise<string>, rpcUrl: string) {',
          '  return pulsarStore.getState().executeTxAction({',
          '    actionFunction: send,',
          '    params: {',
          '      type: TxType.increment,',
          '      adapter: OrbitAdapter.SOLANA,',
          "      desiredChainID: 'devnet',",
          '      rpcUrl,',
          "      title: ['Incrementing', 'Incremented', 'Increment failed', 'Increment replaced'],",
          "      description: 'Increment the counter by 1.',",
          '      payload: { value: 1 },',
          '    },',
          '  });',
          '}',
        ),
      '',
    ),
  };
}

function vanillaMainFile(o: StackOptions): GeneratedFile {
  return {
    path: 'src/main.ts',
    language: 'ts',
    code: lines(
      named(['type ConnectorType', 'formatConnectorName', 'OrbitAdapter'], '@tuwaio/orbit-core'),
      o.evm && named(['sepolia'], 'viem/chains'),
      '',
      o.evm && named(['incrementCounter'], './actions'),
      o.siwx && named(['authStore', 'restoreSession', 'signIn', 'signOut'], './auth/siwx'),
      named(['initializeSatellite', 'satelliteStore'], './stores/satellite'),
      named(['pulsarStore'], './stores/pulsarStore'),
      '',
      '// The chain each family connects to first',
      'const FIRST_CHAIN: Partial<Record<OrbitAdapter, number | string>> = {',
      o.evm && '  [OrbitAdapter.EVM]: sepolia.id,',
      o.solana && "  [OrbitAdapter.SOLANA]: 'devnet',",
      '};',
      '',
      "const app = document.querySelector<HTMLDivElement>('#app')!;",
      '',
      "const paragraph = (text: string) => Object.assign(document.createElement('p'), { textContent: text });",
      '',
      'function button(label: string, onClick: () => unknown): HTMLButtonElement {',
      "  const element = document.createElement('button');",
      '  element.textContent = label;',
      "  element.addEventListener('click', () => void onClick());",
      '  return element;',
      '}',
      '',
      '// Renders the wallets, the session and the last transaction; called on every store change',
      'function render() {',
      '  const { activeConnection, connectionError } = satelliteStore.getState();',
      '  const { transactionsPool, getLastTxKey } = pulsarStore.getState();',
      '  const lastKey = getLastTxKey();',
      '  const lastTx = lastKey ? transactionsPool[lastKey] : undefined;',
      '  app.replaceChildren();',
      '',
      '  if (!activeConnection?.isConnected) {',
      '    for (const [adapter, connectors] of Object.entries(satelliteStore.getState().getConnectors())) {',
      '      for (const connector of connectors ?? []) {',
      '        const connectorType = `${adapter}:${formatConnectorName(connector.name)}` as ConnectorType;',
      '        const chainId = FIRST_CHAIN[adapter as OrbitAdapter] ?? 1;',
      '        app.append(button(connector.name, () => satelliteStore.getState().connect({ connectorType, chainId })));',
      '      }',
      '    }',
      '    if (connectionError) app.append(paragraph(connectionError.message));',
      '    return;',
      '  }',
      '',
      '  app.append(paragraph(activeConnection.address));',
      "  app.append(button('Disconnect', () => satelliteStore.getState().disconnect(activeConnection.connectorType)));",
      o.siwx && "  app.append(authStore.getState().session ? button('Sign out', signOut) : button('Sign in', signIn));",
      o.evm && "  app.append(button('Increment', incrementCounter));",
      "  if (lastTx) app.append(paragraph(lastTx.pending ? 'Pending…' : String(lastTx.status)));",
      '}',
      '',
      'satelliteStore.subscribe(render);',
      'pulsarStore.subscribe(render);',
      o.siwx && 'authStore.subscribe(render);',
      'render();',
      '',
      'await initializeSatellite();',
      '// Restarts the trackers of pending transactions after a page reload',
      'await pulsarStore.getState().initializeTransactionsPool();',
      o.siwx && 'await restoreSession();',
      '',
    ),
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Environment, packages, template and guides

function envFile(o: StackOptions): GeneratedFile | null {
  if (!o.siwx) return null;
  const next = o.framework === 'next';
  return {
    path: next ? '.env.local' : '.env',
    language: 'dotenv',
    code: lines(
      next ? '# The origin of the app: sign-in messages must carry its host' : '# Server (server/serve.ts)',
      next ? 'NEXT_PUBLIC_APP_URL=http://localhost:3000' : 'APP_URL=http://localhost:5173',
      o.quasar &&
        lines(
          '',
          '# Quasar: the secret key of the app (dashboard → Apps & Keys), server only',
          'QUASAR_SECRET_KEY=sk_test_your_key',
          '# The webhook signing secret of the endpoint (whsec_…)',
          'QUASAR_WEBHOOK_SECRET=',
          next
            ? '# A self-hosted Quasar node; leave empty for Quasar Cloud'
            : '# A self-hosted Quasar node; leave both empty for Quasar Cloud',
          next ? 'NEXT_PUBLIC_QUASAR_BASE_URL=' : 'QUASAR_BASE_URL=',
          !next && 'VITE_QUASAR_BASE_URL=',
        ),
      '',
    ),
  };
}

const SOLANA_PEERS = [
  '@solana/kit',
  '@wallet-standard/app',
  '@wallet-standard/base',
  '@wallet-standard/features',
  '@wallet-standard/ui',
  '@wallet-standard/ui-registry',
];

function packageLists(o: StackOptions): { packages: string[]; devPackages: string[] } {
  const server = o.framework !== 'next' && o.siwx;
  if (o.framework === 'vanilla') {
    const packages = [
      '@tuwaio/orbit-core',
      '@tuwaio/satellite-core',
      '@tuwaio/pulsar-core',
      'zustand',
      'immer',
      'dayjs',
      ...(o.evm ? ['@tuwaio/orbit-evm', '@tuwaio/satellite-evm', '@tuwaio/pulsar-evm', '@wagmi/core', 'viem'] : []),
      ...(o.solana
        ? [
            '@tuwaio/orbit-solana',
            '@tuwaio/satellite-solana',
            '@tuwaio/pulsar-solana',
            ...SOLANA_PEERS,
            '@wallet-standard/ui-core',
          ]
        : []),
      ...(o.siwx ? ['@tuwaio/siwx-core', '@tuwaio/siwx-server'] : []),
      ...(o.siwx && o.evm ? ['@tuwaio/siwx-evm'] : []),
      ...(o.quasar ? ['@tuwaio/quasar-sdk'] : []),
      ...(server ? ['@hono/node-server'] : []),
    ];
    return { packages, devPackages: server ? ['tsx'] : [] };
  }
  const packages = [
    '@tuwaio/sdk',
    ...(o.evm ? ['@tuwaio/evm-sdk', '@wagmi/core', 'viem'] : []),
    ...(o.solana ? ['@tuwaio/solana-sdk', '@solana/react', '@wallet-standard/react', ...SOLANA_PEERS] : []),
    ...(o.quasar ? ['@tuwaio/quasar-sdk'] : []),
    ...(server ? ['@hono/node-server'] : []),
  ];
  const devPackages = [
    ...(o.framework === 'vite' && o.ui === 'nova' ? ['tailwindcss', '@tailwindcss/vite'] : []),
    ...(server ? ['tsx'] : []),
  ];
  return { packages, devPackages };
}

function templateFor(o: StackOptions): StackTemplate {
  if (o.framework === 'vanilla') {
    return { name: null, note: 'No template uses Vanilla TypeScript: the files below are the whole setup.' };
  }
  if (o.framework === 'vite') {
    return {
      name: 'vite-tuwa',
      note:
        o.siwx || o.ui === 'headless' || !(o.evm && o.solana)
          ? 'The closest template: EVM and Solana with Nova, without a server. The files below add the rest.'
          : 'Matches your stack: EVM and Solana with Nova Connect and Nova Transactions.',
    };
  }
  if (o.quasar) {
    return { name: 'nextjs-tuwa-quasar', note: 'The full stack: SIWX, Quasar sync and history, webhooks.' };
  }
  if (o.siwx && o.evm && !o.solana) {
    return { name: 'nextjs-evm', note: 'EVM only, with SIWX sign-in.' };
  }
  if (o.solana && !o.evm) {
    return { name: 'nextjs-solana', note: 'Solana only, with a Codama program.' };
  }
  return {
    name: 'nextjs-tuwa',
    note:
      o.ui === 'headless'
        ? 'The closest template: it uses Nova; the files below replace it with your own UI.'
        : 'EVM and Solana with Nova Connect and Nova Transactions.',
  };
}

function guidesFor(o: StackOptions): { title: string; href: string }[] {
  return [
    ...(isReact(o)
      ? [
          o.ui === 'nova'
            ? { title: 'Full-Stack React App', href: '/guides/full-stack-react' }
            : { title: 'Transaction Tracking in React', href: '/guides/react-transaction-tracking' },
        ]
      : [
          { title: 'Satellite Connect without React', href: 'https://satellite.docs.tuwa.io/packages/satellite-core' },
          { title: 'Pulsar trackers standalone', href: 'https://pulsar.docs.tuwa.io/evmStandalone' },
        ]),
    ...(o.siwx ? [{ title: 'Multi-Chain Auth with SIWX', href: '/guides/multi-chain-auth-siwx-caip122' }] : []),
    ...(o.quasar
      ? [
          { title: 'Sync Transactions to Quasar', href: '/guides/quasar-transaction-sync' },
          { title: 'Quasar Webhooks', href: '/quasar/webhooks' },
        ]
      : []),
    { title: 'TUWA_AGENTS.md', href: 'https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md' },
  ];
}

function commandsFor(o: StackOptions): { label: string; command: string }[] {
  const create =
    o.framework === 'next'
      ? 'npx create-next-app@latest my-app --ts --app --src-dir --tailwind'
      : `npm create vite@latest my-app -- --template ${o.framework === 'vite' ? 'react-ts' : 'vanilla-ts'}`;
  return [
    { label: 'Create the app', command: create },
    ...(o.framework !== 'next' && o.siwx
      ? [{ label: 'Run the API next to Vite', command: 'npx tsx watch --env-file=.env server/serve.ts' }]
      : []),
    ...(o.quasar
      ? [
          {
            label: 'Relay Quasar webhooks to localhost',
            command: `npx @tuwaio/quasar-sdk listen --forward-to http://localhost:${o.framework === 'next' ? '3000' : '8787'}/api/webhooks/quasar`,
          },
        ]
      : []),
  ];
}

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates the setup of a TUWA app: the files, the packages to install, the closest starter template, the guides to
 * read next and the commands to run.
 *
 * @param input - The options; they are normalized first.
 * @returns The stack.
 */
export function generateStack(input: StackOptions): GeneratedStack {
  const o = normalizeStackOptions(input);
  const files: GeneratedFile[] = [appConfigFile(o), transactionsFile(o)];

  if (isReact(o)) {
    files.push(pulsarStoreFile(o), providersFile(o));
    if (o.quasar) files.push(historyLoaderFile(o));
    if (o.ui === 'headless') files.push(connectWalletsFile(o));
    if (o.ui === 'headless' && o.siwx) files.push(signInButtonFile(o));
    if (o.evm) files.push(incrementButtonFile(o));
    if (o.solana) files.push(solanaTxButtonFile(o));
    files.push(pageFile(o));
    files.push(...(o.framework === 'next' ? nextEntryFiles(o) : viteEntryFiles(o)));
  } else {
    files.push(vanillaSatelliteFile(o), vanillaPulsarStoreFile(o), vanillaActionsFile(o));
    if (o.siwx) files.push(vanillaAuthFile(o));
    files.push(vanillaMainFile(o));
  }

  if (o.quasar && o.framework !== 'next') files.push(quasarApiFile());
  if (o.siwx) {
    files.push(authStoresFile(o), siwxRouteFile(o));
    if (o.quasar) files.push(o.framework === 'next' ? quasarActionsFile(o) : quasarServerFile(o), webhookFile(o));
    if (o.framework !== 'next') files.push(...serverFiles(o));
  }
  if (o.framework !== 'next') files.push(viteConfigFile(o));

  const env = envFile(o);
  if (env) files.push(env);

  return {
    options: o,
    ...packageLists(o),
    files,
    template: templateFor(o),
    guides: guidesFor(o),
    commands: commandsFor(o),
  };
}

/**
 * The stack as a prompt for a coding agent (Claude Code, Cursor, …): what to build, the commands, every file and the
 * rules of TUWA_AGENTS.md.
 *
 * @param stack - A generated stack.
 * @param installCommand - The install command for the package manager of the reader.
 * @returns Markdown.
 */
export function agentPrompt(stack: GeneratedStack, installCommand: string): string {
  const o = stack.options;
  const chains = [o.evm && 'EVM', o.solana && 'Solana'].filter(Boolean).join(' and ');
  const features = [
    o.ui === 'nova' ? 'Nova UI Kit components' : 'my own UI on the headless TUWA stores',
    o.siwx && 'wallet sign-in with SIWX and server sessions',
    o.quasar && 'transaction sync, history and webhooks through Quasar',
  ]
    .filter(Boolean)
    .join(', ');
  const fence = (language: FileLanguage) => (language === 'dotenv' ? 'bash' : language);
  return lines(
    `Set up TUWA in this ${FRAMEWORK_LABELS[o.framework]} app for ${chains}, with ${features}.`,
    '',
    'Read https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md first and follow its rules (section 10).',
    'Keep the files below as they are unless the app already has an equivalent; adapt paths and the import alias to the project.',
    '',
    '## Install',
    '',
    '```bash',
    installCommand,
    '```',
    ...stack.commands
      .filter((command) => command.label !== 'Create the app')
      .flatMap((command) => ['', `${command.label}:`, '', '```bash', command.command, '```']),
    '',
    '## Files',
    ...stack.files.flatMap((file) => [
      '',
      `### ${file.path}`,
      '',
      '```' + fence(file.language),
      file.code.trimEnd(),
      '```',
    ]),
    '',
  );
}
