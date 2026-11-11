import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data';
import type { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectGridProps {
  onSelectProject: (project: Project) => void;
}

interface ArchSlot {
  id: string;
  img: string;
  labelTop?: string;
  labelBottom?: string;
  alt: string;
}

export default function ProjectGrid({ onSelectProject }: ProjectGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => clearTimeout(refreshTimer);
    }

    const ctx = gsap.context(() => {
      // Animate each architectural project block
      gsap.utils.toArray<HTMLElement>('.arch-project-block').forEach((block) => {
        const hLines = block.querySelectorAll('.arch-line-h');
        const vLines = block.querySelectorAll('.arch-line-v');
        const frames = block.querySelectorAll('.arch-frame');
        const crosshairs = block.querySelectorAll('.arch-crosshair');

        // 1. Entrance timeline: draw lines and snap frames
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            once: true,
          },
        });

        if (hLines.length) {
          entranceTl.fromTo(
            hLines,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.inOut' },
            0
          );
        }

        if (vLines.length) {
          entranceTl.fromTo(
            vLines,
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.inOut' },
            0.1
          );
        }

        if (crosshairs.length) {
          entranceTl.fromTo(
            crosshairs,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' },
            0.5
          );
        }

        if (frames.length) {
          entranceTl.fromTo(
            frames,
            { opacity: 0.3, y: 20 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'power2.out', clearProps: 'all' },
            0.3
          );
        }

        // 2. Buttery Smooth Column Parallax on desktop
        if (window.innerWidth >= 768) {
          const col1 = block.querySelector('.arch-col-1');
          const col2 = block.querySelector('.arch-col-2');
          const col3 = block.querySelector('.arch-col-3');
          const col4 = block.querySelector('.arch-col-4');
          const col5 = block.querySelector('.arch-col-5');

          const parallaxTl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });

          if (col1) parallaxTl.to(col1, { y: 35, ease: 'none' }, 0);
          if (col2) parallaxTl.to(col2, { y: -30, ease: 'none' }, 0);
          if (col3) parallaxTl.to(col3, { y: -50, ease: 'none' }, 0);
          if (col4) parallaxTl.to(col4, { y: 25, ease: 'none' }, 0);
          if (col5) parallaxTl.to(col5, { y: -20, ease: 'none' }, 0);
        }
      });
    }, sectionRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Curate 6 architectural slots per project matching the reference image composition
  const getArchSlots = (project: Project): Record<string, ArchSlot> => {
    if (project.id === 'luxel-bookings') {
      return {
        slot1: {
          id: 'lux-1',
          img: project.galleryImages?.[3] || project.heroImage,
          labelTop: '01 / AMBIENCE',
          labelBottom: 'THE COLORS OF FLIGHT',
          alt: 'VIP Stationery & Cards',
        },
        slot2: {
          id: 'lux-2',
          img: project.galleryImages?.[2] || project.heroImage,
          labelTop: 'IN YOUR GAZE',
          labelBottom: 'BOOKING APP INTERFACE',
          alt: 'Mobile Flight Booking Platform',
        },
        slot3: {
          id: 'lux-3',
          img: project.galleryImages?.[1] || project.heroImage,
          labelTop: 'VENICE DREAM',
          labelBottom: 'PACIFIC HORIZON',
          alt: 'Private Jet Livery',
        },
        slot4A: {
          id: 'lux-4a',
          img: project.heroImage,
          labelTop: 'FLAGSHIP HORIZON',
          alt: 'Global Billboard Campaign',
        },
        slot4B: {
          id: 'lux-4b',
          img: project.galleryImages?.[4] || project.heroImage,
          labelBottom: 'TERMINAL CURATION',
          alt: 'Airport Terminal Media',
        },
        slot5: {
          id: 'lux-5',
          img: project.galleryImages?.[7] || project.heroImage,
          labelTop: 'SUMMER RETREAT',
          alt: 'Black & Gold Membership Card',
        },
      };
    }

    if (project.id === 'amolo') {
      return {
        slot1: {
          id: 'amolo-1',
          img: project.galleryImages?.[0] || project.heroImage,
          labelTop: '02 / ORIGIN',
          labelBottom: 'WOVEN MONOGRAM SEAL',
          alt: 'Amolo Woven Tag',
        },
        slot2: {
          id: 'amolo-2',
          img: project.heroImage,
          labelTop: 'IN YOUR EYES',
          labelBottom: 'LAGOS × MILAN EDITORIAL',
          alt: 'Editorial Trenchcoat Model',
        },
        slot3: {
          id: 'amolo-3',
          img: project.galleryImages?.[1] || project.heroImage,
          labelTop: 'VERONA DUSK',
          labelBottom: 'PACIFIC SILHOUETTE',
          alt: 'Italian Outerwear Collection',
        },
        slot4A: {
          id: 'amolo-4a',
          img: project.galleryImages?.[4] || project.heroImage,
          labelTop: 'TAILORED DISCIPLINE',
          alt: 'Milanese Tailored Suit',
        },
        slot4B: {
          id: 'amolo-4b',
          img: project.galleryImages?.[6] || project.heroImage,
          labelBottom: 'STREET HEAVYWEIGHT',
          alt: 'Maroon Monogram Tee',
        },
        slot5: {
          id: 'amolo-5',
          img: project.galleryImages?.[5] || project.heroImage,
          labelTop: 'SUMMER CAPSULE',
          alt: 'Storefront & Signage',
        },
      };
    }

    // Green Valley
    return {
      slot1: {
        id: 'gv-1',
        img: project.galleryImages?.[4] || project.heroImage,
        labelTop: '03 / FOUNDATION',
        labelBottom: 'STATIONERY EMBOSS',
        alt: 'Embossed Cards & Identity',
      },
      slot2: {
        id: 'gv-2',
        img: project.galleryImages?.[6] || project.heroImage,
        labelTop: 'IN YOUR VIEW',
        labelBottom: 'PORTFOLIO APP EXPERIENCE',
        alt: 'Real Estate App Experience',
      },
      slot3: {
        id: 'gv-3',
        img: project.heroImage,
        labelTop: 'VALLEY DAWN',
        labelBottom: 'PACIFIC ACRES',
        alt: 'Flagship Valley Architecture',
      },
      slot4A: {
        id: 'gv-4a',
        img: project.galleryImages?.[1] || project.heroImage,
        labelTop: 'URBAN MOBILITY',
        alt: 'Branded Fleet Livery',
      },
      slot4B: {
        id: 'gv-4b',
        img: project.galleryImages?.[0] || project.heroImage,
        labelBottom: 'ENVIRONMENTAL PRESENCE',
        alt: 'Outdoor Property Banners',
      },
      slot5: {
        id: 'gv-5',
        img: project.galleryImages?.[2] || project.heroImage,
        labelTop: 'SUMMER LIVING',
        alt: 'Editorial Property Brochure',
      },
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 md:py-44 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#080a09] text-white z-30 font-grotesk overflow-hidden"
      id="projects"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 md:mb-28 border-b border-white/10 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-mono tracking-[0.2em] uppercase text-[#6ee05a] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ee05a] animate-pulse" />
              <span>Architectural Showcase // 01–03</span>
            </div>
            <h2 className="font-display font-normal text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[0.98]">
              Selected <span className="text-[#6ee05a]">Engagements.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base font-sans max-w-md leading-relaxed">
            Curated through a De Stijl architectural grid — where each discipline, visual asset, and digital interface intersects with intent.
          </p>
        </div>

        {/* Project Blocks */}
        <div className="space-y-36 md:space-y-48">
          {projectsData.map((project, idx) => {
            const slots = getArchSlots(project);
            const num = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={project.id}
                className="arch-project-block relative group/project"
              >
                {/* Project Header Bar with Overshooting Top Hairline */}
                <div className="relative mb-12 sm:mb-16">
                  {/* Subtle Accent Line */}
                  <div className="arch-line-h w-full h-[1px] bg-white/15 origin-left mb-6" />

                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-sm sm:text-base text-[#6ee05a] tracking-widest">
                        [{num}]
                      </span>
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="font-display font-normal text-3xl sm:text-5xl md:text-6xl text-white tracking-tight cursor-pointer hover:text-[#6ee05a] transition-colors duration-300"
                      >
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-gray-400">
                        {project.category.split(' & ')[0]} &bull; {project.year}
                      </span>
                      <button
                        onClick={() => onSelectProject(project)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-white hover:text-[#6ee05a] transition-colors group/btn"
                      >
                        <span className="underline underline-offset-4 decoration-white/30 group-hover/btn:decoration-[#6ee05a]">
                          Case Study
                        </span>
                        <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-[#6ee05a] group-hover/btn:bg-[#6ee05a]/10 transition-colors">
                          <ArrowUpRight size={13} className="text-[#6ee05a]" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* DESKTOP ARCHITECTURAL GRID (Exact layout from uploaded reference) */}
                {/* ============================================================== */}
                <div 
                  onClick={() => onSelectProject(project)}
                  className="hidden md:block relative w-full h-[580px] lg:h-[640px] cursor-pointer"
                >
                  
                  {/* --- Column 1: Lower Left Landscape Anchor --- */}
                  <div className="arch-col-1 absolute left-[1%] w-[21%] top-[48%] h-[48%] group/c1">
                    {/* Overshooting Horizontal Hairline (left into margin) */}
                    <div className="arch-line-h absolute top-0 -left-12 lg:-left-20 right-0 h-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-left" />
                    {/* Micro Typography on Line */}
                    <span className="absolute -top-5 left-0 text-[10px] font-mono tracking-widest uppercase text-white/50">
                      {slots.slot1.labelTop}
                    </span>
                    <span className="absolute -bottom-5 left-0 text-[10px] font-mono tracking-widest uppercase text-white/40">
                      {slots.slot1.labelBottom}
                    </span>

                    {/* Image Frame */}
                    <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c1:border-[#6ee05a]/60 group-hover/c1:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                      <img
                        src={slots.slot1.img}
                        alt={slots.slot1.alt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c1:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover/c1:opacity-0 transition-opacity duration-300" />
                    </div>

                    {/* Dropping Vertical Line past the bottom */}
                    <div className="arch-line-v absolute top-0 -bottom-12 lg:-bottom-16 right-0 w-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-top" />
                    <span className="arch-crosshair absolute -top-2 -right-1.5 text-white/40 font-mono text-xs select-none">+</span>
                    <span className="arch-crosshair absolute -bottom-14 right-[-3px] text-white/30 font-mono text-[10px] select-none">+</span>
                  </div>

                  {/* --- Column 2: Taller Portrait Stepping Up --- */}
                  <div className="arch-col-2 absolute left-[22.5%] w-[19%] top-[22%] h-[74%] group/c2">
                    {/* Overshooting Vertical Hairline (shooting high up) */}
                    <div className="arch-line-v absolute -top-16 lg:-top-24 bottom-0 left-0 w-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-bottom" />
                    <span className="absolute -top-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                      {slots.slot2.labelTop}
                    </span>
                    <span className="absolute -bottom-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                      {slots.slot2.labelBottom}
                    </span>

                    {/* Image Frame */}
                    <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c2:border-[#6ee05a]/60 group-hover/c2:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                      <img
                        src={slots.slot2.img}
                        alt={slots.slot2.alt}
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c2:scale-105 ${
                          project.id === 'amolo' ? 'object-[center_25%]' : ''
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/c2:opacity-0 transition-opacity duration-300" />
                    </div>

                    <span className="arch-crosshair absolute -top-2 -left-1.5 text-white/40 font-mono text-xs select-none">+</span>
                  </div>

                  {/* --- Column 3: Center Elevated Slot --- */}
                  <div className="arch-col-3 absolute left-[42%] w-[19%] top-[10%] h-[60%] group/c3">
                    {/* Overshooting Vertical Line (shooting up) */}
                    <div className="arch-line-v absolute -top-20 lg:-top-28 bottom-0 left-0 w-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-top" />
                    <span className="absolute -top-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                      {slots.slot3.labelTop}
                    </span>

                    {/* Overshooting Horizontal Line (cutting across to Col 4 & extending) */}
                    <div className="arch-line-h absolute bottom-0 left-0 -right-20 lg:-right-32 h-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-left" />
                    <span className="absolute -bottom-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                      {slots.slot3.labelBottom}
                    </span>

                    {/* Image Frame */}
                    <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c3:border-[#6ee05a]/60 group-hover/c3:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                      <img
                        src={slots.slot3.img}
                        alt={slots.slot3.alt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c3:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/c3:opacity-0 transition-opacity duration-300" />
                    </div>

                    <span className="arch-crosshair absolute -top-2 -left-1.5 text-white/40 font-mono text-xs select-none">+</span>
                    <span className="arch-crosshair absolute -bottom-2 -left-1.5 text-white/40 font-mono text-xs select-none">+</span>
                  </div>

                  {/* --- Column 4: Stacked Dual Images --- */}
                  <div className="arch-col-4 absolute left-[61.5%] w-[21%] top-[4%] h-[92%] flex flex-col justify-between group/c4">
                    {/* Top Cell (4A) */}
                    <div className="relative w-full h-[46%] overflow-visible group/c4a">
                      {/* Overshooting Horizontal Hairline (running across top of Col 4 & 5 out to right margin) */}
                      <div className="arch-line-h absolute top-0 -left-6 right-[-80px] lg:right-[-120px] h-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-left" />
                      <span className="absolute -top-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                        {slots.slot4A.labelTop}
                      </span>

                      <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c4a:border-[#6ee05a]/60 group-hover/c4a:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                        <img
                          src={slots.slot4A.img}
                          alt={slots.slot4A.alt}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c4a:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/c4a:opacity-0 transition-opacity duration-300" />
                      </div>
                    </div>

                    {/* Bottom Cell (4B) */}
                    <div className="relative w-full h-[48%] overflow-visible group/c4b">
                      {/* Dropping Vertical Line past the bottom */}
                      <div className="arch-line-v absolute top-0 -bottom-16 lg:-bottom-24 right-0 w-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-top" />
                      <span className="absolute -bottom-5 right-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                        {slots.slot4B.labelBottom}
                      </span>

                      <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c4b:border-[#6ee05a]/60 group-hover/c4b:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                        <img
                          src={slots.slot4B.img}
                          alt={slots.slot4B.alt}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c4b:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/c4b:opacity-0 transition-opacity duration-300" />
                      </div>

                      <span className="arch-crosshair absolute -bottom-2 -right-1.5 text-white/40 font-mono text-xs select-none">+</span>
                    </div>

                    <span className="arch-crosshair absolute -top-2 -left-1.5 text-white/40 font-mono text-xs select-none">+</span>
                  </div>

                  {/* --- Column 5: Right Offset Landscape --- */}
                  <div className="arch-col-5 absolute left-[83%] w-[16%] top-[20%] h-[42%] group/c5">
                    <span className="absolute -top-5 left-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                      {slots.slot5.labelTop}
                    </span>

                    {/* Image Frame */}
                    <div className="arch-frame relative w-full h-full overflow-hidden border border-white/20 bg-[#101311] transition-all duration-500 group-hover/c5:border-[#6ee05a]/60 group-hover/c5:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
                      <img
                        src={slots.slot5.img}
                        alt={slots.slot5.alt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/c5:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/c5:opacity-0 transition-opacity duration-300" />
                    </div>

                    {/* Overshooting line extending to the right border */}
                    <div className="arch-line-h absolute top-0 left-0 -right-8 lg:-right-16 h-[1px] bg-white/20 group-hover/project:bg-white/35 transition-colors origin-left" />
                    <span className="arch-crosshair absolute -top-2 -right-1 text-white/40 font-mono text-xs select-none">+</span>
                  </div>

                </div>

                {/* ============================================================== */}
                {/* MOBILE ARCHITECTURAL GRID (Stepped 2-Column Responsive Matrix) */}
                {/* ============================================================== */}
                <div 
                  onClick={() => onSelectProject(project)}
                  className="block md:hidden relative w-full space-y-6 pt-4 cursor-pointer"
                >
                  {/* Top Hairline crossing the header */}
                  <div className="arch-line-h w-full h-[1px] bg-white/20 mb-4" />

                  {/* Stepped Row 1: Low cell left + Tall cell right */}
                  <div className="grid grid-cols-2 gap-4 items-end relative">
                    {/* Left Slot 1 */}
                    <div className="relative pt-6">
                      <div className="arch-line-h absolute top-0 -left-6 right-0 h-[1px] bg-white/20" />
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">
                        {slots.slot1.labelTop}
                      </span>
                      <div className="arch-frame aspect-square border border-white/20 overflow-hidden bg-[#101311]">
                        <img src={slots.slot1.img} alt={slots.slot1.alt} className="w-full h-full object-cover" />
                      </div>
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/40 mt-1">
                        {slots.slot1.labelBottom}
                      </span>
                    </div>

                    {/* Right Slot 2 (Tall) */}
                    <div className="relative">
                      <div className="arch-line-v absolute -top-6 bottom-0 left-0 w-[1px] bg-white/20" />
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1 pl-2">
                        {slots.slot2.labelTop}
                      </span>
                      <div className="arch-frame aspect-[3/4] border border-white/20 overflow-hidden bg-[#101311]">
                        <img src={slots.slot2.img} alt={slots.slot2.alt} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Stepped Row 2: Elevated cell left + Stack cell right */}
                  <div className="grid grid-cols-2 gap-4 items-start relative pt-4">
                    {/* Horizontal divider running between rows */}
                    <div className="arch-line-h absolute top-0 -left-6 -right-6 h-[1px] bg-white/20" />

                    {/* Left Slot 3 */}
                    <div className="relative">
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">
                        {slots.slot3.labelTop}
                      </span>
                      <div className="arch-frame aspect-[4/5] border border-white/20 overflow-hidden bg-[#101311]">
                        <img src={slots.slot3.img} alt={slots.slot3.alt} className="w-full h-full object-cover" />
                      </div>
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/40 mt-1">
                        {slots.slot3.labelBottom}
                      </span>
                    </div>

                    {/* Right Slot 4A */}
                    <div className="relative pt-6">
                      <div className="arch-line-v absolute top-0 -bottom-6 right-0 w-[1px] bg-white/20" />
                      <span className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">
                        {slots.slot4A.labelTop}
                      </span>
                      <div className="arch-frame aspect-square border border-white/20 overflow-hidden bg-[#101311]">
                        <img src={slots.slot4A.img} alt={slots.slot4A.alt} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Wide Anchor Cell (Slot 4B & 5) */}
                  <div className="relative pt-4">
                    <div className="arch-line-h absolute top-0 -left-6 -right-6 h-[1px] bg-white/20" />
                    <div className="flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">
                      <span>{slots.slot4B.labelBottom}</span>
                      <span>{slots.slot5.labelTop}</span>
                    </div>
                    <div className="arch-frame aspect-[16/9] border border-white/20 overflow-hidden bg-[#101311]">
                      <img src={slots.slot4B.img} alt={slots.slot4B.alt} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
