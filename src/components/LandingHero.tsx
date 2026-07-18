import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, ArrowDownRight, Menu, X } from 'lucide-react';
import heroVideo from '../assets/video_3157b4c2cd31.mp4';
import ServicesCarousel from './ServicesCarousel';
import ProjectGrid from './ProjectGrid';
import ApproachSection from './ApproachSection';
import { projectsData } from '../data';
import { Service } from '../types';
import logoImg from '../assets/logo.png.png';

gsap.registerPlugin(ScrollTrigger);

interface LandingHeroProps {
  onSelectProject: (project: any) => void;
  onViewAllProjects: () => void;
  onSelectService?: (service: Service) => void;
  onNavigate?: (view: 'about' | 'projects' | 'contact') => void;
}

export default function LandingHero({ onSelectProject, onViewAllProjects, onSelectService, onNavigate }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const s6Ref = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const s8Ref = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== PINNED HERO: 2x viewport, silhouette turns =====
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.5,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // Hero content entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-nav-item', { y: -20, opacity: 0, duration: 0.8, stagger: 0.06 })
        .from('.hero-headline', { y: 60, opacity: 0, duration: 1.2 }, '-=0.4')
        .from('.hero-subtext', { y: 30, opacity: 0, duration: 0.9 }, '-=0.7')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-partners', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.hero-bigtext', { y: 80, opacity: 0, duration: 1.4 }, '-=0.8');

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

      // Section 6
      gsap.from('.s6-card', {
        y: 60, opacity: 0, duration: 1, stagger: 0.2,
        scrollTrigger: { trigger: s6Ref.current, start: 'top 75%' }
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

  const partners = ['Accenture', 'Deloitte', 'KPMG', 'PwC', 'EY'];

  const testimonials = [
    { quote: "Qolab's collaborative workflow, technical precision, and eye for detail helped us launch ahead of schedule with remarkable aesthetics.", name: 'Clara Solis', role: 'VP of Design, Shorthand' },
    { quote: "They don't just build products — they craft experiences. Our platform engagement tripled within three months of relaunch.", name: 'Marcus Chen', role: 'CTO, Aether Inc.' },
    { quote: "The team's ability to translate complex technical requirements into intuitive interfaces is unmatched. A true creative partner.", name: 'Sarah Okafor', role: 'Head of Product, Synapse Labs' },
  ];

  return (
    <div ref={containerRef} className="w-full">
      {/* ===== FIXED BACKGROUND VIDEO — stays on screen through hero + section 2 ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0f0f11]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-45"
          src={heroVideo}
        />
        {/* Premium blending layers */}
        <div 
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-[#0f0f11]"
        />
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 15, 17, 0.15) 0%, rgba(15, 15, 17, 0.85) 100%)'
          }}
        />
        {/* Giant QOLAB text — behind content */}
        <div className="absolute inset-0 flex items-center justify-center z-[3] select-none overflow-hidden">
          <span className="font-display text-[22vw] leading-none tracking-tighter text-white/[0.05] font-bold whitespace-nowrap">
            QOLAB
          </span>
        </div>
      </div>

      {/* ===== PINNED HERO ===== */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-transparent z-10">

        {/* Hero text content */}
        <div className="hero-content-layer relative z-10 w-full h-full flex flex-col">
          {/* Top nav */}
          <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-16 pt-4 md:pt-6 relative z-20">
            <div className="flex items-center gap-0">
              <img
                src={logoImg}
                alt="Qolab"
                className="h-20 md:h-24 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { label: 'About', action: () => onNavigate?.('about') },
                { label: 'Works', action: () => onNavigate?.('projects') },
                { label: 'Contact', action: () => onNavigate?.('contact') },
              ].map((item) => (
                <a
                  key={item.label}
                  onClick={item.action}
                  className="hero-nav-item text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer font-sans"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-white"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-5">
              <span className="hidden lg:block text-xs text-gray-400 font-sans">Based in Abuja, Nigeria</span>
              <span className="hero-nav-item text-sm font-semibold text-white cursor-pointer font-sans">EN . USD</span>
            </div>
          </div>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col px-6 md:hidden">
              <div className="flex items-center justify-between pt-4">
                <img src={logoImg} alt="Qolab" className="h-20 w-auto" style={{ mixBlendMode: 'multiply' }} />
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
                  { label: 'Works', action: () => { setMobileMenuOpen(false); onNavigate?.('projects'); } },
                  { label: 'Contact', action: () => { setMobileMenuOpen(false); onNavigate?.('contact'); } },
                ].map((item) => (
                  <a
                    key={item.label}
                    onClick={item.action}
                    className="font-display text-4xl text-[#1a1a1a] hover:text-[#108a93] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Hero text content */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16">
            {/* Left headline — mobile gets gradient backdrop for contrast */}
            <div className="lg:w-[42%] pt-20 sm:pt-12 lg:pt-0 relative z-10 w-full lg:max-w-none max-w-full">
              {/* Mobile backdrop */}
              <div className="lg:hidden absolute inset-0 -mx-6 -mt-20 pt-20 pb-8 px-6 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(15,15,17,0.95) 0%, rgba(15,15,17,0.85) 50%, rgba(15,15,17,0.6) 80%, transparent 100%)',
                }}
              />
              <p className="hero-nav-item text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-5 font-sans relative">
                Creative Agency
              </p>
              <h1 className="hero-headline font-display text-[2.4rem] sm:text-[3.8rem] lg:text-[4.8rem] leading-[0.92] tracking-tight text-white relative">
                We start from zero, delivering only what matters.
              </h1>
              <div className="hero-subtext mt-8 flex items-center gap-4 relative">
                <div className="flex -space-x-2">
                  {[0,1,2].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0f0f11] bg-gradient-to-br from-gray-400 to-gray-600" />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-sans">450+ Global Customers</span>
              </div>
              <div className="hero-cta mt-10 flex items-center gap-4 relative">
                <button
                  onClick={onViewAllProjects}
                  className="flex items-center gap-2.5 bg-white text-[#1a1a1a] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 font-sans"
                >
                  Check Our Works
                  <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={onViewAllProjects}
                  className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#108a93] transition-colors font-sans"
                >
                  Our Story
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right partners — hidden on mobile */}
            <div className="hero-partners hidden lg:flex lg:w-[18%] flex-col items-end gap-5 pt-10 lg:pt-0">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 font-sans">Our Partners</p>
              <div className="flex flex-col gap-3.5">
                {partners.map((partner) => (
                  <span key={partner} className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer font-sans">
                    {partner}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-gray-500">
                <span className="text-xs font-sans">Scroll to explore</span>
                <ArrowDownRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: WHY QOLAB — backdrop blur over fixed silhouette ===== */}
      <section
        ref={s2Ref}
        className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 z-20"
        style={{
          backgroundColor: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="s2-inner text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-4 font-sans">Why Qolab</p>
            <h2 className="s2-inner font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05]">
              We don't just design — <span className="italic text-[#108a93]">we engineer</span> experiences.
            </h2>
            <p className="s2-inner text-gray-500 text-base sm:text-lg mt-6 leading-relaxed font-sans max-w-lg">
              Every pixel, every interaction, every line of code is intentional. We blend creative direction with technical mastery to build products people genuinely love.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { num: '150+', label: 'Projects Delivered' },
              { num: '98%', label: 'Client Retention' },
              { num: '12', label: 'Design Awards' },
              { num: '8+', label: 'Years of Craft' },
            ].map((stat) => (
              <div key={stat.label} className="s2-inner bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-black/5">
                <span className="font-display text-3xl sm:text-4xl text-[#1a1a1a]">{stat.num}</span>
                <p className="text-sm text-gray-500 mt-2 font-sans">{stat.label}</p>
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

      {/* ===== SECTION 4: PROJECTS (Asymmetric Parallax Grid) ===== */}
      <ProjectGrid
        onSelectProject={onSelectProject}
      />

      {/* ===== SECTION 6: TESTIMONIALS ===== */}
      <section ref={s6Ref} className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#f5f5f5] z-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-3 font-sans">Testimonials</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-tight mb-16">
            Words from those<br />who've experienced it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="s6-card bg-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-black/5">
                <div>
                  <span className="font-display text-[#108a93] text-6xl leading-none opacity-40">"</span>
                  <p className="font-display text-lg sm:text-xl text-[#1a1a1a] leading-relaxed italic -mt-6">{t.quote}</p>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-11 h-11 rounded-full bg-[#108a93] flex items-center justify-center text-white font-bold text-sm font-sans">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] text-sm font-sans">{t.name}</h5>
                    <p className="text-xs text-gray-500 font-sans">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR APPROACH (Stacking Cards) ===== */}
      <div ref={approachRef}>
        <ApproachSection />
      </div>

      {/* ===== SECTION 8: CTA ===== */}
      <section ref={s8Ref} className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0f0f11] text-white overflow-hidden z-20">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] leading-none tracking-tighter text-white select-none">
            Q
          </div>
        </div>
        <div className="s8-content max-w-5xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-6 font-sans">Ready to start?</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-8xl text-white leading-none italic">
            Let's build something<br />remarkable together.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-8 max-w-2xl mx-auto font-sans leading-relaxed">
            Whether you're launching a new product, reimagining your brand, or scaling your digital presence — we're here to make it happen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button className="bg-[#108a93] hover:bg-[#0d7a82] text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-sans">
              Start a Project
            </button>
            <button
              onClick={onViewAllProjects}
              className="border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:bg-white/5 font-sans"
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
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-sans">Work</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-sans">
              {projectsData.map(p => (
                <li key={p.id}><a href="#" className="hover:text-white transition-colors">{p.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-sans">Services</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-sans">
              <li><a href="#" className="hover:text-white transition-colors">Brand Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Motion & Interaction</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-sans">Company</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-sans">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-sans">Connect</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-sans">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dribbble</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-0">
            <img
              src={logoImg}
              alt="Qolab"
              className="h-16 w-auto"
              style={{ filter: 'brightness(0) invert(1)', mixBlendMode: 'screen' }}
            />
          </div>
          <p className="text-gray-600 font-sans">© 2026 Qolab Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
