import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'Question Everything',
    subtitle: 'DISCOVER THE REAL PROBLEM',
    description: 'Understand the challenge and uncover the real problem.',
    body: 'We start by understanding your business, your market, and the problem behind the brief. The right question is worth more than a hundred quick answers.',
    accent: '#3a863f',
  },
  {
    num: '02',
    title: 'Find the Angle',
    subtitle: 'STRATEGY & DIRECTION',
    description: 'Define the direction, priorities, and plan.',
    body: 'We set the direction, agree the priorities, and map the plan — so every decision that follows has a reason behind it.',
    accent: '#3a863f',
  },
  {
    num: '03',
    title: 'Make It Real',
    subtitle: 'DESIGN & BUILD',
    description: 'Design, develop, experiment, and build.',
    body: 'Design and engineering move together. We prototype, experiment, and build in tight loops, keeping you close to the work as it takes shape.',
    accent: '#3a863f',
  },
  {
    num: '04',
    title: 'Make It Better',
    subtitle: 'TEST & REFINE',
    description: 'Test, refine, and improve the solution.',
    body: 'We test what we have built against reality, refine what falls short, and raise the bar on what works.',
    accent: '#3a863f',
  },
  {
    num: '05',
    title: "Keep What's Next in Mind",
    subtitle: 'PLAN WHAT COMES NEXT',
    description: 'Identify future opportunities and room to evolve.',
    body: 'A launch is a starting point. We look for the next opportunity — the feature, the market, the idea your brand is ready for.',
    accent: '#3a863f',
  },
];

export default function ApproachSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const container = cardsContainerRef.current;
    if (!section || !container) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < 2) return;

    // Set initial states: card 0 visible, remaining cards stacked below
    cards.slice(1).forEach((card) => {
      gsap.set(card, { yPercent: 105, scale: 0.95 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * (cards.length - 1) * 1.1}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Each card slides over the previous one; older cards recede behind
    for (let i = 1; i < cards.length; i++) {
      const at = (i - 1) * 1.2;
      tl.to(cards[i], { yPercent: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' }, at);
      for (let j = 0; j < i; j++) {
        const depth = i - j;
        tl.to(cards[j], {
          y: -30 * depth,
          scale: 1 - 0.05 * depth,
          opacity: depth === 1 ? 0.4 : 0.15,
          duration: 1.2,
          ease: 'power2.inOut',
        }, at);
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`relative w-full bg-[#09090b] z-20 overflow-hidden font-sans ${prefersReducedMotion ? 'py-24' : 'h-screen'}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)] pointer-events-none" />

      {/* Header */}
      <div className={prefersReducedMotion ? 'relative px-6 md:px-12 lg:px-16 mb-10' : 'absolute top-10 md:top-14 left-6 md:left-12 lg:left-16 z-30'}>
        <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-[#3a863f] mb-2 font-mono">
          Process
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[4rem] text-white leading-[0.95] tracking-tight font-medium">
          How We Work
        </h2>
      </div>

      {/* Cards Container */}
      <div ref={cardsContainerRef} className={prefersReducedMotion ? 'relative flex flex-col gap-8 px-6 md:px-12 lg:px-16' : 'absolute inset-0 flex items-end justify-center pb-6 md:pb-10'}>
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`${prefersReducedMotion ? 'relative w-full min-h-[520px]' : 'absolute inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-16 bottom-0 h-[72vh] sm:h-[75vh] lg:h-[78vh]'} rounded-[32px] overflow-hidden will-change-transform border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] group/card`}
            style={{
              zIndex: 10 + i,
              background: 'linear-gradient(135deg, rgba(16,17,16,0.97) 0%, rgba(9,10,9,0.99) 100%)',
            }}
          >
            {/* Top hairline — soft white edge */}
            <div className="absolute top-0 left-8 right-8 h-px z-30 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }}
            />

            {/* Soft light glows — monochromatic, green kept for micro-accents only */}
            <div
              className="absolute -right-40 -top-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 opacity-[0.05] group-hover/card:opacity-[0.09]"
              style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
            />
            <div
              className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-[0.03] group-hover/card:opacity-[0.06] transition-opacity duration-500"
              style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
            />

            {/* Subtle dotted grid texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Giant watermark numeral */}
            <span className="absolute -bottom-16 -right-4 lg:-right-8 font-display font-bold text-[16rem] lg:text-[24rem] leading-none text-white/[0.04] select-none pointer-events-none tracking-tighter">
              {step.num}
            </span>

            {/* Viewfinder corner brackets */}
            <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-white/25 rounded-tl-md pointer-events-none z-30" />
            <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-white/25 rounded-tr-md pointer-events-none z-30" />
            <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-white/25 rounded-bl-md pointer-events-none z-30" />
            <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-white/25 rounded-br-md pointer-events-none z-30" />

            {/* Inner layout */}
            <div className="relative z-20 h-full grid grid-cols-1 items-center p-8 sm:p-12 md:p-16 lg:p-20">
              <div className="flex flex-col justify-center h-full max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs font-semibold tracking-widest px-3 py-1 rounded-full border border-[#6ee05a]/30 bg-[#6ee05a]/10 text-[#6ee05a]">
                    {step.num}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-gray-500 uppercase font-mono">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: step.accent }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: step.accent }} />
                    </span>
                    {step.subtitle}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.05] text-white font-medium mb-5 tracking-tight">
                  {step.title}
                </h3>

                <p className="font-display text-lg sm:text-xl text-[#3a863f] italic leading-relaxed mb-4 max-w-2xl">
                  {step.description}
                </p>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
                  {step.body}
                </p>
              </div>
            </div>

            {/* Bottom step rail */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {STEPS.map((_, pi) => (
                <div
                  key={pi}
                  className="h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: pi === i ? '28px' : '10px',
                    backgroundColor: pi === i ? '#6ee05a' : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
