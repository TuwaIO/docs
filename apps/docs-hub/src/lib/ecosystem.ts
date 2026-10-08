import {
  BoltIcon,
  CloudIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
  CubeIcon,
  GlobeAltIcon,
  KeyIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';
import type { PackageType } from '@tuwaio/docs-ui';
import type { ComponentType, SVGProps } from 'react';

// The stages, projects and packages of the main page. Kept out of the client components, so server code (llms.txt,
// the sitemap) reads the same data. `scripts/build-data.mjs` reads the `@tuwaio/` package names from this file.

/**
 * A row of the packages list of a project card: an npm package with its layer, or a link.
 */
export interface PackageBadge {
  /** npm name (`@tuwaio/...`) or the label of a link */
  name: string;
  /** TUWA layer of an npm package (`L1`–`L9`) */
  layer?: string;
  /** Target of a link row; npm rows link to npm when they have no details */
  url?: string;
  /** Shows the package crossed out with a "Deprecated" badge */
  isDeprecated?: boolean;
}

/**
 * A project card of the main page.
 */
export interface DocEntry {
  id: string;
  /** Orb style to render; defaults to `id`. Lets an entry without its own orb reuse another's. */
  orb?: PackageType;
  name: string;
  tagline: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradientFrom: string;
  gradientTo: string;
  docsUrl: string;
  githubUrl: string;
  packages?: PackageBadge[];
}

/**
 * A stage of the TUWA ecosystem with its project cards.
 */
export interface EcosystemLayer {
  label: string;
  subtitle: string;
  accentClass: string;
  dotGradient: string;
  entries: DocEntry[];
}

const QUASAR_DASHBOARD_URL = process.env.NEXT_PUBLIC_QUASAR_DASHBOARD_URL || 'https://quasar.tuwa.io/';

export const layers: EcosystemLayer[] = [
  {
    label: 'Stage 1 — Core Auth & Primitives',
    subtitle: 'Chain-agnostic CAIP-122 auth & multi-chain primitives',
    accentClass: 'text-emerald-400',
    dotGradient: 'from-emerald-500 to-teal-600',
    entries: [
      {
        id: 'siwx',
        name: 'Sign-In With X (SIWX)',
        tagline: 'CAIP-122 authentication engine & adapters',
        icon: KeyIcon,
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-green-600',
        docsUrl: 'https://siwx.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/siwx',
        packages: [
          { name: '@tuwaio/siwx-core', layer: 'L1' },
          { name: '@tuwaio/siwx-evm', layer: 'L2' },
          { name: '@tuwaio/siwx-solana', layer: 'L2' },
          { name: '@tuwaio/siwx-react', layer: 'L2' },
          { name: '@tuwaio/siwx-server', layer: 'L2' },
        ],
      },
      {
        id: 'orbit',
        name: 'Orbit Utils',
        tagline: 'Multi-chain utilities for EVM & Solana',
        icon: GlobeAltIcon,
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-teal-600',
        docsUrl: 'https://orbit.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/orbit',
        packages: [
          { name: '@tuwaio/orbit-core', layer: 'L1' },
          { name: '@tuwaio/orbit-evm', layer: 'L2' },
          { name: '@tuwaio/orbit-solana', layer: 'L2' },
        ],
      },
    ],
  },
  {
    label: 'Stage 2 — State & Connection',
    subtitle: 'Transaction tracking & wallet connectivity',
    accentClass: 'text-indigo-400',
    dotGradient: 'from-indigo-500 to-amber-500',
    entries: [
      {
        id: 'satellite',
        name: 'Satellite Connect',
        tagline: 'Headless wallet connection store for EVM & Solana',
        icon: CpuChipIcon,
        gradientFrom: 'from-indigo-500',
        gradientTo: 'to-blue-600',
        docsUrl: 'https://satellite.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/satellite-connect',
        packages: [
          { name: '@tuwaio/satellite-core', layer: 'L3' },
          { name: '@tuwaio/satellite-evm', layer: 'L4' },
          { name: '@tuwaio/satellite-solana', layer: 'L4' },
          { name: '@tuwaio/satellite-react', layer: 'L4' },
          { name: '@tuwaio/satellite-siwe-next-auth', layer: 'L4', isDeprecated: true },
        ],
      },
      {
        id: 'pulsar',
        name: 'Pulsar',
        tagline: 'Transaction tracking that survives reloads',
        icon: BoltIcon,
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-orange-600',
        docsUrl: 'https://pulsar.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/pulsar-core',
        packages: [
          { name: '@tuwaio/pulsar-core', layer: 'L3' },
          { name: '@tuwaio/pulsar-evm', layer: 'L4' },
          { name: '@tuwaio/pulsar-solana', layer: 'L4' },
          { name: '@tuwaio/pulsar-react', layer: 'L4' },
        ],
      },
    ],
  },
  {
    label: 'Stage 3 — Backend & Sync',
    subtitle: 'Managed cloud or self-hosted Quasar engine',
    accentClass: 'text-cyan-400',
    dotGradient: 'from-cyan-500 to-indigo-600',
    entries: [
      {
        id: 'quasar',
        name: 'Quasar Cloud',
        tagline: 'Managed cloud · Transaction indexing & sync',
        icon: CloudIcon,
        gradientFrom: 'from-cyan-500',
        gradientTo: 'to-indigo-600',
        docsUrl: '/quasar',
        githubUrl: 'https://github.com/TuwaIO/sdk/tree/main/packages/quasar-sdk',
        packages: [
          { name: '@tuwaio/quasar-sdk', layer: 'L5' },
          { name: 'Quasar Dashboard', url: QUASAR_DASHBOARD_URL },
        ],
      },
      {
        id: 'quasar-community',
        orb: 'quasar',
        name: 'Quasar Community',
        tagline: 'Self-hosted engine & admin · Apache-2.0',
        icon: ServerStackIcon,
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-cyan-600',
        docsUrl: '/quasar/self-hosting',
        githubUrl: 'https://github.com/TuwaIO/quasar-community',
        packages: [
          { name: 'Self-Hosting Guide', url: '/quasar/self-hosting' },
          { name: 'Live Showcase', url: 'https://github.com/TuwaIO/quasar-community#live-community-showcase' },
        ],
      },
    ],
  },
  {
    label: 'Stage 4 — User Interface',
    subtitle: 'React components for Satellite & Pulsar',
    accentClass: 'text-violet-400',
    dotGradient: 'from-violet-500 to-purple-600',
    entries: [
      {
        id: 'nova',
        name: 'Nova UI Kit',
        tagline: 'Design system & component library',
        icon: CubeIcon,
        gradientFrom: 'from-violet-500',
        gradientTo: 'to-purple-600',
        docsUrl: 'https://stories.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/nova-uikit',
        packages: [
          { name: '@tuwaio/nova-core', layer: 'L6' },
          { name: '@tuwaio/nova-connect', layer: 'L7' },
          { name: '@tuwaio/nova-transactions', layer: 'L7' },
        ],
      },
    ],
  },
  {
    label: 'Stage 5 — SDK Integration Layer',
    subtitle: 'Core SDK & network-specific adapters',
    accentClass: 'text-blue-400',
    dotGradient: 'from-blue-500 to-purple-600',
    entries: [
      {
        id: 'sdk',
        name: 'TUWA SDK',
        tagline: 'Unified client SDK & EVM/Solana network adapters',
        icon: CodeBracketSquareIcon,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
        docsUrl: 'https://sdk.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/sdk',
        packages: [
          { name: '@tuwaio/sdk', layer: 'L8' },
          { name: '@tuwaio/evm-sdk', layer: 'L9' },
          { name: '@tuwaio/solana-sdk', layer: 'L9' },
        ],
      },
    ],
  },
];

/**
 * The layer badge (`L4`) of each npm package listed on the main page.
 */
export const packageLayers: ReadonlyMap<string, string | undefined> = new Map(
  layers.flatMap((layer) =>
    layer.entries.flatMap((entry) => (entry.packages ?? []).map((pkg) => [pkg.name, pkg.layer] as const)),
  ),
);
