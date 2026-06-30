/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CursorState } from '../types';
import { audioEngine } from '../utils/audio';
import { Eye, ArrowUpRight, Award, Flame, Fingerprint, Zap } from 'lucide-react';

interface ManifestoProps {
  setCursor: (state: CursorState) => void;
  darkMode: boolean;
}

export default function Manifesto({ setCursor, darkMode }: ManifestoProps) {
  
  const handleHoverElement = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type: 'hover' });
  };

  const values = [
    {
      icon: <Fingerprint className="text-accent-rose" size={24} />,
      title: 'ORGANIC CORES',
      description: 'We believe technology must mimic natural systems. We build interfaces with kinetic friction, mass, tension, and organic feedback rather than static grids.'
    },
    {
      icon: <Zap className="text-accent-rose" size={24} />,
      title: 'AESTHETICS OF ENERGY',
      description: 'Digital space should not feel clinical. Motion, layout shifts, and audio loops must create a physical atmospheric energy that leaves a lasting emotional trace.'
    },
    {
      icon: <Flame className="text-accent-rose" size={24} />,
      title: 'CYBER ETHICS',
      description: 'We strictly reject unrequested tracking, AI-slop generation, bloated layout modules, and default design scripts. Every asset is coded by human hands, pixel-perfect.'
    }
  ];

  return (
    <div id="manifesto-philosophy-layout" className="w-full flex flex-col pt-24 pb-16 px-6 sm:px-16 select-none relative z-10">
      {/* Page Header */}
      <div className="flex flex-col mb-16 border-b border-white/5 pb-6">
        <span className="font-mono text-xs text-accent-rose font-bold tracking-widest uppercase mb-1">
          // OUR_MANIFESTO
        </span>
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tighter uppercase leading-none">
          THE COLLECTIVE
        </h2>
      </div>

      {/* Narrative Intro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-28">
        <div className="lg:col-span-5 flex flex-col">
          <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-3">
            [THE CORE STATEMENT]
          </span>
          <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tighter uppercase leading-none mb-6">
            REDEFINING BRAND EXPERIENCE, WEBSITES & MOBILE PRODUCTS.
          </h3>
          <p className="font-sans text-xs sm:text-sm opacity-60 leading-relaxed uppercase">
            WE ARE A FULL-SERVICE DIGITAL AGENCY CO-CREATING HIGH-END WEBSITES, NATIVE MOBILE APPLICATIONS, BOLD BRAND DESIGN SYSTEMS, AND MEMORABLE INTERACTIVE EXPERIENCES. WE MERGE ADVANCED DEVELOPMENT WITH RADICAL GRAPHIC STANDARDS.
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-end">
          <p className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight leading-relaxed mb-6">
            "Traditional media has become uniform and static. QOLAB exists to inject energy and elastic resonance into digital spaces—building websites and apps that are tactile, organic, and highly optimized."
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-accent-rose font-bold">
            <span>[FOUNDERS, QOLAB AGENCY]</span>
          </div>
        </div>
      </div>

      {/* Grid of Values - Bento style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
        {values.map((val, idx) => (
          <div
            key={idx}
            onMouseEnter={handleHoverElement}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className={`p-8 rounded-3xl border flex flex-col justify-between aspect-square group transition-all duration-500 hover:-translate-y-1 cursor-none ${
              darkMode 
                ? 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/20' 
                : 'bg-bg-dark/3 border-bg-dark/5 hover:bg-bg-dark/5 hover:border-bg-dark/15 text-bg-dark'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-accent-rose/10 flex items-center justify-center">
                {val.icon}
              </div>
              <span className="font-mono text-[10px] opacity-40">CO_0{idx + 1}</span>
            </div>

            <div className="flex flex-col mt-8">
              <h4 className="font-display font-black text-xl uppercase tracking-tight group-hover:text-accent-rose transition-colors mb-3">
                {val.title}
              </h4>
              <p className={`font-sans text-xs opacity-60 leading-relaxed`}>
                {val.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recognition Banner */}
      <div className={`p-8 sm:p-12 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-8 ${
        darkMode ? 'bg-gradient-to-r from-accent-rose/10 via-accent-violet/5 to-transparent border-white/5' : 'bg-gradient-to-r from-accent-rose/5 via-accent-violet/3 to-transparent border-bg-dark/5 text-bg-dark'
      }`}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center text-accent-rose flex-shrink-0 animate-pulse">
            <Award size={32} />
          </div>
          <div className="flex flex-col">
            <h4 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tighter leading-none">
              AWWWARDS SITE OF THE DAY
            </h4>
            <p className="font-mono text-[10px] opacity-60 uppercase tracking-wider mt-1">
              RECOGNIZED FOR ADVANCED EXPERIMENTAL PHYSICS & SYNTHESIZED SOUND
            </p>
          </div>
        </div>

        <button
          onClick={() => { audioEngine.triggerClick(); }}
          onMouseEnter={handleHoverElement}
          onMouseLeave={() => setCursor({ type: 'default' })}
          className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 bg-accent-rose text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
        >
          VIEW RECOGNITIONS
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
