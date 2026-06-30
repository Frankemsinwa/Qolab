/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
  darkMode: boolean;
  key?: string;
}

export default function Loader({ onComplete, darkMode }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState('BOOT_CORE_PHYSICS');
  const [isDone, setIsDone] = useState(false);

  // Simulation loading steps
  const steps = [
    { threshold: 15, name: 'INITIALIZING_AURA_GRID' },
    { threshold: 40, name: 'BOOTING_INTERACTIVE_SOUND_ENGINE' },
    { threshold: 65, name: 'CALIBRATING_PARTICLE_VORTICES' },
    { threshold: 85, name: 'RENDERING_CASE_STUDIES_ARCHIVE' },
    { threshold: 100, name: 'AESTHETIC_NARRATIVE_READY' },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const startTime = Date.now();
    const duration = 2300; // 2.3 seconds loading simulation

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(calculatedProgress);

      // Dynamically cycle steps
      const currentStep = steps.find(s => calculatedProgress <= s.threshold);
      if (currentStep) {
        setActiveStep(currentStep.name);
      }

      if (calculatedProgress < 100) {
        timer = setTimeout(updateProgress, 16); // ~60fps
      } else {
        setTimeout(() => {
          setIsDone(true);
          // Wait for exit animations before reporting complete
          setTimeout(() => {
            onComplete();
          }, 950);
        }, 300);
      }
    };

    timer = setTimeout(updateProgress, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="aura-loader-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            opacity: 0,
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
          }}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 50%, 100% 50%, 100% 100%, 0% 100%)'
          }}
          className={`fixed inset-0 w-full h-full z-[99999] flex flex-col justify-between p-8 sm:p-16 select-none ${
            darkMode ? 'bg-bg-dark text-white' : 'bg-bg-light text-bg-dark'
          }`}
        >
          {/* Top Info Header */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-widest">QOLAB</span>
              <span className="font-mono text-[9px] opacity-40">CREATIVE_DIGITAL_AGENCY // v2026.1.0</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-rose">EXPERIMENT_CORE</span>
              <span className="font-mono text-[9px] opacity-40">COORDINATES: [51.5074° N, 0.1278° W]</span>
            </div>
          </div>

          {/* Central Portal Geometric Grid */}
          <div className="flex flex-col items-center justify-center relative my-auto">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className={`absolute inset-0 rounded-full border-2 border-dashed ${
                  darkMode ? 'border-white/10' : 'border-bg-dark/10'
                }`}
              />

              {/* Middle pulsing square */}
              <motion.div
                animate={{ scale: [0.9, 1.1, 0.9], rotate: -45 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className={`absolute w-32 h-32 border border-accent-rose/30 ${
                  darkMode ? 'border-white/20' : 'border-bg-dark/20'
                }`}
              />

              {/* Core responsive circle */}
              <motion.div
                style={{ scale: 0.2 + (progress / 100) * 0.8 }}
                className="absolute w-24 h-24 rounded-full bg-radial from-accent-rose/25 via-accent-violet/5 to-transparent flex items-center justify-center"
              />

              {/* Number readout */}
              <span className="font-display font-black text-4xl sm:text-5xl tracking-tighter relative z-10 font-mono">
                {progress.toString().padStart(3, '0')}
              </span>
            </div>
          </div>

          {/* Bottom Diagnostics Readout */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
            <div className="flex flex-col max-w-sm">
              <span className="font-mono text-[11px] text-accent-rose font-bold mb-1">// SYSTEM_STATUS</span>
              <span className="font-mono text-xs tracking-wider uppercase h-6 overflow-hidden">
                {activeStep}
              </span>
            </div>

            {/* Custom high-end loading bar */}
            <div className="flex flex-col items-end gap-1.5 w-full sm:w-64">
              <div className="flex justify-between w-full font-mono text-[10px] opacity-40">
                <span>BUFFER_STREAM</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-[3px] rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-bg-dark/10'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent-rose via-accent-violet to-accent-lime"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
