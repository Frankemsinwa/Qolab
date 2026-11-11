import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import ServicesCarousel from './ServicesCarousel';
import ProjectGrid from './ProjectGrid';
import ApproachSection from './ApproachSection';
import { projectsData } from '../data';
import { Service } from '../types';
import QolabLogo from './QolabLogo';
import ScrollMarquee from './ScrollMarquee';
import qMark from '../assets/Q.webp';

gsap.registerPlugin(ScrollTrigger);

interface LandingHeroProps {
  onSelectProject: (project: any) => void;
  onViewAllProjects: () => void;
  onSelectService?: (service: Service) => void;
  onNavigate?: (view: 'about' | 'projects' | 'services' | 'contact') => void;
}

/** Splits text into word spans for the scroll-driven highlight reveal */
function WordRoll({ text, cls = 's2-word' }: { text: string; cls?: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className={cls}>{word}{' '}</span>
      ))}
    </>
  );
}

/** Per-character spans (word-grouped so wrapping still works) for the blur-type entrance */
function CharLine({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((c, ci) => (
            <span key={ci} className="hero-char inline-block">{c}</span>
          ))}
          {wi < arr.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

const HERO_FLIP_WORDS = ['EMERGE', 'BEGIN', 'EXIST', 'THRIVE', 'MATTER'];

/** Inline neon icon chips embedded in body copy (reference-site style) */
function ChipDiamond() {
  return (
    <svg viewBox="0 0 24 24" className="s2-chip inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" stroke="#6ee05a" strokeWidth="2.4" />
    </svg>
  );
}

function ChipClover() {
  return (
    <svg viewBox="0 0 24 24" className="s2-chip inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="#6ee05a" aria-hidden="true">
      <circle cx="12" cy="6.8" r="3.8" />
      <circle cx="12" cy="17.2" r="3.8" />
      <circle cx="6.8" cy="12" r="3.8" />
      <circle cx="17.2" cy="12" r="3.8" />
    </svg>
  );
}

function ChipAsterisk() {
  return (
    <svg viewBox="0 0 24 24" className="s2-chip inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="none" aria-hidden="true">
      <g stroke="#6ee05a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 3.5v17" />
        <path d="M3.5 12h17" />
        <path d="M5.9 5.9l12.2 12.2" />
        <path d="M18.1 5.9L5.9 18.1" />
      </g>
    </svg>
  );
}

function ChipEye() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block w-[0.95em] h-[0.95em] mx-1 -translate-y-px" fill="none" aria-hidden="true">
      <g className="chip-eye-lid">
        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" stroke="#6ee05a" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.8" fill="#6ee05a" />
      </g>
    </svg>
  );
}


interface FloatingGlassNavProps {
  onViewAllProjects: () => void;
  onNavigate?: (view: 'about' | 'projects' | 'services' | 'contact') => void;
}

function FloatingGlassNav({ onViewAllProjects, onNavigate }: FloatingGlassNavProps) {
  const [slider, setSlider] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const navItems = [
    { label: 'WORK', action: onViewAllProjects, cursorText: 'Projects' },
    { label: 'SERVICES', action: () => onNavigate?.('services'), cursorText: 'Services' },
    { label: 'ABOUT', action: () => onNavigate?.('about'), cursorText: 'About Us' },
  ];

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, idx: number) => {
    const el = e.currentTarget;
    setSlider({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
    setHoveredIdx(idx);
  };

  const handleMouseLeave = () => {
    setSlider((prev) => ({ ...prev, opacity: 0 }));
    setHoveredIdx(null);
  };

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center p-1.5 rounded-full bg-black/[0.05] backdrop-blur-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300"
    >
      {/* Gliding magnetic slider pill */}
      <div
        className="absolute top-1.5 bottom-1.5 rounded-full bg-[#111411] transition-all duration-300 ease-out pointer-events-none shadow-sm"
        style={{
          left: `${slider.left}px`,
          width: `${slider.width}px`,
          opacity: slider.opacity,
        }}
      />

      {/* Nav links */}
      <div className="flex items-center gap-1 relative z-10">
        {navItems.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <button
              key={item.label}
              onClick={item.action}
              onMouseEnter={(e) => handleMouseEnter(e, idx)}
              data-cursor="magnetic"
              data-cursor-text={item.cursorText}
              className={`relative z-10 px-4 py-2 rounded-full font-grotesk font-medium text-[12px] tracking-[0.06em] uppercase transition-colors duration-200 select-none ${
                isHovered ? 'text-white' : 'text-[#1a1c1a] hover:text-[#111411]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Subtle divider */}
      <div className="w-[1px] h-4 bg-black/15 mx-1.5 relative z-10" />

      {/* Integrated Modern Micro-CTA: Let's Talk ↗ */}
      <button
        onClick={() => onNavigate?.('contact')}
        data-cursor="magnetic"
        data-cursor-text="Contact"
        className="relative z-10 group inline-flex items-center gap-1.5 rounded-full bg-[#1e3b26] hover:bg-[#254b31] text-white px-4 py-2 font-grotesk font-medium text-[12px] tracking-[0.06em] uppercase transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-sm ml-0.5"
      >
        <span>Let's Talk</span>
        <ArrowUpRight
          size={14}
          strokeWidth={2.4}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  );
}

export default function LandingHero({ onSelectProject, onViewAllProjects, onSelectService, onNavigate }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);

  const approachRef = useRef<HTMLDivElement>(null);
  const s8Ref = useRef<HTMLDivElement>(null);
  const s2TextRef = useRef<HTMLParagraphElement>(null);
  const puzzleRef = useRef<HTMLDivElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = heroRef.current;

    if (!reduced) {
      let handleMouseMove: ((e: MouseEvent) => void) | null = null;
      const ctx = gsap.context(() => {
        // Hero content entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .from('.hero-topbar-item', { y: -12, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.1)
          .from('.hero-title-line', { opacity: 0, y: 20, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, 0.15)
          .from('.hero-flip', { opacity: 0, filter: 'blur(10px)', duration: 0.6, ease: 'power2.out' }, 0.35)
          .from('.hero-subtext', { opacity: 0, y: 12, duration: 0.55, ease: 'power2.out' }, 0.45)
          .from('.hero-cta', { y: 14, opacity: 0, duration: 0.6 }, 0.55);

        // "EXIST" word-flip animation cycling through synonyms
        const flipWords = gsap.utils.toArray<HTMLElement>('.hero-flip-word');
        if (flipWords.length > 1) {
          gsap.set(flipWords.slice(1), { yPercent: 115, opacity: 1 });
          const flipTl = gsap.timeline({ repeat: -1, paused: true });
          const dur = 0.55;
          const hold = 1.8;
          let t = hold;
          for (let i = 0; i < flipWords.length - 1; i++) {
            const cur = flipWords[i];
            const next = flipWords[i + 1];
            flipTl.call(() => gsap.set(next, { yPercent: 115 }), [], t);
            flipTl.to(cur, { yPercent: -115, duration: dur, ease: 'power3.inOut' }, t);
            flipTl.to(next, { yPercent: 0, duration: dur, ease: 'power3.inOut' }, t + 0.01);
            t += dur + hold;
          }
          const last = flipWords[flipWords.length - 1];
          const first = flipWords[0];
          flipTl.call(() => gsap.set(first, { yPercent: 115 }), [], t);
          flipTl.to(last, { yPercent: -115, duration: dur, ease: 'power3.inOut' }, t);
          flipTl.to(first, { yPercent: 0, duration: dur, ease: 'power3.inOut' }, t + 0.01);
          flipTl.play();
        }

        // Subtle floating / entrance for character video
        gsap.from('.hero-character-video', {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.35,
        });

        // Section 2 scroll-triggered
        gsap.from('.s2-inner', {
          y: 50, opacity: 0, duration: 1, stagger: 0.15,
          scrollTrigger: { trigger: s2Ref.current, start: 'top 75%', refreshPriority: 8 }
        });

        // Section 2 word-by-word reveal (gray → white, scrubbed) — inline chips
        // spin a full turn at the moment the light-up reaches them
        const s2Seq: HTMLElement[] = [];
        s2TextRef.current?.querySelectorAll('.s2-word, .s2-chip').forEach((el) => s2Seq.push(el as HTMLElement));
        if (s2Seq.length) {
          gsap.set(s2Seq.filter((el) => el.classList.contains('s2-word')), { opacity: 0.18 });
          gsap.set(s2Seq.filter((el) => el.classList.contains('s2-chip')), { opacity: 0.18, rotation: 0, transformOrigin: '50% 50%' });
          const s2Tl = gsap.timeline({
            scrollTrigger: { trigger: s2TextRef.current, start: 'top 85%', end: 'top 35%', scrub: true, refreshPriority: 8 },
          });
          s2Seq.forEach((el, i) => {
            const at = i * 0.06;
            if (el.classList.contains('s2-chip')) {
              s2Tl.to(el, { opacity: 1, rotation: 360, duration: 0.7, ease: 'power2.out' }, Math.max(0, at - 0.06));
            } else {
              s2Tl.to(el, { opacity: 1, duration: 0.5, ease: 'none' }, at);
            }
          });
        }

        // Section 8
        gsap.from('.s8-content', {
          y: 60, opacity: 0, duration: 1.2,
          scrollTrigger: { trigger: s8Ref.current, start: 'top 75%' }
        });

        // Eye chip — smooth blink loop while the CTA statement is in view
        const eyeLids = gsap.utils.toArray('.chip-eye-lid');
        if (eyeLids.length) {
          gsap.set(eyeLids, { transformOrigin: '50% 50%' });
          const eyeTl = gsap.timeline({ repeat: -1, repeatDelay: 1.9, paused: true });
          eyeTl
            .to(eyeLids, { scaleY: 0.06, duration: 0.09, ease: 'power2.in' })
            .to(eyeLids, { scaleY: 1, duration: 0.15, ease: 'power2.out' });
          ScrollTrigger.create({
            trigger: s8Ref.current,
            start: 'top 85%',
            end: 'bottom top',
            onToggle: (self) => {
              if (self.isActive) eyeTl.play();
              else eyeTl.pause();
            },
          });
        }

        // Capabilities grid entrance
        gsap.from('.cap-cell', {
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.cap-grid', start: 'top 80%' },
        });

        // Footer
        gsap.from('.footer-col', {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.1,
          scrollTrigger: { trigger: '.site-footer', start: 'top 92%' }
        });

      }, containerRef);

      // Sort all ScrollTriggers by refreshPriority / DOM order and recalculate
      // pin-spacers now that parent and child triggers are all registered
      let isMounted = true;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      const rafId = requestAnimationFrame(() => {
        if (!isMounted) return;
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!isMounted) return;
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      }

      return () => {
        isMounted = false;
        cancelAnimationFrame(rafId);
        if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
        ctx.revert();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0a0d0c] text-white overflow-hidden">


      {/* ===== STICKY MOBILE NAV + MENU OVERLAY — portaled to body so GSAP's
             pin-spacer DOM mutations can't break React's reconciliation ===== */}
      {createPortal(
        <>
          {/* Modern Floating Island Header for Mobile */}
          <div className="fixed top-3 inset-x-3 sm:inset-x-5 z-[90] md:hidden flex items-center justify-between px-4 py-2.5 rounded-full bg-[#111411]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <QolabLogo className="w-20" />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 pl-3.5 pr-3 py-1.5 rounded-full bg-[#1e3b26] text-white font-grotesk text-[11px] font-medium uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <span>Menu</span>
              <span className="flex flex-col gap-1 w-3.5 justify-center items-center">
                <span className="w-3.5 h-[1.5px] bg-white rounded-full transition-all" />
                <span className="w-2.5 h-[1.5px] bg-[#6ee05a] rounded-full transition-all" />
              </span>
            </button>
          </div>

          {/* Ultra-Modern Fullscreen Studio Menu Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-[#0c0e0c]/98 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-8 md:hidden animate-in fade-in duration-200">
              {/* Menu Top */}
              <div className="flex items-center justify-between pt-2">
                <span className="inline-flex bg-white/5 rounded-full px-4 py-2 border border-white/10 shadow-sm">
                  <QolabLogo className="w-20" />
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Numbered Architectural Nav Links */}
              <nav className="flex flex-col gap-5 my-auto py-6">
                {[
                  { num: '01', label: 'Home', action: () => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                  { num: '02', label: 'About', action: () => { setMobileMenuOpen(false); onNavigate?.('about'); } },
                  { num: '03', label: 'Services', action: () => { setMobileMenuOpen(false); onNavigate?.('services'); } },
                  { num: '04', label: 'Works', action: () => { setMobileMenuOpen(false); onNavigate?.('projects'); } },
                  { num: '05', label: 'Contact', action: () => { setMobileMenuOpen(false); onNavigate?.('contact'); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="group flex items-center justify-between text-left py-2.5 border-b border-white/[0.06] hover:border-[#6ee05a]/30 transition-all cursor-pointer"
                  >
                    <span className="font-display font-medium tracking-tight text-3xl sm:text-4xl text-white group-hover:text-[#6ee05a] transition-colors">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-white/30 group-hover:text-[#6ee05a] transition-colors">
                      {item.num}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Menu Footer with Availability & CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-white/50 font-grotesk">
                  <span>Future Ready Solutions</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ee05a] animate-pulse" />
                    Available for Q1/Q2
                  </span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate?.('contact'); }}
                  className="w-full py-3.5 rounded-full bg-[#1e3b26] hover:bg-[#254b31] text-white font-grotesk text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>,
        document.body
      )}

      {/* ===== MODERN LIGHT HERO SECTION (OPTION A: CINEMATIC LOOP) ===== */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen bg-[#cccccb] text-[#111411] flex flex-col justify-between overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 25%, #e1e1e0 0%, #cccccb 75%)',
        }}
      >
        {/* Subtle architectural atmosphere */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
            style={{
              width: '80%',
              height: '55%',
              background: 'radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.45) 0%, rgba(204, 204, 203, 0) 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        {/* Top bar — desktop */}
        <div className="relative z-30 w-full hidden md:flex items-center justify-between px-8 md:px-[6%] pt-6 md:pt-8">
          {/* Dark Wordmark Logo */}
          <div className="hero-topbar-item flex items-center">
            <QolabLogo theme="dark" className="w-32 sm:w-36 md:w-[min(14vw,17vh)]" />
          </div>

          {/* Center rotating badge: FUTURE READY SOLUTION — original vibrant green graphic with smooth rotation */}
          <div className="hero-topbar-item hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-6 md:top-8 pointer-events-none">
            <img
              src="/circle.png"
              alt="Future Ready Solution"
              className="select-none pointer-events-none"
              style={{
                width: 'min(8.5vw, 10.2vh)',
                height: 'min(8.5vw, 10.2vh)',
                animation: 'spin-badge 14s linear infinite',
                WebkitAnimation: 'spin-badge 14s linear infinite',
              }}
            />
          </div>

          {/* Right: Modern Floating Glass Capsule Nav with Gliding Slider & Micro-CTA */}
          <div className="hero-topbar-item hidden md:flex items-center">
            <FloatingGlassNav
              onViewAllProjects={onViewAllProjects}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* Hero Content Layer — Centered, Light, Modern & Heartwarming */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-24 sm:pt-28 md:pt-14 pb-4 text-center">
          {/* Monumental Headline in Zen Dots */}
          <h1
            className="hero-headline font-zen uppercase font-normal tracking-[0.01em] text-[clamp(2.1rem,7.2vw,4.8rem)] md:text-[clamp(3rem,6.4vw,5.6rem)] leading-[1.04] text-[#111411] select-none mx-auto"
          >
            <div className="block hero-title-line">
              <span>YOUR</span> <span>IDEAS</span>
            </div>
            <div className="block hero-title-line text-[#111411] mt-[0.04em]">
              DESERVE TO
            </div>
            <div className="block hero-title-line text-[#2d5f3e] mt-[0.04em]">
              <span
                className="hero-flip inline-grid overflow-hidden align-baseline"
                style={{ lineHeight: 1.05 }}
                aria-label="EMERGE"
              >
                {HERO_FLIP_WORDS.map((word, i) => (
                  <span
                    key={word}
                    aria-hidden="true"
                    className={`hero-flip-word font-zen font-normal uppercase tracking-normal [grid-area:1/1] ${i === 0 ? '' : 'opacity-0'}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </div>
          </h1>

          {/* Editorial Subtext in Clash Grotesk */}
          <p
            className="hero-subtext text-[#484c48] font-grotesk font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] leading-[1.55] max-w-2xl mx-auto mt-6 sm:mt-8"
          >
            We build strategies, create websites, find AI solutions, and develop your ideas into digital products people love.
          </p>

          {/* Tactile Modern CTA Button */}
          <div className="hero-cta mt-8 sm:mt-9 flex items-center justify-center">
            <button
              onClick={() => onNavigate?.('contact')}
              data-cursor="magnetic"
              data-cursor-text="Let’s Talk"
              className="group relative inline-flex items-center gap-4 sm:gap-5 rounded-full bg-[#193220] hover:bg-[#20402a] transition-all duration-300 pl-7 sm:pl-8 pr-3 sm:pr-3.5 py-3 sm:py-3.5 border border-[#2d5f3e]/40 shadow-[0_12px_36px_rgba(25,50,32,0.22)] hover:shadow-[0_16px_44px_rgba(25,50,32,0.32)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="font-grotesk text-[16px] sm:text-[17px] md:text-[18px] font-medium tracking-tight text-white whitespace-nowrap">
                Let’s Make it Exist
              </span>
              <span
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2d5f3e] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 shadow-[0_0_12px_rgba(45,95,62,0.4)]"
              >
                <ArrowUpRight size={20} strokeWidth={2.4} />
              </span>
            </button>
          </div>
        </div>

        {/* Video Character Layer — completely fills the full width of the screen */}
        <div className="hero-character-video relative w-full flex justify-center overflow-hidden z-10 pointer-events-none select-none">
          <div
            className="w-full relative"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
            }}
          >
            <video
              src="/character-typing.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full min-w-full h-auto block pointer-events-none select-none"
              style={{
                marginBottom: '-2px',
              }}
            />
          </div>
        </div>
      </section>

      {/* ===== MODERN HERO TRANSITION TICKER ===== */}
      <div
        className="relative w-full overflow-hidden py-4 sm:py-5 bg-[#080a08] border-y border-white/[0.08] select-none z-20"
        aria-hidden="true"
      >
        <div className="flex w-max animate-ticker">
          {[0, 1].map((setIdx) => (
            <div key={setIdx} className="flex shrink-0 items-center gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6">
              {['Creativity', 'Technology', 'Strategy', 'Creativity', 'Technology', 'Strategy'].map((word, wIdx) => (
                <span key={`${setIdx}-${wIdx}-${word}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                  <span className="font-grotesk font-medium text-lg sm:text-xl md:text-2xl text-white/90 tracking-tight whitespace-nowrap">
                    {word}
                  </span>
                  <span className="text-[#2d5f3e] text-sm sm:text-base md:text-lg select-none">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== SECTION 2: WHY QOLAB — giant scroll-reveal statement (reference layout) ===== */}
      <section
        ref={s2Ref}
        className="relative w-full py-28 md:py-40 px-6 md:px-12 lg:px-16 z-20 overflow-hidden bg-[#0a0d0c]"
      >
        {/* Monochromatic depth — soft neutral glows instead of green */}
        <div className="absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 45%, transparent 70%)' }}
        />
        <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 45%, transparent 70%)' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-6 md:mb-8 font-display">Why Qolab</p>
          <h2 className="s2-inner font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-white font-normal tracking-tight mb-8 md:mb-12 leading-[1.1]">
            Great ideas shouldn't{' '}
            <span className="text-[#6ee05a]">stop at being ideas.</span>
          </h2>
          <p
            ref={s2TextRef}
            className="s2-inner font-sans text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] leading-[1.45] text-white font-normal tracking-tight"
          >
            <WordRoll text="Most agencies hand you pretty mockups and leave you to figure out the rest." />{' '}
            <ChipDiamond />{' '}
            <WordRoll text="We take your vision from a rough spark all the way to a finished product people can touch, use, and love." />{' '}
            <ChipClover />{' '}
            <WordRoll text="No endless handoffs. No technical guesswork. Just thoughtful design, dependable development, and a dedicated team invested in your growth." />{' '}
            <ChipAsterisk />
          </p>
        </div>
        {/* Who we build for — bordered grid */}
        <div className="relative max-w-7xl mx-auto mt-20 md:mt-28">
          <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6 font-display">Who We Build For</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
            {[
              { 
                title: 'Founders & Startups', 
                desc: 'Launch faster with confidence. Turn a rough napkin sketch into an investor-ready product that looks and feels like an industry leader.' 
              },
              { 
                title: 'Growing Businesses', 
                desc: 'Modernize and stand out. Upgrade outdated websites and platforms into high-converting digital storefronts that attract modern customers.' 
              },
              { 
                title: 'Marketing & Brand Teams', 
                desc: 'Bold visual storytelling. Full brand identity, bespoke web design, and interactive campaigns that capture genuine attention.' 
              },
              { 
                title: 'Product & Tech Teams', 
                desc: 'Frictionless tools that scale. Clean software architectures and automated workflows designed to save your team hours every week.' 
              },
            ].map((audience) => (
              <div key={audience.title} className="s2-inner border-r border-b border-white/10 p-5 sm:p-6 md:p-7 hover:bg-white/[0.03] transition-colors">
                <p className="text-white font-medium text-base sm:text-lg md:text-[1.25rem] font-display leading-snug">{audience.title}</p>
                <p className="text-xs sm:text-sm md:text-[15px] text-gray-400 mt-2.5 font-sans leading-relaxed">{audience.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SERVICES CAROUSEL ===== */}
      <ServicesCarousel
        onSelectService={(svc) => {
          if (onSelectService) onSelectService(svc);
        }}
      />

      {/* ===== SECTION 4: PROJECTS (Case Rows) ===== */}
      <ProjectGrid
        onSelectProject={onSelectProject}
      />

      {/* ===== SCROLL MARQUEE — giant scrubbed text band ===== */}
      <ScrollMarquee
        words={['Some Ideas', 'Deserve to Exist', 'Future Ready', 'Built With Intent']}
      />

      {/* ===== SECTION 7A: DIFFERENTIATION (PRD 7.5) ===== */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-4 font-sans">Our Difference</p>
            <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight">
              We Don't Believe in <span className="text-[#6ee05a]">Thinking Inside</span> the Brief.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
              We question assumptions, look for overlooked opportunities, and treat creativity, technology, and strategy as connected disciplines — not separate deliverables.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Creativity', 'Technology', 'Strategy'].map((discipline) => (
                <span
                  key={discipline}
                  className="text-xs font-semibold tracking-[0.15em] uppercase text-[#0f0f11] rounded-full px-5 py-2 font-sans"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\"), linear-gradient(115deg, #2fe862 0%, #6ee05a 48%, #d8f34b 100%)",
                    backgroundBlendMode: 'overlay',
                  }}
                >
                  {discipline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR APPROACH (Stacking Cards — 5 Official Steps) ===== */}
      <div ref={approachRef}>
        <ApproachSection />
      </div>

      {/* ===== SECTION 7B: COLLABORATION (PRD 7.6) ===== */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-4 font-sans">Collaboration</p>
            <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight mb-6">
              Different Skills. One Team.{' '}
              <span className="text-[#6ee05a]">One Goal.</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-sans max-w-xl">
              Turning an ambitious idea into reality takes more than one specialty. We bring together strategists, designers, and developers who work as a single unit around your project &mdash; giving you a dedicated team, one direct line of communication, and a shared focus on your growth.
            </p>
          </div>

          {/* Interactive orbit — disciplines revolving around your brand */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="group/orbit relative w-[19rem] h-[19rem] md:w-[25rem] md:h-[25rem]">
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[16%] rounded-full border border-dashed border-white/[0.06]" />
              {/* Center core */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#111312] border border-white/15 flex items-center justify-center text-center px-4 shadow-[0_0_60px_rgba(110,230,90,0.1)]">
                <span>
                  <span className="block text-white text-xs md:text-sm font-sans font-medium uppercase tracking-[0.18em]">Your Brand</span>
                  <span className="block text-gray-500 text-[10px] md:text-[11px] font-sans uppercase tracking-[0.2em] mt-1.5">one outcome</span>
                </span>
              </div>
              {/* Orbiting nodes — pause on hover */}
              <div className="orbit-spin absolute inset-0 group-hover/orbit:[animation-play-state:paused]">
                {['Strategy', 'Design', 'Engineering', 'Marketing'].map((discipline, i) => (
                  <div key={discipline} className="absolute inset-0" style={{ transform: `rotate(${i * 90}deg)` }}>
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      <div className="orbit-counter group-hover/orbit:[animation-play-state:paused]">
                        <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#0f1110]/90 backdrop-blur px-4 py-2 text-[11px] md:text-xs font-sans uppercase tracking-[0.15em] text-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-default">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6ee05a]" />
                          {discipline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES — bordered grid (reference-style partners grid) ===== */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] z-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-4 font-display">Capabilities</p>
          <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-12">
            One team, <span className="text-[#6ee05a]">every discipline.</span>
          </h2>
          <div className="cap-grid grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {['Brand Identity', 'Web & App Development', 'AI & Automation', 'Growth & Strategy', 'Motion Design', 'Consulting', 'E-Commerce', 'UX / UI Design'].map((cap) => (
              <div
                key={cap}
                className="cap-cell flex items-center justify-center aspect-[4/3] p-6 border-r border-b border-white/10 font-display font-normal text-base md:text-lg text-gray-300 text-center"
              >
                {cap}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: STATEMENT CTA ===== */}
      <section ref={s8Ref} className="relative w-full py-28 md:py-40 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] text-white overflow-hidden z-20 border-t border-white/10">
        <div className="s8-content max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-8 font-display">Ready to start?</p>
          <h2 className="font-display font-normal text-[3.4rem] sm:text-[5.5rem] lg:text-[8rem] leading-[0.9] tracking-tight text-white">
            The Future Is
            <br />
            Not a <ChipEye />{' '}
            <span className="italic text-[#6ee05a]">Spectator</span>
            <br className="hidden sm:block" /> Sport.
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6">
            <p className="text-gray-300 text-base sm:text-lg font-sans leading-relaxed max-w-xl">
              Great things start with a simple conversation. Tell us what you want to build, and let’s turn that spark into a product that thrives in the real world.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => onNavigate?.('contact')}
              data-cursor="magnetic"
              data-cursor-text="Start now"
              className="bg-white hover:bg-[#6ee05a] text-[#0f0f11] font-semibold py-4 px-10 rounded-full text-base transition-colors duration-300 font-display"
            >
              Start Something With Qolab.
            </button>
            <button
              onClick={onViewAllProjects}
              className="border border-white/20 hover:border-white/50 text-white font-semibold py-4 px-10 rounded-full text-base transition-colors duration-300 hover:bg-white/5 font-display"
            >
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer w-full bg-[#0a0d0c] text-gray-400 pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-16 border-t border-white/10 z-20 relative overflow-hidden">
        {/* Giant statement */}
        <div className="max-w-7xl mx-auto mb-16 md:mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <h2 className="font-display font-normal text-white text-[3.6rem] sm:text-[5.5rem] lg:text-[8rem] leading-[0.9] tracking-tight">
              Get in touch
            </h2>
            <div className="flex flex-col gap-4 lg:items-end lg:pb-4">
              <p className="text-gray-400 text-sm font-display max-w-sm">
                Have an idea that deserves to exist? We reply within one working day.
              </p>
              <button
                onClick={() => onNavigate?.('contact')}
                data-cursor="magnetic"
                data-cursor-text="Contact"
                className="self-start lg:self-auto flex items-center gap-2 border border-white/30 hover:border-white hover:bg-white hover:text-[#0f0f11] text-white font-display font-semibold py-3.5 px-8 rounded-full text-sm transition-colors"
              >
                Contact
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bordered socials grid */}
        <div className="max-w-7xl mx-auto mb-16 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-5 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { label: 'LinkedIn', href: '#' },
              { label: 'X', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Dribbble', href: '#' },
              { label: 'Email', href: 'mailto:hello.qolab@gmail.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="social-cell group flex flex-col justify-between aspect-[4/3] md:aspect-[5/4] p-5 md:p-6 border-r border-b border-white/10 md:border-b-0 transition-colors last:border-r-0"
              >
                <span className="text-2xl md:text-3xl font-display text-gray-500 transition-colors">
                  {social.label[0]}
                </span>
                <span className="text-xs font-display text-gray-300 transition-colors">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-display">Work</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-display">
              {projectsData.map(p => (
                <li key={p.id}><a href="#" className="hover:text-white transition-colors">{p.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-display">Services</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-display">
              <li><a href="#" className="hover:text-white transition-colors">Brand Identity & Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web & App Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Solutions & Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Growth & Strategy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-display">Company</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-display">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="mailto:hello.qolab@gmail.com" className="hover:text-white transition-colors">hello.qolab@gmail.com</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-display">Connect</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-display">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dribbble</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center">
            <QolabLogo className="w-20" />
          </div>
          <div className="text-right">
            <p className="font-display italic text-white text-sm">Still curious. Still building.</p>
            <p className="text-gray-600 font-display text-xs mt-1">QOLAB — Future Ready Solutions. · © 2026 Qolab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
