import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';

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

  const services = [
    {
      title: 'Brand Identity',
      description: 'Visual identity systems, logos, brand guidelines, and strategic positioning that make your business memorable and distinct.',
    },
    {
      title: 'UI/UX Design',
      description: 'User research, wireframing, prototyping, and high-fidelity interfaces that delight users and drive conversions.',
    },
    {
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern frameworks, optimized for performance and scalability.',
    },
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications with fluid interactions and polished user experiences.',
    },
    {
      title: 'Motion Design',
      description: 'Animated interfaces, micro-interactions, and visual storytelling that bring your digital products to life.',
    },
    {
      title: 'Digital Strategy',
      description: 'Product thinking, growth consulting, and technical architecture to ensure your digital investments pay off.',
    },
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#faf7f2] pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-black/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#108a93] hover:text-[#159da8] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
          Our Services
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="service-reveal font-display italic text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] mb-8">
          What we do.
        </h1>
        <p className="service-reveal font-sans text-lg sm:text-xl text-gray-600 max-w-2xl mb-20 leading-relaxed">
          We offer end-to-end creative and technology services — from initial strategy through to
          launch and beyond. Every engagement is tailored to your unique goals.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <div
              key={i}
              className="service-reveal bg-white/50 rounded-[2rem] p-8 sm:p-10 border border-black/5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#108a93]/10 flex items-center justify-center mb-6">
                <span className="font-display italic text-[#108a93] text-xl">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display italic text-2xl text-black mb-4">{service.title}</h3>
              <p className="font-sans text-gray-600 leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-24">
          <h2 className="service-reveal font-display italic text-3xl sm:text-4xl text-black mb-12">How we work.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We learn your business, goals, and audience deeply before touching a single pixel.' },
              { step: '02', title: 'Strategy', description: 'We define the approach, architecture, and roadmap for your project.' },
              { step: '03', title: 'Execute', description: 'Design and engineering happen in parallel, with constant feedback loops.' },
              { step: '04', title: 'Launch', description: 'We ship, measure, iterate, and support — your success is our success.' },
            ].map((item, i) => (
              <div key={i} className="service-reveal">
                <span className="font-mono text-xs text-[#108a93] font-bold tracking-widest">{item.step}</span>
                <h3 className="font-display italic text-xl text-black mt-2 mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="service-reveal bg-[#108a93] rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center">
          <h2 className="font-display italic text-3xl sm:text-5xl text-white mb-6">Ready to start?</h2>
          <p className="font-sans text-white/80 max-w-lg mx-auto mb-8">
            Let's discuss your project and see how we can help bring your vision to life.
          </p>
          <button
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-3 bg-white text-[#108a93] font-semibold py-4 px-10 rounded-full hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Get in touch</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
