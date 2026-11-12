import type { ReactNode } from 'react';

interface ArchitecturalGridProps {
  className?: string;
  verticalMask?: string;
  radialMask?: string;
  children?: ReactNode;
}

const DEFAULT_VERTICAL_MASK =
  'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)';

const DEFAULT_RADIAL_MASK =
  'radial-gradient(ellipse 90% 94% at 50% 50%, black 46%, transparent 100%)';

/** Subtle 96px/288px architectural blueprint grid shared across light stone sections. */
export default function ArchitecturalGrid({
  className = 'pointer-events-none absolute inset-0 z-0 overflow-hidden',
  verticalMask = DEFAULT_VERTICAL_MASK,
  radialMask = DEFAULT_RADIAL_MASK,
  children,
}: ArchitecturalGridProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        maskImage: verticalMask,
        WebkitMaskImage: verticalMask,
      }}
    >
      {/* Primary 96px architectural grid + 288px major emerald structural lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(17, 20, 17, 0.105) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(17, 20, 17, 0.105) 1px, transparent 1px),
            linear-gradient(to right, rgba(45, 95, 62, 0.125) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 95, 62, 0.125) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px, 96px 96px, 288px 288px, 288px 288px',
          backgroundPosition: 'center top',
          maskImage: radialMask,
          WebkitMaskImage: radialMask,
        }}
      />

      {/* Optical intersection dots aligned every 192px (every 2 squares) */}
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(25, 50, 32, 0.4) 1px, transparent 1px)',
          backgroundSize: '192px 192px',
          backgroundPosition: 'center top',
          maskImage: 'radial-gradient(ellipse 76% 82% at 50% 45%, black 28%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 76% 82% at 50% 45%, black 28%, transparent 100%)',
        }}
      />

      {children}
    </div>
  );
}

