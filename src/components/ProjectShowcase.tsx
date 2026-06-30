/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, CursorState } from '../types';
import { projectsData } from '../data';
import { audioEngine } from '../utils/audio';
import { ArrowUpRight, Grid, Columns } from 'lucide-react';

interface ProjectShowcaseProps {
  onSelectProject: (project: Project) => void;
  setCursor: (state: CursorState) => void;
  darkMode: boolean;
}

export default function ProjectShowcase({ onSelectProject, setCursor, darkMode }: ProjectShowcaseProps) {
  const [layoutMode, setLayoutMode] = useState<'slider' | 'grid'>('slider');
  const [activeIdx, setActiveIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // For horizontal slider drag tracking
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (layoutMode !== 'slider' || !sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    setCursor({ type: 'drag', text: 'SLIDE' });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setCursor({ type: 'default' });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || layoutMode !== 'slider' || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    sliderRef.current.scrollLeft = scrollLeft - walk;

    // Approximate active card index from scroll position
    const cardWidth = 380; // approximate width + gap
    const index = Math.min(projectsData.length - 1, Math.max(0, Math.round(sliderRef.current.scrollLeft / cardWidth)));
    setActiveIdx(index);
  };

  // Sound triggering on project hover
  const handleProjectHover = (project: Project, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type: 'view', text: 'VIEW' });
  };

  const handleProjectClick = (project: Project) => {
    audioEngine.triggerClick();
    onSelectProject(project);
    setCursor({ type: 'default' });
  };

  return (
    <div id="project-archive-container" className="w-full flex flex-col pt-24 pb-16 px-6 sm:px-16 select-none relative z-10">
      {/* Header and Layout Mode Toggle */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b pb-6 ${
        darkMode ? 'border-white/5' : 'border-bg-dark/10'
      }`}>
        <div className="flex flex-col">
          <span className="font-mono text-xs text-accent-rose font-bold tracking-widest uppercase mb-1">
            // CREATIVE PORTFOLIO
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tighter uppercase leading-none">
            SELECTED WORKS
          </h2>
        </div>

        {/* Layout toggle switches */}
        <div className={`flex items-center gap-1.5 p-1 rounded-full border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-bg-dark/5 border-bg-dark/10'
        }`}>
          <button
            onClick={() => { audioEngine.triggerClick(); setLayoutMode('slider'); }}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
              layoutMode === 'slider' 
                ? 'bg-accent-rose text-white shadow-md' 
                : 'opacity-50 hover:opacity-100'
            }`}
            onMouseEnter={() => setCursor({ type: 'hover' })}
            onMouseLeave={() => setCursor({ type: 'default' })}
          >
            <Columns size={12} />
            SLIDER
          </button>
          <button
            onClick={() => { audioEngine.triggerClick(); setLayoutMode('grid'); }}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
              layoutMode === 'grid' 
                ? 'bg-accent-rose text-white shadow-md' 
                : 'opacity-50 hover:opacity-100'
            }`}
            onMouseEnter={() => setCursor({ type: 'hover' })}
            onMouseLeave={() => setCursor({ type: 'default' })}
          >
            <Grid size={12} />
            GRID
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {layoutMode === 'slider' ? (
          /* --- DESIGN 1: IMMERSIVE HORIZONTAL SLIDER --- */
          <motion.div
            key="slider-view"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="w-full flex flex-col"
          >
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-8 overflow-x-auto pb-8 pt-4 select-none snap-x snap-mandatory scroll-smooth cursor-grab ${
                isDragging ? 'cursor-grabbing' : ''
              }`}
              style={{ scrollbarWidth: 'none' }}
            >
              {projectsData.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => !isDragging && handleProjectClick(project)}
                  onMouseEnter={(e) => handleProjectHover(project, e)}
                  onMouseLeave={() => setCursor({ type: 'default' })}
                  className="flex-shrink-0 w-[290px] sm:w-[380px] snap-center cursor-none group relative"
                >
                  {/* Huge brutalist index marker */}
                  <span className={`absolute -top-6 -left-3 font-display font-black text-6xl opacity-20 group-hover:opacity-40 group-hover:-translate-y-2 transition-all duration-500 font-mono ${
                    darkMode ? 'text-outline' : 'text-outline-light'
                  }`}>
                    {`0${idx + 1}`}
                  </span>

                  {/* Visual card */}
                  <div className={`relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border ${
                    darkMode ? 'border-white/10' : 'border-bg-dark/10'
                  }`}>
                    {/* Parallax Image Overlay */}
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter grayscale group-hover:grayscale-0 brightness-[0.75] group-hover:brightness-[0.95]"
                    />

                    {/* Colored overlay tinting */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-accent-rose mb-1">
                            {project.category}
                          </span>
                          <h3 className="font-display font-black text-2xl uppercase tracking-tighter leading-tight group-hover:text-accent-rose transition-colors">
                            {project.title}
                          </h3>
                          <span className="font-sans text-xs opacity-60 line-clamp-1 mt-1 max-w-xs">
                            {project.subtitle}
                          </span>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-accent-rose group-hover:border-accent-rose group-hover:rotate-45 transition-all duration-500">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider progress status */}
            <div className="flex justify-between items-center mt-6 w-full">
              <span className="font-mono text-[10px] opacity-40">
                DRAG OR SCROLL TO BROWSE PROJECTS
              </span>
              <div className="flex items-center gap-3">
                {projectsData.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeIdx === i ? 'w-8 bg-accent-rose' : `w-2 ${darkMode ? 'bg-white/20' : 'bg-bg-dark/20'}`
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- DESIGN 2: HIGH-DENSITY BENTO GRID MATRIX --- */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
          >
            {projectsData.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                onMouseEnter={(e) => handleProjectHover(project, e)}
                onMouseLeave={() => setCursor({ type: 'default' })}
                className={`relative p-8 rounded-3xl border flex flex-col justify-between aspect-video sm:aspect-auto sm:min-h-[290px] group overflow-hidden transition-all duration-500 cursor-none ${
                  darkMode 
                    ? 'bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/5 shadow-2xl' 
                    : 'bg-bg-dark/3 border-bg-dark/5 hover:border-bg-dark/15 hover:bg-bg-dark/5 shadow-md'
                }`}
              >
                {/* Visual coordinate indicator in background */}
                <div className="absolute top-4 right-4 font-mono text-[9px] opacity-25">
                  [C_0{idx + 1} // 2026]
                </div>

                {/* Grid particle grid backplate visible on hover */}
                <div className="absolute inset-0 bg-radial from-accent-rose/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex flex-col relative z-10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent-rose mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tighter leading-none group-hover:text-accent-rose transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className={`font-sans text-xs mt-3 max-w-sm opacity-60 leading-relaxed`}>
                    {project.description}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-8 relative z-10">
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {project.tech.slice(0, 3).map((t, index) => (
                      <span key={index} className={`font-mono text-[9px] px-2.5 py-1 rounded-full border uppercase ${
                        darkMode ? 'border-white/10 bg-white/5' : 'border-bg-dark/10 bg-bg-dark/5'
                      }`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 group-hover:text-accent-rose transition-colors">
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                      DECRYP_CASE
                    </span>
                    <div className="w-8 h-8 rounded-full bg-accent-rose/10 flex items-center justify-center border border-accent-rose/20 group-hover:bg-accent-rose group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
