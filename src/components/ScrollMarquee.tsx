import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Giant text band that slides horizontally as you scroll past it (scrubbed).
 * Duplicated row + xPercent -50 for a seamless loop.
 */
export default function ScrollMarquee({ words }: { words: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {words.map((word, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight whitespace-nowrap px-6 md:px-10">
            {word}
          </span>
          <span className="text-[#6ee05a] text-3xl md:text-5xl select-none">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative overflow-hidden py-10 md:py-14 bg-[#0a0d0c] border-t border-white/10 select-none"
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
