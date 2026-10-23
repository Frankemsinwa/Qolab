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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // Per-row reveal: slanted wipe from the top-left sweeping right across the shot
      const HIDDEN = 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)';
      const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

      gsap.utils.toArray<HTMLElement>('.pg-row').forEach((row) => {
        const shots = row.querySelectorAll<HTMLElement>('.pg-shot');
        const imgs = row.querySelectorAll<HTMLElement>('.pg-shot img');
        gsap.set(shots, { clipPath: HIDDEN });
        gsap.set(imgs, { scale: 1.15, transition: 'none' });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 78%', once: true },
        });
        tl.from(row, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0);
        shots.forEach((shot, i) => {
          const at = 0.12 + i * 0.22;
          tl.to(shot, { clipPath: FULL, duration: 1.1, ease: 'power3.inOut' }, at);
          const img = imgs[i];
          if (img) {
            tl.to(img, {
              scale: 1,
              duration: 1.4,
              ease: 'power2.out',
              clearProps: 'transform,transition',
            }, at);
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderRow = (project: Project) => (
    <div
      key={project.id}
      data-project-card
      data-cursor="view"
      data-cursor-text="View"
      onClick={() => onSelectProject(project)}
      className="pg-row group cursor-pointer border-t border-white/10 py-12 md:py-16"
    >
      {/* Row header — pill, title, link */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <span className="inline-block text-[11px] font-display font-semibold tracking-[0.18em] uppercase text-gray-300 border border-white/15 rounded-full px-4 py-1.5">
            {project.category.split(' & ')[0]}
          </span>
          <h3 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mt-4 group-hover:text-[#6ee05a] transition-colors duration-300">
            {project.title}
          </h3>
        </div>
        <span className="text-sm font-display text-gray-300 underline underline-offset-4 decoration-white/30 group-hover:decoration-[#6ee05a] transition-colors flex-shrink-0 md:pb-3">
          View project
        </span>
      </div>

      {/* Image — single cinematic strip of the project's own hero shot */}
      <div className="pg-shot relative overflow-hidden rounded-2xl aspect-[16/10] md:aspect-[21/9] bg-white/5">
        <img
          src={project.heroImage}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${project.galleryLayout === 'portrait' ? 'object-[center_30%]' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] z-30"
      id="projects"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <p className="font-display text-xs font-semibold tracking-[0.25em] uppercase text-[#6ee05a] mb-4">
            Selected Work
          </p>
          <h2 className="font-display font-normal text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9] tracking-tight">
            Projects that{' '}
            <span className="text-[#6ee05a]">speak</span>
            <br className="hidden sm:block" /> for themselves
          </h2>
        </div>

        {/* Case rows */}
        <div className="border-b border-white/10">
          {projectsData.map((p) => renderRow(p))}
        </div>
      </div>
    </section>
  );
}
