import { useEffect, useRef } from 'react';

/**
 * Animated shimmer overlay for the hero light-curtain background.
 * Draws slow-breathing radial blooms + faint vertical scan lines
 * with `mix-blend-mode: screen` so the still image feels alive.
 * Renders one static frame under prefers-reduced-motion.
 */
export default function AuroraBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let w = 0;
    let h = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pre-seeded bloom positions so motion feels organic, not random
    const blooms = [
      { x: 0.18, y: 0.30, r: 0.34, speed: 0.00023, phase: 0.0, strength: 0.34 },
      { x: 0.38, y: 0.68, r: 0.28, speed: 0.00017, phase: 2.1, strength: 0.26 },
      { x: 0.08, y: 0.75, r: 0.24, speed: 0.00031, phase: 4.2, strength: 0.22 },
      { x: 0.62, y: 0.25, r: 0.20, speed: 0.00019, phase: 1.3, strength: 0.16 },
      { x: 0.88, y: 0.72, r: 0.22, speed: 0.00025, phase: 3.4, strength: 0.14 },
    ];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Breathing blooms
      for (const b of blooms) {
        const pulse = 0.65 + 0.35 * Math.sin(t * b.speed + b.phase);
        const radius = b.r * Math.min(w, h) * (0.9 + 0.15 * pulse);
        const cx = b.x * w + Math.sin(t * b.speed * 0.6 + b.phase) * w * 0.02;
        const cy = b.y * h + Math.cos(t * b.speed * 0.5 + b.phase) * h * 0.03;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const a = b.strength * pulse;
        grad.addColorStop(0, `rgba(120, 255, 90, ${a})`);
        grad.addColorStop(0.4, `rgba(60, 200, 60, ${a * 0.45})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      }

      // Faint vertical scan shimmer drifting sideways
      const spacing = 14;
      const offset = (t * 0.012) % spacing;
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#9dff70';
      for (let x = -spacing; x < w + spacing; x += spacing) {
        const flicker = 0.5 + 0.5 * Math.sin(t * 0.001 + x * 0.08);
        ctx.globalAlpha = 0.03 + flicker * 0.04;
        ctx.fillRect(x + offset, 0, 1, h);
      }
      ctx.globalAlpha = 1;

      if (!reduced) animId = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(12000); // one representative frame
    } else {
      animId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
    />
  );
}
