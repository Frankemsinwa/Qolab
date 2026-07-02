import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check, Send } from 'lucide-react';
import { projectsData } from '../data';
import { Project } from '../types';
import heroImg1 from '../assets/hero-imgs/hero-1.jpg';
import heroImg2 from '../assets/hero-imgs/hero-2.jpg';
import heroImg3 from '../assets/hero-imgs/hero-3.jpg';
import heroImg4 from '../assets/hero-imgs/hero-4.jpg';
import heroImg5 from '../assets/hero-imgs/hero-5.jpg';
import heroImg6 from '../assets/hero-imgs/hero-6.jpg';
import heroImg7 from '../assets/hero-imgs/hero-7.jpg';
import heroImg8 from '../assets/hero-imgs/hero-8.jpg';
import heroImg9 from '../assets/hero-imgs/hero-9.jpg';
import heroImg10 from '../assets/hero-imgs/hero-10.jpg';
import heroImg11 from '../assets/hero-imgs/hero-11.jpg';
import heroImg12 from '../assets/hero-imgs/hero-12.jpg';
import heroImg14 from '../assets/hero-imgs/hero-14.jpg';
import heroImg15 from '../assets/hero-imgs/hero-15.jpg';
import heroImg16 from '../assets/hero-imgs/hero-16.jpg';
import heroImg17 from '../assets/hero-imgs/hero-17.jpg';
import heroImg18 from '../assets/hero-imgs/hero-18.jpg';
import heroImg19 from '../assets/hero-imgs/hero-19.jpg';
import heroImg20 from '../assets/hero-imgs/hero-20.jpg';
import heroImg21 from '../assets/hero-imgs/hero-21.jpg';
import heroImg22 from '../assets/hero-imgs/hero-22.jpg';

gsap.registerPlugin(ScrollTrigger);

interface LandingHeroProps {
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

export default function LandingHero({ onSelectProject, onViewAllProjects }: LandingHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const manifestoSubtitleRef = useRef<HTMLParagraphElement>(null);

  // Questionnaire state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const heroImages = [
    // Row 1 — upper band
    { src: heroImg1, top: '5%', left: '2%', width: 'clamp(200px, 26vw, 380px)', rotate: -8, aspect: '4/3' },
    { src: heroImg3, top: '2%', left: '20%', width: 'clamp(180px, 24vw, 340px)', rotate: 12, aspect: '3/4' },
    { src: heroImg7, top: '10%', left: '38%', width: 'clamp(220px, 28vw, 400px)', rotate: -5, aspect: '4/3' },
    { src: heroImg9, top: '3%', left: '55%', width: 'clamp(190px, 25vw, 360px)', rotate: 8, aspect: '16/10' },
    { src: heroImg11, top: '8%', left: '70%', width: 'clamp(200px, 26vw, 380px)', rotate: -12, aspect: '3/4' },
    { src: heroImg14, top: '4%', left: '85%', width: 'clamp(180px, 23vw, 330px)', rotate: 6, aspect: '4/3' },
    { src: heroImg17, top: '12%', left: '98%', width: 'clamp(190px, 24vw, 350px)', rotate: -10, aspect: '4/3' },
    { src: heroImg5, top: '6%', left: '108%', width: 'clamp(200px, 25vw, 370px)', rotate: 14, aspect: '4/3' },
    { src: heroImg22, top: '9%', left: '120%', width: 'clamp(180px, 22vw, 320px)', rotate: -6, aspect: '3/4' },
    { src: heroImg10, top: '2%', left: '135%', width: 'clamp(210px, 27vw, 390px)', rotate: 10, aspect: '4/3' },
    { src: heroImg20, top: '7%', left: '150%', width: 'clamp(190px, 24vw, 350px)', rotate: -8, aspect: '16/10' },
    // Row 2 — lower band
    { src: heroImg2, top: '42%', left: '5%', width: 'clamp(210px, 27vw, 390px)', rotate: 6, aspect: '3/4' },
    { src: heroImg4, top: '48%', left: '22%', width: 'clamp(190px, 25vw, 360px)', rotate: 10, aspect: '4/3' },
    { src: heroImg6, top: '40%', left: '40%', width: 'clamp(200px, 26vw, 380px)', rotate: -6, aspect: '16/10' },
    { src: heroImg8, top: '50%', left: '55%', width: 'clamp(220px, 28vw, 400px)', rotate: 14, aspect: '4/3' },
    { src: heroImg12, top: '44%', left: '72%', width: 'clamp(180px, 23vw, 330px)', rotate: 5, aspect: '3/4' },
    { src: heroImg15, top: '48%', left: '88%', width: 'clamp(200px, 26vw, 380px)', rotate: -12, aspect: '16/10' },
    { src: heroImg16, top: '42%', left: '102%', width: 'clamp(190px, 24vw, 350px)', rotate: 8, aspect: '3/4' },
    { src: heroImg18, top: '50%', left: '118%', width: 'clamp(210px, 27vw, 390px)', rotate: -10, aspect: '4/3' },
    { src: heroImg19, top: '46%', left: '134%', width: 'clamp(180px, 23vw, 330px)', rotate: 6, aspect: '4/3' },
    { src: heroImg21, top: '52%', left: '150%', width: 'clamp(200px, 26vw, 380px)', rotate: -14, aspect: '3/4' },
  ];

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Entrance Animation
      gsap.from('.hero-title-word', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
      });

      // 2. Horizontal drift — all drift left together, loop seamlessly
      const items = gsap.utils.toArray('.hero-drift-item');
      items.forEach((item: any) => {
        gsap.to(item, {
          x: -window.innerWidth,
          duration: 180,
          ease: 'none',
          repeat: -1,
        });
      });

      // 3. Reveal animations for Portfolio Cards
      gsap.from('.portfolio-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: portfolioRef.current,
          start: 'top 80%',
        }
      });

      // 4. Manifesto heading fade-in
      gsap.from('.manifesto-heading', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.manifesto-section',
          start: 'top 85%',
        }
      });

      // 5. Manifesto subtitle typewriter effect
      const subtitleEl = manifestoSubtitleRef.current;
      if (subtitleEl) {
        const chars = subtitleEl.querySelectorAll('.typewriter-char');
        gsap.set(chars, { opacity: 0 });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          stagger: 0.03,
          ease: 'none',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top 75%',
          },
          onComplete: () => {
            const cursor = subtitleEl.querySelector('.typewriter-cursor');
            if (cursor) gsap.to(cursor, { opacity: 0, duration: 0.4, delay: 0.8 });
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="w-full bg-[#faf7f2] pt-32 pb-16 px-6 sm:px-12 md:px-16">
      {/* SECTION 1: HERO HEADER */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="font-display text-7xl sm:text-8xl md:text-[9.5rem] tracking-tight leading-[0.9] text-black">
          <div className="overflow-hidden inline-block mr-4">
            <span className="hero-title-word inline-block animate-slide-up">Forward</span>
          </div>
          <div className="overflow-hidden inline-block mr-4">
            <span className="hero-title-word inline-block italic font-light text-[#108a93]">through</span>
          </div>
          <br className="hidden sm:inline" />
          <div className="overflow-hidden inline-block mr-4">
            <span className="hero-title-word inline-block">digital</span>
          </div>
          <div className="overflow-hidden inline-block">
            <span className="hero-title-word inline-block font-semibold">design</span>
          </div>
        </h1>
      </div>

      {/* SECTION 2: FLOATING COLLAGE — full-bleed, no clipping */}
      <div ref={collageRef} className="relative w-screen left-1/2 -translate-x-1/2 h-[480px] sm:h-[650px] mt-16 overflow-visible">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="hero-drift-item absolute"
            style={{
              top: img.top,
              left: img.left,
              width: img.width,
              rotate: `${img.rotate}deg`,
            }}
          >
            <div className={`w-full rounded-[1.5rem] overflow-hidden shadow-xl`} style={{ aspectRatio: img.aspect }}>
              <img
                src={img.src}
                alt={`Hero image ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: MANIFESTO */}
      <div className="manifesto-section max-w-4xl mx-auto text-center py-24 sm:py-32 border-t border-black/5 mt-12">
        <p className="manifesto-heading font-display text-4xl sm:text-5xl md:text-6xl text-black leading-tight max-w-3xl mx-auto">
          We are <span className="font-semibold text-[#108a93]">Qolab</span>, a creative design & technology studio rooted in craft, curiosity, and care.
        </p>
        <p ref={manifestoSubtitleRef} className="font-sans text-lg sm:text-xl text-gray-600 mt-8 max-w-2xl mx-auto leading-relaxed">
          {'We design and build products, brands, and digital experiences that people genuinely love, helping modern businesses grow and thrive in a vibrant world.'.split('').map((char, i) => (
            <span key={i} className="typewriter-char inline-block" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <span className="typewriter-cursor inline-block w-[2px] h-[1em] bg-gray-600 ml-[1px] align-middle" />
        </p>
      </div>

      {/* SECTION 4: PORTFOLIO GRID */}
      <div ref={portfolioRef} id="work" className="max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projectsData.map((project, idx) => {
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="portfolio-card flex flex-col gap-4"
              >
                <div className={`aspect-[4/3] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500`}>
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-between p-8 text-white z-10`} style={{ backgroundColor: project.accentColor }}>
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

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <button
            onClick={onViewAllProjects}
            className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95 group"
          >
            <span>View all projects</span>
            <div className="w-6 h-6 rounded-full bg-[#3a863f] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 5: INTERACTIVE QUIZ & QUOTES */}
      <div ref={helpRef} id="services" className="max-w-6xl mx-auto py-20 border-t border-black/5 mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Quote Card */}
        <div className="bg-[#e6f3f0] rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <span className="font-display text-[#108a93] text-9xl absolute -top-8 -left-2 opacity-15 font-bold">“</span>
          <div className="relative z-10">
            <p className="font-display text-2xl sm:text-3xl text-gray-800 leading-tight italic">
              "Qolab's collaborative workflow, technical precision, and eye for detail helped us launch our platform ahead of schedule with remarkable aesthetics."
            </p>
          </div>
          <div className="flex items-center gap-4 mt-8 relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#108a93] flex items-center justify-center text-white font-bold">CS</div>
            <div>
              <h5 className="font-bold text-black text-sm">Clara Solis</h5>
              <p className="text-xs text-gray-500">VP of Design, Shorthand</p>
            </div>
          </div>
        </div>

        {/* questionnaire Widget */}
        <div className="bg-[#fcfaf6] border border-black/5 rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="font-display text-4xl text-black leading-tight italic">How can we help you?</h4>
            <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-wider">Select all options that apply</p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                'Rebrand my business',
                'Build a custom website',
                'Design a mobile app',
                'Consult on architecture',
                'Improve UX/UI'
              ].map((service) => {
                const active = selectedServices.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`py-2.5 px-5 rounded-full border text-xs font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-[#108a93] border-[#108a93] text-white'
                        : 'bg-white border-black/5 hover:border-black/20 text-gray-800'
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-black/5 pt-6 flex flex-col gap-4">
            <p className="text-sm text-gray-600">Tell us where to send the proposal</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white border border-black/5 focus:border-[#108a93] focus:outline-none rounded-full px-6 py-3 text-sm text-black shadow-sm"
              />
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                {submitted ? <Check size={18} className="text-green-400" /> : <Send size={18} />}
              </button>
            </div>
            {submitted && <p className="text-xs text-green-600 font-semibold animate-fade-in">Request submitted! We will reach out within 24 hours.</p>}
          </div>
        </div>
      </div>

      {/* SECTION 6: TEAM SECTION */}
      <div id="about" className="max-w-6xl mx-auto py-20 border-t border-black/5 mt-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex gap-4">
            <div className="w-1/2 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md relative">
              <img src={heroImg1} alt="Creative Team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">Creative Team</span>
              </div>
            </div>
            <div className="w-1/2 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md relative mt-8">
              <img src={heroImg7} alt="Coding Desk" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">Coding Desk</span>
              </div>
            </div>
          </div>
          <div className="text-left md:pl-8">
            <h3 className="font-display text-4xl sm:text-5xl text-black italic leading-tight">
              We're a small team of versatile creatives.
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mt-6 leading-relaxed">
              We operate at the convergence of beautiful interfaces and performant engineering. Fully aligned with your goals, we design with craft and code with rigor.
            </p>
            <button className="mt-8 flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md">
              <span>Find out more</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 7: VIBRANT ORANGE NEWSLETTER */}
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-[#f4a261] rounded-[2.5rem] p-8 sm:p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
          <h3 className="font-display text-4xl sm:text-5xl text-white leading-tight italic max-w-md text-center md:text-left">
            Stay connected with updates, insights and inspiration.
          </h3>
          <div className="w-full md:w-auto flex-grow max-w-md bg-white/10 p-2 rounded-[2rem] border border-white/10 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-transparent focus:outline-none px-6 py-3 text-sm text-white placeholder-white/60 font-sans"
            />
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-sm transition-transform hover:scale-105 active:scale-95 shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 8: CALL TO ACTION */}
      <div id="contact" className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#0f0f11] text-[#faf7f2] py-28 px-6 sm:px-12 text-center mt-20">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#108a93] font-mono text-xs uppercase tracking-widest font-bold">Got a project?</span>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl text-white italic mt-6 leading-none">
            Ready to move forward?<br className="hidden sm:inline" /> Let's work together.
          </h2>
          <div className="flex justify-center mt-12">
            <button className="bg-[#108a93] hover:bg-[#159da8] text-white font-semibold py-4 px-12 rounded-full text-base tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
              Get in touch
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 9: FOOTER */}
      <footer className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#0f0f11] text-gray-400 pt-12 pb-8 px-6 sm:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-4">Work</h5>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Shorthand</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Olipop</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Outlier AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kiva Platform</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-4">Services</h5>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Product Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Frontend Engineering</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand Identity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UX Research</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-4">About</h5>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-xs font-mono uppercase tracking-widest mb-4">Connect</h5>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dribbble</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#108a93] flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-white font-bold text-base tracking-wider font-display">qolab</span>
          </div>
          <p className="text-gray-600">© 2026 Qolab Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
