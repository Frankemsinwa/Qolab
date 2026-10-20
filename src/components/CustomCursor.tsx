import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [state, setState] = useState<'default' | 'hover' | 'view' | 'magnetic'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const isHovering = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
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
  }, [isVisible]);

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
      // Arrow snaps instantly to the exact cursor position (Figma-style precision)
      pos.current.x = target.current.x;
      pos.current.y = target.current.y;

      // Ring spring (slower, trailing) — contextual hover feedback
      const ringEase = 0.14;
      ringPos.current.x += (target.current.x - ringPos.current.x) * ringEase;
      ringPos.current.y += (target.current.y - ringPos.current.y) * ringEase;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (state) {
      case 'hover':
        return {
          dot: 'w-3 h-3',
          ring: 'w-10 h-10 border border-[#3a863f]/60 bg-[#3a863f]/10',
        };
      case 'view':
        return {
          dot: 'w-3 h-3',
          ring: 'w-14 h-14 border border-[#3a863f]/50 bg-[#3a863f]/15',
        };
      case 'magnetic':
        return {
          dot: 'w-3 h-3',
          ring: 'w-12 h-12 border border-[#3a863f]/45 bg-[#3a863f]/10',
        };
      default:
        return {
          dot: 'w-3 h-3',
          ring: 'w-0 h-0 border-transparent bg-transparent',
        };
    }
  };

  const s = getStyles();

  return (
    <>
      {/* Trailing ring — contextual hover feedback */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] rounded-full transition-[width,height,border,background-color] duration-300 ease-out ${s.ring}`}
      />
      {/* Figma-style arrow pointer — no offset, snaps to exact pixel */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] transition-[width,height] duration-200 ease-out"
        style={{ width: '20px', height: '20px' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))' }}
        >
          <path
            d="M3 2.5 L3 16.5 L7.2 12.7 L9.6 18.2 L12 17.2 L9.6 11.8 L15.4 11.6 Z"
            fill="#111111"
            stroke="#ffffff"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
        {/* Contextual label bubble (Figma-style) */}
        {cursorText && state !== 'default' && (
          <span
            className="absolute top-5 left-4 whitespace-nowrap rounded-md bg-[#111111] text-white text-[10px] font-semibold tracking-wide px-2 py-1 shadow-lg select-none pointer-events-none"
            style={{ fontFamily: '"Instrument Sans", system-ui, sans-serif' }}
          >
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
