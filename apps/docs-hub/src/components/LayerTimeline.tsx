import {
  BoltIcon,
  CloudArrowUpIcon,
  CubeIcon,
  GlobeAltIcon,
  KeyIcon,
  LinkIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

import { DocCard, PackageBadge } from './DocCard';

/* ─────────────────────────── Data ─────────────────────────── */

interface DocEntry {
  id: string;
  name: string;
  tagline: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradientFrom: string;
  gradientTo: string;
  docsUrl: string;
  githubUrl: string;
  packages?: PackageBadge[];
}

interface EcosystemLayer {
  label: string;
  subtitle: string;
  accentClass: string;
  dotGradient: string;
  entries: DocEntry[];
}

const QUASAR_DASHBOARD_URL = process.env.NEXT_PUBLIC_QUASAR_DASHBOARD_URL || 'https://quasar.tuwa.io/';

const layers: EcosystemLayer[] = [
  {
    label: 'Stage 1 — Core Auth & Primitives',
    subtitle: 'Chain-agnostic CAIP-122 auth & multi-chain primitives',
    accentClass: 'bg-gradient-to-r from-emerald-400 to-rose-400 bg-clip-text text-transparent',
    dotGradient: 'from-emerald-500 to-rose-500',
    entries: [
      {
        id: 'siwx',
        name: 'Sign-In With X (SIWX)',
        tagline: 'CAIP-122 authentication engine & adapters',
        icon: KeyIcon,
        gradientFrom: 'from-rose-500',
        gradientTo: 'to-pink-600',
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
        tagline: 'Headless wallet connection state machine',
        icon: LinkIcon,
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
        name: 'Pulsar Engine',
        tagline: 'Transaction lifecycle indexing & polling',
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
    label: 'Stage 3 — Cloud Integration',
    subtitle: 'SaaS orchestrator & unified SDK',
    accentClass: 'text-cyan-400',
    dotGradient: 'from-cyan-500 to-indigo-600',
    entries: [
      {
        id: 'quasar',
        name: 'Quasar',
        tagline: 'SaaS orchestrator & transaction indexing',
        icon: CloudArrowUpIcon,
        gradientFrom: 'from-cyan-500',
        gradientTo: 'to-indigo-600',
        docsUrl: 'https://sdk.docs.tuwa.io/quasar-cloud/overview',
        githubUrl: 'https://github.com/TuwaIO/quasar',
        packages: [
          { name: '@tuwaio/quasar-sdk', layer: 'L5' },
          { name: 'Quasar Dashboard', url: QUASAR_DASHBOARD_URL },
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
        icon: SwatchIcon,
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
        name: 'TUWA Client SDKs',
        tagline: 'Unified client SDK & EVM/Solana network adapters',
        icon: CubeIcon,
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

/* ─────────────────────── Component ─────────────────────── */

/**
 * Vertical timeline of TUWA ecosystem layers with doc cards.
 */
export function LayerTimeline() {
  return (
    <div className="relative pl-4 sm:pl-8 border-l border-dashed border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] flex flex-col gap-10 sm:gap-12">
      {layers.map((layer) => (
        <div key={layer.label} className="relative">
          {/* Left dot */}
          <div
            className={`absolute -left-[22px] sm:-left-[39px] top-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-r ${layer.dotGradient} ring-[3px] ring-[var(--tuwa-bg-primary)] dark:ring-gray-950`}
          />

          {/* Layer label */}
          <div className="mb-3 sm:mb-4">
            <span
              className={`text-[11px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-widest ${layer.accentClass}`}
            >
              {layer.label}
            </span>
            <span className="hidden sm:inline text-[11px] 2xl:text-xs text-[var(--tuwa-text-secondary)] ml-2">
              — {layer.subtitle}
            </span>
          </div>

          {/* Cards stack */}
          <div className="flex flex-col gap-2.5">
            {layer.entries.map((entry) => (
              <DocCard key={entry.id} {...entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
