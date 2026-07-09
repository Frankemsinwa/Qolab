import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../data';
import type { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectEditorialProps {
  onSelectProject: (project: Project) => void;
  onViewAll: () => void;
}

export default function ProjectEditorial({ onSelectProject, onViewAll }: ProjectEditorialProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const floatImgRef = useRef<HTMLImageElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velocityX = useRef(0);
  const quickToX = useRef<((v: number) => void) | null>(null);
  const quickToY = useRef<((v: number) => void) | null>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  // Setup quickTo + hide initially
  useEffect(() => {
    if (!floatRef.current) return;
    quickToX.current = gsap.quickTo(floatRef.current, 'x', { duration: 0.55, ease: 'power3.out' });
    quickToY.current = gsap.quickTo(floatRef.current, 'y', { duration: 0.55, ease: 'power3.out' });
    gsap.set(floatRef.current, { opacity: 0, scale: 0.4 });
  }, []);

  // RAF loop — handles position + tilt
  useEffect(() => {
    const tick = () => {
      if (activeRef.current && floatRef.current && floatImgRef.current) {
        const dx = mouseX.current - lastX.current;
        const dy = mouseY.current - lastY.current;
        velocityX.current += (dx - velocityX.current) * 0.06;
        lastX.current = mouseX.current;
        lastY.current = mouseY.current;

        if (quickToX.current) quickToX.current(mouseX.current);
        if (quickToY.current) quickToY.current(mouseY.current);

        const tilt = Math.max(-8, Math.min(8, velocityX.current * 0.05));
        gsap.set(floatImgRef.current, { rotate: tilt, scale: 1 + Math.abs(tilt) * 0.003 });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Global mousemove
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseX.current = e.clientX - 160;
    mouseY.current = e.clientY - 120;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  const handleEnter = useCallback((idx: number) => {
    setActiveIndex(idx);
    activeRef.current = true;
    const rect = projectsData[idx];
    if (floatImgRef.current) floatImgRef.current.src = rect.heroImage;
    if (floatRef.current) {
      gsap.set(floatRef.current, { opacity: 1, scale: 1 });
    }
  }, []);

  const handleLeave = useCallback(() => {
    setActiveIndex(null);
    activeRef.current = false;
    if (floatRef.current) {
      gsap.set(floatRef.current, { opacity: 0, scale: 0.4 });
    }
  }, []);

  // ScrollTrigger entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pe-row', {
        y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#f5f3ef] z-30"
      id="projects"
    >
      {/* Floating preview */}
      <div
        ref={floatRef}
        className="fixed pointer-events-none z-50 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: 320,
          height: 240,
          willChange: 'transform',
        }}
      >
        <img
          ref={floatImgRef}
          alt=""
          className="w-full h-full object-cover"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 md:mb-24">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-slate-400 mb-4">
            Selected Work
          </p>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-slate-900 leading-[0.88] tracking-tighter">
              Projects that<br />speak<br className="hidden md:block" /> for themselves
            </h2>
            <button
              onClick={onViewAll}
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors font-sans"
            >
              View all work <span className="inline-block">→</span>
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="border-t border-slate-200">
          {projectsData.map((project, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                onMouseEnter={() => handleEnter(idx)}
                onMouseLeave={handleLeave}
                className="pe-row group flex items-center justify-between py-6 md:py-8 border-b border-slate-200 cursor-pointer transition-opacity duration-500"
                style={{ opacity: activeIndex === null || isActive ? 1 : 0.12 }}
              >
                {/* Left */}
                <div className="flex items-center gap-6 md:gap-10 w-[30%] md:w-[25%] flex-shrink-0">
                  <span className="font-mono text-xs tracking-widest text-slate-400 w-8 flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-slate-400 truncate hidden sm:block">
                    {project.category}
                  </span>
                </div>

                {/* Center */}
                <div className="flex-1 px-4 md:px-8">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-slate-900 leading-[0.9] tracking-tighter">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans md:hidden">{project.category}</p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 flex-shrink-0 w-[80px] justify-end">
                  <span className="font-mono text-xs tracking-wider text-slate-400">
                    {project.year}
                  </span>
                  <span className="text-slate-300 group-hover:text-slate-600 transition-colors text-sm hidden md:inline">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors font-sans"
          >
            View all work →
          </button>
        </div>
      </div>
    </section>
  );
}
