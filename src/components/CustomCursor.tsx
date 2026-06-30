/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  cursorType: 'default' | 'hover' | 'magnetic' | 'drag' | 'view' | 'play' | 'sound';
  cursorText?: string;
  darkMode: boolean;
}

export default function CustomCursor({ cursorType, cursorText, darkMode }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  const pos = useRef({ x: 0, y: 0 }); // Current coordinates
  const target = useRef({ x: 0, y: 0 }); // Target mouse coordinates
  const [isVisible, setIsVisible] = useState(false);

  // Particle trails structure
  interface TrailPoint {
    x: number;
    y: number;
    alpha: number;
    size: number;
  }
  const trails = useRef<TrailPoint[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Add a point for particle trail
      if (Math.random() > 0.4) {
        trails.current.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 1.0,
          size: Math.random() * 2.5 + 1.0,
        });
        if (trails.current.length > 25) {
          trails.current.shift();
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Handle spring animation loops
  useEffect(() => {
    let animId: number;

    const render = () => {
      // 1. Spring physics for cursor core
      const ease = 0.14; // spring damping
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        // Double delay for the trailing rings
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // 2. Render particle trail on the canvas
      const canvas = trailCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Render each trailing particle
          trails.current.forEach((t, index) => {
            t.alpha -= 0.04; // decay rate
            t.size *= 0.95; // shrinking size

            if (t.alpha > 0) {
              ctx.beginPath();
              ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
              
              // Color based on theme and hover state
              if (cursorType === 'view' || cursorType === 'drag' || cursorType === 'play') {
                ctx.fillStyle = `rgba(225, 29, 72, ${t.alpha})`; // Rose spark
              } else {
                ctx.fillStyle = darkMode 
                  ? `rgba(255, 255, 255, ${t.alpha * 0.3})` 
                  : `rgba(7, 7, 8, ${t.alpha * 0.25})`;
              }
              ctx.fill();
            }
          });

          // Filter out expired trails
          trails.current = trails.current.filter((t) => t.alpha > 0);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cursorType, darkMode]);

  // Handle resizing of the trailing canvas to fullscreen
  useEffect(() => {
    const handleResize = () => {
      const canvas = trailCanvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  // Custom morphing sizes and layouts based on states
  const getCursorStyles = () => {
    switch (cursorType) {
      case 'hover':
        return {
          core: 'w-4 h-4 bg-accent-rose',
          ring: 'w-10 h-10 border-2 border-accent-rose bg-accent-rose/10 scale-125',
        };
      case 'view':
        return {
          core: 'w-24 h-24 bg-accent-rose/95 text-white',
          ring: 'w-26 h-26 border border-accent-rose/30 scale-110',
        };
      case 'drag':
        return {
          core: 'w-20 h-20 bg-accent-violet text-white font-medium',
          ring: 'w-22 h-22 border border-accent-violet/30 scale-105',
        };
      case 'play':
      case 'sound':
        return {
          core: 'w-20 h-20 bg-accent-lime text-black font-semibold',
          ring: 'w-22 h-22 border border-accent-lime/30 scale-110',
        };
      case 'magnetic':
        return {
          core: 'w-2 h-2 bg-accent-rose',
          ring: 'w-12 h-12 border border-accent-rose/80 bg-accent-rose/5 scale-125',
        };
      default:
        return {
          core: darkMode ? 'w-2.5 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-bg-dark',
          ring: darkMode ? 'w-7 h-7 border border-white/20' : 'w-7 h-7 border border-bg-dark/20',
        };
    }
  };

  const classes = getCursorStyles();

  return (
    <>
      {/* Absolute Overlay Trail Canvas */}
      <canvas
        ref={trailCanvasRef}
        id="cursor-trailing-sparks"
        className="fixed inset-0 w-full h-full pointer-events-none z-[9997]"
      />

      {/* Lagging Ring Wrapper */}
      <div
        ref={ringRef}
        id="cursor-ring"
        className={`fixed top-0 left-0 -ml-3.5 -mt-3.5 pointer-events-none z-[9998] rounded-full transition-all duration-300 ease-out flex items-center justify-center ${classes.ring}`}
        style={{ willChange: 'transform' }}
      />

      {/* Direct Interpolated Core with custom texts */}
      <div
        ref={cursorRef}
        id="cursor-dot"
        className={`fixed top-0 left-0 -ml-1.5 -mt-1.5 pointer-events-none z-[9999] rounded-full flex flex-col items-center justify-center text-[9px] tracking-wider uppercase select-none transition-all duration-300 ease-out text-center shadow-lg leading-none ${classes.core}`}
        style={{ willChange: 'transform' }}
      >
        {cursorText && (cursorType === 'view' || cursorType === 'drag' || cursorType === 'play') && (
          <span className="font-mono font-bold animate-fade-in px-2 block">{cursorText}</span>
        )}
      </div>
    </>
  );
}
