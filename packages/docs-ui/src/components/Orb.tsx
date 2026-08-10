'use client';

import { cn } from '@tuwaio/nova-core';
import React from 'react';

export type PackageType = 'orbit' | 'pulsar' | 'satellite' | 'nova' | 'quasar' | 'siwx' | 'sdk';

export interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  packageType: PackageType;
  size?: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/** Brand color per package */
const packageColors: Record<PackageType, string> = {
  siwx: '#10b981',
  orbit: '#0d9488',
  satellite: '#6366f1',
  pulsar: '#f59e0b',
  quasar: '#06b6d4',
  nova: '#8b5cf6',
  sdk: '#3b82f6',
};

/** Lighter tint for the sphere base background */
const packageTints: Record<PackageType, string> = {
  siwx: 'rgba(16,185,129,0.12)',
  orbit: 'rgba(13,148,136,0.12)',
  satellite: 'rgba(99,102,241,0.12)',
  pulsar: 'rgba(245,158,11,0.12)',
  quasar: 'rgba(6,182,212,0.12)',
  nova: 'rgba(139,92,246,0.12)',
  sdk: 'rgba(59,130,246,0.12)',
};

const getCosmicFilter = (type: PackageType, id: string) => {
  const starField = (freq: string, seed: string, dur: string) => (
    <>
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="1" seed={seed} result="starNoise">
        <animate
          attributeName="baseFrequency"
          values={`${freq};${(parseFloat(freq) * 1.15).toFixed(3)};${freq}`}
          dur={dur}
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  8 0 0 40 -32"
        in="starNoise"
        result="stars"
      />
    </>
  );

  switch (type) {
    case 'satellite':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.06', '9', '14s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.018;0.024;0.016;0.018" dur="18s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.7  0 0 0 0 0.7  0 0 0 0 1.0  0 0 0 3 -0.5"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="cosmic">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feGaussianBlur in="cosmic" stdDeviation="1.2" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'pulsar':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.12', '1', '6s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="2" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.035;0.055;0.025;0.035" dur="5s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1.0  0 0 0 0 0.8  0 0 0 0 0.2  0 0 0 4 -1"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="cosmic">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feGaussianBlur in="cosmic" stdDeviation="1.0" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'orbit':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.15', '42', '22s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="12" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.012;0.018;0.010;0.012" dur="20s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.2  0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 3 -0.5"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="preMerge">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feDisplacementMap in="preMerge" in2="nebulaNoise" scale="18" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="0.8" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'nova':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.20', '7', '8s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="7" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.025;0.042;0.018;0.025" dur="7s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.9  0 0 0 0 0.5  0 0 0 0 1.0  0 0 0 5 -1.5"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="preMerge">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feDisplacementMap in="preMerge" in2="nebulaNoise" scale="28" xChannelSelector="R" yChannelSelector="B" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="1.5" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'quasar':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.25', '99', '7s')}
          <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="99" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.015;0.032;0.010;0.015" dur="9s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0  0 0 0 0 0.85  0 0 0 0 1.0  0 0 0 5 -1"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="preMerge">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feDisplacementMap in="preMerge" in2="nebulaNoise" scale="40" xChannelSelector="G" yChannelSelector="B" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="1.0" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'siwx':
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.09', '11', '16s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.012" numOctaves="2" seed="1" result="nebulaNoise">
            <animate
              attributeName="baseFrequency"
              values="0.06 0.012; 0.09 0.020; 0.05 0.010; 0.06 0.012"
              dur="10s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.3  0 0 0 0 1.0  0 0 0 0 0.7  0 0 0 4 -1"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="cosmic">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feGaussianBlur in="cosmic" stdDeviation="1.4" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
    case 'sdk':
    default:
      return (
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {starField('0.10', '3', '28s')}
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="3" result="nebulaNoise">
            <animate attributeName="baseFrequency" values="0.014;0.020;0.010;0.014" dur="22s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.3  0 0 0 0 0.6  0 0 0 0 1.0  0 0 0 3 -0.5"
            in="nebulaNoise"
            result="nebula"
          />
          <feMerge result="cosmic">
            <feMergeNode in="nebula" />
            <feMergeNode in="stars" />
          </feMerge>
          <feGaussianBlur in="cosmic" stdDeviation="1.2" result="softCosmic" />
          <feComposite in="softCosmic" in2="SourceGraphic" operator="in" />
        </filter>
      );
  }
};

/**
 * Orb — Premium 3D cosmic sphere for TUWA package visualization.
 *
 * @param packageType - Which TUWA package this orb represents
 * @param size - Diameter in pixels (default: 120)
 * @param icon - SVG icon component rendered centered inside the orb
 */
export const Orb = React.forwardRef<HTMLDivElement, OrbProps>(
  ({ packageType, size = 120, icon: Icon, className, ...props }, ref) => {
    const color = packageColors[packageType];
    const tint = packageTints[packageType];
    const filterId = `orb-filter-${packageType}`;
    const nebGradId = `orb-neb-${packageType}`;
    const glowGradId = `orb-glow-${packageType}`;

    return (
      <div
        ref={ref}
        className={cn(
          'tuwadocs:relative tuwadocs:flex tuwadocs:items-center tuwadocs:justify-center tuwa-orb-float',
          className,
        )}
        style={{ width: size, height: size, flexShrink: 0, ...props.style }}
        {...props}
      >
        {/* Soft tinted glass sphere base */}
        <div
          className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:rounded-full tuwadocs:overflow-hidden"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${color}28 0%, ${tint} 55%, rgba(255,255,255,0.04) 100%)`,
            boxShadow: [
              `0 0 0 1px ${color}30`,
              `0 4px 24px ${color}25`,
              'inset 0 1px 0 rgba(255,255,255,0.35)',
              `inset 0 -2px 8px ${color}20`,
            ].join(', '),
            backdropFilter: 'blur(2px)',
          }}
        >
          {/* Cosmic nebula SVG animation */}
          <svg
            className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:w-full tuwadocs:h-full"
            style={{ mixBlendMode: 'screen', opacity: 0.85 }}
          >
            <defs>
              {getCosmicFilter(packageType, filterId)}
              <radialGradient id={nebGradId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="50%" stopColor={color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              cx="50%"
              cy="50%"
              r="52%"
              fill={`url(#${nebGradId})`}
              filter={`url(#${filterId})`}
              className="tuwa-orb-spin"
              style={{ transformOrigin: 'center' }}
            />
          </svg>

          {/* Inner ambient pulsing glow core */}
          <svg
            className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:w-full tuwadocs:h-full"
            style={{ mixBlendMode: 'soft-light', opacity: 0.6 }}
          >
            <defs>
              <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="1">
                  <animate attributeName="stop-opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="60%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50%" cy="50%" r="40%" fill={`url(#${glowGradId})`} />
          </svg>
        </div>

        {/* Primary specular highlight — top-left glass sheen */}
        <div
          className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:rounded-full tuwadocs:pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 28%, transparent 55%)',
          }}
        />

        {/* Secondary rim highlight — bottom-right warm tint */}
        <div
          className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:rounded-full tuwadocs:pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 78%, ${color}22 0%, transparent 55%)`,
          }}
        />

        {/* Small sharp glint at top */}
        <div
          className="tuwadocs:absolute tuwadocs:pointer-events-none"
          style={{
            top: '14%',
            left: '22%',
            width: '28%',
            height: '10%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
            transform: 'rotate(-38deg)',
            filter: 'blur(0.5px)',
            borderRadius: '50%',
          }}
        />

        {/* Icon centered inside the orb */}
        {Icon && (
          <div className="tuwadocs:absolute tuwadocs:inset-0 tuwadocs:flex tuwadocs:items-center tuwadocs:justify-center tuwadocs:z-10 tuwadocs:pointer-events-none">
            <Icon
              className="tuwadocs:w-5 tuwadocs:h-5 tuwadocs:2xl:w-6 tuwadocs:2xl:h-6"
              style={{
                color: 'rgba(255,255,255,0.95)',
                filter: [
                  `drop-shadow(0 0 6px ${color})`,
                  `drop-shadow(0 0 14px ${color}90)`,
                  'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                ].join(' '),
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

Orb.displayName = 'Orb';
