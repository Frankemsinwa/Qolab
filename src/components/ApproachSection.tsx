import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const STEPS = [
  {
    num: '01',
    title: 'Understand the Problem',
    phase: 'Discovery & Immersion',
    short: 'Discovery',
    lead: "We dig deep into your business, listen to your users, and uncover what's truly holding things back before writing a single line of code or pushing a pixel.",
    deliverables: [
      'Stakeholder & user interviews to uncover real friction',
      'Market landscape & competitor opportunity audit',
      'Clear problem definition and verifiable success metrics',
    ],
    time: 'Phase 01',
  },
  {
    num: '02',
    title: 'Define the Blueprint',
    phase: 'Strategy & Architecture',
    short: 'Blueprint',
    lead: 'We map out a clear roadmap, technical architecture, and creative direction so every subsequent decision has a defined purpose.',
    deliverables: [
      'Product roadmap with milestone-based scopes and timelines',
      'Scalable technical architecture and modern tech stack selection',
      'Visual moodboards, user flows, and core design principles',
    ],
    time: 'Phase 02',
  },
  {
    num: '03',
    title: 'Bring It to Life',
    phase: 'Design & Development',
    short: 'Build',
    lead: 'We turn the strategy into functional reality through rapid design iterations and clean, robust full-stack engineering.',
    deliverables: [
      'High-fidelity UI/UX design with responsive component systems',
      'Modular, production-ready code built for speed and security',
      'Weekly working demos and sprint reviews with your team',
    ],
    time: 'Phase 03',
  },
  {
    num: '04',
    title: 'Test, Polish & Perfect',
    phase: 'Quality Assurance & Tuning',
    short: 'Polish',
    lead: 'We put the product through real-world paces, smoothing out friction, boosting speed, and polishing every micro-interaction.',
    deliverables: [
      'Cross-browser, multi-device, and accessibility stress testing',
      'Performance optimization, fast load speeds, and SEO readiness',
      'Micro-animations and interaction refinement for a premium tactile feel',
    ],
    time: 'Phase 04',
  },
  {
    num: '05',
    title: 'Launch & Scale Forward',
    phase: 'Deployment & Growth',
    short: 'Launch',
    lead: 'We guide you through a seamless public launch, hand over complete documentation, and help you scale as user demand grows.',
    deliverables: [
      'Zero-downtime deployment to secure production infrastructure',
      'Complete asset handoff, design system guides, and team training',
      'Post-launch performance review and roadmap for future iterations',
    ],
    time: 'Phase 05',
  },
];

export default function ApproachSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const stepItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const trailContainer = trailContainerRef.current;
    const activeLine = activeLineRef.current;
    if (!section || !trailContainer || !activeLine) return;

    const ctx = gsap.context(() => {
      // 1. Scrubbed line drawing: The line draws down smoothly as user scrolls through the container
      gsap.fromTo(
        activeLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: trailContainer,
            start: 'top 70%',
            end: 'bottom 65%',
            scrub: 0.5,
            refreshPriority: 3,
          },
        }
      );

      // 2. Step reveals: As the scroll position reaches each step, the node bursts alive and card sweeps into place
      stepItemRefs.current.forEach((item, index) => {
        if (!item) return;
        const card = stepCardRefs.current[index];
        const node = stepNodeRefs.current[index];
        const isDesktop = window.innerWidth >= 768;
        const isEven = index % 2 === 0;

        // Set initial resting states
        if (card) {
          gsap.set(card, {
            opacity: 0,
            y: 45,
            x: isDesktop ? (isEven ? -35 : 35) : 0,
            scale: 0.95,
          });
        }
        if (node) {
          gsap.set(node, {
            scale: 0.65,
            opacity: 0.25,
          });
        }

        // Timeline linked to scroll: reveals the moment the line reaches this milestone
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 48%',
            scrub: 0.5,
            refreshPriority: 3,
          },
        });

        if (node) {
          tl.to(node, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          }, 0);
        }

        if (card) {
          tl.to(card, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          }, 0.08);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#e4e4e1] text-[#111411] overflow-hidden font-grotesk z-20">
      {/* Subtle organic ambient warmth */}
      <div
        className="absolute top-1/4 -right-40 w-[24rem] sm:w-[36rem] h-[24rem] sm:h-[36rem] rounded-full pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(110, 224, 90, 0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-1/4 -left-40 w-[24rem] sm:w-[36rem] h-[24rem] sm:h-[36rem] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(30, 68, 40, 0.18) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Section Header */}
      <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20 md:mb-24 relative z-10 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e4428]/10 border border-[#1e4428]/20 mb-3.5 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e4428] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#1e4428] font-grotesk">
            Our Methodology
          </span>
        </div>

        <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] text-[#111411] tracking-tight leading-[1.12] mb-3 sm:mb-5">
          How We <span className="text-[#1e4428]">Work.</span>
        </h2>

        <p className="text-black/70 max-w-xl mx-auto font-sans text-sm sm:text-base md:text-lg leading-relaxed">
          Scroll down and follow the trail from initial discovery to launch day.
        </p>
      </div>

      {/* The Scenic Trail Container */}
      <div ref={trailContainerRef} className="max-w-5xl mx-auto relative z-10">
        
        {/* Base Inactive Guide Track */}
        <div className="absolute left-[15px] sm:left-5 md:left-1/2 top-4 bottom-4 w-[2px] md:w-[3px] -translate-x-1/2 bg-black/10 rounded-full" />

        {/* Active Scroll-Drawn Glowing Spine */}
        <div 
          ref={activeLineRef}
          className="absolute left-[15px] sm:left-5 md:left-1/2 top-4 bottom-4 w-[2px] md:w-[3px] -translate-x-1/2 bg-gradient-to-b from-[#1e4428] via-[#52db44] to-[#1e4428] rounded-full shadow-[0_0_12px_rgba(82,219,68,0.5)] origin-top will-change-transform z-10"
          style={{ transform: 'scaleY(0)' }}
        />

        {/* Trail Stops */}
        <div className="space-y-8 sm:space-y-12 md:space-y-24 relative pl-10 sm:pl-12 md:pl-0">
          {STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={step.num}
                ref={(el) => { stepItemRefs.current[idx] = el; }}
                className={`relative flex flex-col md:flex-row items-stretch md:items-center ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Milestone Node */}
                <div 
                  ref={(el) => { stepNodeRefs.current[idx] = el; }}
                  className="absolute -left-10 sm:-left-12 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-full bg-[#1e4428] text-white font-mono text-[11px] md:text-xs font-bold flex items-center justify-center border-2 md:border-4 border-[#e4e4e1] shadow-[0_4px_16px_rgba(30,68,40,0.35)] z-20 will-change-transform"
                >
                  <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52db44] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-[#52db44]" />
                  </span>
                  <span>{step.num}</span>
                </div>

                {/* Milestone Card */}
                <div className="w-full md:w-[calc(50%-2.5rem)] lg:md:w-[calc(50%-3rem)]">
                  <div 
                    ref={(el) => { stepCardRefs.current[idx] = el; }}
                    className="group relative rounded-2xl sm:rounded-3xl md:rounded-[2.25rem] p-6 sm:p-8 md:p-10 transition-all duration-500 hover:-translate-y-1.5 will-change-transform overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.48)',
                      backdropFilter: 'blur(30px) saturate(190%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      boxShadow: 'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 20px 45px -12px rgba(15, 30, 20, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    {/* Apple-grade Specular Highlight Hairline */}
                    <div 
                      className="absolute top-0 inset-x-8 h-[1.5px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 50%, transparent 100%)',
                      }}
                    />

                    {/* Top Row: Crisp Milestone & Phase */}
                    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#112818] text-white shadow-sm">
                        {step.num}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#112818] font-bold truncate">
                        {step.phase}
                      </span>
                    </div>

                    {/* Step Title: High-Contrast Obsidian */}
                    <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-[2rem] text-[#090d0b] mb-3 leading-snug tracking-tight group-hover:text-[#112818] transition-colors duration-300">
                      {step.title}
                    </h3>

                    {/* Lead Benefit: Razor-Sharp Contrast */}
                    <p className="text-sm sm:text-base text-[#202923] font-sans leading-relaxed mb-6 font-normal">
                      {step.lead}
                    </p>

                    {/* Deliverables Checklist with Enhanced Contrast */}
                    <div className="pt-4 border-t border-black/[0.08]">
                      <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#112818]/70 mb-3 font-bold">
                        What happens in this stage:
                      </p>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {step.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0c140e] font-sans font-medium">
                            <Check size={16} className="text-[#15803d] shrink-0 mt-0.5" strokeWidth={2.6} />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Spacer for desktop alternating symmetry */}
                <div className="hidden md:block md:w-[calc(50%-2.5rem)] lg:md:w-[calc(50%-3rem)]" />
              </div>
            );
          })}
        </div>

        {/* Journey Arrival Pill */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center pl-10 sm:pl-12 md:pl-0">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/95 border border-black/10 shadow-sm text-[11px] sm:text-xs font-mono font-medium text-black/80">
            <span className="w-2 h-2 rounded-full bg-[#1e4428]" />
            <span>Ready for launch &bull; Handover &amp; long-term scale</span>
          </div>
        </div>

      </div>
    </section>
  );
}
