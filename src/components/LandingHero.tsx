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

export default function LandingHero({ onSelectProject, onViewAllProjects, onSelectService, onNavigate }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);

  const approachRef = useRef<HTMLDivElement>(null);
  const s8Ref = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // Hero content entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-bg-image', { scale: 1.12, opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
        .from('.hero-grid-rule', { scaleY: 0, opacity: 0, transformOrigin: 'top', duration: 1.1, stagger: { amount: 0.7 } }, 0.15)
        .from('.hero-nav-item', { y: -20, opacity: 0, duration: 0.8, stagger: 0.06 })
        .from('.hero-headline', { y: 60, opacity: 0, duration: 1.2 }, '-=0.4')
        .from('.hero-subtext', { y: 30, opacity: 0, duration: 0.9 }, '-=0.7')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5');

      // ===== PINNED HERO: 2x viewport =====
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.5,
      });

      // Section 2 scroll-triggered
      gsap.from('.s2-inner', {
        y: 50, opacity: 0, duration: 1, stagger: 0.15,
        scrollTrigger: { trigger: s2Ref.current, start: 'top 75%' }
      });

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

      // Footer
      gsap.from('.footer-col', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.site-footer', start: 'top 92%' }
      });

    }, containerRef);

    return () => ctx.revert();
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
          <img
            src={heroBg}
            alt=""
            className="hero-bg-image absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
        </div>

        {/* ===== EDITORIAL COLUMN GRID — faint blueprint rules ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="h-full w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 border-r-2 border-white/[0.07]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`hero-grid-rule h-full border-l-2 border-white/[0.07] ${i >= 4 ? 'hidden md:block' : ''} ${i >= 6 ? 'lg:block' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Hero text content */}
        <div className="hero-content-layer relative z-10 w-full h-full flex flex-col justify-between">
          {/* Top nav */}
          <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-16 pt-4 md:pt-6 relative z-20">
            <div className="flex items-center">
              <QolabLogo className="w-32 md:w-44" />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { label: 'About', action: () => onNavigate?.('about') },
                { label: 'Services', action: () => onNavigate?.('services') },
                { label: 'Works', action: () => onNavigate?.('projects') },
                { label: 'Contact', action: () => onNavigate?.('contact') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="hero-nav-item text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer font-display"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <FlagPair size={16} />
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-white"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <FlagPair size={20} />
              <span className="hidden lg:block text-xs text-gray-300 font-display">Nigeria &amp; UK</span>
              <span className="hero-nav-item text-sm font-semibold text-white cursor-pointer font-display">EN . USD</span>
            </div>
          </div>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col px-6 md:hidden">
              <div className="flex items-center justify-between pt-4">
                <QolabLogo className="w-24" />
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

          {/* Hero text content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 relative">
            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
              <p className="hero-nav-item text-xs font-semibold tracking-[0.2em] uppercase text-gray-300 mb-6 font-display">
                Creativity × Technology × Strategy
              </p>
              <h1 className="hero-headline font-display text-[3.2rem] sm:text-[5rem] lg:text-[7rem] leading-[0.92] tracking-tight text-white font-bold">
                Some Ideas Deserve to <span className="italic font-light text-[#3a863f]">Exist.</span>
              </h1>
              <p className="hero-subtext text-gray-300 text-base sm:text-lg mt-8 max-w-2xl mx-auto font-sans leading-relaxed text-center">
                We don't follow the future. We make it. We bring creativity, technology, and strategy together to turn ambitious thinking into meaningful solutions.
              </p>
              <div className="hero-cta mt-12 flex items-center gap-4 justify-center">
                <button
                  onClick={() => onNavigate?.('contact')}
                  className="flex items-center gap-2.5 bg-white text-[#1a1a1a] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#3a863f] hover:text-white transition-all hover:scale-105 active:scale-95 font-display"
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
              <p className="hero-nav-item mt-10 text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 font-display">
                QOLAB — Future Ready Solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

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
              Every pixel, every interaction, every line of code is intentional. We blend creative direction with technical mastery to build products people genuinely love.
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

      {/* ===== SECTION 4: PROJECTS (Asymmetric Parallax Grid) ===== */}
      <ProjectGrid
        onSelectProject={onSelectProject}
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

      {/* ===== SECTION 7C: PACKAGES (SOP Pricing Reference) ===== */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#f4f3ef] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 md:mb-20">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-4 font-sans">Investment</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05]">
                Three Ways to <span className="italic text-[#3a863f]">Start.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-sans">
                These are our standard starting packages. Every project still gets a proposal
                scoped around your goals — but most engagements begin here.
              </p>
            </div>
          </div>

          {/* Editorial pricing columns */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              {
                tier: 'GOOD',
                num: '01',
                name: 'Starter Brand Build',
                price: '₦500,000 – ₦1,500,000',
                usd: '$300 – $1,000',
                items: ['Logo', 'Brand guide', 'Social media kit'],
              },
              {
                tier: 'BETTER',
                num: '02',
                name: 'Full Brand Build',
                price: '₦1,500,000 – ₦3,500,000',
                usd: '$1,000 – $2,300',
                items: ['Full brand identity', 'Website'],
              },
              {
                tier: 'BEST',
                num: '03',
                name: 'Complete Brand System',
                price: '₦3,500,000+',
                usd: '$2,300+',
                items: ['Brand identity', 'Website', 'Marketing setup'],
              },
            ].map((pkg, i) => (
              <div
                key={pkg.name}
                className={`py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 border-t-2 border-black/[0.12] md:border-t-0 ${
                  i > 0 ? 'md:border-l-2 md:border-black/[0.08]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-gray-400">{pkg.tier}</span>
                  <span className="font-mono text-xs font-bold text-white bg-[#3a863f] w-7 h-7 rounded-full flex items-center justify-center">{pkg.num}</span>
                </div>
                <h3 className="font-display italic text-2xl sm:text-3xl text-[#1a1a1a] leading-tight mb-6">{pkg.name}</h3>
                <p className="font-display text-xl sm:text-2xl text-[#1a1a1a] font-semibold leading-snug">{pkg.price}</p>
                <p className="font-sans text-sm text-gray-500 mt-1">{pkg.usd}</p>
                <ul className="mt-8">
                  {pkg.items.map((item) => (
                    <li key={item} className="font-sans text-sm text-gray-700 py-3 border-t border-black/[0.08] last:border-b last:border-black/[0.08]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 md:mt-20 flex flex-col items-center text-center">
            <p className="font-sans text-xs text-gray-500 max-w-xl leading-relaxed mb-8">
              Prices are in Naira with indicative USD equivalents. Your proposal confirms
              the final scope, timeline, and investment.
            </p>
            <button
              onClick={() => onNavigate?.('contact')}
              className="flex items-center gap-2.5 bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#3a863f] transition-all hover:scale-105 active:scale-95 font-display"
            >
              Let's Make It Exist.
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: CTA ===== */}
      <section ref={s8Ref} className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0f0f11] text-white overflow-hidden z-20">
        <div className="s8-content max-w-7xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-6 font-display">Ready to start?</p>
          <h2 className="font-display text-[3.2rem] sm:text-[5rem] lg:text-[7rem] leading-[0.92] tracking-tight text-white">
            The Future Is Not a <span className="italic font-light text-[#3a863f]">Spectator</span> Sport.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-8 max-w-2xl mx-auto font-display leading-relaxed">
            We help turn imagination into tangible brands, products, platforms, and smarter ways of working.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button
              onClick={() => onNavigate?.('contact')}
              className="bg-[#3a863f] hover:bg-[#2f6d33] text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-display"
            >
              Start Something With Qolab.
            </button>
            <button
              onClick={onViewAllProjects}
              className="border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:bg-white/5 font-display"
            >
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer w-full bg-[#0f0f11] text-gray-400 pt-16 pb-8 px-6 md:px-12 lg:px-16 border-t border-white/5 z-20 relative">
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
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center">
            <QolabLogo className="w-24" />
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
