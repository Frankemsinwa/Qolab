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

const HERO_FLIP_WORDS = ['EXIST', 'THRIVE', 'MATTER', 'EMERGE', 'BEGIN'];

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

export default function LandingHero({ onSelectProject, onViewAllProjects, onSelectService, onNavigate }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);

  const approachRef = useRef<HTMLDivElement>(null);
  const s8Ref = useRef<HTMLDivElement>(null);
  const s2TextRef = useRef<HTMLParagraphElement>(null);
  const puzzleRef = useRef<HTMLDivElement>(null);
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
          ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            onToggle: (self) => {
              if (self.isActive) flipTl.play();
              else flipTl.pause();
            },
          });
        }

        // Scrubbed pin — hero holds: s2 (z-20) slides OVER the still-pinned hero (pinSpacing: false)
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        // Section 2 scroll-triggered
        gsap.from('.s2-inner', {
          y: 50, opacity: 0, duration: 1, stagger: 0.15,
          scrollTrigger: { trigger: s2Ref.current, start: 'top 75%' }
        });

        // Section 2 word-by-word reveal (gray → white, scrubbed) — inline chips
        // spin a full turn at the moment the light-up reaches them
        const s2Seq: HTMLElement[] = [];
        s2TextRef.current?.querySelectorAll('.s2-word, .s2-chip').forEach((el) => s2Seq.push(el as HTMLElement));
        if (s2Seq.length) {
          gsap.set(s2Seq.filter((el) => el.classList.contains('s2-word')), { opacity: 0.18 });
          gsap.set(s2Seq.filter((el) => el.classList.contains('s2-chip')), { opacity: 0.18, rotation: 0, transformOrigin: '50% 50%' });
          const s2Tl = gsap.timeline({
            scrollTrigger: { trigger: s2TextRef.current, start: 'top 85%', end: 'top 35%', scrub: true },
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

        // Section 5 parallax
        gsap.utils.toArray('.parallax-card').forEach((card: any) => {
          gsap.fromTo(card, { y: -50 }, {
            y: 50, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 }
          });
        });

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

      return () => {
        if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
        ctx.revert();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* ===== FIXED BACKGROUND — plain milky white behind hero + section 2 ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#f4f3ef] overflow-hidden" />

      {/* ===== STICKY MOBILE NAV + MENU OVERLAY — portaled to body so GSAP's
             pin-spacer DOM mutations can't break React's reconciliation ===== */}
      {createPortal(
        <>
          <div className="fixed top-0 inset-x-0 z-[90] md:hidden flex items-center justify-between px-5 py-3 bg-black/55 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
            <QolabLogo className="w-20" />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 text-white"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-[#0a0d0c] text-white flex flex-col px-6 md:hidden">
              <div className="flex items-center justify-between pt-4">
                <span className="inline-flex bg-[#0f0f11] rounded-full px-4 py-2.5 border border-white/10 shadow-md">
                  <QolabLogo className="w-24" />
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 text-white"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-8 mt-16">
                {[
                  { label: 'Home', action: () => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                  { label: 'About', action: () => { setMobileMenuOpen(false); onNavigate?.('about'); } },
                  { label: 'Services', action: () => { setMobileMenuOpen(false); onNavigate?.('services'); } },
                  { label: 'Works', action: () => { setMobileMenuOpen(false); onNavigate?.('projects'); } },
                  { label: 'Contact', action: () => { setMobileMenuOpen(false); onNavigate?.('contact'); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="font-display font-normal tracking-tight text-4xl text-white hover:text-[#6ee05a] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>,
        document.body
      )}

      {/* ===== PINNED HERO ===== */}
      <section 
        ref={heroRef} 
        className="relative w-full h-screen min-h-[640px] overflow-hidden bg-[#080c01] z-10 select-none"
      >
        {/* Bottom-left chartreuse/lime flare — placed beneath the grid so grid lines remain subtly visible across it */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Primary intense lime-yellow floor glow under the CTA button */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '-6%',
              bottom: '-28%',
              width: '68%',
              height: '78%',
              background: 'radial-gradient(ellipse 68% 62% at 44% 78%, #d2f282 0%, #b5df54 22%, #78b816 44%, #3d6802 66%, rgba(20, 36, 1, 0.45) 82%, transparent 96%)',
              filter: 'blur(38px)',
            }}
          />
          {/* Secondary upper-left olive-lime atmospheric halo behind subtext */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '-4%',
              bottom: '4%',
              width: '52%',
              height: '52%',
              background: 'radial-gradient(circle at 42% 58%, rgba(112, 178, 12, 0.52) 0%, rgba(62, 104, 2, 0.32) 48%, transparent 78%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        {/* Two-tier architectural blueprint grid layer */}
        <div 
          className="cyber-grid-bg absolute inset-0 z-[1] pointer-events-none opacity-95"
          style={{
            maskImage: 'radial-gradient(ellipse 96% 92% at 50% 48%, black 68%, transparent 98%)',
            WebkitMaskImage: 'radial-gradient(ellipse 96% 92% at 50% 48%, black 68%, transparent 98%)',
          }}
          aria-hidden="true"
        />

        {/* 3D Glossy Emerald Puzzle — static, rotated 33deg and cropped at bottom-right on both mobile and desktop */}
        <div
          ref={puzzleRef}
          aria-hidden="true"
          className="hero-puzzle-wrap block absolute bottom-0 right-0 pointer-events-none z-[12] w-[min(88vw,46vh)] h-[min(88vw,46vh)] md:w-[min(73.3vw,86.8vh)] md:h-[min(73.3vw,86.8vh)]"
        >
          <img
            src="/puzzle.png"
            alt="3D Jigsaw Puzzle Sculpture"
            className="w-full h-full object-contain select-none pointer-events-none"
            style={{
              transform: 'translate(18.5%, 38.5%) rotate(33deg)',
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Hero content layer */}
        <div className="hero-content-layer relative z-20 w-full h-full">
          {/* Top bar — desktop only (mobile uses the fixed glass bar) */}
          <div className="hidden md:flex w-full items-center justify-between pl-6 pr-6 md:pl-[9.5%] md:pr-[5.1%] pt-6 md:pt-[9.4vh] relative z-30">
            {/* Logo */}
            <div className="hero-topbar-item flex items-center">
              <QolabLogo className="w-36 sm:w-44 md:w-[min(18.2vw,21.6vh)]" />
            </div>

            {/* Center rotating badge: FUTURE READY SOLUTION — dead-center horizontally */}
            <div className="hero-topbar-item hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-[9.4vh]">
              <img
                src="/circle.png"
                alt="Future Ready Solution"
                className="animate-spin-badge select-none pointer-events-none"
                style={{
                  width: 'min(10.2vw, 12.1vh)',
                  height: 'min(10.2vw, 12.1vh)',
                }}
              />
            </div>

            {/* Right: 3 rounded-rectangle gradient nav pills matching referenced design */}
            <div className="hero-topbar-item hidden md:flex items-center gap-[8px]">
              <button
                onClick={onViewAllProjects}
                data-cursor="magnetic"
                data-cursor-text="Projects"
                className="inline-flex items-center justify-center rounded-[9px] text-white font-sans font-normal text-[12px] tracking-[0.03em] uppercase transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  width: 'min(5.0vw, 5.9vh)',
                  minWidth: '58px',
                  height: 'min(2.9vw, 3.43vh)',
                  minHeight: '34px',
                  background: 'linear-gradient(90deg, rgba(48, 8, 8, 0.92) 0%, #680505 42%, #e00405 100%)',
                }}
              >
                WORK
              </button>
              <button
                onClick={() => onSelectService?.('Brand Identity')}
                data-cursor="magnetic"
                data-cursor-text="Services"
                className="inline-flex items-center justify-center rounded-[9px] text-white font-sans font-normal text-[12px] tracking-[0.03em] uppercase transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  width: 'min(7.2vw, 8.5vh)',
                  minWidth: '84px',
                  height: 'min(2.9vw, 3.43vh)',
                  minHeight: '34px',
                  background: 'linear-gradient(90deg, rgba(5, 39, 4, 0.92) 0%, #0e6b05 42%, #18fc0b 100%)',
                }}
              >
                SERVICES
              </button>
              <button
                onClick={() => onNavigate?.('about')}
                data-cursor="magnetic"
                data-cursor-text="About Us"
                className="inline-flex items-center justify-center rounded-[9px] text-white font-sans font-normal text-[12px] tracking-[0.03em] uppercase transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  width: 'min(6.56vw, 7.78vh)',
                  minWidth: '76px',
                  height: 'min(2.9vw, 3.43vh)',
                  minHeight: '34px',
                  background: 'linear-gradient(90deg, rgba(67, 55, 8, 0.92) 0%, #836204 42%, #ca9d06 100%)',
                }}
              >
                ABOUT
              </button>
            </div>
          </div>

          {/* Main Left-Aligned Hero Composition — positioned at exact design coordinates */}
          <div className="hero-text-block px-6 md:px-0 md:pl-[9.5%] pt-28 sm:pt-32 md:pt-0 md:absolute md:top-[33.3vh] md:left-0 w-full z-20">
            <div className="relative z-10 w-full">
              {/* Monumental Headline in Zen Dots — larger heroic size covering ample space with rotating synonyms */}
              <h1
                className="hero-headline font-zen uppercase font-normal tracking-normal text-[3.1rem] sm:text-[4.6rem] md:text-[min(8.6vw,9.8vh)] lg:text-[min(9.2vw,10.4vh)] xl:text-[min(9.6vw,10.8vh)] leading-[0.98] select-none"
              >
                <div className="block hero-title-line whitespace-nowrap">
                  <span className="text-white">SOME</span>{' '}
                  <span className="text-[#1fff11]">IDEAS</span>
                </div>
                <div className="block hero-title-line text-white whitespace-nowrap mt-[0.04em]">
                  DESERVE TO
                </div>
                <div className="block hero-title-line text-[#1fff11] whitespace-nowrap mt-[0.04em]">
                  <span
                    className="hero-flip inline-grid overflow-hidden align-baseline"
                    style={{ lineHeight: 1.05 }}
                    aria-label="EXIST"
                  >
                    {HERO_FLIP_WORDS.map((word, i) => (
                      <span
                        key={word}
                        aria-hidden="true"
                        className={`hero-flip-word font-zen [grid-area:1/1] ${i === 0 ? '' : 'opacity-0'}`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </div>
              </h1>

              {/* Editorial Subtext in Clash Grotesk with increased size */}
              <p
                className="hero-subtext text-white/90 font-grotesk font-normal text-[16px] sm:text-[18px] md:text-[min(1.48vw,1.75vh)] lg:text-[min(1.58vw,1.85vh)] leading-[1.5] max-w-2xl mt-6 sm:mt-8 md:mt-[4.5vh]"
              >
                We don’t follow the future. We engineer it. Uniting brand<br className="hidden sm:inline" />{' '}
                strategy, computational design,<br className="hidden sm:inline" />{' '}
                and creative technology into category-defining digital<br className="hidden sm:inline" />{' '}
                products.
              </p>

              {/* Rounded-rectangle dark CTA button matching mockup */}
              <div className="hero-cta mt-8 sm:mt-10 md:mt-[6.2vh] flex items-center">
                <button
                  onClick={() => onNavigate?.('contact')}
                  data-cursor="magnetic"
                  data-cursor-text="Let's Talk"
                  className="group relative inline-flex items-center justify-between rounded-[16px] bg-[#122103] hover:bg-[#172a05] transition-all duration-300 pl-6 pr-3.5 py-3 md:pl-[min(2.18vw,2.59vh)] md:pr-[min(1.09vw,1.3vh)]"
                  style={{
                    width: 'min(23.9vw, 28.3vh)',
                    minWidth: '256px',
                    height: 'min(5.86vw, 6.94vh)',
                    minHeight: '62px',
                  }}
                >
                  <span className="font-sans text-[17px] md:text-[min(1.52vw,1.8vh)] font-normal tracking-[-0.01em] text-white">
                    Let’s Make it Exist
                  </span>
                  <span
                    className="rounded-full bg-[#1fff11] text-[#0a1402] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
                    style={{
                      width: 'min(4.06vw, 4.81vh)',
                      minWidth: '42px',
                      height: 'min(4.06vw, 4.81vh)',
                      minHeight: '42px',
                    }}
                  >
                    <ArrowRight size={20} strokeWidth={1.8} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-10 md:mb-14 font-display">Why Qolab</p>
          <p
            ref={s2TextRef}
            className="s2-inner font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.4] text-white font-medium tracking-tight"
          >
            <WordRoll text="We don't just design —" />{' '}
            <span className="italic font-light text-[#6ee05a]">we engineer</span>{' '}
            <WordRoll text="experiences." />{' '}
            <ChipDiamond />{' '}
            <WordRoll text="Every pixel, every interaction, every line of code is intentional." />{' '}
            <ChipClover />{' '}
            <WordRoll text="We blend creative direction with technical mastery to build products people genuinely love." />{' '}
            <ChipAsterisk />
          </p>
        </div>
        {/* Who we build for — bordered grid */}
        <div className="relative max-w-7xl mx-auto mt-20 md:mt-28">
          <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6 font-display">Who We Build For</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
            {[
              { title: 'Founders & Entrepreneurs', desc: 'Early-stage ideas that need shaping, designing, or building.' },
              { title: 'Established Businesses', desc: 'Teams improving their brand, digital presence, products, or operations.' },
              { title: 'Marketing & Brand Teams', desc: 'Creative direction, identity systems, websites, campaigns, and strategic support.' },
              { title: 'Product & Operations Teams', desc: 'Custom software, AI-assisted workflows, and business automation.' },
            ].map((audience) => (
              <div key={audience.title} className="s2-inner border-r border-b border-white/10 p-6 md:p-8 lg:p-10 hover:bg-white/[0.03] transition-colors">
                <p className="text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-display leading-tight">{audience.title}</p>
                <p className="text-base sm:text-lg md:text-xl lg:text-[1.5rem] text-gray-400 mt-3 md:mt-4 font-sans leading-snug">{audience.desc}</p>
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
            <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-6">
              No Great Thing Is Built <span className="text-[#6ee05a]">From One Piece.</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans max-w-xl">
              Great outcomes come from different disciplines and perspectives working as one. That's why we don't assign you one person — we build you a team around your brand: strategists, designers, engineers, and marketers, aligned on one point of contact and one outcome.
            </p>
            <p className="text-sm text-gray-500 font-sans mt-4 max-w-xl">
              One team, one point of contact, aligned on one outcome.
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
            <p className="text-gray-400 text-base sm:text-lg font-display leading-relaxed max-w-xl">
              We help turn imagination into tangible brands, products, platforms, and smarter ways of working.
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
