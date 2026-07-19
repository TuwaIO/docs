import { BoltIcon, CubeTransparentIcon, GlobeAltIcon, LinkIcon, SwatchIcon } from '@heroicons/react/24/outline';

import { DocCard } from './DocCard';
/* ─────────────────────────── Data ─────────────────────────── */
import { PackageBadge } from './DocCard';

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

const layers: EcosystemLayer[] = [
  {
    label: 'Stage 1 — Foundational Core',
    subtitle: 'Framework-agnostic multi-chain primitives',
    accentClass: 'text-emerald-400',
    dotGradient: 'from-emerald-500 to-teal-600',
    entries: [
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
          { name: '@tuwaio/satellite-siwe-next-auth', layer: 'L4' },
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
    accentClass: 'text-cyan-500',
    dotGradient: 'from-cyan-500 to-indigo-600',
    entries: [
      {
        id: 'sdk',
        name: 'TUWA SDK',
        tagline: 'Unified developer integration package',
        icon: CubeTransparentIcon,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
        docsUrl: 'https://sdk.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/sdk',
        packages: [{ name: '@tuwaio/quasar-sdk', layer: 'L5' }],
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
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest ${layer.accentClass}`}>
              {layer.label}
            </span>
            <span className="hidden sm:inline text-[11px] text-[var(--tuwa-text-secondary)] ml-2">
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
