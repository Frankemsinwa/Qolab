import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import heroImg from '../assets/5207355816247833.jpg';
import texture3D from '../assets/High-End_Textures_for_Digital_Branding___FLEXCY_by_Gabriel_Souza-removebg-preview.png';
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
  const textureRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const s6Ref = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const s8Ref = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive mouse movement tilt effect on the 3D texture
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!textureRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize coordinates (-0.5 to 0.5)
    const moveX = (clientX / innerWidth - 0.5) * 40;
    const moveY = (clientY / innerHeight - 0.5) * 40;
    const rotX = (clientY / innerHeight - 0.5) * -30;
    const rotY = (clientX / innerWidth - 0.5) * 30;

    gsap.to(textureRef.current, {
      x: moveX,
      y: moveY,
      rotateX: rotX,
      rotateY: rotY,
      duration: 1,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!textureRef.current) return;
    gsap.to(textureRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'power3.out',
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient floating & rotation animation for the 3D texture
      gsap.to('.hero-3d-texture', {
        y: '-=15',
        rotateZ: 8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });

      // Background Image smooth subtle scale/parallax effect on scroll
      gsap.to('.hero-bg-img', {
        scale: 1.15,
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.5}`,
          scrub: 0.5,
        }
      });

      // Hero content entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-nav-item', { y: -20, opacity: 0, duration: 0.8, stagger: 0.06 })
        .from('.hero-headline', { y: 60, opacity: 0, duration: 1.2 }, '-=0.4')
        .from('.hero-subtext', { y: 30, opacity: 0, duration: 0.9 }, '-=0.7')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-3d-wrapper', { scale: 0.6, opacity: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.6');

      // ===== PINNED HERO: 2x viewport =====
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

  const testimonials = [
    { quote: "Qolab's collaborative workflow, technical precision, and eye for detail helped us launch ahead of schedule with remarkable aesthetics.", name: 'Clara Solis', role: 'VP of Design, Shorthand' },
    { quote: "They don't just build products — they craft experiences. Our platform engagement tripled within three months of relaunch.", name: 'Marcus Chen', role: 'CTO, Aether Inc.' },
    { quote: "The team's ability to translate complex technical requirements into intuitive interfaces is unmatched. A true creative partner.", name: 'Sarah Okafor', role: 'Head of Product, Synapse Labs' },
  ];

  return (
    <div ref={containerRef} className="w-full">
      {/* ===== FIXED BACKGROUND IMAGE — stays on screen through hero + section 2 ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0f0d] overflow-hidden">
        <div className="absolute inset-0 w-full h-full transform-gpu">
          <img
            src={heroImg}
            alt="Qolab Hero Liquid Emerald Background"
            className="hero-bg-img absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-105 transition-transform duration-1000 ease-out brightness-105 contrast-110"
          />
        </div>
        {/* Premium blending layers */}
        <div 
          className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0f0d]/75 via-[#0a0f0d]/35 to-[#0f0f11]"
        />
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(16, 138, 147, 0.12) 0%, rgba(10, 15, 13, 0.65) 75%, rgba(15, 15, 17, 0.95) 100%)'
          }}
        />
        {/* Subtle glowing ambient orb */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] bg-[#108a93]/25 pointer-events-none mix-blend-screen z-[2] animate-pulse"
          style={{ animationDuration: '8s' }}
        />
      </div>

      {/* ===== PINNED HERO ===== */}
      <section 
        ref={heroRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-screen overflow-hidden bg-transparent z-10 [perspective:1000px]"
      >

        {/* Hero text content */}
        <div className="hero-content-layer relative z-10 w-full h-full flex flex-col justify-between">
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
                  className="hero-nav-item text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer font-display"
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
              <span className="hidden lg:block text-xs text-gray-400 font-display">Based in Abuja, Nigeria</span>
              <span className="hero-nav-item text-sm font-semibold text-white cursor-pointer font-display">EN . USD</span>
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
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 relative">
            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
              <p className="hero-nav-item text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6 font-display">
                Creative Agency
              </p>
              <h1 className="hero-headline font-display text-[3.2rem] sm:text-[5rem] lg:text-[7rem] leading-[0.92] tracking-tight text-white font-bold">
                ...Future ready Solutions
              </h1>
              <div className="hero-subtext mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0f0f11] bg-gradient-to-br from-gray-400 to-gray-600" />
                  ))}
                </div>
                <span className="text-sm text-gray-400 font-sans">450+ Global Customers</span>
              </div>
              <div className="hero-cta mt-12 flex items-center gap-4 justify-center">
                <button
                  onClick={onViewAllProjects}
                  className="flex items-center gap-2.5 bg-white text-[#1a1a1a] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 font-display"
                >
                  Check Our <span className="text-[#3a863f]">Works</span>
                  <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={onViewAllProjects}
                  className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#108a93] transition-colors font-display"
                >
                  Our Story
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ===== 3D TEXTURE OBJECT IN BOTTOM-RIGHT (LARGER SIZE) ===== */}
          <div className="hero-3d-wrapper absolute bottom-4 right-4 md:bottom-8 md:right-8 lg:right-12 xl:right-16 z-20 pointer-events-auto select-none">
            <div 
              ref={textureRef}
              className="hero-3d-texture relative group cursor-pointer transition-transform duration-300 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Soft glow halo behind the 3D texture */}
              <div className="absolute -inset-6 bg-[#108a93]/35 rounded-full blur-3xl group-hover:bg-[#108a93]/60 transition-all duration-500 opacity-70" />
              
              <img
                src={texture3D}
                alt="3D Digital Texture Object"
                className="w-48 sm:w-64 md:w-80 lg:w-[26rem] xl:w-[32rem] h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] filter brightness-110 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
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
          <div className="grid grid-cols-2 gap-6">
            {[
              { num: '150+', label: 'Projects Delivered' },
              { num: '98%', label: 'Client Retention' },
              { num: '12', label: 'Design Awards' },
              { num: '8+', label: 'Years of Craft' },
            ].map((stat) => (
              <div key={stat.label} className="s2-inner bg-white/[0.06] backdrop-blur-md rounded-2xl p-6 border border-[#3a863f]/25 hover:border-[#3a863f]/50 transition-colors shadow-[0_0_30px_rgba(58,134,63,0.08)]">
                <span className="font-display text-3xl sm:text-4xl text-[#3a863f]">{stat.num}</span>
                <p className="text-sm text-gray-300 mt-2 font-display">{stat.label}</p>
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
        <div className="s8-content max-w-7xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-6 font-display">Ready to start?</p>
          <h2 className="font-display text-[3.2rem] sm:text-[5rem] lg:text-[7rem] leading-[0.92] tracking-tight text-white">
            Let's build something remarkable together.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-8 max-w-2xl mx-auto font-display leading-relaxed">
            Whether you're launching a new product, reimagining your brand, or scaling your digital presence — we're here to make it happen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button className="bg-[#3a863f] hover:bg-[#2f6d33] text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-display">
              Start a Project
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
              <li><a href="#" className="hover:text-white transition-colors">Brand Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Motion & Interaction</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-5 font-display">Company</h5>
            <ul className="flex flex-col gap-2.5 text-sm font-display">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
          <div className="flex items-center gap-0">
            <img
              src={logoImg}
              alt="Qolab"
              className="h-16 w-auto"
              style={{ filter: 'brightness(0) invert(1)', mixBlendMode: 'screen' }}
            />
          </div>
          <p className="text-gray-600 font-display">© 2026 Qolab Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
