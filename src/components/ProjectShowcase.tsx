import { useEffect, useRef } from 'react';
import { Project } from '../types';
import { projectsData } from '../data';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';

interface ProjectShowcaseProps {
  onSelectProject: (project: Project) => void;
  onBack: () => void;
}

export default function ProjectShowcase({ onSelectProject, onBack }: ProjectShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP entrance animation for projects grid
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.archive-item', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#faf7f2] pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Top Header Controls */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-black/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#108a93] hover:text-[#159da8] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
          {projectsData.length} Case Studies Available
        </span>
      </div>

      {/* Main Title */}
      <div className="max-w-6xl mx-auto text-left mb-16">
        <span className="font-mono text-xs text-[#108a93] font-bold uppercase tracking-widest block mb-4">
          // Selected Portfolio
        </span>
        <h1 className="font-display text-5xl sm:text-7xl md:text-[5.5rem] tracking-tight leading-[0.95] text-black">
          Selected <span className="italic font-light text-black/80">Works</span>
        </h1>
        <p className="font-sans text-lg text-gray-600 mt-4 max-w-xl">
          A collection of digital solutions, brand identities, and mobile applications built with technical precision.
        </p>
      </div>

      {/* Project Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {projectsData.map((project) => {
          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="archive-item flex flex-col gap-4"
            >
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-between p-8 text-white z-10" style={{ backgroundColor: project.accentColor }}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-wider font-semibold">{project.category}</span>
                    <ArrowUpRight size={24} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display italic">{project.title}</h3>
                    <p className="text-sm opacity-95 mt-2">{project.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div>
                  <h4 className="font-bold text-lg text-black">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">{project.year}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

