import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 24;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 24;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;
      grid.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    let rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px),
          radial-gradient(circle at 0 0, rgba(0,0,0,0.3) 2px, transparent 2px)
        `,
        backgroundSize: '60px 60px, 60px 60px, 60px 60px',
        backgroundPosition: '0 0, 0 0, 0 0',
      }}
    />
  );
}
