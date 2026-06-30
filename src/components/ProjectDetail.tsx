/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Project, CursorState } from '../types';
import { audioEngine } from '../utils/audio';
import { ArrowLeft, Clock, Award, CheckCircle, ExternalLink, Globe } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  setCursor: (state: CursorState) => void;
  darkMode: boolean;
}

export default function ProjectDetail({ project, onBack, setCursor, darkMode }: ProjectDetailProps) {
  
  const handleBackClick = () => {
    audioEngine.triggerClick();
    onBack();
  };

  const handleHoverElement = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type: 'magnetic' });
  };

  return (
    <motion.div
      id="project-detail-layout"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className={`min-h-screen w-full relative z-20 pb-32 pt-20 px-6 sm:px-16 select-none ${
        darkMode ? 'bg-bg-dark text-white' : 'bg-bg-light text-bg-dark'
      }`}
    >
      {/* Floating Magnetic Back Button */}
      <button
        onClick={handleBackClick}
        onMouseEnter={handleHoverElement}
        onMouseLeave={() => setCursor({ type: 'default' })}
        className={`fixed top-8 left-6 sm:left-12 z-50 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 ${
          darkMode 
            ? 'bg-white/5 border-white/10 text-white hover:bg-accent-rose hover:border-accent-rose' 
            : 'bg-bg-light/80 border-bg-dark/10 text-bg-dark hover:bg-accent-rose hover:border-accent-rose hover:text-white'
        }`}
      >
        <ArrowLeft size={14} />
        <span className="font-mono text-xs font-bold tracking-wider uppercase">BACK TO ALL WORK</span>
      </button>

      {/* Hero Visual Section */}
      <div className="w-full flex flex-col pt-12 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
          <div className="flex flex-col max-w-3xl">
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-2">// DETAILED CASE STUDY</span>
            <h1 className="font-display font-black text-5xl sm:text-7xl uppercase tracking-tighter leading-none">
              {project.title}
            </h1>
            <p className="font-mono text-sm sm:text-lg opacity-60 mt-3 uppercase tracking-wide">
              {project.subtitle}
            </p>
          </div>

          <div className="flex flex-col font-mono text-xs opacity-50 text-right self-end">
            <span>CLIENT: {project.client}</span>
            <span>YEAR: {project.year}</span>
          </div>
        </div>

        {/* Big Parallax Hero Image banner */}
        <div className={`w-full aspect-video rounded-3xl overflow-hidden relative border shadow-2xl ${
          darkMode ? 'border-white/5' : 'border-bg-dark/10'
        }`}>
          <img
            src={project.heroImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.8] scale-105 transition-transform duration-[1.5s] ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Metadata Metrics Row */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl border mb-20 ${
        darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5'
      }`}>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] opacity-40 uppercase mb-1">OUR ROLE</span>
          <span className="font-sans text-xs font-semibold uppercase leading-tight">{project.role}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] opacity-40 uppercase mb-1">SECTOR</span>
          <span className="font-sans text-xs font-semibold uppercase leading-tight">{project.category}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] opacity-40 uppercase mb-1">TIMELINE</span>
          <span className="font-sans text-xs font-semibold uppercase leading-tight">{project.year}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] opacity-40 uppercase mb-1">SKILLS & SERVICE</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.tech.map((t, idx) => (
              <span key={idx} className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-accent-rose/20 bg-accent-rose/5 text-accent-rose">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Narrative Split Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
        {/* Left Side: Editorial Overview */}
        <div className="lg:col-span-4 flex flex-col">
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-accent-rose mb-4">
            SYNOPSIS
          </h3>
          <p className="font-sans text-sm sm:text-base opacity-75 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-accent-rose" />
              <span className="font-mono text-xs opacity-75">100% SECURE ARCHITECTURE</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={16} className="text-accent-rose" />
              <span className="font-mono text-xs opacity-75">AWWWARDS RECOGNIZED SYSTEM</span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Challenge vs Solution */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          {/* Challenge Box */}
          <div className={`p-8 rounded-3xl border ${
            darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5'
          }`}>
            <h4 className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-3">
              // DESIGN_CHALLENGE
            </h4>
            <p className="font-sans text-sm sm:text-base opacity-80 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Solution Box */}
          <div className={`p-8 rounded-3xl border ${
            darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5'
          }`}>
            <h4 className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-3">
              // RE-ENGINEERED_SOLUTION
            </h4>
            <p className="font-sans text-sm sm:text-base opacity-80 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Results & Metrics Section */}
      <div className={`flex flex-col mb-24 border-t pt-16 ${
        darkMode ? 'border-white/5' : 'border-bg-dark/10'
      }`}>
        <h3 className="font-display font-black text-3xl uppercase tracking-tighter text-accent-rose mb-10 text-center">
          CORE IMPACT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {project.results.map((result, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border flex gap-4 items-start ${
                darkMode ? 'bg-white/3 border-white/5 hover:bg-white/5' : 'bg-bg-dark/3 border-bg-dark/5'
              }`}
            >
              <CheckCircle size={20} className="text-accent-rose flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-accent-rose mb-1">METRIC_0{idx + 1}</span>
                <span className="font-sans text-xs opacity-80 leading-relaxed">{result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Parallax Gallery Layout */}
      <div className="flex flex-col gap-8 mb-16">
        <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-accent-rose mb-2">
          VISUAL COMPILATION
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {project.galleryImages.map((img, idx) => (
            <div key={idx} className={`aspect-square rounded-2xl overflow-hidden border shadow-lg group ${
              darkMode ? 'border-white/5' : 'border-bg-dark/10'
            }`}>
              <img
                src={img}
                alt={`Gallery-${idx}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale hover:grayscale-0 filter brightness-[0.8] hover:scale-105 transition-all duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next Case Study Footer Trigger */}
      <div className={`flex flex-col items-center justify-center pt-16 border-t ${
        darkMode ? 'border-white/5' : 'border-bg-dark/10'
      }`}>
        <span className="font-mono text-xs opacity-40 uppercase tracking-widest mb-2">FINISHED_READING</span>
        <button
          onClick={handleBackClick}
          onMouseEnter={handleHoverElement}
          onMouseLeave={() => setCursor({ type: 'default' })}
          className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter text-center border-b border-accent-rose hover:text-accent-rose hover:border-transparent transition-all duration-300"
        >
          RETURN_TO_THE_ARCHIVE
        </button>
      </div>
    </motion.div>
  );
}
