import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '../types';

import brandStrategyImg from '../assets/services/Brand strategy.jpg';
import productDesignImg from '../assets/services/Product-design.jpg';
import motionDesignImg from '../assets/services/Motion design.jpg';
import digitalMarketingImg from '../assets/services/digital- marketing.jpg';
import experientialImg from '../assets/services/Experiential.jpg';
import seoImg from '../assets/services/seo.jpg';

gsap.registerPlugin(ScrollTrigger);

const SERVICES: Service[] = [
  { id: 'brand-strategy', num: '01', title: 'Brand Strategy & Identity', shortTitle: 'Brand Strategy', description: 'We craft distinctive brand identities that resonate with your audience and stand apart in the market. From naming to full visual systems.', image: brandStrategyImg, accent: '#e11d48' },
  { id: 'product-design', num: '02', title: 'Product & UX Design', shortTitle: 'Product Design', description: 'Human-centered interfaces designed with precision, tested with rigor, and built for delight across web and mobile platforms.', image: productDesignImg, accent: '#8b5cf6' },
  { id: 'web-development', num: '03', title: 'Web Development & Engineering', shortTitle: 'Web Dev', description: 'Performant, scalable web applications built with modern architecture, clean code, and sub-second load times.', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', accent: '#10b981' },
  { id: 'mobile-apps', num: '04', title: 'Mobile App Development', shortTitle: 'Mobile Apps', description: 'Native and cross-platform mobile applications with fluid gesture physics, ambient interactions, and buttery 120fps performance.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', accent: '#f59e0b' },
  { id: 'motion-interaction', num: '05', title: 'Motion & Interaction Design', shortTitle: 'Motion Design', description: 'Fluid animations, micro-interactions, and scroll-driven experiences that bring digital products to life with cinematic quality.', image: motionDesignImg, accent: '#ec4899' },
  { id: 'digital-marketing', num: '06', title: 'Digital Marketing & Growth', shortTitle: 'Digital Marketing', description: 'Data-driven campaigns, SEO, paid media, and conversion optimization that drive measurable business growth and ROI.', image: digitalMarketingImg, accent: '#06b6d4' },
  { id: 'physical-marketing', num: '07', title: 'Physical & Experiential Marketing', shortTitle: 'Experiential', description: 'Event activations, pop-up experiences, billboard campaigns, and physical brand touchpoints that create lasting impressions.', image: experientialImg, accent: '#f97316' },
  { id: 'content-creation', num: '08', title: 'Content Creation & Production', shortTitle: 'Content', description: 'Photography, videography, copywriting, and editorial content that tells your brand story with craft and authenticity.', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80', accent: '#a855f7' },
  { id: 'seo-analytics', num: '09', title: 'SEO & Analytics Intelligence', shortTitle: 'SEO & Analytics', description: 'Technical SEO, performance auditing, and analytics infrastructure that puts your product in front of the right audience.', image: seoImg, accent: '#14b8a6' },
  { id: 'ai-integration', num: '10', title: 'AI & Machine Learning Integration', shortTitle: 'AI Integration', description: 'Custom AI pipelines, LLM integrations, and intelligent automation that transform how your business operates and serves users.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', accent: '#6366f1' },
];

interface ServicesCarouselProps {
  onSelectService: (service: Service) => void;
}

export default function ServicesCarousel({ onSelectService }: ServicesCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;

      const tl = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.round(progress * (SERVICES.length - 1));
            setActiveIndex(idx);
          },
        },
      });

      // Animate cards as they enter the center
      gsap.utils.toArray('.service-card').forEach((card: any) => {
        gsap.fromTo(card, { opacity: 0.4, scale: 0.85 }, {
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: 'left 80%',
            end: 'left 40%',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = useCallback((service: Service) => {
    onSelectService(service);
  }, [onSelectService]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden bg-[#0f0f11]"
        id="services"
        style={{ zIndex: 100 }}
      >
        {/* Section header */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 lg:px-16 pt-10">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#108a93] mb-3 font-sans">What We Do</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                Services built for<br />ambitious brands
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-white/40 text-sm font-sans font-mono">{String(activeIndex + 1).padStart(2, '0')}</span>
              <div className="w-24 h-[2px] bg-white/10 relative rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#108a93] rounded-full transition-all duration-300"
                  style={{ width: `${((activeIndex + 1) / SERVICES.length) * 100}%` }}
                />
              </div>
              <span className="text-white/40 text-sm font-sans font-mono">{String(SERVICES.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* 3D Carousel track */}
        <div className="absolute inset-0 flex items-center" style={{ perspective: '1200px' }}>
          <div
            ref={trackRef}
            className="flex items-center gap-8 pl-[50vw] pr-[30vw] h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {SERVICES.map((service, i) => {
              const offset = i - activeIndex;
              const absOffset = Math.abs(offset);
              const rotateY = offset * -8;
              const translateZ = Math.max(0, 200 - absOffset * 80);
              const cardOpacity = Math.max(0.3, 1 - absOffset * 0.2);

              return (
                <div
                  key={service.id}
                  className="service-card flex-shrink-0 cursor-pointer group"
                  data-service-id={service.id}
                  style={{
                    width: 'clamp(280px, 22vw, 380px)',
                    transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                    opacity: cardOpacity,
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleCardClick(service)}
                >
                  {/* Card image */}
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{
                        transform: hoveredIndex === i ? 'scale(1.08)' : 'scale(1)',
                      }}
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Accent glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 80%, ${service.accent}, transparent 70%)` }}
                    />

                    {/* Arrow icon on hover */}
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                  </div>

                  {/* Card text */}
                  <div className="mt-5 px-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-white/30">{service.num}</span>
                      <div
                        className="h-[1px] flex-grow transition-all duration-500"
                        style={{
                          backgroundColor: hoveredIndex === i ? service.accent : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    </div>
                    <h3
                      className="font-display text-xl sm:text-2xl transition-colors duration-300"
                      style={{ color: hoveredIndex === i ? service.accent : 'white' }}
                    >
                      {service.shortTitle}
                    </h3>
                    <p className="text-white/40 text-sm mt-2 font-sans leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom progress dots */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {SERVICES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? '24px' : '6px',
                height: '6px',
                backgroundColor: activeIndex === i ? '#108a93' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
