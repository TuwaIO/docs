import { docsLabels } from '@tuwaio/docs-ui';

import type { DocsHubLabels } from '../types';

/**
 * English localization dictionary for the TUWA Documentation Hub.
 */
export const en: DocsHubLabels = {
  nav: {
    mainScreen: 'Main Screen',
    guides: 'Guides',
    quasar: 'Quasar',
    comparisons: 'Comparisons',
    configurator: 'Configurator',
    playground: 'Playground',
    theme: 'Theme',
    language: 'Language',
    selectLanguage: docsLabels.en.selectLanguage,
    toggleTheme: 'Toggle theme',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    mobileNavAria: 'Documentation sections',
  },
  // The interface texts of every TUWA documentation site (@tuwaio/docs-ui)
  footer: docsLabels.en.footer,
  common: {
    packageManager: 'Package manager',
    copy: 'Copy',
    copied: 'Copied',
    copyCommand: 'Copy the command',
    copyCode: 'Copy the code',
    close: 'Close',
    yes: 'Yes',
    partial: 'Partial',
    no: 'No',
  },
  home: {
    hero: {
      badge: 'Interactive Web3 Documentation',
      titlePrefix: 'TUWA',
      titleHighlight: 'Docs',
      description:
        'Open-source TypeScript packages for EVM and Solana: wallet connection, CAIP-122 sign-in and transaction tracking, with optional React components and a cloud or self-hosted backend.',
      searchAria: 'Search all TUWA documentation',
      searchButton: 'Search all documentation…',
      explorePackages: 'Explore Packages',
      tryPlayground: 'Try in the Playground',
    },
    timeline: {
      titlePrefix: 'Ecosystem',
      titleHighlight: 'Architecture',
      subtitle:
        'Every stage builds on the one before it. Pick the whole stack with @tuwaio/sdk or install a single package.',
      stages: {
        1: {
          label: 'Stage 1 — Core Auth & Primitives',
          subtitle: 'Chain-agnostic CAIP-122 auth & multi-chain primitives',
        },
        2: {
          label: 'Stage 2 — State & Connection',
          subtitle: 'Transaction tracking & wallet connectivity',
        },
        3: {
          label: 'Stage 3 — Backend & Sync',
          subtitle: 'Managed cloud or self-hosted Quasar engine',
        },
        4: {
          label: 'Stage 4 — User Interface',
          subtitle: 'React components for Satellite & Pulsar',
        },
        5: {
          label: 'Stage 5 — SDK Integration Layer',
          subtitle: 'Core SDK & network-specific adapters',
        },
      },
    },
    entries: {
      siwx: {
        tagline: 'CAIP-122 authentication engine & adapters',
      },
      orbit: {
        tagline: 'Multi-chain utilities for EVM & Solana',
      },
      satellite: {
        tagline: 'Headless wallet connection store for EVM & Solana',
      },
      pulsar: {
        tagline: 'Transaction tracking that survives reloads',
      },
      quasar: {
        tagline: 'Managed cloud · Transaction indexing & sync',
      },
      'quasar-community': {
        tagline: 'Self-hosted engine & admin · Apache-2.0',
      },
      nova: {
        tagline: 'Design system & component library',
      },
      sdk: {
        tagline: 'Unified client SDK & EVM/Solana network adapters',
      },
    },
    docCard: {
      cloudAndSelfHosted: 'Cloud & self-hosted',
      onePackage: '1 package',
      packagesCount: '{count} packages',
      readDocs: 'Read Docs',
      tryLiveAdmin: 'Try Live Admin',
      showPackages: 'Show packages of {title}',
      hidePackages: 'Hide packages of {title}',
    },
    packagePreview: {
      installLabel: 'Install {name}',
      copyInstallTitle: 'Copy install command for {name}',
      peerDepsTitle: 'Details and peer dependencies of {name}',
      deprecated: 'deprecated',
      standalone: 'Standalone',
      peersCount: '+{count} peer',
      peersCountPlural: '+{count} peers',
      lighterInstallPrefix: 'Only need {scope}? Install',
      lighterInstallConjunction: 'or',
    },
    packageDialog: {
      deprecatedPrefix: 'Deprecated:',
      install: 'Install',
      copyInstallTitle: 'Copy the install command',
      peersHint:
        'Required peer dependencies are included. Packages already in your project will be updated only if needed.',
      lighterEntryHeading: 'Only need one part?',
      guidesHeading: 'Guides',
      dependenciesHeading: 'Dependencies',
      includedWith: 'Included with',
      peerDependenciesHeading: 'Peer dependencies',
      noRuntimeDeps: 'No runtime or peer dependencies — runs anywhere TypeScript runs.',
      optional: 'optional',
      viewOnNpm: 'View on npm',
      packageDescriptions: {
        '@tuwaio/evm-sdk':
          'L9 EVM add-on of the TUWA SDK: re-exports the EVM packages of Orbit Utils, SIWX, Satellite Connect, Pulsar and Nova Connect under subpaths.',
        '@tuwaio/nova-connect':
          'L7 wallet connection package of Nova UI Kit (TUWA): connect button, connect and account modals, chain selector and SIWX sign-in for EVM and Solana wallets, with English, Ukrainian and Chinese labels, built on @tuwaio/satellite-react.',
        '@tuwaio/nova-core':
          'L6 core of Nova UI Kit (TUWA): the --tuwa-* theme variables, the dialog, network and wallet icons, and the hooks and helpers shared by the Nova components.',
        '@tuwaio/nova-transactions':
          'L7 transactions package of Nova UI Kit (TUWA): toasts, a tracking modal with speed-up and cancel, and the transaction history for transactions tracked by Pulsar.',
        '@tuwaio/orbit-core':
          'L1 core of Orbit Utils (TUWA): zero-dependency, framework-agnostic multi-chain types, CAIP-2, CAIP-10 and CAIP-19 helpers, connector and address helpers, error normalization and SSR-safe connection persistence.',
        '@tuwaio/orbit-evm':
          'L2 EVM package of Orbit Utils (TUWA): cached viem clients, chain switching, ENS resolution and ERC-4337 smart accounts (Solady with a Pimlico bundler and paymaster), built on viem and @wagmi/core.',
        '@tuwaio/orbit-solana':
          'L2 Solana package of Orbit Utils (TUWA): cached @solana/kit RPC clients, Wallet Standard discovery, cluster and explorer helpers, and SNS name and avatar lookups.',
        '@tuwaio/pulsar-core':
          'L3 core of Pulsar (TUWA): headless, framework-agnostic transaction store with localStorage persistence, a chain adapter contract, metadata validation and remote sync hooks for tracking EVM and Solana transactions.',
        '@tuwaio/pulsar-evm':
          'L4 EVM package of Pulsar (TUWA): transaction adapter and trackers for standard transactions, ERC-4337 UserOperations, Safe multisig and Gelato relay, with speed-up and cancel actions, built on viem and @wagmi/core.',
        '@tuwaio/pulsar-react':
          'L4 React package of Pulsar (TUWA): useInitializeTransactionsPool resumes tracking of pending transactions after a page reload, and useTxFinished reacts to every finished transaction.',
        '@tuwaio/pulsar-solana':
          'L4 Solana package of Pulsar (TUWA): transaction adapter for Wallet Standard wallets, a signature tracker and a sign-and-send helper, built on @solana/kit.',
        '@tuwaio/quasar-sdk':
          'L5 client of Quasar (TUWA): the Quasar API client for Quasar Cloud and self-hosted Quasar nodes (transaction sync and history for Pulsar), and the quasar-sdk CLI that relays webhooks to localhost.',
        '@tuwaio/satellite-core':
          'L3 core of Satellite Connect (TUWA): headless, framework-agnostic Zustand store for EVM and Solana wallet connections, with a chain adapter contract, auto-connect of the last wallet and the SIWX state type.',
        '@tuwaio/satellite-evm':
          'L4 EVM package of Satellite Connect (TUWA): wallet adapter and connections watcher for wagmi connectors, a contract account check and wagmi config helpers, built on @wagmi/core and viem.',
        '@tuwaio/satellite-react':
          'L4 React package of Satellite Connect (TUWA): provider, store hook and EVM and Solana watcher components that keep wallet connections in sync with wallets and SIWX sessions.',
        '@tuwaio/satellite-siwe-next-auth':
          'Layer 4 (L4) of the TUWA Ecosystem. Legacy server-side session authentication adapter for Next.js applications. Replaced by the modern SIWX multi-chain stack.',
        '@tuwaio/satellite-solana':
          'L4 Solana package of Satellite Connect (TUWA): Wallet Standard adapter, connections watcher and message signer for Solana wallets, built on @solana/kit.',
        '@tuwaio/sdk':
          'L8 core of the TUWA SDK: one package for React apps that re-exports Orbit Utils, SIWX, Satellite Connect, Pulsar and Nova UI Kit under subpaths, with their stylesheets. Add @tuwaio/evm-sdk or @tuwaio/solana-sdk for the network.',
        '@tuwaio/siwx-core':
          'L1 core of SIWX (TUWA): CAIP-122 sign-in message builder, parser and validator with verification policies, session matching, nonces and typed errors for EVM and Solana.',
        '@tuwaio/siwx-evm':
          'L2 EVM package of SIWX (TUWA): CAIP-122 signer for wagmi and viem wallets, and EIP-191 (EOA), EIP-1271 (smart contract wallet) and ERC-6492 (not yet deployed smart wallet) verification on the chain of the message, built on viem and @wagmi/core.',
        '@tuwaio/siwx-react':
          'L2 React package of SIWX (TUWA): useSiwx and useSiwxSession hooks with a Zustand session store for the CAIP-122 sign-in flow, plus Satellite Connect helpers.',
        '@tuwaio/siwx-server':
          'L2 server package of SIWX (TUWA): backend verification of CAIP-122 sign-ins for EVM and Solana, single-use nonce and session stores, HttpOnly cookie helpers, Next.js App Router handlers, and JWT/JWKS for external auth providers.',
        '@tuwaio/siwx-solana':
          'L2 Solana package of SIWX (TUWA): CAIP-122 signer for Wallet Standard and @solana/kit wallets, and ed25519 signature verification with Web Crypto, built on @solana/kit.',
        '@tuwaio/solana-sdk':
          'L9 Solana add-on of the TUWA SDK: re-exports the Solana packages of Orbit Utils, SIWX, Satellite Connect, Pulsar and Nova Connect under subpaths.',
      },
      packageDeprecations: {
        '@tuwaio/satellite-siwe-next-auth': 'Use @tuwaio/siwx-react and @tuwaio/siwx-server instead.',
      },
      lighterDescriptions: {
        '@tuwaio/sdk':
          '@tuwaio/sdk bundles every TUWA project for React, including Nova UI Kit. If you only need wallet connection, transaction tracking or sign-in without the rest, install its packages directly:',
        '@tuwaio/evm-sdk':
          '@tuwaio/evm-sdk pairs with @tuwaio/sdk. If you are not using @tuwaio/sdk, install the EVM package of the layer you need directly:',
        '@tuwaio/solana-sdk':
          '@tuwaio/solana-sdk pairs with @tuwaio/sdk. If you are not using @tuwaio/sdk, install the Solana package of the layer you need directly:',
      },
    },
    quickStart: {
      titlePrefix: 'Start Building in',
      titleHighlight: 'Minutes',
      subtitle: 'Pick the packages that fit your app, build a complete React dApp, or run Quasar on your own server.',
      cards: {
        choosePackages: {
          title: 'Choose Your Packages',
          description:
            'Decide between @tuwaio/sdk and individual packages for wallet connection, SIWX sign-in, transaction tracking and Nova UI.',
          cta: 'Pick Your Stack',
        },
        fullStackReact: {
          title: 'Full-Stack React App',
          description:
            'Connect wallets, sign in with SIWX, track transactions with Pulsar and sync to Quasar in one Next.js app for EVM or Solana.',
          cta: 'Build the App',
        },
        selfHostQuasar: {
          title: 'Self-Host Quasar',
          description:
            'Run Quasar Community Edition (Apache-2.0) on your own server with Docker Compose: PostgreSQL, Redis, tracking workers and webhooks.',
          cta: 'Deploy a Node',
        },
      },
      allGuidesPrefix: 'Looking for SIWX sign-in, transaction tracking or Quasar sync on its own?',
      browseAllGuides: 'Browse all guides',
      aiBanner: {
        badge: 'AI Assistants',
        title: 'Building with Claude Code, Cursor or Windsurf?',
        description:
          'Give your coding agent TUWA_AGENTS.md: one file with the imports, store wiring, SIWX routes and Quasar sync rules across every TUWA package.',
        copyUrl: 'Copy URL',
        copied: 'Copied',
        copyTitle: 'Copy the raw TUWA_AGENTS.md URL',
        viewOnGithub: 'View on GitHub',
      },
    },
    compactConfigurator: {
      badge: 'Interactive',
      title: 'Configure Your Stack',
      description: 'Pick your framework, chains and features to get the install command and the setup files.',
      openWithFiles: 'Open with all {count} setup files',
      install: 'Install',
      filesGenerated: 'Files generated for this stack ({count})',
      viewCode: 'View code',
    },
  },
  comparisons: {
    badge: 'Interactive Comparison',
    titlePrefix: 'TUWA and the',
    titleHighlight: 'Alternatives',
    description:
      'TUWA spans wallet connection, sign-in, transaction tracking and a backend. No single tool covers the same slice, so this page compares TUWA with the tools you would otherwise combine — including the axes where hosted platforms are stronger by design.',
    verifiedPrefix: 'Every score is calculated from the criteria below, each linked to its source. Last verified:',
    methodologyLink: 'Read the methodology ↓',
    radar: {
      sectionTitle: 'Radar Comparison',
      sectionDescription:
        'Pick up to three products to compare with TUWA across six axes. Each axis score is the share of its three criteria that the product meets in the table below (a partial mark counts half).',
      compareLabel: 'Compare with TUWA (up to {max})',
      chartLabel: 'Radar comparison of TUWA and the selected products across the six axes',
      axisColumn: 'Axis',
      favorsHostedNote:
        '* Hosted wallet and RPC platforms score higher on Onboarding and Chain Coverage by design: TUWA connects the wallets users already have and focuses on EVM and Solana.',
    },
    matrix: {
      sectionTitle: 'Criteria & Sources',
      sectionDescription:
        'Every cell is a yes, partial or no with a note and a numbered link to the documentation, pricing page or license that supports it.',
      allAxes: 'All axes ({count})',
      criterionColumn: 'Criterion',
      licenseRow: 'License',
      pricingRow: 'Pricing',
      sourceLabel: 'source',
    },
    chooseInstead: {
      sectionTitle: 'When to Choose Another Tool',
      sectionDescription:
        'Each competitor solves a real problem. Here is when it is a better fit than TUWA, and how TUWA differs.',
      vsTuwa: 'vs TUWA:',
      pickWhen: 'Pick {name} when',
      howTuwaDiffers: 'How TUWA differs',
    },
    methodology: {
      sectionTitle: 'Methodology & Corrections',
      howScoresWorkTitle: 'How Scores Work',
      howScoresWorkP1:
        'Each of the six radar axes has three criteria. A product gets 1 point for Yes, 0.5 for Partial and 0 for No; the axis score is the sum divided by 3, in percent.',
      howScoresWorkP2:
        'Partial means the feature covers only part of the product: for example, transaction events only for the vendor’s own embedded wallets, or a client library without a backend of its own that still routes through a hosted relay.',
      whyOnboardingTitle: 'Why TUWA Scores 0% on Onboarding',
      whyOnboardingP1:
        'Two of the six axes — Onboarding and Chain Coverage — favor hosted wallet and RPC platforms. That is intentional: a comparison where TUWA won every axis would not help you choose.',
      whyOnboardingP2:
        'TUWA is built for self-custodial apps where users bring their own EVM or Solana wallets. If your users do not have wallets yet, Privy, Dynamic, Reown AppKit or thirdweb are built for that job.',
      reportErrorTitle: 'Report an Error',
      reportErrorP1:
        'Competitors ship new features and change pricing often. Every fact in the table links to the page it was checked against; if a cell is outdated or inaccurate, open an issue and we will update it.',
      openIssue: 'Open an issue with the source link',
      transparencyTitle: 'Transparency note.',
      transparencyText:
        'This page is written and maintained by the TUWA team. Product names are trademarks of their respective owners.',
    },
    cta: {
      configureStack: 'Configure Your Stack',
      readOverview: 'Read the Overview',
    },
    segments: {
      connectors: { label: 'Wallet Connection UI' },
      embedded: { label: 'Embedded Wallets & Auth' },
      platforms: { label: 'Wallet & Transaction Platforms' },
      indexing: { label: 'Indexing' },
    },
    axes: {
      custody: { label: 'Self-Custody', question: 'Do keys and user records stay with users and with you?' },
      openness: { label: 'Openness', question: 'Can you read, fork and run every part without the vendor?' },
      cost: { label: 'Cost at Scale', question: 'Does the bill stay flat as your user base grows?' },
      lifecycle: { label: 'Tx Lifecycle', question: 'Is every transaction your app sends followed to a final state?' },
      onboarding: { label: 'Onboarding', question: 'Can users without a wallet sign in and transact?' },
      chains: { label: 'Chain Coverage', question: 'How many chain families does it reach?' },
    },
    criteria: {
      'own-wallets': {
        label: 'Users sign with their own wallets',
        description: 'Extension, mobile and hardware wallets connect through standard protocols.',
      },
      'no-vendor-keys': {
        label: 'No vendor-run key management',
        description:
          "The product creates no wallets whose keys live in the vendor's MPC, TEE or enclave infrastructure.",
      },
      'no-vendor-accounts': {
        label: 'User records stay with you',
        description: 'The vendor keeps no account for each of your users.',
      },
      'oss-client': {
        label: 'Client under an OSI license',
        description: 'The SDK in your app is published under an OSI-approved open-source license.',
      },
      'oss-backend': {
        label: 'Backend open source, or none needed',
        description: 'Every server the product relies on is open source and self-hostable, or it relies on none.',
      },
      'no-vendor-key': {
        label: 'Runs without a vendor key',
        description: "A production setup needs no project ID, app ID or API key from the vendor's dashboard.",
      },
      'free-to-ship': {
        label: 'Free to ship',
        description: 'A production app can launch without a paid plan.',
      },
      'no-mau-billing': {
        label: 'No per-user billing',
        description: 'The bill does not grow with monthly active users or wallets.',
      },
      'free-self-host': {
        label: 'Free self-hosted path',
        description: 'The whole product runs in production on your own servers without license fees.',
      },
      'tracks-to-final': {
        label: 'Tracks transactions to a final state',
        description: 'A transaction the app sends is followed until it succeeds, fails or is replaced.',
      },
      'survives-reload': {
        label: 'Pending transactions survive a reload',
        description: 'Tracking resumes after the page reloads.',
      },
      'status-webhooks': {
        label: 'Status webhooks',
        description: 'Your server is notified when a transaction changes status.',
      },
      'email-social': {
        label: 'Email or social login',
        description: 'Users can sign in with an email, phone or social account.',
      },
      'embedded-wallets': {
        label: 'Wallets for users without one',
        description: 'New users get a wallet without installing one.',
      },
      'gas-or-onramp': {
        label: 'Gas sponsorship or on-ramp',
        description: 'The app can pay gas for users, or users can buy crypto in the flow.',
      },
      evm: {
        label: 'EVM networks',
        description: 'Ethereum and EVM-compatible networks.',
      },
      solana: {
        label: 'Solana',
        description: 'Solana mainnet and devnet.',
      },
      'other-chains': {
        label: 'Other chain families',
        description: 'At least one family beyond EVM and Solana, such as Bitcoin, Sui or TON.',
      },
    },
    products: {
      tuwa: {
        summary: 'Headless, open-source packages for sign-in, wallet connection and transaction tracking, plus Quasar.',
        license: 'Apache-2.0',
        pricingText:
          'Client packages free. Quasar Cloud: free public beta, 1,000 free quota units per organization. Community Edition: free.',
        chooseWhen: '',
        tuwaDifference: '',
        facts: {
          'own-wallets':
            'EIP-6963 wallets through wagmi, Wallet Standard wallets on Solana, WalletConnect and Safe{Wallet}.',
          'no-vendor-keys': 'TUWA creates no wallets and never handles keys.',
          'no-vendor-accounts':
            'Sessions live on your server (siwx-server). Quasar Cloud stores the transactions your app syncs; the Community Edition keeps them on your servers.',
          'oss-client': 'Apache-2.0.',
          'oss-backend': 'Quasar Community Edition is Apache-2.0 and runs with Docker Compose.',
          'no-vendor-key':
            'Only WalletConnect, if you enable it, needs a free Reown project ID. A self-hosted Quasar needs no TUWA key.',
          'free-to-ship':
            'The client packages are free; Quasar Cloud is free during its public beta, with 1,000 free quota units per organization.',
          'no-mau-billing': 'Quasar Cloud counts quota units per tracked transaction and webhook delivery, not users.',
          'free-self-host': 'Community Edition: free, Apache-2.0.',
          'tracks-to-final':
            'Pulsar follows EVM transactions (standard, ERC-4337 and Safe) and Solana transactions to Success, Failed or Replaced.',
          'survives-reload': 'The transaction pool is saved to localStorage, and trackers resume after a reload.',
          'status-webhooks': 'Quasar sends signed webhooks when a transaction settles.',
          'email-social': 'By design: TUWA connects the wallets users already have.',
          'embedded-wallets': 'By design: no custodial, MPC or enclave wallets.',
          'gas-or-onramp':
            'Pulsar tracks ERC-4337 and Gelato relay transactions, but TUWA sponsors no gas and has no on-ramp.',
          evm: 'Built on wagmi and viem.',
          solana: 'Built on @solana/kit and Wallet Standard.',
          'other-chains': 'Starknet, Tron, Bitcoin and TON are on the roadmap (Phase 8).',
        },
      },
      rainbowkit: {
        summary: 'React connect modal for EVM apps, built on wagmi.',
        license: 'MIT',
        pricingText: 'Free (MIT). WalletConnect needs a free Reown project ID.',
        chooseWhen: 'Your app is EVM-only and you want a polished, well-known connect modal with the least setup.',
        tuwaDifference:
          'Satellite Connect keeps the connection in a headless store for EVM and Solana, and Pulsar follows every transaction to Success, Failed or Replaced, not only until the first confirmation.',
        facts: {
          'own-wallets': 'Wallets connect through wagmi connectors and WalletConnect.',
          'no-vendor-keys': 'No embedded wallets.',
          'no-vendor-accounts': 'A client-side library: no user records.',
          'oss-client': 'MIT.',
          'oss-backend': 'No backend of its own; WalletConnect sessions go through the Reown relay.',
          'no-vendor-key': 'getDefaultConfig takes a projectId from WalletConnect Cloud (Reown).',
          'free-to-ship': 'MIT, free.',
          'no-mau-billing': 'No usage billing.',
          'free-self-host': 'The library has no server to host.',
          'tracks-to-final':
            'Transactions the app registers are shown until confirmed; replacements are not documented.',
          'survives-reload': 'Recent transactions are kept in localStorage.',
          'status-webhooks': 'Client-side only.',
          'email-social': 'Not offered.',
          'embedded-wallets': 'Not offered.',
          'gas-or-onramp': 'Not offered.',
          evm: 'Built on wagmi.',
          solana: 'EVM only.',
          'other-chains': 'EVM only.',
        },
      },
      connectkit: {
        summary: 'React connect modal for EVM apps by Family, built on wagmi, with optional Family Accounts.',
        license: 'BSD-2-Clause',
        pricingText: 'Free (BSD-2-Clause), Family Accounts included. WalletConnect needs a free Reown project ID.',
        chooseWhen: 'You want a themeable EVM connect modal and email or phone sign-up through Family Accounts.',
        tuwaDifference:
          'TUWA never creates accounts for your users, covers Solana as well as EVM, and adds transaction tracking (Pulsar) and a backend you can self-host (Quasar).',
        facts: {
          'own-wallets': 'Wallets connect through wagmi connectors and WalletConnect.',
          'no-vendor-keys':
            "Family Accounts (on by default, off with enableFamily: false) are wallets on Family's infrastructure.",
          'no-vendor-accounts': 'Users who sign up with Family Accounts get an account at Family.',
          'oss-client': 'BSD-2-Clause.',
          'oss-backend': 'No backend of its own; Family Accounts and WalletConnect run on Family and Reown servers.',
          'no-vendor-key': 'walletConnectProjectId is required.',
          'free-to-ship': 'Free; the Family Accounts integration is free too.',
          'no-mau-billing': 'No usage billing.',
          'free-self-host': 'The library has no server to host.',
          'tracks-to-final': 'Not documented.',
          'survives-reload': 'Not documented.',
          'status-webhooks': 'Client-side only.',
          'email-social': 'Email or phone sign-up through Family Accounts.',
          'embedded-wallets': 'Family Accounts, secured by a passkey or password.',
          'gas-or-onramp': 'Not documented.',
          evm: 'Built on wagmi.',
          solana: 'EVM only.',
          'other-chains': 'EVM only.',
        },
      },
      appkit: {
        summary: 'Connect modal with email and social login, on-ramp and swaps, from the WalletConnect team.',
        license: 'Reown Community License',
        pricingText:
          'Free up to 500 MAU and 2.5M RPC calls a month; Pro from $89/month (7,500 MAU), then $0.05 per MAU.',
        chooseWhen:
          'You need email and social login, an on-ramp and Bitcoin from one vendor, and the Reown license terms fit your scale.',
        tuwaDifference:
          'TUWA is Apache-2.0 with no usage thresholds and no mandatory gateway, and it bills nothing per user.',
        facts: {
          'own-wallets': 'Extension and mobile wallets through WalletConnect.',
          'no-vendor-keys': 'Email and social wallets are created and secured by Magic.',
          'no-vendor-accounts': 'Email, social and SIWX users count as MAU on the Reown dashboard.',
          'oss-client':
            'Source-available under the Reown Community License, not an OSI license; modifications are assigned to Reown.',
          'oss-backend': "The license requires every use to connect to Reown's proprietary gateway.",
          'no-vendor-key': 'projectId from the Reown Dashboard; the default ID of the CLI works only on localhost.',
          'free-to-ship': 'Starter: free up to 500 MAU and 2.5M RPC calls a month.',
          'no-mau-billing':
            'Paid plans bill per MAU; the license requires a commercial license above 500 MAU or 2.5M RPC calls a month.',
          'free-self-host': 'The Reown network is mandatory.',
          'tracks-to-final': 'Not among the AppKit features.',
          'survives-reload': 'Not among the AppKit features.',
          'status-webhooks': 'Not among the AppKit features.',
          'email-social': 'Email and social login.',
          'embedded-wallets': 'Universal Wallets by Magic.',
          'gas-or-onramp': 'On-ramp, and swaps on EVM.',
          evm: 'EVM chains.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin.',
        },
      },
      privy: {
        summary: 'Embedded wallets and user authentication as a managed service.',
        license: 'Apache-2.0 SDK, managed service',
        pricingText: 'Free up to 499 MAU; Scale $299/month (500–2,499 MAU); above 10,000 MAU $2,000 + $0.05 per MAU.',
        chooseWhen:
          'Most of your users have no wallet, and you want email and social login, embedded wallets, gas sponsorship and many chains, managed for you.',
        tuwaDifference:
          'TUWA keeps users on their own wallets and your sessions on your server (SIWX, CAIP-122), with no per-user bill and nothing to trust but the chain.',
        facts: {
          'own-wallets': 'Ethereum and Solana wallets can log in alongside embedded wallets.',
          'no-vendor-keys': "Embedded wallets are secured by TEEs on Privy's infrastructure.",
          'no-vendor-accounts': 'Every user is a Privy user, billed as MAU.',
          'oss-client': '@privy-io/react-auth is published under Apache-2.0, without a public repository.',
          'oss-backend': 'Managed service only.',
          'no-vendor-key': 'appId from the Privy Dashboard is required.',
          'free-to-ship': 'Free up to 499 MAU.',
          'no-mau-billing': '$299/month from 500 MAU; $0.05 per MAU above 10,000.',
          'free-self-host': 'Managed service only.',
          'tracks-to-final':
            'transaction.broadcasted and transaction.confirmed events for transactions of Privy wallets.',
          'survives-reload': 'Not documented.',
          'status-webhooks': 'For Privy wallets; the pricing page lists webhooks with the Enterprise plan.',
          'email-social': 'Email, SMS, passkey, social and any OAuth login.',
          'embedded-wallets': 'Embedded wallets for every user.',
          'gas-or-onramp': 'Gas sponsorship through a paymaster, and card or bank on-ramps.',
          evm: 'Ethereum and EVM networks.',
          solana: 'Solana and SVM networks.',
          'other-chains': 'Bitcoin, Cosmos, TON, Sui, Tron and more, at different support tiers.',
        },
      },
      dynamic: {
        summary: 'Authentication and MPC embedded wallets as a managed service.',
        license: 'MIT SDK, managed service',
        pricingText: 'Free up to 1,000 MAU, then $0.05 per MAU; $249/month up to 5,000 MAU.',
        chooseWhen:
          'You need embedded wallets on the widest list of chains, with enterprise policies and delegated access, managed for you.',
        tuwaDifference:
          'TUWA never holds a key share: users sign with their own wallets, sessions stay on your server, and nothing is billed per user.',
        facts: {
          'own-wallets': 'Users can sign in by connecting a wallet.',
          'no-vendor-keys': 'TSS-MPC wallets: Dynamic holds the server share and coordinates signing.',
          'no-vendor-accounts': 'Every user is a Dynamic user, billed as MAU.',
          'oss-client': '@dynamic-labs/sdk-react-core is published under MIT, without a public repository.',
          'oss-backend': 'Managed service only.',
          'no-vendor-key': 'environmentId from the dashboard is required.',
          'free-to-ship': 'Free up to 1,000 MAU.',
          'no-mau-billing': '$0.05 per MAU above 1,000.',
          'free-self-host': 'Managed service only.',
          'tracks-to-final': 'wallet.activity reports confirmed activity of embedded wallets.',
          'survives-reload': 'Not documented.',
          'status-webhooks': 'wallet.activity webhooks, for embedded wallets.',
          'email-social': 'Email, SMS, social and passkey sign-up.',
          'embedded-wallets': 'MPC embedded wallets.',
          'gas-or-onramp': 'Gas sponsorship for embedded wallets.',
          evm: 'All EVM networks.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, Sui, TON, Stellar, Tron and more.',
        },
      },
      thirdweb: {
        summary: 'All-in-one platform: in-app wallets, transactions API, RPC, gas sponsorship and contracts.',
        license: 'Apache-2.0 SDK, cloud backend',
        pricingText:
          'Plans from $99/month; user wallets $0.015 per MAU after the first 1,000; 2.5% surcharge on sponsored mainnet gas.',
        chooseWhen:
          'You want one vendor for in-app wallets, server wallets, gas sponsorship, RPC and contract deployment, and the subscription fits your budget.',
        tuwaDifference:
          'Pulsar tracks transactions from any wallet in the browser, and Quasar adds history and webhooks as a cloud or as the Apache-2.0 Community Edition.',
        facts: {
          'own-wallets': 'External wallets alongside in-app wallets.',
          'no-vendor-keys': 'In-app wallets are generated and used inside AWS Nitro Enclaves run by thirdweb.',
          'no-vendor-accounts': 'In-app wallet users are billed per MAU.',
          'oss-client': 'Apache-2.0.',
          'oss-backend': 'The self-hostable Engine v2 (Apache-2.0) is archived; Transactions runs on thirdweb Cloud.',
          'no-vendor-key': 'A client ID in the browser and a secret key on the server.',
          'free-to-ship': 'Plans start at $99/month.',
          'no-mau-billing': '$0.015 per user-wallet MAU after the first 1,000.',
          'free-self-host': 'Engine v2 is archived.',
          'tracks-to-final': "Transactions sent through thirdweb's Transactions API, with timelines.",
          'survives-reload': 'Not documented.',
          'status-webhooks': '1,000 deliveries included, then $0.10 per 1,000.',
          'email-social': 'Email, phone and social sign-in.',
          'embedded-wallets': 'In-app wallets.',
          'gas-or-onramp': 'Gas sponsorship.',
          evm: '2,500+ EVM chains.',
          solana: 'Solana server wallets and API.',
          'other-chains': 'Not documented.',
        },
      },
      alchemy: {
        summary: 'RPC and data platform with Wallet APIs for smart wallets and gas sponsorship.',
        license: 'MIT SDK, cloud backend',
        pricingText: 'Free: 30M compute units a month; pay as you go from $0.525 per 1M compute units.',
        chooseWhen:
          'You already run on Alchemy RPC and need gas sponsorship and smart wallets (EIP-7702) on EVM and Solana.',
        tuwaDifference:
          'Pulsar follows any transaction, not only the calls sent through one API, keeps pending ones across reloads, and Quasar can run on your own servers.',
        facts: {
          'own-wallets': 'Wallet APIs work with any embedded wallet or key management solution.',
          'no-vendor-keys': "Alchemy's own signer (Account Kit) is deprecated; keys come from your signer provider.",
          'no-vendor-accounts': 'Login moved to signer providers; Wallet APIs work with addresses.',
          'oss-client': 'aa-sdk: MIT.',
          'oss-backend': 'RPC, bundler and paymaster are proprietary services.',
          'no-vendor-key': 'An API key in every request URL.',
          'free-to-ship': 'Free: 30M compute units a month.',
          'no-mau-billing': 'Billed by compute units, not by users.',
          'free-self-host': 'Cloud only.',
          'tracks-to-final': 'wallet_getCallsStatus, for calls sent through Wallet APIs.',
          'survives-reload': 'Not documented.',
          'status-webhooks':
            'Address Activity and Custom webhooks report on-chain activity, not the status of a sent transaction.',
          'email-social': 'Account Kit login is deprecated; Alchemy recommends Privy.',
          'embedded-wallets': 'Account Kit embedded wallets are deprecated; Alchemy recommends Privy.',
          'gas-or-onramp': 'Gas sponsorship on EVM, fee and rent sponsorship on Solana.',
          evm: 'EVM networks.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, Sui, Aptos and more through Chain APIs.',
        },
      },
      'the-graph': {
        summary: 'Decentralized protocol that indexes contract events into GraphQL APIs (subgraphs).',
        license: 'Apache-2.0 / MIT',
        pricingText: '100,000 free queries a month, then $2 per 100,000; a self-hosted Graph Node is free.',
        chooseWhen:
          'You need to query contract events and state across all users. That is indexing, a different job from tracking what your app sends; many apps use both.',
        tuwaDifference:
          'Quasar does not index contracts: it follows the transactions your users send from your app and keeps their history per wallet, with webhooks.',
        facts: {
          'own-wallets': 'An indexer: it does not connect wallets.',
          'no-vendor-keys': 'Handles no user keys.',
          'no-vendor-accounts': 'Keeps no records of your users.',
          'oss-client': 'graph-cli and graph-ts: Apache-2.0 or MIT.',
          'oss-backend': 'Graph Node: Apache-2.0, self-hostable.',
          'no-vendor-key': 'A self-hosted Graph Node needs no key; the network takes an API key from Subgraph Studio.',
          'free-to-ship': '100,000 free queries a month.',
          'no-mau-billing': 'Billed per query.',
          'free-self-host': 'Graph Node is open source.',
          'tracks-to-final': 'Indexes contract events, not the transactions your app sends.',
          'survives-reload': 'Not a client-side tool.',
          'status-webhooks': 'Serves queries; no transaction status webhooks.',
          'email-social': 'Not its job.',
          'embedded-wallets': 'Not its job.',
          'gas-or-onramp': 'Not its job.',
          evm: 'Ethereum and many EVM networks.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, NEAR, Starknet, Stellar, TRON and more.',
        },
      },
    },
  },
  configurator: {
    badge: 'Interactive',
    titlePrefix: 'Stack',
    titleHighlight: 'Configurator',
    description:
      'Pick your framework, chains and features to get the install command, the setup files and the closest starter template — or copy the whole stack as a prompt for your coding agent.',
    form: {
      framework: 'Framework',
      chains: 'Chains',
      chainsHint: 'Pick one or both',
      ui: 'UI',
      uiVanillaHint: 'Headless stores (Nova is for React)',
      uiNova: 'Nova UI Kit',
      uiHeadless: 'Your own UI (headless)',
      authBackend: 'Auth & Backend',
      siwxLabel: 'SIWX sign-in (CAIP-122)',
      siwxTooltipLabel: 'About SIWX sign-in',
      siwxTooltip:
        'Sign-In With X (CAIP-122): the wallet signs a message once and your server sets an HttpOnly session cookie. Supports EOA, EIP-1271 smart wallets, ERC-6492 pre-deployed accounts and Solana ed25519.',
      quasarLabel: 'Quasar sync & webhooks',
      quasarTooltipLabel: 'About Quasar sync & webhooks',
      quasarTooltip:
        'Syncs every Pulsar transaction to Quasar (Cloud or self-hosted Community Edition) so tracking continues on the server, history follows the wallet across devices, and your backend receives HMAC-SHA256 webhooks.',
      quasarHint: 'Turns on SIWX: Quasar syncs transactions of signed-in wallets',
    },
    steps: {
      step1Title: '1. Your Stack',
      copyShareLink: 'Copy shareable link',
      linkCopied: 'Link copied',
      tryInPlayground: 'Try in the Playground',
      copyPromptForAi: 'Copy Prompt for AI',
      promptCopied: 'Prompt copied',
      promptTitle: 'Copy the stack as a prompt for Claude Code, Cursor or another coding agent',
      step2Title: '2. Install',
      devPackagesLabel: 'Toolbar / dev packages',
      copyDevPackages: 'Copy the dev packages command',
      step3Title: '3. Setup Files ({count})',
      setupFilesAria: 'Generated setup files',
      step4Title: '4. Run It',
      closestTemplate: 'Closest starter template',
      cloneWithTiged: 'Or clone it with tiged',
      copyCloneCommand: 'Copy the clone command',
      guidesForStack: 'Guides for this stack',
    },
    templateNotes: {
      'No template uses Vanilla TypeScript: the files below are the whole setup.':
        'No template uses Vanilla TypeScript: the files below are the whole setup.',
      'The closest template: EVM and Solana with Nova, without a server. The files below add the rest.':
        'The closest template: EVM and Solana with Nova, without a server. The files below add the rest.',
      'Matches your stack: EVM and Solana with Nova Connect and Nova Transactions.':
        'Matches your stack: EVM and Solana with Nova Connect and Nova Transactions.',
      'The full stack: SIWX, Quasar sync and history, webhooks.':
        'The full stack: SIWX, Quasar sync and history, webhooks.',
      'EVM only, with SIWX sign-in.': 'EVM only, with SIWX sign-in.',
      'Solana only, with SIWX sign-in and a Codama program.': 'Solana only, with SIWX sign-in and a Codama program.',
      'The closest template: it uses Nova; the files below replace it with your own UI.':
        'The closest template: it uses Nova; the files below replace it with your own UI.',
      'EVM and Solana with Nova Connect and Nova Transactions.':
        'EVM and Solana with Nova Connect and Nova Transactions.',
    },
    commandLabels: {
      'Create the app': 'Create the app',
      'Run the API next to Vite': 'Run the API next to Vite',
      'Relay Quasar webhooks to localhost': 'Relay Quasar webhooks to localhost',
    },
    guideTitles: {
      'Full-Stack React App': 'Full-Stack React App',
      'Transaction Tracking in React': 'Transaction Tracking in React',
      'Satellite Connect without React': 'Satellite Connect without React',
      'Pulsar trackers standalone': 'Pulsar trackers standalone',
      'Multi-Chain Auth with SIWX': 'Multi-Chain Auth with SIWX',
      'Sync Transactions to Quasar': 'Sync Transactions to Quasar',
      'Quasar Webhooks': 'Quasar Webhooks',
      'TUWA_AGENTS.md': 'TUWA_AGENTS.md',
      'Sovereign Account Abstraction (ERC-4337)': 'Sovereign Account Abstraction (ERC-4337)',
      'Why Web3 Tx State is Broken': 'Why Web3 Tx State is Broken',
      'Self-Hosting': 'Self-Hosting',
      Quasar: 'Quasar',
      'Choose Your Packages': 'Choose Your Packages',
    },
  },
  playground: {
    badge: 'Interactive',
    titlePrefix: 'TUWA',
    titleHighlight: 'Playground',
    description:
      'Run Satellite Connect, SIWX, Pulsar, Nova UI Kit and Quasar in your browser against a simulated wallet and chain. Trigger confirmations, failures, replacements, reloads and device handoffs, and watch the stores and events.',
    controls: {
      stackHeading: '1. Stack',
      chains: 'Chains',
      chainsHint: 'Pick one or both',
      ui: 'UI',
      uiNova: 'Nova UI Kit',
      uiHeadless: 'Headless',
      authBackend: 'Auth & Backend',
      siwxLabel: 'SIWX sign-in',
      siwxInfoLabel: 'About SIWX sign-in',
      siwxInfo:
        'Asks the wallet to sign a CAIP-122 message on connect (Nova) or from a button (Headless). A simulated server verifies the message, consumes the nonce and holds the session.',
      quasarLabel: 'Quasar sync & history',
      quasarInfoLabel: 'About Quasar sync & history',
      quasarInfo:
        'Syncs transactions of the signed-in wallet to a simulated Quasar Cloud, loads the cloud history on connect, and posts a signed webhook to the Events tab when a transaction settles.',
      scenarioHeading: '2. Scenario',
      txOutcome: 'Transaction outcome',
      outcomeInfoLabel: 'About transaction outcomes',
      outcomeInfo:
        'How the simulated chain finishes the next transaction you send on the stage. Pick an outcome, then click Mint NFT, Swap or Stake.',
      outcomes: {
        succeed: { label: 'Succeed', hint: '3 confirmations → Success' },
        fail: { label: 'Revert', hint: 'Reverts on chain → Failed' },
        replace: { label: 'Speed up (EVM)', hint: 'Replaced by a new hash → Replaced' },
        cancel: { label: 'Cancel (EVM)', hint: '0-ETH self-transfer at same nonce → Replaced' },
        reject: { label: 'Wallet rejects', hint: 'User rejects in the wallet' },
      },
      latency: 'Confirmation latency',
      fast: 'Fast (~1.5s)',
      realistic: 'Realistic (~5s)',
      multiDevice: 'Multi-device',
      multiDeviceInfoLabel: 'About multi-device',
      multiDeviceInfo:
        'Simulates opening your dApp on a second laptop or phone with an empty browser storage. With Quasar on, connect and sign in with the same wallet to see its cloud history and resume pending transactions.',
      openAnotherDevice: 'Open on another device',
      openAnotherDeviceHint: 'Enable Quasar to see history and pending transactions carry over to the new device.',
      resetPlayground: 'Reset playground',
    },
    stage: {
      stageBadge: 'Stage',
      simulatedLabel: 'Simulated wallets & chain',
      reloadStage: 'Reload stage',
      reloadStageTitle: 'Remount the stage: pending transactions resume from localStorage',
      walletModalLabel: 'Simulated wallet confirmation',
      walletExtension: 'Wallet extension',
      signInRequest: 'Sign-in request',
      txRequest: 'Transaction request',
      messageToSign: 'Message to sign',
      signingWith: 'Signing with the simulated wallet on {family}.',
      reject: 'Reject',
      confirm: 'Confirm',
      sign: 'Sign',
      novaHeaderSubtitle: 'Mint, swap and stake on a simulated chain',
      novaConnectedHint:
        'Send a transaction and watch Pulsar track it in the toasts, the tracking modal and the history.',
      novaConnectHint: 'Connect a wallet to send transactions.',
      novaConnectAndSignInHint: 'Connect a wallet and sign in to send transactions.',
      historyHeading: 'History',
      historyAria: 'Transaction history',
      headlessSubtitle: "No Nova UI Kit: this UI is the app's own, on the Satellite, SIWX and Pulsar stores.",
      networkAria: 'Network',
      disconnect: 'Disconnect',
      signedInWithSiwx: 'Signed in with SIWX',
      signOut: 'Sign out',
      signInWithSiwx: 'Sign in with SIWX',
      noTransactionsYet: 'No transactions yet.',
      syncedToQuasar: 'synced to Quasar',
      syncPending: 'sync pending',
      actions: {
        MINT: {
          label: 'Mint NFT',
          title: ['Minting Orbit #42', 'Orbit #42 minted', 'Mint failed', 'Mint replaced'],
          description: [
            'Minting an NFT of the TUWA Orbits collection',
            'Orbit #42 is in your wallet',
            'The mint did not go through',
            'Another transaction took its place',
          ],
        },
        SWAP: {
          label: 'Swap',
          title: ['Swapping 100 USDC', 'Swap complete', 'Swap failed', 'Swap replaced'],
          description: [
            'Swapping 100 USDC for the native token',
            '100 USDC swapped',
            'The swap did not go through',
            'Another transaction took its place',
          ],
        },
        STAKE: {
          label: 'Stake',
          title: ['Staking 1.5 tokens', 'Staked', 'Staking failed', 'Stake replaced'],
          description: [
            'Locking 1.5 tokens in the staking pool',
            '1.5 tokens are staked',
            'The stake did not go through',
            'Another transaction took its place',
          ],
        },
      },
    },
    inspector: {
      tabsAria: 'Inspector',
      tabs: {
        events: 'Events',
        state: 'State',
        customize: 'Customize',
        code: 'Code',
      },
      events: {
        clear: 'Clear',
        empty: 'Nothing yet: connect a wallet on the stage and send a transaction.',
      },
      state: {
        quasarSource: 'cloud history (simulated)',
        walletTitle: 'Wallet extension',
        walletSource: 'simulated',
      },
      customize: {
        intro:
          'Nova UI Kit is customized in layers, from CSS variables to your own components. Each control names the prop it sets; the Code tab has the files.',
        headlessNotice: 'The headless stage uses the theme only. Switch the UI to Nova UI Kit to see the other layers.',
        themeLayer: 'Theme',
        styleLayer: 'Style',
        componentsLayer: 'Components',
        textsLayer: 'Texts',
        behaviorLayer: 'Behavior',
        languageLabel: 'Language',
        connectTextLabel: 'Connect button text',
        toastPositionLabel: 'Toast position',
        resetNova: 'Reset to Nova as it ships',
        copyCss: 'Copy CSS',
        cssCopied: 'CSS copied',
        resetEdits: 'Reset edits',
        editedSuffix: 'edited',
        themeGroups: {
          Surfaces: 'Surfaces',
          Text: 'Text',
          Buttons: 'Buttons',
          Statuses: 'Statuses',
          Shape: 'Shape',
        },
        themePresets: {
          'default-dark': {
            label: 'Default Dark',
            description: 'The dark theme Nova UI Kit ships with.',
          },
          'clean-light': {
            label: 'Clean Light',
            description: 'The light theme Nova UI Kit ships with.',
          },
          cyberpunk: {
            label: 'Cyberpunk',
            description: 'Neon magenta and cyan on deep violet, with square corners.',
          },
          minimalist: {
            label: 'Minimalist',
            description: 'Monochrome zinc, color only for statuses, thin rings.',
          },
          'isometric-light': {
            label: 'Isometric Light',
            description: 'One dark ink on white with square corners, a line drawing. Picks the Isometric style.',
          },
          'isometric-dark': {
            label: 'Isometric Dark',
            description: 'The Isometric drawing on deep navy, in dimmed gray lines. Picks the Isometric style.',
          },
        },
        styleKits: {
          nova: { label: 'Nova', description: 'The class names Nova UI Kit ships with.' },
          mono: {
            label: 'TUWA Mono',
            description: 'Monospace type, outlined surfaces and accent rings on every part.',
          },
          iso: {
            label: 'Isometric',
            description: 'A line drawing: boxes and buttons with an extruded face, an ink bar on every modal.',
          },
        },
        flags: {
          historyIcons: 'Icons by transaction type in the history',
          confirmationsBar: 'Confirmations as a bar in the toasts',
          emptyHistory: 'Illustrated empty history',
          withBalance: 'Balance in the connect button',
          withChain: 'Network selector',
          popularWallet: 'Nebula Wallet in a "Popular" group',
          legalLinks: 'Terms and privacy links',
          trackingModal: 'Tracking modal on submission',
          autoCloseToasts: 'Close the toasts after 5 seconds',
          logButtonClicks: 'Log connect button clicks to Events',
        },
      },
      code: {
        introPart1: 'The stage runs these TUWA stores and Nova components with simulated adapters in place of ',
        introPart2: ' and ',
        introPart3: ' and their Solana versions. Here is the same stack for your app, with real wallets.',
        stackSetup: 'Stack setup',
        setupFilesAria: 'Setup files',
        novaCustomization: 'Nova customization',
        themeHeading: 'Theme',
        importThemeNote: 'Import the theme after the Nova styles.',
        passObjectsNote:
          'Pass the objects of customization.tsx to the Nova providers and components, as its first lines show.',
        customizationFilesAria: 'Customization files',
        openInConfigurator: 'Open in the Stack Configurator',
        openInStackblitz: 'Open the Vite template in StackBlitz',
      },
    },
  },
  policies: {
    badge: 'Legal & Security',
    title: 'Policies',
    description:
      'The terms, privacy notices, data processing agreements and security policy for tuwa.io and Quasar Cloud. Every document is published on tuwa.io in HTML, PDF and Markdown.',
    listAria: 'Policy documents',
    read: 'Read',
    pdf: 'PDF',
    securityContactTitle: 'Security contact:',
    securityContactText: 'report vulnerabilities to',
    securityContactSuffix: '(see the Security Policy for scope and response targets).',
    legalPrivacyTitle: 'Legal & privacy:',
    items: {
      terms: {
        title: 'Terms of Service',
        description:
          'The rules for using the TUWA websites and documentation, Quasar Cloud, Quasar Community Edition and the open-source packages.',
      },
      privacy: {
        title: 'Privacy Policy',
        description: 'What data TUWA collects and why, how it is protected, and how to access or delete it.',
      },
      cookie: {
        title: 'Cookie Policy',
        description: 'The cookies and Local Storage that the TUWA sites and the Quasar dashboard use.',
      },
      refund: {
        title: 'Refund Policy',
        description: 'When and how payments for Quasar Cloud quota are refunded.',
      },
      security: {
        title: 'Security Policy',
        description: 'How to report a vulnerability, what TUWA promises in return, and who is responsible for what.',
      },
      dpa: {
        title: 'Data Processing Addendum',
        description: 'How we process the personal data of your app users on your behalf when you use Quasar Cloud.',
      },
    },
  },
  notFound: {
    heading: 'Page not found',
    description: 'This address does not match any page in the TUWA documentation hub.',
    backToMain: 'Back to Main Screen',
    browseGuides: 'Browse Guides',
    destinationsAria: 'Documentation destinations',
    packageRefHeading: 'Looking for a package reference?',
    packageRefDescription: 'Each TUWA library hosts its own API reference and guides:',
    destinations: {
      '/': {
        title: 'Main Screen',
        description: 'Explore the 5-stage TUWA ecosystem architecture and all packages.',
      },
      '/guides': {
        title: 'Guides',
        description: 'End-to-end tutorials for React apps, SIWX authentication, and Quasar sync.',
      },
      '/quasar': {
        title: 'Quasar',
        description: 'Server-side transaction tracking, webhooks, API reference, and self-hosting.',
      },
      '/comparisons': {
        title: 'Comparisons',
        description: 'How TUWA compares to RainbowKit, AppKit, Privy, Dynamic, thirdweb, Alchemy, and The Graph.',
      },
      '/configurator': {
        title: 'Configurator',
        description: 'Pick your framework, chains, and features to generate ready-to-run setup files.',
      },
      '/playground': {
        title: 'Playground',
        description: 'Run the full TUWA stack in the browser against simulated EVM and Solana chains.',
      },
    },
  },
  ui: {
    latestReleasePrefix: 'Latest Release',
    documentationTitle: 'Documentation',
    deprecatedBadge: 'Deprecated',
    moreCount: '+{count} more',
    requiredPeers: 'Required peers',
    optionalPeersHeading: 'Optional peers (install the ones your app uses)',
    includesHeading: 'Includes (re-exported)',
    usedBy: 'Used by',
    clickForDetails: 'Click for the details',
    clickForInstall: 'Click for the install command with peers, guides and links',
    referenceLink: 'Reference',
    sourceLink: 'Source',
    includedInPrefix: 'Included in',
    includedInAnd: ' and ',
    includedInSuffix: ': in an app on the TUWA SDK, import it from there instead of installing it.',
    installsWithPeers: 'Installs the package with its {count} required {peerWord}, the peers of TUWA peers included. ',
    peerSingular: 'peer',
    peerPlural: 'peers',
    alsoNeedsFrameworkPeers: 'Also needs {peers} in the app.',
    lighterDoesNotImport: 'does not import {peers}: an app that imports only this entry can leave them out.',
    lighterEntryDescriptions: {
      '@tuwaio/pulsar-evm/safe': 'the Safe tracker alone',
    },
    quickStartSteps: {
      step1Title: 'Run command',
      step1Desc: 'Execute the interactive CLI command in your project directory.',
      step2Title: 'Select template',
      step2Desc: 'Choose React or Next.js templates for EVM, Solana, or Multi-chain.',
      compareTemplates: 'Compare templates',
      step3Title: 'Start building',
      step3Desc: 'Run local dev server and start creating self-custodial Web3 dApps.',
      aiAgentsBadge: 'AI agents',
      aiAgentsTitle: 'Integration guide for AI coding agents',
    },
    comparisonsExtra: {
      verifiedBadge: 'Verified {date}',
      productsCount: '{count} products',
      criteriaCount: '{count} criteria',
      radarIntro:
        'Pick a product to lay it over TUWA. Click an axis to see the criteria behind its score. TUWA is a set of packages, not a wallet provider, so each product faces the TUWA projects that do the same job:',
      criteriaIntro:
        'The {count} criteria behind the radar for all products at once. Hover a mark for the note; the number links to its source.',
      chooseInsteadIntro:
        'No toolkit fits every app. Here is where each product is the better pick, and what TUWA does differently in the same job.',
      methodologyIntro: 'How the scores are computed, what the marks mean and where every fact comes from.',
      readyHeading: 'Ready to try it?',
      startFromTemplate: 'Start From a Template',
      fullStackGuide: 'Full-Stack Guide',
      compareTuwaWith: 'Compare TUWA with',
      radarAxesAria: 'Radar axes',
      favorsHostedOnboarding:
        'Hosted platforms lead here by design: TUWA connects the wallets users already have and never creates or holds wallets for them.',
      favorsHostedChains:
        'Embedded-wallet services reach more chain families today. TUWA covers EVM and Solana; Starknet, Tron, Bitcoin and TON are next on the roadmap.',
      tuwaCounterpartLabel: 'TUWA counterpart',
      scoringHeading: 'Scoring',
      scoringBodyPart1: 'Each axis has {count} yes-or-no criteria, listed in the table above. A product scores ',
      scoringBodyPart2:
        ' on the axis. Nothing is weighted or adjusted by hand: the page computes every score from the facts.',
      markMetLead: 'Met:',
      markMetBody: ' the vendor documents it for the product as a whole.',
      markPartialLead: 'Partial:',
      markPartialBody:
        ' only for some of its wallets, transactions or plans, or only with an optional feature turned off.',
      markNoLead: 'Not met:',
      markNoBody:
        " missing, outside the product's job, or not documented (we found no mention in the vendor's documentation on the check date).",
      whatWeCompareHeading: 'What we compare',
      whatWeCompareBody:
        'A product is scored as its vendor offers it by default, optional features included. TUWA is a set of packages, so each competitor faces the TUWA projects that do the same job; the radar shows the whole stack. Two axes, Onboarding and Chain Coverage, favor hosted platforms by design, and we keep them so the picture stays honest.',
      transparencyPart1:
        'TUWA wrote this page. Every fact was verified on {date} against primary sources: vendor documentation, licenses on GitHub and npm, and pricing pages. We recheck it every quarter. The data lives in ',
      transparencyFileLink: 'one typed file',
      transparencyPart2: '; if something is outdated or wrong, ',
      transparencyIssueLink: 'open an issue',
      transparencyPart3: ' and we will fix it.',
      sourcesHeading: 'Sources',
    },
    configuratorExtra: {
      subtitle:
        'Pick your framework, chains and features. Get the install command, every setup file and the closest starter template. Each of the {count} stacks is type-checked against the published packages.',
      frameworkHints: {
        next: 'App Router, with route handlers for the server',
        vite: 'A client app; the server parts run on any Fetch API runtime',
        vanilla: 'No React: the TUWA stores and your own DOM code',
      },
      chainsHintFull: 'Each chain family adds its own add-on; an app never bundles the other.',
      uiHintVanilla: 'Nova UI Kit is made of React components; with Vanilla TS the UI is yours.',
      uiHintNova: 'Nova Connect modals and Nova Transactions toasts, themed with CSS variables.',
      uiHintHeadless: 'Your own components on the Satellite and Pulsar stores.',
      featuresLabel: 'Features',
      featuresHintQuasar: 'Quasar syncs the transactions of a signed-in wallet, so it turns on SIWX.',
      featuresHintDefault:
        'SIWX signs users in with their wallet (CAIP-122); Quasar adds history across devices and webhooks.',
      siwxChoice: 'SIWX sign-in',
      quasarChoice: 'Quasar sync',
      fastestStart: 'Fastest start: a starter template',
      starterTemplate: 'Starter template',
      runCommandAndPick: 'Run the command and pick ',
      orAddToExisting: 'Or add TUWA to a new or existing {framework} app:',
      peersIncluded: 'Required peer dependencies included',
      sdkBringsProjects: '; the SDK brings the TUWA projects',
      addFilesTitle: 'Add the files ({count})',
      runStepTitle: 'Run',
      readNext: 'Read next',
    },
    playgroundExtra: {
      subnote:
        'The real TUWA stores and Nova components run in your browser on simulated wallets and a simulated chain: nothing is signed or sent.',
      loadingAria: 'Loading the Playground',
      connectButtonGroup: 'Connect button',
      minimal: 'Minimal',
      full: 'Full',
      nextTxGroup: 'Next transaction',
      nextTxShort: 'Next tx',
      speedGroup: 'Speed',
      signaturesGroup: 'Wallet signatures',
      approve: 'Approve',
      reject: 'Reject',
      quasarGroup: 'Quasar',
      online: 'Online',
      offline: 'Offline',
      pendingEvmGroup: 'Pending EVM transaction',
      speedUp: 'Speed up',
      cancel: 'Cancel',
      otherDeviceShort: 'Other device',
      resetShort: 'Reset',
      resetTitle: 'Reset the Playground: a new session with the default settings',
      setupButton: 'Setup',
      closeSetup: 'Close the setup',
      scrollButton: 'Scroll',
      scrollTitle: 'A fixed height with a scroll bar; drag the bottom corner to resize',
      outcomeLabels: {
        success: 'Success',
        revert: 'Revert',
        replaced: 'Replaced',
        rejected: 'Rejected',
      },
      outcomeHints: {
        success: 'Mined on EVM. On Solana, confirmed in a second, then finalized.',
        revert: 'The contract (EVM) or the program (Solana) fails the transaction.',
        replaced: 'EVM: another transaction with the same nonce is mined. Solana: the blockhash expires.',
        rejected: 'The user rejects the transaction in the wallet.',
      },
      info: {
        chains: 'The chain families of the simulated dApp, each with its simulated wallets and networks. One stays on.',
        ui: 'Nova UI Kit: the ready-made connect modal, button and toasts. Headless: hand-written components on the same stores, as an app without Nova builds them.',
        features:
          'SIWX sign-in: after connecting, the wallet signs a message and the app gets a session. Quasar sync: the transactions sync to a simulated Quasar and follow the user to another device; it needs SIWX.',
        theme:
          'The --tuwa-* variables of Nova on the stage. Customize › Theme edits each one and gives the CSS to paste.',
        style:
          'Class names for every Nova part (customization.classNames): Nova as it ships, TUWA Mono, or Isometric, drawn for its own themes.',
        connectButton:
          'Full: the balance and the network selector next to the button. Minimal: the button alone (withBalance and withChain off).',
        language:
          'The language of Nova UI Kit texts and modals: English (EN), Simplified Chinese (CN), or Ukrainian (UA).',
        outcome: 'How the next transaction you send from the stage ends.',
        speed: 'How long the simulated wallet and chain take. Fast divides every delay by 4.',
        signatures:
          'Whether the simulated wallet approves or rejects the next message to sign, such as the SIWX sign-in.',
        quasar:
          "Offline: the sync fails, Pulsar keeps the transaction unsynced and resends it when Quasar is back. A real app's preFlightTxCheck also stops new transactions while Quasar is unreachable.",
        pendingEvm:
          'Replaces the latest pending EVM transaction with one of the same nonce, as a wallet does: Speed up resends it, Cancel sends an empty one. The original ends as Replaced.',
      },
    },
    policiesExtra: {
      lastUpdated: 'Last updated {date}',
      vulnTitle: 'Found a vulnerability?',
      vulnBeforeLink: 'Email ',
      vulnAfterLink:
        ' with the affected package or service, the steps to reproduce and the impact. Please do not disclose it publicly until it is fixed.',
      legalTitle: 'Legal and privacy questions',
      legalBeforeLink: 'Email ',
      legalAfterLink: ', including requests to access or delete your personal data.',
    },
    notFoundExtra: {
      reportBrokenLink: 'Report a broken link',
      hubSectionsHeading: 'Docs Hub',
      policiesTitle: 'Policies',
      policiesDescription: 'Terms, privacy and the other TUWA policies.',
    },
  },
  nextra: {
    ...docsLabels.en.nextra,
    sidebar: {
      main: 'Main Screen',
      guides: 'Guides',
      quasar: 'Quasar',
      comparisons: 'Comparisons',
      configurator: 'Configurator',
      playground: 'Playground',
      index: 'Overview',
      'choose-packages': 'Choose Your Packages',
      'why-web3-transaction-state-is-broken': 'Why Web3 Tx State is Broken',
      'full-stack-react': 'Full-Stack React App',
      'react-transaction-tracking': 'Transaction Tracking in React',
      'multi-chain-auth-siwx-caip122': 'Multi-Chain Auth with SIWX',
      'erc-4337-sovereign-account-abstraction': 'Sovereign Account Abstraction (ERC-4337)',
      'quasar-transaction-sync': 'Sync Transactions to Quasar',
      'siwx-jwt-external-auth': 'External Auth with SIWX JWT',
      'siwx-supabase': 'Supabase RLS with SIWX',
      'starter-templates': 'Starter Templates',
      'apps-and-keys': 'Apps & Keys',
      webhooks: 'Webhooks',
      'rpc-and-chains': 'RPC & Chains',
      'quotas-and-limits': 'Quotas & Limits',
      api: 'API Reference',
      'self-hosting': 'Self-Hosting (Community Edition)',
      'migrate-to-community': 'Move from Cloud to Community',
      policies: 'TUWA Policies',
    },
    guidesOverview: {
      title: 'Architecture Blueprints & Deep Dives',
      p1: 'While individual package documentation provides granular, function-level API references, this hub is dedicated to high-level Web3 architecture, production battle-testing, and real-world execution recipes.',
      p2: 'Web3 engineering fails when distributed ledger realities meet naive frontend assumptions: mempool congestion, dynamic gas spikes, dropped nonces, speed-up replacements, background tab throttling, and component unmounting. The blueprints documented here resolve these systemic issues using local-first, headless, and self-custodial architectural patterns.',
      calloutTitle: 'Authoritative Specification for Developers & AI Agents',
      calloutBeforeLink:
        'For the ground-truth system design rules, strict package isolation boundaries, inter-layer contracts, and agent behavior constraints across the entire ecosystem, consult ',
      calloutAfterLink:
        '. It serves as the single source of architectural truth for human engineers and autonomous agents alike.',
      deepDiveHeading: 'Deep-Dive Guides',
      deepDiveIntro:
        'Comprehensive engineering breakdowns focused on solving systemic vulnerabilities in modern dApps:',
      deepDives: [
        {
          href: '/guides/multi-chain-auth-siwx-caip122',
          emoji: '🔐',
          title: 'Multi-Chain Authentication with SIWX (CAIP-122 Beyond EVM Silos)',
          description:
            'Why EIP-4361 limits modern multi-chain applications, how CAIP-122 unifies EVM and Solana authentication into a single cryptographic boundary, and how to implement stateless, cryptographically verified sessions with anti-replay protection.',
          meta1Label: 'Focus:',
          meta1Text:
            'CAIP-122 protocol, cross-chain session synchronization, EIP-191/1271 & ed25519 signature verification.',
          meta2Label: 'Key Solution:',
          meta2Text: 'Universal multi-chain authentication powered by @tuwaio/siwx.',
        },
        {
          href: '/guides/why-web3-transaction-state-is-broken',
          emoji: '⚡',
          title: 'Why Web3 Transaction State Management is Broken (And Why useState is an Anti-Pattern)',
          description:
            'An in-depth investigation into why modeling blockchain writes with React useState leads to component unmount bugs, orphaned speed-up transactions, and desynchronized user sessions. Demonstrates how to decouple execution from the UI tree using headless state machines and nonce-aware lifecycle tracking.',
          meta1Label: 'Focus:',
          meta1Text: 'Mempool mechanics, transaction replacements, cross-tab synchronization.',
          meta2Label: 'Key Solution:',
          meta2Text: 'Decoupled transaction lifecycles powered by @tuwaio/pulsar-core.',
        },
        {
          href: '/guides/erc-4337-sovereign-account-abstraction',
          emoji: '🛡️',
          title: 'Demystifying ERC-4337: Sovereign Account Abstraction Without Proprietary WaaS',
          description:
            'Why Account Abstraction does not require a proprietary WaaS platform, how the alternative mempool and userOpHash vs txHash lifecycle works, and how to build gas-optimized, sovereign smart accounts with Solady, Orbit EVM, Pulsar, and Quasar.',
          meta1Label: 'Focus:',
          meta1Text:
            'Canonical EntryPoint v0.7, Solady counterfactual accounts, Pimlico bundler/paymaster RPCs, Two-Stage UserOp tracking.',
          meta2Label: 'Key Solution:',
          meta2Text:
            'Sovereign, gas-sponsored smart accounts powered by @tuwaio/orbit-evm, @tuwaio/pulsar-core, and Quasar.',
        },
      ],
      stepByStepHeading: 'Step-by-Step Guides',
      stepByStepIntro: 'Hands-on setups that combine several TUWA packages:',
      stepBySteps: [
        {
          href: '/guides/react-transaction-tracking',
          emoji: '🧭',
          title: 'Track Transactions in React with Pulsar',
          description:
            'Add Pulsar to a React app for an EVM or a Solana wallet: a transaction store saved to localStorage, the chain adapter, tracking that resumes after a reload, and a button that sends a tracked contract or program call, with an optional ERC-4337 smart account variant.',
          meta1Label: 'Packages:',
          meta1Text:
            '@tuwaio/pulsar-core, @tuwaio/pulsar-evm or @tuwaio/pulsar-solana, @tuwaio/pulsar-react, Nova Connect.',
        },
        {
          href: '/guides/full-stack-react',
          emoji: '🧱',
          title: 'Build a Full-Stack React App with the TUWA SDK',
          description:
            'A Next.js app on @tuwaio/sdk for EVM or Solana: wallet connection with the Nova Connect modals, SIWX sign-in with server sessions, a Pulsar transaction store with the Nova Transactions modals and toasts, and a Server Action that knows which wallet is signed in.',
          meta1Label: 'Packages:',
          meta1Text: '@tuwaio/sdk, @tuwaio/evm-sdk or @tuwaio/solana-sdk.',
        },
        {
          href: '/guides/quasar-transaction-sync',
          emoji: '☁️',
          title: 'Sync Transactions to Quasar',
          description:
            'Continues the full-stack app: Server Actions that call Quasar after checking the SIWX session, a Pulsar store that syncs every new transaction, and the history of every device in the Nova modals.',
          meta1Label: 'Packages:',
          meta1Text: '@tuwaio/quasar-sdk, @tuwaio/sdk.',
        },
        {
          href: '/guides/siwx-jwt-external-auth',
          emoji: '🔑',
          title: 'Hand a SIWX Sign-In to External Auth with JWT and JWKS',
          description:
            'Continues the full-stack app: a short-lived JWT for the wallet signed in with SIWX and the public keys that verify it, so Coinbase CDP custom authentication, other embedded wallet providers and your own services trust the same sign-in.',
          meta1Label: 'Packages:',
          meta1Text: '@tuwaio/sdk (/siwx/server, /siwx/server-next), @coinbase/cdp-hooks.',
        },
        {
          href: '/guides/siwx-supabase',
          emoji: '🗄️',
          title: 'Use a SIWX Sign-In with Supabase Row Level Security',
          description:
            'Continues the external auth setup: Supabase trusts the SIWX token as third-party auth, Row Level Security policies on the wallet address give each wallet only its own rows, and supabase-js sends the token from the browser and from Server Actions.',
          meta1Label: 'Packages:',
          meta1Text: '@tuwaio/sdk (/siwx, /siwx/server, /siwx/server-next), @supabase/supabase-js.',
        },
        {
          href: '/guides/starter-templates',
          emoji: '🚀',
          title: 'Starter Templates',
          description:
            'Complete Next.js and Vite apps from Cosmos Playground — wallet connection, transaction tracking, SIWX sign-in and Quasar sync already wired together — and the CLI that creates a project from them.',
        },
      ],
      apiReferencesHeading: 'Package API References',
      apiReferencesP1:
        'Looking for granular API references, hook signatures, type definitions, or installation instructions for individual packages?',
      apiReferencesP2Before:
        'All dedicated package documentation spaces (@tuwaio/siwx, @tuwaio/orbit, @tuwaio/satellite, @tuwaio/pulsar, @tuwaio/nova-uikit, @tuwaio/sdk, and @tuwaio/quasar-sdk) are indexed on our ',
      apiReferencesMainScreenLink: 'Main Screen',
      apiReferencesP2After:
        '. Visit the main portal to explore the complete interactive layer roadmap and jump directly into specific package documentation.',
      apiReferencesP3Before:
        'Quasar — apps and keys, quotas, webhooks, self-hosting the Community Edition and the API reference — is documented in the ',
      apiReferencesQuasarLink: 'Quasar section',
      apiReferencesP3After: ' of this hub.',
      principlesHeading: 'Architectural Principles',
      principlesIntro: 'Every blueprint in this repository adheres to three non-negotiable engineering principles:',
      principles: [
        {
          lead: 'Self-Custodial & Sovereign Architecture:',
          body: ' Frontends stay self-custodial and do not require a closed-source, proprietary Wallet-as-a-Service (WaaS) platform. Client applications keep resilient, local-first state and can add Quasar for multi-device indexing, webhook delivery, and backend orchestration — as a managed cloud or as the open-source, self-hosted Community Edition (Apache-2.0) — without ever taking custody of user keys.',
        },
        {
          lead: 'Headless Separation of Concerns:',
          body: ' Core business logic lives in framework-agnostic stores (satellite, pulsar) and low-level protocol adapters (orbit). Presentation lives in disposable UI views (nova). Changes to UI styling never jeopardize underlying Web3 state machines.',
        },
        {
          lead: 'Strict Type Safety & Zero Bloat:',
          body: ' Zero tolerance for any types, legacy @solana/web3.js v1 bundles, or monolithic ethers.js packages. Only modern, tree-shakeable, high-performance primitives (viem, @solana/kit).',
        },
      ],
    },
    pageDescriptions: {
      'guides/choose-packages':
        'How to decide between @tuwaio/sdk and individual packages for wallet connection, SIWX sign-in, Pulsar tracking, and Nova UI.',
      'guides/full-stack-react':
        'Complete integration of wallet connection, SIWX sign-in, Pulsar tracking, and Quasar sync in Next.js for EVM and Solana.',
      'guides/react-transaction-tracking':
        'How to track EVM and Solana transactions in a React application using Pulsar and Nova UI Kit.',
      'guides/multi-chain-auth-siwx-caip122':
        'Sign-In With X (CAIP-122) authentication for EVM and Solana wallets verified on your own server.',
      'guides/why-web3-transaction-state-is-broken':
        'Why modeling blockchain writes with React useState breaks on unmounts and replacements, and how headless state machines solve it.',
      'guides/erc-4337-sovereign-account-abstraction':
        'Sovereign ERC-4337 smart accounts with Solady, EntryPoint v0.7, Pimlico bundlers/paymasters, Orbit EVM, Pulsar, and Quasar.',
      'guides/quasar-transaction-sync':
        'How to sync client and server-signed transactions to Quasar with @tuwaio/quasar-sdk and verify HMAC webhooks.',
      'guides/siwx-jwt-external-auth':
        'Issue short-lived JWTs and a JWKS endpoint from a SIWX session for external auth providers and microservices.',
      'guides/siwx-supabase': 'Use a SIWX wallet sign-in with Supabase Row Level Security policies and supabase-js.',
      'guides/starter-templates':
        'Ready-to-run Next.js and Vite starter templates from Cosmos Playground and the CLI to scaffold them.',
      'quasar/apps-and-keys':
        'Organizations, applications, secret keys (sk_live_...), key rotation, and security in Quasar Cloud and Community Edition.',
      'quasar/webhooks':
        'HMAC-SHA256 signed Quasar webhooks, x-quasar-signature verification, retries, and local CLI forwarding.',
      'quasar/rpc-and-chains':
        'Supported EVM and Solana networks (CAIP-2), custom RPC endpoints, and Alchemy/QuickNode keys in Quasar.',
      'quasar/quotas-and-limits':
        'How quota units are metered, public beta free limits, and API rate limits in Quasar.',
      'quasar/api': 'Complete HTTP endpoint reference for the Quasar Engine API (sync, history, and health).',
      'quasar/self-hosting': 'Deploy Quasar Community Edition (Apache-2.0) on your own server with Docker Compose.',
      'quasar/migrate-to-community':
        'Export an organization from Quasar Cloud to an encrypted .qex archive and import it into a self-hosted Quasar Community Edition node.',
    },
    headings: {
      'where-to-start': '🧭 Where to Start',
      'shared-rules-across-every-guide': '📐 Shared Rules Across Every Guide',
      'how-quasar-fits-in': '🔄 How Quasar Fits In',
      'finality-expiry-and-reconciliation': '⛓️ Finality, Expiry and Reconciliation',
      'quasar-cloud-and-quasar-community': '☁️ Quasar Cloud and Quasar Community',
      'which-path-fits-your-stack': 'Which Path Fits Your Stack',
      'next-steps': '📚 Next Steps',

      // Quasar: Apps & Keys
      'create-an-app': '🛠️ Create an App',
      'secret-key-and-public-key': '🔑 Secret Key and Public Key',
      'app-settings-that-restrict-requests': '🛡️ App Settings That Restrict Requests',
      'isolation-between-apps': '🏢 Isolation Between Apps',

      // Quasar: Quotas & Limits
      'public-beta': '🧪 Public Beta',
      'what-costs-quota': '🧮 What Costs Quota',
      'when-the-quota-is-used-up': '📉 When the Quota Is Used Up',
      'other-limits': '🚦 Other Limits',

      // Quasar: Webhooks
      'register-an-endpoint': '🛠️ Register an Endpoint',
      'the-request': '📨 The Request',
      'verify-the-signature': '🔐 Verify the Signature',
      'retries-and-delivery-logs': '🔁 Retries and Delivery Logs',
      'local-development': '💻 Local Development',

      // Quasar: Self-Hosting & Migration
      'point-the-sdk-at-your-node': '🔌 Point the SDK at Your Node',
      'export-the-organization': '📦 Export the Organization',
      'import-it-into-your-node': '📥 Import It into Your Node',
      'switch-over': '🔁 Switch Over',
      'when-the-import-stops': '🧯 When the Import Stops',

      // Guides Index
      'deep-dive-guides': 'Deep-Dive Guides',
      'multi-chain-authentication-with-siwx-caip-122-beyond-evm-silos':
        '🔐 Multi-Chain Authentication with SIWX (CAIP-122 Beyond EVM Silos)',
      'why-web3-transaction-state-management-is-broken-and-why-usestate-is-an-anti-pattern':
        '⚡ Why Web3 Transaction State Management is Broken (And Why useState is an Anti-Pattern)',
      'demystifying-erc-4337-sovereign-account-abstraction-without-proprietary-waas':
        '🛡️ Demystifying ERC-4337: Sovereign Account Abstraction Without Proprietary WaaS',
      'step-by-step-guides': 'Step-by-Step Guides',
      'track-transactions-in-react-with-pulsar': '🧭 Track Transactions in React with Pulsar',
      'build-a-full-stack-react-app-with-the-tuwa-sdk': '🧱 Build a Full-Stack React App with the TUWA SDK',
      'sync-transactions-to-quasar': '☁️ Sync Transactions to Quasar',
      'hand-a-siwx-sign-in-to-external-auth-with-jwt-and-jwks':
        '🔑 Hand a SIWX Sign-In to External Auth with JWT and JWKS',
      'use-a-siwx-sign-in-with-supabase-row-level-security': '🗄️ Use a SIWX Sign-In with Supabase Row Level Security',
      'starter-templates': '🚀 Starter Templates',
      'package-api-references': 'Package API References',
      'architectural-principles': 'Architectural Principles',

      // Guides Details
      'before-you-start': 'Before You Start',
      'step-1-install-the-packages': 'Step 1: Install the Packages',
      'step-2-configure-the-network': 'Step 2: Configure the Network',
      'step-3-add-the-siwx-routes': 'Step 3: Add the SIWX Routes',
      'step-4-create-the-transaction-store': 'Step 4: Create the Transaction Store',
      'step-5-render-the-providers': 'Step 5: Render the Providers',
      'step-6-send-a-tracked-transaction': 'Step 6: Send a Tracked Transaction',
      'step-7-read-the-session-on-the-server': 'Step 7: Read the Session on the Server',
      'evm-and-solana-together': '🌐 EVM and Solana Together',
      'step-2-describe-the-contract-or-program': 'Step 2: Describe the Contract or Program',
      'step-3-create-an-action': 'Step 3: Create an Action',
      'step-5-resume-tracking-after-a-reload': 'Step 5: Resume Tracking After a Reload',
      'step-6-send-and-track-the-transaction': 'Step 6: Send and Track the Transaction',
      'step-7-react-to-finished-transactions': 'Step 7: React to Finished Transactions',
      'step-1-install-the-quasar-client': 'Step 1: Install the Quasar Client',
      'step-2-add-the-server-actions': 'Step 2: Add the Server Actions',
      'step-3-sync-from-the-transaction-store': 'Step 3: Sync from the Transaction Store',
      'eip-5792-batches': 'EIP-5792 Batches',
      'step-4-show-the-history': 'Step 4: Show the History',
      'server-signed-transactions-withdrawals--payouts': 'Server-Signed Transactions (Withdrawals & Payouts)',
      'step-1-create-a-signing-key': 'Step 1: Create a Signing Key',
      'step-2-enable-jwt-in-the-route-handler': 'Step 2: Enable JWT in the Route Handler',
      'step-3-connect-coinbase-cdp-custom-authentication': 'Step 3: Connect Coinbase CDP Custom Authentication',
      'step-4-trust-the-token-in-your-own-services': 'Step 4: Trust the Token in Your Own Services',
      'what-ends-up-in-the-token': 'What Ends Up in the Token',
      'security-and-key-rotation': 'Security and Key Rotation',
      'how-it-works': 'How It Works',
      'siwx-or-the-supabase-web3-sign-in': 'SIWX or the Supabase Web3 Sign-In?',
      'step-1-add-the-role-claim-to-the-token': 'Step 1: Add the Role Claim to the Token',
      'step-2-register-your-jwks-with-supabase': 'Step 2: Register Your JWKS with Supabase',
      'step-3-create-a-table-with-row-level-security': 'Step 3: Create a Table with Row Level Security',
      'step-4-create-the-supabase-client': 'Step 4: Create the Supabase Client',
      'step-5-read-and-write-rows': 'Step 5: Read and Write Rows',
      'step-6-query-as-the-wallet-from-a-server-action': 'Step 6: Query as the Wallet from a Server Action',
      'what-supabase-reads-from-the-token': 'What Supabase Reads from the Token',
      templates: '🚀 Templates',
      'create-a-project': '🛠️ Create a Project',
      '1-run-the-cli': '1. Run the CLI',
      '2-configure-and-start': '2. Configure and Start',
      '3-build-with-an-ai-agent': '3. Build with an AI Agent',
      '1-the-architectural-problem-single-chain-silos': '1. The Architectural Problem: Single-Chain Silos',
      'critical-security-pitfalls-of-fragmented-auth': 'Critical Security Pitfalls of Fragmented Auth',
      '2-enter-caip-122-sign-in-with-x': '2. Enter CAIP-122: Sign-In with X',
      'the-authentication-lifecycle': 'The Authentication Lifecycle',
      '3-the-siwx-modular-architecture-packages--adapters': '3. The SIWX Modular Architecture: Packages & Adapters',
      '4-multi-chain-network-adapter-comparison': '4. Multi-Chain Network Adapter Comparison',
      '5-end-to-end-implementation-in-the-tuwa-ecosystem': '5. End-to-End Implementation in the TUWA Ecosystem',
      'step-1-client-side-multi-chain-sign-in': 'Step 1: Client-Side Multi-Chain Sign-In',
      'programmatic-sign-in-button-with-satellite-connect': 'Programmatic Sign-In Button with Satellite Connect',
      'declarative-watcher-pattern-with-satellite-nova-uikit':
        'Declarative Watcher Pattern with Satellite & Nova UIKit',
      'declarative-watcher-pattern-with-satellite--nova-uikit':
        'Declarative Watcher Pattern with Satellite & Nova UIKit',
      'step-2-server-side-cryptographic-verification': 'Step 2: Server-Side Cryptographic Verification',
      'production-route-handler-atomic-redis-nonce-session-store':
        'Production Route Handler (Atomic Redis Nonce & Session Store)',
      'production-route-handler-atomic-redis-nonce--session-store':
        'Production Route Handler (Atomic Redis Nonce & Session Store)',
      'zero-infrastructure-stateless-route-handler-hmac-signed-token':
        'Zero-Infrastructure Stateless Route Handler (HMAC Signed Token)',
      'step-3-guarding-server-actions--backend-dispatches': 'Step 3: Guarding Server Actions & Backend Dispatches',
      '6-technical-comparison-eip-4361-vs-caip-122-siwx': '6. Technical Comparison: EIP-4361 vs. CAIP-122 (SIWX)',
      conclusion: 'Conclusion',
      '1-the-distributed-state-mismatch': '1. The Distributed State Mismatch',
      '2-four-production-failure-modes-of-usestate': '2. Four Production Failure Modes of useState',
      'failure-mode-1-the-component-unmount-bug': 'Failure Mode 1: The Component Unmount Bug',
      'failure-mode-2-the-mempool-replacement-trap-speed-ups-and-cancels':
        'Failure Mode 2: The Mempool Replacement Trap (Speed-Ups and Cancels)',
      'failure-mode-3-cross-tab--browser-reload-amnesia': 'Failure Mode 3: Cross-Tab & Browser Reload Amnesia',
      'failure-mode-4-soft-confirmations-finality--blockhash-expiry':
        'Failure Mode 4: Soft Confirmations, Finality & Blockhash Expiry',
      '3-the-solution-decoupled-local-first-state-machines': '3. The Solution: Decoupled, Local-First State Machines',
      '4-implementation-in-the-tuwa-ecosystem': '4. Implementation in the TUWA Ecosystem',
      'step-1-define-strongly-typed-transaction-unions': 'Step 1: Define Strongly-Typed Transaction Unions',
      'step-2-initialize-the-persistent-pulsar-store': 'Step 2: Initialize the Persistent Pulsar Store',
      'step-3-dispatching-write-actions-via-executetxaction': 'Step 3: Dispatching Write Actions via executeTxAction',
      'step-4-resuming-active-trackers-on-page-reload': 'Step 4: Resuming Active Trackers on Page Reload',
      'step-5-passive-ui-subscriptions-via-selectors': 'Step 5: Passive UI Subscriptions via Selectors',
      'step-6-reactions-that-survive-a-reload': 'Step 6: Reactions That Survive a Reload',
      '5-architectural-comparison-usestate-vs-pulsar': '5. Architectural Comparison: useState vs. Pulsar',
      '1-the-account-abstraction-spectrum-signer-vs-account': '1. The Account Abstraction Spectrum: Signer vs. Account',
      'deconstructing-the-waas-trade-off': 'Deconstructing the WaaS Trade-Off',
      '2-the-two-phase-lifecycle-userophash-vs-txhash': '2. The Two-Phase Lifecycle: userOpHash vs txHash',
      'the-dual-identifier-dilemma': 'The Dual-Identifier Dilemma',
      'three-production-failure-modes-of-naive-frontends': 'Three Production Failure Modes of Naive Frontends',
      '1-rpc-node-polling-vs-bundler-mempool-mismatch': '1. RPC Node Polling vs. Bundler Mempool Mismatch',
      '2-bundle-calldata-obfuscation': '2. Bundle Calldata Obfuscation',
      '3-silent-execution-reverts-inside-entrypointhandleops':
        '3. Silent Execution Reverts inside EntryPoint.handleOps',
      '3-smart-account-architectures-solady-vs-erc-7579-modular-accounts':
        '3. Smart Account Architectures: Solady vs. ERC-7579 Modular Accounts',
      'the-cryptographic-reality-of-solady--passkeys': 'The Cryptographic Reality of Solady & Passkeys',
      '4-implementation-canonical-viem-aa-vs-tuwa-open-source-stack':
        '4. Implementation: Canonical Viem AA vs. TUWA Open-Source Stack',
      '41-implementation-a-canonical-native-viem-viemaccount-abstraction':
        '4.1 Implementation A: Canonical Native Viem (viem/account-abstraction)',
      '42-implementation-b-ergonomic-tuwa-stack-tuwaioorbit-evm--tuwaiopulsar-evm':
        '4.2 Implementation B: Ergonomic TUWA Stack (@tuwaio/orbit-evm & @tuwaio/pulsar-evm)',
      'step-1-orchestrating-the-smart-account-with-orbit-evm': 'Step 1: Orchestrating the Smart Account with Orbit EVM',
      'step-2-reactive-two-stage-tracking-with-pulsar': 'Step 2: Reactive Two-Stage Tracking with Pulsar',
      'part-a-pure-transaction-action-incrementpimlicots': 'Part A: Pure Transaction Action (incrementPimlico.ts)',
      'part-b-reactive-ui-component-dispatch-counterbuttontsx':
        'Part B: Reactive UI Component Dispatch (CounterButton.tsx)',
      'how-pulsars-two-stage-pipeline-executes-under-the-hood':
        "How Pulsar's Two-Stage Pipeline Executes Under the Hood",
      '5-cross-device-persistence-build-your-own-indexer-or-use-quasar':
        '5. Cross-Device Persistence: Build Your Own Indexer or Use Quasar',
      'option-a-build-your-own-indexer-ponder--envio': 'Option A: Build Your Own Indexer (Ponder / Envio)',
      'option-b-non-custodial-sync-with-quasar-cloud-or-self-hosted':
        'Option B: Non-Custodial Sync with Quasar (Cloud or Self-Hosted)',
      '6-comprehensive-architectural-comparison-matrix': '6. Comprehensive Architectural Comparison Matrix',
      'summary-designing-sovereign-smart-accounts': 'Summary: Designing Sovereign Smart Accounts',
    },
    guidesIndex: {
      title: 'Guides',
      intro:
        'Each guide walks through a task that crosses two or more TUWA layers, with complete TypeScript and React code for EVM and Solana.',
      tableHeaders: {
        guide: 'Guide',
        whatYouBuild: 'What You Build',
        layersUsed: 'Layers Used',
      },
      rows: [
        {
          href: '/guides/choose-packages',
          title: 'Choose Your Packages',
          whatYouBuild:
            'Decide between @tuwaio/sdk and individual packages for wallet connection, SIWX sign-in, transaction tracking, and Nova UI',
          layersUsed: 'All stages',
        },
        {
          href: '/guides/full-stack-react',
          title: 'Full-Stack React App',
          whatYouBuild:
            'Connect a wallet, sign in with SIWX, track transactions with Pulsar, and sync to Quasar in one Next.js app',
          layersUsed: 'SIWX, Satellite, Pulsar, Quasar, Nova, SDK',
        },
        {
          href: '/guides/react-transaction-tracking',
          title: 'Transaction Tracking in React',
          whatYouBuild: 'Track EVM and Solana transactions in a React app with Pulsar and Nova UI',
          layersUsed: 'Orbit, Satellite, Pulsar, Nova',
        },
        {
          href: '/guides/multi-chain-auth-siwx-caip122',
          title: 'Multi-Chain Auth with SIWX',
          whatYouBuild: 'Sign-In With X (CAIP-122) for EVM and Solana wallets, verified on your server',
          layersUsed: 'Orbit, SIWX, Satellite, Nova',
        },
        {
          href: '/guides/quasar-transaction-sync',
          title: 'Sync Transactions to Quasar',
          whatYouBuild:
            'Sync client and server-signed transactions to Quasar with @tuwaio/quasar-sdk and verify HMAC webhooks',
          layersUsed: 'SIWX, Pulsar, Quasar, Nova',
        },
      ],
      whereToStartHeading: '🧭 Where to Start',
      whereToStart: {
        newAppLead: 'Building a new React dApp?',
        newAppBeforeLink: 'Start with ',
        newAppLink: 'Full-Stack React App',
        newAppAfterLink: ' — it wires every layer in one place.',
        existingAppLead: 'Adding one feature to an existing app?',
        existingAppBeforeFirst: 'Pick the focused guide: ',
        existingAppFirstLink: 'Transaction Tracking in React',
        existingAppMiddle: ', ',
        existingAppSecondLink: 'Multi-Chain Auth with SIWX',
        existingAppAfterSecond: ', or ',
        existingAppThirdLink: 'Sync Transactions to Quasar',
        existingAppEnd: '.',
        notSureLead: 'Not sure which packages to install?',
        notSureLink: 'Choose Your Packages',
        notSureAfterLink: ' lists the exact install command for each combination.',
      },
      sharedRulesHeading: '📐 Shared Rules Across Every Guide',
      sharedRulesIntro: 'Every guide follows the same conventions so you can combine snippets without conflicts:',
      sharedRules: {
        sdkImportsLead: 'React apps import from @tuwaio/sdk subpaths',
        sdkImportsBody:
          ' (@tuwaio/sdk/orbit, @tuwaio/sdk/siwx, @tuwaio/sdk/satellite, @tuwaio/sdk/pulsar, @tuwaio/sdk/nova-core, @tuwaio/sdk/nova-connect, @tuwaio/sdk/nova-transactions) and the network add-ons @tuwaio/evm-sdk/* and @tuwaio/solana-sdk/*. Each guide also notes the standalone packages if you prefer not to install @tuwaio/sdk.',
        viemWagmiLead: 'EVM uses viem and @wagmi/core',
        viemWagmiBody:
          ' — never ethers.js, web3.js, RainbowKit, ConnectKit, or WagmiProvider (EVMConnectorsWatcher from Satellite handles the wagmi config).',
        solanaKitLead: 'Solana uses @solana/kit and @tuwaio/orbit-solana',
        solanaKitBody: ' — never @solana/web3.js v1 or gill.',
        noSecretsLead: 'Secret keys stay on the server',
        noSecretsBody: ' — QUASAR_SECRET_KEY and QUASAR_WEBHOOK_SECRET are never exposed in NEXT_PUBLIC_* variables.',
      },
    },
    quasarIndex: {
      title: 'Quasar',
      introPart1:
        'Quasar is the backend of TUWA (Stage 3, "Backend & Sync"). Pulsar tracks a transaction in the browser while the tab is open; Quasar tracks the same transaction on a server until it reaches a final status, keeps the history of your app for every device, and notifies your backend with signed webhooks. Your server talks to it with ',
      introPart2: '.',
      howFitsHeading: '🔄 How Quasar Fits In',
      howFitsIntro:
        'Quasar supports both wallet-signed transactions from the browser (deposits, swaps, contract calls) and server-signed transactions from your backend (withdrawals, automated payouts, server relayers) without requiring a browser localStorage store.',
      bullets: {
        serverKeyLead: 'Your server holds the key.',
        serverKeyPart1:
          ' The browser never calls Quasar with the secret key: for wallet-signed flows it calls your server, which checks that the user owns the wallet (with a SIWX session) and then calls Quasar; for server-signed flows your backend calls Quasar directly after broadcasting. The ',
        serverKeyLinkText: 'Quasar transaction sync guide',
        serverKeyPart2: ' covers both flows.',
        trackingTwiceLead: 'Tracking runs twice.',
        trackingTwiceBody:
          ' A fast phase follows the transaction as soon as it is synced, and a lazy queue plus an hourly sweeper check pending transactions again for reorganizations and lagging RPC nodes. Quasar tracks the transactions of the Pulsar trackers: EVM transactions, EIP-5792 batches, Safe multisig transactions, ERC-4337 user operations and Solana signatures. Quasar Cloud does not track Safe multisig transactions for now; a Community Edition node does.',
        webhooksLead: 'Webhooks',
        webhooksPart1:
          ' notify your backend when a transaction reaches a terminal status (Success, Failed or Replaced). ',
        webhooksSee: 'See ',
        webhooksLinkText: 'Webhooks',
      },
      finalityHeading: '⛓️ Finality, Expiry and Reconciliation',
      finalityIntro:
        'Quasar and Pulsar use the same tracker rules on every chain so your database and webhooks only settle on deterministic terminal states:',
      finalityHeaders: {
        chainTracker: 'Chain / Tracker',
        intermediate: 'Intermediate Updates',
        terminalSuccess: 'Terminal Success',
        terminalFailed: 'Terminal Failed / Replaced',
      },
      finalityRows: {
        solana: {
          intermediate:
            "Records confirmationStatus: 'confirmed' and slot once when a supermajority votes on the signature (saves DB IOPS while updating UI)",
          success: "Only at finalized commitment (confirmations: 'MAX')",
          failed:
            'Immediate Failed if getSignatureStatuses returns an on-chain err at confirmed; Failed with an expired-blockhash error once cluster block height passes lastValidBlockHeight',
        },
        evm: {
          intermediate: 'Confirmation count while waiting for block depth',
          success: "Receipt status: 'success' after requiredConfirmations blocks",
          failed:
            "Failed on on-chain revert (status: 'reverted'); Replaced (with replacedTxHash) when a same-nonce speed-up or cancel transaction is mined instead",
        },
        eip5792: {
          intermediate:
            'Synced by batch ID (txKey); linked to the executing hash via quasar.pulsar.syncHash(txKey, hash)',
          success: 'Tracked on-chain like a standard EVM transaction once the hash is attached',
          failed: 'Failed if the executing transaction reverts, or if no hash is attached within 1 hour of the sync',
        },
        erc4337: {
          intermediate: 'Polls the bundler for userOpHash inclusion',
          success: 'Mined bundle transaction reaches finality with success: true',
          failed: 'Failed if the bundler rejects the operation or the on-chain UserOperation execution reverts',
        },
      },
      finalityNotes: {
        solanaLead: 'Solana lastValidBlockHeight and getTransaction resilience:',
        solanaBody:
          ' signAndSendSolanaTx of @tuwaio/pulsar-solana captures lastValidBlockHeight automatically; when syncing a server-signed Solana transaction, pass lastValidBlockHeight in quasar.pulsar.syncCreate. Once the cluster block height (getBlockHeight) passes lastValidBlockHeight and the signature is still unknown, the transaction can no longer land and is marked Failed immediately as expired instead of waiting for an arbitrary timeout. Once confirmed, the tracker fetches fee, recentBlockhash and instructions with getTransaction (legacy, v0 and v1 transactions); a getTransaction RPC error never fails or hides a finalized signature.',
        nonCustodialLead: 'Non-custodial boundary and rebroadcasting:',
        nonCustodialBody:
          ' Neither Pulsar nor Quasar ever stores private keys or raw signed wire transactions. If your backend signs withdrawals and rebroadcasts the same signed transaction while it is in flight before lastValidBlockHeight, keep the raw signed bytes in your broadcaster; calling quasar.pulsar.syncCreate with the same txKey is idempotent (duplicate: true) while Quasar tracks the signature to finalized or blockhash expiry.',
        recoveryLead: 'Server-side recovery and retries:',
        recoveryBody:
          ' An hourly sweeper re-enqueues pending transactions that were stalled by an RPC outage, and any transaction that finished in Failed/Replaced or has been pending for 60 seconds or longer can be retried from the dashboard or via POST /v1/engine/pulsar/sync/retry/:txKey.',
      },
      editionsHeading: '☁️ Quasar Cloud and Quasar Community',
      editionsIntro:
        'Quasar comes in two editions with the same tracking engine and the same API, so @tuwaio/quasar-sdk works with both: only its baseUrl changes.',
      editionsHeaders: {
        cloud: 'Quasar Cloud',
        community: 'Quasar Community Edition',
      },
      editionsRows: [
        {
          label: 'Hosting',
          cloud: 'Managed by TUWA: API at https://api.tuwa.io, dashboard at quasar.tuwa.io',
          community: 'Your servers, with Docker Compose (TuwaIO/quasar-community, Apache-2.0)',
        },
        {
          label: 'Tenants',
          cloud: 'Organizations with members, several apps each',
          community: 'Single-tenant: one administrator',
        },
        {
          label: 'Sign-in to the panel',
          cloud: 'Accounts with SIWX wallet sign-in and passkeys',
          community: 'Email, password and TOTP two-factor authentication in the Payload admin (/admin)',
        },
        {
          label: 'Quotas',
          cloud:
            'Metered per organization; free during the public beta, with 1,000 free quota units for every organization',
          community: 'Set so high that they do not limit a single node',
        },
        {
          label: 'RPC providers',
          cloud: 'Your own, required: an RPC endpoint, an Alchemy key or a QuickNode key in the settings of each app',
          community: 'Your own, with optional fallback keys and public endpoints set by the operator',
        },
        {
          label: 'Emails',
          cloud: 'Onboarding and low-quota emails',
          community: 'None',
        },
      ],
      editionsNotePart1:
        'Quasar Cloud is in public beta and free of charge: paid quota is not available, and during the beta its features, limits and the free units may change. The Community Edition has no SIWX sign-in, no passkeys, no transactional email, no billing and no customer portal. To move an organization from Quasar Cloud to your node with its keys and history, see ',
      editionsMigrateLink: 'Move from Quasar Cloud to Community',
      editionsNotePart2: '; to set up a node, see ',
      editionsSelfHostLink: 'Self-Hosting',
      whichPathHeading: 'Which Path Fits Your Stack',
      whichPaths: {
        serverlessLead: 'Serverless or edge backends (Vercel, Cloudflare Workers):',
        serverlessBody:
          ' Use Quasar Cloud. Waiting ~13–15 seconds for Solana finalized commitment or EVM block confirmations inside a serverless function burns wall-clock execution time and risks timeouts, while running the full Docker stack of Quasar Community Edition (NestJS, BullMQ, Redis, Payload) is unnecessary overhead for a small serverless team. With Quasar Cloud, your route handler makes one quasar.pulsar.syncCreate call, exits immediately, and receives a signed webhook when the transaction reaches finalized or expires.',
        customWorkerLead: 'Custom worker or cron against your own database (without Quasar):',
        customWorkerBody:
          ' If you only need the chain fetcher and finality/expiry loop inside your own cron or background process, import the standalone headless trackers directly from @tuwaio/pulsar-solana (solanaFetcher + initializePollingTracker) or @tuwaio/pulsar-evm — neither package requires React, a browser or localStorage.',
        selfHostedLead: 'Self-hosted infrastructure:',
        selfHostedBody:
          ' Run Quasar Community Edition with Docker Compose on your own VPS or bare-metal servers when you want the complete indexing engine, multi-device history API, webhook worker and admin UI on your own infrastructure.',
      },
      nextStepsHeading: '📚 Next Steps',
      nextSteps: {
        appsKeysPrefix: 'Create an app and get its keys: ',
        appsKeysLink: 'Apps & Keys',
        syncPrefix: 'Sync the transactions of your React app: ',
        syncLink1: 'Quasar transaction sync guide',
        syncMiddle: ', or the complete app in the ',
        syncLink2: 'Full-Stack React guide',
        webhooksPrefix: 'Receive webhooks, also on localhost: ',
        webhooksLink: 'Webhooks',
        apiPrefix: 'Browse the endpoints in the ',
        apiLink1: 'API Reference',
        apiMiddle: ', and the client in the ',
        apiLink2: '@tuwaio/quasar-sdk reference',
      },
    },
  },
};
