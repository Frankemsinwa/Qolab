import { useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import researchImg from '../assets/approach/Research.jpg';
import performanceImg from '../assets/approach/performance.jpg';
import scalableImg from '../assets/approach/scalable.jpg';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    num: '01',
    title: 'Research-Led Design',
    subtitle: 'UNDERSTAND & VALIDATE',
    description: 'Every decision backed by data, every interface validated with real users.',
    tags: ['User Journeys', 'A/B Testing', 'Behavioral Maps', 'Interactive Prototypes'],
    image: researchImg,
    accent: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.15)',
  },
  {
    num: '02',
    title: 'Performance First',
    subtitle: 'ENGINEERING EXCELLENCE',
    description: 'Sub-second load times, 60fps animations, zero compromise on speed.',
    tags: ['Core Web Vitals', 'Code Splitting', 'Edge Caching', 'GPU Accelerated Assets'],
    image: performanceImg,
    accent: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    num: '03',
    title: 'Scalable Systems',
    subtitle: 'DESIGN SYSTEMS & CODE',
    description: 'Design tokens, component libraries, and architecture that grows with you.',
    tags: ['Design Tokens', 'React / TypeScript', 'Monorepo Architecture', 'CI/CD Pipelines'],
    image: scalableImg,
    accent: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
];

function PremiumLaptopMockup({ image, tiltRef }: { image: string; tiltRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={tiltRef} className="relative w-full max-w-[460px] md:max-w-[500px] mx-auto" style={{ perspective: '1500px' }}>
      <div className="transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        {/* Shadow */}
        <div className="absolute -bottom-8 left-[10%] right-[10%] h-8 bg-black/80 blur-xl rounded-full pointer-events-none" />
        
        {/* Laptop Body */}
        <div className="relative z-10">
          {/* Bezel */}
          <div className="bg-[#121214] rounded-t-2xl p-[8px] md:p-[10px] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
            {/* Screen border */}
            <div className="bg-black rounded-lg overflow-hidden aspect-[16/10] relative group">
              <img src={image} alt="" className="w-full h-full object-cover select-none" />
              {/* Screen reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
            </div>
          </div>
          {/* Laptop Base / Keyboard Area */}
          <div className="bg-[#1e1e21] h-[12px] md:h-[16px] rounded-b-2xl mx-auto w-[102%] -ml-[1%] relative border-t border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
            <div className="absolute top-[1px] left-1/2 -translate-x-1/2 w-12 md:w-16 h-[4px] bg-[#0c0c0e] rounded-b-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApproachSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent, index: number) => {
    const tiltEl = tiltRefs.current[index];
    if (!tiltEl) return;
    const rect = tiltEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 6;
    const inner = tiltEl.querySelector(':scope > div') as HTMLElement;
    if (inner) {
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const tiltEl = tiltRefs.current[index];
    if (!tiltEl) return;
    const inner = tiltEl.querySelector(':scope > div') as HTMLElement;
    if (inner) {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = cardsContainerRef.current;
    if (!section || !container) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < 3) return;

    // Set initial states: card 0 visible, cards 1 & 2 stacked down
    gsap.set(cards[1], { yPercent: 105, scale: 0.95 });
    gsap.set(cards[2], { yPercent: 105, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Card 1 slides over Card 0
    tl.to(cards[1], { yPercent: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' }, 0);
    tl.to(cards[0], { y: -30, scale: 0.95, opacity: 0.4, duration: 1.2, ease: 'power2.inOut' }, 0);

    // Card 2 slides over Card 1
    tl.to(cards[2], { yPercent: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' }, 1.2);
    tl.to(cards[1], { y: -30, scale: 0.95, opacity: 0.4, duration: 1.2, ease: 'power2.inOut' }, 1.2);
    tl.to(cards[0], { y: -60, scale: 0.9, opacity: 0.15, duration: 1.2, ease: 'power2.inOut' }, 1.2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#09090b] z-20 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)] pointer-events-none" />

      {/* Header */}
      <div className="absolute top-10 md:top-14 left-6 md:left-12 lg:left-16 z-30">
        <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#108a93] mb-2 font-mono">
          Methodology
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[4rem] text-white leading-[0.95] tracking-tight font-bold">
          Our Approach
        </h2>
      </div>

      {/* Cards Container */}
      <div ref={cardsContainerRef} className="absolute inset-0 flex items-end justify-center pb-6 md:pb-10">
        {PILLARS.map((pillar, i) => (
          <div
            key={pillar.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-16 bottom-0 h-[72vh] sm:h-[75vh] lg:h-[78vh] rounded-[32px] overflow-hidden will-change-transform border border-white/[0.06] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            style={{
              zIndex: 10 + i,
              background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(12, 12, 14, 0.98) 100%)',
            }}
          >
            {/* Glowing Accent Aura */}
            <div 
              className="absolute -right-40 -top-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 opacity-60"
              style={{ backgroundColor: pillar.accent }}
            />
            <div 
              className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
              style={{ backgroundColor: pillar.accent }}
            />

            {/* Inner layout */}
            <div className="relative z-20 h-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 md:p-14 lg:p-16">
              
              {/* Left Column: Information */}
              <div className="lg:col-span-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5" style={{ color: pillar.accent }}>
                    {pillar.num}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase font-mono">
                    {pillar.subtitle}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.05] text-white font-bold mb-5 tracking-tight">
                  {pillar.title}
                </h3>
                
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                  {pillar.description}
                </p>

                {/* Sub-features / Tags */}
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {pillar.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pillar.accent }} />
                      <span className="text-xs text-gray-400 font-mono tracking-wide">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive device mockup */}
              <div 
                className="lg:col-span-6 w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                <PremiumLaptopMockup image={pillar.image} tiltRef={(el) => { tiltRefs.current[i] = el; }} />
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
