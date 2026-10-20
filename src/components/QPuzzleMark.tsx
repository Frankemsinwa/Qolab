import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface QPuzzleMarkProps {
  className?: string;
  ringColor?: string;
  tailColor?: string;
}

export default function QPuzzleMark({ className = '', ringColor = '#1a1a1a', tailColor = '#3a863f' }: QPuzzleMarkProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGPathElement>(null);
  const tailRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = rootRef.current;
    const ring = ringRef.current;
    const tail = tailRef.current;
    if (!root || !ring || !tail) return;

    gsap.set([ring, tail], { opacity: 0 });
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline();
      tl.fromTo(ring,
        { scale: 0.7, rotate: -35, opacity: 0, transformOrigin: '58px 58px' },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      ).fromTo(tail,
        { x: 26, y: 26, rotate: 50, opacity: 0, transformOrigin: '78px 70px' },
        { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.45'
      );
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && play()),
      { threshold: 0.4 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Q ring — arc with a gap at the bottom-right for the puzzle tail */}
        <path
          ref={ringRef}
          d="M77.5 85.85 A34 34 0 1 1 87.4 41"
          stroke={ringColor}
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Green puzzle-piece tail */}
        <g ref={tailRef} transform="translate(70 55) rotate(35)">
          <rect x="0" y="0" width="21" height="30" rx="6" fill={tailColor} />
          <circle cx="0" cy="15" r="6.5" fill={tailColor} />
        </g>
      </svg>
    </div>
  );
}
