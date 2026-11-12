import { useEffect, useMemo, useRef, useState } from 'react';
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

interface CinemaHoverFrameProps {
  primaryImg: string;
  reelImages: string[];
  alt: string;
  portraitImg?: string;
  className?: string;
  frameClassName?: string;
  overlayClassName?: string;
}

interface ChapterTheme {
  backgroundImage: string;
  isLight: boolean;
  titleText: string;
  indexText: string;
  metaText: string;
  labelPrimary: string;
  labelSecondary: string;
  lineBg: string;
  crosshairText: string;
  btnText: string;
  btnUnderline: string;
  btnCircle: string;
  frameClass: string;
  overlayClass: string;
}

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.26'/%3E%3C/svg%3E\")";

function getChapterTheme(projectId: string): ChapterTheme {
  if (projectId === 'luxel-bookings') {
    return {
      backgroundImage: `${GRAIN_SVG}, linear-gradient(125deg, #f4e7bd 0%, #e5be63 52%, #cc9836 100%)`,
      isLight: true,
      titleText: 'text-[#090d0b] hover:text-[#2c2105]',
      indexText: 'text-[#3b2d08]',
      metaText: 'text-[#090d0b]/70',
      labelPrimary: 'text-[#090d0b]/70',
      labelSecondary: 'text-[#090d0b]/55',
      lineBg: 'bg-[#090d0b]/25 group-hover/project:bg-[#090d0b]/45',
      crosshairText: 'text-[#090d0b]/50',
      btnText: 'text-[#090d0b] hover:text-[#2c2105]',
      btnUnderline: 'decoration-[#090d0b]/35 group-hover/btn:decoration-[#090d0b]',
      btnCircle: 'border-[#090d0b]/30 text-[#090d0b] group-hover/btn:bg-[#090d0b] group-hover/btn:text-[#f4e7bd]',
      frameClass: 'border-[#090d0b]/30 bg-[#1a1508] hover:border-[#090d0b] hover:shadow-[0_18px_40px_rgba(32,22,4,0.35)]',
      overlayClass: 'bg-black/15 group-hover/frame:opacity-0',
    };
  }

  if (projectId === 'amolo') {
    return {
      backgroundImage: `${GRAIN_SVG}, linear-gradient(125deg, #ea7744 0%, #c2410c 52%, #841f0d 100%)`,
      isLight: false,
      titleText: 'text-[#faf7f2] hover:text-[#ffe3cf]',
      indexText: 'text-[#ffd4b8]',
      metaText: 'text-[#faf7f2]/75',
      labelPrimary: 'text-[#faf7f2]/75',
      labelSecondary: 'text-[#faf7f2]/60',
      lineBg: 'bg-[#faf7f2]/30 group-hover/project:bg-[#faf7f2]/50',
      crosshairText: 'text-[#faf7f2]/55',
      btnText: 'text-[#faf7f2] hover:text-[#ffd4b8]',
      btnUnderline: 'decoration-[#faf7f2]/40 group-hover/btn:decoration-[#ffd4b8]',
      btnCircle: 'border-[#faf7f2]/35 text-[#faf7f2] group-hover/btn:bg-[#faf7f2] group-hover/btn:text-[#841f0d]',
      frameClass: 'border-white/30 bg-[#240a05] hover:border-white hover:shadow-[0_18px_40px_rgba(25,5,2,0.55)]',
      overlayClass: 'bg-black/15 group-hover/frame:opacity-0',
    };
  }

  // Green Valley — Luminous Valley Emerald to Chartreuse
  return {
    backgroundImage: `${GRAIN_SVG}, linear-gradient(125deg, #3ee467 0%, #8ced55 52%, #ccf34b 100%)`,
    isLight: true,
    titleText: 'text-[#090d0b] hover:text-[#16381e]',
    indexText: 'text-[#143a1d]',
    metaText: 'text-[#090d0b]/70',
    labelPrimary: 'text-[#090d0b]/70',
    labelSecondary: 'text-[#090d0b]/55',
    lineBg: 'bg-[#090d0b]/25 group-hover/project:bg-[#090d0b]/45',
    crosshairText: 'text-[#090d0b]/50',
    btnText: 'text-[#090d0b] hover:text-[#16381e]',
    btnUnderline: 'decoration-[#090d0b]/35 group-hover/btn:decoration-[#090d0b]',
    btnCircle: 'border-[#090d0b]/30 text-[#090d0b] group-hover/btn:bg-[#090d0b] group-hover/btn:text-[#8ced55]',
    frameClass: 'border-[#090d0b]/30 bg-[#0b1c0e] hover:border-[#090d0b] hover:shadow-[0_18px_40px_rgba(12,35,16,0.35)]',
    overlayClass: 'bg-black/15 group-hover/frame:opacity-0',
  };
}

/**
 * Rapid-cut cinema trailer frame: rests cleanly on primaryImg, then plays a 2x-speed
 * strobe montage through every visual in the project on hover using pre-stacked frames.
 */
function CinemaHoverFrame({
  primaryImg,
  reelImages,
  alt,
  portraitImg,
  className = '',
  frameClassName = 'border-white/20 bg-[#101311] hover:border-[#6ee05a]/75 hover:shadow-[0_12px_34px_rgba(0,0,0,0.85)]',
  overlayClassName = 'bg-black/20 group-hover/frame:opacity-0',
}: CinemaHoverFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  const frames = useMemo(() => {
    const seen = new Set<string>([primaryImg]);
    const list = [primaryImg];
    for (const src of reelImages) {
      if (src && !seen.has(src)) {
        seen.add(src);
        list.push(src);
      }
    }
    return list;
  }, [primaryImg, reelImages]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    if (frames.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);

    // Jump immediately on hover for zero-latency trailer punch, then cycle at ~2x cut speed
    setFrameIdx(1);
    timerRef.current = window.setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, 155);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setFrameIdx(0);
  };

  const activeIndex = hovered ? frameIdx % frames.length : 0;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`arch-frame group/frame relative overflow-hidden border transition-[border-color,box-shadow] duration-300 ${frameClassName} ${className}`}
    >
      {frames.map((src, idx) => {
        const isActive = idx === activeIndex;
        const isPortrait = portraitImg && src === portraitImg;
        return (
          <img
            key={src}
            src={src}
            alt={idx === 0 ? alt : `${alt} — reel frame ${idx + 1}`}
            loading="eager"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover will-change-transform ${
              isPortrait ? 'object-[center_25%]' : ''
            } ${
              isActive
                ? hovered
                  ? 'opacity-100 scale-[1.06] z-[1] transition-transform duration-300 ease-out'
                  : 'opacity-100 scale-100 z-[1] transition-transform duration-500 ease-out'
                : 'opacity-0 scale-100 z-0 pointer-events-none'
            }`}
          />
        );
      })}

      {/* Subtle resting veil fades away during hover reel */}
      <div className={`absolute inset-0 z-[2] pointer-events-none transition-opacity duration-200 ${overlayClassName}`} />
    </div>
  );
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
      className="relative w-full bg-[#080a09] text-white z-30 font-grotesk overflow-hidden"
      id="projects"
    >
      {/* Section Header on deep obsidian intro band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-24 sm:pt-32 md:pt-36 pb-14 sm:pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
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
      </div>

      {/* Full-Bleed Brand Color Chapters */}
      <div className="w-full">
        {projectsData.map((project, idx) => {
          const slots = getArchSlots(project);
          const theme = getChapterTheme(project.id);
          const num = String(idx + 1).padStart(2, '0');
          const reelImages = [project.heroImage, ...(project.galleryImages ?? [])];
          const portraitImg = project.id === 'amolo' ? project.heroImage : undefined;

          return (
            <div
              key={project.id}
              className="arch-project-block relative group/project w-full py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden border-t border-black/15"
              style={{
                backgroundImage: theme.backgroundImage,
                backgroundBlendMode: 'overlay',
              }}
            >
              <div className="max-w-7xl mx-auto">
                {/* Project Header Bar with Overshooting Top Hairline */}
                <div className="relative mb-12 sm:mb-16">
                  <div className={`arch-line-h w-full h-[1px] ${theme.lineBg} origin-left mb-6 transition-colors`} />

                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className={`font-mono text-sm sm:text-base font-semibold tracking-widest ${theme.indexText}`}>
                        [{num}]
                      </span>
                      <h3
                        onClick={() => onSelectProject(project)}
                        className={`font-display font-normal text-3xl sm:text-5xl md:text-6xl tracking-tight cursor-pointer transition-colors duration-300 ${theme.titleText}`}
                      >
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className={`text-xs sm:text-sm font-mono font-medium uppercase tracking-widest ${theme.metaText}`}>
                        {project.category.split(' & ')[0]} &bull; {project.year}
                      </span>
                      <button
                        onClick={() => onSelectProject(project)}
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider transition-colors group/btn ${theme.btnText}`}
                      >
                        <span className={`underline underline-offset-4 ${theme.btnUnderline}`}>
                          Case Study
                        </span>
                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${theme.btnCircle}`}>
                          <ArrowUpRight size={13} />
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
                  <div className="arch-col-1 absolute left-[1%] w-[21%] top-[48%] h-[48%]">
                    <div className={`arch-line-h absolute top-0 -left-12 lg:-left-20 right-0 h-[1px] ${theme.lineBg} transition-colors origin-left`} />
                    <span className={`absolute -top-5 left-0 text-[10px] font-mono font-semibold tracking-widest uppercase ${theme.labelPrimary}`}>
                      {slots.slot1.labelTop}
                    </span>
                    <span className={`absolute -bottom-5 left-0 text-[10px] font-mono font-medium tracking-widest uppercase ${theme.labelSecondary}`}>
                      {slots.slot1.labelBottom}
                    </span>

                    <CinemaHoverFrame
                      primaryImg={slots.slot1.img}
                      reelImages={reelImages}
                      alt={slots.slot1.alt}
                      portraitImg={portraitImg}
                      className="w-full h-full"
                      frameClassName={theme.frameClass}
                      overlayClassName={theme.overlayClass}
                    />

                    <div className={`arch-line-v absolute top-0 -bottom-12 lg:-bottom-16 right-0 w-[1px] ${theme.lineBg} transition-colors origin-top`} />
                    <span className={`arch-crosshair absolute -top-2 -right-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                    <span className={`arch-crosshair absolute -bottom-14 right-[-3px] font-mono text-[10px] select-none ${theme.crosshairText}`}>+</span>
                  </div>

                  {/* --- Column 2: Taller Portrait Stepping Up --- */}
                  <div className="arch-col-2 absolute left-[22.5%] w-[19%] top-[22%] h-[74%]">
                    <div className={`arch-line-v absolute -top-16 lg:-top-24 bottom-0 left-0 w-[1px] ${theme.lineBg} transition-colors origin-bottom`} />
                    <span className={`absolute -top-5 left-2 text-[10px] font-mono font-semibold tracking-widest uppercase ${theme.labelPrimary}`}>
                      {slots.slot2.labelTop}
                    </span>
                    <span className={`absolute -bottom-5 left-2 text-[10px] font-mono font-medium tracking-widest uppercase ${theme.labelSecondary}`}>
                      {slots.slot2.labelBottom}
                    </span>

                    <CinemaHoverFrame
                      primaryImg={slots.slot2.img}
                      reelImages={reelImages}
                      alt={slots.slot2.alt}
                      portraitImg={portraitImg}
                      className="w-full h-full"
                      frameClassName={theme.frameClass}
                      overlayClassName={theme.overlayClass}
                    />

                    <span className={`arch-crosshair absolute -top-2 -left-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                  </div>

                  {/* --- Column 3: Center Elevated Slot --- */}
                  <div className="arch-col-3 absolute left-[42%] w-[19%] top-[10%] h-[60%]">
                    <div className={`arch-line-v absolute -top-20 lg:-top-28 bottom-0 left-0 w-[1px] ${theme.lineBg} transition-colors origin-top`} />
                    <span className={`absolute -top-5 left-2 text-[10px] font-mono font-semibold tracking-widest uppercase ${theme.labelPrimary}`}>
                      {slots.slot3.labelTop}
                    </span>

                    <div className={`arch-line-h absolute bottom-0 left-0 -right-20 lg:-right-32 h-[1px] ${theme.lineBg} transition-colors origin-left`} />
                    <span className={`absolute -bottom-5 left-2 text-[10px] font-mono font-medium tracking-widest uppercase ${theme.labelSecondary}`}>
                      {slots.slot3.labelBottom}
                    </span>

                    <CinemaHoverFrame
                      primaryImg={slots.slot3.img}
                      reelImages={reelImages}
                      alt={slots.slot3.alt}
                      portraitImg={portraitImg}
                      className="w-full h-full"
                      frameClassName={theme.frameClass}
                      overlayClassName={theme.overlayClass}
                    />

                    <span className={`arch-crosshair absolute -top-2 -left-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                    <span className={`arch-crosshair absolute -bottom-2 -left-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                  </div>

                  {/* --- Column 4: Stacked Dual Images --- */}
                  <div className="arch-col-4 absolute left-[61.5%] w-[21%] top-[4%] h-[92%] flex flex-col justify-between">
                    {/* Top Cell (4A) */}
                    <div className="relative w-full h-[46%] overflow-visible">
                      <div className={`arch-line-h absolute top-0 -left-6 right-[-80px] lg:right-[-120px] h-[1px] ${theme.lineBg} transition-colors origin-left`} />
                      <span className={`absolute -top-5 left-2 text-[10px] font-mono font-semibold tracking-widest uppercase ${theme.labelPrimary}`}>
                        {slots.slot4A.labelTop}
                      </span>

                      <CinemaHoverFrame
                        primaryImg={slots.slot4A.img}
                        reelImages={reelImages}
                        alt={slots.slot4A.alt}
                        portraitImg={portraitImg}
                        className="w-full h-full"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />
                    </div>

                    {/* Bottom Cell (4B) */}
                    <div className="relative w-full h-[48%] overflow-visible">
                      <div className={`arch-line-v absolute top-0 -bottom-16 lg:-bottom-24 right-0 w-[1px] ${theme.lineBg} transition-colors origin-top`} />
                      <span className={`absolute -bottom-5 right-2 text-[10px] font-mono font-medium tracking-widest uppercase ${theme.labelSecondary}`}>
                        {slots.slot4B.labelBottom}
                      </span>

                      <CinemaHoverFrame
                        primaryImg={slots.slot4B.img}
                        reelImages={reelImages}
                        alt={slots.slot4B.alt}
                        portraitImg={portraitImg}
                        className="w-full h-full"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />

                      <span className={`arch-crosshair absolute -bottom-2 -right-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                    </div>

                    <span className={`arch-crosshair absolute -top-2 -left-1.5 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                  </div>

                  {/* --- Column 5: Right Offset Landscape --- */}
                  <div className="arch-col-5 absolute left-[83%] w-[16%] top-[20%] h-[42%]">
                    <span className={`absolute -top-5 left-2 text-[10px] font-mono font-semibold tracking-widest uppercase ${theme.labelPrimary}`}>
                      {slots.slot5.labelTop}
                    </span>

                    <CinemaHoverFrame
                      primaryImg={slots.slot5.img}
                      reelImages={reelImages}
                      alt={slots.slot5.alt}
                      portraitImg={portraitImg}
                      className="w-full h-full"
                      frameClassName={theme.frameClass}
                      overlayClassName={theme.overlayClass}
                    />

                    <div className={`arch-line-h absolute top-0 left-0 -right-8 lg:-right-16 h-[1px] ${theme.lineBg} transition-colors origin-left`} />
                    <span className={`arch-crosshair absolute -top-2 -right-1 font-mono text-xs select-none ${theme.crosshairText}`}>+</span>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* MOBILE ARCHITECTURAL GRID (Stepped 2-Column Responsive Matrix) */}
                {/* ============================================================== */}
                <div
                  onClick={() => onSelectProject(project)}
                  className="block md:hidden relative w-full space-y-6 pt-4 cursor-pointer"
                >
                  <div className={`arch-line-h w-full h-[1px] ${theme.lineBg} mb-4`} />

                  {/* Stepped Row 1 */}
                  <div className="grid grid-cols-2 gap-4 items-end relative">
                    <div className="relative pt-6">
                      <div className={`arch-line-h absolute top-0 -left-6 right-0 h-[1px] ${theme.lineBg}`} />
                      <span className={`block text-[9px] font-mono font-semibold tracking-widest uppercase mb-1 ${theme.labelPrimary}`}>
                        {slots.slot1.labelTop}
                      </span>
                      <CinemaHoverFrame
                        primaryImg={slots.slot1.img}
                        reelImages={reelImages}
                        alt={slots.slot1.alt}
                        portraitImg={portraitImg}
                        className="aspect-square"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />
                      <span className={`block text-[9px] font-mono font-medium tracking-widest uppercase mt-1 ${theme.labelSecondary}`}>
                        {slots.slot1.labelBottom}
                      </span>
                    </div>

                    <div className="relative">
                      <div className={`arch-line-v absolute -top-6 bottom-0 left-0 w-[1px] ${theme.lineBg}`} />
                      <span className={`block text-[9px] font-mono font-semibold tracking-widest uppercase mb-1 pl-2 ${theme.labelPrimary}`}>
                        {slots.slot2.labelTop}
                      </span>
                      <CinemaHoverFrame
                        primaryImg={slots.slot2.img}
                        reelImages={reelImages}
                        alt={slots.slot2.alt}
                        portraitImg={portraitImg}
                        className="aspect-[3/4]"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />
                    </div>
                  </div>

                  {/* Stepped Row 2 */}
                  <div className="grid grid-cols-2 gap-4 items-start relative pt-4">
                    <div className={`arch-line-h absolute top-0 -left-6 -right-6 h-[1px] ${theme.lineBg}`} />

                    <div className="relative">
                      <span className={`block text-[9px] font-mono font-semibold tracking-widest uppercase mb-1 ${theme.labelPrimary}`}>
                        {slots.slot3.labelTop}
                      </span>
                      <CinemaHoverFrame
                        primaryImg={slots.slot3.img}
                        reelImages={reelImages}
                        alt={slots.slot3.alt}
                        portraitImg={portraitImg}
                        className="aspect-[4/5]"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />
                      <span className={`block text-[9px] font-mono font-medium tracking-widest uppercase mt-1 ${theme.labelSecondary}`}>
                        {slots.slot3.labelBottom}
                      </span>
                    </div>

                    <div className="relative pt-6">
                      <div className={`arch-line-v absolute top-0 -bottom-6 right-0 w-[1px] ${theme.lineBg}`} />
                      <span className={`block text-[9px] font-mono font-semibold tracking-widest uppercase mb-1 ${theme.labelPrimary}`}>
                        {slots.slot4A.labelTop}
                      </span>
                      <CinemaHoverFrame
                        primaryImg={slots.slot4A.img}
                        reelImages={reelImages}
                        alt={slots.slot4A.alt}
                        portraitImg={portraitImg}
                        className="aspect-square"
                        frameClassName={theme.frameClass}
                        overlayClassName={theme.overlayClass}
                      />
                    </div>
                  </div>

                  {/* Wide Anchor Cell */}
                  <div className="relative pt-4">
                    <div className={`arch-line-h absolute top-0 -left-6 -right-6 h-[1px] ${theme.lineBg}`} />
                    <div className={`flex items-center justify-between text-[9px] font-mono font-semibold tracking-widest uppercase mb-1 ${theme.labelPrimary}`}>
                      <span>{slots.slot4B.labelBottom}</span>
                      <span>{slots.slot5.labelTop}</span>
                    </div>
                    <CinemaHoverFrame
                      primaryImg={slots.slot4B.img}
                      reelImages={reelImages}
                      alt={slots.slot4B.alt}
                      portraitImg={portraitImg}
                      className="aspect-[16/9]"
                      frameClassName={theme.frameClass}
                      overlayClassName={theme.overlayClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
