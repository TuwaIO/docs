// The data of `/comparisons`: the radar axes, their criteria and a fact with a source for every product and criterion.
// Scores are computed from the facts, never typed by hand. Recheck every fact each quarter: competitors change their
// pricing and features often. Update `checkedAt` of a fact when you recheck it; the page shows the oldest date.

/** Axis of the radar */
export type AxisId = 'custody' | 'openness' | 'cost' | 'lifecycle' | 'onboarding' | 'chains';

/** How a product meets a criterion: `partial` covers only some of its wallets, transactions or plans */
export type Mark = 'yes' | 'partial' | 'no';

/** Market segment of a competitor, with the part of TUWA that does the same job */
export type SegmentId = 'connectors' | 'embedded' | 'platforms' | 'indexing';

export interface Axis {
  id: AxisId;
  label: string;
  /** What the axis measures */
  question: string;
  /** `true` for the axes where the hosted platforms are stronger than TUWA by design */
  favorsHosted?: boolean;
}

export interface Criterion {
  id: string;
  axis: AxisId;
  label: string;
  description: string;
}

export interface Fact {
  mark: Mark;
  note: string;
  sourceUrl: string;
  /** ISO date of the last check against the source */
  checkedAt: string;
}

export interface Segment {
  id: SegmentId;
  label: string;
  /** The TUWA projects that do the job of this segment */
  counterpart: string;
}

export interface Product {
  id: string;
  name: string;
  /** `null` for TUWA */
  segment: SegmentId | null;
  url: string;
  /** One line: what the product is */
  summary: string;
  license: string;
  pricing: { text: string; sourceUrl: string; checkedAt: string };
  /** When to pick this product instead of TUWA (empty for TUWA) */
  chooseWhen: string;
  /** How TUWA differs in the same job (empty for TUWA) */
  tuwaDifference: string;
  facts: Record<string, Fact>;
}

const CHECKED = '2026-10-01';

const fact = (mark: Mark, note: string, sourceUrl: string, checkedAt = CHECKED): Fact => ({
  mark,
  note,
  sourceUrl,
  checkedAt,
});

export const AXES: Axis[] = [
  { id: 'custody', label: 'Self-Custody', question: 'Do keys and user records stay with users and with you?' },
  { id: 'openness', label: 'Openness', question: 'Can you read, fork and run every part without the vendor?' },
  { id: 'cost', label: 'Cost at Scale', question: 'Does the bill stay flat as your user base grows?' },
  {
    id: 'lifecycle',
    label: 'Tx Lifecycle',
    question: 'Is every transaction your app sends followed to a final state?',
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    question: 'Can users without a wallet sign in and transact?',
    favorsHosted: true,
  },
  { id: 'chains', label: 'Chain Coverage', question: 'How many chain families does it reach?', favorsHosted: true },
];

export const CRITERIA: Criterion[] = [
  {
    id: 'own-wallets',
    axis: 'custody',
    label: 'Users sign with their own wallets',
    description: 'Extension, mobile and hardware wallets connect through standard protocols.',
  },
  {
    id: 'no-vendor-keys',
    axis: 'custody',
    label: 'No vendor-run key management',
    description: "The product creates no wallets whose keys live in the vendor's MPC, TEE or enclave infrastructure.",
  },
  {
    id: 'no-vendor-accounts',
    axis: 'custody',
    label: 'User records stay with you',
    description: 'The vendor keeps no account for each of your users.',
  },
  {
    id: 'oss-client',
    axis: 'openness',
    label: 'Client under an OSI license',
    description: 'The SDK in your app is published under an OSI-approved open-source license.',
  },
  {
    id: 'oss-backend',
    axis: 'openness',
    label: 'Backend open source, or none needed',
    description: 'Every server the product relies on is open source and self-hostable, or it relies on none.',
  },
  {
    id: 'no-vendor-key',
    axis: 'openness',
    label: 'Runs without a vendor key',
    description: "A production setup needs no project ID, app ID or API key from the vendor's dashboard.",
  },
  {
    id: 'free-to-ship',
    axis: 'cost',
    label: 'Free to ship',
    description: 'A production app can launch without a paid plan.',
  },
  {
    id: 'no-mau-billing',
    axis: 'cost',
    label: 'No per-user billing',
    description: 'The bill does not grow with monthly active users or wallets.',
  },
  {
    id: 'free-self-host',
    axis: 'cost',
    label: 'Free self-hosted path',
    description: 'The whole product runs in production on your own servers without license fees.',
  },
  {
    id: 'tracks-to-final',
    axis: 'lifecycle',
    label: 'Tracks transactions to a final state',
    description: 'A transaction the app sends is followed until it succeeds, fails or is replaced.',
  },
  {
    id: 'survives-reload',
    axis: 'lifecycle',
    label: 'Pending transactions survive a reload',
    description: 'Tracking resumes after the page reloads.',
  },
  {
    id: 'status-webhooks',
    axis: 'lifecycle',
    label: 'Status webhooks',
    description: 'Your server is notified when a transaction changes status.',
  },
  {
    id: 'email-social',
    axis: 'onboarding',
    label: 'Email or social login',
    description: 'Users can sign in with an email, phone or social account.',
  },
  {
    id: 'embedded-wallets',
    axis: 'onboarding',
    label: 'Wallets for users without one',
    description: 'New users get a wallet without installing one.',
  },
  {
    id: 'gas-or-onramp',
    axis: 'onboarding',
    label: 'Gas sponsorship or on-ramp',
    description: 'The app can pay gas for users, or users can buy crypto in the flow.',
  },
  { id: 'evm', axis: 'chains', label: 'EVM networks', description: 'Ethereum and EVM-compatible networks.' },
  { id: 'solana', axis: 'chains', label: 'Solana', description: 'Solana mainnet and devnet.' },
  {
    id: 'other-chains',
    axis: 'chains',
    label: 'Other chain families',
    description: 'At least one family beyond EVM and Solana, such as Bitcoin, Sui or TON.',
  },
];

export const SEGMENTS: Segment[] = [
  { id: 'connectors', label: 'Wallet Connection UI', counterpart: 'Satellite Connect + Nova Connect' },
  { id: 'embedded', label: 'Embedded Wallets & Auth', counterpart: 'SIWX + Satellite Connect' },
  { id: 'platforms', label: 'Wallet & Transaction Platforms', counterpart: 'Pulsar + Quasar' },
  { id: 'indexing', label: 'Indexing', counterpart: 'Quasar' },
];

const TUWA_SOURCES = {
  satellite: 'https://satellite.docs.tuwa.io/',
  siwx: 'https://siwx.docs.tuwa.io/',
  pulsar: 'https://pulsar.docs.tuwa.io/',
  github: 'https://github.com/TuwaIO',
  selfHosting: 'https://docs.tuwa.io/quasar/self-hosting',
  webhooks: 'https://docs.tuwa.io/quasar/webhooks',
  pricing: 'https://tuwa.io/pricing',
  hub: 'https://docs.tuwa.io/',
  roadmap: 'https://tuwa.io/',
};

export const TUWA: Product = {
  id: 'tuwa',
  name: 'TUWA',
  segment: null,
  url: 'https://tuwa.io',
  summary: 'Headless, open-source packages for sign-in, wallet connection and transaction tracking, plus Quasar.',
  license: 'Apache-2.0',
  pricing: {
    text: 'Client packages free. Quasar Cloud: $0.002 per unit, 100 free units. Community Edition: free.',
    sourceUrl: TUWA_SOURCES.pricing,
    checkedAt: CHECKED,
  },
  chooseWhen: '',
  tuwaDifference: '',
  facts: {
    'own-wallets': fact(
      'yes',
      'EIP-6963 wallets through wagmi, Wallet Standard wallets on Solana, WalletConnect and Safe{Wallet}.',
      TUWA_SOURCES.satellite,
    ),
    'no-vendor-keys': fact('yes', 'TUWA creates no wallets and never handles keys.', TUWA_SOURCES.satellite),
    'no-vendor-accounts': fact(
      'yes',
      'Sessions live on your server (siwx-server). Quasar Cloud stores the transactions your app syncs; the Community Edition keeps them on your servers.',
      TUWA_SOURCES.siwx,
    ),
    'oss-client': fact('yes', 'Apache-2.0.', TUWA_SOURCES.github),
    'oss-backend': fact(
      'yes',
      'Quasar Community Edition is Apache-2.0 and runs with Docker Compose.',
      TUWA_SOURCES.selfHosting,
    ),
    'no-vendor-key': fact(
      'yes',
      'Only WalletConnect, if you enable it, needs a free Reown project ID. A self-hosted Quasar needs no TUWA key.',
      TUWA_SOURCES.satellite,
    ),
    'free-to-ship': fact(
      'yes',
      'The client packages are free; Quasar Cloud starts with 100 free units.',
      TUWA_SOURCES.pricing,
    ),
    'no-mau-billing': fact(
      'yes',
      'Quasar Cloud bills quota units per tracked transaction and webhook delivery.',
      TUWA_SOURCES.pricing,
    ),
    'free-self-host': fact('yes', 'Community Edition: free, Apache-2.0.', TUWA_SOURCES.selfHosting),
    'tracks-to-final': fact(
      'yes',
      'Pulsar follows EVM transactions (standard, ERC-4337 and Safe) and Solana transactions to Success, Failed or Replaced.',
      TUWA_SOURCES.pulsar,
    ),
    'survives-reload': fact(
      'yes',
      'The transaction pool is saved to localStorage, and trackers resume after a reload.',
      TUWA_SOURCES.pulsar,
    ),
    'status-webhooks': fact('yes', 'Quasar sends signed webhooks when a transaction settles.', TUWA_SOURCES.webhooks),
    'email-social': fact('no', 'By design: TUWA connects the wallets users already have.', TUWA_SOURCES.satellite),
    'embedded-wallets': fact('no', 'By design: no custodial, MPC or enclave wallets.', TUWA_SOURCES.satellite),
    'gas-or-onramp': fact(
      'no',
      'Pulsar tracks ERC-4337 and Gelato relay transactions, but TUWA sponsors no gas and has no on-ramp.',
      TUWA_SOURCES.pulsar,
    ),
    evm: fact('yes', 'Built on wagmi and viem.', TUWA_SOURCES.hub),
    solana: fact('yes', 'Built on @solana/kit and Wallet Standard.', TUWA_SOURCES.hub),
    'other-chains': fact('no', 'Starknet, Tron, Bitcoin and TON are on the roadmap (Phase 8).', TUWA_SOURCES.roadmap),
  },
};

const RAINBOWKIT = {
  install: 'https://rainbowkit.com/docs/installation',
  transactions: 'https://rainbowkit.com/docs/recent-transactions',
  github: 'https://github.com/rainbow-me/rainbowkit',
};

const CONNECTKIT = {
  start: 'https://family.co/docs/connectkit/getting-started',
  family: 'https://family.co/docs/connectkit/family-accounts',
  github: 'https://github.com/family/connectkit',
};

const APPKIT = {
  overview: 'https://docs.reown.com/appkit/overview',
  socials: 'https://docs.reown.com/appkit/authentication/socials',
  license: 'https://github.com/reown-com/appkit/blob/main/LICENSE.md',
  pricing: 'https://reown.com/pricing',
};

const PRIVY = {
  pricing: 'https://www.privy.io/pricing',
  setup: 'https://docs.privy.io/basics/react/setup',
  auth: 'https://docs.privy.io/authentication/overview',
  wallets: 'https://docs.privy.io/wallets/overview',
  chains: 'https://docs.privy.io/wallets/overview/chains',
  webhooks: 'https://docs.privy.io/api-reference/webhooks/transaction/confirmed',
  gas: 'https://docs.privy.io/wallets/gas-and-asset-management/gas/setup',
  npm: 'https://www.npmjs.com/package/@privy-io/react-auth',
};

const DYNAMIC = {
  pricing: 'https://www.dynamic.xyz/pricing',
  quickstart: 'https://www.dynamic.xyz/docs/react-sdk/quickstart',
  provider: 'https://www.dynamic.xyz/docs/react/reference/providers/dynamiccontextprovider',
  shares: 'https://www.dynamic.xyz/docs/embedded-wallets/mpc/how-shares-work',
  chains: 'https://www.dynamic.xyz/docs/embedded-wallets/chains/overview',
  events: 'https://www.dynamic.xyz/docs/embedded-wallets/on-chain-events',
  gas: 'https://www.dynamic.xyz/docs/embedded-wallets/gas-sponsorship',
  npm: 'https://www.npmjs.com/package/@dynamic-labs/sdk-react-core',
};

const THIRDWEB = {
  pricing: 'https://thirdweb.com/pricing',
  security: 'https://portal.thirdweb.com/connect/in-app-wallet/security',
  sdk: 'https://portal.thirdweb.com/typescript/v5/getting-started',
  github: 'https://github.com/thirdweb-dev/js',
  engine: 'https://github.com/thirdweb-dev/engine',
  transactions: 'https://portal.thirdweb.com/engine',
  solana: 'https://portal.thirdweb.com/wallets/solana',
};

const ALCHEMY = {
  pricing: 'https://www.alchemy.com/pricing',
  wallets: 'https://www.alchemy.com/docs/wallets',
  deprecated: 'https://www.alchemy.com/docs/wallets/account-kit-deprecated',
  callsStatus:
    'https://www.alchemy.com/docs/wallets/api-reference/smart-wallets/wallet-api-endpoints/wallet-api-endpoints/wallet-get-calls-status',
  webhooks: 'https://www.alchemy.com/docs/reference/notify-api-quickstart',
  chains: 'https://www.alchemy.com/docs/reference/node-supported-chains',
  github: 'https://github.com/alchemyplatform/aa-sdk',
};

const THE_GRAPH = {
  pricing: 'https://thegraph.com/studio-pricing/',
  networks: 'https://thegraph.com/docs/en/supported-networks/',
  node: 'https://github.com/graphprotocol/graph-node',
  tooling: 'https://github.com/graphprotocol/graph-tooling',
};

export const COMPETITORS: Product[] = [
  {
    id: 'rainbowkit',
    name: 'RainbowKit',
    segment: 'connectors',
    url: 'https://rainbowkit.com',
    summary: 'React connect modal for EVM apps, built on wagmi.',
    license: 'MIT',
    pricing: {
      text: 'Free (MIT). WalletConnect needs a free Reown project ID.',
      sourceUrl: RAINBOWKIT.install,
      checkedAt: CHECKED,
    },
    chooseWhen: 'Your app is EVM-only and you want a polished, well-known connect modal with the least setup.',
    tuwaDifference:
      'Satellite Connect keeps the connection in a headless store for EVM and Solana, and Pulsar follows every transaction to Success, Failed or Replaced, not only until the first confirmation.',
    facts: {
      'own-wallets': fact('yes', 'Wallets connect through wagmi connectors and WalletConnect.', RAINBOWKIT.install),
      'no-vendor-keys': fact('yes', 'No embedded wallets.', RAINBOWKIT.install),
      'no-vendor-accounts': fact('yes', 'A client-side library: no user records.', RAINBOWKIT.github),
      'oss-client': fact('yes', 'MIT.', RAINBOWKIT.github),
      'oss-backend': fact(
        'partial',
        'No backend of its own; WalletConnect sessions go through the Reown relay.',
        RAINBOWKIT.install,
      ),
      'no-vendor-key': fact(
        'no',
        'getDefaultConfig takes a projectId from WalletConnect Cloud (Reown).',
        RAINBOWKIT.install,
      ),
      'free-to-ship': fact('yes', 'MIT, free.', RAINBOWKIT.github),
      'no-mau-billing': fact('yes', 'No usage billing.', RAINBOWKIT.github),
      'free-self-host': fact('yes', 'The library has no server to host.', RAINBOWKIT.github),
      'tracks-to-final': fact(
        'partial',
        'Transactions the app registers are shown until confirmed; replacements are not documented.',
        RAINBOWKIT.transactions,
      ),
      'survives-reload': fact('yes', 'Recent transactions are kept in localStorage.', RAINBOWKIT.transactions),
      'status-webhooks': fact('no', 'Client-side only.', RAINBOWKIT.transactions),
      'email-social': fact('no', 'Not offered.', RAINBOWKIT.install),
      'embedded-wallets': fact('no', 'Not offered.', RAINBOWKIT.install),
      'gas-or-onramp': fact('no', 'Not offered.', RAINBOWKIT.install),
      evm: fact('yes', 'Built on wagmi.', RAINBOWKIT.install),
      solana: fact('no', 'EVM only.', RAINBOWKIT.install),
      'other-chains': fact('no', 'EVM only.', RAINBOWKIT.install),
    },
  },
  {
    id: 'connectkit',
    name: 'ConnectKit',
    segment: 'connectors',
    url: 'https://family.co/connectkit',
    summary: 'React connect modal for EVM apps by Family, built on wagmi, with optional Family Accounts.',
    license: 'BSD-2-Clause',
    pricing: {
      text: 'Free (BSD-2-Clause), Family Accounts included. WalletConnect needs a free Reown project ID.',
      sourceUrl: CONNECTKIT.family,
      checkedAt: CHECKED,
    },
    chooseWhen: 'You want a themeable EVM connect modal and email or phone sign-up through Family Accounts.',
    tuwaDifference:
      'TUWA never creates accounts for your users, covers Solana as well as EVM, and adds transaction tracking (Pulsar) and a backend you can self-host (Quasar).',
    facts: {
      'own-wallets': fact('yes', 'Wallets connect through wagmi connectors and WalletConnect.', CONNECTKIT.start),
      'no-vendor-keys': fact(
        'partial',
        "Family Accounts (on by default, off with enableFamily: false) are wallets on Family's infrastructure.",
        CONNECTKIT.family,
      ),
      'no-vendor-accounts': fact(
        'partial',
        'Users who sign up with Family Accounts get an account at Family.',
        CONNECTKIT.family,
      ),
      'oss-client': fact('yes', 'BSD-2-Clause.', CONNECTKIT.github),
      'oss-backend': fact(
        'partial',
        'No backend of its own; Family Accounts and WalletConnect run on Family and Reown servers.',
        CONNECTKIT.family,
      ),
      'no-vendor-key': fact('no', 'walletConnectProjectId is required.', CONNECTKIT.start),
      'free-to-ship': fact('yes', 'Free; the Family Accounts integration is free too.', CONNECTKIT.family),
      'no-mau-billing': fact('yes', 'No usage billing.', CONNECTKIT.github),
      'free-self-host': fact('yes', 'The library has no server to host.', CONNECTKIT.github),
      'tracks-to-final': fact('no', 'Not documented.', CONNECTKIT.start),
      'survives-reload': fact('no', 'Not documented.', CONNECTKIT.start),
      'status-webhooks': fact('no', 'Client-side only.', CONNECTKIT.start),
      'email-social': fact('yes', 'Email or phone sign-up through Family Accounts.', CONNECTKIT.family),
      'embedded-wallets': fact('yes', 'Family Accounts, secured by a passkey or password.', CONNECTKIT.family),
      'gas-or-onramp': fact('no', 'Not documented.', CONNECTKIT.family),
      evm: fact('yes', 'Built on wagmi.', CONNECTKIT.start),
      solana: fact('no', 'EVM only.', CONNECTKIT.start),
      'other-chains': fact('no', 'EVM only.', CONNECTKIT.start),
    },
  },
  {
    id: 'appkit',
    name: 'Reown AppKit',
    segment: 'connectors',
    url: 'https://reown.com/appkit',
    summary: 'Connect modal with email and social login, on-ramp and swaps, from the WalletConnect team.',
    license: 'Reown Community License',
    pricing: {
      text: 'Free up to 500 MAU and 2.5M RPC calls a month; Pro from $89/month (7,500 MAU), then $0.05 per MAU.',
      sourceUrl: APPKIT.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'You need email and social login, an on-ramp and Bitcoin from one vendor, and the Reown license terms fit your scale.',
    tuwaDifference:
      'TUWA is Apache-2.0 with no usage thresholds and no mandatory gateway, and it bills nothing per user.',
    facts: {
      'own-wallets': fact('yes', 'Extension and mobile wallets through WalletConnect.', APPKIT.overview),
      'no-vendor-keys': fact('no', 'Email and social wallets are created and secured by Magic.', APPKIT.socials),
      'no-vendor-accounts': fact(
        'no',
        'Email, social and SIWX users count as MAU on the Reown dashboard.',
        APPKIT.pricing,
      ),
      'oss-client': fact(
        'no',
        'Source-available under the Reown Community License, not an OSI license; modifications are assigned to Reown.',
        APPKIT.license,
      ),
      'oss-backend': fact(
        'no',
        "The license requires every use to connect to Reown's proprietary gateway.",
        APPKIT.license,
      ),
      'no-vendor-key': fact(
        'no',
        'projectId from the Reown Dashboard; the default ID of the CLI works only on localhost.',
        APPKIT.overview,
      ),
      'free-to-ship': fact('yes', 'Starter: free up to 500 MAU and 2.5M RPC calls a month.', APPKIT.pricing),
      'no-mau-billing': fact(
        'no',
        'Paid plans bill per MAU; the license requires a commercial license above 500 MAU or 2.5M RPC calls a month.',
        APPKIT.license,
      ),
      'free-self-host': fact('no', 'The Reown network is mandatory.', APPKIT.license),
      'tracks-to-final': fact('no', 'Not among the AppKit features.', APPKIT.overview),
      'survives-reload': fact('no', 'Not among the AppKit features.', APPKIT.overview),
      'status-webhooks': fact('no', 'Not among the AppKit features.', APPKIT.overview),
      'email-social': fact('yes', 'Email and social login.', APPKIT.overview),
      'embedded-wallets': fact('yes', 'Universal Wallets by Magic.', APPKIT.socials),
      'gas-or-onramp': fact('yes', 'On-ramp, and swaps on EVM.', APPKIT.overview),
      evm: fact('yes', 'EVM chains.', APPKIT.overview),
      solana: fact('yes', 'Solana.', APPKIT.overview),
      'other-chains': fact('yes', 'Bitcoin.', APPKIT.overview),
    },
  },
  {
    id: 'privy',
    name: 'Privy',
    segment: 'embedded',
    url: 'https://www.privy.io',
    summary: 'Embedded wallets and user authentication as a managed service.',
    license: 'Apache-2.0 SDK, managed service',
    pricing: {
      text: 'Free up to 499 MAU; Scale $299/month (500–2,499 MAU); above 10,000 MAU $2,000 + $0.05 per MAU.',
      sourceUrl: PRIVY.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'Most of your users have no wallet, and you want email and social login, embedded wallets, gas sponsorship and many chains, managed for you.',
    tuwaDifference:
      'TUWA keeps users on their own wallets and your sessions on your server (SIWX, CAIP-122), with no per-user bill and nothing to trust but the chain.',
    facts: {
      'own-wallets': fact('yes', 'Ethereum and Solana wallets can log in alongside embedded wallets.', PRIVY.auth),
      'no-vendor-keys': fact('no', "Embedded wallets are secured by TEEs on Privy's infrastructure.", PRIVY.wallets),
      'no-vendor-accounts': fact('no', 'Every user is a Privy user, billed as MAU.', PRIVY.pricing),
      'oss-client': fact(
        'yes',
        '@privy-io/react-auth is published under Apache-2.0, without a public repository.',
        PRIVY.npm,
      ),
      'oss-backend': fact('no', 'Managed service only.', PRIVY.wallets),
      'no-vendor-key': fact('no', 'appId from the Privy Dashboard is required.', PRIVY.setup),
      'free-to-ship': fact('yes', 'Free up to 499 MAU.', PRIVY.pricing),
      'no-mau-billing': fact('no', '$299/month from 500 MAU; $0.05 per MAU above 10,000.', PRIVY.pricing),
      'free-self-host': fact('no', 'Managed service only.', PRIVY.wallets),
      'tracks-to-final': fact(
        'partial',
        'transaction.broadcasted and transaction.confirmed events for transactions of Privy wallets.',
        PRIVY.webhooks,
      ),
      'survives-reload': fact('no', 'Not documented.', PRIVY.wallets),
      'status-webhooks': fact(
        'partial',
        'For Privy wallets; the pricing page lists webhooks with the Enterprise plan.',
        PRIVY.webhooks,
      ),
      'email-social': fact('yes', 'Email, SMS, passkey, social and any OAuth login.', PRIVY.auth),
      'embedded-wallets': fact('yes', 'Embedded wallets for every user.', PRIVY.wallets),
      'gas-or-onramp': fact('yes', 'Gas sponsorship through a paymaster, and card or bank on-ramps.', PRIVY.gas),
      evm: fact('yes', 'Ethereum and EVM networks.', PRIVY.chains),
      solana: fact('yes', 'Solana and SVM networks.', PRIVY.chains),
      'other-chains': fact(
        'yes',
        'Bitcoin, Cosmos, TON, Sui, Tron and more, at different support tiers.',
        PRIVY.chains,
      ),
    },
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    segment: 'embedded',
    url: 'https://www.dynamic.xyz',
    summary: 'Authentication and MPC embedded wallets as a managed service.',
    license: 'MIT SDK, managed service',
    pricing: {
      text: 'Free up to 1,000 MAU, then $0.05 per MAU; $249/month up to 5,000 MAU.',
      sourceUrl: DYNAMIC.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'You need embedded wallets on the widest list of chains, with enterprise policies and delegated access, managed for you.',
    tuwaDifference:
      'TUWA never holds a key share: users sign with their own wallets, sessions stay on your server, and nothing is billed per user.',
    facts: {
      'own-wallets': fact('yes', 'Users can sign in by connecting a wallet.', DYNAMIC.quickstart),
      'no-vendor-keys': fact(
        'no',
        'TSS-MPC wallets: Dynamic holds the server share and coordinates signing.',
        DYNAMIC.shares,
      ),
      'no-vendor-accounts': fact('no', 'Every user is a Dynamic user, billed as MAU.', DYNAMIC.pricing),
      'oss-client': fact(
        'yes',
        '@dynamic-labs/sdk-react-core is published under MIT, without a public repository.',
        DYNAMIC.npm,
      ),
      'oss-backend': fact('no', 'Managed service only.', DYNAMIC.shares),
      'no-vendor-key': fact('no', 'environmentId from the dashboard is required.', DYNAMIC.provider),
      'free-to-ship': fact('yes', 'Free up to 1,000 MAU.', DYNAMIC.pricing),
      'no-mau-billing': fact('no', '$0.05 per MAU above 1,000.', DYNAMIC.pricing),
      'free-self-host': fact('no', 'Managed service only.', DYNAMIC.shares),
      'tracks-to-final': fact(
        'partial',
        'wallet.activity reports confirmed activity of embedded wallets.',
        DYNAMIC.events,
      ),
      'survives-reload': fact('no', 'Not documented.', DYNAMIC.quickstart),
      'status-webhooks': fact('partial', 'wallet.activity webhooks, for embedded wallets.', DYNAMIC.events),
      'email-social': fact('yes', 'Email, SMS, social and passkey sign-up.', DYNAMIC.quickstart),
      'embedded-wallets': fact('yes', 'MPC embedded wallets.', DYNAMIC.shares),
      'gas-or-onramp': fact('yes', 'Gas sponsorship for embedded wallets.', DYNAMIC.gas),
      evm: fact('yes', 'All EVM networks.', DYNAMIC.chains),
      solana: fact('yes', 'Solana.', DYNAMIC.chains),
      'other-chains': fact('yes', 'Bitcoin, Sui, TON, Stellar, Tron and more.', DYNAMIC.chains),
    },
  },
  {
    id: 'thirdweb',
    name: 'thirdweb',
    segment: 'platforms',
    url: 'https://thirdweb.com',
    summary: 'All-in-one platform: in-app wallets, transactions API, RPC, gas sponsorship and contracts.',
    license: 'Apache-2.0 SDK, cloud backend',
    pricing: {
      text: 'Plans from $99/month; user wallets $0.015 per MAU after the first 1,000; 2.5% surcharge on sponsored mainnet gas.',
      sourceUrl: THIRDWEB.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'You want one vendor for in-app wallets, server wallets, gas sponsorship, RPC and contract deployment, and the subscription fits your budget.',
    tuwaDifference:
      'Pulsar tracks transactions from any wallet in the browser, and Quasar adds history and webhooks as a cloud or as the Apache-2.0 Community Edition.',
    facts: {
      'own-wallets': fact('yes', 'External wallets alongside in-app wallets.', THIRDWEB.sdk),
      'no-vendor-keys': fact(
        'no',
        'In-app wallets are generated and used inside AWS Nitro Enclaves run by thirdweb.',
        THIRDWEB.security,
      ),
      'no-vendor-accounts': fact('no', 'In-app wallet users are billed per MAU.', THIRDWEB.pricing),
      'oss-client': fact('yes', 'Apache-2.0.', THIRDWEB.github),
      'oss-backend': fact(
        'no',
        'The self-hostable Engine v2 (Apache-2.0) is archived; Transactions runs on thirdweb Cloud.',
        THIRDWEB.engine,
      ),
      'no-vendor-key': fact('no', 'A client ID in the browser and a secret key on the server.', THIRDWEB.sdk),
      'free-to-ship': fact('no', 'Plans start at $99/month.', THIRDWEB.pricing),
      'no-mau-billing': fact('no', '$0.015 per user-wallet MAU after the first 1,000.', THIRDWEB.pricing),
      'free-self-host': fact('no', 'Engine v2 is archived.', THIRDWEB.engine),
      'tracks-to-final': fact(
        'partial',
        "Transactions sent through thirdweb's Transactions API, with timelines.",
        THIRDWEB.transactions,
      ),
      'survives-reload': fact('no', 'Not documented.', THIRDWEB.sdk),
      'status-webhooks': fact('yes', '1,000 deliveries included, then $0.10 per 1,000.', THIRDWEB.pricing),
      'email-social': fact('yes', 'Email, phone and social sign-in.', THIRDWEB.security),
      'embedded-wallets': fact('yes', 'In-app wallets.', THIRDWEB.security),
      'gas-or-onramp': fact('yes', 'Gas sponsorship.', THIRDWEB.pricing),
      evm: fact('yes', '2,500+ EVM chains.', THIRDWEB.pricing),
      solana: fact('yes', 'Solana server wallets and API.', THIRDWEB.solana),
      'other-chains': fact('no', 'Not documented.', THIRDWEB.pricing),
    },
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    segment: 'platforms',
    url: 'https://www.alchemy.com',
    summary: 'RPC and data platform with Wallet APIs for smart wallets and gas sponsorship.',
    license: 'MIT SDK, cloud backend',
    pricing: {
      text: 'Free: 30M compute units a month; pay as you go from $0.525 per 1M compute units.',
      sourceUrl: ALCHEMY.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'You already run on Alchemy RPC and need gas sponsorship and smart wallets (EIP-7702) on EVM and Solana.',
    tuwaDifference:
      'Pulsar follows any transaction, not only the calls sent through one API, keeps pending ones across reloads, and Quasar can run on your own servers.',
    facts: {
      'own-wallets': fact(
        'yes',
        'Wallet APIs work with any embedded wallet or key management solution.',
        ALCHEMY.wallets,
      ),
      'no-vendor-keys': fact(
        'yes',
        "Alchemy's own signer (Account Kit) is deprecated; keys come from your signer provider.",
        ALCHEMY.deprecated,
      ),
      'no-vendor-accounts': fact(
        'yes',
        'Login moved to signer providers; Wallet APIs work with addresses.',
        ALCHEMY.deprecated,
      ),
      'oss-client': fact('yes', 'aa-sdk: MIT.', ALCHEMY.github),
      'oss-backend': fact('no', 'RPC, bundler and paymaster are proprietary services.', ALCHEMY.wallets),
      'no-vendor-key': fact('no', 'An API key in every request URL.', ALCHEMY.callsStatus),
      'free-to-ship': fact('yes', 'Free: 30M compute units a month.', ALCHEMY.pricing),
      'no-mau-billing': fact('yes', 'Billed by compute units, not by users.', ALCHEMY.pricing),
      'free-self-host': fact('no', 'Cloud only.', ALCHEMY.pricing),
      'tracks-to-final': fact(
        'partial',
        'wallet_getCallsStatus, for calls sent through Wallet APIs.',
        ALCHEMY.callsStatus,
      ),
      'survives-reload': fact('no', 'Not documented.', ALCHEMY.wallets),
      'status-webhooks': fact(
        'partial',
        'Address Activity and Custom webhooks report on-chain activity, not the status of a sent transaction.',
        ALCHEMY.webhooks,
      ),
      'email-social': fact('no', 'Account Kit login is deprecated; Alchemy recommends Privy.', ALCHEMY.deprecated),
      'embedded-wallets': fact(
        'no',
        'Account Kit embedded wallets are deprecated; Alchemy recommends Privy.',
        ALCHEMY.deprecated,
      ),
      'gas-or-onramp': fact('yes', 'Gas sponsorship on EVM, fee and rent sponsorship on Solana.', ALCHEMY.wallets),
      evm: fact('yes', 'EVM networks.', ALCHEMY.chains),
      solana: fact('yes', 'Solana.', ALCHEMY.chains),
      'other-chains': fact('yes', 'Bitcoin, Sui, Aptos and more through Chain APIs.', ALCHEMY.chains),
    },
  },
  {
    id: 'the-graph',
    name: 'The Graph',
    segment: 'indexing',
    url: 'https://thegraph.com',
    summary: 'Decentralized protocol that indexes contract events into GraphQL APIs (subgraphs).',
    license: 'Apache-2.0 / MIT',
    pricing: {
      text: '100,000 free queries a month, then $2 per 100,000; a self-hosted Graph Node is free.',
      sourceUrl: THE_GRAPH.pricing,
      checkedAt: CHECKED,
    },
    chooseWhen:
      'You need to query contract events and state across all users. That is indexing, a different job from tracking what your app sends; many apps use both.',
    tuwaDifference:
      'Quasar does not index contracts: it follows the transactions your users send from your app and keeps their history per wallet, with webhooks.',
    facts: {
      'own-wallets': fact('no', 'An indexer: it does not connect wallets.', THE_GRAPH.networks),
      'no-vendor-keys': fact('yes', 'Handles no user keys.', THE_GRAPH.node),
      'no-vendor-accounts': fact('yes', 'Keeps no records of your users.', THE_GRAPH.node),
      'oss-client': fact('yes', 'graph-cli and graph-ts: Apache-2.0 or MIT.', THE_GRAPH.tooling),
      'oss-backend': fact('yes', 'Graph Node: Apache-2.0, self-hostable.', THE_GRAPH.node),
      'no-vendor-key': fact(
        'yes',
        'A self-hosted Graph Node needs no key; the network takes an API key from Subgraph Studio.',
        THE_GRAPH.node,
      ),
      'free-to-ship': fact('yes', '100,000 free queries a month.', THE_GRAPH.pricing),
      'no-mau-billing': fact('yes', 'Billed per query.', THE_GRAPH.pricing),
      'free-self-host': fact('yes', 'Graph Node is open source.', THE_GRAPH.node),
      'tracks-to-final': fact(
        'no',
        'Indexes contract events, not the transactions your app sends.',
        THE_GRAPH.networks,
      ),
      'survives-reload': fact('no', 'Not a client-side tool.', THE_GRAPH.networks),
      'status-webhooks': fact('no', 'Serves queries; no transaction status webhooks.', THE_GRAPH.networks),
      'email-social': fact('no', 'Not its job.', THE_GRAPH.networks),
      'embedded-wallets': fact('no', 'Not its job.', THE_GRAPH.networks),
      'gas-or-onramp': fact('no', 'Not its job.', THE_GRAPH.networks),
      evm: fact('yes', 'Ethereum and many EVM networks.', THE_GRAPH.networks),
      solana: fact('yes', 'Solana.', THE_GRAPH.networks),
      'other-chains': fact('yes', 'Bitcoin, NEAR, Starknet, Stellar, TRON and more.', THE_GRAPH.networks),
    },
  },
];

export const PRODUCTS: Product[] = [TUWA, ...COMPETITORS];

const MARK_VALUE: Record<Mark, number> = { yes: 1, partial: 0.5, no: 0 };

/**
 * Score of a product on an axis: the share of the axis criteria it meets, a partial one counting half.
 *
 * @param product - The product.
 * @param axis - The axis.
 * @returns A score from 0 to 100, rounded.
 */
export function axisScore(product: Product, axis: AxisId): number {
  const criteria = CRITERIA.filter((criterion) => criterion.axis === axis);
  const total = criteria.reduce((sum, criterion) => sum + MARK_VALUE[product.facts[criterion.id]?.mark ?? 'no'], 0);
  return Math.round((total / criteria.length) * 100);
}

/** Scores of a product on every axis, in the order of `AXES` */
export function productScores(product: Product): number[] {
  return AXES.map((axis) => axisScore(product, axis.id));
}

/** The oldest `checkedAt` of all facts and prices: the date the whole comparison is verified as of */
export function verifiedAsOf(): string {
  const dates = PRODUCTS.flatMap((product) => [
    product.pricing.checkedAt,
    ...Object.values(product.facts).map((item) => item.checkedAt),
  ]);
  return dates.sort()[0];
}

/** Every distinct source URL, numbered in the order they first appear (product by product, criterion by criterion) */
export function sourceIndex(): Map<string, number> {
  const index = new Map<string, number>();
  for (const product of PRODUCTS) {
    for (const criterion of CRITERIA) {
      const url = product.facts[criterion.id]?.sourceUrl;
      if (url && !index.has(url)) index.set(url, index.size + 1);
    }
    if (!index.has(product.pricing.sourceUrl)) index.set(product.pricing.sourceUrl, index.size + 1);
  }
  return index;
}

/** Formats an ISO date as `October 1, 2026` */
export function formatCheckDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
