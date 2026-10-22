import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { servicesData } from '../data';

interface ServicesPageProps {
  onBack: () => void;
  onNavigateToContact?: () => void;
}

export default function ServicesPage({ onBack, onNavigateToContact }: ServicesPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.service-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const services = servicesData;

  return (
    <div ref={containerRef} className="w-full pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#6ee05a] hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
          Our Services
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="service-reveal font-display font-normal tracking-tight text-5xl sm:text-7xl md:text-8xl text-white leading-[0.9] mb-8">
          What we do.
        </h1>
        <p className="service-reveal font-sans text-lg sm:text-xl text-gray-400 max-w-2xl mb-20 leading-relaxed">
          We offer end-to-end creative and technology services — from initial strategy through to
          launch and beyond. Every engagement is tailored to your unique goals.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <div
              key={i}
              className="service-reveal lime-card bg-white/[0.03] rounded-[2rem] p-8 sm:p-10 border border-white/10 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#6ee05a]/10 flex items-center justify-center mb-6">
                <span className="font-display text-[#6ee05a] text-xl">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display font-normal tracking-tight text-2xl text-white mb-4">{service.title}</h3>
              <p className="font-sans text-gray-400 leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-24">
          <h2 className="service-reveal font-display font-normal tracking-tight text-3xl sm:text-4xl text-white mb-12">How we work.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Question Everything', description: 'Understand the challenge and uncover the real problem.' },
              { step: '02', title: 'Find the Angle', description: 'Define the direction, priorities, and plan.' },
              { step: '03', title: 'Make It Real', description: 'Design, develop, experiment, and build.' },
              { step: '04', title: 'Make It Better', description: 'Test, refine, and improve the solution.' },
              { step: "05", title: "Keep What's Next in Mind", description: 'Identify future opportunities and room to evolve.' },
            ].map((item, i) => (
              <div key={i} className="service-reveal">
                <span className="font-mono text-xs text-[#6ee05a] font-bold tracking-widest">{item.step}</span>
                <h3 className="font-display font-normal tracking-tight text-xl text-white mt-2 mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="service-reveal bg-[#0f0f11] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center">
          <h2 className="font-display text-3xl sm:text-5xl text-white mb-6">Ready to start?</h2>
          <p className="font-sans text-white/80 max-w-lg mx-auto mb-8">
            Let's discuss your project and see how we can help bring your vision to life.
          </p>
          <button
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-3 lime-grad font-display font-semibold py-4 px-10 rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Let's Make It Exist.</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
