/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ViewState, CursorState } from '../types';
import { audioEngine } from '../utils/audio';
import { Volume2, VolumeX, Moon, Sun, Menu, X, Disc } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  setCursor: (state: CursorState) => void;
}

export default function Navigation({
  currentView,
  onNavigate,
  darkMode,
  onToggleTheme,
  setCursor,
}: NavigationProps) {
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state with audio engine
  useEffect(() => {
    setSoundActive(audioEngine.getIsEnabled());
  }, []);

  const handleToggleSound = () => {
    const active = audioEngine.toggle();
    setSoundActive(active);
    audioEngine.triggerClick();
    setCursor({ type: 'sound', text: active ? 'ON' : 'MUTED' });
  };

  const handleNavigate = (view: ViewState) => {
    audioEngine.triggerTransition();
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleHoverElement = (e: React.MouseEvent, text?: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type: 'magnetic', text });
  };

  const navItems: { label: string; view: ViewState }[] = [
    { label: 'PORTFOLIO', view: 'archive' },
    { label: 'ABOUT', view: 'manifesto' },
    { label: 'CONTACT', view: 'contact' },
  ];

  return (
    <>
      {/* Floating Main Header */}
      <header
        id="master-creative-header"
        className={`fixed top-0 left-0 w-full z-[40] flex items-center justify-between px-6 sm:px-12 py-6 border-b backdrop-blur-md transition-colors ${
          darkMode 
            ? 'bg-bg-dark/85 border-white/5 text-white' 
            : 'bg-bg-light/85 border-bg-dark/5 text-bg-dark'
        }`}
      >
        {/* Logo Brand Title */}
        <div
          onClick={() => handleNavigate('landing')}
          onMouseEnter={(e) => handleHoverElement(e, 'CORE')}
          onMouseLeave={() => setCursor({ type: 'default' })}
          className="flex items-center gap-2.5 cursor-none group relative z-50"
        >
          <motion.div
            animate={{ rotate: soundActive ? 360 : 0 }}
            transition={soundActive ? { repeat: Infinity, duration: 4, ease: 'linear' } : { duration: 0.5 }}
            className="text-accent-rose flex items-center justify-center"
          >
            <Disc size={20} className="stroke-[2.5]" />
          </motion.div>
          <span className="font-display font-black text-xl tracking-wider uppercase leading-none group-hover:text-accent-rose transition-colors duration-300 select-none">
            QOLAB
          </span>
          <span className="font-mono text-[9px] border border-accent-rose/20 bg-accent-rose/5 px-1.5 py-0.5 rounded text-accent-rose hidden md:inline font-bold">
            DIGITAL
          </span>
        </div>

        {/* Desktop Menu selectors */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavigate(item.view)}
                onMouseEnter={(e) => handleHoverElement(e, 'VIEW')}
                onMouseLeave={() => setCursor({ type: 'default' })}
                className={`font-mono text-xs font-bold uppercase tracking-widest relative py-1 cursor-none transition-colors duration-300 ${
                  isActive ? 'text-accent-rose font-black' : 'opacity-65 hover:opacity-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-line-tracker"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-rose rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Widgets panel (Theme + Spatial Sound) */}
        <div className="flex items-center gap-3 relative z-50">
          {/* Spatial Equalizer Sound Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={(e) => handleHoverElement(e, soundActive ? 'MUTE' : 'PLAY')}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-none relative ${
              soundActive 
                ? 'bg-accent-lime/15 border-accent-lime text-accent-lime' 
                : 'opacity-55 hover:opacity-100'
            } ${darkMode ? 'border-white/10 text-white' : 'border-bg-dark/10 text-bg-dark'}`}
          >
            {soundActive ? (
              /* High end animating sound bar waves */
              <div className="flex items-end gap-[2px] h-3">
                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-accent-lime rounded-full" />
                <motion.div animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[2px] bg-accent-lime rounded-full" />
                <motion.div animate={{ height: [5, 11, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-accent-lime rounded-full" />
              </div>
            ) : (
              <VolumeX size={15} />
            )}
          </button>

          {/* Theme switcher toggle */}
          <button
            onClick={onToggleTheme}
            onMouseEnter={(e) => handleHoverElement(e, 'SHAPE')}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-none ${
              darkMode 
                ? 'border-white/10 hover:bg-white/5 text-white' 
                : 'border-bg-dark/10 hover:bg-bg-dark/5 text-bg-dark'
            }`}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => { audioEngine.triggerClick(); setMobileMenuOpen(!mobileMenuOpen); }}
            onMouseEnter={(e) => handleHoverElement(e, mobileMenuOpen ? 'CLOSE' : 'MENU')}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className={`w-10 h-10 rounded-full border md:hidden flex items-center justify-center transition-all duration-300 cursor-none ${
              darkMode ? 'border-white/10 hover:bg-white/5' : 'border-bg-dark/10 hover:bg-bg-dark/5'
            }`}
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer panel overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`fixed inset-0 w-full h-full z-[30] pt-28 px-8 flex flex-col justify-between pb-12 select-none ${
            darkMode ? 'bg-bg-dark text-white' : 'bg-bg-light text-bg-dark'
          }`}
        >
          <div className="flex flex-col gap-6 mt-12">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigate(item.view)}
                  className={`font-display font-black text-4xl text-left uppercase tracking-tighter leading-none ${
                    isActive ? 'text-accent-rose' : 'opacity-60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-6">
            <div className="flex flex-col font-mono text-[9px] opacity-40 uppercase">
              <span>QOLAB // BRAND DESIGN & DEVELOPMENT</span>
              <span>EST. 2026 // AGENCY</span>
            </div>
            
            <button
              onClick={() => handleNavigate('landing')}
              className="font-mono text-[10px] text-accent-rose font-bold uppercase tracking-widest border-b border-accent-rose cursor-none"
            >
              BACK TO HOME
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
