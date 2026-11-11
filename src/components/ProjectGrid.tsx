import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Plus } from 'lucide-react';
import { projectsData } from '../data';
import type { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectGridProps {
  onSelectProject: (project: Project) => void;
}

export default function ProjectGrid({ onSelectProject }: ProjectGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger once pinned hero above is measured
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => clearTimeout(refreshTimer);
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-showcase-row').forEach((row) => {
        const header = row.querySelector('.project-row-header');
        const cards = row.querySelectorAll('.project-subcard');

        // Safe reveal without locking elements into opacity: 0
        if (header) {
          gsap.fromTo(
            header,
            { y: 30, opacity: 0.2 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 35, opacity: 0.3 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'all',
              scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Map each project to its 3 curated sub-visuals
  const getSubVisuals = (project: Project) => {
    if (project.id === 'luxel-bookings') {
      return [
        { img: project.heroImage, label: 'Campaign Billboard' },
        { img: project.galleryImages?.[2] || project.heroImage, label: 'Mobile App Platform' },
        { img: project.galleryImages?.[7] || project.galleryImages?.[1] || project.heroImage, label: 'VIP Card & Livery' },
      ];
    }
    if (project.id === 'amolo') {
      return [
        { img: project.heroImage, label: 'Editorial Model' },
        { img: project.galleryImages?.[1] || project.heroImage, label: 'Outerwear Line' },
        { img: project.galleryImages?.[0] || project.heroImage, label: 'Woven Monogram Tag' },
      ];
    }
    // Green Valley
    return [
      { img: project.heroImage, label: 'Flagship Identity' },
      { img: project.galleryImages?.[7] || project.heroImage, label: 'Digital App Experience' },
      { img: project.galleryImages?.[1] || project.heroImage, label: 'Fleet & Vehicle Branding' },
    ];
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 md:py-44 px-6 md:px-12 lg:px-16 bg-[#090b0a] text-white z-30 font-grotesk overflow-hidden"
      id="projects"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24">
          <div>
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#6ee05a] mb-3">
              Selected Work
            </p>
            <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
              Projects that <span className="text-[#6ee05a]">speak</span> for themselves.
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base font-sans max-w-md leading-relaxed">
            Click into any project to explore the strategy, craft, and real-world results behind each engagement.
          </p>
        </div>

        {/* Project Rows */}
        <div className="space-y-20 md:space-y-28">
          {projectsData.map((project, i) => {
            const visuals = getSubVisuals(project);
            return (
              <div
                key={project.id}
                className="project-showcase-row border-t border-white/10 pt-10 md:pt-14 group/row"
              >
                {/* Row Header: Category Pill, Huge Title & View Project Action */}
                <div 
                  onClick={() => onSelectProject(project)}
                  className="project-row-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 cursor-pointer"
                >
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] text-gray-300 text-[11px] font-mono tracking-widest uppercase mb-4">
                      <span>{project.category.split(' & ')[0]}</span>
                      <span className="text-white/20">&bull;</span>
                      <span className="text-gray-400">{project.year}</span>
                    </div>

                    <h3 className="font-display font-normal text-3xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight group-hover/row:text-[#6ee05a] transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 md:pb-2">
                    <span className="text-sm font-sans text-gray-400 group-hover/row:text-white transition-colors underline underline-offset-4 decoration-white/20 group-hover/row:decoration-[#6ee05a]">
                      View project
                    </span>
                    <div className="w-10 h-10 rounded-full border border-[#6ee05a]/40 bg-[#6ee05a]/10 text-[#6ee05a] flex items-center justify-center transition-all duration-300 group-hover/row:scale-110 group-hover/row:bg-[#6ee05a] group-hover/row:text-black">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>

                {/* Sub Inner Visuals Grid (3 Distinct Cards with Smooth Hover Zoom) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  {visuals.map((visual, vIdx) => (
                    <div
                      key={vIdx}
                      onClick={() => onSelectProject(project)}
                      className="project-subcard group/card relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] bg-[#121614] border border-white/[0.08] cursor-pointer transition-all duration-500 hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                    >
                      <img
                        src={visual.img}
                        alt={visual.label}
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06] ${
                          project.id === 'amolo' && vIdx === 0 ? 'object-[center_25%]' : ''
                        }`}
                      />
                      
                      {/* Subtle Vignette Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover/card:opacity-50 transition-opacity duration-300" />

                      {/* Floating Micro-Badge */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-mono text-white/70 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          {visual.label}
                        </span>
                        
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <Plus size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
