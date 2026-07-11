import { useEffect, useRef, useCallback, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [state, setState] = useState<'default' | 'hover' | 'view' | 'magnetic'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  interface Trail { x: number; y: number; alpha: number; size: number; color: string; }
  const trails = useRef<Trail[]>([]);
  const isHovering = useRef(false);

  const getAccentColor = useCallback(() => {
    const el = document.elementFromPoint(pos.current.x, pos.current.y);
    if (!el) return 'rgba(16,138,147,1)';
    const section = el.closest('section, [class*="bg-[#0f0f11]"], [class*="bg-[#1a1a1a]"]');
    if (section) return 'rgba(255,255,255,0.9)';
    return 'rgba(16,138,147,1)';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const color = getAccentColor();
      if (Math.random() > 0.5) {
        trails.current.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          alpha: 0.6,
          size: Math.random() * 2.5 + 0.8,
          color,
        });
        if (trails.current.length > 30) trails.current.shift();
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [getAccentColor, isVisible]);

  // Hover detection
  useEffect(() => {
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor], .project-card, [data-project-card]').forEach((el) => {
        if ((el as HTMLElement)._cursorBound) return;
        (el as HTMLElement)._cursorBound = true;

        el.addEventListener('mouseenter', () => {
          isHovering.current = true;
          const text = el.getAttribute('data-cursor-text') || '';
          const type = el.getAttribute('data-cursor') || 'hover';
          setState(type as any);
          setCursorText(text);
        });
        el.addEventListener('mouseleave', () => {
          isHovering.current = false;
          setState('default');
          setCursorText('');
        });
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    let animId: number;
    const render = () => {
      // Dot spring
      const ease = 0.18;
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;

      // Ring spring (slower, trailing)
      const ringEase = 0.08;
      ringPos.current.x += (target.current.x - ringPos.current.x) * ringEase;
      ringPos.current.y += (target.current.y - ringPos.current.y) * ringEase;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      // Canvas trails
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          trails.current.forEach((t) => {
            t.alpha -= 0.025;
            t.size *= 0.97;
            if (t.alpha > 0) {
              ctx.beginPath();
              ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
              ctx.fillStyle = t.color.replace(/[\d.]+\)$/, `${t.alpha})`);
              ctx.fill();
            }
          });
          trails.current = trails.current.filter((t) => t.alpha > 0);
        }
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Canvas resize
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (state) {
      case 'hover':
        return {
          dot: 'w-3 h-3 bg-[#108a93] mix-blend-difference',
          ring: 'w-12 h-12 border-2 border-[#108a93]/60',
        };
      case 'view':
        return {
          dot: 'w-20 h-20 bg-[#108a93] text-white rounded-2xl',
          ring: 'w-24 h-24 border border-[#108a93]/30 rounded-2xl',
        };
      case 'magnetic':
        return {
          dot: 'w-2 h-2 bg-[#108a93]',
          ring: 'w-16 h-16 border border-[#108a93]/50',
        };
      default:
        return {
          dot: 'w-2 h-2 bg-[#1a1a1a]',
          ring: 'w-8 h-8 border border-[#1a1a1a]/15',
        };
    }
  };

  const s = getStyles();

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] rounded-full transition-[width,height,border,background-color] duration-300 ease-out ${s.ring}`}
      />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[10000] rounded-full flex items-center justify-center transition-[width,height,background-color,border-radius] duration-300 ease-out ${s.dot}`}
      >
        {cursorText && (
          <span className="text-[9px] font-bold tracking-widest uppercase select-none animate-fade-in px-1">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}

declare global {
  interface HTMLElement {
    _cursorBound?: boolean;
  }
}
