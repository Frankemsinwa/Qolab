import { useEffect, useRef, useState, useId } from 'react';
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
import heroBg from '../../assets/hero-imgs/bg.jpg';

gsap.registerPlugin(ScrollTrigger);

function FlagPair({ size = 20 }: { size?: number }) {
  const clipId = `uk-flag-${useId().replace(/:/g, '')}`;
  return (
    <span className="flex items-center" aria-label="Based in Nigeria and the United Kingdom">
      <span
        role="img"
        aria-label="Nigeria"
        title="Nigeria"
        className="rounded-full border border-white/40 shrink-0"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(90deg, #008751 0 33.3%, #ffffff 33.3% 66.6%, #008751 66.6% 100%)',
        }}
      />
      <svg
        viewBox="0 0 60 60"
        role="img"
        aria-label="United Kingdom"
        title="United Kingdom"
        className="rounded-full border border-white/40 shrink-0"
        style={{ width: size, height: size, marginLeft: -size * 0.28 }}
      >
        <defs>
          <clipPath id={clipId}><circle cx="30" cy="30" r="30" /></clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="60" height="60" fill="#012169" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" strokeWidth="12" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" strokeWidth="6" />
          <path d="M30 0 V60 M0 30 H60" stroke="#fff" strokeWidth="20" />
          <path d="M30 0 V60 M0 30 H60" stroke="#C8102E" strokeWidth="12" />
        </g>
      </svg>
    </span>
  );
}

interface LandingHeroProps {
  onSelectProject: (project: any) => void;
  onViewAllProjects: () => void;
  onSelectService?: (service: Service) => void;
  onNavigate?: (view: 'about' | 'projects' | 'services' | 'contact') => void;
}

/** Splits text into word spans for the scroll-driven highlight reveal */
function WordRoll({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="s2-word">{word}{' '}</span>
      ))}
    </>
  );
}

/** Inline neon icon chips embedded in body copy (reference-site style) */
function ChipDiamond() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" stroke="#6ee05a" strokeWidth="2.4" />
    </svg>
  );
}

function ChipClover() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="#6ee05a" aria-hidden="true">
      <circle cx="12" cy="6.8" r="3.8" />
      <circle cx="12" cy="17.2" r="3.8" />
      <circle cx="6.8" cy="12" r="3.8" />
      <circle cx="17.2" cy="12" r="3.8" />
    </svg>
  );
}

function ChipAsterisk() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block w-[0.9em] h-[0.9em] mx-0.5 -translate-y-px" fill="none" aria-hidden="true">
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
        // Hero content entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .from('.hero-bg-wrap', { opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
          .from('.hero-nav-item', { y: -20, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.3)
          .from('.hero-headline', { y: 40, opacity: 0, duration: 1.1 }, '-=0.5')
          .from('.hero-subtext', { y: 30, opacity: 0, duration: 0.9 }, '-=0.7')
          .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5');

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
          .to('.hero-text-block', { scale: 0.94, opacity: 0, ease: 'power1.in' }, 0);

        // Green flare spotlight follows mouse (matches bg image flare)
        const spotlight = spotlightRef.current;
        if (spotlight && hero) {
          gsap.set(spotlight, { xPercent: -50, yPercent: -50, x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 });
          const xTo = gsap.quickTo(spotlight, 'x', { duration: 0.65, ease: 'power3.out' });
          const yTo = gsap.quickTo(spotlight, 'y', { duration: 0.65, ease: 'power3.out' });
          onHeroMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect();
            xTo(e.clientX - rect.left);
            yTo(e.clientY - rect.top);
            gsap.to(spotlight, { opacity: 1, duration: 0.4, overwrite: 'auto' });
          };
          hero.addEventListener('mousemove', onHeroMove);
        }

        // Section 2 scroll-triggered
        gsap.from('.s2-inner', {
          y: 50, opacity: 0, duration: 1, stagger: 0.15,
          scrollTrigger: { trigger: s2Ref.current, start: 'top 75%' }
        });

        // Section 2 word-by-word reveal (gray → white, scrubbed)
        const s2Words = gsap.utils.toArray<HTMLElement>('.s2-word');
        if (s2Words.length) {
          gsap.set(s2Words, { opacity: 0.18 });
          gsap.to(s2Words, {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: { trigger: s2TextRef.current, start: 'top 85%', end: 'top 35%', scrub: true },
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
          const eyeTl = gsap.timeline({ repeat: -1, repeatDelay: 2.8, paused: true });
          eyeTl
            .to(eyeLids, { scaleY: 0.06, duration: 0.13, ease: 'power2.in' })
            .to(eyeLids, { scaleY: 1, duration: 0.22, ease: 'power2.out' });
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

      {/* ===== PINNED HERO ===== */}
      <section 
        ref={heroRef} 
        className="relative w-full h-screen overflow-hidden bg-transparent z-10"
      >

        {/* ===== HERO BACKGROUND IMAGE + contrast scrims ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="hero-bg-wrap absolute inset-0">
            <img
              src={heroBg}
              alt=""
              className="w-full h-full object-cover object-center scale-x-[-1]"
            />
            <AuroraBeams />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
          {/* Mouse-following green flare spotlight — matches bg image flare */}
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="absolute top-0 left-0 w-[42rem] h-[42rem] rounded-full opacity-0 pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(circle, rgba(110, 230, 90, 0.2) 0%, rgba(70, 190, 70, 0.1) 35%, rgba(58, 134, 63, 0.05) 55%, transparent 70%)',
              filter: 'blur(60px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Hero text content */}
        <div className="hero-content-layer relative z-10 w-full h-full flex flex-col justify-between">
          {/* Top bar — small logo left, meta right */}
          <div className="w-full flex items-start justify-between px-6 md:px-12 lg:px-16 pt-6 md:pt-8 relative z-20">
            <QolabLogo className="w-20 md:w-24" />
            <div className="flex items-center gap-3 md:gap-4">
              <FlagPair size={16} />
              <span className="hidden md:block text-[11px] tracking-[0.15em] uppercase text-gray-400 font-display">Nigeria &amp; UK</span>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-white"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col px-6 md:hidden">
              <div className="flex items-center justify-between pt-4">
                <span className="inline-flex bg-[#0f0f11] rounded-full px-4 py-2.5 border border-white/10 shadow-md">
                  <QolabLogo className="w-24" />
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 text-[#1a1a1a]"
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
                    className="font-display text-4xl text-[#1a1a1a] hover:text-[#3a863f] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Hero text content — immersive left-aligned block */}
          <div className="hero-text-block flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 relative">
            <div className="relative z-10 w-full max-w-6xl">
              <p className="hero-nav-item text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-300 mb-5 md:mb-7 font-display">
                Creativity × Technology × Strategy
              </p>
              <h1 className="hero-headline font-display text-[2.9rem] sm:text-[4.25rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] leading-[0.9] tracking-tight text-white font-medium">
                <span className="block">Some Ideas</span>
                <span className="block">
                  Deserve to{' '}
                  <span className="italic font-light text-[#6ee05a]">
                    Exist.
                  </span>
                </span>
              </h1>
              <p className="hero-subtext text-gray-300 text-base sm:text-lg mt-7 md:mt-9 max-w-2xl font-display leading-relaxed">
                We don't follow the future. We make it. We bring creativity, technology, and strategy together to turn ambitious thinking into meaningful solutions.
              </p>
              <div className="hero-cta mt-9 md:mt-11 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate?.('contact')}
                  data-cursor="magnetic"
                  data-cursor-text="Let's go"
                  className="flex items-center gap-2.5 border border-white/40 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0f0f11] transition-all font-display"
                >
                  Let's Make It Exist.
                  <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={onViewAllProjects}
                  className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#3a863f] transition-colors font-display"
                >
                  Explore Our Work.
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom meta — slogan */}
          <div className="w-full flex items-end px-6 md:px-12 lg:px-16 pb-6 md:pb-8 relative z-20">
            <p className="hero-nav-item text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 font-display">
              QOLAB — Future Ready Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Hold spacer — gives the pin a 1vh pause before s2 starts sliding over the hero */}
      <div className="hero-hold-spacer h-screen" aria-hidden="true" />

      {/* ===== SECTION 2: WHY QOLAB — backdrop blur over fixed silhouette ===== */}
      <section
        ref={s2Ref}
        className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 z-20 overflow-hidden bg-[#0a0f0d]"
      >
        {/* Green light flares */}
        <div className="absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(58,134,63,0.35) 0%, rgba(58,134,63,0.12) 45%, transparent 70%)' }}
        />
        <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(58,134,63,0.3) 0%, rgba(58,134,63,0.1) 45%, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-4 font-display">Why Qolab</p>
            <h2 className="s2-inner font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              We don't just design — <span className="italic text-[#3a863f]">we engineer</span> experiences.
            </h2>
            <p className="s2-inner text-gray-400 text-base sm:text-lg mt-6 leading-relaxed font-sans max-w-lg">
              <WordRoll text="Every pixel, every interaction, every line of code is intentional." />{' '}
              <ChipDiamond />{' '}
              <WordRoll text="We blend creative direction with technical mastery" />{' '}
              <ChipClover />{' '}
              <WordRoll text="to build products people genuinely love." />{' '}
              <ChipAsterisk />
            </p>
          </div>
          <div>
            <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4 font-display">Who We Build For</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Founders & Entrepreneurs', desc: 'Early-stage ideas that need shaping, designing, or building.' },
                { title: 'Established Businesses', desc: 'Teams improving their brand, digital presence, products, or operations.' },
                { title: 'Marketing & Brand Teams', desc: 'Creative direction, identity systems, websites, campaigns, and strategic support.' },
                { title: 'Product & Operations Teams', desc: 'Custom software, AI-assisted workflows, and business automation.' },
              ].map((audience) => (
                <div key={audience.title} className="s2-inner bg-white/[0.06] backdrop-blur-md rounded-2xl p-6 border border-[#3a863f]/25 hover:border-[#3a863f]/50 transition-colors shadow-[0_0_30px_rgba(58,134,63,0.08)]">
                  <p className="text-white font-semibold text-sm font-display">{audience.title}</p>
                  <p className="text-sm text-gray-400 mt-2 font-sans leading-relaxed">{audience.desc}</p>
                </div>
              ))}
            </div>
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
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-white z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-4 font-sans">Our Difference</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05]">
              We Don't Believe in <span className="italic text-[#3a863f]">Thinking Inside</span> the Brief.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-sans">
              We question assumptions, look for overlooked opportunities, and treat creativity, technology, and strategy as connected disciplines — not separate deliverables.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Creativity', 'Technology', 'Strategy'].map((discipline) => (
                <span key={discipline} className="text-xs font-semibold tracking-[0.15em] uppercase text-[#2f6d33] border border-[#3a863f]/30 rounded-full px-4 py-1.5 font-sans">
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
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-white z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-4 font-sans">Collaboration</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05] mb-6">
              No Great Thing Is Built <span className="italic text-[#3a863f]">From One Piece.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-sans max-w-xl">
              Great outcomes come from different disciplines and perspectives working as one. That's why we don't assign you one person — we build you a team around your brand: strategists, designers, engineers, and marketers, aligned on one point of contact and one outcome.
            </p>
            <p className="text-sm text-gray-500 font-sans mt-4 max-w-xl">
              One team, one point of contact, aligned on one outcome.
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="flex items-center -space-x-8 md:-space-x-10">
              {[
                { label: 'Strategy', bg: 'bg-[#3a863f]' },
                { label: 'Design', bg: 'bg-[#2f6d33]' },
                { label: 'Technology', bg: 'bg-[#1a1a1a]' },
              ].map((piece) => (
                <div
                  key={piece.label}
                  className={`w-32 h-32 md:w-44 md:h-44 rounded-full ${piece.bg} border-4 border-white flex items-center justify-center text-white font-display text-sm md:text-base shadow-lg`}
                >
                  {piece.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES — bordered grid (reference-style partners grid) ===== */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0a0d0c] z-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-4 font-display">Capabilities</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-12">
            One team, <span className="italic font-light text-[#6ee05a]">every discipline.</span>
          </h2>
          <div className="cap-grid grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {['Brand Identity', 'Web Design', 'Software & Apps', 'AI & Automation', 'Digital Marketing', 'Business Strategy', 'Motion Design', 'Consulting'].map((cap) => (
              <div
                key={cap}
                className="cap-cell flex items-center justify-center aspect-[4/3] p-6 border-r border-b border-white/10 font-display text-base md:text-lg text-gray-300 hover:text-[#6ee05a] hover:bg-white/[0.03] transition-colors text-center"
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
          <h2 className="font-display text-[3.4rem] sm:text-[5.5rem] lg:text-[8rem] leading-[0.9] tracking-tight text-white">
            The Future Is
            <br />
            Not a <ChipEye />{' '}
            <span className="italic font-light text-[#6ee05a]">Spectator</span>
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
            <h2 className="font-display italic font-light text-white text-[3.6rem] sm:text-[5.5rem] lg:text-[8rem] leading-[0.9] tracking-tight">
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
                className="group flex flex-col justify-between aspect-[4/3] md:aspect-[5/4] p-5 md:p-6 border-r border-b border-white/10 md:border-b-0 hover:bg-white/[0.04] transition-colors last:border-r-0"
              >
                <span className="text-2xl md:text-3xl font-display text-gray-500 group-hover:text-[#6ee05a] transition-colors">
                  {social.label[0]}
                </span>
                <span className="text-xs font-display text-gray-300 group-hover:text-white transition-colors">
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
              <li><a href="#" className="hover:text-white transition-colors">Website Design & Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Software & App Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Solutions & Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Marketing & Growth Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Business Strategy & Consulting</a></li>
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
