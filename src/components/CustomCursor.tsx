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
  const [enabled, setEnabled] = useState(true);

  const isPressed = useRef(false);
  const magneticEls = useRef<Set<HTMLElement>>(new Set());

  // Disable on reduced-motion or coarse pointers — native cursor takes over
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const update = () => setEnabled(!rm.matches && !coarse.matches);
    update();
    rm.addEventListener('change', update);
    coarse.addEventListener('change', update);
    return () => {
      rm.removeEventListener('change', update);
      coarse.removeEventListener('change', update);
    };
  }, []);

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

  // Press feedback
  useEffect(() => {
    const down = () => { isPressed.current = true; };
    const up = () => { isPressed.current = false; };
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  // Hover + magnetic binding
  useEffect(() => {
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor], .project-card, [data-project-card]').forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl._cursorBound) return;
        htmlEl._cursorBound = true;

        htmlEl.addEventListener('mouseenter', () => {
          const text = htmlEl.getAttribute('data-cursor-text') || '';
          const type = htmlEl.getAttribute('data-cursor') || 'hover';
          setState(type as any);
          setCursorText(text);
          if (type === 'magnetic') magneticEls.current.add(htmlEl);
        });
        htmlEl.addEventListener('mouseleave', () => {
          setState('default');
          setCursorText('');
          magneticEls.current.delete(htmlEl);
          htmlEl.style.transform = '';
        });
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      magneticEls.current.forEach((el) => { el.style.transform = ''; });
      magneticEls.current.clear();
    };
  }, []);

  // Animation loop — dot snaps, glass ring springs and rotates, magnetic pull
  useEffect(() => {
    if (!enabled) return;
    let animId: number;
    let rotation = 0;

    const render = () => {
      pos.current.x = target.current.x;
      pos.current.y = target.current.y;

      const ringEase = 0.14;
      const dx = target.current.x - ringPos.current.x;
      const dy = target.current.y - ringPos.current.y;
      ringPos.current.x += dx * ringEase;
      ringPos.current.y += dy * ringEase;

      // Ring spins gently with movement speed — glass feels alive
      rotation += Math.hypot(dx, dy) * 0.25;

      // Magnetic pull for CTA buttons
      magneticEls.current.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(target.current.x - cx, target.current.y - cy);
        const radius = Math.max(r.width, r.height) / 2 + 80;
        if (dist < radius) {
          const pull = (1 - dist / radius) * 0.35;
          el.style.transform = `translate3d(${(target.current.x - cx) * pull}px, ${(target.current.y - cy) * pull}px, 0)`;
        } else if (el.style.transform) {
          el.style.transform = '';
        }
      });

      const dotScale = isPressed.current ? 0.75 : 1;
      const ringScale = isPressed.current ? 0.9 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) rotate(${rotation}deg) scale(${ringScale})`;
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  const getStyles = () => {
    switch (state) {
      case 'hover':
        return { ring: 'w-12 h-12 border border-[#3a863f]/60 bg-white/5 backdrop-blur-md' };
      case 'view':
        return { ring: 'w-28 h-28 border border-[#3a863f]/50 bg-white/5 backdrop-blur-md' };
      case 'magnetic':
        return { ring: 'w-16 h-16 border border-[#6ee05a]/70 bg-[#3a863f]/15 backdrop-blur-md' };
      default:
        return { ring: 'w-0 h-0 border-transparent bg-transparent' };
    }
  };

  const s = getStyles();

  return (
    <>
      {/* Glass ring — spring-lagged, spins with movement */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,border,background-color] duration-300 ease-out ${s.ring}`}
      >
        {state === 'view' && cursorText && (
          <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6ee05a] select-none">
            {cursorText}
          </span>
        )}
      </div>

      {/* Neon green core dot — instant, glowing */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-2 h-2 rounded-full bg-[#6ee05a]"
        style={{ boxShadow: '0 0 10px rgba(110, 224, 90, 0.9), 0 0 28px rgba(110, 224, 90, 0.4)' }}
      >
        {/* Side label bubble for non-view contextual text */}
        {cursorText && state !== 'view' && state !== 'default' && (
          <span className="absolute top-4 left-4 whitespace-nowrap rounded-md bg-[#111111]/90 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide px-2 py-1 shadow-lg select-none font-display">
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
