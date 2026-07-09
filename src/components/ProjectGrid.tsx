import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../data';
import type { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectGridProps {
  onSelectProject: (project: Project) => void;
}

export default function ProjectGrid({ onSelectProject }: ProjectGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);

  // Magnetic cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const text = cursorTextRef.current;
    if (!cursor || !text) return;

    const moveCursor = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-project-card]');
      if (target) {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.35,
          ease: 'power2.out',
        });
      } else {
        gsap.to(cursor, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.out' });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // GSAP parallax + scroll-triggered animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance stagger
      gsap.from('.pg-card', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // Parallax: left cards slower, right cards faster
      gsap.utils.toArray('.pg-card').forEach((card: any) => {
        const isLeft = card.dataset.col === 'left';
        const speed = isLeft ? -12 : 14;

        gsap.fromTo(card, { y: 0 }, {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      // Inner image parallax — image shifts inside clipped container
      gsap.utils.toArray('.pg-image-wrap').forEach((wrap: any) => {
        const img = wrap.querySelector('.pg-image');
        if (!img) return;
        gsap.fromTo(img, { y: -30 }, {
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Card structure: left col gets pt-24 offset for stagger
  const leftProjects = projectsData.filter((_, i) => i % 2 === 0);
  const rightProjects = projectsData.filter((_, i) => i % 2 === 1);

  const renderCard = (project: Project, col: 'left' | 'right', index: number) => (
    <div
      key={project.id}
      data-project-card
      data-col={col}
      onClick={() => onSelectProject(project)}
      className={`pg-card group cursor-pointer ${col === 'left' && index > 0 ? 'pt-24 md:pt-32' : ''}`}
    >
      {/* Image frame */}
      <div className="pg-image-wrap relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5]">
        <img
          src={project.heroImage}
          alt={project.title}
          className="pg-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Metadata */}
      <div className="mt-5 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-slate-400">
            {String(index + 1).padStart(2, '0')} / {project.category.split(' ')[0]}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-[0.95] tracking-tighter mt-1.5">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-sans leading-relaxed max-w-xs">
            {project.subtitle}
          </p>
        </div>
        <span className="font-mono text-xs tracking-wider text-slate-400 mt-1 flex-shrink-0">
          {project.year}
        </span>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#f5f3ef] z-30"
      id="projects"
    >
      {/* Magnetic cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[100] flex items-center justify-center w-28 h-28 rounded-full bg-slate-900 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold"
        style={{
          opacity: 0,
          scale: 0.8,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <span ref={cursorTextRef} className="block">View Case</span>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-slate-400 mb-3">
            Selected Work
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-slate-900 leading-[0.88] tracking-tighter">
            Projects that<br />speak for themselves
          </h2>
        </div>

        {/* Asymmetric staggered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left column — offset cards */}
          <div className="flex flex-col gap-12 md:gap-16">
            {leftProjects.map((p, i) => renderCard(p, 'left', i))}
          </div>

          {/* Right column — staggered start */}
          <div className="flex flex-col gap-12 md:gap-16 pt-0 md:pt-24">
            {rightProjects.map((p, i) => renderCard(p, 'right', i))}
          </div>
        </div>
      </div>
    </section>
  );
}
