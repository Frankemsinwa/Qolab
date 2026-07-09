import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Service } from '../types';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
}

const RELATED_SERVICES: { title: string; desc: string }[] = [
  { title: 'Brand Architecture', desc: 'Building scalable brand systems from the ground up.' },
  { title: 'Design Systems', desc: 'Component libraries and tokens that unify your product.' },
  { title: 'Growth Strategy', desc: 'Data-driven roadmaps for sustainable scaling.' },
  { title: 'Workshops & Sprints', desc: 'Rapid ideation and prototyping sessions with your team.' },
];

export default function ServiceDetail({ service, onBack }: ServiceDetailProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.sd-hero-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.sd-hero-desc', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
      gsap.from('.sd-hero-meta', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 });
      gsap.from('.sd-section', { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.8 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-all font-sans"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sm text-white/50">{service.num}</span>
              <div className="w-12 h-[1px]" style={{ backgroundColor: service.accent }} />
            </div>
            <h1 className="sd-hero-title font-display text-4xl sm:text-5xl md:text-7xl text-white leading-[0.95]">
              {service.title}
            </h1>
            <p className="sd-hero-desc text-white/70 text-lg md:text-xl mt-6 max-w-2xl font-sans leading-relaxed">
              {service.description}
            </p>
            <div className="sd-hero-meta flex flex-wrap gap-6 mt-8">
              {['Strategy', 'Execution', 'Optimization'].map((tag) => (
                <span key={tag} className="text-xs font-semibold tracking-wider uppercase text-white/50 font-sans border border-white/10 px-4 py-2 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-sans" style={{ color: service.accent }}>Overview</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] leading-tight">
              What's included in<br />this service
            </h2>
          </div>
          <div className="space-y-6">
            {[
              'Comprehensive research and discovery phase',
              'Strategic roadmap and milestone planning',
              'Iterative design with stakeholder reviews',
              'Full-stack development and integration',
              'Quality assurance and performance testing',
              'Launch support and post-launch optimization',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: `${service.accent}15` }}>
                  <span className="text-xs font-bold font-mono" style={{ color: service.accent }}>{i + 1}</span>
                </div>
                <p className="text-gray-600 text-base font-sans leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-sans" style={{ color: service.accent }}>Our Process</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] leading-tight mb-16">
            How we deliver results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { phase: 'Discovery', desc: 'Deep dive into your business, users, and market landscape to uncover the right opportunities.' },
              { phase: 'Creation', desc: 'Iterative design and engineering sprints with continuous feedback loops and quality gates.' },
              { phase: 'Delivery', desc: 'Launch, measure, optimize. We stay engaged to ensure sustained performance and growth.' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-black/5">
                <span className="font-mono text-xs font-bold" style={{ color: service.accent }}>Phase {String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl text-[#1a1a1a] mt-3 mb-4">{step.phase}</h3>
                <p className="text-gray-500 text-sm font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-4 font-sans">Related</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] leading-tight mb-12">
            Explore more services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_SERVICES.map((rel, i) => (
              <div key={i} className="group bg-[#f5f5f5] rounded-3xl p-6 hover:bg-[#1a1a1a] transition-colors duration-500 cursor-pointer">
                <h3 className="font-display text-xl text-[#1a1a1a] group-hover:text-white transition-colors">{rel.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-400 text-sm mt-3 font-sans leading-relaxed transition-colors">{rel.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] group-hover:text-white transition-colors font-sans">
                  Learn more <ArrowUpRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-[#0f0f11] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6 font-sans" style={{ color: service.accent }}>Ready to start?</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-tight italic">
            Let's build something<br />remarkable together.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button className="bg-[#108a93] hover:bg-[#0d7a82] text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-sans">
              Get in Touch
            </button>
            <button
              onClick={onBack}
              className="border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:bg-white/5 font-sans"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
