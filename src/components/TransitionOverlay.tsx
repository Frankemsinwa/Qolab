import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { gsap } from 'gsap';

export interface TransitionHandle {
  zoomIn: (data: { image: string; accent: string; rect: DOMRect }) => Promise<void>;
}

interface OverlayState {
  visible: boolean;
  image: string;
  accent: string;
  rect: DOMRect | null;
}

const TransitionOverlay = forwardRef<TransitionHandle>(function TransitionOverlay(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<OverlayState>({
    visible: false,
    image: '',
    accent: '',
    rect: null,
  });
  const resolveRef = useRef<((value: void) => void) | null>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: (data) => {
      return new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        setState({
          visible: true,
          image: data.image,
          accent: data.accent,
          rect: data.rect,
        });
      });
    },
  }));

  useEffect(() => {
    if (!state.visible || !state.rect || !imageRef.current || !containerRef.current) return;

    const imgEl = imageRef.current;
    const ctn = containerRef.current;
    const rect = state.rect;

    gsap.set(ctn, { display: 'flex' });
    gsap.set(imgEl, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius: '1.5rem',
      opacity: 1,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade the overlay out to reveal the page underneath
        gsap.to(ctn, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            if (resolveRef.current) resolveRef.current();
            setState({ visible: false, image: '', accent: '', rect: null });
            gsap.set(ctn, { display: 'none', opacity: 1 });
          },
        });
      },
    });

    tl.to(imgEl, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      duration: 0.8,
      ease: 'power3.inOut',
    });
  }, [state]);

  if (!state.visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ display: 'none' }}
    >
      <div
        ref={imageRef}
        className="absolute overflow-hidden"
        style={{ backgroundColor: state.accent }}
      >
        <img
          src={state.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
});

export default TransitionOverlay;
