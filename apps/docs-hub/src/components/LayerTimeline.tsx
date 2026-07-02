import {
  BoltIcon,
  CloudArrowUpIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  LinkIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

import { DocCard } from './DocCard';

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
    label: 'Layer 1 — Foundational Core',
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
      },
    ],
  },
  {
    label: 'Layer 2 — State & Connection',
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
      },
    ],
  },
  {
    label: 'Layer 3 — User Interface',
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
      },
    ],
  },
  {
    label: 'Layer 4 — Cloud Integration',
    subtitle: 'SaaS orchestrator & unified SDK',
    accentClass: 'text-cyan-500',
    dotGradient: 'from-cyan-500 to-indigo-600',
    entries: [
      // {
      //   id: 'quasar',
      //   name: 'Quasar Cloud',
      //   tagline: 'Multi-tenant indexing & webhook delivery',
      //   icon: CloudArrowUpIcon,
      //   gradientFrom: 'from-cyan-500',
      //   gradientTo: 'to-indigo-600',
      //   docsUrl: 'https://tuwa.io/quasar',
      //   githubUrl: 'https://quasar.tuwa.io',
      // },
      {
        id: 'sdk',
        name: 'TUWA SDK',
        tagline: 'Unified developer integration package',
        icon: CubeTransparentIcon,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
        docsUrl: 'https://sdk.docs.tuwa.io/',
        githubUrl: 'https://github.com/TuwaIO/sdk',
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
