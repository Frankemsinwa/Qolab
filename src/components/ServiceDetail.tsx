import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Service } from '../types';
import { servicesData } from '../data';
import QolabLogo from './QolabLogo';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
  onNavigateToContact?: () => void;
}

const getRelatedServices = (currentId: string): { title: string; desc: string }[] =>
  servicesData.filter((s) => s.id !== currentId).slice(0, 4).map((s) => ({ title: s.title, desc: s.description }));

const SERVICE_CONTENT: Record<string, { overview: string[]; process: { phase: string; desc: string }[] }> = {
  'brand-identity-design': {
    overview: [
      'Brand strategy and positioning that clarifies who you are and who you serve',
      'Visual identity — logo, colour, typography, and art direction',
      'Brand guidelines and a digital asset kit your team can actually use',
      'Naming and messaging support where the brand needs words',
      'Application across web, social, and print touchpoints',
      'Design reviews that keep the system consistent as you grow',
    ],
    process: [
      { phase: 'Position', desc: 'We define where your brand sits, who it speaks to, and what it stands for.' },
      { phase: 'Design', desc: 'Identity, guidelines, and assets come together into one coherent system.' },
      { phase: 'Rollout', desc: 'We apply the identity across your touchpoints and equip your team to keep it consistent.' },
    ],
  },
  'web-app-development': {
    overview: [
      'Business websites and e-commerce storefronts built to convert, not just to look good',
      'Web and mobile applications shaped around how your business actually works',
      'Custom software and product discovery: scope, architecture, and roadmap',
      'Responsive design with performance, accessibility, and SEO foundations built in',
      'Integrations with the tools and services you already use',
      'Testing, launch support, and a path for future releases',
    ],
    process: [
      { phase: 'Plan', desc: 'We map pages, content, scope, and goals — from site architecture to product roadmap — before design begins.' },
      { phase: 'Design & Build', desc: 'Interface and engineering move together in short cycles, with working demos and previews at every step.' },
      { phase: 'Launch & Evolve', desc: 'Testing, performance tuning, and handover — then post-launch iterations driven by real usage.' },
    ],
  },
  'ai-solutions-automation': {
    overview: [
      'An opportunity audit: where AI and automation actually pay off',
      'AI-enabled features embedded into your product or workflow',
      'Intelligent workflows that reduce manual, repetitive work',
      'Assistants, search, and content tools built on modern AI',
      'Data plumbing and integrations that make AI useful in practice',
      'Guardrails, testing, and monitoring so it stays reliable',
    ],
    process: [
      { phase: 'Audit', desc: 'We find the workflows and features where AI creates real leverage.' },
      { phase: 'Prototype', desc: 'A working proof-of-value is built, tested, and refined with your team.' },
      { phase: 'Operate', desc: 'Monitoring, tuning, and guardrails keep the system reliable in production.' },
    ],
  },
  'growth-strategy': {
    overview: [
      'Business analysis: where you are, what is working, what is not',
      'Brand positioning and messaging that sharpen your market fit',
      'Marketing strategy and channel planning around real goals',
      'Campaign concepting and execution across your chosen channels',
      'Opportunity identification and growth planning with clear priorities',
      'Measurement setup and reviews so you know what is working',
    ],
    process: [
      { phase: 'Analyse', desc: 'A clear read of your business, market, and current bottlenecks.' },
      { phase: 'Position & Plan', desc: 'Sharpen the message, choose channels, and set priorities around real goals.' },
      { phase: 'Grow', desc: 'Launch campaigns, measure performance, and move budget to what is actually performing.' },
    ],
  },
};

const GENERIC_CONTENT = {
  overview: [
    'Discovery phase to understand your goals, audience, and constraints',
    'Strategic direction with clear priorities and milestones',
    'Iterative design with stakeholder reviews',
    'Build, integration, and quality assurance',
    'Launch support and post-launch optimisation',
    'A clear path for what comes next',
  ],
  process: [
    { phase: 'Discovery', desc: 'Deep dive into your business, users, and market to uncover the right opportunities.' },
    { phase: 'Creation', desc: 'Iterative design and engineering sprints with continuous feedback loops.' },
    { phase: 'Delivery', desc: 'Launch, measure, optimise — we stay engaged to ensure sustained results.' },
  ],
};

export default function ServiceDetail({ service, onBack, onNavigateToContact }: ServiceDetailProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = SERVICE_CONTENT[service.id] ?? GENERIC_CONTENT;
  const relatedServices = getRelatedServices(service.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.sd-hero-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.sd-hero-desc', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
      gsap.from('.sd-hero-meta', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 });
      gsap.from('.sd-section', { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.8 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full min-h-screen bg-[#0a0d0c] text-gray-300">
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

        {/* Brand Logo - top right */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 bg-[#0f0f11] rounded-full px-5 py-2.5 border border-white/10 shadow-md">
          <QolabLogo className="w-20 md:w-24" />
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sm text-white/50">{service.num}</span>
              <div className="w-12 h-[1px]" style={{ backgroundColor: '#6ee05a' }} />
            </div>
            <h1 className="sd-hero-title font-display font-normal tracking-tight text-4xl sm:text-5xl md:text-7xl text-white leading-[0.95]">
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
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-sans" style={{ color: '#6ee05a' }}>Overview</p>
            <h2 className="font-display font-normal tracking-tight text-3xl sm:text-4xl text-white leading-tight">
              What's included in<br />this service
            </h2>
          </div>
          <div className="space-y-6">
            {content.overview.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: '#6ee05a15' }}>
                  <span className="text-xs font-bold font-mono" style={{ color: '#6ee05a' }}>{i + 1}</span>
                </div>
                <p className="text-gray-400 text-base font-sans leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-sans" style={{ color: '#6ee05a' }}>Our Process</p>
          <h2 className="font-display font-normal tracking-tight text-3xl sm:text-4xl text-white leading-tight mb-16">
            How we deliver results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.process.map((step, i) => (
              <div key={i} className="lime-card bg-white/[0.03] rounded-[2rem] p-8 border border-white/10">
                <span className="font-mono text-xs font-bold" style={{ color: '#6ee05a' }}>Phase {String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display font-normal tracking-tight text-2xl text-white mt-3 mb-4">{step.phase}</h3>
                <p className="text-gray-400 text-sm font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="sd-section w-full py-20 md:py-28 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-4 font-sans">Related</p>
          <h2 className="font-display font-normal tracking-tight text-3xl sm:text-4xl text-white leading-tight mb-12">
            Explore more services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((rel, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 hover:border-[#6ee05a]/50 transition-colors duration-500 cursor-pointer">
                <h3 className="font-display font-normal tracking-tight text-xl text-white transition-colors">{rel.title}</h3>
                <p className="text-gray-400 text-sm mt-3 font-sans leading-relaxed transition-colors">{rel.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white transition-colors font-sans">
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6 font-sans" style={{ color: '#6ee05a' }}>Ready to start?</p>
          <h2 className="font-display font-normal tracking-tight text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            The Future Is Not a<br />Spectator Sport.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button
              onClick={onNavigateToContact}
              className="bg-[#3a863f] hover:bg-[#2f6d33] text-white font-semibold py-4 px-10 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-sans"
            >
              Let's Make It Exist.
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
