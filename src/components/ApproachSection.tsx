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
    description: 'Every decision backed by data, every interface validated with real users.',
    image: researchImg,
    accent: '#e11d48',
    devices: 'laptop',
  },
  {
    num: '02',
    title: 'Performance First',
    description: 'Sub-second load times, 60fps animations, zero compromise on speed.',
    image: performanceImg,
    accent: '#8b5cf6',
    devices: 'laptop',
  },
  {
    num: '03',
    title: 'Scalable Systems',
    description: 'Design tokens, component libraries, and architecture that grows with you.',
    image: scalableImg,
    accent: '#10b981',
    devices: 'laptop+phone',
  },
];

function LaptopMockup({ image, tiltRef }: { image: string; tiltRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={tiltRef} className="relative w-full max-w-[520px] mx-auto" style={{ perspective: '1200px' }}>
      <div className="transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        {/* Laptop Base */}
        <div className="relative z-10">
          {/* Screen Bezel */}
          <div className="bg-[#1a1a1a] rounded-t-xl p-[6px] sm:p-[8px]">
            {/* Screen */}
            <div className="bg-black rounded-md overflow-hidden aspect-[16/10]">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Laptop Bottom / Keyboard Area */}
          <div className="bg-[#2a2a2a] h-[10px] sm:h-[14px] rounded-b-xl mx-auto w-[85%] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-[3px] bg-[#3a3a3a] rounded-full" />
          </div>
          {/* Base Reflection */}
          <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] h-[3px] rounded-b-xl mx-auto w-[90%] opacity-50" />
        </div>
      </div>
    </div>
  );
}

function LaptopPhoneMockup({ image, tiltRef }: { image: string; tiltRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={tiltRef} className="relative w-full max-w-[600px] mx-auto flex items-end justify-center gap-4 sm:gap-8" style={{ perspective: '1200px' }}>
      <div className="transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        {/* Laptop */}
        <div className="relative z-10">
          <div className="bg-[#1a1a1a] rounded-t-xl p-[5px] sm:p-[6px]">
            <div className="bg-black rounded-md overflow-hidden aspect-[16/10]">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="bg-[#2a2a2a] h-[8px] sm:h-[10px] rounded-b-xl mx-auto w-[85%] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[2px] bg-[#3a3a3a] rounded-full" />
          </div>
        </div>
      </div>
      {/* Phone */}
      <div className="transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }}>
        <div className="bg-[#1a1a1a] rounded-2xl p-[4px] sm:p-[5px] w-[100px] sm:w-[130px] shadow-2xl">
          <div className="bg-black rounded-xl overflow-hidden aspect-[9/19]">
            <img src={image} alt="" className="w-full h-full object-cover" />
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
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 4;
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

    // Set initial states: card 0 visible, cards 1 & 2 below viewport
    gsap.set(cards[1], { yPercent: 100, opacity: 1 });
    gsap.set(cards[2], { yPercent: 100, opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Card 1 slides over Card 0
    tl.to(cards[1], { yPercent: 0, duration: 1 }, 0);
    tl.to(cards[0], { scale: 0.95, opacity: 0.5, duration: 1 }, 0);

    // Card 2 slides over Card 1
    tl.to(cards[2], { yPercent: 0, duration: 1 }, 1);
    tl.to(cards[1], { scale: 0.95, opacity: 0.5, duration: 1 }, 1);
    tl.to(cards[0], { scale: 0.9, opacity: 0.25, duration: 1 }, 1);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#0f0f11] z-20 overflow-hidden">
      {/* Header */}
      <div className="absolute top-12 left-6 md:left-12 lg:left-16 z-30">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-4 font-sans">Our Approach</p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
          Craft meets<br />engineering
        </h2>
      </div>

      {/* Cards Container */}
      <div ref={cardsContainerRef} className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-12">
        {PILLARS.map((pillar, i) => (
          <div
            key={pillar.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-16 bottom-0 h-[70vh] sm:h-[75vh] lg:h-[80vh] rounded-3xl overflow-hidden will-change-transform"
            style={{
              zIndex: 10 + i,
              backgroundColor: i === 0 ? '#1a1a1a' : i === 1 ? '#111827' : '#18181b',
            }}
          >
            {/* Dark overlay for depth effect */}
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 md:p-14">
              {/* Top: Device Mockup */}
              <div
                className="flex-1 flex items-center justify-center mt-16 sm:mt-20"
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                {pillar.devices === 'laptop+phone' ? (
                  <LaptopPhoneMockup
                    image={pillar.image}
                    tiltRef={(el) => { tiltRefs.current[i] = el; }}
                  />
                ) : (
                  <LaptopMockup
                    image={pillar.image}
                    tiltRef={(el) => { tiltRefs.current[i] = el; }}
                  />
                )}
              </div>

              {/* Bottom: Text */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-xs font-bold" style={{ color: pillar.accent }}>{pillar.num}</span>
                  <div className="w-8 h-[1px]" style={{ backgroundColor: pillar.accent }} />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base max-w-lg font-sans leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
