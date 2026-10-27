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
import AuroraBeams from './AuroraBeams';
import ScrollMarquee from './ScrollMarquee';
import heroBg from '../../assets/hero-imgs/bright-light-dark-background.jpg';

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
          {wi < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}

const HERO_FLIP_WORDS = ['future.', 'system.', 'reality.', 'solution.'];

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
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let onHeroMove: ((e: MouseEvent) => void) | null = null;
    const hero = heroRef.current;

    if (!reduced) {
      const ctx = gsap.context(() => {
        // Hero content entrance — blur-type reveal
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .from('.hero-bg-wrap', { opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
          .from('.hero-nav-item', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.3)
          .from('.hero-char', { opacity: 0, filter: 'blur(14px)', y: 16, duration: 0.5, stagger: 0.018, ease: 'power2.out' }, 0.45)
          .from('.hero-flip', { opacity: 0, filter: 'blur(14px)', duration: 0.6, ease: 'power2.out' }, 1.1)
          .from('.hero-wordmark', { opacity: 0, y: 50, duration: 1.4, ease: 'power2.out' }, 0.6)
          .from('.hero-visionary-wrap', { opacity: 0, y: 70, scale: 0.96, duration: 1.3, ease: 'power3.out' }, 0.5)
          .from('.hero-card-wrap', { opacity: 0, x: 40, duration: 1.1, ease: 'power3.out' }, 0.9)
          .from('.hero-subword', { opacity: 0, filter: 'blur(8px)', y: 8, duration: 0.4, stagger: 0.012, ease: 'power2.out' }, 1.25)
          .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, 1.5);

        // Visionary subtle idle float
        gsap.to('.hero-visionary-float', {
          y: -12,
          duration: 4.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        // "Exist." word-flip — seamless loop: words exit up, next enters from below,
        // and each word is quietly parked off-screen (clipped) before its turn again.
        const flipWords = gsap.utils.toArray<HTMLElement>('.hero-flip-word');
        if (flipWords.length > 1) {
          gsap.set(flipWords.slice(1), { yPercent: 115, opacity: 1 });
          const flipTl = gsap.timeline({ repeat: -1, paused: true });
          const dur = 0.55;
          const hold = 1.6;
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

        // Scrubbed pin — hero holds 2vh: bg zooms 1.0→1.08, headline shrinks & fades
        // while s2 (z-20) slides OVER the still-pinned hero (pinSpacing: false)
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            scrub: 1,
          }
        })
          .to('.hero-bg-wrap', { scale: 1.08, ease: 'none' }, 0)
          .to('.hero-q-wrap', { y: -60, ease: 'none' }, 0)
          .to('.hero-text-block', { scale: 0.94, opacity: 0, ease: 'power1.in' }, 0);

        // Green flare spotlight & interactive 3D parallax
        const spotlight = spotlightRef.current;
        if (hero) {
          if (spotlight) {
            gsap.set(spotlight, { xPercent: -50, yPercent: -50, x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 });
          }
          const spotX = spotlight ? gsap.quickTo(spotlight, 'x', { duration: 0.65, ease: 'power3.out' }) : null;
          const spotY = spotlight ? gsap.quickTo(spotlight, 'y', { duration: 0.65, ease: 'power3.out' }) : null;

          // Parallax for visionary figure, giant wordmark, and top card
          const visX = gsap.quickTo('.hero-visionary-tilt', 'x', { duration: 0.8, ease: 'power2.out' });
          const visY = gsap.quickTo('.hero-visionary-tilt', 'y', { duration: 0.8, ease: 'power2.out' });
          const visRotY = gsap.quickTo('.hero-visionary-tilt', 'rotationY', { duration: 0.8, ease: 'power2.out' });
          const visRotX = gsap.quickTo('.hero-visionary-tilt', 'rotationX', { duration: 0.8, ease: 'power2.out' });
          const wordmarkX = gsap.quickTo('.hero-wordmark-inner', 'x', { duration: 1.1, ease: 'power2.out' });
          const cardX = gsap.quickTo('.hero-card-inner', 'x', { duration: 0.9, ease: 'power2.out' });
          const cardY = gsap.quickTo('.hero-card-inner', 'y', { duration: 0.9, ease: 'power2.out' });

          onHeroMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            const normX = (relX / rect.width - 0.5) * 2; // -1 to 1
            const normY = (relY / rect.height - 0.5) * 2; // -1 to 1

            if (spotX && spotY) {
              spotX(relX);
              spotY(relY);
              gsap.to(spotlight, { opacity: 1, duration: 0.4, overwrite: 'auto' });
            }

            // 3D parallax tracking
            visX(normX * 18);
            visY(normY * 10);
            visRotY(normX * 9);
            visRotX(-normY * 6);

            // Counter-depth parallax
            wordmarkX(-normX * 22);
            cardX(-normX * 12);
            cardY(-normY * 8);
          };
          hero.addEventListener('mousemove', onHeroMove);
        }

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
        if (onHeroMove && hero) hero.removeEventListener('mousemove', onHeroMove);
        ctx.revert();
      };
    }

    return () => {
      if (onHeroMove && hero) hero.removeEventListener('mousemove', onHeroMove);
    };
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
        className="relative w-full h-screen overflow-hidden bg-transparent z-10"
      >

        {/* ===== HERO BACKGROUND & 3 CINEMATIC EMERALD FLARES (MATCHING CHARACTER LIGHTING) ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#060807]" aria-hidden="true">
          <div className="hero-bg-wrap absolute inset-0">
            {/* Subtle vertical architectural grid lines — reference design hallmark */}
            <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 lg:px-16 opacity-40" aria-hidden="true">
              <div className="w-px h-full bg-white/[0.04]" />
              <div className="w-px h-full bg-white/[0.04]" />
              <div className="w-px h-full bg-white/[0.04]" />
              <div className="w-px h-full bg-white/[0.04] hidden sm:block" />
              <div className="w-px h-full bg-white/[0.04] hidden md:block" />
              <div className="w-px h-full bg-white/[0.04] hidden lg:block" />
            </div>

            {/* 1. Top-Left Atmospheric Flare (behind headline) */}
            <div
              aria-hidden="true"
              className="absolute -top-[15%] -left-[10%] w-[54vw] h-[54vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none opacity-85 z-[3]"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(110, 224, 90, 0.25) 0%, rgba(72, 199, 101, 0.14) 35%, rgba(25, 112, 72, 0.04) 65%, transparent 75%)',
                filter: 'blur(90px)',
                mixBlendMode: 'screen',
              }}
            />

            {/* 2. Top-Center Overhead Flare (bleeding down from top edge above character) */}
            <div
              aria-hidden="true"
              className="absolute -top-[18%] left-1/2 -translate-x-1/2 w-[48vw] h-[36vw] max-w-[720px] max-h-[500px] rounded-full pointer-events-none opacity-90 z-[3]"
              style={{
                background: 'radial-gradient(ellipse at 50% 25%, rgba(110, 224, 90, 0.35) 0%, rgba(72, 199, 101, 0.18) 35%, rgba(25, 112, 72, 0.05) 65%, transparent 80%)',
                filter: 'blur(75px)',
                mixBlendMode: 'screen',
              }}
            />

            {/* 3. Top-Right Edge Flare (hugging top-right perimeter and corner) */}
            <div
              aria-hidden="true"
              className="absolute -top-[14%] -right-[8%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none opacity-85 z-[3]"
              style={{
                background: 'radial-gradient(circle at 75% 25%, rgba(110, 224, 90, 0.32) 0%, rgba(72, 199, 101, 0.16) 38%, rgba(25, 112, 72, 0.04) 65%, transparent 80%)',
                filter: 'blur(80px)',
                mixBlendMode: 'screen',
              }}
            />

            {/* 4. Center Silhouette Backlight (behind visionary torso & between backdrop letters) */}
            <div
              aria-hidden="true"
              className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[48vw] h-[50vh] max-w-[740px] max-h-[620px] rounded-full pointer-events-none opacity-85 z-[4]"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(110, 224, 90, 0.30) 0%, rgba(72, 199, 101, 0.16) 35%, rgba(25, 112, 72, 0.04) 60%, transparent 75%)',
                filter: 'blur(80px)',
                mixBlendMode: 'screen',
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

          {/* Mouse-following green flare spotlight (exact emerald hue) */}
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="absolute top-0 left-0 w-[42rem] h-[42rem] rounded-full opacity-0 pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(circle, rgba(110, 224, 90, 0.16) 0%, rgba(72, 199, 101, 0.08) 35%, rgba(25, 112, 72, 0.03) 55%, transparent 70%)',
              filter: 'blur(65px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Giant Architectural Backdrop Wordmark: QOLAB */}
        <div aria-hidden="true" className="hero-wordmark absolute -bottom-4 lg:-bottom-10 inset-x-0 w-full flex justify-center pointer-events-none z-[4] overflow-hidden select-none">
          <span className="hero-wordmark-inner inline-block will-change-transform font-display font-black text-[22vw] leading-none tracking-[-0.05em] text-white/[0.07] lg:text-white/[0.11] whitespace-nowrap">
            QOLAB
          </span>
        </div>

        {/* Mobile Atmospheric Visionary Silhouette */}
        <div aria-hidden="true" className="md:hidden absolute bottom-0 right-[-10%] sm:right-0 w-[80vw] max-w-[340px] h-[65vh] pointer-events-none z-[3] opacity-35 flex items-end justify-center overflow-hidden select-none">
          <img
            src="/cyber-visionary.webp"
            alt=""
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        {/* Central Cyber-Visionary Hero Figure (Interactive 3D Perspective Tilt) */}
        <div 
          aria-hidden="true" 
          className="hero-visionary-wrap hidden md:flex absolute bottom-0 left-[48%] lg:left-[51%] -translate-x-1/2 w-[42vw] max-w-[620px] h-[88vh] pointer-events-none z-[5] items-end justify-center [perspective:1000px]"
        >
          <div className="hero-visionary-tilt w-full h-full will-change-transform transform-gpu flex items-end justify-center">
            <div className="hero-visionary-float relative w-full h-full flex items-end justify-center">
              {/* Emerald volumetric bloom directly behind head & shoulders */}
              <div 
                className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full opacity-65 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(circle, rgba(110, 224, 90, 0.38) 0%, rgba(72, 199, 101, 0.18) 40%, rgba(25, 112, 72, 0.06) 65%, transparent 75%)',
                  filter: 'blur(75px)',
                  mixBlendMode: 'screen',
                }}
              />

              <img
                src="/cyber-visionary.webp"
                alt="Qolab Cyber Visionary"
                className="w-full h-full object-contain object-bottom select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* Floating Glass Recognition Card & Metrics (Right Column — Aligned with Hero Top) */}
        <div className="hero-card-wrap hidden lg:flex absolute right-6 md:right-12 lg:right-16 top-10 md:top-14 lg:top-16 xl:top-20 w-[320px] xl:w-[350px] pointer-events-auto z-20">
          <div className="hero-card-inner w-full flex flex-col items-end gap-7 text-right will-change-transform">
            {/* Interactive Glass Card with hover glow */}
            <div 
              data-cursor="magnetic"
              className="group/card w-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#6ee05a]/40 rounded-2xl p-4 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_50px_rgba(110,230,90,0.18)] transition-all duration-500 flex gap-4 text-left cursor-pointer"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 relative group-hover/card:border-[#6ee05a]/30 transition-colors shadow-inner">
                <img 
                  src="/cyber-tech-lab.webp" 
                  alt="Recognition" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-white font-sans text-xs font-semibold">
                    <span className="group-hover/card:text-[#6ee05a] transition-colors">Recognition</span>
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover/card:rotate-45">
                      <ArrowUpRight size={13} strokeWidth={2.4} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug font-sans group-hover/card:text-gray-300 transition-colors">
                    We build intelligent visual systems that make brands stand out and scale.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-10 h-full bg-[#6ee05a] rounded-full shadow-[0_0_8px_#6ee05a]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6ee05a] shadow-[0_0_6px_#6ee05a] animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Section: 100% and 360° */}
            <div className="grid grid-cols-2 gap-6 text-left w-full pt-1">
              <div className="group cursor-default">
                <div className="font-display text-4xl xl:text-5xl font-bold text-white tracking-tight group-hover:text-[#6ee05a] transition-colors duration-300">
                  100%
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-sans group-hover:text-gray-300 transition-colors">
                  No cosmetic illusions. Only clear systems built for market leadership.
                </p>
              </div>
              <div className="group cursor-default">
                <div className="font-display text-4xl xl:text-5xl font-bold text-white tracking-tight group-hover:text-[#6ee05a] transition-colors duration-300">
                  360°
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-sans group-hover:text-gray-300 transition-colors">
                  Full brand presence: from strategy and engineering to launch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero text content (Top nav completely removed per user request) */}
        <div className="hero-content-layer relative z-10 w-full h-full flex flex-col justify-between pointer-events-none pt-10 md:pt-14 lg:pt-16">
          {/* Hero text — left-aligned composition matching reference */}
          <div className="hero-text-block flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 relative pointer-events-auto">
            <div className="relative z-10 w-full max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6ee05a] animate-pulse shadow-[0_0_8px_#6ee05a]" />
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-gray-300 font-medium">Creative Technology Studio</span>
              </div>

              <h1 className="hero-headline font-display text-[3.2rem] sm:text-[4.2rem] md:text-[5rem] lg:text-[6.2rem] xl:text-[7.2rem] leading-[0.88] tracking-[-0.04em] text-white font-bold">
                <span className="block"><CharLine text="Ideas first." /></span>
                <span className="block"><CharLine text="Then the" /></span>
                <span className="block text-[#6ee05a]">
                  <span
                    className="hero-flip inline-grid overflow-hidden align-baseline"
                    style={{ lineHeight: 1.15 }}
                    aria-label="future."
                  >
                    {HERO_FLIP_WORDS.map((word, i) => (
                      <span
                        key={word}
                        aria-hidden="true"
                        className={`hero-flip-word font-serif italic text-[#6ee05a] [grid-area:1/1] ${i === 0 ? '' : 'opacity-0'}`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <p className="hero-subtext text-gray-300 text-sm sm:text-base mt-6 md:mt-8 max-w-md font-sans leading-relaxed text-left">
                <WordRoll
                  cls="hero-subword"
                  text="Strategy, technology and communication shaped into future-ready digital systems."
                />
              </p>
              <div className="hero-cta mt-8 md:mt-10 flex flex-wrap items-center justify-start gap-5 text-left w-full">
                <button
                  onClick={() => onNavigate?.('contact')}
                  data-cursor="magnetic"
                  data-cursor-text="Let's Talk"
                  className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white text-[#0f0f11] font-sans text-xs md:text-sm font-semibold tracking-tight transition-all duration-300 hover:shadow-[0_0_30px_rgba(110,230,90,0.4)]"
                >
                  <span>Start a Project</span>
                  <span className="w-8 h-8 rounded-full bg-[#0f0f11] text-white flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={15} />
                  </span>
                </button>
                <button
                  onClick={onViewAllProjects}
                  data-cursor="magnetic"
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors font-sans py-2"
                >
                  <span>View Our Work</span>
                  <ArrowRight size={14} className="text-[#6ee05a]" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom meta — captions stacked like the reference */}
          <div className="w-full flex flex-col gap-1.5 items-start px-6 md:px-12 lg:px-16 pb-6 md:pb-8 relative z-20">
            <p className="hero-nav-item text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 font-sans">
              Creativity × Technology × Strategy
            </p>
            <p className="hero-nav-item text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase text-gray-500 font-sans">
              QOLAB — Future Ready Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Hold spacer — gives the pin a 1vh pause before s2 starts sliding over the hero */}
      <div className="hero-hold-spacer h-screen" aria-hidden="true" />

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
