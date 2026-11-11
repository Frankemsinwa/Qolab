import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '../types';
import { servicesData } from '../data';

gsap.registerPlugin(ScrollTrigger);

interface ServicesCarouselProps {
  onSelectService: (service: Service) => void;
}

export default function ServicesCarousel({ onSelectService }: ServicesCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          refreshPriority: 5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (servicesData.length - 1));
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
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
        className="relative w-full h-screen overflow-hidden bg-[#0f0f11] z-20"
        id="services"
      >
        {/* Section header */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 lg:px-16 pt-10">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#3a863f] mb-3 font-display">What We Do</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-white/40 text-sm font-sans font-mono">{String(activeIndex + 1).padStart(2, '0')}</span>
              <div className="w-24 h-[2px] bg-white/10 relative rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#3a863f] rounded-full transition-all duration-300"
                  style={{ width: `${((activeIndex + 1) / servicesData.length) * 100}%` }}
                />
              </div>
              <span className="text-white/40 text-sm font-sans font-mono">{String(servicesData.length).padStart(2, '0')}</span>
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
            {servicesData.map((service, i) => {
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
                    <p className="text-white/40 text-sm mt-2 font-sans leading-relaxed line-clamp-3 group-hover:text-white/60 transition-colors duration-300">
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
          {servicesData.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? '24px' : '6px',
                height: '6px',
                backgroundColor: activeIndex === i ? '#3a863f' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
